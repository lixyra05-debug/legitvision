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
  console.log("[analyze] POST /api/analyze — start");

  // 1. Verify auth via user client (reads cookies — does NOT bypass RLS)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("[analyze] Auth failed — no user");
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  console.log("[analyze] Authenticated user:", user.id);

  // 2. Guard: ANTHROPIC_API_KEY must be set
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("[analyze] ANTHROPIC_API_KEY is missing");
    return NextResponse.json(
      { error: "Clé API IA manquante. Vérifiez la configuration du serveur." },
      { status: 500 }
    );
  }

  // 3. Parse request body
  let analysisId: string;
  try {
    const body = await request.json();
    analysisId = body.analysisId;
    if (!analysisId) throw new Error();
  } catch {
    console.log("[analyze] Invalid request body — analysisId missing");
    return NextResponse.json(
      { error: "analysisId requis" },
      { status: 400 }
    );
  }
  console.log("[analyze] analysisId:", analysisId);

  // 4. Use admin client for all DB operations — bypasses RLS,
  //    ownership is enforced manually via .eq("user_id", user.id).
  const admin = createAdminClient();

  // 4b. Fetch profile — vérifier le plan et les crédits côté serveur
  const { data: profile } = await admin
    .from("profiles")
    .select("credits_remaining, subscription_plan")
    .eq("id", user.id)
    .single();

  const isBusinessPlan = profile?.subscription_plan === "business";

  if (!isBusinessPlan) {
    if (!profile || profile.credits_remaining < 1) {
      console.log("[analyze] Crédits insuffisants — user:", user.id);
      return NextResponse.json(
        { error: "Crédits insuffisants. Rechargez votre compte pour continuer." },
        { status: 402 }
      );
    }
  } else {
    console.log("[analyze] Plan Business — bypass credit check");
  }

  // 5. Fetch the analysis record (scoped to the authenticated user)
  const { data: analysis, error: analysisError } = await admin
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (analysisError || !analysis) {
    console.log("[analyze] Analysis not found:", analysisId, analysisError?.message);
    return NextResponse.json(
      { error: "Analyse introuvable" },
      { status: 404 }
    );
  }
  console.log("[analyze] Analysis found, status:", analysis.status);

  // Accept both "pending" and "uploading" — the client-side status update
  // to "pending" can fail silently when RLS UPDATE policies are not configured.
  if (!PROCESSABLE_STATUSES.includes(analysis.status)) {
    console.log("[analyze] Analysis already processed, status:", analysis.status);
    return NextResponse.json(
      { error: "Cette analyse a déjà été traitée" },
      { status: 409 }
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
    console.log("[analyze] Brand or model not found:", analysis.brand_id, analysis.model_id);
    return NextResponse.json(
      { error: "Marque ou modèle introuvable" },
      { status: 404 }
    );
  }
  console.log("[analyze] Brand:", brand.name, "— Model:", model.name);

  // 7. Fetch analysis photos
  const { data: photos } = await admin
    .from("analysis_photos")
    .select("*")
    .eq("analysis_id", analysisId)
    .order("order_index");

  if (!photos || photos.length === 0) {
    console.log("[analyze] No photos found for analysis:", analysisId);
    return NextResponse.json(
      { error: "Aucune photo trouvée pour cette analyse" },
      { status: 400 }
    );
  }
  console.log("[analyze] Photos found:", photos.length);

  // 8. Update status to analyzing
  console.log("[analyze] Updating status to 'analyzing'...");
  await admin
    .from("analyses")
    .update({ status: "analyzing" })
    .eq("id", analysisId);

  try {
    // 9. Download photos from Supabase Storage
    console.log("[analyze] Downloading photos from Storage...");
    const images: ImageInput[] = await Promise.all(
      photos.map(async (photo) => {
        const { data, error } = await admin.storage
          .from("analysis-photos")
          .download(photo.storage_path);

        if (error || !data) {
          throw new Error(
            `Impossible de télécharger la photo : ${photo.storage_path}`
          );
        }

        const protocol = brand.photo_protocol as PhotoSlot[];
        const slot = protocol.find((s) => s.type === photo.photo_type);

        return {
          buffer: Buffer.from(await data.arrayBuffer()),
          filename: photo.storage_path,
          photoType: photo.photo_type,
          label: slot?.label ?? photo.photo_type,
        };
      })
    );

    // 10. Run AI analysis
    console.log("[analyze] Calling Claude Vision API...");
    const result = await runAnalysis({
      images,
      brandName: brand.name,
      modelName: model.name,
      category: analysis.category,
      authenticationPoints: model.authentication_points,
    });

    console.log("[analyze] AI result — score:", result.overallScore, "confidence:", result.confidence, "verdict:", result.verdict);

    // 11. Determine if expert review is needed
    const needsExpertReview =
      (result.overallScore >= 40 && result.overallScore <= 60) ||
      result.confidence === "low";

    const finalStatus = needsExpertReview ? "expert_review" : "completed";

    console.log("[analyze] Final status:", finalStatus);

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

    // 13. Déduire 1 crédit (sauf plan Business)
    if (!isBusinessPlan && profile) {
      const newBalance = profile.credits_remaining - 1;
      await Promise.all([
        admin
          .from("profiles")
          .update({ credits_remaining: newBalance })
          .eq("id", user.id),
        admin.from("credits_transactions").insert({
          user_id: user.id,
          type: "usage",
          amount: -1,
          balance_after: newBalance,
          description: `Analyse ${analysisId}`,
          analysis_id: analysisId,
        }),
      ]);
      console.log("[analyze] Crédit déduit — nouveau solde:", newBalance);
    }

    console.log("[analyze] Done — returning success");
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
