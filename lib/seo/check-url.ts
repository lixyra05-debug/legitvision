import type { Brand } from "./types";

/**
 * Catégorie des données SEO → catégorie de la table `brands`, qui écrit
 * « bag » au singulier. `accessories` n'a pas d'équivalent : pas de filtre.
 */
const CATEGORY_IN_DB: Record<string, string> = {
  sneakers: "sneakers",
  bags: "bag",
  clothing: "clothing",
};

/**
 * Lien d'analyse des pages SEO (legit check, acheter authentique) :
 * /check/new avec la marque pré-sélectionnée, source et ref conservés.
 *
 * Non connecté, le proxy renvoie vers /auth?redirect=<ce lien> : la connexion
 * (Google ou e-mail) ramène ici, pas sur /dashboard. Connecté, on y va direct.
 *
 * - `checkBrand` porte le nom exact en base quand il diffère du libellé SEO
 *   (Air Jordan → Jordan) : /check/new compare les noms à l'égalité.
 * - La catégorie départage les marques présentes dans plusieurs catégories
 *   (Louis Vuitton, Dior, Gucci…). Si le couple marque × catégorie n'existe
 *   pas en base, /check/new ne pré-sélectionne rien : d'où `checkCategory`
 *   et les deux règles ci-dessous pour Off-White et BAPE.
 */
export function buildCheckUrl({
  brand,
  category,
  ref,
  extra,
}: {
  brand?: Pick<Brand, "name" | "checkBrand">;
  category?: string;
  ref: string;
  extra?: Record<string, string>;
}): string {
  const params = new URLSearchParams();
  if (brand) {
    params.set("brand", brand.checkBrand ?? brand.name);
    const dbCategory = category ? CATEGORY_IN_DB[category] : undefined;
    if (dbCategory) params.set("category", dbCategory);
  }
  params.set("source", "seo");
  params.set("ref", ref);
  for (const [key, value] of Object.entries(extra ?? {})) params.set(key, value);
  return `/check/new?${params.toString()}`;
}

/**
 * Catégorie vers laquelle une page GÉNÉRALE de la marque envoie : celle où
 * l'analyse couvre la marque (`checkCategory`), sinon sa catégorie SEO.
 * Règle d'Hector (2026-09-25) pour Off-White et BAPE, présentes en base
 * uniquement en sneakers : leurs pages générales pointent vers ces sneakers.
 */
export function analyzableCategory(brand: Pick<Brand, "category" | "checkCategory">): string {
  return brand.checkCategory ?? brand.category;
}

/**
 * Une page consacrée à une catégorie précise (modèle, signal) n'a de bouton
 * d'analyse que si l'analyse couvre la marque dans cette catégorie : un guide
 * sur un tee Off-White n'envoie pas vers les sneakers Off-White, il n'a pas
 * de bouton (Hector, 2026-09-25).
 */
export function pageHasAnalysis(brand: Pick<Brand, "checkCategory">, pageCategory: string): boolean {
  return !brand.checkCategory || brand.checkCategory === pageCategory;
}
