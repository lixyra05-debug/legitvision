import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  runAnalysis,
  AnalysisError,
  handleAnalysisError,
  validateImageBuffer,
  PhotoValidationError,
  ANALYSIS_TIMEOUT_MESSAGE,
  type ImageInput,
  type AnalysisOutput,
} from "@/lib/ai/analyze";
import { analysisModelDeadline } from "@/lib/analysis-limits";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import type { Brand, Model, PhotoSlot } from "@/lib/types";
import { hasAuthenticationPoints } from "@/lib/analyzable";
import { z } from "zod";

// Durée maximale de la fonction, en secondes. Next exige une valeur
// littérale : elle doit rester égale à ANALYSIS_MAX_SECONDS
// (lib/analysis-limits.ts) et à vercel.json, ce que vérifie
// tests/unit/analysis-limits.test.ts. L'appel au modèle s'arrête avant
// (analysisModelDeadline), pour que l'échec soit toujours écrit.
export const maxDuration = 300;

// Validation Zod du body (C). analysisId = UUID (table analyses.id UUID).
const analyzeBodySchema = z.object({
  analysisId: z.uuid(),
  variant_selected: z.string().max(120).nullish(),
  collab_selected: z.string().max(120).nullish(),
});

const MAX_PHOTOS = 15;

// Statuts d'une analyse à lancer : « pending » (photos envoyées, lancement
// demandé : check/new l'écrit juste avant d'appeler la route) et « uploading »
// (si cette écriture a échoué, le lancement reste possible).
const PROCESSABLE_STATUSES = ["pending", "uploading"];

