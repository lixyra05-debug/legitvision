import type { Model } from "@/lib/types";

/**
 * Un modèle n'est proposé à l'analyse que s'il porte au moins un point
 * d'authentification : sans point, l'analyse n'a rien de propre au modèle à
 * vérifier. Règle d'Hector (2026-09-25) : ces modèles sortent du compte
 * (lib/site-facts.ts) et de la sélection « tant qu'ils n'ont pas de points ».
 * Rien n'est désactivé en base : un modèle revient de lui-même dès qu'on lui
 * ajoute des points.
 *
 * En base, un modèle sans point porte `authentication_points = []` (45 modèles
 * au 2026-09-25, aucun `null`). Dans les requêtes, la même règle s'écrit :
 * - sur `models` : `.neq("authentication_points", NO_AUTH_POINTS)` ;
 * - sur `brands` : `.select("…, models!inner()")` puis
 *   `.eq("models.is_active", true).neq("models.authentication_points", NO_AUTH_POINTS)`,
 *   jointure interne qui ne garde que les marques ayant au moins un modèle
 *   analysable, sans renvoyer ces modèles. Sans elle, une marque dont tous les
 *   modèles sont sans point s'afficherait avec une liste de modèles vide.
 */
export const NO_AUTH_POINTS = "[]";

/**
 * Les montres ne sont pas analysées : la route d'analyse les refuse
 * (lib/launch-check.ts, « montres non analysées »), et le site annonce le seul
 * catalogue analysable (lib/site-facts.ts). La recherche de l'accueil et la
 * présélection de /check/new les excluent donc aussi (lib/catalogue-recherche.ts).
 */
export const NON_ANALYZABLE_CATEGORY = "watch";

export function hasAuthenticationPoints(model: Pick<Model, "authentication_points">): boolean {
  return Array.isArray(model.authentication_points) && model.authentication_points.length > 0;
}
