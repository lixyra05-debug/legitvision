// Lot du rapport d'octobre (décisions d'Hector du 05/10). Ce test rend le
// rapport (ReportView) et une observation (FindingCard) en HTML, textes
// français réels, et échoue si l'un de ces comportements est annulé :
// - les zones portent leur nom français dans « Scores par zone » et dans le
//   titre de chaque observation, sans mise en capitales par le CSS ;
// - le libellé ambre des observations est « À vérifier », plus « Attention » ;
// - en confiance faible, un seul encadré ambre : le bandeau placé avant le
//   score ; le bloc de confiance de la carte du score ne s'affiche plus ;
// - la phrase « Cette analyse n'est pas facturée… » tient 4,5:1 sur le fond de
//   son panneau, dans les deux thèmes ;
// - sous 640 px, le rapport ne réserve plus la place d'une bulle flottante ;
// - une note sans nom de zone reste affichée, sous un libellé neutre ;
// - un nom de zone long garde un écart avec sa note.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { translations } from "@/lib/i18n/translations";
import { zoneNamesForPoints } from "@/lib/zone-names";
import { contraste, jetons, melange, rvb } from "./support/contraste";

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
const { FindingCard } = (await import(adresseDe("components/check/FindingCard.tsx"))) as typeof import("@/components/check/FindingCard");
type ReportData = import("@/components/check/ReportView").ReportData;
type Finding = import("@/components/check/FindingCard").Finding;

/** Texte d'un fragment HTML : balises retirées, entités de React décodées. */
const decoder = (html: string) =>
  html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const texte = (html: string) => decoder(html.replace(/<[^>]+>/g, "")).trim();
const compter = (html: string, motif: string) => html.split(motif).length - 1;
/** Toutes les classes d'un fragment HTML. */
const classes = (html: string) => [...html.matchAll(/\bclass="([^"]*)"/g)].flatMap(([, c]) => c.split(/\s+/));

// Points d'un modèle de sneakers, tels que le catalogue les porte (relevé du
// 2026-10-05) : identifiant, libellé (avec ses fautes), poids.
const POINTS = [
  { zone: "stitching", label: "Coutures (regularite, couleur du fil, tension)", weight: 0.2 },
  { zone: "tongue_label", label: "Etiquette de langue (taille, code produit, pays)", weight: 0.2 },
  { zone: "swoosh", label: "Forme et placement du Swoosh (courbe, pointe)", weight: 0.2 },
  { zone: "heel_tab", label: "Tab talon (broderie Nike Air)", weight: 0.15 },
  { zone: "toe_box", label: "Forme et perforations de la toe box", weight: 0.15 },
  { zone: "date_code", label: "Code date (format, police)", weight: 0.1 },
];

const RAPPORT: ReportData = {
  id: "0f8fad5b-d9cb-469f-a165-70867728950e",
  brandName: "Nike",
  modelName: "Air Force 1",
  status: "completed",
  verdict: "likely_authentic",
  confidence: "high",
  aiConfidence: "high",
  overallScore: 82,
  subScores: { stitching: 90, tongue_label: 85, swoosh: 80, heel_tab: 78, toe_box: 76, date_code: 88, insole_print: 70 },
  findings: [],
  analystSummary: "Les zones visibles sont cohérentes avec le modèle.",
  missingEvidence: [],
  ocrExtracted: null,
  recommendations: [],
  createdAt: "2026-10-05T10:00:00.000Z",
  zoneNames: zoneNamesForPoints(POINTS),
};

const rendre = (donnees: Partial<ReportData> = {}) =>
  renderToStaticMarkup(createElement(ReportView, { data: { ...RAPPORT, ...donnees } }));

/** Les barres de « Scores par zone » : nom affiché et note. */
function barres(html: string): Array<[string, number]> {
  return [
    ...html.matchAll(
      /<span class="([^"]*)">([^<]*)<\/span><span class="[^"]*\btabular-nums\b[^"]*">(\d+)<\/span>/g,
    ),
  ].map(([, , nom, note]) => [decoder(nom), Number(note)]);
}

