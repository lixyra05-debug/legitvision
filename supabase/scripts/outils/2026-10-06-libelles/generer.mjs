// Génère les deux scripts SQL (aller et retour) à partir de la table des corrections du 2026-10-06
// (corrections-v2.json) et du relevé de production du même jour, et la requête de contrôle de la
// production (controle-prod.sql).
// Les trois étapes de chaque script partagent ainsi exactement les mêmes listes, et TOUT le texte
// sort d'ici, en-tête « EN BREF » compris : aucune retouche à la main. Deux exécutions de suite
// donnent des fichiers identiques à l'octet près (rien ne dépend de l'heure ni de l'ordre de lecture).
//
// MODE « RELEVÉ ADAPTÉ » (LV_RELEVE), pour préparer un retour quand celui du dépôt est bloqué par un
// modèle créé, supprimé ou retouché depuis l'aller : ce mode existe, mais il N'EST PAS validé de bout
// en bout (relecture du 2026-10-07). Les blocs SQL qu'il génère écrivent ce que dit la table, mais
// l'en-tête des fichiers adaptés est à relire à la main (il reprend des conditions d'empreinte qui ne
// valent que pour les fichiers d'origine), et aucun banc d'essai livré ne rejoue des scripts adaptés.
// Un retour adapté se prépare donc comme un script neuf : nouveau relevé en lecture seule, table et
// relevé copiés puis corrigés (« LV_ECRIRE_RELEVE=releve.json node generer.mjs » écrit le relevé du
// 06/10, à modifier ; puis « LV_CORRECTIONS=table.json LV_RELEVE=releve.json LV_SORTIE=dossier node
// generer.mjs »), essais sur une copie de la base, relecture, avant toute exécution.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Le générateur, sa table (corrections-v2.json) et ses identifiants (ids-profil-court.txt) sont rangés
// ensemble, dans ce dossier du dépôt : supabase/scripts/outils/2026-10-06-libelles/.
const ICI = dirname(fileURLToPath(import.meta.url));
const entree = (nom) => `${ICI}/${nom}`;
// Par défaut : les deux scripts vont dans supabase/scripts/, la requête de contrôle reste ici.
// LV_SORTIE, LV_CORRECTIONS et LV_RELEVE servent à générer ailleurs (une variante d'essai, ou des
// scripts adaptés à un nouveau relevé) sans toucher aux fichiers du dépôt : tout va alors dans LV_SORTIE.
const SORTIE = process.env.LV_SORTIE ?? resolve(ICI, "../..");
const FICHIER_CORRECTIONS = process.env.LV_CORRECTIONS ?? entree("corrections-v2.json");
const FICHIER_RELEVE = process.env.LV_RELEVE ?? null;
const FICHIER_CONTROLE = process.env.LV_SORTIE ? `${SORTIE}/controle-prod.sql` : `${ICI}/controle-prod.sql`;
// Une autre table SANS relevé n'est pas la table relevée en production : c'est une variante d'essai,
// et son en-tête le dit, à la place de la phrase « État de la production vérifié ».
const VARIANTE = Boolean(process.env.LV_CORRECTIONS) && !FICHIER_RELEVE;
// Où le générateur, sa table et ses identifiants sont conservés : l'en-tête du retour le cite.
const OUTILLAGE = "supabase/scripts/outils/2026-10-06-libelles/ (voir son LISEZ-MOI)";

const echec = (m) => { throw new Error(m); };
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const octets = (a, b) => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));   // l'ordre de « collate "C" »

// ── Ce que le relevé de production du 2026-10-06 a établi, et que la table ne dit pas ──────────
// (lecture seule, par le chef d'orchestre, à 18 h 13.) public.models compte 530 lignes : les 474
// modèles analysables que le site annonce (modèle actif, marque active hors montres, au moins un
// point), 36 modèles désactivés, 10 montres et 10 modèles actifs sans point. 437 lignes portent au
// moins un ancien libellé : 436 modèles analysables et 1 modèle désactivé.
// Les scripts ne calculent pas « analysable » (ils ne lisent pas public.brands) : dans les en-têtes,
// ces nombres sont du texte daté du relevé. La requête de contrôle, elle, les recompte.
// « dejaLa » : les libellés d'arrivée déjà portés au départ, et qui ne changent pas (zone, libellé,
// identifiants des modèles) ; les 28 modèles de ids-profil-court.txt portent déjà « Emballage ».
// « version », « remplace » : les fichiers générés d'après ce relevé sont la version 2 ; ils remplacent
// ceux du commit 5bed02b (36 corrections), committés sous le même nom. Un relevé adapté porte la
// version suivante, et le commit de celle qu'il remplace.
const RELEVE_DU_06_10 = () => ({
  date: "2026-10-06", version: 2, remplace: "5bed02b", corrections: 46, points: 2713,
  modeles: 530, analysables: 474, desactives: 36, montres: 10, actifsSansPoint: 10,
  aModifier: 437, aModifierAnalysables: 436, aModifierDesactives: 1,
  declencheurs: 0,   // déclencheurs posés sur public.models (aucun)
  dejaLa: [{ zone: "packaging", libelle: "Emballage", ids: readFileSync(entree("ids-profil-court.txt"), "utf8").split("\n").filter(Boolean) }],
});
// LV_ECRIRE_RELEVE=fichier : écrit le relevé inscrit ci-dessus dans un fichier JSON, et s'arrête là.
// C'est le modèle d'un relevé adapté : le copier, changer sa date, ses comptes et ses « dejaLa ».
if (process.env.LV_ECRIRE_RELEVE) {
  writeFileSync(process.env.LV_ECRIRE_RELEVE, JSON.stringify(RELEVE_DU_06_10(), null, 2) + "\n");
  console.log("relevé écrit :", process.env.LV_ECRIRE_RELEVE);
  process.exit(0);
}
const RELEVE = FICHIER_RELEVE ? JSON.parse(readFileSync(FICHIER_RELEVE, "utf8")) : RELEVE_DU_06_10();
if (typeof RELEVE.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(RELEVE.date)) echec("relevé : « date » doit être écrite AAAA-MM-JJ");
if (!Number.isInteger(RELEVE.version) || RELEVE.version < 2 || typeof RELEVE.remplace !== "string" || !/^[0-9a-f]{7,40}$/.test(RELEVE.remplace))
  echec("relevé : « version » doit être un entier (2 ou plus), et « remplace » le commit de la version que ces fichiers remplacent");
const VERSION = { numero: RELEVE.version, remplace: RELEVE.remplace };
for (const k of ["corrections", "points", "modeles", "analysables", "desactives", "montres", "actifsSansPoint", "aModifier", "aModifierAnalysables", "aModifierDesactives", "declencheurs"])
  if (!Number.isInteger(RELEVE[k]) || RELEVE[k] < 0) echec(`relevé : « ${k} » doit être un entier positif ou nul`);
if (RELEVE.analysables + RELEVE.desactives + RELEVE.montres + RELEVE.actifsSansPoint !== RELEVE.modeles)
  echec(`relevé : ${RELEVE.analysables} modèles analysables + ${RELEVE.desactives} désactivés + ${RELEVE.montres} montres + ${RELEVE.actifsSansPoint} actifs sans point ne font pas ${RELEVE.modeles} lignes`);
if (RELEVE.aModifierAnalysables + RELEVE.aModifierDesactives !== RELEVE.aModifier || RELEVE.aModifierAnalysables > RELEVE.analysables || RELEVE.aModifierDesactives > RELEVE.desactives)
  echec(`relevé : ${RELEVE.aModifierAnalysables} modèles analysables + ${RELEVE.aModifierDesactives} désactivés ne font pas les ${RELEVE.aModifier} modèles à modifier, ou dépassent leur catégorie`);
if (!Array.isArray(RELEVE.dejaLa)) echec("relevé : « dejaLa » doit être une liste");
// Décision d'Hector du 06/10 : pour ces quatre zones, le début du libellé est le nom affiché dans
// le rapport (table ZONE_NAMES de lib/zone-names.ts, lot du rapport).
const NOMS_AFFICHES = { tongue_label: "Étiquette de taille", tongue_tag: "Badge de languette", box_label: "Étiquette de la boîte", sole_pattern: "Semelle extérieure" };

// ── Les entrées ─────────────────────────────────────────────────────────────
// Chaque correction : { zone, ancien, nouveau, points, ids }. « ids » : la liste exacte des modèles
// qui portent ce point (un point par modèle), ou null quand elle n'est pas fournie.
const corrections = JSON.parse(readFileSync(FICHIER_CORRECTIONS, "utf8"));
if (!Array.isArray(corrections) || corrections.length === 0) echec("la table des corrections doit être un tableau non vide");
// Libellés d'arrivée déjà portés au départ, et qui ne changent pas : (zone, libellé, identifiants).
const DEJA_LA = RELEVE.dejaLa.map((d, i) => {
  for (const k of ["zone", "libelle"]) if (typeof d?.[k] !== "string" || d[k] === "") echec(`relevé, « déjà là » ${i + 1} : « ${k} » manque`);
  if (!Array.isArray(d.ids)) echec(`relevé, « déjà là » ${i + 1} : « ids » doit être une liste`);
  return { zone: d.zone, libelle: d.libelle, ids: [...d.ids] };
});

const lignes = corrections.map((c, i) => {
  for (const k of ["zone", "ancien", "nouveau"]) if (typeof c[k] !== "string" || c[k] === "") echec(`correction ${i + 1} : « ${k} » manque`);
  if (!Number.isInteger(c.points) || c.points <= 0) echec(`correction ${i + 1} : « points » doit être un entier positif`);
  if (c.ids !== null && c.ids !== undefined && !(Array.isArray(c.ids) && c.ids.length > 0)) echec(`correction ${i + 1} : « ids » doit être nul ou une liste non vide`);
  return { n: i + 1, zone: c.zone, ancien: c.ancien, nouveau: c.nouveau, points: c.points, ids: c.ids ? [...c.ids].sort() : null };
});
const TOTAL = lignes.reduce((s, c) => s + c.points, 0);
const NB = lignes.length;

// ── Garde-fous du générateur ────────────────────────────────────────────────
// La table doit porter les comptes du relevé (46 corrections et 2713 points pour celui du 06/10).
if (NB !== RELEVE.corrections) echec(`${RELEVE.corrections} corrections attendues, ${NB} lues`);
if (TOTAL !== RELEVE.points) echec(`${RELEVE.points} points attendus, ${TOTAL} lus`);
// Caractères qui n'ont pas leur place dans un libellé : espaces insécables (160, 8239), apostrophes
// courbes (8216, 8217), « $ » (36 : le bloc est entre $$), barre oblique inverse (92), caractères de
// contrôle (0 à 31, 127 à 159) et caractères invisibles (8203 à 8207, 8232, 8233, 65279).
// Écrits par leur numéro : aucun caractère invisible dans ce fichier.
const INTERDIT = (c) => c < 32 || (c >= 127 && c <= 160) || c === 36 || c === 92 || c === 8239 || c === 8216 || c === 8217
  || (c >= 8203 && c <= 8207) || c === 8232 || c === 8233 || c === 65279;
