// Décisions d'Hector du 13/10, après lecture des rapports de production : la
// consigne envoyée à l'IA interdit aussi « probabilité » (le score n'est pas
// une probabilité : elle demande une « estimation visuelle »), « certification »,
// « certifié », « garanti », et « frauduleux », « arnaque » (à la place : « non
// conforme », « indices de contrefaçon »), et elle ne cite jamais un score dans
// un texte (le score ne paraît que dans le champ prévu par l'interface).
// lib/forbidden-wording.ts reconnaît ces formulations, pour le compteur qui
// relève chaque semaine celles que l'IA écrit malgré la consigne.
// Ce test échoue si une de ces règles quitte la consigne, si la consigne
// emploie elle-même un de ces mots ailleurs que pour l'interdire (pour toute
// marque, et avec les vrais libellés du catalogue), si une formulation relevée
// en production n'est plus reconnue, ou si un texte permis (« probablement
// authentique », « 85/100 », « 100 % coton », « certificat », une étiquette
// recopiée entre guillemets) est pris à tort. L'empreinte de la consigne
// entière est tenue par tests/unit/consigne-sans-conseil-achat.test.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  BRAND_EXPERTISE_BRANDS,
  NO_ACCUSATION_RULE,
  NO_CERTIFICATION_RULE,
  NO_PROBABILITY_RULE,
  NO_PURCHASE_ADVICE_RULE,
  NO_SCORE_IN_TEXT_RULE,
  QUOTED_TEXT_EXCEPTION,
  RECOMMENDATION_FORMAT,
  getAuthenticationPrompt,
} from "@/lib/ai/authentication-prompts";
import { FORBIDDEN_WORDINGS, forbiddenWordings, type ForbiddenWording } from "@/lib/forbidden-wording";
import type { AuthenticationPoint } from "@/lib/types";

const racine = new URL("../../", import.meta.url);

const POINTS: AuthenticationPoint[] = [
  { zone: "stitching", label: "Coutures (régularité, couleur du fil, tension)", weight: 0.6 },
  { zone: "tongue_label", label: "Étiquette de taille (languette : taille, code produit, pays)", weight: 0.4 },
];
// Libellés relevés tels quels dans le catalogue de production le 13/10 : ceux qui portent un mot voisin des interdits.
const POINTS_DU_CATALOGUE: AuthenticationPoint[] = [
  { zone: "packaging", label: "Emballage (dust bag, boîte, certificat)", weight: 0.05 },
  { zone: "leather", label: "Cuir noir 100% ferme (ni plastique ni carton)", weight: 0.5 },
  { zone: "fabric", label: "Composition 100% coton", weight: 0.45 },
];
const PHOTOS = ["Vue de face (overall_front)", "Étiquette de taille (size_tag)"];

/** Les consignes de toutes sortes : chaque marque qui a son expertise, une marque inconnue, une variante, une collaboration, des points propres au modèle, les libellés du catalogue. */
const CONSIGNES: Array<[nom: string, consigne: { systemPrompt: string; userPrompt: string }]> = [
  ...BRAND_EXPERTISE_BRANDS.map((marque): [string, { systemPrompt: string; userPrompt: string }] => [
    `marque ${marque}`,
    getAuthenticationPrompt(marque, "Modèle", "sneakers", POINTS, PHOTOS),
  ]),
  ["sac, libellés du catalogue", getAuthenticationPrompt("Chanel", "Classic Flap", "bag", POINTS_DU_CATALOGUE, PHOTOS)],
  ["vêtement, variante", getAuthenticationPrompt("Stone Island", "Crewneck", "clothing", POINTS_DU_CATALOGUE, PHOTOS, "Ghost")],
  ["collaboration", getAuthenticationPrompt("Nike", "Air Force 1", "sneakers", POINTS, PHOTOS, null, "Off-White")],
  ["points propres au modèle", getAuthenticationPrompt("Maison Margiela", "GATS", "sneakers", POINTS, PHOTOS, "Standard", null, ["4 points de couture", "semelle en gomme"])],
  ["marque inconnue", getAuthenticationPrompt("Marque Inconnue", "Modèle", "watch", [], [])],
];

