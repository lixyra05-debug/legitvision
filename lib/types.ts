// Types TypeScript globaux pour LegitVision

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

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 70) return "bg-yellow-500/10 border-yellow-500/20";
  if (score >= 50) return "bg-orange-500/10 border-orange-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getVerdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "likely_authentic":
      return "Probablement authentique";
    case "likely_fake":
      return "Probablement contrefait";
    case "inconclusive":
      return "Résultat non concluant";
  }
}

export function getStatusLabel(status: AnalysisStatus): string {
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
