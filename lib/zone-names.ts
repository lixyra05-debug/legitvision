/**
 * Noms affichés des zones d'un rapport, en français.
 *
 * L'IA note chaque zone sous son identifiant (« stitching », « tongue_label »),
 * celui des points d'authentification du modèle : c'est lui qui est enregistré
 * dans `sub_scores` et dans les observations, et il ne change pas. Ce fichier ne
 * sert qu'à l'affichage.
 *
 * Sans dépendance serveur : la page du rapport (serveur) en tire la table des
 * noms d'un modèle ; le rapport (client) la complète des zones que l'IA a
 * notées hors du modèle, et y cherche le nom de chaque zone qu'il affiche.
 */

/**
 * Noms des zones courantes, par identifiant normalisé. Décision d'Hector du
 * 05/10 : les noms des zones s'affichent en français partout. Les libellés
 * du catalogue ont des fautes d'accent et du franglais (« Etiquette de
 * langue », « Hardware/ferrures ») : pour ces zones, on affiche ce nom,
 * jamais le libellé. Les 23 premières sont les zones communes à la plupart
 * des modèles (3 628 des 3 917 points au relevé du 05/10) ; les sept
 * dernières corrigent un libellé isolé.
 *
 * Sept noms revus par Hector le 06/10, à la lecture des rapports : « Pièces
 * métalliques » (le mot du résumé de l'IA), « Cuir et matières », « Étiquette
 * de la boîte » (à ne pas confondre avec « Emballage »), « Étiquette de
 * taille », « Badge de languette », « Semelle extérieure », « Étiquette
 * d'entretien ». Deux zones ne portent jamais le même nom : chaque nom de
 * cette table est unique (tests/unit/zone-names.test.ts).
 */
export const ZONE_NAMES: Readonly<Record<string, string>> = {
  stitching: "Coutures",
  packaging: "Emballage",
  date_code: "Code date / puce RFID",
  hardware: "Pièces métalliques",
  zipper: "Fermeture éclair",
  interior_label: "Étiquette intérieure",
  leather: "Cuir et matières",
  lining: "Doublure",
  hot_stamp: "Marquage à chaud",
  logo_monogram: "Logo et monogramme",
  neck_label: "Étiquette de col",
  closures: "Fermetures",
  fabric: "Tissu",
  tags: "Étiquettes volantes",
  print_embroidery: "Imprimé et broderie",
  materials: "Matériaux",
  tongue_label: "Étiquette de taille",
  sole_pattern: "Semelle extérieure",
  logo_placement: "Logo",
  product_code: "Code produit",
  wash_label: "Étiquette d'entretien",
  box_label: "Étiquette de la boîte",
  eyelets: "Œillets et lacets",
  tongue_tag: "Badge de languette",
  air_sole_unit: "Unité Air",
  leather_quality: "Qualité du cuir",
  og_sole: "Semelle OG",
  laces: "Lacets",
  midsole_stitching: "Couture de la midsole",
  toe_perforations: "Perforations de l'avant-pied",
};

/**
 * Corrections des libellés courts du catalogue, à correspondance exacte.
 * Décision d'Hector du 06/10 : les zones hors de la table gardent le libellé
 * court du catalogue, jargon compris (« toe box », « midsole »), sauf « Tab
 * talon », qui devient « Languette du talon ». Les autres libellés du talon
 * (« Embossage talon », « Pull tab ») ne changent pas.
 */
export const SHORT_LABEL_FIXES: Readonly<Record<string, string>> = {
  "Tab talon": "Languette du talon",
  "Coutures du tab talon": "Coutures de la languette du talon",
};

/** Table { identifiant normalisé : nom affiché } des zones d'un modèle. */
export type ZoneNames = Record<string, string>;

/** Une table lue ailleurs (JSON, props) peut porter « constructor », « toString »… */
function lire(table: unknown, cle: string): string | null {
  if (!table || typeof table !== "object" || Array.isArray(table)) return null;
  if (!Object.prototype.hasOwnProperty.call(table, cle)) return null;
  const nom = (table as Record<string, unknown>)[cle];
  return typeof nom === "string" && nom.trim() !== "" ? nom : null;
}

function majuscule(texte: string): string {
  return texte.charAt(0).toLocaleUpperCase("fr-FR") + texte.slice(1);
}

/**
 * Identifiant normalisé d'une zone : espaces en trop retirés, minuscules,
 * espaces et tirets changés en « _ ». « Box Label », « box-label » et
 * « box_label » désignent la même zone. Une valeur qui n'est pas une chaîne
 * rend une clé vide.
 */
