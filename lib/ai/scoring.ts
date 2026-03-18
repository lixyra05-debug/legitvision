import type { AuthenticationPoint, Confidence, Verdict } from "@/lib/types";

interface ScoringInput {
  subScores: Record<string, number>;
  authenticationPoints: AuthenticationPoint[];
}

interface ScoringResult {
  overallScore: number;
  confidence: Confidence;
  verdict: Verdict;
}

/**
 * Calcule le score pondéré à partir des sub_scores de l'IA
 * et des weights définis dans authentication_points du modèle.
 */
export function calculateWeightedScore({
  subScores,
  authenticationPoints,
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

  // If no zones matched, fall back to simple average of all sub_scores
  if (totalWeight === 0) {
    const values = Object.values(subScores).filter(
      (v) => v != null && !isNaN(v)
    );
    if (values.length === 0) {
      return {
        overallScore: 0,
        confidence: "low",
        verdict: "inconclusive",
      };
    }
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      overallScore: Math.round(avg),
      confidence: "low",
      verdict: getVerdict(Math.round(avg)),
    };
  }

  // Normalize: if total weight doesn't add up to 1 (some zones missing),
  // divide by actual total weight
  const overallScore = Math.round(weightedSum / totalWeight);

  // Confidence based on evidence ratio (matched zones / total zones)
  const evidenceRatio = matchedZones / authenticationPoints.length;
  const confidence = getConfidence(evidenceRatio);

  const verdict = getVerdict(overallScore);

  return { overallScore, confidence, verdict };
}

function getConfidence(evidenceRatio: number): Confidence {
  if (evidenceRatio >= 0.85) return "high";
  if (evidenceRatio >= 0.6) return "medium";
  return "low";
}

function getVerdict(score: number): Verdict {
  if (score >= 75) return "likely_authentic";
  if (score >= 45) return "inconclusive";
  return "likely_fake";
}
