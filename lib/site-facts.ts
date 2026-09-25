/**
 * SOURCE UNIQUE des chiffres affichés par le site : catalogue, durée
 * d'analyse, prix et quotas des formules, conservation des photos.
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

/**
 * Catalogue ANALYSABLE — relevé en production le 2026-09-25 à 17 h 29 UTC
 * (lecture publique), après le rattachement des modèles rangés dans la
 * mauvaise catégorie (supabase/scripts/2026-09-25-rattachement-modeles.sql).
 *
 * Un modèle est analysable s'il est actif, d'une marque active hors montres
 * (non sélectionnables), et s'il porte au moins un point d'authentification :
 * c'est exactement ce que propose la sélection (lib/analyzable.ts). Les 10
 * modèles actifs sans point en sont exclus. À re-mesurer quand des points
 * sont ajoutés en base : ces modèles reviennent alors dans la sélection.
 */
export const CATALOG = {
  /**
   * Noms de marque distincts ayant au moins un modèle analysable. La table
   * `brands` compte 80 LIGNES : une marque y figure une fois par catégorie.
   * 70 lignes ont au moins un modèle analysable ; 2 lignes hors montres n'en
   * ont aucun (Essentials en vêtements, Balenciaga en sneakers).
   */
  brands: 56,
  /** Modèles analysables : 494 actifs, moins 10 montres et 10 sans point. */
  models: 474,
  /** Points d'authentification sur ces modèles (4 à 10 par modèle). */
  authPoints: 3917,
  /** Zones d'authentification d'un modèle, au plus (10 pour 175 modèles de sacs). */
  maxZones: 10,
  /** Points d'authentification d'un modèle, au plus (médiane : 8). */
  maxPointsPerModel: 10,
  /** Photos demandées selon la catégorie : sneakers 8-11, sacs 10-11, vêtements 6-8. */
  photosMin: 6,
  photosMax: 11,
} as const;

/**
 * Photos demandées par catégorie = nombre d'emplacements du protocole de la
 * ligne de marque, sur les lignes ayant au moins un modèle analysable (même
 * relevé que CATALOG). Les textes qui parlent d'une catégorie lisent ces valeurs.
 */
export const PHOTOS_BY_CATEGORY = {
  sneakers: { min: 8, max: 11 },
  bag: { min: 10, max: 11 },
  clothing: { min: 6, max: 8 },
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

/**
 * Conservation des photos d'analyse, en jours après leur envoi (décision
 * d'Hector, 2026-09-25). La purge quotidienne (lib/purge-photos.ts) applique
 * cette valeur ; la politique de confidentialité l'affiche.
 */
export const PHOTO_RETENTION_DAYS = 30;

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
    bagPhotosMin: String(PHOTOS_BY_CATEGORY.bag.min),
    bagPhotosMax: String(PHOTOS_BY_CATEGORY.bag.max),
    photosMax: String(CATALOG.photosMax),
    median: String(ANALYSIS_MEDIAN_SECONDS),
    priceSingle: formatPrice(PRICES.single, lang),
    pricePro: formatPrice(PRICES.pro, lang),
    priceBusiness: formatPrice(PRICES.business, lang),
    proAnalyses: String(MONTHLY_ANALYSES.pro),
    businessAnalyses: String(MONTHLY_ANALYSES.business),
    photoRetentionDays: String(PHOTO_RETENTION_DAYS),
  };
}
