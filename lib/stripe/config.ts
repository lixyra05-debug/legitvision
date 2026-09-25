/**
 * Configuration des plans LegitVision — safe côté client et serveur.
 * Aucune variable d'environnement serveur ici.
 */
import { facts, MONTHLY_ANALYSES } from "@/lib/site-facts";

const FACTS = facts();

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
      `Résultat en ${FACTS.median} s (médiane)`,
    ],
    popular: false,
    cta: "Commencer gratuitement",
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceFormatted: FACTS.pricePro,
    periodLabel: "/mois",
    creditsPerMonth: MONTHLY_ANALYSES.pro,
    description: "Pour les acheteurs réguliers",
    features: [
      "Toutes les catégories",
      "Rapport détaillé avec score",
      "Recommandations en cas de doute",
      "Historique complet",
    ],
    popular: true,
    cta: "Passer au Pro",
  },
  business: {
    id: "business",
    name: "Business",
    priceFormatted: FACTS.priceBusiness,
    periodLabel: "/mois",
    creditsPerMonth: MONTHLY_ANALYSES.business,
    description: "Pour les revendeurs et pros",
    features: [
      `${FACTS.businessAnalyses} analyses par mois`,
      "Toutes les catégories",
      "Recommandations en cas de doute",
      "Support par e-mail",
    ],
    popular: false,
    cta: "Passer au Business",
  },
};

export const PAID_PLANS: PlanId[] = ["pro", "business"];

/** Crédits accordés à chaque facturation mensuelle (free = bonus à l'inscription, mais désactivé depuis mig 016) */
export const PLAN_CREDITS: Record<PlanId, number> = {
  free: 0,
  pro: MONTHLY_ANALYSES.pro,
  business: MONTHLY_ANALYSES.business,
};
