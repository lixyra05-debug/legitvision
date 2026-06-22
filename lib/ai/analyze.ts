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
  confidence_level: "high" | "medium" | "low" | "insufficient";
  verdict: "likely_authentic" | "likely_fake" | "inconclusive";
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
  insufficient: boolean;
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

export async function preprocessImage(buffer: Buffer, filename?: string): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(1568, 1568, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
  } catch (err) {
    console.error(`[preprocessImage] Failed to process image${filename ? ` "${filename}"` : ""}:`, err);
    throw new AnalysisError(
      `Impossible de traiter l'image${filename ? ` "${filename}"` : ""}. Format non supporté ou fichier corrompu.`,
      "IMAGE_PROCESSING_ERROR"
    );
  }
}

// ── Validation SERVEUR des photos (ne pas faire confiance au client) ──

const ALLOWED_IMAGE_FORMATS = ["jpeg", "png", "webp"];
const MIN_PHOTO_DIMENSION = 800;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 Mo

/** Erreur de validation de photo → mappée en HTTP 400 par la route (pas de débit). */
export class PhotoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhotoValidationError";
  }
}

/**
 * Valide une photo côté serveur AVANT tout appel à l'IA :
 *  - format RÉEL via sharp (pas l'extension) ∈ {jpeg, png, webp}
 *  - résolution minimale 800×800
 *  - taille maximale 10 Mo
 * Retourne une raison claire et actionnable si invalide.
 */
export async function validateImageBuffer(
  buffer: Buffer,
  label: string,
): Promise<{ valid: true } | { valid: false; reason: string }> {
  if (buffer.length > MAX_PHOTO_BYTES) {
    return {
      valid: false,
      reason: `La photo "${label}" dépasse la taille maximale de 10 Mo.`,
    };
  }

  let meta: sharp.Metadata;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return {
      valid: false,
      reason: `La photo "${label}" est illisible ou n'est pas une image.`,
    };
  }

  if (!meta.format || !ALLOWED_IMAGE_FORMATS.includes(meta.format)) {
    return {
      valid: false,
      reason: `La photo "${label}" a un format non supporté (JPEG, PNG ou WebP requis).`,
    };
  }

  if (
    !meta.width ||
    !meta.height ||
    meta.width < MIN_PHOTO_DIMENSION ||
    meta.height < MIN_PHOTO_DIMENSION
  ) {
    return {
      valid: false,
      reason: `La photo "${label}" est trop petite (résolution minimale 800×800 px).`,
    };
  }

  return { valid: true };
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
    images.map(async (img) => {
      return {
        ...img,
        buffer: await preprocessImage(img.buffer, img.filename),
      };
    })
  );

  // Warn if any image is too large for Anthropic after preprocessing (~5 MB base64 limit)
  for (const img of processedImages) {
    const base64Size = Math.ceil((img.buffer.length * 4) / 3);
    if (base64Size > 5 * 1024 * 1024) {
      console.error(
        `[runAnalysis] Image "${img.filename}" too large after preprocessing: ${img.buffer.length} bytes (base64: ~${base64Size} bytes)`
      );
    }
  }

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
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  // M2: Détecter une réponse tronquée par limite de tokens (JSON probablement invalide)
  if (response.stop_reason === "max_tokens") {
    throw new AnalysisError(
      "Réponse IA tronquée (limite de tokens atteinte). Réessayez avec moins de photos.",
      "MAX_TOKENS"
    );
  }

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

  // M1: Validation des champs requis (un JSON valide mais incomplet = erreur)
  if (
    typeof aiResult.overall_score !== "number" ||
    !aiResult.sub_scores ||
    typeof aiResult.sub_scores !== "object" ||
    !aiResult.verdict ||
    !aiResult.confidence_level
  ) {
    throw new AnalysisError(
      "Réponse IA incomplète (champs requis manquants).",
      "INVALID_RESPONSE"
    );
  }

  // Calculate weighted score using model's authentication_points + AI confidence (P1-3)
  const { overallScore, confidence, verdict, insufficient } = calculateWeightedScore({
    subScores: aiResult.sub_scores ?? {},
    authenticationPoints,
    aiConfidenceLevel: aiResult.confidence_level,
  });

  return {
    overallScore,
    confidence,
    verdict,
    insufficient,
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
    console.error(`[handleAnalysisError] AnalysisError [${error.code}]:`, error.message);
    return { message: error.message, code: error.code };
  }

  const err = error as { status?: number; message?: string; error?: unknown };
  console.error("[handleAnalysisError] Unexpected error:", {
    status: err.status,
    message: err.message,
    error: err.error,
    raw: error,
  });

  if (err.status === 429) {
    return {
      message:
        "Service temporairement surchargé. Réessayez dans quelques secondes.",
      code: "RATE_LIMITED",
    };
  }

  if (err.status === 400) {
    console.error("[handleAnalysisError] Anthropic 400 — likely image too large or invalid format");
    return {
      message:
        "Une ou plusieurs photos sont invalides. Vérifiez le format (JPEG/PNG/WebP) et la taille (max 10 MB).",
      code: "BAD_REQUEST",
    };
  }

  return {
    message: "Erreur inattendue lors de l'analyse.",
    code: "UNKNOWN",
  };
}
