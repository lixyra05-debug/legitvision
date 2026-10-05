// La page du rapport lit les points d'authentification du modèle pour nommer
// les zones en français (décision d'Hector du 05/10), et ne passe au
// navigateur que la table des noms : ni les points, ni leurs libellés entiers,
// ni leurs poids. Modèle absent (désactivé depuis), points absents ou mal
// formés : la page s'affiche quand même.
// Ce test exécute la vraie page (app/(dashboard)/check/[id]/page.tsx) avec un
// faux client Supabase et lit ce qu'elle transmet à ReportView.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;

const UTILISATEUR = "7c9e6679-7425-40de-944b-e07fc1f90ae7";
const ANALYSE = "0f8fad5b-d9cb-469f-a165-70867728950e";

// Points d'un modèle, tels que le catalogue les porte (relevé du 2026-10-05).
const POINTS = [
  { zone: "stitching", label: "Coutures (regularite, couleur du fil, tension)", weight: 0.3 },
  { zone: "tongue_label", label: "Patch Nike + étiquette taille avec SKU cohérent (HJ8463-001)", weight: 0.25 },
  { zone: "swoosh", label: "Forme et placement du Swoosh (courbe, pointe)", weight: 0.25 },
  { zone: "heel_tab", label: "Tab talon (broderie Nike Air)", weight: 0.2 },
];

/** La ligne `analyses` que la page lit, avec ses jointures. */
function ligne(models: unknown) {
  return {
    id: ANALYSE,
    status: "completed",
    verdict: "likely_authentic",
    confidence: "high",
    overall_score: 84,
    sub_scores: { stitching: 90, tongue_label: 80, swoosh: 85, heel_tab: 78 },
    findings: [{ zone: "swoosh", observation: "Courbe conforme.", score: 85 }],
    ai_raw_response: { analyst_summary: "Zones cohérentes.", confidence_level: "high" },
    created_at: "2026-10-05T10:00:00.000Z",
    updated_at: "2026-10-05T10:01:00.000Z",
    brand_id: "marque-1",
    model_id: "modele-1",
    brands: { name: "Nike" },
    models,
  };
}

// Faux clients Supabase : la lecture de l'analyse (clé de l'utilisateur), et
// celle des noms d'une marque ou d'un modèle désactivé (clé du serveur).
let modeleLu: unknown = null;
const colonnesLues: string[] = [];
const lecturesAdmin: string[] = [];

mock.module(adresseDe("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: UTILISATEUR } } }) },
      from(table: string) {
        assert.equal(table, "analyses");
        const filtres: Record<string, unknown> = {};
        const requete = {
          select(colonnes: string) {
            colonnesLues.push(colonnes);
            return requete;
          },
          eq(colonne: string, valeur: unknown) {
            filtres[colonne] = valeur;
            return requete;
          },
          async single() {
            const trouve = filtres.id === ANALYSE && filtres.user_id === UTILISATEUR;
            return trouve ? { data: ligne(modeleLu), error: null } : { data: null, error: { message: "absente" } };
          },
        };
        return requete;
      },
    }),
  },
});
mock.module(adresseDe("lib/supabase/admin.ts"), {
  namedExports: {
    createAdminClient: () => ({
      from(table: string) {
        return {
          select(colonnes: string) {
            lecturesAdmin.push(`${table} : ${colonnes}`);
            return {
              async in() {
                return { data: table === "models" ? [{ id: "modele-1", name: "Air Force 1" }] : [], error: null };
              },
            };
          },
        };
      },
    }),
  },
});
mock.module("next/navigation", {
  namedExports: {
    notFound: () => {
      throw new Error("notFound");
    },
    redirect: (vers: string) => {
      throw new Error(`redirect ${vers}`);
    },
  },
});
// Le rapport lui-même n'est pas rendu : on lit ce que la page lui passe.
function ReportView() {
  return null;
}
mock.module(adresseDe("components/check/ReportView.tsx"), { namedExports: { ReportView } });