const REGLES: Array<[nom: string, regle: string]> = [
  ["probabilité", NO_PROBABILITY_RULE],
  ["score dans un texte", NO_SCORE_IN_TEXT_RULE],
  ["certification", NO_CERTIFICATION_RULE],
  ["accusation", NO_ACCUSATION_RULE],
  ["texte recopié", QUOTED_TEXT_EXCEPTION],
];

// ── 1. La consigne ─────────────────────────────────────────

test("consigne : chaque marque du fichier a sa consigne ici, et la liste n'est pas vide", () => {
  assert.ok(BRAND_EXPERTISE_BRANDS.length > 40, String(BRAND_EXPERTISE_BRANDS.length));
  assert.ok(BRAND_EXPERTISE_BRANDS.includes("hermès") && BRAND_EXPERTISE_BRANDS.includes("default"));
});

test("consigne : les cinq règles sont dans les règles absolues, une fois chacune, pour tout article", () => {
  for (const [nom, { systemPrompt }] of CONSIGNES) {
    const debut = systemPrompt.indexOf("RÈGLES ABSOLUES :");
    const fin = systemPrompt.indexOf("MÉTHODOLOGIE :");
    assert.ok(debut > 0 && fin > debut, `${nom} : sections introuvables`);
    const regles = systemPrompt.slice(debut, fin);
    for (const [famille, regle] of REGLES) {
      assert.ok(regles.includes(`\n${regle}\n`), `${nom} : la règle « ${famille} » n'est pas une ligne des règles absolues`);
      assert.equal(systemPrompt.split(regle).length - 1, 1, `${nom} : la règle « ${famille} » doit figurer une fois`);
    }
    // L'exception vient après les trois interdictions qu'elle nuance.
    assert.ok(regles.indexOf(QUOTED_TEXT_EXCEPTION) > regles.indexOf(NO_ACCUSATION_RULE), `${nom} : l'exception précède une interdiction`);
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
    [NO_SCORE_IN_TEXT_RULE, [
      "Tu ne cites JAMAIS un score dans un texte que tu rédiges, ni en chiffres ni en pourcentage",
      '"85/100"', '"40 sur 100"', '"score de 78"',
      'ni dans "analyst_summary", ni dans une "observation", ni dans "recommendations", ni dans "missing_evidence"',
      'Les scores vont UNIQUEMENT dans les champs numériques "overall_score", "sub_scores" et "score"',
      "le score affiché à l'utilisateur est recalculé à partir de tes notes par zone",
    ]],
    [NO_CERTIFICATION_RULE, [
      "Tu n'écris JAMAIS, dans aucun champ", '"certification"', '"certifié"', '"certifier"', '"garanti"', '"garantie"',
      "même à la négative", "une analyse de photos ne certifie et ne garantit rien",
      '"confirmation"', '"vérification complémentaire"',
      "Un document fourni avec l'article (certificat, carte d'authenticité, document de la marque) se décrit comme un objet à examiner, jamais comme une preuve.",
    ]],
    [NO_ACCUSATION_RULE, [
      "Tu n'accuses personne", "tu n'écris JAMAIS, dans aucun champ", '"frauduleux"', '"frauduleusement"', '"fraude"', '"arnaque"', '"escroquerie"',
      '"non conforme"', '"indices de contrefaçon"',
    ]],
    [QUOTED_TEXT_EXCEPTION, [
      "Ces interdictions de mots (probabilité, certification, garantie, accusation) portent sur ce que TU affirmes.",
      "Seule exception : un texte lisible sur une photo, recopié tel quel entre guillemets français",
      "« RDS Certified »", "hors des guillemets, ces mots restent interdits.",
    ]],
  ];
  for (const [regle, textes] of attendus) {
    for (const texte of textes) assert.ok(regle.includes(texte), `« ${texte} » absent de : ${regle}`);
  }
  // « certificat » nomme un document : il n'est pas dans la liste des mots interdits (le catalogue demande de l'examiner).
  assert.doesNotMatch(NO_CERTIFICATION_RULE, /"certificat"/);
  // La règle de la probabilité ne dit plus comment citer un score : il ne se cite plus.
  assert.doesNotMatch(NO_PROBABILITY_RULE, /se cite|\/100/);
});