const texteSur = (s, quoi) => {
  if (s !== s.normalize("NFC")) echec(`pas en NFC : ${quoi} « ${s} »`);
  if (s !== s.trim() || [...s].some((ch) => INTERDIT(ch.codePointAt(0)))) echec(`caractère inattendu : ${quoi} « ${s} »`);
  // Ni début de commentaire SQL dans un libellé : aucune chaîne du script ne contient « -- » ni « /* ».
  if (s.includes("--") || s.includes("/*") || s.includes("*/")) echec(`suite de caractères inattendue (commentaire SQL) : ${quoi} « ${s} »`);
};
const listeSure = (ids, quoi) => {
  for (const id of ids) if (typeof id !== "string" || !UUID.test(id)) echec(`identifiant mal formé (${quoi}) : ${id}`);
  if (new Set(ids).size !== ids.length) echec(`identifiant en double dans une même liste (${quoi})`);
};
// Une zone est un identifiant (minuscules, chiffres, tiret bas) : elle ne contient ni « | » ni espace,
// ce dont dépendent la clé ci-dessous et l'empreinte des points suivis.
const zoneSure = (z, quoi) => { if (!/^[a-z][a-z0-9_]*$/.test(z)) echec(`zone inattendue (${quoi}) : « ${z} »`); };
const cle = (zone, libelle) => `${zone}|${libelle}`;
const anciens = new Set(lignes.map((c) => cle(c.zone, c.ancien)));
if (anciens.size !== NB) echec("deux corrections partent du même (zone, ancien)");
// Les groupes : toutes les corrections d'une zone qui arrivent au même nouveau libellé, et le
// « déjà là » de ce libellé s'il y en a un. Un groupe de plus d'un membre est une FUSION.
const groupes = new Map();
for (const c of lignes) {
  for (const k of ["zone", "ancien", "nouveau"]) texteSur(c[k], `correction ${c.n}`);
  zoneSure(c.zone, `correction ${c.n}`);
  if (c.ancien === c.nouveau) echec(`correction sans effet : ${c.ancien}`);
  if (c.ids) {
    listeSure(c.ids, `correction ${c.n}`);
    // Un point par modèle : autant d'identifiants que de points.
    if (c.ids.length !== c.points) echec(`correction ${c.n} : ${c.ids.length} identifiant(s) pour ${c.points} point(s)`);
  }
  const k = cle(c.zone, c.nouveau);
  // Pas de chaîne ancien → nouveau → ancien : un nouveau libellé n'est l'ancien d'aucune correction de sa zone.
  if (anciens.has(k)) echec(`chaîne : ${k} est à la fois un nouveau et un ancien libellé`);
  if (!groupes.has(k)) groupes.set(k, { zone: c.zone, nouveau: c.nouveau, corrections: [], deja: null });
  groupes.get(k).corrections.push(c);
}
// Le texte d'un ancien libellé n'est celui d'aucun libellé d'arrivée, toutes zones confondues : les
// étapes 1 et 3 de l'aller comptent les points qui portent le texte d'un ancien libellé hors de sa
// zone (ils ne sont pas corrigés), et prendraient sinon un libellé corrigé pour un ancien.
const textesAnciens = new Set(lignes.map((c) => c.ancien));
for (const c of lignes) if (textesAnciens.has(c.nouveau)) echec(`correction ${c.n} : « ${c.nouveau} » est un nouveau libellé, et aussi le texte d'un ancien libellé d'une autre zone`);
for (const d of DEJA_LA) {
  texteSur(d.zone, "déjà là"); texteSur(d.libelle, "déjà là"); zoneSure(d.zone, "déjà là");
  if (textesAnciens.has(d.libelle)) echec(`« déjà là » « ${d.libelle} » : c'est aussi le texte d'un ancien libellé`);
  if (d.ids.length === 0) echec(`« déjà là » sans identifiant : ${d.libelle}`);
  listeSure(d.ids, `déjà là « ${d.libelle} »`);
  d.ids = [...d.ids].sort();
  const g = groupes.get(cle(d.zone, d.libelle));
  if (!g) echec(`« déjà là » inutile : ${cle(d.zone, d.libelle)} n'est le nouveau libellé d'aucune correction`);
  if (g.deja) echec(`« déjà là » décrit deux fois : ${cle(d.zone, d.libelle)}`);
  g.deja = d;
}
for (const g of groupes.values()) {
  g.fusion = g.corrections.length + (g.deja ? 1 : 0) > 1;
  g.sansListe = g.corrections.filter((c) => !c.ids);
  // Les modèles listés du groupe : par une correction (son n°) ou parce qu'ils portent déjà le libellé (0).
  g.places = [...g.corrections.flatMap((c) => (c.ids ?? []).map((id) => ({ id, n: c.n }))), ...(g.deja?.ids ?? []).map((id) => ({ id, n: 0 }))];
  if (!g.fusion) continue;
  // Fusion : le retour n'est exact que si l'on sait rendre son ancien libellé à chaque point.
  if (g.sansListe.length > 1) echec(`fusion ${cle(g.zone, g.nouveau)} : ${g.sansListe.length} corrections sans liste (une au plus)`);
  if (new Set(g.places.map((p) => p.id)).size !== g.places.length) echec(`fusion ${cle(g.zone, g.nouveau)} : un modèle est dans deux listes`);
}
const FUSIONS = [...groupes.values()].filter((g) => g.fusion);
// Les quatre zones dont le libellé commence par le nom affiché dans le rapport (l'en-tête le dit).
for (const c of lignes) {
  const nom = NOMS_AFFICHES[c.zone];
  if (nom && !c.nouveau.startsWith(nom)) echec(`correction ${c.n} : « ${c.nouveau} » ne commence pas par le nom affiché de ${c.zone}, « ${nom} »`);
}
// Avertissements, sans arrêt (à faire trancher) :
// un même libellé d'arrivée posé sur plusieurs zones ;
const zonesParNouveau = new Map();
for (const c of lignes) zonesParNouveau.set(c.nouveau, new Set([...(zonesParNouveau.get(c.nouveau) ?? []), c.zone]));
for (const [libelle, zones] of zonesParNouveau)
  if (zones.size > 1) console.warn(`avertissement : « ${libelle} » devient le libellé de plusieurs zones (${[...zones].join(", ")})`);
// un modèle listé deux fois dans la même zone (il y porterait deux points).
const zonesParModele = new Map();
for (const c of lignes) for (const id of c.ids ?? []) {
  const k = `${id}|${c.zone}`;
  if (zonesParModele.has(k)) console.warn(`avertissement : le modèle ${id} est listé deux fois dans la zone ${c.zone}`);
  zonesParModele.set(k, true);
}

// ── Les comptes que les textes citent (tous calculés) ───────────────────────
// Libellés suivis : les (zone, ancien), plus les (zone, nouveau) distincts (« Emballage » compris).
const SUIVIS = anciens.size + groupes.size;
const PAIRES = lignes.flatMap((c) => (c.ids ?? []).map((id) => ({ n: c.n, id })));          // (n° de correction, modèle)
const DEJA = DEJA_LA.flatMap((d) => d.ids.map((id) => ({ zone: d.zone, libelle: d.libelle, id })))
  .sort((a, b) => octets(a.zone, b.zone) || octets(a.libelle, b.libelle) || octets(a.id, b.id));
const NB_IDS = PAIRES.length, NB_DEJA = DEJA.length;
const AVEC_LISTE = lignes.filter((c) => c.ids);
const HORS_FUSION_AVEC_LISTE = AVEC_LISTE.filter((c) => !groupes.get(cle(c.zone, c.nouveau)).fusion);
// Empreinte des trois listes : le bloc de l'étape 2 la recalcule sur ses tables de travail et
// refuse d'écrire si elle diffère (une liste modifiée à la main, même d'un caractère).
const TEXTE_LISTES = [
  lignes.map((c) => [c.n, c.zone, c.ancien, c.nouveau, c.points, c.ids ? "oui" : "non"].join("|")).join("\n"),
  PAIRES.map((p) => `${p.n}|${p.id}`).join("\n"),
  DEJA.map((d) => `${d.zone}|${d.libelle}|${d.id}`).join("\n"),
].join("\n=\n");
const EMPREINTE_LISTES = createHash("md5").update(TEXTE_LISTES, "utf8").digest("hex");

// ── Morceaux de SQL ─────────────────────────────────────────────────────────
const q = (s) => `'${s.replace(/'/g, "''")}'`;
const parDeux = (elements, retrait) => {
  const out = [];
  for (let i = 0; i < elements.length; i += 2) out.push(retrait + elements.slice(i, i + 2).join(", "));
  return out.join(",\n");
};
const valeursCorr = (retrait) =>
  lignes.map((c) => `${retrait}(${String(c.n).padStart(2)}, ${q(c.zone)}, ${q(c.ancien)}, ${q(c.nouveau)}, ${c.points}, ${c.ids ? "true" : "false"})`).join(",\n");
const valeursListes = (retrait) => parDeux(PAIRES.map((p) => `(${String(p.n).padStart(2)}, ${q(p.id)}::uuid)`), retrait);
const valeursDeja = (retrait) => parDeux(DEJA.map((d) => `(${q(d.zone)}, ${q(d.libelle)}, ${q(d.id)}::uuid)`), retrait);
// (« values » n'accepte pas zéro ligne : une table sans aucune liste n'est pas prévue ici.)
if (NB_IDS === 0 || NB_DEJA === 0) echec("table sans liste d'identifiants, ou sans « déjà là » : cas non prévu par ce générateur");
const cteListes = `(values              -- n° de la correction, modèle qui porte son point : un point par modèle
${valeursListes("  ")}
)`;
const cteDeja = `(values    -- nouveau libellé déjà porté au départ par ces modèles, qui le gardent
${valeursDeja("  ")}
)`;

const COMMENTAIRE_LISTES = (r) => `${r}-- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, liste.
${r}-- liste = true : les modèles qui portent ce point sont connus un par un, leurs identifiants sont
${r}-- dans « listes » (n° de la correction, modèle) ; false : ils ne sont pas listés. « deja » : les
${r}-- modèles qui portent déjà un nouveau libellé au départ. Ces listes servent à contrôler où sont
${r}-- les points, et à défaire les fusions.`;

// Tous les éléments de tous les tableaux. Un authentication_points qui n'est pas un tableau
// est lu comme un tableau vide ; zone et libelle restent nuls pour un élément mal formé.
const BIEN_FORME = (p) => `jsonb_typeof(${p}) = 'object' and jsonb_typeof(${p} -> 'zone') = 'string' and jsonb_typeof(${p} -> 'label') = 'string'`;
const TABLEAU = `case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end`;
// Un élément qui porte le texte d'un ancien libellé et que les scripts ne corrigent pas : il est
// rangé sous une autre zone que celle de la table, ou sa « zone » manque ou n'est pas un texte.
// L'application envoie pourtant à l'IA une ligne par élément du tableau, sans filtre : ce libellé
// part tel quel dans la consigne. (À employer tel quel dans un « where », jamais sous un « not » : un
// élément sans « label » rend la condition nulle, ce qui l'écarte du compte, comme voulu.)
const HORS_TABLE = (corr, p) => `jsonb_typeof(${p}) = 'object' and jsonb_typeof(${p} -> 'label') = 'string'
           and exists (select 1 from ${corr} c where c.ancien = ${p} ->> 'label')
           and not exists (select 1 from ${corr} c where jsonb_typeof(${p} -> 'zone') = 'string' and c.zone = ${p} ->> 'zone' and c.ancien = ${p} ->> 'label')`;
// inscrit : pour un point (zone, libellé) d'un modèle, le n° de la correction qui liste ce modèle
// pour ce libellé d'arrivée ; 0 : le modèle portait déjà ce libellé au départ ; nul : modèle non listé.
const INSCRIT = (places, zone, libelle, id) => `(select pl.n from ${places} pl where pl.zone = ${zone} and pl.libelle = ${libelle} and pl.id = ${id})`;

// Une fois corrigé, chaque modèle listé porte le nouveau libellé une fois.
const placesSql = (corr, listes, deja, r) => `${r}select c.zone, c.nouveau as libelle, l.id, c.n from ${corr} c join ${listes} l on l.n = c.n
${r}union all
${r}select d.zone, d.libelle, d.id, 0 from ${deja} d`;

// Combien de points doit porter chaque libellé suivi : au départ, puis une fois corrigé.
const attenduSql = (corr, deja, r) => `${r}select l.zone, l.libelle, sum(l.depart)::int as depart, sum(l.applique)::int as applique
${r}from (
${r}  -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
${r}  select c.zone, c.ancien as libelle, c.points as depart, 0 as applique from ${corr} c
${r}  union all
${r}  -- les nouveaux libellés : aucun point au départ, tous ensuite
${r}  select c.zone, c.nouveau, 0, c.points from ${corr} c
${r}  union all
${r}  -- les « déjà là » : un point par modèle listé, avant comme après
${r}  select d.zone, d.libelle, 1, 1 from ${deja} d
${r}) l
${r}group by l.zone, l.libelle`;

// Modèle par modèle : combien de points (1 ou 0) de quel libellé un modèle listé doit porter, dans quel état.
const positionsSql = (corr, listes, deja, places, r) => `${r}-- au départ, l'ancien libellé d'une correction à liste est sur chaque modèle de sa liste, une fois
${r}select 'depart' as etat, c.zone, c.ancien as libelle, l.id, 1 as attendu from ${corr} c join ${listes} l on l.n = c.n
${r}union all
${r}-- au départ, un libellé « déjà là » est sur chacun de ses modèles, une fois
${r}select 'depart', d.zone, d.libelle, d.id, 1 from ${deja} d
${r}union all
${r}-- au départ, l'ancien libellé d'une correction SANS liste n'est sur aucun modèle listé de sa fusion
${r}select 'depart', c.zone, c.ancien, pl.id, 0 from ${corr} c join ${places} pl on pl.zone = c.zone and pl.libelle = c.nouveau where not c.liste
${r}union all
${r}-- une fois corrigé, le nouveau libellé est sur chaque modèle listé, une fois
${r}select 'applique', pl.zone, pl.libelle, pl.id, 1 from ${places} pl`;

// La mesure : pour chaque libellé suivi, les points trouvés, les modèles listés en écart, et sa
// conformité à chacun des deux états. « filtre » restreint les points lus (le bloc les relève deux fois).
const mesureSql = (attendu, positions, points, filtre, r) => `${r}select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
${r}       coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
${r}       coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
${r}       coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
${r}from ${attendu} a
${r}left join (select p.zone, p.libelle, count(*)::int as n from ${points} p ${filtre}group by p.zone, p.libelle) t
${r}       on t.zone = a.zone and t.libelle = a.libelle
${r}left join (
${r}  -- les modèles listés qui ne portent pas le nombre de points attendu, et les trois premiers pour exemple
${r}  select o.zone, o.libelle,
${r}         (count(*) filter (where o.etat = 'depart'))::int as mal_depart,
${r}         (count(*) filter (where o.etat = 'applique'))::int as mal_applique,
${r}         array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'depart'))[1:3], ', ') as ex_depart,
${r}         array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'applique'))[1:3], ', ') as ex_applique
${r}  from (
${r}    select o.etat, o.zone, o.libelle, o.id, format('%s : %s point(s) au lieu de %s', o.id, coalesce(k.n, 0), o.attendu) as exemple
${r}    from ${positions} o
${r}    left join (select p.zone, p.libelle, p.id, count(*)::int as n from ${points} p ${filtre}group by p.zone, p.libelle, p.id) k
${r}           on k.zone = o.zone and k.libelle = o.libelle and k.id = o.id
${r}    where coalesce(k.n, 0) <> o.attendu
${r}  ) o
${r}  group by o.zone, o.libelle
${r}) e on e.zone = a.zone and e.libelle = a.libelle`;
const OK_DEPART = (a) => `${a}.ok_depart`;
const OK_APPLIQUE = (a) => `${a}.ok_applique`;
const ecartFormat = (a, etat) =>
  `format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', ${a}.zone, ${a}.libelle, ${a}.trouves, ${a}.${etat},
               case when ${a}.mal_${etat} = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', ${a}.mal_${etat}, ${a}.ex_${etat}, case when ${a}.mal_${etat} > 3 then ', …' else '' end) end)`;

