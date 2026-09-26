import Anthropic from "@anthropic-ai/sdk";
import sharp, { type Metadata } from "sharp";
import { getAuthenticationPrompt } from "./authentication-prompts";
import { calculateWeightedScore } from "./scoring";
import type { AuthenticationPoint, Confidence, Verdict } from "@/lib/types";
import { runWithDeadline } from "@/lib/analysis-deadline";

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

export async function preprocessImage(buffer: Buffer, label?: string): Promise<Buffer> {
  try {
    return await sharp(buffer)
      // Redresse selon l'orientation EXIF : un téléphone enregistre souvent la
      // photo « couchée » avec une étiquette que le modèle ne lit pas.
      .rotate()
      .resize(1568, 1568, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
  } catch (err) {
    console.error(`[preprocessImage] Failed to process image${label ? ` "${label}"` : ""}:`, err);
    throw new AnalysisError(
      `Impossible de traiter la photo${label ? ` « ${label} »` : ""} : format non pris en charge ou fichier abîmé. Remplacez-la, puis relancez l'analyse : aucun crédit n'a été décompté.`,
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
      reason: `La photo « ${label} » dépasse la taille maximale de 10 Mo.`,
    };
  }

  // `Metadata` importe nommement plutot que via le namespace `sharp.` : a partir
  // de sharp 0.35 les types sont republies en dual ESM/CJS et l'entree ESM
  // (celle que resout moduleResolution "bundler") n'expose plus de namespace.
  let meta: Metadata;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return {
      valid: false,
      reason: `La photo « ${label} » est illisible ou n'est pas une image.`,
    };
  }

  if (!meta.format || !ALLOWED_IMAGE_FORMATS.includes(meta.format)) {
    return {
      valid: false,
      reason: `La photo « ${label} » a un format non pris en charge (JPEG, PNG ou WebP requis).`,
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
      reason: `La photo « ${label} » est trop petite (résolution minimale 800×800 px).`,
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
  deadline,
}: {
  images: ImageInput[];
  brandName: string;
  modelName: string;
  category: string;
  authenticationPoints: AuthenticationPoint[];
  variantSelected?: string | null;
  collabSelected?: string | null;
  specificAuthPoints?: string[] | null;
  /**
   * Échéance de l'appel au modèle (ms depuis l'époque) : voir
   * analysisModelDeadline (lib/analysis-limits.ts). Au-delà, l'appel est
   * interrompu et runAnalysis lève AnalysisError("ANALYSIS_TIMEOUT").
   */
  deadline: number;
}): Promise<AnalysisOutput> {
  // Preprocess all images
  const processedImages = await Promise.all(
    images.map(async (img) => {
      return {
        ...img,
        // Libellé de l'emplacement (« Semelle »…), pas le chemin de stockage :
        // le message d'erreur est montré au client.
        buffer: await preprocessImage(img.buffer, img.label),
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

  // Call Claude Vision API, borné par l'échéance : le signal abandonne la
  // requête HTTP en cours, `timeout` borne chaque tentative, et les nouvelles
  // tentatives du SDK (2, sur 408/409/429/5xx et erreurs de connexion) restent
  // permises tant qu'elles tiennent avant l'échéance. runWithDeadline rejette
  // à l'échéance même pendant l'attente entre deux tentatives, que le SDK ne
  // borne pas.
  const anthropic = getAnthropicClient();
  const remainingMs = Math.floor(deadline - Date.now());
  const response = await runWithDeadline(
    remainingMs,
    (signal) =>
      anthropic.messages.create(
        {
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
        },
        { signal, timeout: Math.max(1, remainingMs), maxRetries: 2 },
      ),
    () =>
      new AnalysisError(
        ANALYSIS_TIMEOUT_MESSAGE,
        "ANALYSIS_TIMEOUT"
      ),
  );

  // M2: Détecter une réponse tronquée par limite de tokens (JSON probablement invalide)
  if (response.stop_reason === "max_tokens") {
    throw new AnalysisError(
      "La réponse de l'IA a été tronquée. Aucun crédit n'a été décompté : relancez l'analyse.",
      "MAX_TOKENS"
    );
  }

  // Extract text response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new AnalysisError(
      "L'IA n'a renvoyé aucune réponse exploitable. Aucun crédit n'a été décompté : relancez l'analyse.",
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
      "L'IA a renvoyé une réponse illisible. Aucun crédit n'a été décompté : relancez l'analyse.",
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
      "L'IA a renvoyé une réponse incomplète. Aucun crédit n'a été décompté : relancez l'analyse.",
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

/**
 * Délai interne dépassé : l'appel au modèle a été interrompu avant la coupure
 * de la plateforme. Le catch de la route marque l'analyse « failed » ; le
 * débit, qui suit l'enregistrement du rapport, n'a pas lieu.
 */
export const ANALYSIS_TIMEOUT_MESSAGE =
  "L'analyse a pris trop de temps et a été interrompue. Aucun crédit n'a été décompté : relancez l'analyse.";

export class AnalysisError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AnalysisError";
    this.code = code;
  }
}

/**
 * Vrai si le corps d'erreur d'Anthropic désigne une image. Le message du
 * service donne le chemin du champ en cause (« messages.0.content.2.image.
 * source.base64: … ») : on cherche « image » dans ce message, pas ailleurs.
 */
function anthropicErrorMentionsImage(body: unknown): boolean {
  let text: string | null = null;
  if (typeof body === "string") {
    text = body;
  } else if (body && typeof body === "object") {
    const inner = body as { error?: { message?: unknown }; message?: unknown };
    const message = inner.error?.message ?? inner.message;
    if (typeof message === "string") text = message;
  }
  return text !== null && /\bimages?\b/i.test(text);
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
        "Le service d'analyse est momentanément surchargé. Aucun crédit n'a été décompté : relancez l'analyse dans quelques minutes.",
      code: "RATE_LIMITED",
    };
  }

  // 400 : les photos ont déjà été validées (format réel, 10 Mo, 800 px) puis
  // réencodées en JPEG de 1568 px au plus avant l'envoi. Un refus vient donc
  // presque toujours d'un paramètre de la requête (précédent : budget_tokens
  // rejeté par les modèles 4.6+) : on ne parle de photo que si le service
  // désigne explicitement une image. Le détail reste au journal (ci-dessus).
  if (err.status === 400) {
    if (anthropicErrorMentionsImage(err.error ?? err.message)) {
      return {
        message:
          "Le service d'analyse n'a pas pu lire l'une des photos. Aucun crédit n'a été décompté : relancez l'analyse et, si l'erreur se répète, reprenez les photos.",
        code: "BAD_REQUEST_IMAGE",
      };
    }
    return {
      message:
        "L'analyse n'a pas abouti à cause d'une erreur technique. Aucun crédit n'a été décompté : relancez l'analyse.",
      code: "BAD_REQUEST",
    };
  }

  return {
    message:
      "L'analyse n'a pas abouti à cause d'une erreur technique. Aucun crédit n'a été décompté : relancez l'analyse.",
    code: "UNKNOWN",
  };
}