/** Le titre d'une observation : le premier texte de la carte. */
function titre(html: string): { texte: string; classes: string[] } {
  const span = html.match(/<span class="([^"]*)">([^<]*)<\/span>/);
  assert.ok(span, `observation sans titre : ${html}`);
  return { texte: decoder(span[2]), classes: span[1].split(/\s+/) };
}

const observation = (finding: Partial<Finding>, zoneNames: ReportData["zoneNames"] = RAPPORT.zoneNames) =>
  renderToStaticMarkup(
    createElement(FindingCard, { zone: "stitching", observation: "Points réguliers.", score: 90, ...finding, zoneNames }),
  );

// ── B1 : noms des zones en français ─────────────────────────────────────────

test("« Scores par zone » : chaque barre porte le nom français de sa zone, plus son identifiant", () => {
  const html = rendre();
  assert.deepEqual(barres(html), [
    ["Coutures", 90],
    ["Étiquette de languette", 85],
    ["Forme et placement du Swoosh", 80],
    ["Tab talon", 78],
    ["Forme et perforations de la toe box", 76],
    ["Code date / puce RFID", 88],
    // Zone notée par l'IA hors des points du modèle : identifiant rendu lisible.
    ["Insole print", 70],
  ]);
  const affiche = texte(html);
  for (const identifiant of ["stitching", "tongue label", "tongue_label", "heel tab", "heel_tab", "date code", "Etiquette de langue"]) {
    assert.ok(!affiche.includes(identifiant), `identifiant ou libellé brut affiché : ${identifiant}`);
  }
  assert.equal(compter(affiche, `${t("results.subScoresTitle")}(7)`), 1, "le compte des zones ne change pas");
});

test("le rapport ne met plus rien en capitales par le CSS : « Code date / puce RFID » reste tel quel", () => {
  const html = rendre({
    findings: [{ zone: "date_code", observation: "Code lisible.", score: 88 }],
  });
  assert.ok(!classes(html).includes("capitalize"), "classe capitalize : elle écrirait « Code Date / Puce Rfid »");
  assert.equal(compter(texte(html), "Code date / puce RFID"), 2, "une barre et une observation");
});

test("observation : le titre est le nom français de la zone, identifiant ou texte libre de l'IA", () => {
  const attendus: Array<[string, string]> = [
    ["stitching", "Coutures"],
    ["tongue_label", "Étiquette de languette"],
    ["Tongue Label", "Étiquette de languette"],
    ["tongue-label", "Étiquette de languette"],
    ["heel_tab", "Tab talon"],
    ["Heel tab", "Tab talon"],
    ["toe_box", "Forme et perforations de la toe box"],
    // Zone courante absente des points du modèle.
    ["zipper", "Fermeture éclair"],
    // Sans nom connu : l'identifiant rendu lisible, le texte libre tel quel.
    ["insole_print", "Insole print"],
    ["Renfort de l'avant-pied", "Renfort de l'avant-pied"],
  ];
  for (const [zone, nom] of attendus) {
    const { texte: affiche, classes: c } = titre(observation({ zone }));
    assert.equal(affiche, nom, zone);
    assert.ok(!c.includes("capitalize"), `${zone} : classe capitalize`);
  }
});

test("le rapport transmet la table des noms à chaque observation", () => {
  const html = rendre({
    findings: [
      { zone: "swoosh", observation: "Courbe conforme.", score: 80 },
      { zone: "Heel Tab", observation: "Broderie nette.", score: 78 },
    ],
  });
  const affiche = texte(html);
  // Une fois dans « Scores par zone », une fois en titre d'observation.
  assert.equal(compter(affiche, "Forme et placement du Swoosh"), 2);
  assert.equal(compter(affiche, "Tab talon"), 2);
  assert.doesNotMatch(affiche, /swoosh|heel/, "identifiant affiché");
});