const { default: CheckReportPage } = (await import(
  adresseDe("app/(dashboard)/check/[id]/page.tsx")
)) as typeof import("@/app/(dashboard)/check/[id]/page");

type Donnees = import("@/components/check/ReportView").ReportData;

/** Ce que la page transmet au composant client, pour un modèle lu en base. */
async function transmis(models: unknown): Promise<{ data: Donnees; props: unknown }> {
  modeleLu = models;
  const element = await CheckReportPage({ params: Promise.resolve({ id: ANALYSE }) });
  assert.equal(element.type, ReportView, "la page ne rend plus ReportView");
  const props = element.props as { data: Donnees };
  return { data: props.data, props };
}

test("la page lit le nom du modèle et ses points d'authentification, dans la même requête", async () => {
  colonnesLues.length = 0;
  await transmis({ name: "Air Force 1", authentication_points: POINTS });
  assert.equal(colonnesLues.length, 1);
  assert.match(colonnesLues[0], /\bmodels\(name, authentication_points\)/);
  assert.match(colonnesLues[0], /\bbrands\(name\)/);
});

test("la page passe au rapport la table des noms des zones du modèle", async () => {
  const { data } = await transmis({ name: "Air Force 1", authentication_points: POINTS });
  assert.deepEqual(data.zoneNames, {
    stitching: "Coutures",
    tongue_label: "Étiquette de languette",
    swoosh: "Forme et placement du Swoosh",
    heel_tab: "Tab talon",
  });
  assert.equal(data.modelName, "Air Force 1");
});

test("ni les points, ni leurs libellés entiers, ni leurs poids ne partent vers le navigateur", async () => {
  const { props } = await transmis({ name: "Air Force 1", authentication_points: POINTS });
  const envoye = JSON.stringify(props);
  for (const interdit of ["authentication_points", "weight", "0.25", "0.3", "regularite", "HJ8463-001", "courbe, pointe", "broderie Nike Air"]) {
    assert.ok(!envoye.includes(interdit), `transmis au navigateur : ${interdit}`);
  }
  // Les identifiants enregistrés ne changent pas : notes et observations gardent leurs clés.
  assert.deepEqual((props as { data: Donnees }).data.subScores, { stitching: 90, tongue_label: 80, swoosh: 85, heel_tab: 78 });
  assert.equal((props as { data: Donnees }).data.findings?.[0].zone, "swoosh");
});

test("modèle désactivé depuis (jointure vide) : le rapport s'affiche, table des noms vide, nom relu par le serveur", async () => {
  lecturesAdmin.length = 0;
  const { data } = await transmis(null);
  assert.deepEqual(data.zoneNames, {});
  assert.equal(data.modelName, "Air Force 1");
  // La relecture par la clé du serveur ne demande toujours que des noms.
  assert.deepEqual(lecturesAdmin, ["brands : id, name, slug", "models : id, name"]);
});

test("points absents ou mal formés : le rapport s'affiche, sans erreur", async () => {
  const cas: Array<[unknown, Record<string, string>]> = [
    [{ name: "Air Force 1" }, {}],
    [{ name: "Air Force 1", authentication_points: null }, {}],
    [{ name: "Air Force 1", authentication_points: "[]" }, {}],
    [{ name: "Air Force 1", authentication_points: { zone: "heel_tab", label: "Tab talon" } }, {}],
    [{ name: "Air Force 1", authentication_points: [] }, {}],
    [
      {
        name: "Air Force 1",
        authentication_points: [null, 3, "swoosh", { label: "Sans zone" }, { zone: "heel_tab" }, { zone: "stitching", label: 12 }],
      },
      { heel_tab: "Heel tab", stitching: "Coutures" },
    ],
  ];
  for (const [models, attendu] of cas) {
    const { data } = await transmis(models);
    assert.deepEqual(data.zoneNames, attendu, JSON.stringify(models));
    assert.equal(data.overallScore, 84);
  }
});