test("consigne : le format redit « sans aucun score chiffré » pour le résumé et pour chaque observation", () => {
  for (const [nom, { systemPrompt }] of CONSIGNES) {
    assert.ok(systemPrompt.includes('"observation": "<description factuelle précise en français, sans aucun score chiffré>",'), `${nom} : observation`);
    assert.ok(systemPrompt.includes('"analyst_summary": "<résumé 2-3 phrases en français, sans aucun score chiffré — DOIT commencer par'), `${nom} : résumé`);
    // Les champs numériques, eux, restent demandés.
    for (const champ of ['"overall_score": <number 0-100>,', '"<zone_id>": <number 0-100>', '"score": <number 0-100>,']) {
      assert.ok(systemPrompt.includes(champ), `${nom} : ${champ}`);
    }
  }
});

/** Un mot que la consigne interdit d'écrire. « certificat », le document, n'en est pas un. */
const MOT_INTERDIT = /probabilit|\bchances?\b|certifi(?!cats?\b)|garanti|fraud|arnaqu|escro(?:c|qu)/i;
/** Un mot d'achat ou de paiement. « pays » et « vachette » n'en sont pas. */
const MOT_D_ACHAT = /\bachats?\b|\bachet|\bacqu[ée]r|\bpay(?:er|ez|ons|ant)\b|\bpayé|\bpaiement/i;

test("consigne : elle n'emploie les mots interdits que pour les interdire, pour toute marque et avec les libellés du catalogue", () => {
  // Les lignes qui ont le droit de les porter : la première règle absolue, les trois interdictions et leur exception.
  const permises = [
    "- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION VISUELLE, basée sur ce que montrent les photos.",
    NO_PROBABILITY_RULE,
    NO_CERTIFICATION_RULE,
    NO_ACCUSATION_RULE,
    QUOTED_TEXT_EXCEPTION,
  ];
  // Celles qui parlent d'achat : la règle des conseils d'achat et le format des recommandations.
  const permisesAchat = [NO_PURCHASE_ADVICE_RULE, `  "recommendations": ["${RECOMMENDATION_FORMAT}"],`];
  for (const [nom, { systemPrompt, userPrompt }] of CONSIGNES) {
    const lignes = `${systemPrompt}\n${userPrompt}`.split("\n");
    for (const ligne of lignes.filter((l) => MOT_INTERDIT.test(l))) {
      assert.ok(permises.includes(ligne), `${nom} : mot interdit hors de son interdiction : ${ligne.slice(0, 140)}`);
    }
    for (const ligne of lignes.filter((l) => MOT_D_ACHAT.test(l))) {
      assert.ok(permisesAchat.includes(ligne), `${nom} : la consigne parle d'achat ou de paiement hors de son interdiction : ${ligne.slice(0, 140)}`);
    }
  }
  // La règle des conseils d'achat ne porte aucun des autres mots interdits, et inversement.
  assert.doesNotMatch(NO_PURCHASE_ADVICE_RULE, MOT_INTERDIT);
  for (const [, regle] of REGLES) assert.doesNotMatch(regle, MOT_D_ACHAT);
  // Le libellé du catalogue qui porte « certificat » est bien dans la consigne des sacs : c'est pour lui que le mot reste permis.
  const sac = CONSIGNES.find(([nom]) => nom === "sac, libellés du catalogue")?.[1];
  assert.ok(sac?.userPrompt.includes("**Emballage (dust bag, boîte, certificat)** (zone: `packaging`, poids: 5%)"), sac?.userPrompt);
});

