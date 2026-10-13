// Le rapport ne doit jamais s'afficher en erreur (décision d'Hector du 13/10).
// La route n'en valide qu'une partie (score, notes par zone, verdict,
// confiance : lib/ai/analyze.ts) : les observations, les éléments manquants,
// les conseils, les textes lus et le résumé sont enregistrés tels que le
// modèle les a rendus. Avant, une liste rendue sous une autre forme faisait
// planter l'écran d'un rapport payé (« findings.map is not a function »), une
// observation sans note s'affichait « Suspect », en rouge, suivi de « /100 »
// seul, et la base injoignable donnait « 404, cette page n'existe pas ».
// Ce test exécute la vraie page (app/(dashboard)/check/[id]/page.tsx) et le
// vrai écran (ReportView) avec un faux client Supabase, sur des réponses mal
// formées, et échoue si :
// - la page lève une erreur, ou affiche « undefined », « [object Object] »,
//   « NaN » ou un « /100 » sans note ;
// - une lecture en erreur de l'analyse répond « introuvable » au lieu de lever
//   l'erreur que la page de repli attend ;
// - ce qui était lisible dans la réponse n'est plus affiché ;
// - une observation sans gravité ni note porte un jugement ou une couleur ;
// - la page de repli du rapport perd son texte, son numéro ou ses boutons.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { translations } from "@/lib/i18n/translations";
import { readAiConfidence, readFindings, readOcr, readProse, readSubScores, readText, readTextList } from "@/lib/report-data";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;

const UTILISATEUR = "7c9e6679-7425-40de-944b-e07fc1f90ae7";
const ANALYSE = "0f8fad5b-d9cb-469f-a165-70867728950e";

/** t("section.cle") lu dans les vrais textes français. */
function t(cle: string): string {
  let valeur: unknown = translations.fr;
  for (const partie of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[partie] : undefined;
  }
  return typeof valeur === "string" ? valeur : cle;
}
const FR = translations.fr.results;

// Points d'un modèle, tels que le catalogue les porte.
const POINTS = [
  { zone: "stitching", label: "Coutures (régularité, couleur du fil, tension)", weight: 0.3 },
  { zone: "tongue_label", label: "Étiquette de taille (languette : taille, code produit, pays)", weight: 0.25 },
  { zone: "swoosh", label: "Forme et placement du Swoosh (courbe, pointe)", weight: 0.25 },
  { zone: "heel_tab", label: "Languette du talon (broderie Nike Air)", weight: 0.2 },
];

/** La ligne `analyses` que la page lit : un rapport payé, bien formé, que chaque cas déforme. */
function ligne(champs: Record<string, unknown>): Record<string, unknown> {
  return {
    id: ANALYSE,
    status: "completed",
    verdict: "likely_authentic",
    confidence: "high",
    overall_score: 84,
    sub_scores: { stitching: 90, tongue_label: 80, swoosh: 85, heel_tab: 78 },
    findings: [{ zone: "swoosh", observation: "Courbe conforme.", score: 85 }],
    ai_raw_response: {
      analyst_summary: "Zones cohérentes.",
      confidence_level: "high",
      missing_evidence: ["photo de la boîte"],
      recommendations: ["Demandez la preuve d'achat."],
      ocr_extracted: { product_code: "DD1391-100" },
    },
    created_at: "2026-10-05T10:00:00.000Z",
    updated_at: "2026-10-05T10:01:00.000Z",
    brand_id: "marque-1",
    model_id: "modele-1",
    brands: { name: "Nike" },
    models: { name: "Dunk Low", authentication_points: POINTS },
    ...champs,
  };
}

let ligneLue: Record<string, unknown> = ligne({});
let parametres: Record<string, unknown> = { id: ANALYSE };
/** Ce que la base répond à la lecture de l'analyse, à la façon de postgrest-js : une erreur, jamais une exception. null = la ligne. */
let erreurDeLecture: { message: string; code?: string } | null = null;

