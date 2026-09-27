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
import { analysisModelDeadline, ANALYSIS_MAX_SECONDS } from "@/lib/analysis-limits";
import { releaseReservedCredit } from "@/lib/credit-release";
import { isOwnPhotoPath } from "@/lib/photo-path";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import type { Brand, Model, PhotoSlot } from "@/lib/types";
import { catalogProblem, unknownPhotoTypes } from "@/lib/launch-check";
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

const CONTACT_EMAIL = "legitvision.contact@gmail.com";

// Aucune nouvelle tentative de remboursement dans les dernières secondes avant
// la coupure de la plateforme (ANALYSIS_MAX_SECONDS).
const REFUND_STOP_BEFORE_END_SECONDS = 5;

// Attente avant de chercher la ligne « usage » d'une réservation dont la
// réponse s'est perdue : une requête encore en cours côté base a le temps
// d'aboutir (verrou sur le profil tenu par un autre débit, quelques ms).
const RESERVATION_SETTLE_MS = 1000;

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

  // 6b. Ce que le navigateur a choisi doit sortir du catalogue
  //     (lib/launch-check.ts) : modèle analysable, de cette ligne de marque et
  //     de cette catégorie ; variante et collab connues du modèle. Elles
  //     entrent dans le prompt et au début du résumé du rapport. Couvre aussi
  //     une page ouverte avant un changement du catalogue. Avant tout claim :
  //     aucun changement de statut, aucun crédit débité.
  const problem = catalogProblem({
    brand,
    model,
    category: analysis.category,
    variant: variantSelected,
    collab: collabSelected,
  });
  if (problem) {
    console.warn("[analyze] lancement refusé :", problem.reason, { analysisId });
    return NextResponse.json(
      {
        error:
          problem.kind === "catalog"
            ? "Ce modèle n'est pas encore pris en charge par l'analyse. Choisissez-en un autre."
            : "La variante ou l'édition choisie n'existe pas pour ce modèle : lancez une nouvelle analyse. Aucun crédit n'a été décompté.",
      },
      { status: problem.kind === "catalog" ? 422 : 400 }
    );
  }

  // 7. Fetch analysis photos. Filtrées aussi par propriétaire, en plus de la
  //    base (migration 018 : une photo n'est acceptée que pour une analyse de
  //    son auteur, dans son dossier).
  const { data: photos } = await admin
    .from("analysis_photos")
    .select("*")
    .eq("analysis_id", analysisId)
    .eq("user_id", user.id)
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

  // 7b. Chemin de stockage : écrit par le navigateur, donc à vérifier
  //     (lib/photo-path.ts). La route télécharge avec la clé serveur : un chemin
  //     hors du dossier de CETTE analyse ferait analyser (et décrire dans le
  //     rapport) la photo d'un autre.
  //     Emplacement : un de ceux du protocole de la ligne de marque, dont le
  //     libellé part dans le prompt (jamais le texte brut du navigateur).
  if (
    photos.some((p) => !isOwnPhotoPath(p.storage_path, user.id, analysisId)) ||
    unknownPhotoTypes(brand.photo_protocol, photos.map((p) => p.photo_type)).length > 0
  ) {
    return NextResponse.json(
      { error: "Une photo de cette analyse est invalide : lancez une nouvelle analyse. Aucun crédit n'a été décompté." },
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

  // 9. Download photos from Supabase Storage, et validation SERVEUR du contenu
  //    réel du bucket. AVANT la réservation du crédit : une photo refusée ne
  //    réserve (et ne rend) rien.
  let images: ImageInput[];
  try {
    images = await Promise.all(
      photos.map(async (photo) => {
        const { data, error } = await admin.storage
          .from("analysis-photos")
          .download(photo.storage_path);

        if (error || !data) {
          // M3: pas de leak du storage_path interne dans le message
          throw new Error("Impossible de télécharger une photo. Réessayez.");
        }

        const protocol = brand.photo_protocol as PhotoSlot[];
        const slot = protocol.find((s) => (s.name ?? (s as { type?: string }).type) === photo.photo_type);
        const label = slot?.label ?? photo.photo_type;
        const buffer = Buffer.from(await data.arrayBuffer());

        // B : format/résolution/taille. Ne pas faire confiance à la
        //     validation client (PhotoUploader).
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
  } catch (error) {
    await admin
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId)
      .eq("status", "analyzing");
    if (error instanceof PhotoValidationError) {
      return NextResponse.json(
        { error: `${error.message} Remplacez-la, puis relancez l'analyse : aucun crédit n'a été décompté.` },
        { status: 400 }
      );
    }
    console.error("[analyze] photos illisibles :", error);
    return NextResponse.json(
      { error: "Impossible de télécharger une photo. Aucun crédit n'a été décompté : relancez l'analyse." },
      { status: 500 }
    );
  }

  // 10. RÉSERVATION du crédit AVANT l'appel au modèle (course au débit, 27/09).
  //     decrement_credits_atomic (UPDATE conditionnel « ≥ 1 » et ligne « usage »
  //     dans la même transaction) sert de verrou : deux analyses lancées
  //     ensemble avec un seul crédit, une seule passe, l'autre reçoit 402 sans
  //     rien consommer. Le contrôle de l'étape 4b n'est qu'un raccourci.
  //     Le crédit est rendu (releaseReservedCredit) si les photos sont jugées
  //     insuffisantes ou si l'analyse échoue : la règle des CGU est tenue.
  //     La description porte un identifiant de lancement : elle désigne la
  //     ligne « usage » de CETTE requête (et non d'un lancement antérieur de la
  //     même analyse).
  const reservation = `Analyse ${analysisId} (lancement ${crypto.randomUUID()})`;
  const launch: Launch = { userId: user.id, analysisId, reservation };
  const refundDeadline =
    requestStartedAt + (ANALYSIS_MAX_SECONDS - REFUND_STOP_BEFORE_END_SECONDS) * 1000;
  const { error: reserveError } = await admin.rpc("decrement_credits_atomic", {
    p_user_id: user.id,
    p_analysis_id: analysisId,
    p_description: reservation,
  });
  if (reserveError) {
    await admin
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId)
      .eq("status", "analyzing");
    if (/INSUFFICIENT_CREDITS/.test(reserveError.message)) {
      return NextResponse.json(
        { error: "Crédits insuffisants. Rechargez votre compte pour continuer." },
        { status: 402 }
      );
    }
    console.error("[analyze] réservation du crédit en erreur :", reserveError.message);
    return NextResponse.json(
      { error: await releaseLostReservation(admin, launch, refundDeadline) },
      { status: 503 }
    );
  }

  // Tout ce qui peut échouer après la réservation du crédit est dans ce try :
  // son catch écrit l'échec, REND le crédit réservé, et ne dit « aucun crédit
  // décompté » que si le remboursement a réussi.
  let result: AnalysisOutput;
  let finalStatus: "completed" | "expert_review";
  try {
    // 11. Run AI analysis
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

    // 12. Determine if expert review is needed
    // P1-3 : "insufficient" ne déclenche PAS de revue expert (un expert ne corrige
    // pas des photos illisibles) → status restera "completed", et crédit rendu.
    const needsExpertReview =
      !result.insufficient &&
      ((result.overallScore >= 40 && result.overallScore <= 60) ||
        result.confidence === "low");

    finalStatus = needsExpertReview ? "expert_review" : "completed";

    // 13. Save results — CONDITIONNEL : seulement si l'analyse est encore
    //     « analyzing ». Si la reprise des analyses bloquées
    //     (lib/analysis-stale.ts) l'a classée « failed » entre-temps, rien
    //     n'est enregistré, et le catch rend le crédit.
    //     Photos insuffisantes : l'analyse n'est pas décomptée, donc rien de
    //     ce que le modèle a dit n'est gardé, hormis ce que le rapport affiche
    //     (le motif et les éléments manquants). Le reste serait lisible par
    //     l'API sans avoir été payé.
    const { data: saved, error: saveError } = await admin
      .from("analyses")
      .update(
        result.insufficient
          ? {
              status: finalStatus,
              overall_score: null,
              confidence: result.confidence,
              verdict: result.verdict,
              sub_scores: null,
              findings: null,
              ai_raw_response: {
                confidence_level: "insufficient",
                missing_evidence: result.aiRawResponse.missing_evidence ?? [],
              },
            }
          : {
              status: finalStatus,
              overall_score: result.overallScore,
              confidence: result.confidence,
              verdict: result.verdict,
              sub_scores: result.subScores,
              findings: result.findings,
              ai_raw_response: result.aiRawResponse,
            }
      )
      .eq("id", analysisId)
      .eq("status", "analyzing")
      .select("id");

    // Rapport non enregistré : le catch marque l'analyse « failed » et rend le
    // crédit réservé. Les CGU le promettent : une erreur technique qui empêche
    // de produire le rapport n'est pas décomptée.
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
    const issue = await closeFailedAnalysis(admin, analysisId);

    // L'écriture du rapport a abouti malgré l'erreur reçue (réponse perdue) :
    // le rapport est là, le client est envoyé vers lui. Rapport complet : il
    // est dû. Photos insuffisantes : non décompté, le crédit est rendu.
    if (issue === "report") {
      await markReservation(admin, launch, "rapport enregistré");
      return NextResponse.json({ success: true, analysisId });
    }
    if (issue === "report_insufficient") {
      await refundLaunch(admin, launch, "photos insuffisantes", refundDeadline);
      return NextResponse.json({ success: true, analysisId });
    }

    // Le crédit réservé par CETTE requête est rendu ; les messages de
    // handleAnalysisError ne disent « aucun crédit décompté » qu'ensuite.
    const rendu =
      issue === "failed" && (await refundLaunch(admin, launch, "échec de l'analyse", refundDeadline));
    if (!rendu) {
      if (issue === "unknown") {
        console.error("[analyze] issue inconnue après un échec : rapport et solde à vérifier", { analysisId });
        await markReservation(admin, launch, "issue inconnue : vérifier le rapport et le solde");
      }
      return NextResponse.json(
        {
          error:
            issue === "unknown"
              ? `Une erreur technique empêche de confirmer l'issue de l'analyse. Ouvrez-la depuis votre tableau de bord dans quelques minutes : si aucun rapport n'y figure et qu'un crédit manque à votre solde, écrivez-nous à ${CONTACT_EMAIL}, nous le rendrons.`
              : `L'analyse n'a pas abouti et le crédit réservé n'a pas pu vous être rendu automatiquement. Écrivez-nous à ${CONTACT_EMAIL} : nous le rendrons.`,
          code: "REFUND_PENDING",
        },
        { status: 500 }
      );
    }

    const { message, code } = handleAnalysisError(error);
    return NextResponse.json({ error: message, code }, { status: 500 });
  }

  // 14. Rapport enregistré. P1-3 : si l'IA juge les photos insuffisantes
  //     (résultat non exploitable), le crédit réservé est rendu : le client
  //     n'a pas eu de résultat utilisable. Sinon, la ligne « usage » est
  //     marquée : le crédit a servi à un rapport enregistré.
  if (result.insufficient) {
    await refundLaunch(admin, launch, "photos insuffisantes", refundDeadline);
  } else {
    await markReservation(admin, launch, "rapport enregistré");
  }

  return NextResponse.json({
    success: true,
    analysisId,
    overallScore: result.insufficient ? null : result.overallScore,
    confidence: result.confidence,
    verdict: result.verdict,
    status: finalStatus,
    insufficient: result.insufficient,
  });
}

type Admin = ReturnType<typeof createAdminClient>;

/** Un lancement : sa réservation est la description de sa ligne « usage ». */
type Launch = { userId: string; analysisId: string; reservation: string };

/**
 * Rend le crédit réservé par ce lancement. S'il n'est pas rendu, la ligne
 * « usage » le dit, pour le support : « crédit à rendre » (rien n'a été
 * écrit) ou « remboursement incertain » (l'écriture a pu passer : vérifier le
 * solde avant de rendre quoi que ce soit).
 * @returns true si le crédit est rendu.
 */
async function refundLaunch(admin: Admin, launch: Launch, motif: string, deadline: number): Promise<boolean> {
  const outcome = await releaseReservedCredit(admin, launch, motif, { deadline });
  if (outcome === "released") return true;
  console.error("[analyze] CRÉDIT NON RENDU : à vérifier à la main", {
    analysisId: launch.analysisId,
    motif,
    outcome,
  });
  await markReservation(
    admin,
    launch,
    outcome === "uncertain" ? "remboursement incertain : vérifier le solde" : "crédit à rendre"
  );
  return false;
}

/**
 * La réservation a renvoyé une erreur : elle a pu être validée quand même
 * (réponse perdue). La ligne « usage » de ce lancement le dit ; si elle existe,
 * le crédit est rendu. « Aucun crédit » n'est écrit que si c'est vrai.
 * @returns le message pour le client.
 */
async function releaseLostReservation(admin: Admin, launch: Launch, deadline: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, RESERVATION_SETTLE_MS));
  const { data: debit, error: readError } = await admin
    .from("credits_transactions")
    .select("id")
    .eq("analysis_id", launch.analysisId)
    .eq("type", "usage")
    .eq("description", launch.reservation)
    .limit(1);
  if (readError) {
    console.error("[analyze] réservation incertaine : crédit peut-être à rendre à la main", {
      analysisId: launch.analysisId,
    });
    await markReservation(admin, launch, "réservation incertaine : vérifier le solde");
    return `L'analyse n'a pas pu démarrer. Si un crédit manque à votre solde, écrivez-nous à ${CONTACT_EMAIL} : nous le rendrons.`;
  }
  if (debit && debit.length > 0 && !(await refundLaunch(admin, launch, "lancement interrompu", deadline))) {
    return `L'analyse n'a pas pu démarrer et le crédit réservé n'a pas pu vous être rendu automatiquement. Écrivez-nous à ${CONTACT_EMAIL} : nous le rendrons.`;
  }
  return "L'analyse n'a pas pu démarrer. Aucun crédit n'a été décompté : réessayez dans un instant.";
}

