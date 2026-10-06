// Noms des zones du rapport, en français (décision d'Hector du 05/10). Le
// rapport affichait l'identifiant de la zone (« stitching », « tongue label »).
// lib/zone-names.ts donne le nom à afficher : la table des zones courantes
// d'abord, puis le libellé court du point d'authentification du modèle, puis
// l'identifiant rendu lisible. Les libellés (zone | libellé) viennent du
// catalogue, relevés le 2026-10-05.
// Décisions d'Hector du 06/10, à la lecture des rapports : sept noms de la
// table changent ; « Tab talon » devient « Languette du talon », le reste du
// jargon des libellés est gardé ; deux zones d'un même rapport ne portent
// jamais le même nom, y compris une zone que l'IA note hors des points du
// modèle (zoneNamesForReport).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SHORT_LABEL_FIXES,
  ZONE_NAMES,
  shortZoneLabel,
  zoneDisplayName,
  zoneKey,
  zoneLabelName,
  zoneNameIn,
  zoneNamesForPoints,
  zoneNamesForReport,
} from "@/lib/zone-names";

// La table d'avant les décisions du 06/10 (lot du 05/10) : ce qui n'est pas
// dans SEPT_NOMS ne doit pas avoir bougé.
const TABLE_DU_05_10: Record<string, string> = {
  stitching: "Coutures",
  packaging: "Emballage",
  date_code: "Code date / puce RFID",
  hardware: "Quincaillerie",
  zipper: "Fermeture éclair",
  interior_label: "Étiquette intérieure",
  leather: "Cuir et matériau",
  lining: "Doublure",
  hot_stamp: "Marquage à chaud",
  logo_monogram: "Logo et monogramme",
  neck_label: "Étiquette de col",
  closures: "Fermetures",
  fabric: "Tissu",
  tags: "Étiquettes volantes",
  print_embroidery: "Imprimé et broderie",
  materials: "Matériaux",
  tongue_label: "Étiquette de languette",
  sole_pattern: "Semelle",
  logo_placement: "Logo",
  product_code: "Code produit",
  wash_label: "Étiquette de lavage",
  box_label: "Boîte et emballage",
  eyelets: "Œillets et lacets",
  tongue_tag: "Étiquette de languette",
  air_sole_unit: "Unité Air",
  leather_quality: "Qualité du cuir",
  og_sole: "Semelle OG",
  laces: "Lacets",
  midsole_stitching: "Couture de la midsole",
  toe_perforations: "Perforations de l'avant-pied",
};

// Les sept noms décidés par Hector le 06/10.
const SEPT_NOMS: Record<string, string> = {
  hardware: "Pièces métalliques",
  leather: "Cuir et matières",
  box_label: "Étiquette de la boîte",
  tongue_label: "Étiquette de taille",
  tongue_tag: "Badge de languette",
  sole_pattern: "Semelle extérieure",
  wash_label: "Étiquette d'entretien",
};

test("J1 : les sept noms décidés le 06/10 sont ceux de la table", () => {
  assert.equal(Object.keys(SEPT_NOMS).length, 7);
  for (const [zone, nom] of Object.entries(SEPT_NOMS)) {
    assert.equal(ZONE_NAMES[zone], nom, zone);
    assert.notEqual(TABLE_DU_05_10[zone], nom, `${zone} : témoin, le nom a bien changé`);
    // Le nom s'affiche à la place du libellé du catalogue, quel qu'il soit.
    assert.equal(zoneDisplayName(zone, [{ zone, label: "Libellé du catalogue (détail)", weight: 1 }]), nom, zone);
    assert.equal(zoneNameIn(zoneNamesForPoints([{ zone, label: "Libellé du catalogue", weight: 1 }]), zone), nom, zone);
  }
});

test("J1 : le reste de la table ne bouge pas, sans une zone de plus ni de moins", () => {
  assert.deepEqual({ ...ZONE_NAMES }, { ...TABLE_DU_05_10, ...SEPT_NOMS });
  const inchangees = Object.keys(TABLE_DU_05_10).filter((zone) => !(zone in SEPT_NOMS));
  assert.equal(inchangees.length, 23);
  for (const zone of inchangees) assert.equal(ZONE_NAMES[zone], TABLE_DU_05_10[zone], zone);
});

test("J3 : deux zones de la table ne portent jamais le même nom", () => {
  // Avant le 06/10, tongue_label et tongue_tag s'appelaient toutes deux « Étiquette de languette ».
  const doublons = (table: Record<string, string>) => {
    const noms = Object.values(table).map((nom) => nom.toLocaleLowerCase("fr-FR"));
    return [...new Set(noms.filter((nom, i) => noms.indexOf(nom) !== i))];
  };
  assert.deepEqual(doublons(TABLE_DU_05_10), ["étiquette de languette"], "témoin : la recherche trouve le doublon d'avant");
  assert.deepEqual(doublons(ZONE_NAMES), []);
  // Et « Étiquette de la boîte » ne se confond plus avec « Emballage ».
  assert.doesNotMatch(ZONE_NAMES.box_label, /emballage/i);
});

