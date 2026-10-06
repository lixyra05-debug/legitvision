// Un verdict non concluant (score de 45 à 74) s'affiche « Résultat non
// concluant », sur le badge du rapport comme sur les cartes du tableau de bord
// (décision d'Hector du 06/10 : un non concluant ne doit jamais accuser
// l'article). Avant, il s'affichait « Éléments suspects ».
// Ce test échoue si l'ancien libellé revient : dans les textes traduits, sur le
// badge du rapport, dans une page publique (les CGU le citaient entre
// parenthèses) ou n'importe où dans les sources de app/, components/, lib/ et
// des e-mails. La carte elle-même est rendue par
// tests/unit/tableau-de-bord-assistant.test.ts, qui exécute la vraie page.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { translations } from "@/lib/i18n/translations";
import { getVerdictLabel } from "@/lib/types";
import { calculateWeightedScore } from "@/lib/ai/scoring";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;
const source = (chemin: string) => readFileSync(new URL(chemin, racine), "utf8");

/** t("section.cle") lu dans les vrais textes français. */
function t(cle: string): string {
  let valeur: unknown = translations.fr;
  for (const partie of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[partie] : undefined;
  }
  return typeof valeur === "string" ? valeur : cle;
}

mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: {
    useTranslation: () => ({ locale: "fr", t, setLocale() {}, toggleLocale() {} }),
  },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
