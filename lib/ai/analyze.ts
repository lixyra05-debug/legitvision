import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";
import { getAuthenticationPrompt } from "./authentication-prompts";
import { calculateWeightedScore } from "./scoring";
import type { AuthenticationPoint, Confidence, Verdict } from "@/lib/types";

function getAnthropicClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ── Types ──

export interface ImageInput {
  buffer: Buffer;
  filename: string;
  photoType: string;
  label: string;
}

export interface AnalysisAIResult {
  overall_score: number;
  confidence_level: string;
  verdict: string;
  sub_scores: Record<string, number>;
  findings: Array<{
    zone: string;
    observation: string;
    score: number;
    severity: "critical" | "important" | "minor";
  }>;
  missing_evidence: string[];
  ocr_extracted: Record<string, string>;
  recommendations: string[];
  analyst_summary: string;
}

export interface AnalysisOutput {
  overallScore: number;
  confidence: Confidence;
  verdict: Verdict;
  subScores: Record<string, number>;
  findings: Array<{
    zone: string;
    observation: string;
    score: number;
    severity: string;
  }>;
  aiRawResponse: AnalysisAIResult;
}

// ── Image preprocessing ──

export async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1568, 1568, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
}

// ── Main analysis function ──

export async function runAnalysis({
  images,
  brandName,
  modelName,
  category,
  authenticationPoints,
  variantSelected,
  collabSelected,
  specificAuthPoints,
}: {
  images: ImageInput[];
  brandName: string;
  modelName: string;
  category: string;
  authenticationPoints: AuthenticationPoint[];
  variantSelected?: string | null;
  collabSelected?: string | null;
  specificAuthPoints?: string[] | null;
}): Promise<AnalysisOutput> {
  // Preprocess all images
  const processedImages = await Promise.all(
    images.map(async (img) => ({
      ...img,
      buffer: await preprocessImage(img.buffer),
    }))
  );

  // Build photo descriptions for the prompt
  const photoDescriptions = processedImages.map(
    (img) => `${img.label} (${img.photoType})`
  );

  // Build specialized prompts for this brand + model
  const { systemPrompt, userPrompt } = getAuthenticationPrompt(
    brandName,
    modelName,
    category,
    authenticationPoints,
    photoDescriptions,
    variantSelected,
    collabSelected,
    specificAuthPoints,
  );

  // Build content blocks: images first, then text
  const content: Anthropic.Messages.ContentBlockParam[] = [];

  for (const img of processedImages) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/jpeg", // preprocessImage() converts all images to JPEG
        data: img.buffer.toString("base64"),
      },
    });
  }

  content.push({
    type: "text",
    text: userPrompt,
  });

  // Call Claude Vision API
  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  // Extract text response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AnalysisError(
      "Aucune réponse textuelle de l'API Vision.",
      "NO_RESPONSE"
    );
  }

  // Parse JSON — handle possible markdown wrapping
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }

  let aiResult: AnalysisAIResult;
  try {
    aiResult = JSON.parse(jsonStr);
  } catch {
    throw new AnalysisError(
      "L'IA a retourné un format de réponse invalide.",
      "PARSE_ERROR"
    );
  }

  // Calculate weighted score using model's authentication_points
  const { overallScore, confidence, verdict } = calculateWeightedScore({
    subScores: aiResult.sub_scores ?? {},
    authenticationPoints,
  });

  return {
    overallScore,
    confidence,
    verdict,
    subScores: aiResult.sub_scores ?? {},
    findings: aiResult.findings ?? [],
    aiRawResponse: aiResult,
  };
}

// ── Error handling ──

export class AnalysisError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AnalysisError";
    this.code = code;
  }
}

export function handleAnalysisError(
  error: unknown
): { message: string; code: string } {
  if (error instanceof AnalysisError) {
    return { message: error.message, code: error.code };
  }

  const err = error as { status?: number; message?: string };

  if (err.status === 429) {
    return {
      message:
        "Service temporairement surchargé. Réessayez dans quelques secondes.",
      code: "RATE_LIMITED",
    };
  }

  if (err.status === 400) {
    return {
      message:
        "Une ou plusieurs photos sont invalides. Vérifiez le format et la taille.",
      code: "BAD_REQUEST",
    };
  }

  return {
    message: "Erreur inattendue lors de l'analyse.",
    code: "UNKNOWN",
  };
}