// Condition de jointure « ce point est à modifier par cette correction ».
// À l'aller : le point porte l'ancien libellé de la correction, dans sa zone.
// Au retour : il porte son nouveau libellé, et la règle des listes désigne cette correction —
//   modèle listé → la correction qui le liste (aucune s'il portait déjà le libellé : il le garde) ;
//   modèle non listé → la correction sans liste.
const aModifier = (sens, c, p) =>
  sens === "aller"
    ? `${c}.zone = ${p}.zone and ${c}.ancien = ${p}.libelle`
    : `${c}.zone = ${p}.zone and ${c}.nouveau = ${p}.libelle and case when ${p}.inscrit is null then not ${c}.liste else ${c}.n = ${p}.inscrit end`;

// Les en-têtes de requête communs aux aperçus et à la requête de contrôle.
const listesEnCte = () => `with corr (n, zone, ancien, nouveau, points, liste) as (values
${valeursCorr("  ")}
),
listes (n, id) as ${cteListes},
deja (zone, libelle, id) as ${cteDeja},
places as (                            -- une fois corrigé, chaque modèle listé porte ce libellé une fois ; n : la correction qui le liste (0 : il le portait déjà)
${placesSql("corr", "listes", "deja", "  ")}
),`;
// Trois empreintes. Celle des autres colonnes est calculée en UTC : to_jsonb écrit une date
// (created_at) avec le décalage du fuseau horaire de la session, et l'empreinte en dépendrait. Le
// « case » impose l'ordre (le fuseau est posé avant que la ligne soit écrite en texte) ; posé par
// set_config(…, true), il ne vaut que pour la transaction en cours, pas pour la session.
const EMPREINTES = `(select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
         (select md5(string_agg(m.id::text || md5(case when set_config('TimeZone', 'UTC', true) is not null then (to_jsonb(m) - 'authentication_points')::text end), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes`;
// L'empreinte des points suivis : les seuls points qui portent un libellé de la table (ancien ou
// nouveau, dans sa zone), un par ligne « modèle|zone|libellé ». Elle ne bouge pas quand le reste du
// catalogue bouge (modèle créé sans ces libellés, modèle renommé ou désactivé, autre libellé ou poids
// retouché) ; elle change dès qu'un point suivi change de libellé ou de modèle, même à comptes égaux.
const EMPREINTE_SUIVIS = (points, attendu) => `(select md5(coalesce(string_agg(format('%s|%s|%s', p.id, p.zone, p.libelle), E'\\n' order by p.id, p.zone collate "C", p.libelle collate "C"), ''))
          from ${points} p where exists (select 1 from ${attendu} a where a.zone = p.zone and a.libelle = p.libelle))`;

// ── Aperçu (étapes 1 et 3) : une seule requête, en lecture seule ────────────
function apercu(sens, apres) {
  // Base sans aucun des libellés suivis (table vide, mauvais projet) : le dire, au lieu de lister
  // les écarts avec l'état « le plus proche », qui ferait croire à une base presque corrigée.
  const AUCUN = `format('aucun des %s libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte %s modèle(s) : est-ce le bon projet ?', e.suivis, e.modeles)`;
  // Sinon, les écarts sont listés par rapport à l'état le plus proche, avec le compte des deux côtés.
  const VS_DEPART = `format('par rapport à l''état de départ (%s libellé(s) en écart sur %s ; %s par rapport à l''état corrigé) : ', e.nb_depart, e.suivis, e.nb_applique) || e.ecarts_depart`;
  const VS_APPLIQUE = `format('par rapport à l''état corrigé (%s libellé(s) en écart sur %s ; %s par rapport à l''état de départ) : ', e.nb_applique, e.suivis, e.nb_depart) || e.ecarts_applique`;
  const PROCHE = sens === "aller"
    ? { 1: `case when e.nb_depart <= e.nb_applique then ${VS_DEPART}
                        else ${VS_APPLIQUE} end`,
        3: `case when e.nb_applique <= e.nb_depart then ${VS_APPLIQUE}
                        else ${VS_DEPART} end` }
    : { 1: `case when e.nb_applique <= e.nb_depart then ${VS_APPLIQUE}
                        else ${VS_DEPART} end`,
        3: `case when e.nb_depart <= e.nb_applique then ${VS_DEPART}
                        else ${VS_APPLIQUE} end` };
  // (aller) Les points qui portent le texte d'un ancien libellé et que ce script ne corrige pas :
  // ils sont comptés, et le verdict les signale au lieu d'affirmer « plus aucun ancien libellé ».
  const ATTENTION = `format(' ATTENTION : %s point(s) portent un ancien libellé que ce script ne corrige pas (rangé sous une autre zone que celle de la table, ou point sans « zone ») ; ils partent tels quels dans la consigne de l''IA : le signaler.', t.hors_table)`;
  const SI_HORS_TABLE = `case when t.hors_table = 0 then '' else ${ATTENTION} end`;
  // Le nombre de lignes de la table n'est pas le nombre de modèles que le site annonce : le dire.
  const DANS = `dans %s modèles (la table en compte %s, actifs ou non)`;
  // Une étape 3 qui trouve la base inchangée dit quoi faire.
  const REPRENDRE = `Si l''étape 2 a affiché une erreur, la transmettre. Sinon elle n''a pas été lancée : reprendre à l''étape 1, puis sélectionner l''étape 2 en entier, de son bandeau au bandeau de l''étape 3.`;
  const verdict =
    sens === "aller"
      ? apres
        ? `case when e.trouves = 0 then 'ÉCARTS — ' || ${AUCUN}
              when e.applique then format('APPLIQUÉ : les ${NB} corrections sont en place (%s points)', t.attendus)
                                   || case when t.hors_table = 0 then ', plus aucun ancien libellé.' else '.' || ${ATTENTION} end
              when e.au_depart then 'PAS APPLIQUÉ : la base est dans l''état de départ, rien n''a été écrit. ${REPRENDRE}'
              else 'ÉCARTS — ' || ${PROCHE[3]} end`
        : `case when e.trouves = 0 then 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || ${AUCUN}
              when e.au_depart then format('PRÊT : %s points à corriger ${DANS}. Lancer l''étape 2.', t.attendus, e.modeles_a_modifier, e.modeles)
                                    || ${SI_HORS_TABLE}
              when e.applique then 'DÉJÀ APPLIQUÉ : les ${NB} corrections sont en place. Ne rien lancer.' || ${SI_HORS_TABLE}
              else 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || ${PROCHE[1]} end`
      : apres
        // Ce verdict décrit l'état de la base, pas ce que l'étape 2 vient de faire : une base jamais
        // corrigée est aussi « à l'état de départ ».
        ? `case when e.trouves = 0 then 'ÉCARTS — ' || ${AUCUN}
              when e.au_depart then format('À L''ÉTAT DE DÉPART : les anciens libellés des ${NB} corrections sont en place (%s points), aucune correction ne l''est.', t.attendus)
              when e.applique then 'PAS REVENU : les corrections sont toujours en place, rien n''a été écrit. ${REPRENDRE}'
              else 'ÉCARTS — ' || ${PROCHE[3]} end`
        // Le retour n'est exact que si aucun point suivi n'a changé de modèle depuis l'aller, ce que les
        // comptes ne voient pas toujours : la condition est dans le verdict.
        : `case when e.trouves = 0 then 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || ${AUCUN}
              when e.applique then format('PRÊT POUR LE RETOUR : %s points à remettre ${DANS}. Lancer l''étape 2 si l''empreinte des points suivis (dernière colonne) est celle notée à l''étape 3 de l''aller.', t.attendus, e.modeles_a_modifier, e.modeles)
              when e.au_depart then 'DÉJÀ REVENU : la base est dans l''état de départ (anciens libellés). Ne rien lancer.'
              else 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || ${PROCHE[1]} end`;
  // Les colonnes disent ce qu'elles comptent, à l'étape 1 comme à l'étape 3 : « a_corriger » (ou
  // « a_remettre ») vaut le compte du relevé avant l'étape 2, et 0 après.
  const colonnes =
    sens === "aller"
      ? {
          etat: `case when ${OK_DEPART("ja")} and ${OK_DEPART("jn")} then 'à corriger'
              when ${OK_APPLIQUE("ja")} and ${OK_APPLIQUE("jn")} then 'corrigé'
              else 'ÉCART' end`,
          // a_corriger : les points qui portent encore un ancien libellé.
          entete: `as zone, null::text as ancien_libelle, t.attendus as points_au_releve, t.trouves_anciens as a_corriger,
       null::text as nouveau_libelle, null::int as portent_deja_le_nouveau, null::int as attendus_apres`,
          // portent_deja_le_nouveau : les points qui portent le nouveau libellé ; attendus_apres : leur
          // total une fois la correction faite (toutes les corrections d'une fusion, et les « déjà là »).
          ligne: `c.zone, c.ancien, c.points, ja.trouves, c.nouveau, jn.trouves, jn.applique`,
        }
      : {
          etat: `case when ${OK_APPLIQUE("ja")} and ${OK_APPLIQUE("jn")} then 'à remettre'
              when ${OK_DEPART("ja")} and ${OK_DEPART("jn")} then 'ancien en place'
              else 'ÉCART' end`,
          // a_remettre : les points que le retour remettrait, d'après la règle des listes.
          entete: `as zone, null::text as libelle_corrige, t.attendus as points_au_releve, t.trouves_nouveaux as a_remettre,
       null::text as ancien_libelle, null::int as portent_l_ancien, null::text as modeles_vises`,
          // a_remettre : les points que cette correction remettrait, d'après la règle des listes.
          ligne: `c.zone, c.nouveau, c.points,
       (select count(*)::int from pts p where ${aModifier("retour", "c", "p")}),
       c.ancien, ja.trouves,
       case when c.liste then format('%s modèle(s) listé(s)', c.points)
            when g.listes > 0 then format('tous sauf %s modèle(s) listé(s)', g.listes)
            else 'tous' end`,
        };
  return `${COMMENTAIRE_LISTES("")}
${listesEnCte()}
pts as (                               -- tous les points bien formés de tous les modèles, actifs ou non
  select m.id, e.point ->> 'zone' as zone, e.point ->> 'label' as libelle,
         -- inscrit : n° de la correction qui liste ce modèle pour ce libellé (0 : il le portait déjà ; nul : modèle non listé)
         ${INSCRIT("places", "e.point ->> 'zone'", "e.point ->> 'label'", "m.id")} as inscrit
  from public.models m
  cross join lateral jsonb_array_elements(${TABLEAU}) as e(point)
  where ${BIEN_FORME("e.point")}
),
attendu as (                           -- combien de points doit porter chaque libellé suivi, au départ puis une fois corrigé
${attenduSql("corr", "deja", "  ")}
),
positions as (                         -- modèle par modèle : ce qu'un modèle listé doit porter (1) ou ne pas porter (0), dans quel état
${positionsSql("corr", "listes", "deja", "places", "  ")}
),
mesure as (                            -- pour chaque libellé suivi : points trouvés, modèles listés en écart, comparés aux deux états
${mesureSql("attendu", "positions", "pts", "", "  ")}
),
etat as (
  select coalesce(bool_and(${OK_DEPART("j")}), false) as au_depart,
         coalesce(bool_and(${OK_APPLIQUE("j")}), false) as applique,
         string_agg(${ecartFormat("j", "depart")}, ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         string_agg(${ecartFormat("j", "applique")}, ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_applique) as ecarts_applique,
         count(*) filter (where not j.ok_depart) as nb_depart,
         count(*) filter (where not j.ok_applique) as nb_applique,
         coalesce(sum(j.trouves), 0)::int as trouves,   -- points portant un libellé suivi, ancien ou nouveau
         count(*)::int as suivis,                       -- libellés suivis (anciens et nouveaux, chacun dans sa zone)
         (select count(*) from public.models) as modeles,   -- toutes les lignes de la table, modèles désactivés compris
         (select count(distinct p.id) from pts p join corr c on ${aModifier(sens, "c", "p")}) as modeles_a_modifier
  from mesure j
),
t as (
  select (select sum(c.points)::int from corr c) as attendus,
         (select sum(j.trouves)::int from mesure j where exists (select 1 from corr c where c.zone = j.zone and c.ancien = j.libelle)) as trouves_anciens,
         (select count(*)::int from pts p join corr c on ${aModifier("retour", "c", "p")}) as trouves_nouveaux,${sens === "aller" ? `
         -- Les éléments, de toute forme et de toute zone, qui portent le texte d'un ancien libellé et
         -- que ce script ne corrige pas : lus sur TOUS les éléments, pas sur les seuls points bien formés.
         (select count(*)::int from public.models m
          cross join lateral jsonb_array_elements(${TABLEAU}) as e(point)
          where ${HORS_TABLE("corr", "e.point")}) as hors_table,` : ""}
         -- Trois empreintes. Celle des libellés (tous les points de tous les modèles) change à l'aller
         -- et revient à l'identique après le retour si rien d'autre n'a touché la table entre-temps.
         -- Celle des autres colonnes ne change que si une autre colonne de public.models change ; elle
         -- est calculée en UTC, pour ne pas dépendre du fuseau horaire de la session (to_jsonb écrit
         -- created_at avec son décalage ; set_config ne pose le fuseau que pour cette transaction).
         -- Celle des points suivis ne porte que sur les points qui ont un des ${SUIVIS} libellés de la
         -- table (modèle, zone, libellé) : elle ne bouge pas quand le reste du catalogue bouge.
         ${EMPREINTES},
         ${EMPREINTE_SUIVIS("pts", "attendu")} as empreinte_points_suivis
)
select 0 as ligne,
       ${verdict} as etat,
       '(total)' ${colonnes.entete},
       t.empreinte_libelles, t.empreinte_autres_colonnes, t.empreinte_points_suivis
from etat e cross join t
union all
select c.n,
       ${colonnes.etat},
       ${colonnes.ligne},
       null, null, null
from corr c
join mesure ja on ja.zone = c.zone and ja.libelle = c.ancien
join mesure jn on jn.zone = c.zone and jn.libelle = c.nouveau${sens === "aller" ? "" : `
cross join lateral (select count(*)::int as listes from places pl where pl.zone = c.zone and pl.libelle = c.nouveau) g`}
order by ligne;`;
}

