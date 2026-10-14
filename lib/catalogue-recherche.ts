import type { SupabaseClient } from "@supabase/supabase-js";
import { NO_AUTH_POINTS, NON_ANALYZABLE_CATEGORY } from "@/lib/analyzable";

/**
 * Lectures du catalogue proposées au visiteur, avec la règle de la sélection
 * (lib/analyzable.ts) : modèle actif avec au moins un point d'authentification,
 * ligne de marque hors montres. Une seule écriture de cette règle pour la
 * recherche de l'accueil et la présélection de /check/new, qui proposaient des
 * montres que la route d'analyse refuse ensuite.
 */

export type MarqueRecherchee = { id: string; name: string; category: string };
export type ModeleRecherche = { id: string; name: string; brand_name: string; category: string };

type LigneModele = { id: string; name: string; brands: { name: string; category: string } | null };

/**
 * Marques et modèles de la recherche de l'accueil. Marques : jointure interne
 * sur les modèles analysables (sans les renvoyer). Modèles : jointure interne
 * sur leur ligne de marque, pour en exclure les montres.
 */
export async function chargerCatalogueRecherche(
  supabase: SupabaseClient
): Promise<{ marques: MarqueRecherchee[]; modeles: ModeleRecherche[] }> {
  const [{ data: marques }, { data: modeles }] = await Promise.all([
    supabase
      .from("brands")
      .select("id, name, category, models!inner()")
      .neq("category", NON_ANALYZABLE_CATEGORY)
      .eq("models.is_active", true)
      .neq("models.authentication_points", NO_AUTH_POINTS)
      .order("name"),
    supabase
      .from("models")
      .select("id, name, brands!inner(name, category)")
      .eq("is_active", true)
      .neq("authentication_points", NO_AUTH_POINTS)
      .neq("brands.category", NON_ANALYZABLE_CATEGORY)
      .order("name"),
  ]);
  return {
    marques: ((marques ?? []) as unknown as MarqueRecherchee[]).map(({ id, name, category }) => ({ id, name, category })),
    modeles: ((modeles ?? []) as unknown as LigneModele[]).map((m) => ({
      id: m.id,
      name: m.name,
      brand_name: m.brands?.name ?? "",
      category: m.brands?.category ?? "",
    })),
  };
}

/**
 * Lignes de marque candidates à la présélection de /check/new (?brand=…), les
 * plus anciennes d'abord : nom insensible à la casse, ligne active hors
 * montres, au moins un modèle analysable, et la catégorie demandée si l'URL en
 * donne une.
 */
export function lignesDeMarquePreselection(supabase: SupabaseClient, nom: string, categorie: string | null) {
  const requete = supabase
    .from("brands")
    .select("*, models!inner()")
    .ilike("name", nom)
    .eq("is_active", true)
    .neq("category", NON_ANALYZABLE_CATEGORY)
    .eq("models.is_active", true)
    .neq("models.authentication_points", NO_AUTH_POINTS);
  return (categorie ? requete.eq("category", categorie) : requete).order("created_at");
}
