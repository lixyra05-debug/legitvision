import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  runAnalysis,
  handleAnalysisError,
  type ImageInput,
} from "@/lib/ai/analyze";
import type { Brand, Model, PhotoSlot } from "@/lib/types";

export const maxDuration = 60; // Vercel function timeout

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // 1. Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 2. Parse request body
  let analysisId: string;
  try {
    const body = await request.json();
    analysisId = body.analysisId;
    if (!analysisId) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "analysisId requis" },
      { status: 400 }
    );
  }

  // 3. Fetch the analysis record
  const { data: analysis, error: analysisError } = await supabase
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

  if (analysis.status !== "pending") {
    return NextResponse.json(
      { error: "Cette analyse a déjà été traitée" },
      { status: 409 }
    );
  }

  // 4. Fetch brand and model
  const [{ data: brand }, { data: model }] = await Promise.all([
    supabase
      .from("brands")
      .select("*")
      .eq("id", analysis.brand_id)
      .single<Brand>(),
    supabase
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

  // 5. Fetch analysis photos
  const { data: photos } = await supabase
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

  // 6. Update status to analyzing
  await supabase
    .from("analyses")
    .update({ status: "analyzing" })
    .eq("id", analysisId);

  try {
    // 7. Download photos from Supabase Storage
    const images: ImageInput[] = await Promise.all(
      photos.map(async (photo) => {
        const { data, error } = await supabase.storage
          .from("analysis-photos")
          .download(photo.storage_path);

        if (error || !data) {
          throw new Error(
            `Impossible de télécharger la photo : ${photo.storage_path}`
          );
        }

        // Find label from protocol
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

    // 8. Run AI analysis
    const result = await runAnalysis({
      images,
      brandName: brand.name,
      modelName: model.name,
      category: analysis.category,
      authenticationPoints: model.authentication_points,
    });

    // 9. Determine if expert review is needed
    const needsExpertReview =
      (result.overallScore >= 40 && result.overallScore <= 60) ||
      result.confidence === "low";

    const finalStatus = needsExpertReview ? "expert_review" : "completed";

    // 10. Save results
    await supabase
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

    return NextResponse.json({
      success: true,
      analysisId,
      overallScore: result.overallScore,
      confidence: result.confidence,
      verdict: result.verdict,
      status: finalStatus,
    });
  } catch (error) {
    // Mark analysis as failed
    await supabase
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysisId);

    const { message, code } = handleAnalysisError(error);
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}
