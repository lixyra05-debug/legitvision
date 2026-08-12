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
 * Couleur du score d'une analyse — le SEUL vert légitime du dashboard.
 *
 * Passage de 4 teintes brutes (emerald/yellow/orange/red) à 3 paliers de tokens.
 * Le socle n'expose pas quatre couleurs de verdict : il en expose trois, et le
 * quatrième palier n'existait que parce qu'on piochait dans la palette Tailwind.
 *
 * Pourquoi PAS --verdict-inconclusive pour la tranche intermédiaire : le gris
 * sert déjà, dans cette même grille de cartes, à l'état « pas encore de score »
 * (analyse en attente). Un 78/100 en gris s'y lirait « données manquantes ».
 * C'est --warning qui porte le doute : il met en garde sans qualifier.
 *
 * Divergence assumée et temporaire : components/check/ScoreGauge.tsx porte une
 * table de seuils dupliquée, encore à 4 paliers (90/70/50). Les deux surfaces
 * seront réalignées à la passe ReportView — un score de 75 est ambre ici et
 * jaune là-bas d'ici là.
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-verdict-authentic";
  if (score >= 50) return "text-warning";
  return "text-verdict-fake";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90)
    return "bg-verdict-authentic/10 border-verdict-authentic/20";
  if (score >= 50) return "bg-warning/10 border-warning/20";
  return "bg-verdict-fake/10 border-verdict-fake/20";
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