test("les clés de la table sont déjà normalisées : sinon zoneKey ne les trouverait pas", () => {
  for (const cle of Object.keys(ZONE_NAMES)) assert.equal(zoneKey(cle), cle);
});

test("zoneKey : « Box Label », « box-label » et « box_label » désignent la même zone", () => {
  for (const zone of ["box_label", "Box Label", "box-label", "  BOX   LABEL  ", "Box - Label", "box__label"]) {
    assert.equal(zoneKey(zone), "box_label", zone);
  }
  assert.equal(zoneKey("stitching"), "stitching");
  assert.equal(zoneKey("goyardine_canvas_dot_pattern"), "goyardine_canvas_dot_pattern");
});

test("zoneKey : les séparateurs en début et en fin ne font pas partie de l'identifiant", () => {
  assert.equal(zoneKey("_sole_pattern_"), "sole_pattern");
  assert.equal(zoneKey("- stitching"), "stitching");
  assert.equal(zoneKey("box_label -"), "box_label");
  // Une zone écrite « - stitching » par l'IA garde donc son nom français.
  assert.equal(zoneDisplayName("- stitching"), "Coutures");
  assert.equal(zoneNameIn({ heel_tab: "Languette du talon" }, "_heel_tab_"), "Languette du talon");
  // Rien que des séparateurs : pas d'identifiant, pas de nom.
  for (const zone of ["_", "-", "__-__", " - "]) {
    assert.equal(zoneKey(zone), "", zone);
    assert.equal(zoneNameIn({}, zone), "", zone);
  }
});

test("zoneKey : une valeur qui n'est pas une chaîne rend une clé vide", () => {
  for (const valeur of [undefined, null, 12, {}, [], true]) assert.equal(zoneKey(valeur), "");
  assert.equal(zoneKey("   "), "");
});

test("libellé court : le texte avant la parenthèse, les deux-points ou la virgule", () => {
  const attendus: Array<[string, string]> = [
    ["Coutures (regularite, couleur du fil, tension)", "Coutures"],
    ["Hardware/ferrures (gravure, poids, finition)", "Hardware/ferrures"],
    ["Étiquette intérieure : taille, Made in, numéro de série", "Étiquette intérieure"],
    ["Patch Nike + étiquette taille avec SKU cohérent (HJ8463-001)", "Patch Nike + étiquette taille avec SKU cohérent"],
    ["Forme et placement du Swoosh (courbe, pointe)", "Forme et placement du Swoosh"],
    ["Forme et perforations de la toe box", "Forme et perforations de la toe box"],
    ["Tab talon (broderie Nike Air)", "Tab talon"],
    ["Alignement du monogramme LV (symétrie des coutures)", "Alignement du monogramme LV"],
    ["Étiquette série intérieure", "Étiquette série intérieure"],
    ['Estampille "Louis Vuitton Paris"', 'Estampille "Louis Vuitton Paris"'],
    ["Perforations avant-pied alignées, diamètre régulier", "Perforations avant-pied alignées"],
    ["Points goyardine peint main", "Points goyardine peint main"],
  ];
  for (const [libelle, court] of attendus) assert.equal(shortZoneLabel(libelle), court, libelle);
});

test("libellé court : ni espace ni ponctuation en fin, première lettre en majuscule", () => {
  assert.equal(shortZoneLabel("  semelle intérieure .  "), "Semelle intérieure");
  assert.equal(shortZoneLabel("Boîte - (carton d'origine)"), "Boîte");
  assert.equal(shortZoneLabel("œillets et lacets"), "Œillets et lacets");
  assert.equal(shortZoneLabel("étiquette de col"), "Étiquette de col");
});

test("libellé court : vide ou pas une chaîne, pas de libellé", () => {
  for (const valeur of ["", "   ", "(gravure, poids)", ": taille", ", ", undefined, null, 4, {}]) {
    assert.equal(shortZoneLabel(valeur), null, String(valeur));
  }
});

// ── J2 : « Tab talon » devient « Languette du talon », le reste du jargon est gardé ──

test("J2 : la table des corrections est celle décidée, à correspondance exacte", () => {
  assert.deepEqual(
    { ...SHORT_LABEL_FIXES },
    { "Tab talon": "Languette du talon", "Coutures du tab talon": "Coutures de la languette du talon" },
  );
});