export async function POST(request: NextRequest) {
  // Début de la requête : l'échéance de l'appel au modèle en découle.
  const requestStartedAt = Date.now();

  // 1. Verify auth via user client (reads cookies — does NOT bypass RLS)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Votre session a expiré : reconnectez-vous, puis relancez l'analyse. Aucun crédit n'a été décompté." },
      { status: 401 }
    );
  }

  // 1b. Rate-limit (A) : 10 analyses/min/user. Upstash borné et doublé d'un
  //     limiteur en mémoire (lib/rate-limit.ts) : jamais plus de quelques
  //     centaines de ms perdues ici.
  const rl = await rateLimit(`analyze:${user.id}`, 10, 60);
  if (!rl.success) return tooManyRequests(rl.reset);

  // 2. Guard: ANTHROPIC_API_KEY must be set. La cause (configuration du
  //    serveur) va au journal ; le client lit ce qui le concerne. Avant toute
  //    réservation : aucun crédit ne peut avoir été décompté.
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[analyze] ANTHROPIC_API_KEY absente de l'environnement : analyse refusée.");
    return NextResponse.json(
      { error: "Le service d'analyse est momentanément indisponible. Aucun crédit n'a été décompté : réessayez plus tard." },
      { status: 503 }
    );
  }

  // 3. Parse + validation Zod du body (C)
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = analyzeBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const analysisId = parsed.data.analysisId;
  const variantSelected = parsed.data.variant_selected ?? null;
  const collabSelected = parsed.data.collab_selected ?? null;

  // 4. Use admin client for all DB operations — bypasses RLS,
  //    ownership is enforced manually via .eq("user_id", user.id).
  const admin = createAdminClient();

  // 4b. Fetch profile — vérifier le plan et les crédits côté serveur
  const { data: profile } = await admin
    .from("profiles")
    .select("credits_remaining, subscription_plan")
    .eq("id", user.id)
    .single();

  // B-BIZ-2 : Business consomme aussi des crédits (50/mois). Plus de bypass.
  if (!profile || profile.credits_remaining < 1) {
    return NextResponse.json(
      { error: "Crédits insuffisants. Rechargez votre compte pour continuer." },
      { status: 402 }
    );
  }

  // 5. Fetch the analysis record (scoped to the authenticated user)
  const { data: analysis, error: analysisError } = await admin
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (analysisError || !analysis) {
    return NextResponse.json(
      { error: "Analyse introuvable" },
      { status: 404 }
    );
  }

  // « pending » ou « uploading » : voir PROCESSABLE_STATUSES. Une analyse
  // classée en échec (lib/analysis-stale.ts) n'est plus lancée.
  if (!PROCESSABLE_STATUSES.includes(analysis.status)) {
    return NextResponse.json(
      { error: "Cette analyse a déjà été traitée" },
      { status: 409 }
    );
  }

  // 5b. Guard anti-double-clic: refuser si une autre analyse est déjà en cours
  //     (status "analyzing" < 30s) pour cet utilisateur. Protège contre les
  //     doubles soumissions inter-analyses.
  const thirtySecondsAgo = new Date(Date.now() - 30_000).toISOString();
  const { data: inProgress } = await admin
    .from("analyses")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "analyzing")
    .gte("created_at", thirtySecondsAgo)
    .neq("id", analysisId)
    .limit(1);

  if (inProgress && inProgress.length > 0) {
    return NextResponse.json(
      { error: "Une analyse est déjà en cours. Veuillez patienter." },
      { status: 429 }
    );
  }

  // 6. Fetch brand and model
  const [{ data: brand }, { data: model }] = await Promise.all([
    admin
      .from("brands")
      .select("*")
      .eq("id", analysis.brand_id)
      .single<Brand>(),
    admin
      .from("models")
      .select("*")
      .eq("id", analysis.model_id)
      .single<Model>(),
  ]);

  if (!brand || !model) {
    return NextResponse.json(
      { error: "Marque ou modèle introuvable" },
      { status: 404 }
    );
  }

  // 6b. Un modèle sans point d'authentification n'est plus proposé à la
  //     sélection (lib/analyzable.ts). Ce garde couvre une page ouverte avant
  //     la mise en ligne ou une requête forgée. Avant tout claim : aucun
  //     changement de statut, aucun crédit débité.
  if (!hasAuthenticationPoints(model)) {
    return NextResponse.json(
      { error: "Ce modèle n'est pas encore pris en charge par l'analyse. Choisissez-en un autre." },
      { status: 422 }
    );
  }

  // 7. Fetch analysis photos
  const { data: photos } = await admin
    .from("analysis_photos")
    .select("*")
    .eq("analysis_id", analysisId)
    .order("order_index");

  if (!photos || photos.length === 0) {
    return NextResponse.json(
      { error: "Aucune photo trouvée pour cette analyse" },
      { status: 400 }
    );
  }

  // B : borne le nombre de photos AVANT tout claim / appel IA
  if (photos.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Trop de photos (maximum ${MAX_PHOTOS} par analyse).` },
      { status: 400 }
    );
  }

  // 8. Update ATOMIQUE status pending/uploading → analyzing. Si aucune ligne
  //    n'est retournée, un autre POST concurrent a déjà réservé l'analyse
  //    (double-clic sur la même analysisId) — on refuse pour éviter double débit.
  const { data: claimed } = await admin
    .from("analyses")
    .update({
      status: "analyzing",
      variant_selected: variantSelected,
      collab_selected: collabSelected,
    })
    .eq("id", analysisId)
    .in("status", PROCESSABLE_STATUSES)
    .select("id");

  // 409 : l'analyse n'est plus à lancer (réservée par une autre requête, ou
  // classée en échec entre-temps). Le client ouvre alors sa page, qui dit où
  // elle en est.
  if (!claimed || claimed.length === 0) {
    return NextResponse.json(
      { error: "Cette analyse a déjà été lancée ou n'est plus disponible." },
      { status: 409 }
    );
  }

  // Tout ce qui peut échouer AVANT le débit est dans ce try : son catch écrit
  // l'échec et répond « aucun crédit décompté », ce qui n'est vrai que parce
  // que le débit (étape 13) est hors du try, après l'enregistrement du rapport.
  let result: AnalysisOutput;
  let finalStatus: "completed" | "expert_review";
  try {
    // 9. Download photos from Supabase Storage
    const images: ImageInput[] = await Promise.all(
      photos.map(async (photo) => {
        const { data, error } = await admin.storage
          .from("analysis-photos")
          .download(photo.storage_path);

        if (error || !data) {
          // M3: pas de leak du storage_path interne dans le message
          throw new Error("Impossible de télécharger une photo. Réessayez.");
        }

        const protocol = brand.photo_protocol as PhotoSlot[];
        const slot = protocol.find((s) => s.name === photo.photo_type);
        const label = slot?.label ?? photo.photo_type;
        const buffer = Buffer.from(await data.arrayBuffer());

        // B : validation SERVEUR du contenu réel du bucket (format/résolution/taille).
        //     Ne pas faire confiance à la validation client (PhotoUploader).
        const check = await validateImageBuffer(buffer, label);
        if (!check.valid) throw new PhotoValidationError(check.reason);

        return {
          buffer,
          filename: photo.storage_path,
          photoType: photo.photo_type,
          label,
        };
      })
    );

    // 10. Run AI analysis
    result = await runAnalysis({
      images,
      brandName: brand.name,
      modelName: model.name,
      category: analysis.category,
      authenticationPoints: model.authentication_points,
      variantSelected,
      collabSelected,
      specificAuthPoints: model.specific_auth_points ?? null,
      deadline: analysisModelDeadline(requestStartedAt),
    });

    // 11. Determine if expert review is needed
    // P1-3 : "insufficient" ne déclenche PAS de revue expert (un expert ne corrige
    // pas des photos illisibles) → status restera "completed", et crédit non débité.
    const needsExpertReview =
      !result.insufficient &&
      ((result.overallScore >= 40 && result.overallScore <= 60) ||
        result.confidence === "low");

    finalStatus = needsExpertReview ? "expert_review" : "completed";

    // 12. Save results — CONDITIONNEL : seulement si l'analyse est encore
    //     « analyzing ». Si la reprise des analyses bloquées
    //     (lib/analysis-stale.ts) l'a classée « failed » entre-temps, le client
    //     a pu lire « aucun crédit décompté » : rien n'est enregistré ni débité.
    const { data: saved, error: saveError } = await admin
      .from("analyses")
      .update({
        status: finalStatus,
        overall_score: result.overallScore,
        confidence: result.confidence,
        verdict: result.verdict,
        sub_scores: result.subScores,
        findings: result.findings,
        ai_raw_response: result.aiRawResponse,
      })
      .eq("id", analysisId)
      .eq("status", "analyzing")
      .select("id");

    // Rapport non enregistré : rien n'est débité (le débit suit), et le catch
    // marque l'analyse « failed ». Les CGU le promettent : une erreur technique
    // qui empêche de produire le rapport n'est pas décomptée.
    if (saveError) {
      throw new AnalysisError(
        "Le rapport n'a pas pu être enregistré. Aucun crédit n'a été décompté : relancez l'analyse.",
        "SAVE_ERROR"
      );
    }
    if (!saved || saved.length === 0) {
      throw new AnalysisError(ANALYSIS_TIMEOUT_MESSAGE, "ANALYSIS_EXPIRED");
    }
  } catch (error) {
    console.error("[analyze] Error during analysis:", error);
    // Mark analysis as failed so it doesn't stay stuck. Conditionnel : un
    // rapport déjà enregistré (statut sorti de « analyzing ») n'est jamais
    // écrasé. Toute erreur arrivant ici précède le débit : aucun crédit n'a
    // été décompté, ce que disent les messages renvoyés.
    await admin
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId)
      .eq("status", "analyzing");

    // B : photos invalides → 400 message clair (aucun crédit débité : le débit
    // est en aval, sur le chemin succès uniquement).
    if (error instanceof PhotoValidationError) {
      return NextResponse.json(
        {
          error: `${error.message} Remplacez-la, puis relancez l'analyse : aucun crédit n'a été décompté.`,
        },
        { status: 400 }
      );
    }

    const { message, code } = handleAnalysisError(error);
    return NextResponse.json({ error: message, code }, { status: 500 });
  }

  // 13. Rapport enregistré (étape 12, conditionnelle). Déduire 1 crédit
  //     ATOMIQUEMENT via RPC (B-RACE — fix TOCTOU)
  //     La RPC fait UPDATE conditionnel + INSERT credits_transactions dans
  //     une seule transaction. Si crédits < 1 au moment du débit (race),
  //     l'erreur est loggée mais l'analyse réussit (l'user a payé Claude
  //     côté coût mais pas côté crédit — situation rare grâce aux guards).
  // P1-3 : si l'IA juge les photos insuffisantes (résultat non exploitable),
  // on NE débite PAS le crédit — le client n'a pas eu de résultat utilisable.
  if (!result.insufficient) {
    const { error: decrementError } = await admin.rpc(
      "decrement_credits_atomic",
      {
        p_user_id: user.id,
        p_analysis_id: analysisId,
        p_description: `Analyse ${analysisId}`,
      }
    );
    if (decrementError) {
      console.error(
        "[analyze] decrement_credits_atomic failed (race condition or insufficient credits):",
        decrementError.message
      );
    }
  }

  return NextResponse.json({
    success: true,
    analysisId,
    overallScore: result.overallScore,
    confidence: result.confidence,
    verdict: result.verdict,
    status: finalStatus,
    insufficient: result.insufficient,
  });
}