// ── Étape 2 : UNE instruction, le bloc « do » ──────────────────────────────
// Le bloc est une seule instruction, atomique d'elle-même : pas de « begin; » avant, pas de
// « commit; » après. Une sélection qui en perd la première ou la dernière ligne n'est plus qu'une
// erreur de syntaxe, et rien n'est lancé ; elle ne peut ni tourner sans enregistrer (un « commit; »
// resté hors de la sélection), ni tourner sans son délai de verrou (posé dans le bloc).
// Dans le bloc, chaque valeur se range par « := » et non par « select … into variable » : hors du
// bloc, cette dernière forme est du SQL valide qui CRÉE une table du nom de la variable, et une
// sélection partielle l'aurait lancée telle quelle.
function bloc(sens) {
  const aller = sens === "aller";
  const A = aller
    ? { avantOk: "depart", apresOk: "applique", vers: "c.nouveau", de: "c.ancien", verbe: "corrigés", action: "Correction faite" }
    : { avantOk: "applique", apresOk: "depart", vers: "c.ancien", de: "c.nouveau", verbe: "remis", action: "Retour fait" };
  const aplatir = (moment) => `  -- Tous les éléments de tous les tableaux, ${moment === "avant" ? "tels qu'ils sont avant d'écrire" : "relus après l'écriture (même instruction que plus haut)"}
  insert into lv_points
  select '${moment}', m.id, e.rang, e.point,
         case when f.bien_forme then e.point ->> 'zone' end, case when f.bien_forme then e.point ->> 'label' end,
         case when f.bien_forme then ${INSCRIT("lv_places", "e.point ->> 'zone'", "e.point ->> 'label'", "m.id")} end
  from public.models m
  cross join lateral jsonb_array_elements(${TABLEAU}) with ordinality as e(point, rang)
  cross join lateral (select ${BIEN_FORME("e.point")} as bien_forme) f;`;
  const mesurer = (moment) => `  -- ${moment === "avant" ? "Pour chaque libellé suivi : points trouvés et modèles listés en écart, comparés à l'état de départ et à l'état corrigé" : "La même mesure, sur l'état d'après"}
  select string_agg(${ecartFormat("j", "depart")}, E'\\n' order by j.zone, j.libelle)
           filter (where not j.ok_depart),
         string_agg(${ecartFormat("j", "applique")}, E'\\n' order by j.zone, j.libelle)
           filter (where not j.ok_applique),
         count(*) filter (where not j.ok_depart), count(*) filter (where not j.ok_applique),
         coalesce(sum(j.trouves), 0), count(*)
    into v_ecarts_depart, v_ecarts_applique, v_nb_depart, v_nb_applique, v_trouves, v_suivis
  from (
${mesureSql("lv_attendu", "lv_positions", "lv_points", `where p.moment = '${moment}' `, "    ")}
  ) j;`;
  const dejaFait = aller
    ? `raise notice 'Déjà appliqué : les ${NB} corrections sont en place, rien n''est écrit.';`
    : `raise notice 'Déjà revenu : la base est dans l''état de départ, rien n''est écrit.';`;
  // Les écarts sont listés par rapport à l'état le plus proche de la base, avec le compte des deux côtés.
  const AVEC_DEPART = `format('Écarts avec l''état de départ (%s libellé(s) sur %s ; %s avec l''état corrigé) :', v_nb_depart, v_suivis, v_nb_applique) || E'\\n' || v_ecarts_depart`;
  const AVEC_APPLIQUE = `format('Écarts avec l''état corrigé (%s libellé(s) sur %s ; %s avec l''état de départ) :', v_nb_applique, v_suivis, v_nb_depart) || E'\\n' || v_ecarts_applique`;
  const pasPret = aller
    ? `case when v_nb_depart <= v_nb_applique then ${AVEC_DEPART}
                else ${AVEC_APPLIQUE} end`
    : `case when v_nb_applique <= v_nb_depart then ${AVEC_APPLIQUE}
                else ${AVEC_DEPART} end`;
  // Ce que chaque exception dit de faire ensuite.
  const TRANSMETTRE = "Ne pas relancer : transmettre ce message.";
  return `do $$
declare
  v_total constant int := ${TOTAL};   -- points à modifier, tous modèles confondus
  -- empreinte des trois listes ci-dessous, calculée quand le script a été généré
  v_empreinte constant text := '${EMPREINTE_LISTES}';
  v_lue text;                       -- la même empreinte, recalculée sur les listes telles qu'elles sont lancées
  v_ecarts_depart text;             -- écarts avec l'état de départ (nul : aucun)
  v_ecarts_applique text;           -- écarts avec l'état corrigé (nul : aucun)
  v_nb_depart int; v_nb_applique int;
  v_trouves int;                    -- points portant un libellé suivi, ancien ou nouveau
  v_suivis int;                     -- libellés suivis (${SUIVIS} : les anciens et les nouveaux, chacun dans sa zone)
  v_modeles int;                    -- modèles à modifier
  v_n int;
  v_orphelins int; v_changes int; v_hors_table int; v_reste int;
begin
  -- Si la table est occupée : une erreur au bout de 5 s, rien n'est écrit, relancer. Ce délai est
  -- posé ici, dans le bloc : il vaut dès que le bloc tourne, et retombe avec lui.
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans public.models pendant le bloc ; la lecture (le site) reste ouverte.
  -- Le verrou tombe tout seul à la fin du bloc.
  lock table public.models in share row exclusive mode;

  -- Tables de travail, temporaires : elles disparaissent à la fin du bloc, écrit ou annulé.
${COMMENTAIRE_LISTES("  ")}
  create temp table lv_corr (n int primary key, zone text not null, ancien text not null, nouveau text not null,
                             points int not null, liste boolean not null, unique (zone, ancien)) on commit drop;
  insert into lv_corr (n, zone, ancien, nouveau, points, liste) values
${valeursCorr("    ")};
  create temp table lv_listes (n int, id uuid, primary key (n, id)) on commit drop;   -- n° de la correction, modèle qui porte son point
  insert into lv_listes (n, id) values
${valeursListes("    ")};
  create temp table lv_deja (zone text, libelle text, id uuid, primary key (zone, libelle, id)) on commit drop;   -- nouveau libellé déjà porté au départ
  insert into lv_deja (zone, libelle, id) values
${valeursDeja("    ")};

  -- Garde-fou : les listes lancées sont celles du script généré, au caractère près.
  v_lue := md5(coalesce((select string_agg(format('%s|%s|%s|%s|%s|%s', c.n, c.zone, c.ancien, c.nouveau, c.points, case when c.liste then 'oui' else 'non' end), E'\\n' order by c.n) from lv_corr c), '')
               || E'\\n=\\n' || coalesce((select string_agg(format('%s|%s', l.n, l.id), E'\\n' order by l.n, l.id) from lv_listes l), '')
               || E'\\n=\\n' || coalesce((select string_agg(format('%s|%s|%s', d.zone, d.libelle, d.id), E'\\n' order by d.zone collate "C", d.libelle collate "C", d.id) from lv_deja d), ''));
  if (select count(*) from lv_corr) <> ${NB} or (select coalesce(sum(c.points), 0) from lv_corr c) <> v_total
     or (select count(*) from lv_listes) <> ${NB_IDS} or (select count(*) from lv_deja) <> ${NB_DEJA} or v_lue is distinct from v_empreinte then
    raise exception 'Les listes du script ont été modifiées (attendu : ${NB} corrections, % points, ${NB_IDS} identifiants listés, ${NB_DEJA} « déjà là » ; trouvé : %, %, %, % ; empreinte des listes %) — rien n''est écrit. Recoller le fichier d''origine, sans le modifier, puis reprendre à l''étape 1.',
      v_total, (select count(*) from lv_corr), (select coalesce(sum(c.points), 0) from lv_corr c), (select count(*) from lv_listes), (select count(*) from lv_deja),
      case when v_lue is distinct from v_empreinte then 'différente' else 'identique' end;
  end if;

  -- Une fois corrigé, chaque modèle listé porte le nouveau libellé une fois ; n : la correction qui
  -- le liste (0 : il le portait déjà). Un modèle n'est listé qu'une fois pour un même libellé.
  create temp table lv_places (zone text, libelle text, id uuid, n int, primary key (zone, libelle, id)) on commit drop;
  insert into lv_places (zone, libelle, id, n)
${placesSql("lv_corr", "lv_listes", "lv_deja", "    ")};

  -- Combien de points doit porter chaque libellé suivi, au départ puis une fois corrigé
  create temp table lv_attendu on commit drop as
${attenduSql("lv_corr", "lv_deja", "    ")};

  -- Modèle par modèle : ce qu'un modèle listé doit porter (1) ou ne pas porter (0), dans quel état
  create temp table lv_positions on commit drop as
${positionsSql("lv_corr", "lv_listes", "lv_deja", "lv_places", "    ")};

  -- Toute la table telle qu'elle est avant d'écrire
  create temp table lv_avant on commit drop as
    select m.id, m.authentication_points::text as points_texte,
           (to_jsonb(m) - 'authentication_points')::text as autres_colonnes
    from public.models m;

  -- Les éléments de tous les tableaux, relevés deux fois : avant puis après l'écriture. Un
  -- authentication_points qui n'est pas un tableau n'en donne aucun ; zone et libelle restent nuls
  -- pour un élément mal formé (pas un objet, « zone » ou « label » absent ou pas un texte) : ignoré.
  -- inscrit : n° de la correction qui liste ce modèle pour ce libellé (0 : il le portait déjà ;
  -- nul : modèle non listé).
  create temp table lv_points (moment text, id uuid, rang bigint, point jsonb,
                               zone text, libelle text, inscrit int) on commit drop;

  -- ── 1. L'état AVANT (au moindre écart : exception, rien n'est écrit) ─────
${aplatir("avant")}
${mesurer("avant")}

  -- Aucun libellé suivi dans la base (table vide, mauvais projet) : le dire tel quel.
  if v_trouves = 0 then
    raise exception 'Aucun des % libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte % modèle(s) : est-ce le bon projet ? — rien n''est écrit. Vérifier le projet ouvert, puis reprendre à l''étape 1.',
      v_suivis, (select count(*) from lv_avant);
  end if;
  if v_ecarts_${A.apresOk} is null then
    ${dejaFait}
    return;
  end if;
  if v_ecarts_${A.avantOk} is not null then
    raise exception 'La base n''est ni dans l''état de départ ni dans l''état corrigé — rien n''est écrit. Ne pas relancer : transmettre ce message pour faire adapter le script. %',
      ${pasPret};
  end if;

  -- ── 2. La modification ──────────────────────────────────────────────────
${aller ? "" : `  -- Les fusions se défont par les listes : un point qui porte un nouveau libellé reprend l'ancien
  -- libellé de la correction qui liste son modèle ; s'il le portait déjà au départ, il le garde ;
  -- si son modèle n'est pas listé, il reprend l'ancien libellé de la correction sans liste.
`}  create temp table lv_concernes on commit drop as
    select distinct p.id
    from lv_points p join lv_corr c on ${aModifier(sens, "c", "p")}
    where p.moment = 'avant';

  -- Le tableau de chaque modèle concerné est reconstruit dans le même ordre ; un point n'est
  -- touché que si la table le désigne, et seule sa clé « label » est remplacée.
  update public.models m
  set authentication_points = r.tableau
  from (
    select p.id,
           jsonb_agg(case when c.zone is null then p.point
                          else jsonb_set(p.point, '{label}', to_jsonb(${A.vers})) end
                     order by p.rang) as tableau
    from lv_points p
    left join lv_corr c on ${aModifier(sens, "c", "p")}
    where p.moment = 'avant' and p.id in (select k.id from lv_concernes k)
    group by p.id
  ) r
  where m.id = r.id;
  get diagnostics v_modeles = row_count;

  -- ── 3. Les contrôles APRÈS (au moindre écart : exception, tout est annulé) ──
${aplatir("apres")}
${mesurer("apres")}

  -- a. ${aller
    ? "plus aucun ancien libellé ; chaque nouveau libellé a son total, et chaque modèle listé le porte une fois"
    : "plus aucun nouveau libellé hors des « déjà là » ; chaque ancien libellé a son total, sur les modèles de sa liste s'il en a une"}
  if v_ecarts_${A.apresOk} is not null then
    raise exception 'Après écriture, l''état attendu n''est pas atteint — tout est annulé. ${TRANSMETTRE}%', E'\\n' || v_ecarts_${A.apresOk};
  end if;

  -- b. autant de modèles écrits que de modèles concernés
  v_n := (select count(*) from lv_concernes);
  if v_modeles <> v_n then
    raise exception '% modèles écrits pour % concernés — tout est annulé. ${TRANSMETTRE}', v_modeles, v_n;
  end if;

  -- c. les mêmes lignes qu'avant, ni plus ni moins
  v_n := (select count(*)
          from lv_avant a full join public.models m on m.id = a.id
          where a.id is null or m.id is null);
  if v_n <> 0 then raise exception '% modèles apparus ou disparus — tout est annulé. ${TRANSMETTRE}', v_n; end if;

  -- d. aucune autre colonne ne change, sur aucun modèle. Ce bloc n'écrit que authentication_points :
  --    si une autre colonne a bougé, c'est qu'un déclencheur ou une colonne calculée de la table
  --    l'a changée en passant (une date de mise à jour, par exemple). Le message nomme la colonne et
  --    les déclencheurs actifs.
  v_n := (select count(*)
          from lv_avant a join public.models m on m.id = a.id
          where a.autres_colonnes is distinct from (to_jsonb(m) - 'authentication_points')::text);
  if v_n <> 0 then
    raise exception '% modèles ont une autre colonne modifiée (%) — tout est annulé. Ce bloc n''écrit que authentication_points : la cause est ailleurs, le plus souvent un déclencheur ou une colonne calculée de public.models (déclencheurs actifs trouvés : %). Ne pas relancer : faire adapter le script.',
      v_n,
      (select string_agg(distinct k.cle, ', ' order by k.cle)
       from lv_avant a join public.models m on m.id = a.id
       cross join lateral jsonb_each(to_jsonb(m) - 'authentication_points') as k(cle, valeur)
       where (a.autres_colonnes::jsonb -> k.cle)::text is distinct from k.valeur::text),
      coalesce((select string_agg(g.tgname::text, ', ' order by g.tgname)
                from pg_trigger g
                where g.tgrelid = 'public.models'::regclass and not g.tgisinternal and g.tgenabled <> 'D'), 'aucun');
  end if;

  -- e. les modèles non concernés sont identiques à l'octet près ; les modèles concernés ont tous changé
  v_n := (select count(*)
          from lv_avant a join public.models m on m.id = a.id
          where (a.points_texte is distinct from m.authentication_points::text)
                is distinct from (a.id in (select k.id from lv_concernes k)));
  if v_n <> 0 then raise exception '% modèles : tableau modifié à tort, ou laissé tel quel à tort — tout est annulé. ${TRANSMETTRE}', v_n; end if;

  -- f. pour CHAQUE modèle : même nombre de points, même suite de (zone, weight)
  v_n := (select count(*)
          from (
            select p.id
            from lv_points p
            group by p.id
            having (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'avant'))::text
                   is distinct from
                   (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'apres'))::text
          ) s);
  if v_n <> 0 then raise exception '% modèles : le nombre de points ou la suite des (zone, weight) a changé — tout est annulé. ${TRANSMETTRE}', v_n; end if;

  -- g. point par point, au même rang : seul le libellé change, seulement d'après la table, ${TOTAL} fois
  --    (le premier et le dernier des quatre tests ci-dessous sont des filets en double : f arrête avant
  --    eux tout point apparu ou disparu ; a, f et les deux tests du milieu, tout autre compte que ${TOTAL})
  select count(*) filter (where av.id is null or ap.id is null),
         count(*) filter (where av.libelle is distinct from ap.libelle),
         count(*) filter (where av.libelle is distinct from ap.libelle and c.zone is null),
         count(*) filter (where case when av.zone is not null and ap.zone is not null
                                     then (av.point - 'label')::text is distinct from (ap.point - 'label')::text
                                     else av.point::text is distinct from ap.point::text end)
    into v_orphelins, v_changes, v_hors_table, v_reste
  from (select * from lv_points where moment = 'avant') av
  full join (select * from lv_points where moment = 'apres') ap on ap.id = av.id and ap.rang = av.rang
  left join lv_corr c on ${aModifier(sens, "c", "av")} and ${A.vers} = ap.libelle;
  if v_orphelins <> 0 then raise exception '% points apparus ou disparus — tout est annulé. ${TRANSMETTRE}', v_orphelins; end if;
  if v_reste <> 0 then raise exception '% points modifiés ailleurs que dans leur libellé — tout est annulé. ${TRANSMETTRE}', v_reste; end if;
  if v_hors_table <> 0 then raise exception '% libellés modifiés hors de la table des corrections — tout est annulé. ${TRANSMETTRE}', v_hors_table; end if;
  if v_changes <> v_total then raise exception '% libellés modifiés au lieu de % — tout est annulé. ${TRANSMETTRE}', v_changes, v_total; end if;

  raise notice '${A.action} : % libellés ${A.verbe} dans % modèles.', v_changes, v_modeles;
end $$;`;
}

