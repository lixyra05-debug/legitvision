// Décisions d'Hector du 13/10, après lecture des rapports de production : la
// consigne envoyée à l'IA interdit aussi « probabilité » (le score n'est pas
// une probabilité : elle demande une « estimation visuelle »), « certification »,
// « certifié », « garanti », et « frauduleux », « arnaque » (à la place : « non
// conforme », « indices de contrefaçon »). lib/forbidden-wording.ts reconnaît
// ces formulations, pour que la mesure de fiabilité compte celles que l'IA
// écrit malgré la consigne.
// Ce test échoue si une de ces règles quitte la consigne, si la consigne
// emploie elle-même un de ces mots ailleurs que pour l'interdire, si une
// formulation relevée en production n'est plus reconnue, ou si un texte
// permis (« probablement authentique », « 85/100 », « 100 % coton ») est pris à
// tort. L'empreinte de la consigne entière est tenue par
// tests/unit/consigne-sans-conseil-achat.test.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  NO_ACCUSATION_RULE,
  NO_CERTIFICATION_RULE,
  NO_PROBABILITY_RULE,
  NO_PURCHASE_ADVICE_RULE,
  getAuthenticationPrompt,
} from "@/lib/ai/authentication-prompts";
import { FORBIDDEN_WORDINGS, forbiddenWordings, type ForbiddenWording } from "@/lib/forbidden-wording";
import type { AuthenticationPoint } from "@/lib/types";

const racine = new URL("../../", import.meta.url);

const POINTS: AuthenticationPoint[] = [
  { zone: "stitching", label: "Coutures (régularité, couleur du fil, tension)", weight: 0.6 },
  { zone: "tongue_label", label: "Étiquette de taille (languette : taille, code produit, pays)", weight: 0.4 },
];
const PHOTOS = ["Vue de face (overall_front)", "Étiquette de taille (size_tag)"];

/** Les consignes construites pour des articles de toute sorte : chaque catégorie, une variante, une collaboration, des points propres au modèle. */
const CONSIGNES: Array<[nom: string, consigne: { systemPrompt: string; userPrompt: string }]> = [
  ["sneakers", getAuthenticationPrompt("Nike", "Dunk Low", "sneakers", POINTS, PHOTOS)],
  ["sac", getAuthenticationPrompt("Chanel", "Classic Flap", "bag", POINTS, PHOTOS)],
  ["vêtement, variante", getAuthenticationPrompt("Stone Island", "Crewneck", "clothing", POINTS, PHOTOS, "Ghost")],
  ["collaboration", getAuthenticationPrompt("Nike", "Air Force 1", "sneakers", POINTS, PHOTOS, null, "Off-White")],
  ["points propres au modèle", getAuthenticationPrompt("Maison Margiela", "GATS", "sneakers", POINTS, PHOTOS, "Standard", null, ["4 points de couture", "semelle en gomme"])],
  ["marque inconnue", getAuthenticationPrompt("Marque Inconnue", "Modèle", "watch", [], [])],
];

const REGLES: Array<[nom: string, regle: string]> = [
  ["probabilité", NO_PROBABILITY_RULE],
  ["certification", NO_CERTIFICATION_RULE],
  ["accusation", NO_ACCUSATION_RULE],
];

// ── 1. La consigne ─────────────────────────────────────────

test("consigne : les trois règles sont dans les règles absolues, une fois chacune, pour tout article", () => {
  for (const [nom, { systemPrompt }] of CONSIGNES) {
    const debut = systemPrompt.indexOf("RÈGLES ABSOLUES :");
    const fin = systemPrompt.indexOf("MÉTHODOLOGIE :");
    assert.ok(debut > 0 && fin > debut, `${nom} : sections introuvables`);
    const regles = systemPrompt.slice(debut, fin);
    for (const [famille, regle] of REGLES) {
      assert.ok(regles.includes(`\n${regle}\n`), `${nom} : la règle « ${famille} » n'est pas une ligne des règles absolues`);
      assert.equal(systemPrompt.split(regle).length - 1, 1, `${nom} : la règle « ${famille} » doit figurer une fois`);
    }
  }
  // Une règle de la liste, comme les autres : elle tient sur une ligne et commence par un tiret.
  for (const [famille, regle] of REGLES) assert.match(regle, /^- [^\n]+$/, famille);
});