test("J2 : les cinq libellés réels du talon donnent « Languette du talon » ou « Coutures de la languette du talon »", () => {
  // Libellés du catalogue (relevé du 06/10) : heel_tab, puis heel_tab_stitching.
  const attendus: Array<[string, string, string]> = [
    ["heel_tab", "Tab talon", "Languette du talon"],
    ["heel_tab", "Tab talon (forme, coutures)", "Languette du talon"],
    ["heel_tab", "Tab talon (forme, logo)", "Languette du talon"],
    ["heel_tab", "Tab talon (pull tab)", "Languette du talon"],
    ["heel_tab_stitching", "Coutures du tab talon", "Coutures de la languette du talon"],
  ];
  for (const [zone, libelle, nom] of attendus) {
    assert.equal(zoneLabelName(libelle), nom, libelle);
    assert.equal(zoneDisplayName(zone, [{ zone, label: libelle, weight: 1 }]), nom, libelle);
    // C'est ce nom que la page passe au navigateur, et que le rapport affiche.
    const noms = zoneNamesForPoints([{ zone, label: libelle, weight: 1 }]);
    assert.deepEqual(noms, { [zone]: nom }, libelle);
    assert.equal(zoneNameIn(noms, zone), nom, libelle);
  }
  // Le calcul du libellé court, lui, ne change pas : la correction vient après.
  assert.equal(shortZoneLabel("Tab talon (forme, logo)"), "Tab talon");
});

test("J2 : les autres libellés du talon et le jargon des autres zones ne changent pas", () => {
  const inchanges: Array<[string, string]> = [
    // Autres libellés de heel_tab dans le catalogue.
    ["Embossage talon", "Embossage talon"],
    ["Pull tab (si applicable)", "Pull tab"],
    // Jargon gardé (décision du 06/10) : « toe box », « midsole ».
    ["Forme et perforations de la toe box", "Forme et perforations de la toe box"],
    ["Midsole (texture, couleur)", "Midsole"],
    // Correspondance exacte : un libellé qui contient « tab talon » sans être l'un des deux n'est pas réécrit.
    ["Logo du tab talon", "Logo du tab talon"],
    ["Tab talon et languette", "Tab talon et languette"],
  ];
  for (const [libelle, nom] of inchanges) {
    assert.equal(zoneLabelName(libelle), nom, libelle);
    assert.equal(zoneDisplayName("zone_hors_table", [{ zone: "zone_hors_table", label: libelle, weight: 1 }]), nom, libelle);
  }
  // Pas de libellé court : pas de nom.
  for (const valeur of ["", "(broderie)", undefined, null, 4]) assert.equal(zoneLabelName(valeur), null, String(valeur));
  // Un libellé qui porte le nom d'une propriété d'objet n'est pas « corrigé ».
  for (const libelle of ["Constructor", "ToString", "HasOwnProperty"]) assert.equal(zoneLabelName(libelle), libelle);
});

// Points d'un modèle, tels que le catalogue les porte : identifiant, libellé, poids.
const POINTS = [
  { zone: "stitching", label: "Coutures (regularite, couleur du fil, tension)", weight: 0.2 },
  { zone: "tongue_label", label: "Etiquette de langue (taille, code produit, pays)", weight: 0.2 },
  { zone: "swoosh", label: "Forme et placement du Swoosh (courbe, pointe)", weight: 0.2 },
  { zone: "heel_tab", label: "Tab talon (broderie Nike Air)", weight: 0.15 },
  { zone: "toe_box", label: "Forme et perforations de la toe box", weight: 0.15 },
  { zone: "box_label", label: "Boite et emballage (etiquette, code-barres)", weight: 0.1 },
];

test("(1) une zone courante prend le nom de la table, pas le libellé du catalogue", () => {
  // Libellés fautifs du catalogue : « Etiquette de langue », « Boite et emballage ».
  assert.equal(zoneDisplayName("tongue_label", POINTS), "Étiquette de taille");
  assert.equal(zoneDisplayName("box_label", POINTS), "Étiquette de la boîte");
  assert.equal(zoneDisplayName("hardware", [{ zone: "hardware", label: "Hardware/ferrures (gravure, poids, finition)", weight: 1 }]), "Pièces métalliques");
  assert.equal(zoneDisplayName("hot_stamp", [{ zone: "hot_stamp", label: "Stamp/marquage a chaud", weight: 1 }]), "Marquage à chaud");
  assert.equal(zoneDisplayName("Tongue Label", POINTS), "Étiquette de taille", "la zone est normalisée avant la recherche");
  assert.equal(zoneDisplayName("date-code"), "Code date / puce RFID");
});

test("(2) sinon le libellé court du point du modèle qui porte la zone", () => {
  assert.equal(zoneDisplayName("swoosh", POINTS), "Forme et placement du Swoosh");
  assert.equal(zoneDisplayName("heel_tab", POINTS), "Languette du talon");
  assert.equal(zoneDisplayName("Heel Tab", POINTS), "Languette du talon", "identifiant normalisé des deux côtés");
  assert.equal(zoneDisplayName("toe-box", POINTS), "Forme et perforations de la toe box");
  assert.equal(
    zoneDisplayName("monogram_alignment", [{ zone: "Monogram Alignment", label: "Alignement du monogramme LV (symétrie des coutures)", weight: 1 }]),
    "Alignement du monogramme LV",
  );
});

