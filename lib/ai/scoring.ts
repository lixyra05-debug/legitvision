import type { AuthenticationPoint, Confidence, Verdict } from "@/lib/types";
import { SCORE_AUTHENTIC_MIN, SCORE_INCONCLUSIVE_MIN } from "@/lib/types";

interface ScoringInput {
  subScores: Record<string, number>;
  authenticationPoints: AuthenticationPoint[];
  /** Confiance déclarée par l'IA (P1-3). Peut valoir "insufficient". */
  aiConfidenceLevel?: "high" | "medium" | "low" | "insufficient";
}

interface ScoringResult {
  overallScore: number;
  confidence: Confidence;
  verdict: Verdict;
  /** true si l'IA juge les photos insuffisantes pour conclure (P1-3). */
  insufficient: boolean;
}

// Ordre de prudence : low < medium < high. On retient toujours la plus prudente.
const CONFIDENCE_RANK: Record<Confidence, number> = { low: 1, medium: 2, high: 3 };
function moreCautious(a: Confidence, b: Confidence): Confidence {
  return CONFIDENCE_RANK[a] <= CONFIDENCE_RANK[b] ? a : b;
}

/**
 * Calcule le score pondéré à partir des sub_scores de l'IA
 * et des weights définis dans authentication_points du modèle.
 */
export function calculateWeightedScore({
  subScores,
  authenticationPoints,
  aiConfidenceLevel,
}: ScoringInput): ScoringResult {
  let weightedSum = 0;
  let totalWeight = 0;
  let matchedZones = 0;

  for (const point of authenticationPoints) {
    const score = subScores[point.zone];
    if (score != null && !isNaN(score)) {
      weightedSum += score * point.weight;
      totalWeight += point.weight;
      matchedZones++;
    }
  }

  // ── Score + confiance/verdict MÉCANIQUES (logique inchangée) ──
  let overallScore: number;
  let confidence: Confidence;
  let verdict: Verdict;

  if (totalWeight === 0) {
    // Aucune zone pondérée : fallback sur la moyenne simple des sub_scores
    const values = Object.values(subScores).filter(
      (v) => v != null && !isNaN(v)
    );
    if (values.length === 0) {
      overallScore = 0;
      confidence = "low";
      verdict = "inconclusive";
    } else {
      overallScore = Math.round(
        values.reduce((a, b) => a + b, 0) / values.length
      );
      confidence = "low";
      verdict = getVerdict(overallScore);
    }
  } else {
    overallScore = Math.round(weightedSum / totalWeight);
    confidence = getConfidence(matchedZones / authenticationPoints.length);
    verdict = getVerdict(overallScore);
  }

  // ── Modération par la confiance déclarée par l'IA (P1-3) ──
  // "insufficient" : photos insuffisantes → jamais de verdict confiant.
  if (aiConfidenceLevel === "insufficient") {
    return {
      overallScore,
      confidence: "low", // DB-valide ; le panneau "insufficient" est piloté côté UI via ai_raw_response.confidence_level
      verdict: "inconclusive", // toujours inconclusive sur photos insuffisantes
      insufficient: true,
    };
  }
  // Sinon : la confiance finale est la PLUS PRUDENTE entre l'IA et le mécanique.
  if (
    aiConfidenceLevel === "high" ||
    aiConfidenceLevel === "medium" ||
    aiConfidenceLevel === "low"
  ) {
    confidence = moreCautious(confidence, aiConfidenceLevel);
  }

  return { overallScore, confidence, verdict, insufficient: false };
}

function getConfidence(evidenceRatio: number): Confidence {
  if (evidenceRatio >= 0.85) return "high";
  if (evidenceRatio >= 0.6) return "medium";
  return "low";
}

// Seuils inchangés (75 / 45) — ils sont désormais NOMMÉS et importés depuis
// lib/types.ts, que l'affichage lit aussi. Couleur et verdict ne peuvent plus
// diverger : c'est la même paire de constantes des deux côtés.
function getVerdict(score: number): Verdict {
  if (score >= SCORE_AUTHENTIC_MIN) return "likely_authentic";
  if (score >= SCORE_INCONCLUSIVE_MIN) return "inconclusive";
  return "likely_fake";
}