// ── Les textes ──────────────────────────────────────────────────────────────
const MOTS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"];
const enLettres = (n) => MOTS[n] ?? String(n);
const Maj = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pl = (n, singulier, pluriel = `${singulier}s`) => (n > 1 ? pluriel : singulier);
const listes_ = (n) => `${n} ${pl(n, "modèle listé", "modèles listés")}`;
// Un paragraphe de commentaire, coupé à 78 colonnes. « retrait » ouvre la première ligne, « suite »
// les suivantes. Une espace placée devant « : ; ? ! » ou « » », ou derrière « « », n'est jamais un
// point de coupe (le signe ne se retrouve pas seul en début ou en fin de ligne).
const COLLE = String.fromCharCode(1);
const para = (texte, retrait = "--   ", suite = retrait, largeur = 78) => {
  const mots = texte.replace(/\s+/g, " ").trim().replace(/ ([:;?!»])/g, `${COLLE}$1`).replace(/« /g, `«${COLLE}`).split(" ");
  const sorties = [];
  let ligne = "";
  for (const mot of mots) {
    const debut = sorties.length === 0 ? retrait : suite;
    if (ligne !== "" && (debut + ligne + " " + mot).length > largeur) { sorties.push(debut + ligne); ligne = mot; }
    else ligne = ligne === "" ? mot : `${ligne} ${mot}`;
  }
  sorties.push((sorties.length === 0 ? retrait : suite) + ligne);
  return sorties.join("\n").split(COLLE).join(" ");
};
// Le nom du bloc de l'étape 2, qui ne se coupe pas en fin de ligne.
const LE_BLOC = ["« do", "$$", "…", "end", "$$; »"].join(COLLE);
const etape = (n, texte) => para(texte, `--   ÉTAPE ${n} — `, "--             ");
const geste = (n, texte) => para(texte, `--   ${n}. `, "--      ");
const puce = (texte) => para(texte, "--   - ", "--     ");
// Un « déjà là » porté par les mêmes modèles que la liste d'une correction : le dire.
const memesQue = (ids) => AVEC_LISTE.find((c) => c.ids.length === ids.length && c.ids.join() === ids.join());
const memesQueDeja = (ids) => DEJA_LA.find((d) => d.ids.length === ids.length && d.ids.join() === ids.join());
// Chaque fusion, dite simplement, pour l'aller…
const listesDAbord = (g) => [...g.corrections.filter((c) => c.ids), ...g.corrections.filter((c) => !c.ids)];
const sous = (texte) => para(texte, "--       ", "--         ");
const fusionsAller = FUSIONS.map((g) => [
  para(`${g.zone} → « ${g.nouveau} »`),
  ...(g.deja ? [sous(`déjà porté au départ par ${listes_(g.deja.ids.length)}, qui le ${pl(g.deja.ids.length, "garde", "gardent")}`)] : []),
  ...listesDAbord(g).map((c) => sous(c.ids
    ? `« ${c.ancien} » : ${listes_(c.ids.length)}${memesQueDeja(c.ids) ? ` (les mêmes que pour « ${memesQueDeja(c.ids).libelle} »)` : ""}`
    : `« ${c.ancien} » : ${c.points} points, sans liste (tous les autres modèles)`)),
].join("\n")).join("\n");
// … et pour le retour.
const fusionsRetour = FUSIONS.map((g) => [
  para(`${g.zone} : « ${g.nouveau} »`),
  ...(g.deja ? [sous(`reste « ${g.nouveau} » sur ${listes_(g.deja.ids.length)}, qui le ${pl(g.deja.ids.length, "portait", "portaient")} déjà${memesQue(g.deja.ids) ? ` (les mêmes que pour « ${memesQue(g.deja.ids).ancien} »)` : ""}`)] : []),
  ...listesDAbord(g).map((c) => sous(c.ids
    ? `redevient « ${c.ancien} » sur ${listes_(c.ids.length)}`
    : `redevient « ${c.ancien} » sur tous les autres modèles (${c.points} points)`)),
].join("\n")).join("\n");
const dejaEnClair = DEJA_LA.map((d) => `${d.ids.length} « ${d.libelle} »`).join(", ");
const dejaPortent = DEJA_LA.map((d) => `${d.ids.length} ${pl(d.ids.length, "modèle qui porte", "modèles qui portent")} déjà « ${d.libelle} »`).join(", ");
const quatreZones = Object.keys(NOMS_AFFICHES);
const nHorsFusion = HORS_FUSION_AVEC_LISTE.reduce((s, c) => s + c.ids.length, 0);
const horsFusion = HORS_FUSION_AVEC_LISTE.length
  ? para(`${Maj(enLettres(HORS_FUSION_AVEC_LISTE.length))} ${pl(HORS_FUSION_AVEC_LISTE.length, "correction")} hors fusion ${pl(HORS_FUSION_AVEC_LISTE.length, "porte", "portent")} aussi une liste (${nHorsFusion} ${pl(nHorsFusion, "modèle")} en tout) : leurs points sont contrôlés de la même façon.`) + "\n"
  : "";

const TRAIT = "-- ============================================================================";
const F_ALLER_NOM = "2026-10-06-libelles-catalogue.sql", F_RETOUR_NOM = "2026-10-06-libelles-catalogue-retour.sql";
// « 530 » compte les lignes de la table, « 474 » les modèles que le site annonce : les en-têtes le
// disent partout où ils écrivent l'un de ces nombres (demande d'Hector du 06/10).
const DES_MODELES = `${RELEVE.aModifier} modèles sur les ${RELEVE.modeles} lignes de la table (${RELEVE.aModifierAnalysables} des ${RELEVE.analysables} modèles analysables qu'annonce le site, et ${RELEVE.aModifierDesactives} ${pl(RELEVE.aModifierDesactives, "modèle désactivé", "modèles désactivés")})`;
const DECOMPTE = `Les ${RELEVE.modeles} lignes de public.models, ce sont ces ${RELEVE.analysables} modèles analysables (modèle actif, marque active hors montres, au moins un point), ${RELEVE.desactives} ${pl(RELEVE.desactives, "modèle désactivé", "modèles désactivés")}, ${RELEVE.montres} ${pl(RELEVE.montres, "montre")} et ${RELEVE.actifsSansPoint} ${pl(RELEVE.actifsSansPoint, "modèle actif", "modèles actifs")} sans point : ${RELEVE.analysables} + ${RELEVE.desactives} + ${RELEVE.montres} + ${RELEVE.actifsSansPoint} = ${RELEVE.modeles}.`;
const NON_CALCULE = `Le script compte les lignes de la table ; le nombre de modèles analysables vient du relevé, il ne le recalcule pas (il ne lit pas public.brands).`;
const NOTE_VARIANTE = `--   VARIANTE D'ESSAI, générée depuis « ${basename(FICHIER_CORRECTIONS)} » : l'état de la
--   production n'a pas été vérifié pour cette table. À ne pas exécuter en production.`;
const ETAT_PRODUCTION = VARIANTE
  ? NOTE_VARIANTE
  : para(`État de la production vérifié le ${RELEVE.date} en lecture seule : ${TOTAL} points à corriger dans ${DES_MODELES}, aucun écart avec ce script. ${DECOMPTE}`);
const ETAT_PRODUCTION_RETOUR = VARIANTE
  ? NOTE_VARIANTE
  : para(`D'après le relevé de production du ${RELEVE.date} (lecture seule) : ${TOTAL} points à remettre dans ${DES_MODELES}. ${DECOMPTE}`);
const OU_SONT_LES_POINTS = VARIANTE ? "dans tous les modèles, actifs ou non" : `dans ${DES_MODELES}`;
const CE_QUI_EST_COMPTE = VARIANTE ? "" : ` ${NON_CALCULE}`;
const DECLENCHEURS = RELEVE.declencheurs === 0
  ? `au relevé du ${RELEVE.date}, public.models n'a aucun déclencheur`
  : `au relevé du ${RELEVE.date}, public.models a ${RELEVE.declencheurs} ${pl(RELEVE.declencheurs, "déclencheur")}`;