/**
 * Après un échec survenu une fois le crédit réservé : marque l'analyse
 * « failed » si elle est encore « analyzing », sinon relit son état.
 * - "failed" : aucun rapport enregistré, le crédit est à rendre ;
 * - "report" : un rapport complet est enregistré (l'écriture a abouti mais sa
 *   réponse s'est perdue) : il est dû, rien n'est rendu ;
 * - "report_insufficient" : idem, mais photos jugées insuffisantes : non
 *   décompté, le crédit est rendu ;
 * - "unknown" : la base ne répond pas, ou l'analyse est dans un état que
 *   cette requête n'explique pas (encore « analyzing », remise à lancer) :
 *   rien ne peut être affirmé, rien n'est rendu automatiquement.
 */
async function closeFailedAnalysis(
  admin: Admin,
  analysisId: string
): Promise<"failed" | "report" | "report_insufficient" | "unknown"> {
  const { data: marked, error: markError } = await admin
    .from("analyses")
    .update({ status: "failed" })
    .eq("id", analysisId)
    .eq("status", "analyzing")
    .select("id");
  if (!markError && marked && marked.length > 0) return "failed";

  const { data: current, error: readError } = await admin
    .from("analyses")
    .select("status, ai_raw_response")
    .eq("id", analysisId)
    .single();
  if (readError || !current) return "unknown";
  if (current.status === "failed") return "failed";
  if (current.status === "completed" || current.status === "expert_review") {
    const raw = current.ai_raw_response as { confidence_level?: string } | null;
    return raw?.confidence_level === "insufficient" ? "report_insufficient" : "report";
  }
  return "unknown";
}

/**
 * Complète la description de la ligne « usage » de ce lancement : trace pour
 * le support (« rapport enregistré », « crédit à rendre »…). Une réservation
 * sans mention ni remboursement vient d'une fonction coupée net : crédit à
 * rendre. Un échec ici ne change rien pour le client : journalisé seulement.
 */
async function markReservation(admin: Admin, launch: Launch, mention: string): Promise<void> {
  const { error } = await admin
    .from("credits_transactions")
    .update({ description: `${launch.reservation} — ${mention}` })
    .eq("analysis_id", launch.analysisId)
    .eq("type", "usage")
    .eq("description", launch.reservation);
  if (error) {
    console.error("[analyze] ligne « usage » non annotée", { analysisId: launch.analysisId, mention });
  }
}