test("sans table des noms (modèle absent) : jamais d'erreur, zones courantes en français, les autres lisibles", () => {
  for (const zoneNames of [null, {}]) {
    const html = rendre({
      zoneNames,
      findings: [{ zone: "heel_tab", observation: "Broderie nette.", score: 78 }],
    });
    assert.deepEqual(barres(html).map(([nom]) => nom), [
      "Coutures",
      "Étiquette de languette",
      "Swoosh",
      "Heel tab",
      "Toe box",
      "Code date / puce RFID",
      "Insole print",
    ]);
    assert.equal(titre(observation({ zone: "heel_tab" }, zoneNames)).texte, "Heel tab");
  }
  assert.equal(titre(observation({ zone: "stitching" }, undefined)).texte, "Coutures");
});

test("observation sans zone (réponse de l'IA mal formée) : pas d'erreur, pas de titre vide", () => {
  for (const zone of [undefined, null, 12, ""]) {
    const html = observation({ zone: zone as unknown as string });
    assert.ok(texte(html).includes("Points réguliers."), "le commentaire de l'IA reste affiché");
    assert.doesNotMatch(html, /<span class="[^"]*"><\/span>/, "titre vide rendu");
  }
});

test("note sans nom de zone (clé vide ou faite de séparateurs) : la barre garde sa note, sous un libellé neutre", () => {
  // Réponse de l'IA mal formée : lib/ai/analyze.ts ne vérifie pas les clés de sub_scores.
  const html = rendre({ subScores: { stitching: 90, "": 50, _: 40, "-": 30, "  ": 20, "__-__": 10 } });
  const neutre = t("results.unnamedZone");
  assert.equal(neutre, "Zone non précisée");
  assert.deepEqual(barres(html), [
    ["Coutures", 90],
    [neutre, 50],
    [neutre, 40],
    [neutre, 30],
    [neutre, 20],
    [neutre, 10],
  ]);
  // Aucune note n'est cachée : le compte du titre est celui des barres.
  assert.equal(compter(texte(html), `${t("results.subScoresTitle")}(6)`), 1);
  // Une zone qui a un nom ne prend jamais le libellé neutre.
  assert.ok(!texte(rendre()).includes(neutre));
});

test("« Scores par zone » : la ligne garde un écart entre le nom et la note, qui ne rétrécit pas", () => {
  const html = rendre();
  const lignes = [
    ...html.matchAll(/<div class="([^"]*)"><span class="[^"]*">[^<]*<\/span><span class="([^"]*\btabular-nums\b[^"]*)">\d+<\/span><\/div>/g),
  ];
  assert.equal(lignes.length, 7, "une ligne nom + note par barre");
  for (const [, ligne, note] of lignes) {
    // 12 px au moins : un nom long passe à la ligne avant de toucher sa note
    // (mesuré dans Chromium par rapport-navigateur.test.ts).
    assert.ok(ligne.split(/\s+/).includes("gap-3"), `ligne sans écart : ${ligne}`);
    assert.ok(note.split(/\s+/).includes("shrink-0"), `note qui peut rétrécir : ${note}`);
  }
});