mock.module(adresseDe("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: UTILISATEUR } } }) },
      from(table: string) {
        assert.equal(table, "analyses");
        const requete = {
          select: () => requete,
          eq: () => requete,
          single: async () => (erreurDeLecture ? { data: null, error: erreurDeLecture } : { data: ligneLue, error: null }),
        };
        return requete;
      },
    }),
  },
});
mock.module(adresseDe("lib/supabase/admin.ts"), {
  namedExports: {
    createAdminClient: () => {
      throw new Error("la clé du serveur ne doit pas servir : marque et modèle sont joints, l'analyse est terminée");
    },
  },
});
mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: { useTranslation: () => ({ locale: "fr", t, setLocale() {}, toggleLocale() {} }) },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
mock.module("next/navigation", {
  namedExports: {
    notFound: () => {
      throw new Error("notFound");
    },
    redirect: (vers: string) => {
      throw new Error(`redirect ${vers}`);
    },
    useRouter: () => ({ push() {}, refresh() {} }),
    useParams: () => parametres,
  },
});
// next/font/local n'existe qu'à la compilation de Next : on remplace la police.
mock.module(adresseDe("components/brand/police-marque.ts"), {
  namedExports: { archivoMarque: { variable: "variable-police-marque", className: "", style: { fontFamily: "" } } },
});
mock.module(adresseDe("components/ThemeProvider.tsx"), {
  namedExports: { useTheme: () => ({ theme: "dark", toggleTheme() {}, setTheme() {} }) },
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { default: CheckReportPage } = (await import(
  adresseDe("app/(dashboard)/check/[id]/page.tsx")
)) as typeof import("@/app/(dashboard)/check/[id]/page");
const { default: ReportErrorPage } = (await import(
  adresseDe("app/(dashboard)/check/[id]/error.tsx")
)) as typeof import("@/app/(dashboard)/check/[id]/error");
const { FindingCard } = (await import(adresseDe("components/check/FindingCard.tsx"))) as typeof import("@/components/check/FindingCard");
type Finding = import("@/components/check/FindingCard").Finding;

/** Texte d'un fragment HTML : balises retirées, entités de React décodées. */
const decoder = (html: string) =>
  html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const texte = (html: string) => decoder(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** La page du rapport rendue pour cette ligne : son HTML. Une erreur fait échouer le test qui l'appelle. */
async function rapport(champs: Record<string, unknown>): Promise<string> {
  ligneLue = ligne(champs);
  return renderToStaticMarkup(await CheckReportPage({ params: Promise.resolve({ id: ANALYSE }) }));
}

/** Ce qu'aucun rapport ne doit afficher : la trace d'une valeur mal formée arrivée jusqu'à l'écran. */
function sansTraceDeMalformation(html: string, cas: string): void {
  const page = texte(html);
  for (const trace of ["undefined", "[object Object]", "NaN", "Infinity"]) {
    assert.ok(!page.includes(trace), `${cas} : « ${trace} » affiché : ${page}`);
  }
  // Une note absente ne laisse pas « /100 » seul (React n'écrit ni undefined ni null).
  assert.doesNotMatch(page, /(?<![0-9])\/100/, `${cas} : « /100 » sans note : ${page}`);
}

/** Le HTML de la carte d'observation qui porte ce commentaire, de son cadre à la fin du commentaire. */
function carteObservation(html: string, commentaire: string): string {
  const fin = html.indexOf(commentaire);
  assert.ok(fin > 0, `observation « ${commentaire} » absente`);
  const debut = html.lastIndexOf('<div class="rounded-md border p-4', fin);
  assert.ok(debut > 0, `cadre de l'observation « ${commentaire} » introuvable`);
  return html.slice(debut, fin + commentaire.length);
}

const COULEURS_DE_JUGEMENT = /verdict-authentic|verdict-fake|warning/;

// ── Lecture des champs ─────────────────────────────────────

test("lecture d'un texte : un texte non vide, tel quel ; tout le reste est écarté", () => {
  assert.equal(readText("Zones cohérentes."), "Zones cohérentes.");
  assert.equal(readText("  gardé avec ses espaces  "), "  gardé avec ses espaces  ");
  for (const autre of [undefined, null, "", "   ", 12, true, {}, { texte: "x" }, ["x"], []]) {
    assert.equal(readText(autre), null, JSON.stringify(autre));
  }
});

test("lecture d'un texte à lire d'une traite : le texte, ou une liste de textes jointe par une espace", () => {
  assert.equal(readProse("Zones cohérentes."), "Zones cohérentes.");
  // Une liste de textes s'affichait déjà, bout à bout : elle n'est pas perdue.
  assert.equal(readProse(["Zones cohérentes.", "Rien à signaler."]), "Zones cohérentes. Rien à signaler.");
  assert.equal(readProse(["Zones cohérentes.", null, 3, { a: 1 }, "  ", "Rien à signaler."]), "Zones cohérentes. Rien à signaler.");
  for (const autre of [undefined, null, "", "  ", 12, true, {}, { texte: "x" }, [], [null, 3], [{ a: 1 }]]) {
    assert.equal(readProse(autre), null, JSON.stringify(autre));
  }
});

test("lecture d'une liste de textes : la liste, un texte seul, et rien d'autre", () => {
  assert.deepEqual(readTextList(["a", "b"]), ["a", "b"]);
  // Les éléments qui ne sont pas des textes sont écartés, les autres gardés dans l'ordre.
  assert.deepEqual(readTextList(["a", null, 3, "", "  ", { texte: "x" }, ["y"], "b"]), ["a", "b"]);
  assert.deepEqual(readTextList([]), []);
  // Un texte seul, rendu à la place de la liste, n'est pas perdu.
  assert.deepEqual(readTextList("Demandez la preuve d'achat."), ["Demandez la preuve d'achat."]);
  for (const autre of [undefined, null, "", "  ", 12, true, {}, { 0: "a" }]) {
    assert.equal(readTextList(autre), null, JSON.stringify(autre));
  }
});

test("lecture des textes lus sur l'article : un objet de textes ; un nombre s'écrit, le reste est écarté", () => {
  assert.deepEqual(readOcr({ product_code: "DD1391-100", size_label_text: 42, manufacturing_info: null, autre: { a: 1 }, vide: " " }), {
    product_code: "DD1391-100",
    size_label_text: "42",
  });
  assert.deepEqual(readOcr({}), {});
  // Un nombre qui ne s'écrit pas sans perte est écarté : un numéro de série de vingt chiffres s'afficherait arrondi.
  assert.deepEqual(readOcr({ serie: 12345678901234567890, code: 1e21, pointure: 42.5, zero: 0, infini: Number.POSITIVE_INFINITY }), { pointure: "42.5", zero: "0" });
  // Une clé au nom hérité d'Object passe comme les autres : c'est l'écran qui ne doit pas la confondre avec un libellé.
  assert.deepEqual(readOcr({ constructor: "Nike Inc.", toString: "x" }), { constructor: "Nike Inc.", toString: "x" });
  for (const autre of [undefined, null, "DD1391-100", 12, ["DD1391-100"], true]) {
    assert.equal(readOcr(autre), null, JSON.stringify(autre));
  }
});

test("lecture des notes par zone et de la confiance de l'IA : un objet, et l'une des quatre valeurs", () => {
  assert.deepEqual(readSubScores({ stitching: 90 }), { stitching: 90 });
  for (const autre of [undefined, null, "90", 90, [90, 80], true]) {
    assert.equal(readSubScores(autre), null, JSON.stringify(autre));
  }
  for (const niveau of ["high", "medium", "low", "insufficient"]) assert.equal(readAiConfidence(niveau), niveau);
  for (const autre of [undefined, null, "", "HIGH", "très haute", 1, {}, ["high"]]) {
    assert.equal(readAiConfidence(autre), null, JSON.stringify(autre));
  }
});

test("lecture des observations : la liste bien formée passe telle quelle", () => {
  const bien: Finding[] = [
    { zone: "swoosh", observation: "Courbe conforme.", score: 85 },
    { zone: "stitching", observation: "Fil irrégulier.", score: 30, severity: "critical" },
    // Une note de 0 est une note, et une note à virgule n'est pas arrondie : 69,5 reste sous le seuil de 70.
    { zone: "heel_tab", observation: "Broderie absente.", score: 0 },
    { zone: "tongue_label", observation: "Police proche.", score: 69.5 },
    { zone: "  date_code ", observation: "  Espaces gardés.  ", score: 40, severity: "minor" },
  ];
  assert.deepEqual(readFindings(bien), bien);
  assert.deepEqual(readFindings([]), []);
});

test("lecture des observations : chaque observation est ramenée à sa forme, sans rien inventer", () => {
  assert.deepEqual(
    readFindings([
      null,
      12,
      [],
      {},
      "Commentaire rendu seul.",
      { zone: "swoosh" },
      { observation: "Sans zone." },
      { zone: 12, observation: { texte: "objet" }, score: "85", severity: "grave" },
      { zone: "stitching", observation: "Note en texte.", score: " 72.5 " },
      { zone: "heel_tab", observation: "Note illisible.", score: "85/100" },
      { zone: "tongue_label", observation: "Note absente, gravité rendue.", severity: "important" },
      { zone: "  ", observation: "  ", score: null },
      { zone: "swoosh", observation: "Note à zéro, en texte.", score: "0" },
      { zone: "swoosh", observation: ["Commentaire en liste.", "Deuxième phrase."], score: 80 },
      { zone: "swoosh", observation: "Note de quatre cents chiffres.", score: "9".repeat(400) },
    ]),
    [
      { zone: "", observation: "Commentaire rendu seul." },
      { zone: "swoosh", observation: "" },
      { zone: "", observation: "Sans zone." },
      // Ni la zone (un nombre) ni le commentaire (un objet) ne sont des textes ; la note, elle, se lit.
      { zone: "", observation: "", score: 85 },
      { zone: "stitching", observation: "Note en texte.", score: 72.5 },
      { zone: "heel_tab", observation: "Note illisible." },
      { zone: "tongue_label", observation: "Note absente, gravité rendue.", severity: "important" },
      { zone: "swoosh", observation: "Note à zéro, en texte.", score: 0 },
      { zone: "swoosh", observation: "Commentaire en liste. Deuxième phrase.", score: 80 },
      { zone: "swoosh", observation: "Note de quatre cents chiffres." },
    ],
  );
});

test("lecture des observations : un objet rendu à la place de la liste est relu, zone par zone ou comme une observation seule", () => {
  // Une observation par zone.
  assert.deepEqual(
    readFindings({
      swoosh: { observation: "Courbe conforme.", score: 85 },
      stitching: "Fil irrégulier.",
      heel_tab: { zone: "heel_tab", observation: "Broderie nette.", score: 78, severity: "minor" },
      tongue_label: 80,
      box_label: null,
    }),
    [
      { zone: "swoosh", observation: "Courbe conforme.", score: 85 },
      { zone: "stitching", observation: "Fil irrégulier." },
      { zone: "heel_tab", observation: "Broderie nette.", score: 78, severity: "minor" },
    ],
  );
  // Une observation seule, sans sa liste.
  assert.deepEqual(readFindings({ zone: "swoosh", observation: "Courbe conforme.", score: 85 }), [
    { zone: "swoosh", observation: "Courbe conforme.", score: 85 },
  ]);
  assert.deepEqual(readFindings({ score: null }), []);
  // Une clé « score » ou « severity » égarée dans un objet par zone n'est pas une zone, et n'en fait pas une observation seule.
  assert.deepEqual(readFindings({ stitching: { observation: "Fil irrégulier.", score: 30 }, score: 85, severity: "minor" }), [
    { zone: "stitching", observation: "Fil irrégulier.", score: 30 },
  ]);
  // Des clés faites de chiffres sont des rangs, pas des zones.
  assert.deepEqual(readFindings({ 0: { zone: "swoosh", observation: "Courbe conforme.", score: 85 }, 1: { observation: "Sans zone.", score: 20 } }), [
    { zone: "swoosh", observation: "Courbe conforme.", score: 85 },
    { zone: "", observation: "Sans zone.", score: 20 },
  ]);
  for (const autre of [undefined, null, "Courbe conforme.", 12, true]) {
    assert.equal(readFindings(autre), null, JSON.stringify(autre));
  }
});

// ── La page et l'écran, sur des réponses mal formées ───────

test("témoin : un rapport bien formé affiche tout ce que la réponse porte", async () => {
  const html = await rapport({});
  const page = texte(html);
  for (const present of ["Nike", "Dunk Low", FR.authentic, "Zones cohérentes.", "Courbe conforme.", "85/100", "photo de la boîte", "Demandez la preuve d'achat.", "DD1391-100"]) {
    assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
  }
  sansTraceDeMalformation(html, "rapport bien formé");
});

// Chaque cas : ce qui est enregistré à la place de la forme attendue, ce qui doit rester affiché, ce qui ne doit pas l'être.
const CAS: Array<[nom: string, champs: Record<string, unknown>, presents: string[], absents: string[]]> = [
  ["observations rendues en objet, une par zone", { findings: { swoosh: { observation: "Courbe conforme.", score: 85 }, stitching: "Fil irrégulier." } }, ["Courbe conforme.", "85/100", "Fil irrégulier."], []],
  ["une observation seule, sans sa liste", { findings: { zone: "swoosh", observation: "Courbe conforme.", score: 85 } }, ["Courbe conforme.", "85/100"], []],
  ["observations rendues en texte", { findings: "Courbe conforme." }, ["Zones cohérentes."], [FR.findingsTitle]],
  ["observations rendues en nombre", { findings: 3 }, ["Zones cohérentes."], [FR.findingsTitle]],
  ["observations nulles, vides ou d'un autre type dans la liste", { findings: [null, 12, {}, [], "Commentaire seul.", { zone: "swoosh", observation: "Courbe conforme.", score: 85 }] }, ["Commentaire seul.", "Courbe conforme.", "85/100"], []],
  ["commentaire d'observation rendu en objet", { findings: [{ zone: "swoosh", observation: { texte: "objet" }, score: 85 }] }, ["Forme et placement du Swoosh", "85/100"], []],
  ["note d'observation rendue en texte", { findings: [{ zone: "swoosh", observation: "Courbe conforme.", score: "85" }] }, ["Courbe conforme.", "85/100", "Conforme"], ["Sans note"]],
  ["éléments manquants rendus en texte", { ai_raw_response: { analyst_summary: "Zones cohérentes.", missing_evidence: "photo de la boîte" } }, ["photo de la boîte"], []],
  ["éléments manquants rendus en objet", { ai_raw_response: { analyst_summary: "Zones cohérentes.", missing_evidence: { 0: "photo de la boîte" } } }, ["Zones cohérentes."], [FR.missingEvidenceTitle]],
  ["éléments manquants : des objets dans la liste", { ai_raw_response: { missing_evidence: [{ zone: "x" }, "photo de la boîte", 4, null] } }, ["photo de la boîte"], []],
  ["conseils rendus en texte", { ai_raw_response: { recommendations: "Demandez la preuve d'achat." } }, ["Demandez la preuve d'achat."], []],
  ["conseils rendus en objet", { ai_raw_response: { recommendations: { premier: "Demandez la preuve d'achat." } } }, [], [FR.recommendationsTitle]],
  ["conseils : des objets dans la liste", { ai_raw_response: { recommendations: [{ a: 1 }, "Demandez la preuve d'achat.", ["x"]] } }, ["Demandez la preuve d'achat."], []],
  ["texte lu rendu en nombre", { ai_raw_response: { ocr_extracted: { size_label_text: 42, product_code: "DD1391-100" } } }, ["42", "DD1391-100"], []],
  ["texte lu rendu en objet ou nul", { ai_raw_response: { ocr_extracted: { size_label_text: { taille: 42 }, manufacturing_info: null, product_code: "DD1391-100" } } }, ["DD1391-100"], [FR.sizeLabelText]],
  ["textes lus rendus en liste", { ai_raw_response: { ocr_extracted: ["DD1391-100"] } }, [], [FR.ocrTitle]],
  ["textes lus rendus en texte", { ai_raw_response: { ocr_extracted: "DD1391-100" } }, [], [FR.ocrTitle]],
  ["résumé rendu en objet", { ai_raw_response: { analyst_summary: { texte: "Zones cohérentes." } } }, [FR.authentic], [`${FR.summary} :`]],
  ["résumé rendu en liste de textes", { ai_raw_response: { analyst_summary: ["Zones cohérentes.", "Rien à signaler."] } }, [`${FR.summary} : Zones cohérentes. Rien à signaler.`], []],
  ["résumé rendu en liste d'objets", { ai_raw_response: { analyst_summary: [{ texte: "Zones cohérentes." }] } }, [FR.authentic], [`${FR.summary} :`]],
  ["commentaire d'observation rendu en liste de textes", { findings: [{ zone: "swoosh", observation: ["Courbe conforme.", "Pointe nette."], score: 85 }] }, ["Courbe conforme. Pointe nette.", "85/100"], []],
  ["note d'observation à zéro", { findings: [{ zone: "swoosh", observation: "Logo absent.", score: 0 }] }, ["Logo absent.", "Suspect", "0/100"], ["Sans note"]],
  ["note d'observation à zéro, en texte", { findings: [{ zone: "swoosh", observation: "Logo absent.", score: "0" }] }, ["Logo absent.", "Suspect", "0/100"], ["Sans note"]],
  ["texte lu sous une clé au nom hérité d'Object", { ai_raw_response: { ocr_extracted: { constructor: "Nike Inc.", toString: "x", hasOwnProperty: "y", product_code: "DD1391-100" } } }, ["constructor", "Nike Inc.", "toString", "DD1391-100", FR.productCode], []],
  ["texte lu : un nombre trop grand pour s'écrire juste", { ai_raw_response: { ocr_extracted: { serial: 12345678901234567890, product_code: "DD1391-100" } } }, ["DD1391-100"], ["12345678901234567000", "serial"]],
  ["observations par zone avec une clé « score » égarée", { findings: { stitching: { observation: "Fil irrégulier.", score: 30 }, score: 85 } }, ["Fil irrégulier.", "30/100", `${FR.findingsTitle} (1)`], ["85/100"]],
  ["résumé rendu en nombre", { ai_raw_response: { analyst_summary: 84 } }, [FR.authentic], [`${FR.summary} :`]],
  ["réponse du modèle enregistrée en texte", { ai_raw_response: "réponse illisible" }, [FR.authentic, "Courbe conforme."], ["réponse illisible"]],
  ["réponse du modèle enregistrée en liste", { ai_raw_response: [{ analyst_summary: "Zones cohérentes." }] }, [FR.authentic], []],
  ["réponse du modèle absente", { ai_raw_response: null }, [FR.authentic, "Courbe conforme."], []],
  ["notes par zone rendues en liste", { sub_scores: [90, 80, 85] }, [FR.authentic, "Courbe conforme."], [FR.subScoresTitle]],
  ["notes par zone rendues en texte", { sub_scores: "90" }, [FR.authentic], [FR.subScoresTitle]],
  ["confiance de l'IA inconnue", { ai_raw_response: { analyst_summary: "Zones cohérentes.", confidence_level: { niveau: "insufficient" } } }, [FR.authentic, "Zones cohérentes."], [FR.insufficientTitle]],
  ["tout à la fois", { findings: { a: 1 }, sub_scores: [1], ai_raw_response: { analyst_summary: {}, missing_evidence: 1, recommendations: {}, ocr_extracted: [], confidence_level: [] } }, [FR.authentic], []],
];

for (const [nom, champs, presents, absents] of CAS) {
  test(`réponse mal formée, ${nom} : le rapport s'affiche, sans erreur ni valeur brute`, async () => {
    const html = await rapport(champs);
    const page = texte(html);
    // Le rapport lui-même : son en-tête, son score, ses boutons.
    for (const present of ["Nike", "Dunk Low", FR.authentic, FR.newAnalysis, ...presents]) {
      assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
    }
    for (const absent of absents) assert.ok(!page.includes(absent), `« ${absent} » affiché : ${page}`);
    sansTraceDeMalformation(html, nom);
  });
}

test("analyse insuffisante dont la réponse est mal formée : le panneau « non facturée » s'affiche quand même", async () => {
  const html = await rapport({
    verdict: "inconclusive", confidence: "low", overall_score: null, sub_scores: null, findings: "rien",
    ai_raw_response: { confidence_level: "insufficient", missing_evidence: "étiquette de taille nette", recommendations: { a: 1 }, analyst_summary: [] },
  });
  const page = texte(html);
  for (const present of [FR.insufficientTitle, FR.insufficientNoCredit, "étiquette de taille nette"]) {
    assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
  }
  sansTraceDeMalformation(html, "analyse insuffisante");
});

// ── Lecture de l'analyse en erreur ─────────────────────────

/** Ce que fait la page quand la base répond ceci à la lecture de l'analyse : le message de l'erreur levée. */
async function issue(erreur: { message: string; code?: string }): Promise<string> {
  erreurDeLecture = erreur;
  try {
    await CheckReportPage({ params: Promise.resolve({ id: ANALYSE }) });
    return "rendue";
  } catch (levee) {
    return levee instanceof Error ? levee.message : String(levee);
  } finally {
    erreurDeLecture = null;
  }
}

test("analyse absente : « introuvable », pour aucune ligne comme pour un identifiant d'adresse mal formé", async () => {
  // PGRST116 : .single() n'a trouvé aucune ligne (l'analyse n'existe pas, ou n'est pas celle du client).
  assert.equal(await issue({ message: "JSON object requested, multiple (or no) rows returned", code: "PGRST116" }), "notFound");
  // 22P02 : l'identifiant de l'adresse n'est pas un UUID.
  assert.equal(await issue({ message: 'invalid input syntax for type uuid: "abc"', code: "22P02" }), "notFound");
});

test("base injoignable ou lecture en erreur : la page lève une erreur (page de repli), elle ne répond pas « introuvable »", async () => {
  // Avant le 13/10, toute erreur de lecture donnait « 404, cette page n'existe
  // pas » à la place d'un rapport payé. postgrest-js rend l'erreur, il ne la
  // lève pas : réseau coupé, jeton refusé, délai dépassé.
  for (const erreur of [
    { message: "TypeError: fetch failed", code: "" },
    { message: "TypeError: fetch failed" },
    { message: "JWT expired", code: "PGRST301" },
    { message: "canceling statement due to statement timeout", code: "57014" },
  ]) {
    const levee = await issue(erreur);
    assert.equal(levee, "lecture de l'analyse impossible", JSON.stringify(erreur));
    // Le message levé ne recopie rien de l'erreur de la base.
    assert.ok(!levee.includes(erreur.message), levee);
  }
  // Témoin : sans erreur, la même page s'affiche.
  assert.equal(await issue(null as unknown as { message: string }), "rendue");
});

// ── Observation sans note ──────────────────────────────────

const rendre = (finding: Partial<Finding>) => renderToStaticMarkup(createElement(FindingCard, finding as Finding));

test("observation sans gravité ni note : « Sans note », le commentaire de l'IA, aucun jugement, aucune couleur, pas de « /100 »", () => {
  for (const [cas, finding] of [
    ["note absente", { zone: "swoosh", observation: "Courbe peu lisible sur la photo." }],
    ["note illisible", { zone: "swoosh", observation: "Courbe peu lisible sur la photo.", score: Number.NaN }],
    ["note d'un autre type", { zone: "swoosh", observation: "Courbe peu lisible sur la photo.", score: "85/100" as unknown as number }],
  ] as const) {
    const carte = rendre(finding);
    const contenu = texte(carte);
    assert.ok(contenu.includes("Sans note") && contenu.includes("Courbe peu lisible sur la photo."), `${cas} : ${contenu}`);
    // Avant le 13/10 : « Suspect », en rouge, avec « undefined/100 ».
    for (const absent of ["Suspect", "Conforme", "À vérifier", "/100", "undefined", "NaN"]) {
      assert.ok(!contenu.includes(absent), `${cas} : « ${absent} » affiché : ${contenu}`);
    }
    assert.doesNotMatch(carte, COULEURS_DE_JUGEMENT, `${cas} : une couleur de jugement`);
    // Une icône qui ne juge pas : ni coche, ni croix, ni triangle.
    assert.match(carte, /lucide-circle-dashed/, cas);
    assert.doesNotMatch(carte, /lucide-circle-check|lucide-circle-x|lucide-triangle-alert/, cas);
  }
});

test("observation sans note mais avec une gravité : le jugement de l'IA, sans « /100 »", () => {
  for (const [severity, label, couleur] of [
    ["critical", "Suspect", /verdict-fake/],
    ["important", "À vérifier", /warning/],
    ["minor", "Conforme", /verdict-authentic/],
  ] as const) {
    const carte = rendre({ zone: "swoosh", observation: "Commentaire.", severity });
    const contenu = texte(carte);
    assert.ok(contenu.includes(label), `${severity} : ${contenu}`);
    assert.match(carte, couleur, severity);
    for (const absent of ["/100", "undefined", "Sans note"]) assert.ok(!contenu.includes(absent), `${severity} : « ${absent} » affiché : ${contenu}`);
  }
});

test("témoins : une observation notée garde son jugement, sa couleur et sa note, y compris à 0", () => {
  for (const [score, label, couleur] of [
    [85, "Conforme", /verdict-authentic/],
    [70, "Conforme", /verdict-authentic/],
    [55, "À vérifier", /warning/],
    [40, "À vérifier", /warning/],
    [12, "Suspect", /verdict-fake/],
    // Une note de 0 est une note : « Suspect », avec « 0/100 ».
    [0, "Suspect", /verdict-fake/],
  ] as const) {
    const carte = rendre({ zone: "swoosh", observation: "Commentaire.", score });
    const contenu = texte(carte);
    assert.ok(contenu.includes(label) && contenu.includes(`${score}/100`), `${score} : ${contenu}`);
    assert.match(carte, couleur, String(score));
    assert.ok(!contenu.includes("Sans note"), `${score} : ${contenu}`);
  }
});

test("rapport : une observation sans note s'y affiche « Sans note », à côté d'une observation notée qui garde sa couleur", async () => {
  const html = await rapport({
    findings: [
      { zone: "swoosh", observation: "observation notée", score: 12 },
      { zone: "stitching", observation: "observation sans note" },
      null,
    ],
  });
  const sansNote = carteObservation(html, "observation sans note");
  assert.ok(texte(sansNote).includes("Coutures") && texte(sansNote).includes("Sans note"), texte(sansNote));
  assert.doesNotMatch(sansNote, COULEURS_DE_JUGEMENT);
  assert.ok(!texte(sansNote).includes("/100"), texte(sansNote));
  const notee = carteObservation(html, "observation notée");
  assert.ok(texte(notee).includes("Suspect") && texte(notee).includes("12/100"), texte(notee));
  assert.match(notee, /verdict-fake/);
  // L'observation nulle n'a pas de carte : deux observations, pas trois.
  assert.ok(texte(html).includes(`${FR.findingsTitle} (2)`), texte(html));
  sansTraceDeMalformation(html, "observation sans note");
});

// ── Page de repli ──────────────────────────────────────────

/** La page de repli rendue : son HTML. `retry` n'est pas appelé au rendu. */
function repli(error: unknown, params: Record<string, unknown>): string {
  parametres = params;
  try {
    return renderToStaticMarkup(
      createElement(ReportErrorPage, { error, retry: () => assert.fail("« Réessayer » appelé au rendu"), reset() {} } as unknown as Parameters<typeof ReportErrorPage>[0]),
    );
  } finally {
    parametres = { id: ANALYSE };
  }
}

test("page de repli du rapport : le texte fixé par Hector, le numéro de l'analyse, l'adresse de contact, « Réessayer » et le tableau de bord", () => {
  const html = repli(Object.assign(new Error("détail interne à ne pas afficher"), { digest: "1234567890" }), { id: ANALYSE });
  const page = texte(html);
  // Décision d'Hector du 13/10, mot pour mot, dans cet ordre.
  assert.ok(
    page.includes("Ce rapport ne s'affiche pas pour le moment. Réessayez dans quelques instants. Numéro de l'analyse : 0F8FAD5B."),
    page,
  );
  // Puis l'adresse de contact (décision d'Hector du 13/10 : « c'est là qu'un client qui a payé en a besoin »), sans promesse.
  assert.ok(
    page.includes("Numéro de l'analyse : 0F8FAD5B. Si le rapport ne revient pas, écrivez-nous à legitvision.contact@gmail.com en indiquant ce numéro. Référence : 1234567890"),
    page,
  );
  // L'adresse en clair, et un lien qui ouvre un message dont l'objet porte le numéro.
  const lien = html.match(/<a href="(mailto:[^"]+)"[^>]*>legitvision\.contact@gmail\.com<\/a>/);
  assert.ok(lien, html);
  const adresse = new URL(lien[1].replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
  assert.equal(adresse.pathname, "legitvision.contact@gmail.com");
  assert.equal(adresse.searchParams.get("subject"), "Analyse 0F8FAD5B : le rapport ne s'affiche pas");
  assert.deepEqual([...adresse.searchParams.keys()], ["subject"]);
  for (const present of ["Réessayer", "Tableau de bord"]) {
    assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
  }
  // Aucune promesse, ni sur l'analyse (la base peut être en panne, et rien ne l'a lue), ni sur une réponse.
  for (const promesse of ["enregistr", "perdu", "sauvegard", "conserv", "répond", "sous 24", "rembours", "garanti"]) {
    assert.ok(!page.toLowerCase().includes(promesse), `« ${promesse} » : promesse affichée : ${page}`);
  }
  // Jamais le détail de l'erreur.
  assert.ok(!page.includes("détail interne"), page);
  // Un seul bouton à l'accent (« Réessayer ») ; le tableau de bord en lien secondaire, pas l'accueil.
  assert.equal(html.split("bg-accent ").length - 1, 1, html);
  assert.match(html, /<button type="button"[^>]*>Réessayer<\/button>/);
  assert.match(html, /<a [^>]*href="\/dashboard"[^>]*>Tableau de bord<\/a>/);
  assert.doesNotMatch(html, /href="\/"/);
});

test("page de repli du rapport : sans référence ni numéro lisibles, elle s'affiche quand même, quelle que soit la valeur levée", () => {
  for (const [cas, error, params] of [
    ["erreur sans référence", new Error("x"), { id: ANALYSE }],
    ["valeur levée qui n'est pas une erreur", "texte levé", { id: ANALYSE }],
    ["valeur nulle", null, { id: ANALYSE }],
    ["adresse sans identifiant", new Error("x"), {}],
    ["identifiant d'un autre type", new Error("x"), { id: ["a", "b"] }],
  ] as const) {
    const html = repli(error, params);
    const page = texte(html);
    assert.ok(page.includes("Ce rapport ne s'affiche pas pour le moment. Réessayez dans quelques instants.") && page.includes("Réessayer"), `${cas} : ${page}`);
    assert.ok(!page.includes("Référence :"), `${cas} : ${page}`);
    // Sans identifiant lisible dans l'adresse, la phrase du numéro n'est pas affichée (jamais un numéro vide).
    const avecNumero = "id" in params && typeof params.id === "string";
    assert.equal(page.includes("Numéro de l'analyse :"), avecNumero, `${cas} : ${page}`);
    // L'adresse de contact reste ; sans numéro, la phrase n'en demande pas, et l'objet du message n'en porte pas.
    assert.ok(page.includes("Si le rapport ne revient pas, écrivez-nous à legitvision.contact@gmail.com"), `${cas} : ${page}`);
    // Lu dans le HTML : le texte de la page sépare l'adresse de ce qui la suit.
    const suite = avecNumero ? "legitvision.contact@gmail.com</a> en indiquant ce numéro.</p>" : "legitvision.contact@gmail.com</a>.</p>";
    assert.ok(html.includes(suite), `${cas} : ${html}`);
    assert.equal(page.includes("ce numéro"), avecNumero, `${cas} : ${page}`);
    assert.equal(html.includes('href="mailto:legitvision.contact@gmail.com?subject=Analyse%200F8FAD5B'), avecNumero, `${cas} : ${html}`);
    assert.equal(html.includes('href="mailto:legitvision.contact@gmail.com"'), !avecNumero, `${cas} : ${html}`);
    for (const trace of ["undefined", "[object Object]", "texte levé"]) assert.ok(!page.includes(trace), `${cas} : « ${trace} » affiché`);
  }
});