const LA_VERSION = `Version ${VERSION.numero} : ${NB} corrections, ${TOTAL} points.`;
// Les débuts de première ligne que « EN BREF » fait attendre : nombres compris, pour qu'une autre
// version du fichier (mêmes mots, autres nombres) ne passe pas pour celle-ci. Ce sont les débuts
// des verdicts calculés par les aperçus, écrits avec les mêmes constantes.
const DEBUTS = {
  aller: { 1: `PRÊT : ${TOTAL} points à corriger`, 3: `APPLIQUÉ : les ${NB} corrections sont en place (${TOTAL} points)` },
  retour: { 1: `PRÊT POUR LE RETOUR : ${TOTAL} points à remettre`, 3: `À L'ÉTAT DE DÉPART : les anciens libellés des ${NB} corrections` },
};
const SELECTION = para(`Sur le projet de production, dans l'éditeur SQL de Supabase. Lancer une étape « seule » : sélectionner ses lignes, de son bandeau « ═══ ÉTAPE n » jusqu'au bandeau suivant (ou la fin du fichier) ; le bouton « Run » devient « Run selected ». Sans sélection, « Run » lance tout le fichier, écriture comprise.`);
const AUTRES_NOMBRES = para(`Si une première ligne ne commence pas comme indiqué ici : s'arrêter là, ne pas lancer l'étape 2, et transmettre cette ligne.`);
const GESTE_2 = geste(2, `Lancer l'ÉTAPE 2 seule (le bloc ${LE_BLOC}). Elle n'affiche aucune ligne (« Success. No rows returned ») : la preuve, c'est l'étape 3.`);
const GESTE_4 = geste(4, `Relancer ensuite « pnpm fiabilite verifier », avant la campagne de mesure.`);
// Ce qu'il faut faire quand un affichage s'écarte de « EN BREF » : court, sous « EN BREF ».
const imprevus = (sens) => [
  "-- SI ÇA NE SE PASSE PAS COMME PRÉVU",
  para(`Rien n'est abîmé : les étapes 1 et 3 ne font que lire, l'étape 2 écrit tout ou rien. Si une première ligne commence autrement, ou si un message d'erreur apparaît : ne pas lancer l'étape 2 (ni la relancer), relancer l'étape 1 seule, et transmettre le texte de sa première ligne ou le message d'erreur.`),
  ...(sens === "aller" ? [puce(`« ATTENTION » dans une première ligne : continuer, et transmettre la phrase qui suit ce mot.`)] : []),
  puce(`« ${sens === "aller" ? "PAS APPLIQUÉ" : "PAS REVENU"} » à l'étape 3 : rien n'a été écrit ; la ligne dit quoi faire.`),
  puce(`Erreur « syntax error » ou « unterminated dollar-quoted string » : la sélection était incomplète, rien n'a été lancé ; refaire la sélection en entier.`),
  puce(`Erreur « canceling statement due to lock timeout » à l'étape 2 : la table était occupée, rien n'est écrit ; relancer l'étape 2.`),
  puce(`Erreur « relation "public.models" does not exist » (ou « column m.authentication_points does not exist ») : le projet ouvert n'a pas le catalogue de LegitVision, ce n'est pas le bon projet. Rien n'y est écrit ; ouvrir le bon projet et reprendre à l'étape 1.`),
].join("\n");
// Ce que l'éditeur affiche, et ce qu'une sélection trop longue fait croire.
const affichage = (pret, fait, deja) => para(`TROIS ÉTAPES, À LANCER UNE PAR UNE dans l'éditeur SQL de Supabase. Il affiche au plus un tableau par lancement : celui de la dernière instruction qui a rendu des lignes, même si d'autres ont été exécutées après elle. Une sélection trop longue, qui prend l'étape 1 ET l'étape 2, exécute donc les deux et affiche quand même « ${pret} » : ${fait}. Avant chaque lancement, vérifier que la sélection s'arrête avant le bandeau de l'étape suivante. Dans le doute, relancer l'étape 1 seule : si elle dit « ${deja} », l'étape 2 est passée.`);
const AUTRE_OUTIL = para(`Ces étapes sont écrites pour l'éditeur SQL de Supabase, qui enregistre chaque lancement réussi. Dans un outil réglé pour ne valider qu'à la demande (il ouvre lui-même une transaction), l'étape 2 n'est enregistrée qu'à cette validation ; après une erreur, il faut y lancer « rollback; » avant de reprendre à l'étape 1.`);
const COMMENTAIRE_SEUL = `Si la sélection ne prenait que des lignes de commentaire, rien n'a été lancé et l'éditeur n'affiche rien non plus : c'est l'étape 3 qui dit l'état de la base.`;
const VERROU = `Pendant le bloc, public.models est fermée à l'écriture et reste ouverte à la lecture ; si la table est occupée, une erreur arrive au bout de 5 s, rien n'est écrit, relancer.`;
const SES_LISTES = para(`Ses propres listes d'abord : ${NB} corrections, ${TOTAL} points, ${NB_IDS} identifiants dans ses listes de modèles, ${dejaPortent}, et l'empreinte de ces listes, calculée quand le script a été généré. Un libellé, un compte ou un identifiant modifié, même d'un caractère : exception, rien n'est écrit.`);
const CONDITIONS_DU_RETOUR = `Il ne remet les anciens libellés que si les comptes sont ceux que l'aller a laissés : chaque libellé des ${NB} corrections (ancien ou nouveau, dans sa zone) a son nombre de points, et chaque modèle listé porte encore le sien. Un seul point de plus ou de moins suffit à le bloquer : un modèle créé avec un de ces libellés (le premier modèle créé avec les nouveaux libellés, par exemple), un modèle concerné supprimé, un de ces libellés retouché à la main.`;
const CE_QUI_NE_GENE_PAS = `Le reste du catalogue peut bouger : un modèle créé sans aucun de ces libellés, un modèle désactivé ou renommé, un autre libellé retouché ne gênent pas le retour.`;
const LIMITE = `Limite : ce contrôle compte des points. Deux changements qui se compensent (un point retiré d'un modèle non listé, le même ajouté à un autre) ne se voient pas dans les comptes.`;
const UNE_AUTRE_COLONNE = `« … modèles ont une autre colonne modifiée — tout est annulé », en nommant la colonne et les déclencheurs actifs`;

// Attention : aucune ligne d'en-tête ne doit commencer par « -- ═══ » (bandeau des étapes).
const enteteAller = [
  TRAIT,
  "-- LegitVision — libellés des points d'authentification du catalogue",
  `-- Préparé d'après le relevé de production du ${RELEVE.date} (lecture seule).`,
  para(`${LA_VERSION} Elle remplace la version du commit ${VERSION.remplace}, de même nom de fichier, qui ne doit plus être lancée.`, "-- "),
  "--",
  "-- EN BREF",
  SELECTION,
  geste(1, `Lancer l'ÉTAPE 1 seule. Sa première ligne doit commencer par « ${DEBUTS.aller[1]} ». Noter ses trois empreintes (les trois dernières colonnes de cette ligne).`),
  GESTE_2,
  geste(3, `Lancer l'ÉTAPE 3 seule. Sa première ligne doit commencer par « ${DEBUTS.aller[3]} ». Noter son empreinte des points suivis (la dernière colonne) : le retour arrière la demande.`),
  GESTE_4,
  AUTRES_NOMBRES,
  para(`Jamais pendant la mesure des 60 paires. Retour arrière : le fichier ${F_RETOUR_NOM}, mêmes trois étapes.`),
  ETAT_PRODUCTION,
  "--",
  imprevus("aller"),
  "--",
  "-- CE QUE FAIT CE SCRIPT",
  para(`Il applique ${NB} corrections aux libellés de public.models.authentication_points : surtout des fautes d'accent (« Etiquette interieure »), du franglais (« Hardware/ferrures », « Tab talon », « Print/Broderie »), un mot faux (« langue » pour « languette ») ; et, pour quatre zones, un début de libellé qui reprend le nom affiché dans le rapport (voir POURQUOI). ${TOTAL} points en tout, ${OU_SONT_LES_POINTS}.${CE_QUI_EST_COMPTE} Seule la clé « label » des points concernés change. L'ordre des points, leur zone, leur poids, leurs autres clés, les autres colonnes de public.models et le reste de la base ne changent pas. Aucun objet permanent n'est créé : les tables de travail sont temporaires et disparaissent à la fin du bloc.`),
  "--",
  "-- POURQUOI",
  para(`Le libellé d'un point part tel quel dans la consigne envoyée à l'IA (lib/ai/authentication-prompts.ts : « N. **libellé** (zone: \`identifiant\`, poids: X%) »). Il sert aussi de repli pour le nom de la zone affiché dans le rapport, après la table des noms de zones (lib/zone-names.ts, lot du rapport livré le 2026-10-06) : ce repli ne garde que le début du libellé, ce qui précède la première parenthèse (ou les premiers deux-points, ou la première virgule).`),
  para(`Pour quatre zones (${quatreZones.slice(0, -1).join(", ")} et ${quatreZones.at(-1)}), le début du libellé reprend le nom affiché dans le rapport, et la suite garde la description destinée à l'IA (décision d'Hector du 06/10) : ${Object.values(NOMS_AFFICHES).map((n) => `« ${n} … »`).join(", ")}.`),
  "--",
  "-- ATTENTION — À EXÉCUTER AVANT LA CAMPAGNE DE MESURE, JAMAIS PENDANT",
  para(`Changer un libellé, c'est changer la consigne de l'IA : des analyses faites avant et après ce script ne sont pas comparables. Pendant la mesure des 60 paires, ni ce script ni son retour arrière ne se lancent.`),
  para(`« Avant la campagne » veut dire : avant le dernier « pnpm fiabilite verifier » (outil de mesure : scripts/fiabilite, branche refonte/site). « verifier » fige une copie du catalogue ; « estimer » et « lancer » relisent cette copie et ne consultent plus la base. Si ce script passe entre « verifier » et « lancer », la campagne mesure les anciens libellés alors que la production envoie les nouveaux, et rien ne le signale. L'ordre est donc : étape 3 de ce script, puis « verifier », puis « lancer ». Si le catalogue de la campagne est déjà figé, relancer « verifier » après ce script. Contrôle : l'heure « Catalogue figé le … » (UTC), affichée par « verifier » et par « estimer », doit être postérieure à l'étape 3.`),
  "--",
  "-- COMMENT LE LANCER",
  affichage("PRÊT", "l'écriture est pourtant faite", "DÉJÀ APPLIQUÉ"),
  etape(1, `aperçu AVANT (lecture seule). La ligne 0 donne le verdict : « PRÊT » (lancer l'étape 2), « DÉJÀ APPLIQUÉ » (ne rien lancer) ou « ÉCARTS » suivi de leur liste (ne pas lancer l'étape 2 : la base n'est plus celle du relevé ; si aucun libellé du relevé n'y est, le verdict le dit : vérifier le projet ouvert). « PRÊT » compte les modèles à corriger et toutes les lignes de la table, modèles désactivés compris (voir EN BREF). Les lignes 1 à ${NB} : une par correction. « points_au_releve » : ses points au relevé ; « a_corriger » : ceux qui portent encore l'ancien libellé (autant avant l'étape 2, 0 après) ; « portent_deja_le_nouveau » : les points qui portent le nouveau libellé ; « attendus_apres » : leur total une fois la correction faite. Noter le verdict et les trois empreintes de la ligne 0. « empreinte_libelles » : tous les points de tous les modèles ; « empreinte_autres_colonnes » : le reste de public.models (calculée en UTC : elle ne dépend pas du fuseau horaire de la session) ; « empreinte_points_suivis » : les seuls points qui portent un des ${SUIVIS} libellés de ce script, modèle par modèle. Elles servent à savoir si l'étape 2 a écrit, et à prouver un retour arrière exact.`),
  etape(2, `la modification : UNE seule instruction, atomique (le bloc ${LE_BLOC}). Une sélection qui en perd le début ou la fin n'est qu'une erreur de syntaxe : rien n'est lancé. Au moindre écart, avant ou après l'écriture, une exception annule TOUT et rien n'est écrit. Un succès sans message veut dire « écrit » ou « déjà appliqué, rien écrit » : l'avis (raise notice) qui les distingue ne s'affiche pas forcément dans l'éditeur, et l'étape 3 ne les distingue pas (elle lit l'état de la base, le même dans les deux cas). Ce qui les distingue : le verdict de l'étape 1 lancée juste avant (« PRÊT » : l'étape 2 a écrit ; « DÉJÀ APPLIQUÉ » : elle n'avait rien à écrire), et l'empreinte des libellés, qui ne change entre l'étape 1 et l'étape 3 que s'il y a eu écriture (elle porte sur toute la table : un modèle créé ou supprimé, ou un authentication_points modifié par ailleurs entre-temps, la change aussi). ${COMMENTAIRE_SEUL} ${VERROU}`),
  etape(3, `aperçu APRÈS (lecture seule) : la preuve que la base est corrigée. Verdict attendu : « APPLIQUÉ », ${NB} lignes « corrigé » (« a_corriger » à 0, « portent_deja_le_nouveau » égal à « attendus_apres »), l'empreinte des autres colonnes inchangée. Noter l'empreinte des points suivis : le retour arrière la demande avant d'écrire. L'étape 3 décrit l'état de la base, pas ce que l'étape 2 vient de faire. « PAS APPLIQUÉ » : rien n'a été écrit, et la ligne dit quoi faire.`),
  para(`(Lancer le fichier entier d'un coup fait la même chose et n'affiche que l'étape 3 : on perd l'aperçu AVANT, ses empreintes, et le moyen de savoir si l'étape 2 a écrit ou si tout était déjà en place.)`),
  AUTRE_OUTIL,
  "--",
  "-- CE QUE L'ÉTAPE 2 VÉRIFIE",
  SES_LISTES,
  para(`Avant d'écrire : chaque ancien libellé a exactement son nombre de points du relevé ; aucun nouveau libellé n'est déjà porté (sauf les ${dejaEnClair}) ; chaque point à liste est sur son modèle (voir les fusions, plus bas). Base déjà corrigée : un avis, aucune écriture. Tout autre état : exception.`),
  para(`Après avoir écrit, dans le même bloc : plus aucun ancien libellé ; chaque nouveau libellé a son total, et chaque modèle listé le porte une fois ; exactement ${TOTAL} libellés modifiés, tous d'après la table ; pour chaque modèle, même nombre de points et même suite de (zone, weight) ; rien d'autre que le libellé ne change dans un point ; les modèles non concernés sont identiques à l'octet près ; aucune autre colonne ne change ; aucun modèle n'apparaît ni ne disparaît.`),
  para(`Ce qui est mal formé est ignoré et laissé tel quel : un authentication_points qui n'est pas un tableau, un point sans « zone » ou sans « label », un libellé nul. Un ancien libellé rangé sous une autre zone que celle de la table n'est pas corrigé non plus. Or l'application envoie à l'IA une ligne par point, sans filtre : les étapes 1 et 3 comptent donc les points qui portent un ancien libellé hors de la table, et les signalent dans leur première ligne (« ATTENTION »). Sans ce mot, « plus aucun ancien libellé » vaut pour tous les points, de toute forme et de toute zone.`),
  para(`Ce que l'étape 1 ne voit pas : un déclencheur ou une colonne calculée de public.models qui change une autre colonne à chaque modification — une date de mise à jour, comme sur analyses et profiles (${DECLENCHEURS}). L'étape 1 affiche « PRÊT », puis l'étape 2 s'arrête sur ${UNE_AUTRE_COLONNE} : rien n'est écrit, l'étape 3 affiche « PAS APPLIQUÉ ». Un déclencheur qui refuse l'écriture (un garde, comme sur analyses et profiles) arrête l'étape 2 de la même façon, avec son propre message. Ne pas relancer : faire adapter le script.`),
  "--",
  `-- ${enLettres(FUSIONS.length).toUpperCase()} FUSIONS (pour que le retour arrière soit exact)`,
  para(`Il y a fusion quand plusieurs anciens libellés d'une zone deviennent le même nouveau libellé, ou quand le nouveau libellé est déjà porté au départ. Pour savoir défaire une fusion, le script porte la liste des modèles (leurs identifiants, relevés le ${RELEVE.date}) de chaque ancien libellé qui y entre, sauf un au plus : celui-là vaut pour tous les autres modèles. Il porte aussi la liste des modèles qui ont déjà le nouveau libellé au départ.`),
  fusionsAller,
  para(`Avant d'écrire, l'étape 2 vérifie que chaque point est bien là où ces listes le disent : un ancien libellé à liste est sur chaque modèle de sa liste, une fois, et nulle part ailleurs ; un ancien libellé sans liste n'est sur aucun modèle listé de sa fusion ; un libellé déjà porté au départ l'est par chacun de ses modèles, une fois, et par aucun autre. Sinon elle s'arrête, rien n'est écrit.`),
  `${horsFusion}--`,
  `-- RETOUR ARRIÈRE : ${F_RETOUR_NOM} (mêmes trois étapes).`,
  para(`${CONDITIONS_DU_RETOUR} Ensuite, l'étape 1 du retour affiche « ÉCARTS », son étape 2 s'arrête sans rien écrire, et il faut faire préparer un retour adapté, sans rien corriger à la main (l'étape 2 refuse une liste modifiée) : voir « QUAND CE RETOUR N'EST PLUS POSSIBLE » dans l'en-tête du retour. L'étape 1 de ce script-ci affiche alors elle aussi « ÉCARTS » au lieu de « DÉJÀ APPLIQUÉ », sans que rien soit défait. ${CE_QUI_NE_GENE_PAS}`),
  para(`${LIMITE} L'empreinte des points suivis les voit : notée à l'étape 3 de ce script, elle doit être la même à l'étape 1 du retour, avant d'écrire ; sinon, ne pas lancer le retour.`),
  para(`Un déclencheur ou une colonne calculée ajoutés à public.models après ce script, s'ils changent une autre colonne à chaque modification, bloquent le retour de la même façon : son étape 1 affiche « PRÊT POUR LE RETOUR », son étape 2 s'arrête sans rien écrire.`),
  TRAIT,
].join("\n");

