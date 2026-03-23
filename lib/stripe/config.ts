/**
 * Configuration des plans LegitVision — safe côté client et serveur.
 * Aucune variable d'environnement serveur ici.
 */

export type PlanId = "free" | "pro" | "business";

export interface PlanMeta {
  id: PlanId;
  name: string;
  priceFormatted: string;
  periodLabel: string;
  creditsPerMonth: number | null; // null = illimité
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export const PLAN_META: Record<PlanId, PlanMeta> = {
  free: {
    id: "free",
    name: "Free",
    priceFormatted: "0€",
    periodLabel: "",
    creditsPerMonth: 3,
    description: "Pour essayer le service",
    features: [
      "Rapport détaillé avec score",
      "Sneakers uniquement",
      "Résultat en 30 secondes",
    ],
    popular: false,
    cta: "Commencer gratuitement",
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceFormatted: "14,99€",
    periodLabel: "/mois",
    creditsPerMonth: 30,
    description: "Pour les acheteurs réguliers",
    features: [
      "Toutes les catégories",
      "Rapport détaillé avec score",
      "Revue expert si doute",
      "Historique complet",
    ],
    popular: true,
    cta: "Passer au Pro",
  },
  business: {
    id: "business",
    name: "Business",
    priceFormatted: "29,99€",
    periodLabel: "/mois",
    creditsPerMonth: null,
    description: "Pour les revendeurs et pros",
    features: [
      "Analyses illimitées",
      "Toutes les catégories",
      "Revue expert prioritaire",
      "API access",
      "Support dédié",
    ],
    popular: false,
    cta: "Passer au Business",
  },
};

export const PAID_PLANS: PlanId[] = ["pro", "business"];

/** Crédits accordés à la mise à niveau vers un plan payant */
export const PLAN_CREDITS: Record<PlanId, number> = {
  free: 3,
  pro: 30,
  business: 9999, // valeur symbolique — le check est bypassé côté serveur
};