// Garde pour la fusion avec la branche de la relance (feat/couverture-confiance) :
// elle ajoute au rapport la liste « Zones restées sans note », qui affichait
// encore l'identifiant brut des zones (zone.replace(/_/g, " ") et la classe
// capitalize). Hector demande les noms français « partout, y compris dans
// Zones restées sans note » : chaque affichage d'une zone passe par zoneNameIn.
test("source du rapport : aucune zone n'est affichée par son identifiant brut ni mise en capitales par le CSS", () => {
  const rapport = source("components/check/ReportView.tsx");
  const observation = source("components/check/FindingCard.tsx");
  for (const [fichier, code] of [["ReportView.tsx", rapport], ["FindingCard.tsx", observation]] as const) {
    // Hors commentaires : la classe capitalize dans un className.
    assert.doesNotMatch(code, /className=(?:"[^"]*|\{`[^`]*)\bcapitalize\b/, `${fichier} : classe capitalize`);
    assert.doesNotMatch(code, /zone\w*\.replace\(/i, `${fichier} : identifiant de zone mis en forme à la main`);
    assert.doesNotMatch(code, /\bzoneName\s*=\s*\(/, `${fichier} : fonction locale de nom de zone, au lieu de zoneNameIn`);
  }
  // Le seul remplacement de « _ » qui reste : les clés des textes détectés (OCR), qui ne sont pas des zones.
  assert.deepEqual(rapport.match(/\w+\.replace\(\/_\/g, " "\)/g), ['key.replace(/_/g, " ")']);
  assert.equal(observation.includes(".replace(/_/g"), false);
});

// ── B5 : « Attention » devient « À vérifier », l'ambre ne change pas ────────

test("observation à vérifier : libellé « À vérifier », en ambre, plus « Attention »", () => {
  for (const finding of [{ severity: "important" as const }, { score: 55 }]) {
    const html = observation(finding);
    const badge = html.match(/<span class="([^"]*\buppercase\b[^"]*)">([^<]*)<\/span>/);
    assert.ok(badge, "badge absent");
    assert.equal(decoder(badge[2]), "À vérifier");
    const c = badge[1].split(/\s+/);
    assert.ok(c.includes("text-warning") && c.includes("bg-warning/10"), `le badge n'est plus ambre : ${badge[1]}`);
    assert.ok(classes(html).includes("border-warning/15") && classes(html).includes("bg-warning/5"), "la carte n'est plus ambre");
    assert.ok(!texte(html).includes("Attention"));
  }
});

test("les deux autres libellés d'observation ne changent pas", () => {
  assert.match(observation({ score: 90 }), />Conforme</);
  assert.match(observation({ score: 20 }), />Suspect</);
});

// ── B6 : confiance faible, un seul encadré ambre ────────────────────────────

/** Encadrés ambre du rapport : les blocs à bordure --warning. */
const encadresAmbre = (html: string) => classes(html).filter((c) => /^border-warning(\/|$)/.test(c)).length;

test("confiance faible : un seul encadré ambre, le bandeau, placé avant le score", () => {
  const html = rendre({ confidence: "low", aiConfidence: "low", status: "expert_review" });
  const affiche = texte(html);
  assert.equal(encadresAmbre(html), 1, "un seul encadré ambre attendu");
  assert.equal(compter(affiche, t("results.lowConfidenceWarnTitle")), 1);
  assert.equal(compter(affiche, t("results.lowConfidenceWarnDesc")), 1);
  // Le bloc de la carte du score (« Faible confiance » et sa phrase) n'est plus rendu.
  assert.ok(!affiche.includes(t("results.confidenceLow")), "bloc de confiance de la carte encore rendu");
  assert.ok(!affiche.includes(t("results.confidenceLowDesc")));
  // Bandeau avant la jauge du score ; le score et le résumé restent affichés.
  const bandeau = html.indexOf(decoderInverse(t("results.lowConfidenceWarnTitle")));
  const jauge = html.indexOf("rotate(-90deg)");
  assert.ok(bandeau >= 0 && jauge >= 0 && bandeau < jauge, "le bandeau n'est plus avant le score");
  assert.ok(affiche.includes(RAPPORT.analystSummary ?? ""));
});

/** Le texte tel que React l'écrit dans le HTML (apostrophes échappées). */
function decoderInverse(valeur: string): string {
  return valeur.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");
}

for (const [confiance, libelle, phrase] of [
  ["high", "results.confidenceHigh", "results.confidenceHighDesc"],
  ["medium", "results.confidenceMedium", "results.confidenceMediumDesc"],
] as const) {
  test(`confiance « ${confiance} » : le bloc de confiance de la carte du score reste affiché, sans ambre`, () => {
    const html = rendre({ confidence: confiance, aiConfidence: confiance });
    const affiche = texte(html);
    assert.equal(compter(affiche, t(libelle)), 1);
    assert.equal(compter(affiche, t(phrase)), 1);
    assert.equal(encadresAmbre(html), 0);
    assert.ok(!affiche.includes(t("results.lowConfidenceWarnTitle")));
    // Dans la carte du score : après la jauge.
    assert.ok(html.indexOf(decoderInverse(t(libelle))) > html.indexOf("rotate(-90deg)"));
  });
}

test("les textes de confiance ne changent pas", () => {
  assert.equal(t("results.lowConfidenceWarnTitle"), "Confiance faible — résultat indicatif");
  assert.equal(
    t("results.lowConfidenceWarnDesc"),
    "Ce résultat est donné à titre indicatif : la qualité ou le nombre de photos limite la fiabilité de l'analyse.",
  );
  assert.equal(t("results.confidenceHigh"), "Haute confiance");
  assert.equal(t("results.confidenceMedium"), "Confiance modérée");
});

// ── B4 : « Cette analyse n'est pas facturée… » lisible dans les deux thèmes ──

/** Classes de chaque balise encore ouverte à cette position du HTML, de la racine vers l'intérieur. */
function ancetres(html: string, position: number): string[][] {
  const ouvertes: string[][] = [];
  for (const [balise, fermante, , attributs] of html.slice(0, position).matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)) {
    if (fermante) ouvertes.pop();
    else if (!balise.endsWith("/>")) ouvertes.push((attributs.match(/\bclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean));
  }
  return ouvertes;
}

test("témoin : les blocs qui contiennent la phrase « non facturée » sont bien retrouvés dans le HTML", () => {
  const html = rendre({ aiConfidence: "insufficient", confidence: "low", verdict: "inconclusive" });
  const blocs = ancetres(html, html.indexOf(decoderInverse(t("results.insufficientNoCredit"))));
  // Le bloc du rapport, <main>, le panneau « Photos insuffisantes », le <p> de la phrase.
  assert.equal(blocs.length, 4, JSON.stringify(blocs));
  assert.ok(blocs[0].includes("bg-background") && blocs[1].includes("max-w-3xl") && blocs[2].includes("text-center"));
  assert.deepEqual(blocs[3], ["mt-2", "text-caption", "text-muted-foreground"]);
});

test("photos insuffisantes : la phrase « non facturée » tient 4,5:1 sur le fond de son panneau, en sombre et en clair", () => {
  const html = rendre({ aiConfidence: "insufficient", confidence: "low", verdict: "inconclusive" });
  const phrase = decoderInverse(t("results.insufficientNoCredit"));
  const position = html.indexOf(phrase);
  assert.ok(position >= 0, "phrase absente du panneau « Photos insuffisantes »");

  // Classes de la phrase : la balise qui s'ouvre juste avant elle.
  const ouvrante = html.slice(0, position).match(/<p class="([^"]*)">$/);
  assert.ok(ouvrante, "la phrase n'est plus dans un <p> à classes");
  // Aucune opacité posée par une classe opacity-* sur la phrase ni sur un bloc
  // qui la contient : elle baisserait le contraste sans changer le jeton lu ici
  // (text-muted-foreground opacity-80 : 3,56:1 en thème clair).
  const voiles = ancetres(html, position).flat().filter((c) => /(^|:)opacity-/.test(c));
  assert.deepEqual(voiles, [], "classe d'opacité sur la phrase ou sur un bloc qui la contient");
  const couleurs = ouvrante[1].split(/\s+/).flatMap((c) => {
    const m = c.match(/^text-((?:muted-|subtle-)?foreground)(?:\/(\d+))?$/);
    return m ? [{ jeton: m[1], alpha: m[2] ? Number(m[2]) / 100 : 1 }] : [];
  });
  assert.equal(couleurs.length, 1, `une couleur de texte par jeton attendue : ${ouvrante[1]}`);
  const [couleur] = couleurs;

  // Fond : le panneau qui la contient (aplat translucide) posé sur le fond de la page.
  const panneaux = ancetres(html, position)
    .map((c) => c.find((classe) => classe.startsWith("bg-")))
    .filter((c): c is string => Boolean(c));
  assert.equal(panneaux.length, 2, `fonds attendus : celui du rapport, puis celui du panneau (${panneaux.join(", ")})`);
  assert.equal(panneaux[0], "bg-background", "le rapport n'est plus posé sur --background");
  const aplat = panneaux[panneaux.length - 1].match(/^bg-([a-z-]+)\/\[([\d.]+)\]$/);
  assert.ok(aplat, `fond du panneau inattendu : ${panneaux[panneaux.length - 1]}`);

  for (const theme of ["sombre", "clair"] as const) {
    const j = jetons(theme);
    const fond = melange(rvb(j.get(aplat[1])), rvb(j.get("background")), Number(aplat[2]));
    const encre = melange(rvb(j.get(couleur.jeton)), fond, couleur.alpha);
    const ratio = contraste(encre, fond);
    assert.ok(ratio >= 4.5, `thème ${theme} : ${ratio.toFixed(2)}:1, 4,5:1 attendu au moins`);
  }

  // Témoin : à 80 % d'opacité (avant le 05/10), le thème clair ne tenait pas 4,5:1.
  const clair = jetons("clair");
  const fondClair = melange(rvb(clair.get(aplat[1])), rvb(clair.get("background")), Number(aplat[2]));
  assert.ok(contraste(melange(rvb(clair.get("muted-foreground")), fondClair, 0.8), fondClair) < 4.5);
});