const enteteRetour = [
  TRAIT,
  "-- LegitVision — RETOUR ARRIÈRE des libellés des points d'authentification",
  para(`Défait exactement ${F_ALLER_NOM}. Préparé d'après le relevé de production du ${RELEVE.date} (lecture seule).`, "-- "),
  para(`${LA_VERSION} Elle ne défait que l'aller de la même version ; l'aller du commit ${VERSION.remplace} ne se défait que par le retour du même commit.`, "-- "),
  "--",
  "-- EN BREF",
  para(`À ne lancer que pour défaire ${F_ALLER_NOM}.`),
  SELECTION,
  geste(1, `Lancer l'ÉTAPE 1 seule. Sa première ligne doit commencer par « ${DEBUTS.retour[1]} ». Son empreinte des points suivis (la dernière colonne) doit être celle notée à l'étape 3 de l'aller : sinon, ne pas lancer l'étape 2.`),
  GESTE_2,
  geste(3, `Lancer l'ÉTAPE 3 seule. Sa première ligne doit commencer par « ${DEBUTS.retour[3]} ». Son empreinte des points suivis doit être celle notée à l'étape 1 de l'aller.`),
  GESTE_4,
  AUTRES_NOMBRES,
  para(`Jamais pendant la mesure des 60 paires.`),
  ETAT_PRODUCTION_RETOUR,
  "--",
  imprevus("retour"),
  "--",
  "-- CE QUE FAIT CE SCRIPT",
  para(`Il défait les ${NB} corrections : il remet les anciens libellés de public.models.authentication_points, fautes comprises : ${TOTAL} points, ${OU_SONT_LES_POINTS}.${CE_QUI_EST_COMPTE} Après « aller puis retour », si rien d'autre n'a changé entre les deux, chaque ligne de public.models est identique à l'état de départ, à l'octet près. Seule la clé « label » des points concernés change ; rien d'autre n'est écrit, aucun objet permanent n'est créé.`),
  "--",
  "-- POURQUOI",
  para(`À n'utiliser que si les nouveaux libellés posent un problème. Le libellé part dans la consigne envoyée à l'IA (lib/ai/authentication-prompts.ts).`),
  "--",
  "-- ATTENTION — JAMAIS PENDANT LA CAMPAGNE DE MESURE",
  para(`Revenir aux anciens libellés change la consigne de l'IA, comme l'aller. L'outil de mesure (scripts/fiabilite, branche refonte/site) travaille sur la copie du catalogue figée par « pnpm fiabilite verifier ». Un retour lancé après ce « verifier » ne change donc pas la mesure, qui continue avec les nouveaux libellés : c'est la production qui s'en écarte. La mesure ne décrit alors plus ce que la production envoie à l'IA, et rien ne le signale. Après un retour : relancer « verifier » avant tout « lancer », et contrôler que l'heure « Catalogue figé le … » (UTC), affichée par « verifier » et par « estimer », est postérieure à l'étape 3 de ce script.`),
  "--",
  "-- QUAND CE RETOUR N'EST PLUS POSSIBLE",
  para(`${CONDITIONS_DU_RETOUR} Ensuite l'étape 1 affiche « ÉCARTS » et l'étape 2 s'arrête sans rien écrire. Ne rien corriger à la main (l'étape 2 refuse une liste modifiée) : transmettre la première ligne de l'étape 1. Ce fichier ne sert alors plus tel quel : un retour adapté à l'état réel de la base se prépare à part, comme un script neuf (nouveau relevé en lecture seule, essais, relecture), à partir du générateur de ces deux fichiers et de sa table, conservés dans ${OUTILLAGE}.`),
  para(CE_QUI_NE_GENE_PAS),
  para(`${LIMITE} L'empreinte des points suivis les voit : à l'étape 1, elle doit être celle notée à l'étape 3 de l'aller ; sinon, ne pas lancer l'étape 2, un point suivi a changé de modèle ou de libellé depuis l'aller. Les deux autres empreintes ne le disent pas : celle des libellés change aussi pour un modèle créé ou un autre libellé retouché, qui ne gênent pas le retour. Si l'empreinte de l'étape 3 de l'aller n'a pas été notée, le retour reste possible, mais sans cette assurance : le signaler avant de lancer l'étape 2.`),
  para(`Autre blocage, que l'étape 1 ne voit pas : un déclencheur ou une colonne calculée ajoutés à public.models après l'aller, s'ils changent une autre colonne à chaque modification — une date de mise à jour, comme sur analyses et profiles (${DECLENCHEURS}). L'étape 1 affiche « PRÊT POUR LE RETOUR », puis l'étape 2 s'arrête sur ${UNE_AUTRE_COLONNE} : rien n'est écrit, l'étape 3 affiche « PAS REVENU ». Un déclencheur qui refuse l'écriture (un garde, comme sur analyses et profiles) arrête l'étape 2 de la même façon, avec son propre message. Ne pas relancer : faire adapter le script.`),
  "--",
  "-- COMMENT LE LANCER",
  affichage("PRÊT POUR LE RETOUR", "le retour est pourtant fait", "DÉJÀ REVENU"),
  etape(1, `aperçu AVANT le retour (lecture seule). La ligne 0 donne le verdict : « PRÊT POUR LE RETOUR » (lancer l'étape 2 si l'empreinte des points suivis est celle notée à l'étape 3 de l'aller), « DÉJÀ REVENU » (ne rien lancer) ou « ÉCARTS » suivi de leur liste (ne pas lancer l'étape 2 ; si aucun libellé du relevé n'est dans la base, le verdict le dit : vérifier le projet ouvert). « PRÊT POUR LE RETOUR » compte les modèles à remettre et toutes les lignes de la table, modèles désactivés compris (voir EN BREF). Les lignes 1 à ${NB} : une par correction. « points_au_releve » : ses points au relevé ; « a_remettre » : ceux que le retour remettrait (autant avant l'étape 2, 0 après) ; « portent_l_ancien » : ceux qui portent l'ancien libellé ; « modeles_vises » : où va la correction, d'après les listes. Noter le verdict et les trois empreintes de la ligne 0.`),
  etape(2, `le retour : UNE seule instruction, atomique (le bloc ${LE_BLOC}). Une sélection qui en perd le début ou la fin n'est qu'une erreur de syntaxe : rien n'est lancé. Au moindre écart, avant ou après l'écriture, une exception annule TOUT. Un succès sans message veut dire « remis » ou « déjà revenu, rien écrit » : l'étape 3 ne les distingue pas (elle lit l'état de la base, le même dans les deux cas). Ce qui les distingue : le verdict de l'étape 1 lancée juste avant (« PRÊT POUR LE RETOUR » : l'étape 2 a écrit ; « DÉJÀ REVENU » : elle n'avait rien à écrire), et l'empreinte des libellés, qui ne change entre l'étape 1 et l'étape 3 que s'il y a eu écriture (elle porte sur toute la table : un modèle créé ou supprimé, ou un authentication_points modifié par ailleurs entre-temps, la change aussi). ${COMMENTAIRE_SEUL} ${VERROU}`),
  etape(3, `aperçu APRÈS le retour (lecture seule) : la preuve que la base est dans l'état de départ. Verdict attendu : « À L'ÉTAT DE DÉPART », ${NB} lignes « ancien en place » (« a_remettre » à 0, « portent_l_ancien » égal à « points_au_releve »), et l'empreinte des points suivis égale à celle notée à l'étape 1 de l'aller : chaque point suivi a retrouvé son libellé, sur son modèle. Si rien d'autre n'a changé dans public.models depuis l'étape 1 de l'aller, les deux autres empreintes sont elles aussi égales à celles notées alors : c'est la preuve du retour à l'octet près. Si le catalogue a bougé entre-temps, même sans gêner le retour, elles ne le sont plus : un modèle créé change les deux ; un modèle désactivé ou renommé, celle des autres colonnes ; un autre libellé retouché, celle des libellés. Une de ces deux empreintes différente ne dit donc pas que le retour est inexact ; si rien de tel n'a été fait entre-temps, faire vérifier le catalogue. L'étape 3 décrit l'état de la base, pas ce que l'étape 2 vient de faire : sur une base jamais corrigée, elle affiche la même chose. « PAS REVENU » : rien n'a été écrit, et la ligne dit quoi faire.`),
  para(`(Lancer le fichier entier d'un coup n'affiche que l'étape 3 : on perd le moyen de savoir si l'étape 2 a écrit ou si la base était déjà revenue.)`),
  AUTRE_OUTIL,
  "--",
  "-- COMMENT LES FUSIONS SE DÉFONT",
  para(`${Maj(enLettres(FUSIONS.length))} nouveaux libellés viennent de plusieurs anciens, ou étaient déjà portés au départ. Pour rendre à chaque point son ancien libellé, le script porte des listes de modèles (identifiants relevés le ${RELEVE.date}). Pour un point qui porte un de ces nouveaux libellés, la règle est :`),
  para(`son modèle est dans la liste d'un ancien libellé de cette fusion : il reprend celui-là ;`, "--     - ", "--       "),
  para(`son modèle portait déjà le nouveau libellé au départ : il le garde ;`, "--     - ", "--       "),
  para(`son modèle n'est dans aucune de ces listes : il reprend l'ancien libellé sans liste.`, "--     - ", "--       "),
  fusionsRetour,
  "--",
  "-- CE QUE L'ÉTAPE 2 VÉRIFIE",
  SES_LISTES,
  para(`Avant d'écrire : les comptes sont ceux que l'aller a laissés. Chaque nouveau libellé a son total, chaque modèle listé le porte une fois, il n'y a plus aucun ancien libellé. Sinon elle s'arrête, rien n'est écrit (voir « QUAND CE RETOUR N'EST PLUS POSSIBLE »). Base déjà revenue : un avis, aucune écriture.`),
  para(`Après avoir écrit, les mêmes contrôles que l'aller : chaque ancien libellé a retrouvé son nombre de points, sur les modèles de sa liste s'il en a une ; exactement ${TOTAL} libellés modifiés, tous d'après la table ; pour chaque modèle, même nombre de points et même suite de (zone, weight) ; rien d'autre que le libellé ne change dans un point ; les modèles non concernés sont identiques à l'octet près ; aucune autre colonne ne change ; aucun modèle n'apparaît ni ne disparaît.`),
  TRAIT,
].join("\n");
for (const [nom, texte] of [["aller", enteteAller], ["retour", enteteRetour]]) {
  for (const l of texte.split("\n")) {
    if (/^-- ═══/.test(l)) echec(`en-tête ${nom} : une ligne commence comme un bandeau d'étape : ${l}`);
    if (!l.startsWith("--")) echec(`en-tête ${nom} : une ligne n'est pas un commentaire : ${l}`);
    if (l.length > 100) echec(`en-tête ${nom} : ligne trop longue (${l.length} caractères) : ${l}`);
  }
  if (/\bundefined\b|\bnull\b|\bNaN\b|\[object /.test(texte)) echec(`en-tête ${nom} : une valeur manque dans le texte généré`);
}

// ── La requête de contrôle de la production : UNE instruction, lecture seule ─
// Elle rend une ligne. Elle porte les mêmes listes que les scripts et les mêmes règles (la mesure
// de l'étape 1, puis l'aller et le retour rejoués en mémoire, modèle par modèle), sans rien écrire.
// Elle part sans aucun commentaire : rien qu'une instruction « with … select », quel que soit
// l'outil qui la transmet. Sa seule fonction à effet est set_config('TimeZone', 'UTC', true), dans
// l'empreinte des autres colonnes : un réglage qui ne vaut que pour la transaction de la requête.
// Elle mesure aussi ce que les scripts ne mesurent pas ou ne font que citer :
// - le décompte des lignes de la table (modèles analysables, désactivés, montres, actifs sans
//   point), que les en-têtes citent d'après le relevé : elle lit public.brands, les scripts non ;
// - ce que les scripts ignorent (éléments et tableaux mal formés, anciens libellés hors de la table) ;
// - trois constats du relevé du 06/10 (deux points de même zone, libellés hors table dans les quatre
//   zones au nom affiché, points corrigés sur des modèles désactivés).
function sansCommentaires(sql) {
  let out = "", dansChaine = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (dansChaine) { out += c; if (c === "'") dansChaine = false; continue; }
    if (c === "'") { dansChaine = true; out += c; continue; }
    if (c === "-" && sql[i + 1] === "-") { while (i < sql.length && sql[i] !== "\n") i++; out += "\n"; continue; }
    out += c;
  }
  return out.split("\n").map((l) => l.trimEnd()).filter((l) => l !== "").join("\n") + "\n";
}
function controle() {
  return sansCommentaires(controleBrut());
}
function controleBrut() {
  // « Analysable », comme le site le compte (lib/analyzable.ts, lib/site-facts.ts) : modèle actif,
  // marque active hors montres, au moins un point. Les quatre groupes du relevé, dans l'ordre où ils
  // s'excluent ; « hors_decompte » (modèle actif d'une marque désactivée) doit rester à zéro.
  const A_DES_POINTS = `(jsonb_typeof(m.authentication_points) = 'array' and jsonb_array_length(m.authentication_points) > 0)`;
  const GROUPE = `case when not m.is_active then 'desactive'
                     when b.category = 'watch' then 'montre'
                     when not ${A_DES_POINTS} then 'sans_point'
                     when b.is_active then 'analysable'
                     else 'hors_decompte' end`;
  return `${listesEnCte()}
el as (
  select m.id, e.rang, e.point,
         case when f.bien_forme then e.point ->> 'zone' end as zone, case when f.bien_forme then e.point ->> 'label' end as libelle
  from public.models m
  cross join lateral jsonb_array_elements(${TABLEAU}) with ordinality as e(point, rang)
  cross join lateral (select ${BIEN_FORME("e.point")} as bien_forme) f
),
pts as (
  select e.id, e.zone, e.libelle, ${INSCRIT("places", "e.zone", "e.libelle", "e.id")} as inscrit
  from el e where e.zone is not null
),
attendu as (
${attenduSql("corr", "deja", "  ")}
),
positions as (
${positionsSql("corr", "listes", "deja", "places", "  ")}
),
mesure as (
${mesureSql("attendu", "positions", "pts", "", "  ")}
),
etat as (
  select coalesce(bool_and(j.ok_depart), false) as au_depart, coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(${ecartFormat("j", "depart")}, ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         count(*) filter (where not j.ok_depart) as nb_depart, count(*)::int as suivis
  from mesure j
),
comptes as (
  select c.n, c.points,
         (select count(*) from pts p where p.zone = c.zone and p.libelle = c.ancien) as trouves,
         case when c.liste
              then (select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) from pts p where p.zone = c.zone and p.libelle = c.ancien)
                   = (select coalesce(array_agg(l.id order by l.id), '{}'::uuid[]) from listes l where l.n = c.n)
              else true end as liste_exacte
  from corr c
),
deja_listes as (
  select g.zone, g.libelle,
         g.ids = (select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) from pts p where p.zone = g.zone and p.libelle = g.libelle) as liste_exacte
  from (select d.zone, d.libelle, array_agg(d.id order by d.id) as ids from deja d group by d.zone, d.libelle) g
),
aller as (
  select e.id, e.rang, e.zone, coalesce(c.nouveau, e.libelle) as libelle, c.n is not null as change,
         case when c.n is null then e.point else jsonb_set(e.point, '{label}', to_jsonb(c.nouveau)) end as point
  from el e left join corr c on ${aModifier("aller", "c", "e")}
),
retour as (
  select p.id, p.rang, p.change as change_aller, p.point as point_aller, c.n is not null as change_retour,
         case when c.n is null then p.point else jsonb_set(p.point, '{label}', to_jsonb(c.ancien)) end as point_retour
  from (select a.*, ${INSCRIT("places", "a.zone", "a.libelle", "a.id")} as inscrit from aller a) p
  left join corr c on ${aModifier("retour", "c", "p")}
),
simule as (
  select m.id, m.authentication_points as origine,
         case when x.change_aller then x.tableau_aller else m.authentication_points end as apres_aller,
         case when x.change_retour then x.tableau_retour when x.change_aller then x.tableau_aller else m.authentication_points end as apres_retour
  from public.models m
  left join (
    select r.id, bool_or(r.change_aller) as change_aller, bool_or(r.change_retour) as change_retour,
           jsonb_agg(r.point_aller order by r.rang) as tableau_aller, jsonb_agg(r.point_retour order by r.rang) as tableau_retour
    from retour r group by r.id
  ) x on x.id = m.id
),
decompte as (
  select m.id, ${GROUPE} as groupe,
         exists (select 1 from pts p join corr c on ${aModifier("aller", "c", "p")} where p.id = m.id) as a_modifier
  from public.models m left join public.brands b on b.id = m.brand_id
)
select (select count(*) from corr) as corrections,
       (select sum(c.points) from corr c) as points_au_releve,
       (select coalesce(sum(k.trouves), 0) from comptes k) as a_corriger,
       (select count(*) from decompte d where d.a_modifier) as modeles_a_modifier,
       (select count(*) from decompte d where d.a_modifier and d.groupe = 'analysable') as modeles_a_modifier_analysables,
       (select count(*) from decompte d where d.a_modifier and d.groupe = 'desactive') as modeles_a_modifier_desactives,
       (select count(*) from public.models) as lignes_de_la_table,
       (select count(*) from decompte d where d.groupe = 'analysable') as modeles_analysables,
       (select count(*) from decompte d where d.groupe = 'desactive') as modeles_desactives,
       (select count(*) from decompte d where d.groupe = 'montre') as montres,
       (select count(*) from decompte d where d.groupe = 'sans_point') as modeles_actifs_sans_point,
       (select count(*) from decompte d where d.groupe = 'hors_decompte') as modeles_hors_decompte,
       (select count(*) from comptes k where k.trouves <> k.points) as corrections_au_mauvais_compte,
       (select count(*) from comptes k where not k.liste_exacte) + (select count(*) from deja_listes g where not g.liste_exacte) as listes_fausses,
       (select count(*) from pts p join corr c on ${aModifier("aller", "c", "p")} and not c.liste
          join places pl on pl.zone = c.zone and pl.libelle = c.nouveau and pl.id = p.id) as points_sans_liste_sur_modele_liste,
       (select count(*) from pts p where exists (select 1 from corr c where c.zone = p.zone and c.nouveau = p.libelle)
          and not exists (select 1 from deja d where d.zone = p.zone and d.libelle = p.libelle and d.id = p.id)) as nouveaux_deja_portes_hors_deja_la,
       (select count(*) from simule s where s.apres_retour::text is distinct from s.origine::text) as aller_retour_modeles_differents,
       (select count(*) from simule s where s.apres_aller::text is distinct from s.origine::text) as aller_modeles_modifies,
       (select count(distinct d.id) from (select e.id from el e where e.libelle is not null group by e.id, e.libelle having count(*) > 1) d) as modeles_libelle_en_double_avant,
       (select count(distinct d.id) from (select a.id from aller a where a.libelle is not null group by a.id, a.libelle having count(*) > 1) d) as modeles_libelle_en_double_apres_aller,
       (select count(*) from (select p.id from pts p group by p.id, p.zone having count(*) > 1) d) as modeles_zone_en_double,
       (select count(*) from pts p where p.zone in (${quatreZones.map(q).join(", ")})
          and not exists (select 1 from corr c where c.zone = p.zone and p.libelle in (c.ancien, c.nouveau))) as points_des_4_zones_hors_table,
       (select count(*) from pts p join corr c on ${aModifier("aller", "c", "p")}
          join public.models m on m.id = p.id where not m.is_active) as points_corriges_sur_modeles_inactifs,
       (select count(*) from el e where ${HORS_TABLE("corr", "e.point").replace(/\n\s+/g, " ")}) as anciens_libelles_hors_table,
       (select count(*) from el e where e.zone is null) as elements_mal_formes,
       (select count(*) from public.models m where jsonb_typeof(m.authentication_points) is distinct from 'array') as tableaux_mal_formes,
       (select case when e.au_depart then 'PRÊT' when e.applique then 'DÉJÀ APPLIQUÉ'
                    else format('ÉCARTS avec l''état de départ (%s libellé(s) sur %s) : %s', e.nb_depart, e.suivis, e.ecarts_depart) end from etat e) as verdict_etape_1,
       ${EMPREINTES.replace(/\n\s+/g, "\n       ")},
       ${EMPREINTE_SUIVIS("pts", "attendu").replace(/\n\s+/g, " ")} as empreinte_points_suivis,
       (select md5(string_agg(s.id::text || md5(s.apres_aller::text), ',' order by s.id)) from simule s) as empreinte_libelles_prevue_apres_aller,
       ${EMPREINTE_SUIVIS("(select a.id, a.zone, a.libelle from aller a where a.zone is not null)", "attendu").replace(/\n\s+/g, " ")} as empreinte_points_suivis_prevue_apres_aller;
`;
}

