/**
 * Noms affichés des zones d'un rapport, en français.
 *
 * L'IA note chaque zone sous son identifiant (« stitching », « tongue_label »),
 * celui des points d'authentification du modèle : c'est lui qui est enregistré
 * dans `sub_scores` et dans les observations, et il ne change pas. Ce fichier ne
 * sert qu'à l'affichage.
 *
 * Sans dépendance serveur : la page du rapport (serveur) en tire la table des
 * noms d'un modèle, le rapport (client) y cherche le nom d'une zone.
 */

/**
 * Noms des zones courantes, par identifiant normalisé. Décision d'Hector du
 * 05/10 : les noms des zones s'affichent en français partout. Les libellés
 * du catalogue ont des fautes d'accent et du franglais (« Etiquette de
 * langue », « Hardware/ferrures ») : pour ces zones, on affiche ce nom,
 * jamais le libellé. Les 23 premières sont les zones communes à la plupart
 * des modèles (3 628 des 3 917 points au relevé du 05/10) ; les sept
 * dernières corrigent un libellé isolé.
 */
export const ZONE_NAMES: Readonly<Record<string, string>> = {
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
 * Nom affiché d'une zone. Dans l'ordre : (1) le nom de la table ; (2) le
 * libellé court du premier point du modèle qui porte cette zone, s'il n'est
 * pas vide ; (3) l'identifiant rendu lisible. `points` vient de la base
 * (`models.authentication_points`, JSONB) : absent, pas un tableau ou mal
 * formé, il est ignoré, sans erreur.
 */
export function zoneDisplayName(zone: unknown, points?: unknown): string {
  const cle = zoneKey(zone);
  if (cle === "") return "";
  return (
    lire(ZONE_NAMES, cle) ??
    shortZoneLabel(pointDeLaZone(cle, points)?.label) ??
    nomLisible(zone)
  );
}

/**
 * Table { identifiant normalisé : nom affiché } des points d'un modèle. C'est
 * elle, et elle seule, que la page du rapport passe au navigateur : ni les
 * points, ni leurs libellés entiers, ni leurs poids.
 */
export function zoneNamesForPoints(points: unknown): ZoneNames {
  const noms: ZoneNames = {};
  if (!Array.isArray(points)) return noms;
  for (const point of points) {
    if (!point || typeof point !== "object") continue;
    const { zone } = point as { zone?: unknown };
    const cle = zoneKey(zone);
    // Clé vide : point sans zone.
    if (cle === "") continue;
    // Deux points pour la même zone : le premier donne le nom.
    if (Object.prototype.hasOwnProperty.call(noms, cle)) continue;
    noms[cle] = zoneDisplayName(zone, points);
  }
  return noms;
}

/**
 * Nom d'une zone du rapport, cherché dans la table des noms du modèle. La zone
 * peut être un identifiant ou un texte libre de l'IA : elle est normalisée
 * avant la recherche. Sans table, ou zone absente de la table : nom de la
 * table des zones courantes, sinon l'identifiant rendu lisible.
 */
export function zoneNameIn(names: unknown, zone: unknown): string {
  return lire(names, zoneKey(zone)) ?? zoneDisplayName(zone);
}
