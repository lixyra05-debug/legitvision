import { NO_AUTH_POINTS } from "@/lib/analyzable";

/**
 * Nombre de modèles ANALYSABLES par ligne de marque (marque × catégorie), lu
 * dans la base avec la règle de la sélection (lib/analyzable.ts) : modèle actif,
 * au moins un point d'authentification. Sert aux compteurs des tuiles de la
 * landing — aucun de ces chiffres n'est écrit à la main (Hector, 2026-09-25).
 *
 * Lecture publique (clé anon, RLS « actifs »), mise en cache une heure (ISR).
 * Un échec au build fait échouer le build ; une revalidation qui échoue garde
 * la dernière page valide. Jamais de chiffre de repli.
 */
export async function getAnalyzableCountsByBrandRow(): Promise<Record<string, number>> {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = new URL("/rest/v1/brands", process.env.NEXT_PUBLIC_SUPABASE_URL);
  url.searchParams.set("select", "name,category,models(count)");
  url.searchParams.set("is_active", "eq.true");
  url.searchParams.set("models.is_active", "eq.true");
  url.searchParams.set("models.authentication_points", `neq.${NO_AUTH_POINTS}`);

  const res = await fetch(url, {
    headers: { apikey: key ?? "", Authorization: `Bearer ${key ?? ""}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Comptes du catalogue indisponibles (HTTP ${res.status})`);

  const rows = (await res.json()) as { name: string; category: string; models: { count: number }[] }[];
  return Object.fromEntries(rows.map((r) => [brandRowKey(r.name, r.category), r.models[0]?.count ?? 0]));
}

/** Clé d'une ligne de marque : nom (insensible à la casse) + catégorie en base. */
export function brandRowKey(name: string, category: string): string {
  return `${name.toLowerCase()}|${category}`;
}
