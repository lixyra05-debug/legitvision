import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Historique des analyses : pagination du tableau de bord et noms de marque /
 * modèle des analyses.
 *
 * Le tableau de bord donne accès à TOUTES les analyses de l'utilisateur, page
 * par page (promesse faite au client). Deux pièges évités :
 * - une limite fixe (l'ancien .limit(20)) cachait les plus anciennes ;
 * - une jointure !inner sur brands / models, lue sous RLS (« Anyone can view
 *   active brands / models » : is_active = true), cachait toute analyse dont
 *   la marque ou le modèle a été désactivé depuis. Les jointures sont donc
 *   facultatives, et les noms manquants relus avec le client admin.
 */

/** Analyses par page : multiple de 2 et de 3, les colonnes de la grille. */
export const HISTORY_PAGE_SIZE = 24;

/** Numéro de page lu dans ?page= : entier ≥ 1, 1 par défaut. */
export function parseHistoryPage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !/^\d{1,6}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

/**
 * Fenêtre de lecture pour une page demandée et un total d'analyses. Une page
 * au-delà de la dernière (après une suppression, par exemple) affiche la
 * dernière. `from` / `to` sont les bornes incluses de .range().
 */
export function historyWindow(
  requestedPage: number,
  total: number,
  pageSize: number = HISTORY_PAGE_SIZE,
): { page: number; pageCount: number; from: number; to: number } {
  const pageCount = Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
  const page = Math.min(Math.max(1, Math.floor(requestedPage)), pageCount);
  const from = (page - 1) * pageSize;
  return { page, pageCount, from, to: from + pageSize - 1 };
}

export interface CatalogNames {
  brands: Map<string, { name: string; slug: string }>;
  models: Map<string, { name: string }>;
}

/**
 * Noms de marque et de modèle, lus avec le client admin : une marque ou un
 * modèle désactivé reste nommé dans l'historique et dans le rapport. Ne lit
 * que des noms publics du catalogue, jamais les données d'un utilisateur.
 */
export async function lookupCatalogNames(
  admin: SupabaseClient,
  brandIds: readonly string[],
  modelIds: readonly string[],
): Promise<CatalogNames> {
  const names: CatalogNames = { brands: new Map(), models: new Map() };
  const [brands, models] = await Promise.all([
    brandIds.length > 0
      ? admin.from("brands").select("id, name, slug").in("id", [...new Set(brandIds)])
      : null,
    modelIds.length > 0
      ? admin.from("models").select("id, name").in("id", [...new Set(modelIds)])
      : null,
  ]);
  for (const b of (brands?.data ?? []) as Array<{ id: string; name: string; slug: string }>) {
    names.brands.set(b.id, { name: b.name, slug: b.slug });
  }
  for (const m of (models?.data ?? []) as Array<{ id: string; name: string }>) {
    names.models.set(m.id, { name: m.name });
  }
  if (brands?.error || models?.error) {
    console.error(
      "[analysis-history] noms du catalogue illisibles :",
      brands?.error?.message ?? models?.error?.message,
    );
  }
  return names;
}