// Garde pour la fusion avec la branche de la relance : elle affiche la même
// phrase dans un second panneau (couverture trop faible, analyse non décomptée).
test("source du rapport : partout où elle s'affiche, la phrase « non facturée » est sans opacité", () => {
  const rapport = source("components/check/ReportView.tsx");
  const phrases = [...rapport.matchAll(/<p className="([^"]*)">\s*\{t\("results\.insufficientNoCredit"\)\}\s*<\/p>/g)];
  assert.ok(phrases.length >= 1, "phrase « non facturée » introuvable dans le source");
  assert.equal(phrases.length, rapport.split('"results.insufficientNoCredit"').length - 1, "une phrase « non facturée » affichée autrement que dans un <p> à classes");
  for (const [, classesDeLaPhrase] of phrases) {
    assert.deepEqual(
      classesDeLaPhrase.split(/\s+/).filter((c) => /^text-(?!caption$)|opacity-/.test(c)),
      ["text-muted-foreground"],
      classesDeLaPhrase,
    );
  }
});

// ── B3, côté rapport : la bulle de l'assistant n'est plus flottante sous 640 px ──

test("le rapport se signale à l'assistant (data-rapport) et ne lui réserve sa place que s'il flotte", () => {
  for (const donnees of [{}, { status: "analyzing" }, { status: "failed" }, { aiConfidence: "insufficient" as const }]) {
    const html = rendre(donnees);
    // La marque que lit « rapport-mobile: » (tailwind.config.ts), sur le bloc du rapport, dans tous ses états.
    const bloc = html.match(/^<div data-rapport="[^"]*" class="([^"]*)">/)?.[1].split(/\s+/);
    assert.ok(bloc, `bloc du rapport sans data-rapport : ${html.slice(0, 80)}`);
    // Sur un rapport sous 640 px, pas de hauteur minimale : le bouton de
    // l'assistant suit le contenu. Sinon, toute la fenêtre, comme avant.
    assert.ok(bloc.includes("min-h-screen") && bloc.includes("rapport-mobile:min-h-0"), bloc.join(" "));
    const principal = html.match(/<main class="([^"]*)">/)?.[1].split(/\s+/) ?? [];
    // 96 px sous « Nouvelle analyse » quand la bulle flotte ; 24 px quand elle
    // est dans le flux, sous la même condition qu'elle.
    assert.ok(principal.includes("pb-24") && principal.includes("rapport-mobile:pb-6"), principal.join(" "));
    assert.deepEqual(principal.filter((c) => /^(sm:)?pb-/.test(c)), ["pb-24"], principal.join(" "));
  }
});

// ── B2 : « Dashboard » traduit ───────────────────────────────────────────────

test("le bouton du bas du rapport s'appelle « Tableau de bord »", () => {
  const html = rendre();
  const boutons = [...html.matchAll(/<a\b[^>]*href="\/dashboard"[^>]*>([\s\S]*?)<\/a>/g)].map(([, contenu]) => texte(contenu));
  // Le mot LEGITVISION, le lien de l'en-tête, le bouton du bas.
  assert.deepEqual(boutons, ["LegitVision", "Tableau de bord", "Tableau de bord"]);
  assert.ok(!texte(html).includes("Dashboard"));
});