test("consigne : aucun de ces mots dans le reste du dossier lib/ai, expertise des marques comprise", () => {
  // Tout fichier du dossier, hors commentaires et hors noms des règles : un second fichier de consigne ne passerait pas inaperçu.
  const dossier = new URL("lib/ai/", racine);
  const fautives: string[] = [];
  const achat: string[] = [];
  for (const fichier of readdirSync(dossier).filter((f) => f.endsWith(".ts"))) {
    const lignes = readFileSync(new URL(fichier, dossier), "utf8")
      .split("\n")
      // « **Article :** » est une ligne de la consigne, pas un commentaire.
      .filter((ligne) => !/^\s*(?:\/\/|\/\*|\*\/|\*(?:\s|$))/.test(ligne))
      .map((ligne) => ligne.replace(/NO_(?:PROBABILITY|CERTIFICATION|ACCUSATION|PURCHASE_ADVICE)_RULE|QUOTED_TEXT_EXCEPTION|RECOMMENDATION_FORMAT/g, "RÈGLE"));
    fautives.push(...lignes.filter((ligne) => MOT_INTERDIT.test(ligne)).map((ligne) => ligne.trim()));
    achat.push(...lignes.filter((ligne) => MOT_D_ACHAT.test(ligne)).map((ligne) => ligne.trim()));
  }
  assert.equal(fautives.length, 5, fautives.join("\n"));
  assert.ok(fautives[0].startsWith("`- Le score est une note de conformité de 0 à 100, JAMAIS une probabilité"), fautives[0]);
  assert.ok(fautives[1].startsWith("`- Tu n'écris JAMAIS, dans aucun champ, \"certification\""), fautives[1]);
  assert.ok(fautives[2].startsWith("`- Tu n'accuses personne"), fautives[2]);
  assert.ok(fautives[3].startsWith("`- Ces interdictions de mots (probabilité, certification, garantie, accusation)"), fautives[3]);
  assert.ok(fautives[4].startsWith("- Tu ne certifies JAMAIS l'authenticité. Tu donnes une ESTIMATION VISUELLE"), fautives[4]);
  assert.equal(achat.length, 2, achat.join("\n"));
  assert.ok(achat[0].startsWith("`- Tu ne donnes JAMAIS de conseil d'achat ni de paiement"), achat[0]);
  assert.ok(achat[1].startsWith('"<vérification à faire, en français'), achat[1]);
});

// ── 2. Reconnaître une formulation interdite ───────────────

/** Les familles reconnues dans un texte, à comparer telles quelles. */
const familles = (texte: unknown): ForbiddenWording[] => forbiddenWordings(texte);

test("formulations relevées en production le 13/10 : chacune est reconnue, dans sa famille", () => {
  const relevees: Array<[texte: string, attendu: ForbiddenWording[]]> = [
    ["Seuls quelques détails mineurs nécessitent une vérification supplémentaire pour une certification complète.", ["certification"]],
    ["Cependant, l'absence de vues détaillées de l'étiquette intérieure et du numéro de série limite la certification définitive de l'authenticité.", ["certification"]],
    ["Le code de fabrication FL03 et l'ensemble des détails observés suggèrent une forte probabilité d'authenticité, avec un score global de 85/100.", ["probability", "score"]],
    ["Le code interne DC 07 22 43 et l'ensemble des détails observés suggèrent une forte probabilité d'authenticité malgré quelques zones nécessitant une vérification supplémentaire.", ["probability"]],
    ["Logo BALENCIAGA brodé sur mesh présent mais incohérent avec l'étiquette Puma - probable customisation ou montage frauduleux", ["fraud"]],
    ["Ces chaussures sont des Puma authentiques sur lesquelles ont été ajoutés frauduleusement des éléments Balenciaga (logo brodé, semelle intérieure).", ["fraud"]],
    ["Éviter absolument cet achat - article clairement frauduleux", ["purchase_advice", "fraud"]],
  ];
  for (const [texte, attendu] of relevees) assert.deepEqual(familles(texte), attendu, texte);
});