test("(2) deux points pour la même zone : le premier donne le nom", () => {
  const points = [
    { zone: "serial_tag", label: "Étiquette série intérieure", weight: 0.5 },
    { zone: "serial_tag", label: "Autre libellé", weight: 0.5 },
  ];
  assert.equal(zoneDisplayName("serial_tag", points), "Étiquette série intérieure");
});

test("(3) sinon l'identifiant rendu lisible : « _ » et tirets en espaces, majuscule initiale", () => {
  assert.equal(zoneDisplayName("insole_print", POINTS), "Insole print");
  assert.equal(zoneDisplayName("insole-print", POINTS), "Insole print");
  assert.equal(zoneDisplayName("heel_tab"), "Heel tab");
  assert.equal(zoneDisplayName("goyardine_canvas_dot_pattern", []), "Goyardine canvas dot pattern");
  // Point sans libellé utilisable : repli sur l'identifiant.
  assert.equal(zoneDisplayName("heel_tab", [{ zone: "heel_tab", label: "(broderie Nike Air)", weight: 1 }]), "Heel tab");
});

test("(3) un texte libre de l'IA garde ses mots, ses accents et ses traits d'union", () => {
  assert.equal(zoneDisplayName("semelle intérieure", POINTS), "Semelle intérieure");
  assert.equal(zoneDisplayName("Renfort de l'avant-pied", POINTS), "Renfort de l'avant-pied");
});

test("points absents ou mal formés : jamais d'erreur, repli sur l'identifiant", () => {
  const malFormes: unknown[] = [
    undefined,
    null,
    "stitching",
    42,
    { zone: "heel_tab", label: "Tab talon" },
    [null, undefined, 3, "heel_tab", [], {}],
    [{ label: "Tab talon" }],
    [{ zone: "heel_tab" }],
    [{ zone: "heel_tab", label: null }],
    [{ zone: "heel_tab", label: 12 }],
    [{ zone: 7, label: "Tab talon" }],
  ];
  for (const points of malFormes) {
    assert.equal(zoneDisplayName("heel_tab", points), "Heel tab", JSON.stringify(points));
    assert.equal(zoneDisplayName("stitching", points), "Coutures", JSON.stringify(points));
    assert.deepEqual(
      Object.values(zoneNamesForPoints(points)).filter((nom) => nom !== "Heel tab"),
      [],
      JSON.stringify(points),
    );
  }
  assert.equal(zoneDisplayName(undefined, POINTS), "");
  assert.equal(zoneDisplayName(null), "");
  assert.equal(zoneDisplayName(""), "");
});

test("table des noms d'un modèle : un nom par identifiant normalisé, et rien d'autre", () => {
  const noms = zoneNamesForPoints([
    ...POINTS,
    { zone: "Serial Tag", label: "Étiquette série intérieure", weight: 0.1 },
    { zone: "stamping", label: 'Estampille "Louis Vuitton Paris"', weight: 0.1 },
    { zone: "insole_print", label: "", weight: 0.1 },
  ]);
  assert.deepEqual(noms, {
    stitching: "Coutures",
    tongue_label: "Étiquette de taille",
    swoosh: "Forme et placement du Swoosh",
    heel_tab: "Languette du talon",
    toe_box: "Forme et perforations de la toe box",
    box_label: "Étiquette de la boîte",
    serial_tag: "Étiquette série intérieure",
    stamping: 'Estampille "Louis Vuitton Paris"',
    insole_print: "Insole print",
  });
  // Ni poids, ni libellé entier : la table est tout ce que reçoit le navigateur.
  const envoye = JSON.stringify(noms);
  assert.doesNotMatch(envoye, /weight|0\.\d|regularite|courbe, pointe|broderie Nike Air/);
  // Un objet simple : React refuse de passer autre chose à un composant client.
  assert.equal(Object.getPrototypeOf(noms), Object.prototype);
});

test("zoneNameIn : le nom de la table du modèle, sinon la table courante, sinon l'identifiant lisible", () => {
  const noms = zoneNamesForPoints(POINTS);
  assert.equal(zoneNameIn(noms, "swoosh"), "Forme et placement du Swoosh");
  assert.equal(zoneNameIn(noms, "Heel Tab"), "Languette du talon", "texte libre de l'IA, normalisé avant la recherche");
  assert.equal(zoneNameIn(noms, "heel-tab"), "Languette du talon");
  assert.equal(zoneNameIn(noms, "zipper"), "Fermeture éclair", "zone courante absente du modèle");
  assert.equal(zoneNameIn(noms, "insole_print"), "Insole print");
  for (const table of [null, undefined, {}, [], "x", 3]) {
    assert.equal(zoneNameIn(table, "stitching"), "Coutures");
    assert.equal(zoneNameIn(table, "heel_tab"), "Heel tab");
  }
});

