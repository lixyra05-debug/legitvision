// Types TypeScript globaux pour LegitVision

import type { Locale } from "./i18n/translations";

export type Category = "sneakers" | "bag" | "watch" | "clothing";

export type AnalysisStatus =
  | "pending"
  | "uploading"
  | "analyzing"
  | "completed"
  | "expert_review"
  | "failed";

export type Verdict = "likely_authentic" | "likely_fake" | "inconclusive";

export type Confidence = "high" | "medium" | "low";

export interface PhotoSlot {
  name: string;
  label: string;
  required: boolean;
}

export interface AuthenticationPoint {
  zone: string;
  label: string;
  weight: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: Category;
  logo_url: string | null;
  photo_protocol: PhotoSlot[];
  is_active: boolean;
  created_at: string;
}

export interface Collaboration {
  name: string;
  detail: string;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  authentication_points: AuthenticationPoint[];
  variants: string[];
  collaborations: Collaboration[];
  specific_auth_points: string[] | null;
  min_photos: number;
  max_photos: number;
  is_active: boolean;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  brand_id: string;
  model_id: string;
  category: Category;
  status: AnalysisStatus;
  overall_score: number | null;
  confidence: Confidence | null;
  verdict: Verdict | null;
  sub_scores: Record<string, number> | null;
  findings: AnalysisFinding[] | null;
  ai_raw_response: unknown | null;
  expert_id: string | null;
  expert_notes: string | null;
  variant_selected: string | null;
  collab_selected: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisFinding {
  zone: string;
  observation: string;
  score: number;
  severity?: "critical" | "important" | "minor";
}

export interface AnalysisWithDetails extends Analysis {
  brand_name: string;
  brand_slug: string;
  model_name: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "expert" | "admin";
  credits_remaining: number;
  subscription_plan: "free" | "pro" | "business";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; description: string }
> = {
  sneakers: {
    label: "Sneakers",
    icon: "shoe",
    description: "Nike, Jordan, adidas, New Balance…",
  },
  bag: {
    label: "Sacs",
    icon: "bag",
    description: "Louis Vuitton, Gucci, Chanel…",
  },
  watch: {
    label: "Montres",
    icon: "watch",
    description: "Rolex, Omega, AP…",
  },
  clothing: {
    label: "Vêtements",
    icon: "clothing",
    description: "Supreme, Off-White, Balenciaga…",
  },
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * SEUILS DU SCORE GLOBAL — SOURCE UNIQUE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Ces deux bornes décident du verdict rendu au client. `getVerdict()` dans
 * lib/ai/scoring.ts les importe : la logique métier et l'affichage lisent
 * littéralement les mêmes constantes, une divergence est donc impossible.
 *
 * Il y avait auparavant QUATRE tables concurrentes sur le même nombre :
 *   - lib/ai/scoring.ts      75 / 45   (le verdict enregistré en base)
 *   - lib/types.ts           90 / 50   (badge du dashboard)
 *   - ScoreGauge.tsx         90/70/50  (jauge du rapport)
 *   - ReportView SubScoreBar 75 / 45   (sous-scores)
 *
 * Conséquence vécue : un article à 80 portait un badge vert « Probablement
 * authentique » au-dessus d'une jauge jaune, et sur le dashboard ces mots
 * étaient imprimés en ambre. Toute la bande 75-89 — celle des articles
 * justement jugés authentiques — se colorait comme un doute.
 *
 * L'arbitrage retenu est 75/45, les seuils du verdict : c'est lui qui porte
 * le sens, la couleur ne fait que le rendre visible.
 */
export const SCORE_AUTHENTIC_MIN = 75;
export const SCORE_INCONCLUSIVE_MIN = 45;

/** Les trois paliers de couleur du score global. */
export type ScoreTier = "authentic" | "inconclusive" | "fake";

export function getScoreTier(score: number): ScoreTier {
  if (score >= SCORE_AUTHENTIC_MIN) return "authentic";
  if (score >= SCORE_INCONCLUSIVE_MIN) return "inconclusive";
  return "fake";
}

/**
 * Palier intermédiaire = --warning et NON --verdict-inconclusive.
 * Le gris sert déjà, dans la grille du dashboard, à l'état « pas encore de
 * score » : un 60/100 en gris s'y lirait « données manquantes ». --warning
 * met en garde sans qualifier l'authenticité.
 */
const TIER_TEXT: Record<ScoreTier, string> = {
  authentic: "text-verdict-authentic",
  inconclusive: "text-warning",
  fake: "text-verdict-fake",
};

const TIER_BG: Record<ScoreTier, string> = {
  authentic: "bg-verdict-authentic/10 border-verdict-authentic/20",
  inconclusive: "bg-warning/10 border-warning/20",
  fake: "bg-verdict-fake/10 border-verdict-fake/20",
};

/** Variable CSS de la teinte d'un palier — pour le SVG, qui ne prend pas de classe. */
const TIER_HSL: Record<ScoreTier, string> = {
  authentic: "var(--verdict-authentic)",
  inconclusive: "var(--warning)",
  fake: "var(--verdict-fake)",
};

export function getScoreColor(score: number): string {
  return TIER_TEXT[getScoreTier(score)];
}

export function getScoreBgColor(score: number): string {
  return TIER_BG[getScoreTier(score)];
}

/** Aplat plein — remplissage d'une barre de progression, pas une teinte de fond. */
const TIER_SOLID: Record<ScoreTier, string> = {
  authentic: "bg-verdict-authentic",
  inconclusive: "bg-warning",
  fake: "bg-verdict-fake",
};

export function getScoreSolidBg(score: number): string {
  return TIER_SOLID[getScoreTier(score)];
}

/** `hsl(var(--…))` prêt à poser en `stroke`, `fill` ou `boxShadow`. */
export function getScoreHsl(score: number, alpha?: number): string {
  const v = TIER_HSL[getScoreTier(score)];
  return alpha == null ? `hsl(${v})` : `hsl(${v} / ${alpha})`;
}

export function getVerdictLabel(verdict: Verdict, locale: Locale = "fr"): string {
  if (locale === "en") {
    switch (verdict) {
      case "likely_authentic":
        return "Likely authentic";
      case "likely_fake":
        return "Likely counterfeit";
      case "inconclusive":
        return "Suspicious elements";
    }
  }
  switch (verdict) {
    case "likely_authentic":
      return "Probablement authentique";
    case "likely_fake":
      return "Probablement contrefait";
    case "inconclusive":
      return "Éléments suspects";
  }
}

export function getStatusLabel(status: AnalysisStatus, locale: Locale = "fr"): string {
  if (locale === "en") {
    switch (status) {
      case "pending":
        return "Pending";
      case "uploading":
        return "Uploading";
      case "analyzing":
        return "Analyzing";
      case "completed":
        return "Completed";
      case "expert_review":
        return "Expert review";
      case "failed":
        return "Failed";
    }
  }
  switch (status) {
    case "pending":
      return "En attente";
    case "uploading":
      return "Upload en cours";
    case "analyzing":
      return "Analyse en cours";
    case "completed":
      return "Terminée";
    case "expert_review":
      return "Revue expert";
    case "failed":
      return "Échec";
  }
}