test("probabilité : le mot, « chances », et tout pourcentage dans une phrase qui parle d'authenticité, de score, de confiance ou de risque", () => {
  for (const texte of [
    "Probabilité d'authenticité élevée.",
    "La PROBABILITÉ d'une contrefaçon est faible.",
    "Il y a de fortes chances que cette paire soit authentique.",
    "Aucune chance qu'il s'agisse d'un original.",
    "Une chance sur 10 que ce soit un original.",
    "Cette paire a 85 % de chances d'être authentique.",
    "85% de chance d'être un faux.",
    "Article authentique à 85 %.",
    "Article authentique à plus de 90 %.",
    "Authenticité estimée à 85 %.",
    "Authenticité : 85 %.",
    "Probablement authentique (85 %).",
    "Il est probable à 85 % que cette paire soit authentique.",
    "Paire 100 % authentique.",
    "Paire authentique à environ 90 pour cent.",
    "Contrefaçon à 95 %.",
    "Je suis sûr à 90 % de son authenticité.",
    "Niveau de certitude de 90 %.",
    "Niveau de confiance élevé (90 %).",
    "Indice de confiance de 85,5 %.",
    "Résultat fiable à 95 %.",
    "Résultat fiable, avec 95 % de confiance.",
    "Risque de contrefaçon : 30 %.",
    "Environ 30 % de risque de contrefaçon.",
    "Coutures régulières ; authenticité à 80 % selon moi.",
  ]) {
    assert.deepEqual(familles(texte), ["probability"], texte);
  }
});

test("score cité dans un texte : sur 100, en toutes lettres ou en pourcentage ; jamais une date, une taille ou un code", () => {
  for (const texte of [
    "Score global de 85/100.",
    "Zone notée 40 sur 100.",
    "Note de 7 sur 10 pour les coutures.",
    "Un score de 78 pour cette zone.",
    "Le score atteint 80.",
    "Score : 72",
    "Les coutures obtiennent 85 / 100.",
  ]) {
    assert.deepEqual(familles(texte), ["score"], texte);
  }
  // En pourcentage, c'est aussi une probabilité.
  for (const texte of ["Score de confiance : 85 %.", "Score global de 85 %."]) assert.deepEqual(familles(texte), ["probability", "score"], texte);
  for (const texte of [
    "Le score reflète plusieurs anomalies sur la semelle.",
    "Le score est pénalisé par 2 coutures irrégulières.",
    "Ticket de caisse daté du 05/10/2026.",
    "Étiquette de taille : 42 EU, 8.5 US.",
    "Code produit DC4457-001 lisible.",
    "4 points de couture blancs sur le talon.",
    "Numéro de série 123/1000 gravé sur la plaque.",
    "Photo 3 sur 8 trop sombre.",
  ]) {
    assert.deepEqual(familles(texte), [], texte);
  }
});