export function zoneKey(zone: unknown): string {
  if (typeof zone !== "string") return "";
  return zone
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Libellé court d'un libellé du catalogue : le texte avant la première
 * parenthèse ouvrante, les premiers deux-points ou la première virgule, sans
 * espace ni ponctuation en fin, première lettre en majuscule. « Coutures
 * (regularite, couleur du fil, tension) » donne « Coutures ». Vide, ou pas une
 * chaîne : pas de libellé (null).
 */
export function shortZoneLabel(label: unknown): string | null {
  if (typeof label !== "string") return null;
  const court = label
    .split(/[(:,]/)[0]
    .trim()
    .replace(/[\s.;!?…·\/–—-]+$/, "");
  return court === "" ? null : majuscule(court);
}

/**
 * Nom tiré d'un libellé du catalogue : son libellé court, corrigé s'il est
 * dans la table des corrections. « Tab talon (broderie Nike Air) » donne
 * « Languette du talon ». Pas de libellé court : pas de nom (null).
 */
export function zoneLabelName(label: unknown): string | null {
  const court = shortZoneLabel(label);
  return court === null ? null : (lire(SHORT_LABEL_FIXES, court) ?? court);
}

/**
 * Repli : l'identifiant rendu lisible, « _ » et tirets en espaces, première
 * lettre en majuscule (« heel_tab » donne « Heel tab »). Les tirets d'un texte
 * libre, qui contient déjà des espaces, sont gardés : « Perforations de
 * l'avant-pied » ne perd pas le sien.
 */
function nomLisible(zone: unknown): string {
  if (typeof zone !== "string") return "";
  const texte = zone.trim();
  const separateurs = /\s/.test(texte) ? /[\s_]+/g : /[\s_-]+/g;
  return majuscule(texte.replace(separateurs, " ").trim());
}

/** Premier point du modèle qui porte cette zone ; null s'il n'y en a pas. */
function pointDeLaZone(cle: string, points: unknown): { label?: unknown } | null {
  if (!Array.isArray(points)) return null;
  for (const point of points) {
    if (!point || typeof point !== "object") continue;
    if (zoneKey((point as { zone?: unknown }).zone) === cle) return point as { label?: unknown };
  }
  return null;
}

/**
 * Les noms possibles d'une zone, du meilleur au repli : (1) le nom de la
 * table ; (2) le nom tiré du libellé du premier point du modèle qui porte
 * cette zone, s'il n'est pas vide ; (3) l'identifiant rendu lisible. Zone sans
 * identifiant : aucun. `points` vient de la base
 * (`models.authentication_points`, JSONB) : absent, pas un tableau ou mal
 * formé, il est ignoré, sans erreur.
 */
function candidats(zone: unknown, points: unknown, table: unknown): string[] {
  const cle = zoneKey(zone);
  if (cle === "") return [];
  return [lire(table, cle), zoneLabelName(pointDeLaZone(cle, points)?.label), nomLisible(zone)].filter(
    (nom): nom is string => nom !== null && nom !== "",
  );
}

/**
 * Nom affiché d'une zone : le premier de ses noms possibles (table, libellé
 * du catalogue, identifiant rendu lisible). Zone sans identifiant : nom vide.
 */
export function zoneDisplayName(zone: unknown, points?: unknown): string {
  return candidats(zone, points, ZONE_NAMES)[0] ?? "";
}

/**
 * Deux noms qui se lisent pareil sont le même nom : casse, espaces, accents,
 * forme de l'apostrophe et ligatures ignorés. Le catalogue porte ces variantes
 * (« Etiquette interieure » et « Étiquette intérieure », « Oeillets et
 * lacets » et « Œillets et lacets »). Ne sert qu'à comparer : le nom affiché
 * n'est jamais modifié, la première zone garde le sien tel qu'il est écrit.
 */
function empreinte(nom: string): string {
  return (
    nom
      // Lettre et accent séparés, puis accents retirés : « é » composé ou
      // décomposé, avec ou sans accent, donne « e ».
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Apostrophes typographiques (’ ‘ ʼ) ramenées à l'apostrophe droite.
      .replace(/[\u2019\u2018\u02bc]/g, "'")
      .toLocaleLowerCase("fr-FR")
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .trim()
      .replace(/\s+/g, " ")
  );
}

/**
 * Le premier nom possible que n'a pas pris une zone précédente ; s'ils sont
 * tous pris, le dernier, suivi du premier numéro libre (« Heel tab 2 »).
 */
function nomLibre(possibles: readonly string[], pris: ReadonlySet<string>): string {
  for (const nom of possibles) {
    if (!pris.has(empreinte(nom))) return nom;
  }
  const dernier = possibles[possibles.length - 1];
  for (let numero = 2; ; numero += 1) {
    const nom = `${dernier} ${numero}`;
    if (!pris.has(empreinte(nom))) return nom;
  }
}

/**
 * Table { identifiant normalisé : nom affiché } des points d'un modèle. C'est
 * elle, et elle seule, que la page du rapport passe au navigateur : ni les
 * points, ni leurs libellés entiers, ni leurs poids.
 *
 * Deux zones d'un même rapport ne portent jamais le même nom (décision
 * d'Hector du 06/10). La première zone garde son nom ; une zone dont le nom
 * est déjà pris prend son nom possible suivant qui est libre (table, libellé
 * du catalogue, identifiant rendu lisible), et en dernier recours un numéro.
 * D'après le relevé du catalogue du 06/10, aucun modèle n'est dans ce cas :
 * c'est un garde-fou pour les prochains points et les prochains noms de la
 * table. `table` : la table des noms courants, remplaçable dans les tests.
 */
export function zoneNamesForPoints(
  points: unknown,
  table: Readonly<Record<string, string>> = ZONE_NAMES,
): ZoneNames {
  const noms: ZoneNames = {};
  if (!Array.isArray(points)) return noms;
  const pris = new Set<string>();
  for (const point of points) {
    if (!point || typeof point !== "object") continue;
    const { zone } = point as { zone?: unknown };
    const cle = zoneKey(zone);
    // Clé vide : point sans zone.
    if (cle === "") continue;
    // Deux points pour la même zone : le premier donne le nom.
    if (Object.prototype.hasOwnProperty.call(noms, cle)) continue;
    const nom = nomLibre(candidats(zone, points, table), pris);
    pris.add(empreinte(nom));
    noms[cle] = nom;
  }
  return noms;
}

/**
 * Table { identifiant normalisé : nom affiché } de toutes les zones qu'un
 * rapport affiche : `zones` porte les zones notées (« Scores par zone ») puis
 * celles des observations, telles que l'IA les a écrites. C'est la seule table
 * du rapport : une barre et une observation de la même zone y lisent le même
 * nom.
 *
 * L'IA peut noter une zone qui n'est pas dans les points du modèle : la table
 * du modèle (`names`, zoneNamesForPoints) ne la connaît pas, et son nom de la
 * table des zones courantes peut être celui d'une zone du modèle (sole_pattern,
 * « Semelle extérieure », face à outsole, dont le libellé du catalogue est
 * « Semelle extérieure (motif, couleur) »). Deux zones d'un même rapport ne
 * portent jamais le même nom (décision d'Hector du 06/10) :
 * - les zones du modèle sont servies d'abord, et gardent le nom de sa table,
 *   où qu'elles soient dans `zones` ;
 * - une zone hors du modèle dont le nom est déjà pris par une zone affichée
 *   prend son nom possible suivant, comme dans la table d'un modèle : nom de la
 *   table des zones courantes, identifiant rendu lisible, puis un numéro ;
 * - seuls les noms des zones affichées sont pris : une zone du modèle absente
 *   du rapport ne retire son nom à personne.
 * Une même zone écrite de deux façons (« Sole Pattern », « sole_pattern ») ou
 * citée plusieurs fois n'a qu'un nom. Zone sans identifiant : ignorée.
 * `names` et `zones` viennent de la base (JSONB) : mal formés, ils sont
 * ignorés, sans erreur. `table` : la table des noms courants, remplaçable dans
 * les tests.
 */
export function zoneNamesForReport(
  names: unknown,
  zones: unknown,
  table: Readonly<Record<string, string>> = ZONE_NAMES,
): ZoneNames {
  const noms: ZoneNames = {};
  if (!Array.isArray(zones)) return noms;
  // Les zones affichées, une fois chacune, dans l'ordre du rapport.
  const affichees = new Map<string, unknown>();
  for (const zone of zones) {
    const cle = zoneKey(zone);
    if (cle !== "" && !affichees.has(cle)) affichees.set(cle, zone);
  }
  const pris = new Set<string>();
  for (const duModele of [true, false]) {
    for (const [cle, zone] of affichees) {
      const nomDuModele = lire(names, cle);
      if ((nomDuModele !== null) !== duModele) continue;
      // Une table de modèle est déjà sans doublon : le repli d'une zone du
      // modèle ne sert que si la table reçue n'en est pas une.
      const possibles = nomDuModele !== null ? [nomDuModele, nomLisible(zone)] : candidats(zone, null, table);
      const nom = nomLibre(possibles, pris);
      pris.add(empreinte(nom));
      noms[cle] = nom;
    }
  }
  return noms;
}

/**
 * Nom d'une zone du rapport, cherché dans une table des noms : celle du
 * rapport (zoneNamesForReport), ou celle du modèle. La zone peut être un
 * identifiant ou un texte libre de l'IA : elle est normalisée avant la
 * recherche. Sans table, ou zone absente de la table : nom de la table des
 * zones courantes, sinon l'identifiant rendu lisible.
 */
export function zoneNameIn(names: unknown, zone: unknown): string {
  return lire(names, zoneKey(zone)) ?? zoneDisplayName(zone);
}