test("consigne : l'IA donne une « estimation visuelle », plus une « estimation de probabilité »", () => {
  for (const [nom, { systemPrompt, userPrompt }] of CONSIGNES) {
    assert.ok(
      systemPrompt.includes("- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION VISUELLE, basée sur ce que montrent les photos.\n"),
      `${nom} : première règle absolue`,
    );
    assert.match(userPrompt, /^Analyse ces \d+ photos et donne une estimation visuelle de l'authenticité de ce /, `${nom} : demande`);
    for (const texte of [systemPrompt, userPrompt]) {
      assert.doesNotMatch(texte, /estimation de probabilit/i, `${nom} : « estimation de probabilité » est revenue`);
      assert.doesNotMatch(texte, /estimer la probabilit/i, `${nom} : « estimer la probabilité » est revenu`);
    }
  }
});

test("consigne : chaque règle nomme les mots interdits et dit quoi écrire à la place", () => {
  const attendus: Array<[regle: string, textes: string[]]> = [
    [NO_PROBABILITY_RULE, [
      "Le score est une note de conformité de 0 à 100, JAMAIS une probabilité",
      "dans aucun champ", '"probabilité"', '"chances"', "ni un pourcentage de chances ou de certitude",
      '"85 % de chances"', '"authentique à 85 %"', 'Tu parles d\'"estimation visuelle"',
    ]],
    [NO_CERTIFICATION_RULE, [
      "Tu n'écris JAMAIS, dans aucun champ", '"certification"', '"certifié"', '"certifier"', '"certificat"', '"garanti"', '"garantie"',
      "même à la négative", "une analyse de photos ne certifie et ne garantit rien",
      '"confirmation"', '"vérification complémentaire"', '"carte d\'authenticité"', '"document de la marque"',
    ]],
    [NO_ACCUSATION_RULE, [
      "Tu n'accuses personne", "tu n'écris JAMAIS, dans aucun champ", '"frauduleux"', '"frauduleusement"', '"fraude"', '"arnaque"', '"escroquerie"',
      '"non conforme"', '"indices de contrefaçon"',
    ]],
  ];
  for (const [regle, textes] of attendus) {
    for (const texte of textes) assert.ok(regle.includes(texte), `« ${texte} » absent de : ${regle}`);
  }
});

/** Un mot que la consigne interdit d'écrire. « chances » compris : la règle le nomme. */
const MOT_INTERDIT = /probabilit|\bchances?\b|certifi|garanti|fraud|arnaqu|escro(?:c|qu)/i;

test("consigne : elle n'emploie ces mots que pour les interdire, quel que soit l'article", () => {
  // Les lignes qui ont le droit de les porter : la première règle absolue et les trois règles.
  const permises = [
    "- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION VISUELLE, basée sur ce que montrent les photos.",
    NO_PROBABILITY_RULE,
    NO_CERTIFICATION_RULE,
    NO_ACCUSATION_RULE,
  ];
  for (const [nom, { systemPrompt, userPrompt }] of CONSIGNES) {
    for (const ligne of `${systemPrompt}\n${userPrompt}`.split("\n").filter((l) => MOT_INTERDIT.test(l))) {
      assert.ok(permises.includes(ligne), `${nom} : mot interdit hors de son interdiction : ${ligne.slice(0, 140)}`);
    }
  }
  // La règle des conseils d'achat, elle, n'en porte aucun.
  assert.doesNotMatch(NO_PURCHASE_ADVICE_RULE, MOT_INTERDIT);
});

test("consigne : aucun de ces mots dans le reste du fichier, expertise des marques comprise", () => {
  // Les consignes ci-dessus ne passent que par quelques marques : on relit le
  // fichier entier, hors commentaires et hors noms des trois règles.
  const source = readFileSync(new URL("lib/ai/authentication-prompts.ts", racine), "utf8");
  const lignes = source
    .split("\n")
    // « **Article :** » est une ligne de la consigne, pas un commentaire.
    .filter((ligne) => !/^\s*(?:\/\/|\/\*|\*\/|\*(?:\s|$))/.test(ligne))
    .map((ligne) => ligne.replace(/NO_(?:PROBABILITY|CERTIFICATION|ACCUSATION)_RULE/g, "RÈGLE"));
  const fautives = lignes.filter((ligne) => MOT_INTERDIT.test(ligne)).map((ligne) => ligne.trim());
  assert.equal(fautives.length, 4, fautives.join("\n"));
  assert.ok(fautives[0].startsWith('`- Le score est une note de conformité de 0 à 100, JAMAIS une probabilité'), fautives[0]);
  assert.ok(fautives[1].startsWith("`- Tu n'écris JAMAIS, dans aucun champ, \"certification\""), fautives[1]);
  assert.ok(fautives[2].startsWith("`- Tu n'accuses personne"), fautives[2]);
  assert.ok(fautives[3].startsWith("- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION VISUELLE"), fautives[3]);
});

// ── 2. Reconnaître une formulation interdite ───────────────

/** Les familles reconnues dans un texte, à comparer telles quelles. */
const familles = (texte: unknown): ForbiddenWording[] => forbiddenWordings(texte);

test("formulations relevées en production le 13/10 : chacune est reconnue, dans sa famille", () => {
  const relevees: Array<[texte: string, attendu: ForbiddenWording[]]> = [
    ["Seuls quelques détails mineurs nécessitent une vérification supplémentaire pour une certification complète.", ["certification"]],
    ["Cependant, l'absence de vues détaillées de l'étiquette intérieure et du numéro de série limite la certification définitive de l'authenticité.", ["certification"]],
    ["Le code de fabrication FL03 et l'ensemble des détails observés suggèrent une forte probabilité d'authenticité, avec un score global de 85/100.", ["probability"]],
    ["Le code interne DC 07 22 43 et l'ensemble des détails observés suggèrent une forte probabilité d'authenticité malgré quelques zones nécessitant une vérification supplémentaire.", ["probability"]],
    ["Logo BALENCIAGA brodé sur mesh présent mais incohérent avec l'étiquette Puma - probable customisation ou montage frauduleux", ["fraud"]],
    ["Ces chaussures sont des Puma authentiques sur lesquelles ont été ajoutés frauduleusement des éléments Balenciaga (logo brodé, semelle intérieure).", ["fraud"]],
    ["Éviter absolument cet achat - article clairement frauduleux", ["purchase_advice", "fraud"]],
  ];
  for (const [texte, attendu] of relevees) assert.deepEqual(familles(texte), attendu, texte);
});

test("probabilité : le mot, « chances », et tout pourcentage de chances ou de certitude", () => {
  for (const texte of [
    "Probabilité d'authenticité élevée.",
    "La PROBABILITÉ d'une contrefaçon est faible.",
    "Il y a de fortes chances que cette paire soit authentique.",
    "Aucune chance qu'il s'agisse d'un original.",
    "Cette paire a 85 % de chances d'être authentique.",
    "85% de chance d'être un faux.",
    "Article authentique à 85 %.",
    "Authenticité estimée à 85 %.",
    "Paire 100 % authentique.",
    "Paire authentique à environ 90 pour cent.",
    "Contrefaçon à 95 %.",
    "Je suis sûr à 90 % de son authenticité.",
    "Niveau de certitude de 90 %.",
    "Indice de confiance de 85,5 %.",
    "Résultat fiable, avec 95 % de confiance.",
    "Environ 30 % de risque de contrefaçon.",
  ]) {
    assert.deepEqual(familles(texte), ["probability"], texte);
  }
});

test("certification ou garantie : tous les mots de la famille, même à la négative", () => {
  for (const texte of [
    "Article certifié authentique.",
    "Paire certifiée conforme.",
    "Aucune certification n'est possible sur photos.",
    "Ces photos ne permettent pas de certifier l'article.",
    "Ce rapport n'est pas un certificat.",
    "Le certificat d'authenticité fourni par le vendeur est illisible.",
    "Authenticité garantie.",
    "Rien n'est garanti sans examen en main.",
    "Les photos ne peuvent garantir l'origine du sac.",
    "Carte de garantie absente.",
  ]) {
    assert.deepEqual(familles(texte), ["certification"], texte);
  }
});

test("frauduleux, arnaque : tous les mots des deux familles", () => {
  for (const texte of ["Article frauduleux.", "Étiquette frauduleuse.", "Logo ajouté frauduleusement.", "Tentative de fraude manifeste.", "FRAUDULEUX"]) {
    assert.deepEqual(familles(texte), ["fraud"], texte);
  }
  for (const texte of ["Cette annonce est une arnaque.", "Vous vous faites arnaquer.", "C'est une escroquerie.", "Le vendeur est un escroc.", "ARNAQUE"]) {
    assert.deepEqual(familles(texte), ["scam"], texte);
  }
  assert.deepEqual(familles("Arnaque certifiée : fraude garantie, 100 % de chances. N'achetez pas."), [...FORBIDDEN_WORDINGS]);
});

test("textes permis : le verdict en « probablement », un score sur 100, une étiquette de composition, ce que les règles disent d'écrire", () => {
  for (const texte of [
    // Relevés en production le 13/10 : ce sont les mots du verdict.
    "Au vu des coutures imprécises et de l'absence d'étiquettes lisibles, l'analyse penche vers une probable contrefaçon.",
    "Cette paire présente des marqueurs conformes et apparaît probablement authentique.",
    "Très probablement authentique.",
    "Score global de 85/100.",
    "Zone notée 40 sur 100.",
    // Un pourcentage qui ne dit rien de l'authenticité.
    "Étiquette de composition : 100 % coton.",
    "Composition lue : 80 % polyamide, 20 % élasthanne.",
    "Semelle usée à 30 % environ.",
    "Photo floue sur 50 % de la surface.",
    "Zoom à 200 % sur la gravure.",
    "Le vendeur annonce une réduction de 30 % sur le prix.",
    // « sur », sans accent, n'est pas « sûr ».
    "Vue sur la semelle extérieure.",
    "Police conforme sur à peu près 90 % du texte.",
    // Ce que les règles demandent d'écrire à la place.
    "Estimation visuelle fondée sur 8 photos.",
    "Une confirmation par un expert reste utile.",
    "Vérification complémentaire : photo nette de l'étiquette intérieure.",
    "La carte d'authenticité n'est pas photographiée.",
    "Aucun document de la marque n'est fourni.",
    "Étiquette de languette non conforme.",
    "Plusieurs indices de contrefaçon sur la semelle.",
    // Voisins qui ne sont pas des mots interdits.
    "Service d'authentification.",
    "Article authentifié en boutique selon le vendeur.",
    "Niveau de confiance élevé.",
    "Coutures suspectes, à vérifier.",
    "Par malchance, la photo de la boîte manque.",
  ]) {
    assert.deepEqual(familles(texte), [], texte);
  }
});

test("une valeur qui n'est pas un texte ne porte aucune formulation", () => {
  for (const autre of [undefined, null, "", "   ", 12, {}, ["arnaque"], true]) assert.deepEqual(familles(autre), [], JSON.stringify(autre));
});

test("les mots que chaque règle interdit sont reconnus, ceux qu'elle propose à la place ne le sont pas", () => {
  /** Les expressions entre guillemets droits d'une règle. */
  const cites = (regle: string) => [...regle.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const aLaPlace = ["estimation visuelle", "confirmation", "vérification complémentaire", "carte d'authenticité", "document de la marque", "non conforme", "indices de contrefaçon"];
  const famillesDesRegles: Array<[regle: string, famille: ForbiddenWording[]]> = [
    [NO_PROBABILITY_RULE, ["probability"]],
    [NO_CERTIFICATION_RULE, ["certification"]],
    // « fraude » et « arnaque » se comptent à part, la règle les interdit ensemble.
    [NO_ACCUSATION_RULE, ["fraud", "scam"]],
  ];
  let interdits = 0;
  let proposes = 0;
  for (const [regle, attendues] of famillesDesRegles) {
    for (const expression of cites(regle)) {
      if (aLaPlace.includes(expression)) {
        assert.deepEqual(familles(expression), [], `« ${expression} » est proposé par la règle, et reconnu comme interdit`);
        proposes++;
      } else {
        const trouvees = familles(expression);
        assert.equal(trouvees.length, 1, `« ${expression} » : ${JSON.stringify(trouvees)}`);
        assert.ok(attendues.includes(trouvees[0]), `« ${expression} » reconnu dans ${trouvees[0]}`);
        interdits++;
      }
    }
  }
  // 4 + 6 + 5 mots interdits nommés, 1 + 4 + 2 expressions proposées.
  assert.equal(interdits, 15);
  assert.equal(proposes, aLaPlace.length);
});
