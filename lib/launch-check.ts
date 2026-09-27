import type { Brand, Model } from "@/lib/types";
import { hasAuthenticationPoints } from "@/lib/analyzable";

/**
 * Ce que le navigateur a choisi pour une analyse (ligne de marque, modèle,
 * catégorie, variante, collab, emplacements des photos) est écrit par lui dans
 * la ligne `analyses` et part dans le prompt ; la variante et la collab sont
 * reprises au début du résumé affiché dans le rapport. Rien n'y entre qui ne
 * sorte du catalogue : sinon, une requête forgée ferait écrire n'importe quel
 * texte dans un rapport.
 *
 * - "catalog" : modèle non analysable, ou incohérent avec la ligne de marque
 *   ou la catégorie (la route répond 422) ;
 * - "input" : variante, collab ou emplacement photo inconnus (400).
 * `reason` va au journal, jamais au client.
 */
export type LaunchProblem = { kind: "catalog" | "input"; reason: string };

/** La variante affichée « Standard » équivaut à l'absence de variante. */
const STANDARD_VARIANT = "Standard";

export function catalogProblem(args: {
  brand: Pick<Brand, "id" | "category" | "is_active">;
  model: Pick<Model, "brand_id" | "is_active" | "authentication_points" | "variants" | "collaborations">;
  category: string;
  variant: string | null;
  collab: string | null;
}): LaunchProblem | null {
  const { brand, model, category, variant, collab } = args;

  // Même règle que la sélection (lib/analyzable.ts, catalogue) : modèle actif
  // avec des points, ligne de marque active hors montres.
  if (!brand.is_active || !model.is_active) return { kind: "catalog", reason: "marque ou modèle désactivé" };
  if (brand.category === "watch") return { kind: "catalog", reason: "montres non analysées" };
  if (!hasAuthenticationPoints(model)) return { kind: "catalog", reason: "modèle sans point d'authentification" };
  if (model.brand_id !== brand.id) return { kind: "catalog", reason: "modèle d'une autre ligne de marque" };
  if (category !== brand.category) return { kind: "catalog", reason: "catégorie différente de la ligne de marque" };

  const variants = Array.isArray(model.variants) ? model.variants : [];
  if (variant !== null && variant !== STANDARD_VARIANT && !variants.includes(variant)) {
    return { kind: "input", reason: "variante inconnue pour ce modèle" };
  }
  const collabs = Array.isArray(model.collaborations) ? model.collaborations.map((c) => c?.name) : [];
  if (collab !== null && !collabs.includes(collab)) {
    return { kind: "input", reason: "collab inconnue pour ce modèle" };
  }
  return null;
}

/**
 * Emplacements photo inconnus du protocole de la ligne de marque. Clé `name`,
 * ou `type` pour d'anciennes données (même repli que check/new ; aucune en base
 * le 27/09).
 */
export function unknownPhotoTypes(protocol: unknown, photoTypes: readonly string[]): string[] {
  const slots = Array.isArray(protocol) ? (protocol as Array<{ name?: unknown; type?: unknown }>) : [];
  const known = new Set(slots.map((s) => s?.name ?? s?.type).filter((n): n is string => typeof n === "string"));
  return photoTypes.filter((t) => !known.has(t));
}