mock.module("next/navigation", { namedExports: { useRouter: () => ({ push() {}, refresh() {} }) } });
// next/font/local n'existe qu'à la compilation de Next : on remplace la police.
mock.module(adresseDe("components/brand/police-marque.ts"), {
  namedExports: { archivoMarque: { variable: "variable-police-marque", className: "", style: { fontFamily: "" } } },
});
mock.module(adresseDe("components/ThemeProvider.tsx"), {
  namedExports: { useTheme: () => ({ theme: "dark", toggleTheme() {}, setTheme() {} }) },
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { ReportView } = (await import(adresseDe("components/check/ReportView.tsx"))) as typeof import("@/components/check/ReportView");
const { VerdictLabel } = (await import(
  adresseDe("components/dashboard/DashboardI18nClient.tsx")
)) as typeof import("@/components/dashboard/DashboardI18nClient");
type ReportData = import("@/components/check/ReportView").ReportData;

// \s+ : dans un source JSX, le texte peut passer à la ligne entre deux mots.
const ANCIEN = /[ÉE]l[ée]ments\s+suspects/i;
const ANCIEN_EN = /suspicious\s+elements/i;
const NOUVEAU = "Résultat non concluant";

/** Tous les textes d'un dictionnaire, sans ses clés. */
function textes(noeud: unknown): string[] {
  if (typeof noeud === "string") return [noeud];
  return noeud && typeof noeud === "object" ? Object.values(noeud).flatMap(textes) : [];
}

const RAPPORT: ReportData = {
  id: "0f8fad5b-d9cb-469f-a165-70867728950e",
  brandName: "Nike",
  modelName: "Air Force 1",
  status: "completed",
  verdict: "inconclusive",
  confidence: "high",
  aiConfidence: "high",
  overallScore: 62,
  subScores: { stitching: 62, tongue_label: 60, swoosh: 64 },
  findings: [],
  analystSummary: "Les zones visibles ne permettent pas de conclure.",
  missingEvidence: [],
  ocrExtracted: null,
  recommendations: [],
  createdAt: "2026-10-06T10:00:00.000Z",
  zoneNames: null,
};
const rendre = (donnees: Partial<ReportData> = {}) =>
  renderToStaticMarkup(createElement(ReportView, { data: { ...RAPPORT, ...donnees } }));
/** Le texte du badge de verdict : la pastille arrondie de l'en-tête du rapport, avant le titre ; undefined sans pastille. */
const badge = (html: string) =>
  html.slice(html.indexOf("<main"), html.indexOf("<h1")).match(/<div class="[^"]*\brounded-full\b[^"]*">[\s\S]*?<span class="[^"]*">([^<]*)<\/span>/)?.[1];

test("textes : le verdict non concluant se lit « Résultat non concluant », en français comme sur les cartes", () => {
  assert.equal(translations.fr.results.inconclusive, NOUVEAU);
  assert.equal(getVerdictLabel("inconclusive", "fr"), NOUVEAU);
  assert.equal(getVerdictLabel("inconclusive"), NOUVEAU);
  assert.equal(getVerdictLabel("inconclusive", "en"), translations.en.results.inconclusive);
  // La bascule FR/EN est encore en production : le texte anglais est fixé lui aussi, et la carte
  // (lib/types.ts) dit la même chose que le badge (lib/i18n/translations.ts) pour les trois verdicts.
  assert.equal(translations.en.results.inconclusive, "Inconclusive result");
  assert.equal(getVerdictLabel("likely_authentic", "en"), translations.en.results.authentic);
  assert.equal(getVerdictLabel("likely_fake", "en"), translations.en.results.fake);
  assert.equal(getVerdictLabel("likely_authentic", "fr"), translations.fr.results.authentic);
  assert.equal(getVerdictLabel("likely_fake", "fr"), translations.fr.results.fake);
  // Les deux autres verdicts ne changent pas.
  assert.equal(getVerdictLabel("likely_authentic", "fr"), "Probablement authentique");
  assert.equal(getVerdictLabel("likely_fake", "fr"), "Probablement contrefait");
});

test("plus aucun texte, français ou anglais, ne dit « Éléments suspects » ; la clé qui le portait a disparu", () => {
  assert.deepEqual(textes(translations.fr).filter((texte) => ANCIEN.test(texte)), []);
  assert.deepEqual(textes(translations.en).filter((texte) => ANCIEN_EN.test(texte)), []);
  assert.ok(!("suspect" in translations.fr.results), "la clé results.suspect est revenue en français");
  assert.ok(!("suspect" in translations.en.results), "la clé results.suspect est revenue en anglais");
});

test("rapport : le badge d'un verdict non concluant dit « Résultat non concluant », jamais « Éléments suspects »", () => {
  for (const [nom, donnees] of [
    ["score de 62, terminé", {}],
    ["en revue expert, confiance faible", { status: "expert_review", confidence: "low" }],
    // Score de 45 à 60, confiance haute ou modérée : l'encadré « Résultat à interpréter avec prudence » s'affiche.
    ["en revue expert, confiance haute", { status: "expert_review", overallScore: 50 }],
  ] as Array<[string, Partial<ReportData>]>) {
    const html = rendre(donnees);
    assert.equal(badge(html), NOUVEAU, nom);
    assert.ok(!ANCIEN.test(html), `${nom} : « Éléments suspects » est encore dans la page`);
  }
  // Témoin : le dernier état rend bien l'encadré, que la confiance faible masque.
  assert.ok(rendre({ status: "expert_review", overallScore: 50 }).includes(t("results.uncertainResultTitle")));
  assert.ok(!rendre({ status: "expert_review", confidence: "low" }).includes(t("results.uncertainResultTitle")));
  // Témoins : les deux autres verdicts gardent leur texte, et le badge lu est bien celui de l'en-tête.
  assert.equal(badge(rendre({ verdict: "likely_authentic", overallScore: 82 })), "Probablement authentique");
  assert.equal(badge(rendre({ verdict: "likely_fake", overallScore: 30 })), "Probablement contrefait");
  assert.equal(badge(rendre({ verdict: null })), undefined, "sans verdict, aucune pastille n'est lue");
  // Photos jugées insuffisantes : la ligne porte le verdict « inconclusive », mais l'analyse
  // n'est pas facturée. Aucun badge de verdict au-dessus du panneau « non facturée ».
  const insuffisant = rendre({ aiConfidence: "insufficient", confidence: "low", overallScore: null, subScores: null });
  assert.equal(badge(insuffisant), undefined, "photos insuffisantes : un badge de verdict est affiché");
  assert.ok(!insuffisant.includes(NOUVEAU), "photos insuffisantes : « Résultat non concluant » est affiché");
});

test("bornes : un score de 45 ou de 74 est enregistré non concluant et s'affiche « Résultat non concluant » ; 44 et 75 ne le sont pas", () => {
  const verdictDe = (score: number) =>
    calculateWeightedScore({ subScores: { zone: score }, authenticationPoints: [{ zone: "zone", label: "Zone", weight: 1 }] }).verdict;
  for (const score of [45, 74]) {
    assert.equal(verdictDe(score), "inconclusive", `score de ${score}`);
    assert.equal(badge(rendre({ verdict: verdictDe(score), overallScore: score })), NOUVEAU, `score de ${score}`);
  }
  assert.equal(verdictDe(44), "likely_fake");
  assert.equal(verdictDe(75), "likely_authentic");
});

test("carte du tableau de bord : même texte que le badge du rapport", () => {
  const carte = (verdict: "likely_authentic" | "inconclusive" | "likely_fake") =>
    renderToStaticMarkup(createElement(VerdictLabel, { verdict }));
  assert.equal(carte("inconclusive"), NOUVEAU);
  assert.equal(carte("likely_authentic"), "Probablement authentique");
  assert.equal(carte("likely_fake"), "Probablement contrefait");
});

test("pages publiques (CGU, et les CGV quand elles existeront) : aucune ne cite l'ancien libellé ; les CGU disent toujours qu'un verdict non concluant est décompté", () => {
  const dossier = "app/(public)/";
  const pages = readdirSync(new URL(dossier, racine), { recursive: true, encoding: "utf8" }).filter((nom) => /\.tsx?$/.test(nom));
  assert.ok(pages.includes("cgu/page.tsx"), "les CGU ne sont plus lues");
  for (const page of pages) {
    assert.ok(!ANCIEN.test(source(dossier + page)), `${dossier}${page} cite encore « Éléments suspects »`);
  }
  assert.match(source("app/(public)/cgu/page.tsx"), /y compris un verdict non concluant ou une confiance faible\./);
});

test("sources : l'ancien libellé n'est plus écrit dans app/, components/, lib/ ni les e-mails, hors d'une ligne de commentaire", () => {
  const restes: string[] = [];
  for (const dossier of ["app", "components", "lib", "supabase/emails"]) {
    for (const fichier of readdirSync(new URL(`${dossier}/`, racine), { recursive: true, encoding: "utf8" })) {
      if (!/\.(tsx?|html)$/.test(fichier)) continue;
      // Les lignes de commentaire peuvent citer l'ancien libellé (elles disent pourquoi il a disparu).
      // Le reste est relu d'un bloc : un texte JSX peut passer à la ligne entre les deux mots.
      const code = source(`${dossier}/${fichier}`)
        .split("\n")
        .filter((ligne) => !/^\s*(\/\/|\/?\*|\{\/\*)/.test(ligne))
        .join("\n");
      if (ANCIEN.test(code) || ANCIEN_EN.test(code)) restes.push(`${dossier}/${fichier}`);
    }
  }
  assert.deepEqual(restes, []);
});
