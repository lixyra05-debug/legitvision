/**
 * Comptes des guides SEO, CALCULÉS depuis les données de lib/seo/data : aucun
 * n'est écrit à la main dans un texte. Ajouter ou retirer un guide dans les
 * données met à jour titres, descriptions, images OG et textes au build
 * suivant. Pendant de lib/site-facts.ts, qui porte les chiffres du catalogue
 * analysable (règle d'Hector, 2026-09-25 : plus aucun chiffre écrit à la main).
 */
import { brands } from "./data/brands";
import { models } from "./data/models";
import { signals } from "./data/signals";
import { intersections } from "./data/intersections";
import { platforms } from "./data/platforms";

export const SEO_COUNTS = {
  /** Marques couvertes par les guides. */
  brands: brands.length,
  /** Guides modèle : /legit-check/[marque]/[modèle]. */
  modelGuides: models.length,
  /** Guides signal : /guide/[marque]/[signal]. */
  signalGuides: signals.length,
  /** Marques ayant au moins un guide signal. */
  signalGuideBrands: new Set(signals.map((s) => s.brandSlug)).size,
  /** Plateformes de seconde main : /acheter-authentique/[plateforme]. */
  platforms: platforms.length,
  /** Guides plateforme × marque : /acheter-authentique/[plateforme]/[marque]. */
  platformGuides: intersections.length,
} as const;

/** « 5 » si toutes les valeurs sont égales, sinon « 4 à 6 ». */
export function formatRange(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? String(min) : `${min} à ${max}`;
}

/** Étapes d'un guide signal, déjà mises en forme (« 5 », ou « 4 à 6 » si elles varient). */
export const STEPS_PER_SIGNAL_GUIDE = formatRange(signals.map((s) => s.steps.length));

/** Guides de marque d'une plateforme. */
export function platformGuideCount(platformSlug: string): number {
  return intersections.filter((i) => i.platformSlug === platformSlug).length;
}

/** Guides de marque par plateforme, toutes plateformes confondues (« 10 », ou « 8 à 10 »). */
export const GUIDES_PER_PLATFORM = formatRange(platforms.map((p) => platformGuideCount(p.slug)));
