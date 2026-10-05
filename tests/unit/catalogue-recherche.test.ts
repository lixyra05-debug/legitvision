// Recherche de l'accueil et présélection de /check/new : la règle de la
// sélection (lib/analyzable.ts), montres comprises. Avant le 04/10, « rolex » ou
// « submariner » proposaient une montre que la route d'analyse refuse ensuite.
import { test } from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NON_ANALYZABLE_CATEGORY, NO_AUTH_POINTS } from "@/lib/analyzable";
import { catalogProblem } from "@/lib/launch-check";
import { chargerCatalogueRecherche, lignesDeMarquePreselection } from "@/lib/catalogue-recherche";

type Appel = { table: string; methode: string; args: unknown[] };

/** Client qui note chaque appel de la requête et rend les lignes données pour sa table. */
function clientEnregistreur(lignes: Record<string, unknown[]> = {}) {
  const appels: Appel[] = [];
  const client = {
    from(table: string) {
      const chaine: Record<string, unknown> = {};
      for (const methode of ["select", "eq", "neq", "ilike", "order"]) {
        chaine[methode] = (...args: unknown[]) => {
          appels.push({ table, methode, args });
          return chaine;
        };
      }
      chaine.then = (resoudre: (v: unknown) => void) => resoudre({ data: lignes[table] ?? [], error: null });
      return chaine;
    },
  };
  return { appels, client: client as unknown as SupabaseClient };
}

const filtres = (appels: Appel[], table: string, methode: string) =>
  appels.filter((a) => a.table === table && a.methode === methode).map((a) => a.args);

test("la catégorie exclue est celle que la route d'analyse refuse", () => {
  const brand = { id: "b1", category: NON_ANALYZABLE_CATEGORY, is_active: true };
  const model = { brand_id: "b1", is_active: true, authentication_points: [{ zone: "x", label: "X", weight: 1 }], variants: [], collaborations: [] };
  assert.equal(
    catalogProblem({ brand: brand as never, model: model as never, category: NON_ANALYZABLE_CATEGORY, variant: null, collab: null })?.reason,
    "montres non analysées"
  );
});

test("recherche de l'accueil : marques et modèles hors montres, modèles analysables seulement", async () => {
  const { appels, client } = clientEnregistreur({
    brands: [{ id: "b1", name: "Nike", category: "sneakers", models: [] }],
    models: [{ id: "m1", name: "Air Jordan 1", brands: { name: "Nike", category: "sneakers" } }],
  });
  const { marques, modeles } = await chargerCatalogueRecherche(client);

  assert.deepEqual(filtres(appels, "brands", "neq"), [
    ["category", NON_ANALYZABLE_CATEGORY],
    ["models.authentication_points", NO_AUTH_POINTS],
  ]);
  assert.deepEqual(filtres(appels, "brands", "eq"), [["models.is_active", true]]);
  assert.match(String(filtres(appels, "models", "select")[0][0]), /brands!inner\(name, category\)/);
  assert.deepEqual(filtres(appels, "models", "neq"), [
    ["authentication_points", NO_AUTH_POINTS],
    ["brands.category", NON_ANALYZABLE_CATEGORY],
  ]);
  assert.deepEqual(filtres(appels, "models", "eq"), [["is_active", true]]);

  assert.deepEqual(marques, [{ id: "b1", name: "Nike", category: "sneakers" }]);
  assert.deepEqual(modeles, [{ id: "m1", name: "Air Jordan 1", brand_name: "Nike", category: "sneakers" }]);
});

test("présélection de /check/new : ligne hors montres, avec ou sans catégorie dans l'URL", async () => {
  for (const categorie of [null, "sneakers", NON_ANALYZABLE_CATEGORY]) {
    const { appels, client } = clientEnregistreur();
    await lignesDeMarquePreselection(client, "Rolex", categorie);
    assert.ok(
      filtres(appels, "brands", "neq").some(([col, val]) => col === "category" && val === NON_ANALYZABLE_CATEGORY),
      `catégorie ${categorie} : montres exclues`
    );
    assert.deepEqual(filtres(appels, "brands", "ilike"), [["name", "Rolex"]]);
    assert.deepEqual(filtres(appels, "brands", "order"), [["created_at"]]);
    const categoriesDemandees = filtres(appels, "brands", "eq").filter(([col]) => col === "category");
    assert.deepEqual(categoriesDemandees, categorie ? [["category", categorie]] : []);
  }
});