// ── Écriture ────────────────────────────────────────────────────────────────
const barre = (t) => `-- ═══ ${t} ${"═".repeat(Math.max(3, 74 - t.length))}`;
const fichier = (entete, sens, t1, t2, t3) =>
  [entete, "", "", barre(t1), apercu(sens, false), "", "", barre(t2), bloc(sens), "", "", barre(t3), apercu(sens, true), ""].join("\n");

const F_ALLER = `${SORTIE}/${F_ALLER_NOM}`, F_RETOUR = `${SORTIE}/${F_RETOUR_NOM}`;
const TEXTE_ALLER = fichier(enteteAller, "aller", "ÉTAPE 1 — APERÇU AVANT (lecture seule)", "ÉTAPE 2 — MODIFICATION (un seul bloc atomique)", "ÉTAPE 3 — APERÇU APRÈS (lecture seule)");
const TEXTE_RETOUR = fichier(enteteRetour, "retour", "ÉTAPE 1 — APERÇU AVANT LE RETOUR (lecture seule)", "ÉTAPE 2 — RETOUR (un seul bloc atomique)", "ÉTAPE 3 — APERÇU APRÈS LE RETOUR (lecture seule)");
const TEXTE_CONTROLE = controle();
// Derniers garde-fous, sur le texte complet, avant d'écrire quoi que ce soit.
for (const [nom, texte] of [["aller", TEXTE_ALLER], ["retour", TEXTE_RETOUR], ["contrôle", TEXTE_CONTROLE]]) {
  // Les débuts de verdict que « EN BREF » cite sont bien ceux que les aperçus écrivent.
  if (nom !== "contrôle") for (const debut of Object.values(DEBUTS[nom])) {
    const sql = debut.replace(/'/g, "''").replace(new RegExp(String(TOTAL), "g"), "%s");
    if (!texte.includes(`'${sql}`)) echec(`${nom} : le début de verdict « ${debut} », cité par « EN BREF », n'est pas celui que l'aperçu écrit`);
  }
  // Rien n'a remplacé une valeur manquante par un mot de JavaScript.
  if (/\bundefined\b|\bNaN\b|\[object /.test(texte)) echec(`${nom} : une valeur manque dans le texte généré`);
}
writeFileSync(F_ALLER, TEXTE_ALLER);
writeFileSync(F_RETOUR, TEXTE_RETOUR);
writeFileSync(FICHIER_CONTROLE, TEXTE_CONTROLE);
console.log(`table : ${FICHIER_CORRECTIONS}${VARIANTE ? " (VARIANTE)" : ""} ; relevé : ${FICHIER_RELEVE ?? `celui du ${RELEVE.date}, inscrit dans le générateur`}`);
console.log(`${NB} corrections, ${TOTAL} points, ${SUIVIS} libellés suivis ; ${AVEC_LISTE.length} corrections à liste (${NB_IDS} identifiants), ${NB_DEJA} « déjà là » ; ${FUSIONS.length} fusions ; empreinte des listes ${EMPREINTE_LISTES}`);
console.log("écrits :", F_ALLER, F_RETOUR, FICHIER_CONTROLE);
