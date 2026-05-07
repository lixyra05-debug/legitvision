import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  runAnalysis,
  handleAnalysisError,
  type ImageInput,
} from "@/lib/ai/analyze";
import type { Brand, Model, PhotoSlot } from "@/lib/types";

export const maxDuration = 60; // Vercel function timeout

// Statuses that indicate the analysis is ready to be processed
const PROCESSABLE_STATUSES = ["pending", "uploading"];

export async function POST(request: NextRequest) {
  // 1. Verify auth via user client (reads cookies — does NOT bypass RLS)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 2. Guard: ANTHROPIC_API_KEY must be set
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Clé API IA manquante. Vérifiez la configuration du serveur." },
      { status: 500 }
    );
  }

  // 3. Parse request body
  let analysisId: string;
  let variantSelected: string | null = null;
  let collabSelected: string | null = null;
  try {
    const body = await request.json();
    analysisId = body.analysisId;
    variantSelected = body.variant_selected ?? null;
    collabSelected = body.collab_selected ?? null;
    if (!analysisId) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "analysisId requis" },
      { status: 400 }
    );
  }

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

  // Accept both "pending" and "uploading" — the client-side status update
  // to "pending" can fail silently when RLS UPDATE policies are not configured.
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

  if (!claimed || claimed.length === 0) {
    return NextResponse.json(
      { error: "Une analyse est déjà en cours. Veuillez patienter." },
      { status: 429 }
    );
  }

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

        return {
          buffer: Buffer.from(await data.arrayBuffer()),
          filename: photo.storage_path,
          photoType: photo.photo_type,
          label: slot?.label ?? photo.photo_type,
        };
      })
    );

    // 10. Run AI analysis
    const result = await runAnalysis({
      images,
      brandName: brand.name,
      modelName: model.name,
      category: analysis.category,
      authenticationPoints: model.authentication_points,
      variantSelected,
      collabSelected,
      specificAuthPoints: model.specific_auth_points ?? null,
    });

    // 11. Determine if expert review is needed
    const needsExpertReview =
      (result.overallScore >= 40 && result.overallScore <= 60) ||
      result.confidence === "low";

    const finalStatus = needsExpertReview ? "expert_review" : "completed";

    // 12. Save results
    await admin
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
      .eq("id", analysisId);

    // 13. Déduire 1 crédit ATOMIQUEMENT via RPC (B-RACE — fix TOCTOU)
    //     La RPC fait UPDATE conditionnel + INSERT credits_transactions dans
    //     une seule transaction. Si crédits < 1 au moment du débit (race),
    //     l'erreur est loggée mais l'analyse réussit (l'user a payé Claude
    //     côté coût mais pas côté crédit — situation rare grâce aux guards).
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

    return NextResponse.json({
      success: true,
      analysisId,
      overallScore: result.overallScore,
      confidence: result.confidence,
      verdict: result.verdict,
      status: finalStatus,
    });
  } catch (error) {
    console.error("[analyze] Error during analysis:", error);
    // Mark analysis as failed so it doesn't stay stuck
    await admin
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId);

    const { message, code } = handleAnalysisError(error);
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}
