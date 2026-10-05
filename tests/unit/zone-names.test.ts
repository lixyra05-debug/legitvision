// Noms des zones du rapport, en français (décision d'Hector du 05/10). Le
// rapport affichait l'identifiant de la zone (« stitching », « tongue label »).
// lib/zone-names.ts donne le nom à afficher : la table des zones courantes
// d'abord, puis le libellé court du point d'authentification du modèle, puis
// l'identifiant rendu lisible. Les libellés (zone | libellé) viennent du
// catalogue, relevés le 2026-10-05.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ZONE_NAMES,
  shortZoneLabel,
  zoneDisplayName,
  zoneKey,
  zoneNameIn,
  zoneNamesForPoints,
} from "@/lib/zone-names";

test("la table des zones courantes est celle décidée, sans une entrée de plus ni de moins", () => {
  assert.deepEqual(
    { ...ZONE_NAMES },
    {
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
    },
  );
  // Les clés de la table sont déjà normalisées : sinon zoneKey ne les trouverait pas.
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
  assert.equal(zoneNameIn({ heel_tab: "Tab talon" }, "_heel_tab_"), "Tab talon");
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
  assert.equal(zoneDisplayName("tongue_label", POINTS), "Étiquette de languette");
  assert.equal(zoneDisplayName("box_label", POINTS), "Boîte et emballage");
  assert.equal(zoneDisplayName("hardware", [{ zone: "hardware", label: "Hardware/ferrures (gravure, poids, finition)", weight: 1 }]), "Quincaillerie");
  assert.equal(zoneDisplayName("hot_stamp", [{ zone: "hot_stamp", label: "Stamp/marquage a chaud", weight: 1 }]), "Marquage à chaud");
  assert.equal(zoneDisplayName("Tongue Label", POINTS), "Étiquette de languette", "la zone est normalisée avant la recherche");
  assert.equal(zoneDisplayName("date-code"), "Code date / puce RFID");
});

test("(2) sinon le libellé court du point du modèle qui porte la zone", () => {
  assert.equal(zoneDisplayName("swoosh", POINTS), "Forme et placement du Swoosh");
  assert.equal(zoneDisplayName("heel_tab", POINTS), "Tab talon");
  assert.equal(zoneDisplayName("Heel Tab", POINTS), "Tab talon", "identifiant normalisé des deux côtés");
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
    tongue_label: "Étiquette de languette",
    swoosh: "Forme et placement du Swoosh",
    heel_tab: "Tab talon",
    toe_box: "Forme et perforations de la toe box",
    box_label: "Boîte et emballage",
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
  assert.equal(zoneNameIn(noms, "Heel Tab"), "Tab talon", "texte libre de l'IA, normalisé avant la recherche");
  assert.equal(zoneNameIn(noms, "heel-tab"), "Tab talon");
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
