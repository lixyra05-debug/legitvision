/**
 * SOURCE UNIQUE des chiffres affichés par le site : catalogue, durée
 * d'analyse, prix et quotas des formules.
 *
 * Aucun de ces chiffres n'est écrit à la main ailleurs. Traductions, pages
 * SEO, assistant, métadonnées, JSON-LD, CGU, e-mails et webhook les lisent
 * ici : changer une valeur ici la change partout.
 *
 * Règle (Hector, 2026-09-25) : rien n'est affiché s'il n'est pas prouvé vrai.
 * Chaque valeur mesurée porte sa date et sa méthode ; la re-mesurer avant de
 * la modifier.
 */

type Lang = "fr" | "en";

/** Catalogue ANALYSABLE — relevé en production le 2026-09-25. */
export const CATALOG = {
  /**
   * Noms de marque distincts ayant au moins un modèle actif, hors montres
   * (non sélectionnables). La table `brands` compte 77 LIGNES : une marque y
   * figure une fois par catégorie, et Essentials n'a aucun modèle actif.
   */
  brands: 56,
  /** Modèles actifs d'une marque active, hors les 10 modèles de montres. */
  models: 520,
  /** Points d'authentification en base sur ces modèles (0 à 10 par modèle). */
  authPoints: 3924,
  /** Zones d'authentification d'un modèle, au plus (10 pour 175 modèles de sacs). */
  maxZones: 10,
  /** Points d'authentification d'un modèle, au plus (médiane : 8). */
  maxPointsPerModel: 10,
  /** Photos demandées selon la catégorie : sneakers 8-11, sacs 10-11, vêtements 6-8. */
  photosMin: 6,
  photosMax: 11,
} as const;

/**
 * Durée MÉDIANE d'une analyse, du clic « Lancer » au rapport, envoi des photos
 * compris (created_at → updated_at des analyses terminées). Relevé le
 * 2026-09-24 : 3 analyses depuis le passage à claude-opus-4-8 (45,4 / 46,8 /
 * 63,9 s). À re-mesurer quand le volume le permettra.
 */
export const ANALYSIS_MEDIAN_SECONDS = 47;

/** Prix TTC en euros. Doivent rester égaux aux prix Stripe (STRIPE_*_PRICE_ID). */
export const PRICES = {
  single: 3.99,
  pro: 19.99,
  business: 29.99,
} as const;

/** Analyses par mois des abonnements — le webhook crédite ces mêmes quotas. */
export const MONTHLY_ANALYSES = {
  pro: 10,
  business: 50,
} as const;

// ── Mise en forme ────────────────────────────────────────────────────────────
// Sans Intl : le rendu doit être identique au serveur et dans le navigateur.

/** 3,99 € (fr) ou €3.99 (en). */
export function formatPrice(amount: number, lang: Lang = "fr"): string {
  const fixed = amount.toFixed(2);
  return lang === "en" ? `€${fixed}` : `${fixed.replace(".", ",")} €`;
}

/** 3 924 (fr, espace fine insécable) ou 3,924 (en). */
export function formatNumber(n: number, lang: Lang = "fr"): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : " ");
}

/** Tous les chiffres, déjà mis en forme pour les textes. */
export function facts(lang: Lang = "fr") {
  return {
    brands: formatNumber(CATALOG.brands, lang),
    models: formatNumber(CATALOG.models, lang),
    authPoints: formatNumber(CATALOG.authPoints, lang),
    maxZones: String(CATALOG.maxZones),
    maxPointsPerModel: String(CATALOG.maxPointsPerModel),
    photosMin: String(CATALOG.photosMin),
    photosMax: String(CATALOG.photosMax),
    median: String(ANALYSIS_MEDIAN_SECONDS),
    priceSingle: formatPrice(PRICES.single, lang),
    pricePro: formatPrice(PRICES.pro, lang),
    priceBusiness: formatPrice(PRICES.business, lang),
    proAnalyses: String(MONTHLY_ANALYSES.pro),
    businessAnalyses: String(MONTHLY_ANALYSES.business),
  };
}