test("zoneNameIn : un nom vide, ou qui n'est pas un texte, dans la table ne s'affiche pas", () => {
  for (const nom of ["", "   ", null, 12, {}]) {
    assert.equal(zoneNameIn({ heel_tab: nom }, "heel_tab"), "Heel tab", JSON.stringify(nom));
    assert.equal(zoneNameIn({ stitching: nom }, "stitching"), "Coutures", JSON.stringify(nom));
  }
});

test("zoneNameIn : seuls les noms que la table porte elle-même comptent, pas ceux de son prototype", () => {
  const herite = Object.create({ heel_tab: "Nom hérité" }) as Record<string, string>;
  assert.equal(herite.heel_tab, "Nom hérité", "témoin : le nom est lisible par le prototype");
  assert.equal(zoneNameIn(herite, "heel_tab"), "Heel tab");
  herite.swoosh = "Forme et placement du Swoosh";
  assert.equal(zoneNameIn(herite, "swoosh"), "Forme et placement du Swoosh");
});

test("un identifiant qui porte le nom d'une propriété d'objet ne casse rien", () => {
  for (const zone of ["constructor", "toString", "__proto__", "hasOwnProperty"]) {
    assert.equal(typeof zoneDisplayName(zone, POINTS), "string", zone);
    assert.equal(typeof zoneNameIn(zoneNamesForPoints(POINTS), zone), "string", zone);
    assert.equal(typeof zoneNameIn(zoneNamesForPoints([{ zone, label: "Libellé", weight: 1 }]), zone), "string", zone);
  }
  assert.equal(zoneDisplayName("constructor"), "Constructor");
  assert.equal(zoneNameIn({}, "toString"), "ToString");
  // Un point du modèle peut porter un tel identifiant : il garde son libellé.
  for (const zone of ["constructor", "toString", "valueOf", "hasOwnProperty"]) {
    const noms = zoneNamesForPoints([{ zone, label: "Libellé du point (détail)", weight: 1 }]);
    assert.deepEqual(Object.keys(noms), [zoneKey(zone)], zone);
    assert.equal(zoneNameIn(noms, zone), "Libellé du point", zone);
  }
});

// ── J3 : deux zones d'un même rapport ne portent jamais le même nom ─────────

/** Les noms d'une table, dans l'ordre des zones. */
const nomsDe = (table: Record<string, string>) => Object.entries(table);
/** Aucun nom en double dans la table d'un modèle, casse et espaces ignorés. */
function sansDoublon(table: Record<string, string>) {
  const lus = Object.values(table).map((nom) => nom.trim().replace(/\s+/g, " ").toLocaleLowerCase("fr-FR"));
  assert.equal(new Set(lus).size, lus.length, JSON.stringify(table));
}

test("J3 : deux zones au même nom de table, la première garde le nom, la seconde prend son libellé court", () => {
  // La table d'avant le 06/10 : tongue_label et tongue_tag, « Étiquette de languette » toutes deux.
  const points = [
    { zone: "stitching", label: "Coutures (regularite, couleur du fil, tension)", weight: 0.4 },
    { zone: "tongue_label", label: "Etiquette de langue (taille, code produit, pays)", weight: 0.3 },
    { zone: "tongue_tag", label: "Patch de languette (logo, coutures)", weight: 0.3 },
  ];
  const noms = zoneNamesForPoints(points, TABLE_DU_05_10);
  assert.deepEqual(nomsDe(noms), [
    ["stitching", "Coutures"],
    ["tongue_label", "Étiquette de languette"],
    ["tongue_tag", "Patch de languette"],
  ]);
  sansDoublon(noms);
  // Dans l'autre ordre, c'est l'autre zone qui garde le nom de la table.
  const inverse = zoneNamesForPoints([points[2], points[1]], TABLE_DU_05_10);
  assert.deepEqual(nomsDe(inverse), [
    ["tongue_tag", "Étiquette de languette"],
    ["tongue_label", "Etiquette de langue"],
  ]);
  // Avec la table du 06/10, ces deux zones ont chacune leur nom : rien à départager.
  assert.deepEqual(nomsDe(zoneNamesForPoints(points)), [
    ["stitching", "Coutures"],
    ["tongue_label", "Étiquette de taille"],
    ["tongue_tag", "Badge de languette"],
  ]);
});