test("certification ou garantie : tous les mots de la famille, même à la négative", () => {
  for (const texte of [
    "Article certifié authentique.",
    "Paire certifiée conforme.",
    "Aucune certification n'est possible sur photos.",
    "Ces photos ne permettent pas de certifier l'article.",
    "Je certifie que cette paire est conforme.",
    "Authenticité garantie.",
    "Rien n'est garanti sans examen en main.",
    "Les photos ne peuvent garantir l'origine du sac.",
    "Carte de garantie absente.",
    "CERTIFIÉ CONFORME",
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
  assert.deepEqual(familles("Arnaque certifiée : fraude garantie, 100 % de chances, noté 12/100. N'achetez pas."), [...FORBIDDEN_WORDINGS]);
});

test("textes permis : le verdict en « probablement », un score sur 100, une étiquette de composition, un certificat, une étiquette recopiée, ce que les règles disent d'écrire", () => {
  for (const texte of [
    // Relevés en production le 13/10 : ce sont les mots du verdict.
    "Au vu des coutures imprécises et de l'absence d'étiquettes lisibles, l'analyse penche vers une probable contrefaçon.",
    "Cette paire présente des marqueurs conformes et apparaît probablement authentique.",
    "Très probablement authentique.",
    // Un pourcentage qui ne dit rien de l'authenticité.
    "Étiquette de composition : 100 % coton.",
    "Composition lue : 80 % polyamide, 20 % élasthanne.",
    "Cuir noir 100% ferme, ni plastique ni carton.",
    "Semelle usée à 30 % environ.",
    "Photo floue sur 50 % de la surface.",
    "Zoom à 200 % sur la gravure.",
    "Le vendeur annonce une réduction de 30 % sur le prix.",
    // Le pourcentage et l'authenticité dans deux phrases différentes.
    "L'article paraît authentique. À 85 %, le zoom reste net.",
    // « sur », sans accent, n'est pas « sûr ».
    "Vue sur la semelle extérieure.",
    "Police conforme sur à peu près 90 % du texte.",
    // « certificat » : le document fourni avec l'article, que le catalogue demande d'examiner.
    "Le certificat fourni avec le sac est illisible.",
    "Emballage (dust bag, boîte, certificat) incomplet : le certificat manque.",
    "Ce rapport n'est pas un certificat.",
    // Un texte lu sur une photo, recopié entre guillemets : français, anglais ou droits.
    "Étiquette intérieure : mention « RDS Certified » lisible.",
    "Étiquette « 100% Authentic » cousue sur la languette, absente des paires officielles.",
    "Étiquette eBay « Garantie d'authenticité » attachée au lacet.",
    "Mention “Certified Authentic” imprimée sur la carte.",
    'Étiquette volante portant "Authenticity Guaranteed 100%".',
    // « chance » qui ne dit rien d'une probabilité.
    "Par chance, l'étiquette de taille est bien lisible.",
    "Deuxième chance : reprendre la photo de la semelle.",
    "Par malchance, la photo de la boîte manque.",
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
  ]) {
    assert.deepEqual(familles(texte), [], texte);
  }
});

test("guillemets : seul le texte recopié est ignoré, pas ce qui l'entoure, et un conseil d'achat reste un conseil", () => {
  // Le mot hors des guillemets compte toujours.
  assert.deepEqual(familles("Étiquette « RDS Certified » : article certifié conforme."), ["certification"]);
  assert.deepEqual(familles("Carte « Authenticity Card » fournie : authenticité garantie."), ["certification"]);
  // Des guillemets qui ne se ferment pas, ou une « citation » de plus de 120 caractères, ne cachent rien.
  assert.deepEqual(familles("Mention « frauduleux écrite sans fermer les guillemets."), ["fraud"]);
  assert.deepEqual(familles(`« ${"texte ".repeat(25)}arnaque »`), ["scam"]);
  // Un conseil d'achat entre guillemets reste un conseil d'achat.
  assert.deepEqual(familles("Mon avis : « n'achetez pas cette paire »."), ["purchase_advice"]);
});

test("une valeur qui n'est pas un texte ne porte aucune formulation", () => {
  for (const autre of [undefined, null, "", "   ", 12, {}, ["arnaque"], true]) assert.deepEqual(familles(autre), [], JSON.stringify(autre));
});

test("les mots que chaque règle interdit sont reconnus, ceux qu'elle propose à la place ne le sont pas", () => {
  /** Les expressions entre guillemets droits d'une règle. */
  const cites = (regle: string) => [...regle.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const aLaPlace = ["estimation visuelle", "confirmation", "vérification complémentaire", "non conforme", "indices de contrefaçon"];
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
  // 4 + 5 + 5 mots interdits nommés, 1 + 2 + 2 expressions proposées.
  assert.equal(interdits, 14);
  assert.equal(proposes, aLaPlace.length);
  // Les trois exemples de score que la règle cite sont reconnus comme des scores cités.
  for (const exemple of ["85/100", "40 sur 100", "score de 78"]) {
    assert.ok(NO_SCORE_IN_TEXT_RULE.includes(`"${exemple}"`), exemple);
    assert.deepEqual(familles(exemple), ["score"], exemple);
  }
  // Les documents que la règle permet de nommer ne sont pas reconnus comme interdits.
  for (const document of ["certificat", "carte d'authenticité", "document de la marque"]) assert.deepEqual(familles(document), [], document);
});