test("J3 : deux zones au même libellé court, la première garde le nom, la seconde prend son identifiant rendu lisible", () => {
  const noms = zoneNamesForPoints([
    { zone: "swoosh", label: "Forme et placement du Swoosh (courbe, pointe)", weight: 0.5 },
    { zone: "swoosh_inner", label: "Forme et placement du Swoosh (face intérieure)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(noms), [
    ["swoosh", "Forme et placement du Swoosh"],
    ["swoosh_inner", "Swoosh inner"],
  ]);
  sansDoublon(noms);
  // Le libellé corrigé (J2) compte aussi : deux « Languette du talon ».
  const talon = zoneNamesForPoints([
    { zone: "heel_tab", label: "Tab talon (forme, logo)", weight: 0.5 },
    { zone: "heel_tab_back", label: "Tab talon (pull tab)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(talon), [
    ["heel_tab", "Languette du talon"],
    ["heel_tab_back", "Heel tab back"],
  ]);
});

test("J3 : le nom de table d'une zone est pris par le libellé d'une zone précédente, elle prend son candidat suivant", () => {
  // « Coutures » est pris par une zone hors table : stitching ne peut plus le porter.
  const noms = zoneNamesForPoints([
    { zone: "upper_seams", label: "Coutures", weight: 0.5 },
    { zone: "stitching", label: "Surpiqûres (regularite, tension)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(noms), [
    ["upper_seams", "Coutures"],
    ["stitching", "Surpiqûres"],
  ]);
  // La première zone garde toujours son nom, même quand la seconde est une zone de la table.
  assert.equal(noms.upper_seams, "Coutures");
});

test("J3 : deux noms qui se lisent pareil sont le même nom, casse et espaces ignorés", () => {
  const noms = zoneNamesForPoints([
    { zone: "logo_front", label: "Logo LV", weight: 0.5 },
    { zone: "logo_back", label: "logo  lv (dos)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(noms), [
    ["logo_front", "Logo LV"],
    ["logo_back", "Logo back"],
  ]);
});

test("J3 : deux noms qui ne diffèrent que par un accent, la forme de l'apostrophe ou une ligature sont le même nom", () => {
  // Le catalogue porte ces variantes : « Etiquette interieure », « Oeillets et lacets ».
  const cas: Array<[string, string, string]> = [
    ["accent", "Etiquette de taille", "Étiquette de taille (police)"],
    ["accent, dans l'autre sens", "Étiquette de taille", "Etiquette de taille (police)"],
    ["apostrophe", "Étiquette d\u2019entretien", "Étiquette d'entretien (symboles)"],
    ["ligature", "Oeillets et lacets", "Œillets et lacets (métal)"],
    // La même lettre accentuée, en un caractère ou en deux (lettre + accent).
    ["forme composée ou décomposée", "Étiquette de taille".normalize("NFD"), "Étiquette de taille".normalize("NFC")],
  ];
  for (const [quoi, premier, second] of cas) {
    const noms = zoneNamesForPoints([
      { zone: "zone_a", label: premier, weight: 0.5 },
      { zone: "zone_b", label: second, weight: 0.5 },
    ]);
    // La première garde son nom tel qu'il est écrit ; la seconde prend son identifiant rendu lisible.
    assert.deepEqual(nomsDe(noms), [["zone_a", premier], ["zone_b", "Zone b"]], quoi);
  }
  // Deux libellés réels du catalogue : le nom de table de interior_label est
  // pris, son libellé sans accent n'est pas un nom libre pour autant.
  const etiquettes = zoneNamesForPoints([
    { zone: "tag_label", label: "Étiquette intérieure", weight: 0.5 },
    { zone: "interior_label", label: "Etiquette interieure (police, numero de serie)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(etiquettes), [
    ["tag_label", "Étiquette intérieure"],
    ["interior_label", "Interior label"],
  ]);
  // Témoin : deux noms vraiment différents restent deux noms.
  const differents = zoneNamesForPoints([
    { zone: "zone_a", label: "Étiquette de taille", weight: 0.5 },
    { zone: "zone_b", label: "Étiquette de col", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(differents), [["zone_a", "Étiquette de taille"], ["zone_b", "Étiquette de col"]]);
});

test("J3 : tous les noms possibles sont pris, c'est le dernier (l'identifiant rendu lisible) qui reçoit le numéro", () => {
  // Les trois noms possibles de tongue_label sont différents, et tous pris :
  // nom de la table, libellé court du catalogue, identifiant rendu lisible.
  const points = [
    { zone: "z1", label: "Étiquette de taille", weight: 0.25 },
    { zone: "z2", label: "Etiquette de langue", weight: 0.25 },
    { zone: "z3", label: "Tongue label", weight: 0.25 },
    { zone: "tongue_label", label: "Etiquette de langue (taille)", weight: 0.25 },
  ];
  const noms = zoneNamesForPoints(points, { tongue_label: "Étiquette de taille" });
  assert.deepEqual(nomsDe(noms), [
    ["z1", "Étiquette de taille"],
    ["z2", "Etiquette de langue"],
    ["z3", "Tongue label"],
    // Ni « Étiquette de taille 2 » (le premier), ni « Etiquette de langue 2 » (le deuxième).
    ["tongue_label", "Tongue label 2"],
  ]);
  sansDoublon(noms);
  // Témoin : tant qu'un des trois est libre, la zone le prend, sans numéro.
  assert.equal(zoneNamesForPoints(points.slice(1), { tongue_label: "Étiquette de taille" }).tongue_label, "Étiquette de taille");
  assert.equal(zoneNamesForPoints([points[0], points[2], points[3]], { tongue_label: "Étiquette de taille" }).tongue_label, "Etiquette de langue");
  assert.equal(zoneNamesForPoints([points[0], points[1], points[3]], { tongue_label: "Étiquette de taille" }).tongue_label, "Tongue label");
});

test("J3 : tous les noms possibles sont pris, le dernier est suivi d'un numéro, « 2 » puis « 3 »", () => {
  // La zone « semelle » n'est pas dans la table ; son libellé court et son
  // identifiant rendu lisible se lisent tous deux « Semelle », déjà pris.
  const noms = zoneNamesForPoints([
    { zone: "outsole", label: "Semelle", weight: 0.5 },
    { zone: "semelle", label: "Semelle (dessous)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(noms), [
    ["outsole", "Semelle"],
    ["semelle", "Semelle 2"],
  ]);
  sansDoublon(noms);
  // Le numéro saute ceux qui sont pris : « Semelle 2 » l'est, « Semelle 3 » est libre.
  const troisieme = zoneNamesForPoints([
    { zone: "outsole", label: "Semelle", weight: 0.4 },
    { zone: "insole", label: "Semelle 2", weight: 0.3 },
    { zone: "semelle", label: "Semelle (dessous)", weight: 0.3 },
  ]);
  assert.deepEqual(nomsDe(troisieme), [
    ["outsole", "Semelle"],
    ["insole", "Semelle 2"],
    ["semelle", "Semelle 3"],
  ]);
  sansDoublon(troisieme);
  // Le numéro est le dernier recours : tant qu'un nom possible est libre, il n'y en a pas.
  const libre = zoneNamesForPoints([
    { zone: "outsole", label: "Semelle", weight: 0.5 },
    { zone: "sole", label: "Semelle (dessous)", weight: 0.5 },
  ]);
  assert.deepEqual(nomsDe(libre), [
    ["outsole", "Semelle"],
    ["sole", "Sole"],
  ]);
});

test("J3 : sans nom en double, la table d'un modèle est exactement celle d'avant", () => {
  // Chaque zone garde son premier nom possible : le garde-fou ne change rien.
  const noms = zoneNamesForPoints(POINTS);
  for (const [zone, nom] of Object.entries(noms)) assert.equal(nom, zoneDisplayName(zone, POINTS), zone);
  sansDoublon(noms);
});

// ── J3, sur tout le rapport : une zone notée hors des points du modèle ──────

// Deux libellés réels du catalogue (relevé du 06/10) : outsole porte « Semelle
// extérieure (motif, couleur) » sur certains modèles, « Semelle (motif, couleur
// gomme) » sur d'autres.
const SEMELLE_EXTERIEURE = [
  { zone: "stitching", label: "Coutures (regularite, couleur du fil, tension)", weight: 0.5 },
  { zone: "outsole", label: "Semelle extérieure (motif, couleur)", weight: 0.5 },
];

test("rapport : sole_pattern notée hors des points d'un modèle qui porte outsole ne s'appelle pas « Semelle extérieure » une seconde fois", () => {
  const modele = zoneNamesForPoints(SEMELLE_EXTERIEURE);
  assert.equal(modele.outsole, "Semelle extérieure");
  // Témoin : sans la table du rapport, les deux zones porteraient le même nom.
  assert.equal(zoneNameIn(modele, "sole_pattern"), zoneNameIn(modele, "outsole"));
  const noms = zoneNamesForReport(modele, ["stitching", "outsole", "sole_pattern"]);
  assert.deepEqual(noms, { stitching: "Coutures", outsole: "Semelle extérieure", sole_pattern: "Sole pattern" });
  sansDoublon(noms);
  // C'est dans cette table que le rapport lit le nom de chaque zone.
  assert.equal(zoneNameIn(noms, "outsole"), "Semelle extérieure");
  assert.equal(zoneNameIn(noms, "sole_pattern"), "Sole pattern");
});

test("rapport : l'autre collision du catalogue, interior_label notée hors d'un modèle qui porte tag_label « Étiquette intérieure »", () => {
  const modele = zoneNamesForPoints([{ zone: "tag_label", label: "Étiquette intérieure", weight: 1 }]);
  const noms = zoneNamesForReport(modele, ["tag_label", "interior_label"]);
  assert.deepEqual(noms, { tag_label: "Étiquette intérieure", interior_label: "Interior label" });
});

test("rapport : la zone du modèle garde son nom, même quand la zone hors modèle est notée avant elle", () => {
  const modele = zoneNamesForPoints(SEMELLE_EXTERIEURE);
  const noms = zoneNamesForReport(modele, ["sole_pattern", "outsole", "stitching"]);
  assert.equal(noms.outsole, "Semelle extérieure");
  assert.equal(noms.sole_pattern, "Sole pattern");
});

test("rapport : seuls les noms des zones affichées sont pris", () => {
  // outsole est dans le modèle, mais ce rapport ne l'affiche pas : sole_pattern garde son nom français.
  const modele = zoneNamesForPoints(SEMELLE_EXTERIEURE);
  assert.deepEqual(zoneNamesForReport(modele, ["stitching", "sole_pattern"]), {
    stitching: "Coutures",
    sole_pattern: "Semelle extérieure",
  });
  // La table ne nomme que les zones du rapport.
  assert.deepEqual(zoneNamesForReport(modele, []), {});
});

test("rapport : une zone écrite de deux façons, ou citée plusieurs fois, n'a qu'un nom et pas de numéro", () => {
  const modele = zoneNamesForPoints(SEMELLE_EXTERIEURE);
  // Notée « sole_pattern », commentée « Sole Pattern » dans deux observations ; outsole de même.
  const noms = zoneNamesForReport(modele, ["outsole", "sole_pattern", "Outsole", "Sole Pattern", "sole-pattern", "outsole"]);
  assert.deepEqual(noms, { outsole: "Semelle extérieure", sole_pattern: "Sole pattern" });
  for (const zone of ["sole_pattern", "Sole Pattern", "sole-pattern"]) assert.equal(zoneNameIn(noms, zone), "Sole pattern", zone);
});

test("rapport : deux zones hors du modèle au même nom, la première garde le nom, la seconde prend le suivant, puis un numéro", () => {
  // Texte libre de l'IA, puis identifiant de la table : même nom, « Semelle extérieure ».
  assert.deepEqual(zoneNamesForReport({}, ["Semelle extérieure", "sole_pattern"]), {
    "semelle_extérieure": "Semelle extérieure",
    sole_pattern: "Sole pattern",
  });
  // Dans l'autre ordre, le texte libre n'a qu'un nom possible, déjà pris : un numéro.
  assert.deepEqual(zoneNamesForReport({}, ["sole_pattern", "Semelle extérieure"]), {
    sole_pattern: "Semelle extérieure",
    "semelle_extérieure": "Semelle extérieure 2",
  });
  // Accents ignorés, comme dans la table d'un modèle.
  assert.deepEqual(zoneNamesForReport({}, ["sole_pattern", "semelle exterieure"]), {
    sole_pattern: "Semelle extérieure",
    semelle_exterieure: "Semelle exterieure 2",
  });
});

test("rapport : sans nom en double, chaque zone porte exactement le nom d'avant", () => {
  const modele = zoneNamesForPoints(POINTS);
  // Zones du modèle, zone courante absente du modèle, identifiant inconnu, texte libre.
  const zones = [...POINTS.map((point) => point.zone), "zipper", "insole_print", "Renfort de l'avant-pied", "Heel Tab"];
  const noms = zoneNamesForReport(modele, zones);
  for (const zone of zones) assert.equal(zoneNameIn(noms, zone), zoneNameIn(modele, zone), zone);
  assert.equal(Object.keys(noms).length, zones.length - 1, "« Heel Tab » et « heel_tab » : une seule zone");
  sansDoublon(noms);
  // Sans table du modèle (modèle désactivé depuis) : les noms de la table courante, les autres lisibles.
  for (const table of [null, undefined, {}, [], "x", 3]) {
    assert.deepEqual(zoneNamesForReport(table, ["stitching", "heel_tab"]), { stitching: "Coutures", heel_tab: "Heel tab" });
  }
});

test("rapport : une table de modèle qui porterait deux fois le même nom est départagée aussi", () => {
  // La page passe toujours une table sans doublon (zoneNamesForPoints) : garde-fou.
  const noms = zoneNamesForReport({ heel_tab: "Languette du talon", heel_tab_back: "Languette du talon" }, ["heel_tab", "heel_tab_back"]);
  assert.deepEqual(noms, { heel_tab: "Languette du talon", heel_tab_back: "Heel tab back" });
});

test("rapport : zones absentes ou mal formées, jamais d'erreur ; une zone sans identifiant est ignorée", () => {
  const modele = zoneNamesForPoints(POINTS);
  for (const zones of [undefined, null, "stitching", 42, {}]) assert.deepEqual(zoneNamesForReport(modele, zones), {}, JSON.stringify(zones));
  assert.deepEqual(zoneNamesForReport(modele, [undefined, null, 12, {}, [], "", "  ", "_", "-", "stitching"]), { stitching: "Coutures" });
  // Identifiants qui portent le nom d'une propriété d'objet.
  const noms = zoneNamesForReport(modele, ["constructor", "toString", "__proto__", "hasOwnProperty"]);
  assert.deepEqual(noms, { constructor: "Constructor", tostring: "ToString", proto: "Proto", hasownproperty: "HasOwnProperty" });
  // Un objet simple, qui porte lui-même ces quatre noms : React refuse de passer autre chose à un composant client.
  assert.equal(Object.getPrototypeOf(noms), Object.prototype);
  assert.deepEqual(Object.keys(noms), ["constructor", "tostring", "proto", "hasownproperty"]);
});
