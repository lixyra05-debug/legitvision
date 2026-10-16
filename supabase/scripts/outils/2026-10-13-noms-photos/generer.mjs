// Écrit en entier les trois requêtes des noms de photos et le contrôle de production :
//   supabase/scripts/2026-10-13-noms-photos-etat.sql    (lecture seule : verdict et empreintes)
//   supabase/scripts/2026-10-13-noms-photos-aller.sql   (l'écriture : un seul bloc, tout ou rien)
//   supabase/scripts/2026-10-13-noms-photos-retour.sql  (le retour arrière : un seul bloc, tout ou rien)
//   controle-prod.sql                                    (lecture seule : aller et retour simulés)
//   attendus.json                                        (comptes et empreintes prévus, pour la feuille d'exécution)
// à partir de corrections.json (la table validée par Hector le 2026-10-13, qui fait foi) et de
// releve-2026-10-13.json (public.brands relevé en lecture seule ce jour-là).
//
// Lancer :  node generer.mjs            (réécrit les fichiers du dépôt, à l'octet près)
//           LV_SORTIE=dossier node generer.mjs   (écrit ailleurs)
// Ne jamais retoucher un fichier SQL à la main : changer la table, puis relancer.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SORTIE = process.env.LV_SORTIE ? resolve(process.env.LV_SORTIE) : null;
const DATE_RELEVE = "2026-10-13";
const NOM = "2026-10-13-noms-photos";

const corrections = JSON.parse(readFileSync(`${ICI}/corrections.json`, "utf8"));
const releve = JSON.parse(readFileSync(`${ICI}/releve-${DATE_RELEVE}.json`, "utf8"));

// ── Ce que PostgreSQL écrit pour un jsonb, refait ici pour prévoir les empreintes ──────────────

/** Ordre des clés d'un objet jsonb : la plus courte d'abord, puis l'ordre des octets. */
const ordreJsonb = (a, b) => Buffer.byteLength(a) - Buffer.byteLength(b) || Buffer.compare(Buffer.from(a), Buffer.from(b));

/** Le texte d'un jsonb (jsonb::text) : « {"cle": valeur, …} », « [a, b] ». */
function texteJsonb(v) {
  if (Array.isArray(v)) return `[${v.map(texteJsonb).join(", ")}]`;
  if (v !== null && typeof v === "object") {
    return `{${Object.keys(v).sort(ordreJsonb).map((k) => `${JSON.stringify(k)}: ${texteJsonb(v[k])}`).join(", ")}}`;
  }
  return JSON.stringify(v);
}

const md5 = (texte) => createHash("md5").update(texte, "utf8").digest("hex");

/** Empreinte des noms : toutes les lignes, dans l'ordre des identifiants, « id=protocole ». */
const empreinteNoms = (lignes) =>
  md5([...lignes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((b) => `${b.id}=${texteJsonb(b.photo_protocol)}`).join("\n"));

// ── Contrôles de la table et du relevé ─────────────────────────────────────────────────────────

const refus = (message) => { console.error(`REFUS : ${message}`); process.exit(1); };

const cle = (nom, libelle) => `${nom}\u0000${libelle}`;
const parAncien = new Map();
for (const [i, c] of corrections.entries()) {
  if (c.n !== i + 1) refus(`correction ${i + 1} numérotée ${c.n}`);
  for (const champ of ["nom", "ancien", "nouveau"]) {
    const v = c[champ];
    if (typeof v !== "string" || v === "" || v !== v.trim() || v !== v.normalize("NFC")) refus(`correction ${c.n} : « ${champ} » vide, entouré d'espaces ou non normalisé`);
    // Ni guillemet, ni barre oblique inversée, ni dollar, ni caractère de contrôle : le texte entre tel quel dans du JSON, puis dans une chaîne SQL entre dollars.
    if (/["\\$\u0000-\u001f\u007f]/.test(v)) refus(`correction ${c.n} : caractère interdit dans « ${v} »`);
    if (/[^\S ]|[\u00a0\u1680\u2000-\u200f\u2028-\u202f\u205f\u2060\u3000\ufeff]/.test(v)) refus(`correction ${c.n} : espace insécable ou invisible dans « ${v} »`);
  }
  if (c.ancien === c.nouveau) refus(`correction ${c.n} : ancien et nouveau identiques`);
  if (parAncien.has(cle(c.nom, c.ancien))) refus(`correction ${c.n} : (${c.nom}, ${c.ancien}) en double`);
  parAncien.set(cle(c.nom, c.ancien), c);
}
// Une correction ne doit pas en nourrir une autre : aucun nouveau libellé n'est l'ancien d'une correction du même emplacement.
for (const c of corrections) if (parAncien.has(cle(c.nom, c.nouveau))) refus(`correction ${c.n} : son nouveau libellé est l'ancien d'une autre`);

if (!Array.isArray(releve) || releve.length === 0) refus("relevé vide");
const ids = new Set();
for (const b of releve) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(b.id)) refus(`identifiant inattendu : ${b.id}`);
  if (ids.has(b.id)) refus(`ligne en double : ${b.id}`);
  ids.add(b.id);
  if (!Array.isArray(b.photo_protocol)) refus(`${b.id} : protocole qui n'est pas une liste`);
  const noms = new Set();
  for (const e of b.photo_protocol) {
    if (e === null || typeof e !== "object" || Array.isArray(e) || typeof e.name !== "string" || typeof e.label !== "string") refus(`${b.id} : emplacement sans nom ou sans libellé`);
    if (noms.has(e.name)) refus(`${b.id} : deux emplacements « ${e.name} »`);
    noms.add(e.name);
    if (/[$\u0000-\u001f\u007f]/.test(e.label) || /[$\u0000-\u001f\u007f]/.test(e.name)) refus(`${b.id} : caractère interdit dans « ${e.label} »`);
  }
}

// ── L'aller, calculé ici ───────────────────────────────────────────────────────────────────────

const comptes = new Map(corrections.map((c) => [c.n, 0]));
const retours = []; // un par emplacement corrigé : de quoi défaire l'aller au caractère près
const apres = releve.map((b) => ({
  ...b,
  photo_protocol: b.photo_protocol.map((e, i) => {
    const c = parAncien.get(cle(e.name, e.label));
    if (!c) return e;
    comptes.set(c.n, comptes.get(c.n) + 1);
    retours.push({ id: b.id, pos: i + 1, nom: e.name, ancien: e.label, nouveau: c.nouveau });
    return { ...e, label: c.nouveau };
  }),
}));
for (const c of corrections) {
  if (comptes.get(c.n) !== c.emplacements) refus(`correction ${c.n} : ${comptes.get(c.n)} emplacements au relevé, ${c.emplacements} dans la table`);
}
retours.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : a.pos - b.pos));
const lignesTouchees = new Set(retours.map((r) => r.id));
for (const b of apres) {
  const libelles = b.photo_protocol.map((e) => e.label);
  if (new Set(libelles).size !== libelles.length) refus(`${b.id} (${b.name}, ${b.category}) : deux photos du même nom après l'aller`);
}
// Le retour, rejoué ici, doit redonner le relevé.
const revenu = apres.map((b) => ({
  ...b,
  photo_protocol: b.photo_protocol.map((e, i) => {
    const r = retours.find((x) => x.id === b.id && x.pos === i + 1);
    if (!r) return e;
    if (r.nom !== e.name || r.nouveau !== e.label) refus(`${b.id} : retour incohérent à la position ${i + 1}`);
    return { ...e, label: r.ancien };
  }),
}));

const TOTAL = retours.length;
const LIGNES = lignesTouchees.size;
const NB_LIGNES = releve.length;
const NB_EMPLACEMENTS = releve.reduce((s, b) => s + b.photo_protocol.length, 0);
const AVANT = empreinteNoms(releve);
const APRES = empreinteNoms(apres);
if (empreinteNoms(revenu) !== AVANT) refus("le retour rejoué ne redonne pas le relevé");
if (AVANT === APRES) refus("l'aller ne change rien");
// Empreinte des autres colonnes, telle que les requêtes la calculent : la ligne sans son protocole, la date en UTC à la microseconde.
const dateUtc = (iso) => {
  const m = /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.(\d{1,6}))?\+00:00$/.exec(iso);
  if (!m) refus(`date inattendue dans le relevé : ${iso}`);
  return `${m[1]}.${(m[2] ?? "").padEnd(6, "0")}`;
};
const AUTRES = md5(
  [...releve]
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map(({ photo_protocol, created_at, ...reste }) => texteJsonb({ ...reste, created_at: dateUtc(created_at) }))
    .join("\n"),
);
// Empreinte de la liste du retour : le contrôle de production la recalcule depuis la base, sans la recevoir.
const LISTE_RETOUR = md5(retours.map((r) => `${r.id}|${r.pos}|${r.nom}|${r.ancien}|${r.nouveau}`).join("\n"));

// ── Morceaux de SQL partagés ───────────────────────────────────────────────────────────────────

/** Une chaîne SQL entre dollars : rien à doubler, et le contrôle ci-dessus garantit qu'aucun texte ne porte de dollar. */
const entreDollars = (texte, balise) => `$${balise}$${texte}$${balise}$`;

const jsonCorrections = `[\n${corrections
  .map((c) => `  ${JSON.stringify({ n: c.n, nom: c.nom, ancien: c.ancien, nouveau: c.nouveau, emplacements: c.emplacements })}`)
  .join(",\n")}\n]`;
const jsonRetours = `[\n${retours.map((r) => `  ${JSON.stringify(r)}`).join(",\n")}\n]`;

const sqlEmpreinteNoms = (alias = "b") =>
  `md5(coalesce(string_agg(${alias}.id::text || '=' || ${alias}.photo_protocol::text, E'\\n' order by ${alias}.id), ''))`;
// Les autres colonnes, quelles qu'elles soient ; la date en UTC, pour ne pas dépendre du fuseau de la session.
const sqlAutres = (alias = "b") =>
  `md5(coalesce(string_agg(((to_jsonb(${alias}) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(${alias}.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\\n' order by ${alias}.id), ''))`;

const BANDEAU = "-- ============================================================================";
// Dernière ligne de chaque fichier : après un collage, l'éditeur montre la fin du texte. Elle dit laquelle des trois
// requêtes est collée, et qu'elle l'est en entier.
const FIN = {
  etat: "-- FIN — noms des photos : requête d'état (lecture seule)",
  aller: "-- FIN — noms des photos : la correction (écriture)",
  retour: "-- FIN — noms des photos : le retour arrière (écriture)",
};

// ── 1. La requête d'état ───────────────────────────────────────────────────────────────────────

const etat = `${BANDEAU}
-- LegitVision — noms des photos à l'envoi : REQUÊTE D'ÉTAT (lecture seule)
-- Préparée d'après le relevé de production du ${DATE_RELEVE} (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/${NOM}/generer.mjs).
--
-- EN BREF
--   Ce fichier ne contient qu'UNE requête, qui ne fait que lire. La coller
--   seule dans l'éditeur SQL de Supabase (projet de production) et cliquer
--   « Run ». Elle se lance trois fois : avant l'aller, après l'aller, et
--   après un éventuel retour arrière.
--   La première ligne du tableau (n = 0) donne le verdict :
--   - « PRÊT : ${TOTAL} noms de photos à corriger dans ${LIGNES} lignes de marque » :
--     les photos demandées sont celles du relevé. On peut lancer la
--     correction (l'aller).
--   - « APPLIQUÉ : les ${corrections.length} corrections sont en place » : l'aller est passé.
--   - « ÉCARTS » : les photos demandées ne sont dans aucun de ces deux
--     états. Ne rien lancer, transmettre cette première ligne.
--   Juste après le verdict, deux empreintes : « empreinte_noms » (toutes les
--   photos demandées de toutes les lignes de marque : leurs noms, leur
--   ordre, leurs autres clés), celle qui fait le verdict, et
--   « empreinte_autres_colonnes » (le reste de public.brands, que ni l'aller
--   ni le retour ne changent ; elle n'entre pas dans le verdict).
--     empreinte_noms avant l'aller  : ${AVANT}
--     empreinte_noms après l'aller  : ${APRES}
--     empreinte_autres_colonnes     : ${AUTRES}
--       (au relevé du ${DATE_RELEVE}, la même avant et après)
--   Les lignes 1 à ${corrections.length} : une par correction. « a_corriger » : les photos
--   qui portent encore l'ancien nom (autant qu'« au_releve » avant l'aller,
--   0 après) ; « portent_le_nouveau » : celles qui portent déjà le nouveau
--   (d'autres lignes de marque l'avaient avant toute correction).
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   Cette requête ne peut rien abîmer : elle ne fait que lire.
--   - Erreur « relation "public.brands" does not exist » : ce n'est pas le
--     projet de LegitVision. Ouvrir le bon projet.
--   - Toute autre erreur, ou « ÉCARTS » : ne rien lancer d'autre et
--     transmettre le message ou la première ligne.
${BANDEAU}

with
corrections as (
  select c.n, c.nom, c.ancien, c.nouveau, c.emplacements
  from jsonb_to_recordset(${entreDollars(jsonCorrections, "corrections")}::jsonb)
    as c(n integer, nom text, ancien text, nouveau text, emplacements integer)
),
emplacements as (
  select b.id, t.e->>'name' as nom, t.e->>'label' as libelle
  from public.brands b
  cross join lateral jsonb_array_elements(b.photo_protocol) as t(e)
),
par_correction as (
  select c.n, c.nom, c.ancien, c.nouveau, c.emplacements as au_releve,
         (select count(*) from emplacements e where e.nom = c.nom and e.libelle = c.ancien)::integer as a_corriger,
         (select count(*) from emplacements e where e.nom = c.nom and e.libelle = c.nouveau)::integer as portent_le_nouveau
  from corrections c
),
totaux as (
  select
    (select count(*) from public.brands)::integer as lignes,
    (select count(*) from emplacements)::integer as emplacements,
    (select coalesce(sum(p.a_corriger), 0) from par_correction p)::integer as a_corriger,
    (select count(distinct e.id) from emplacements e join corrections c on c.nom = e.nom and c.ancien = e.libelle)::integer as lignes_a_corriger,
    (select ${sqlEmpreinteNoms("b")} from public.brands b) as empreinte_noms,
    (select ${sqlAutres("b")} from public.brands b) as empreinte_autres_colonnes
)
select 0 as n,
       case
         when t.empreinte_noms = '${AVANT}'
           then 'PRÊT : ' || t.a_corriger || ' noms de photos à corriger dans ' || t.lignes_a_corriger || ' lignes de marque (table : ' || t.lignes || ' lignes, ' || t.emplacements || ' photos demandées). On peut lancer la correction.'
         when t.empreinte_noms = '${APRES}'
           then 'APPLIQUÉ : les ${corrections.length} corrections sont en place (${TOTAL} noms corrigés dans ${LIGNES} lignes de marque), ' || t.a_corriger || ' nom à corriger.'
         else 'ÉCARTS : les photos demandées ne sont ni celles du relevé du ${DATE_RELEVE} ni celles de l''état corrigé (' || t.a_corriger || ' nom(s) à corriger, ${TOTAL} attendus avant la correction et 0 après, table : ' || t.lignes || ' lignes, ' || t.emplacements || ' photos demandées). Ne rien lancer : transmettre cette ligne.'
       end as resultat,
       t.empreinte_noms,
       t.empreinte_autres_colonnes,
       t.a_corriger,
       null::integer as au_releve,
       null::integer as portent_le_nouveau
from totaux t
union all
select p.n,
       p.nom || ' : « ' || p.ancien || ' » → « ' || p.nouveau || ' »',
       null,
       null,
       p.a_corriger,
       p.au_releve,
       p.portent_le_nouveau
from par_correction p
order by n;
${FIN.etat}
`;

// ── 2. L'aller ─────────────────────────────────────────────────────────────────────────────────

const aller = `${BANDEAU}
-- LegitVision — noms des photos à l'envoi : LA CORRECTION, ou « aller » (écriture)
-- Préparé d'après le relevé de production du ${DATE_RELEVE} (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/${NOM}/generer.mjs).
--
-- EN BREF
--   Ce fichier ne contient qu'UNE instruction : le bloc « do … ». Le coller
--   seul, en entier, dans l'éditeur SQL de Supabase (projet de production) et
--   cliquer « Run ».
--   AVANT : lancer la requête d'état (${NOM}-etat.sql). Sa
--   première ligne doit commencer par « PRÊT : ${TOTAL} noms de photos à corriger
--   dans ${LIGNES} lignes de marque ». Sinon, ne pas lancer ce bloc.
--   Ne rien sélectionner dans l'éditeur : avec une sélection, « Run selected »
--   ne lance que le morceau sélectionné.
--   CE BLOC n'affiche aucune ligne (« Success. No rows returned »).
--   APRÈS : relancer la requête d'état. Sa première ligne doit commencer par
--   « APPLIQUÉ : les ${corrections.length} corrections sont en place ». C'est elle, la preuve.
--   Ces noms s'affichent à l'étape d'envoi des photos et partent dans la
--   consigne envoyée à l'IA.
--
-- CE QUE FAIT CE BLOC
--   Il applique ${corrections.length} corrections aux noms des photos demandées à l'envoi
--   (public.brands.photo_protocol, clé « label ») : ${TOTAL} noms dans ${LIGNES} des
--   ${NB_LIGNES} lignes de marque. Surtout des accents manquants (« Vue arriere »),
--   du franglais (« Tags », « print », « zip »), un mot faux (« langue » pour
--   « languette »), et trois choix validés par Hector le ${DATE_RELEVE} :
--   « Étiquette de languette », « Pièces métalliques », « (gros plan) »
--   partout. Seule la clé « label » des emplacements concernés change : leur
--   ordre, leur identifiant (« name »), « required », « min_resolution », les
--   autres colonnes de public.brands et le reste de la base ne changent pas.
--   Aucun objet n'est créé.
--
-- TOUT OU RIEN
--   Le bloc vérifie d'abord que les photos demandées de toutes les lignes de
--   marque sont exactement celles du relevé (empreinte des noms
--   ${AVANT}). Il écrit, puis vérifie que le résultat
--   est exactement l'état prévu (empreinte ${APRES}),
--   que ${LIGNES} lignes ont été écrites et que les autres colonnes n'ont pas
--   bougé pendant son écriture. Au moindre écart, avant ou après l'écriture,
--   une erreur annule TOUT : rien n'est écrit. Relancé sur une table déjà
--   corrigée, il n'écrit rien. Une autre colonne changée depuis le relevé (une
--   marque désactivée, un logo ajouté) ne l'arrête pas : seuls les noms et
--   les protocoles comptent.
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   - Erreur « syntax error » ou « unterminated dollar-quoted string » : le
--     bloc a été collé incomplet. Rien n'a été lancé ; le recoller en entier.
--   - Erreur « canceling statement due to lock timeout » : la table était
--     occupée. Rien n'est écrit ; relancer le bloc.
--   - Erreur qui contient « NOMS DES PHOTOS » : le bloc a refusé, rien n'est
--     écrit ; ne pas relancer, transmettre le message.
--   - Un tableau au lieu de « Success » : la requête contenait autre chose
--     que ce bloc (la requête d'état, par exemple). Le bloc est peut-être
--     parti quand même, après le calcul du tableau. Ne rien relancer : la
--     requête d'état, lancée seule, dit ce qui est en place.
--   - Une fenêtre de confirmation de Supabase (« Potential issue
--     detected ») : annuler, vider l'éditeur, recoller le bloc seul.
--   - Toute autre erreur (« permission denied », « read-only transaction »,
--     délai dépassé) : un bloc qui échoue n'écrit rien. Ne pas relancer :
--     lancer la requête d'état, puis transmettre le message et sa première
--     ligne.
--   Retour arrière : ${NOM}-retour.sql.
${BANDEAU}

do $bloc$
declare
  v_avant constant text := '${AVANT}';
  v_apres constant text := '${APRES}';
  v_corrections constant jsonb := ${entreDollars(jsonCorrections, "corrections")}::jsonb;
  v_actuelle text;
  v_autres_avant text;
  v_autres_apres text;
  v_lignes integer;
begin
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans la table entre le contrôle et l'écriture ; les lectures du site continuent.
  lock table public.brands in share row exclusive mode;

  v_actuelle := (select ${sqlEmpreinteNoms("b")} from public.brands b);
  if v_actuelle = v_apres then
    raise notice 'NOMS DES PHOTOS : déjà appliqué, rien n''est écrit.';
    return;
  end if;
  if v_actuelle is distinct from v_avant then
    raise exception 'NOMS DES PHOTOS : les photos demandées de public.brands ne sont plus celles du relevé du ${DATE_RELEVE} (empreinte %, attendue %). Rien n''est écrit. Ne pas relancer : transmettre ce message.', v_actuelle, v_avant;
  end if;
  v_autres_avant := (select ${sqlAutres("b")} from public.brands b);

  with corrections as (
    select c.nom, c.ancien, c.nouveau
    from jsonb_to_recordset(v_corrections) as c(nom text, ancien text, nouveau text)
  ),
  corriges as (
    select b.id,
           jsonb_agg(case when c.nouveau is null then t.e else jsonb_set(t.e, '{label}', to_jsonb(c.nouveau)) end order by t.ord) as protocole
    from public.brands b
    cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
    left join corrections c on c.nom = t.e->>'name' and c.ancien = t.e->>'label'
    group by b.id
    having count(c.nouveau) > 0
  )
  update public.brands b
     set photo_protocol = k.protocole
    from corriges k
   where b.id = k.id;
  get diagnostics v_lignes = row_count;

  if v_lignes <> ${LIGNES} then
    raise exception 'NOMS DES PHOTOS : % lignes écrites, ${LIGNES} attendues. Tout est annulé, rien n''est écrit. Transmettre ce message.', v_lignes;
  end if;
  v_actuelle := (select ${sqlEmpreinteNoms("b")} from public.brands b);
  if v_actuelle is distinct from v_apres then
    raise exception 'NOMS DES PHOTOS : le résultat n''est pas l''état prévu (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_actuelle, v_apres;
  end if;
  v_autres_apres := (select ${sqlAutres("b")} from public.brands b);
  if v_autres_apres is distinct from v_autres_avant then
    raise exception 'NOMS DES PHOTOS : une autre colonne de public.brands a changé pendant l''écriture (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_autres_apres, v_autres_avant;
  end if;
  raise notice 'NOMS DES PHOTOS : ${TOTAL} noms corrigés dans ${LIGNES} lignes de marque.';
end
$bloc$;
${FIN.aller}
`;

// ── 3. Le retour arrière ───────────────────────────────────────────────────────────────────────

const retour = `${BANDEAU}
-- LegitVision — noms des photos à l'envoi : LE RETOUR ARRIÈRE (écriture)
-- Préparé d'après le relevé de production du ${DATE_RELEVE} (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/${NOM}/generer.mjs).
--
-- EN BREF
--   À ne lancer que pour défaire l'aller (${NOM}-aller.sql).
--   Ce fichier ne contient qu'UNE instruction : le bloc « do … ». Le coller
--   seul, en entier, dans l'éditeur SQL de Supabase (projet de production) et
--   cliquer « Run ».
--   AVANT : lancer la requête d'état (${NOM}-etat.sql). Sa
--   première ligne doit commencer par « APPLIQUÉ ». Sinon, ne pas lancer ce
--   bloc. Ne rien sélectionner dans l'éditeur : avec une sélection, « Run
--   selected » ne lance que le morceau sélectionné.
--   CE BLOC n'affiche aucune ligne (« Success. No rows returned »).
--   APRÈS : relancer la requête d'état. Sa première ligne doit de nouveau
--   commencer par « PRÊT : ${TOTAL} noms de photos à corriger dans ${LIGNES} lignes de
--   marque », et son empreinte des noms doit être celle d'avant l'aller :
--   ${AVANT}.
--   À n'utiliser que pour annuler la correction : ces noms s'affichent à
--   l'étape d'envoi des photos et partent dans la consigne envoyée à l'IA.
--
-- CE QUE FAIT CE BLOC
--   Il remet, emplacement par emplacement, les ${TOTAL} anciens noms relevés le
--   ${DATE_RELEVE} dans les ${LIGNES} lignes de marque que l'aller a corrigées
--   (plusieurs anciens noms ont reçu le même nouveau : la liste dit lequel
--   revient où). Seule la clé « label » change.
--
-- TOUT OU RIEN
--   Le bloc vérifie d'abord que les photos demandées de toutes les lignes de
--   marque sont exactement celles laissées par l'aller (empreinte des noms
--   ${APRES}). Il écrit, puis vérifie que le résultat
--   est exactement l'état du relevé (empreinte
--   ${AVANT}), que ${LIGNES} lignes ont été écrites et que
--   les autres colonnes n'ont pas bougé pendant son écriture. Au moindre
--   écart, une erreur annule TOUT : rien n'est écrit. Relancé sur une table
--   déjà revenue, il n'écrit rien.
--   Si une photo demandée a changé depuis l'aller (une ligne de marque
--   ajoutée, un protocole retouché), le bloc refuse : un retour adapté se
--   prépare alors comme un script neuf.
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   - Erreur « syntax error » ou « unterminated dollar-quoted string » : le
--     bloc a été collé incomplet. Rien n'a été lancé ; le recoller en entier.
--   - Erreur « canceling statement due to lock timeout » : la table était
--     occupée. Rien n'est écrit ; relancer le bloc.
--   - Erreur qui contient « NOMS DES PHOTOS » : le bloc a refusé, rien n'est
--     écrit ; ne pas relancer, transmettre le message.
--   - Un tableau au lieu de « Success » : la requête contenait autre chose
--     que ce bloc (la requête d'état, par exemple). Le bloc est peut-être
--     parti quand même, après le calcul du tableau. Ne rien relancer : la
--     requête d'état, lancée seule, dit ce qui est en place.
--   - Une fenêtre de confirmation de Supabase (« Potential issue
--     detected ») : annuler, vider l'éditeur, recoller le bloc seul.
--   - Toute autre erreur (« permission denied », « read-only transaction »,
--     délai dépassé) : un bloc qui échoue n'écrit rien. Ne pas relancer :
--     lancer la requête d'état, puis transmettre le message et sa première
--     ligne.
${BANDEAU}

do $bloc$
declare
  v_avant constant text := '${AVANT}';
  v_apres constant text := '${APRES}';
  -- Un élément par emplacement corrigé : la ligne de marque, la position de la photo, son identifiant, l'ancien nom à remettre, le nouveau qu'il porte.
  v_retours constant jsonb := ${entreDollars(jsonRetours, "retours")}::jsonb;
  v_actuelle text;
  v_autres_avant text;
  v_autres_apres text;
  v_lignes integer;
begin
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans la table entre le contrôle et l'écriture ; les lectures du site continuent.
  lock table public.brands in share row exclusive mode;

  v_actuelle := (select ${sqlEmpreinteNoms("b")} from public.brands b);
  if v_actuelle = v_avant then
    raise notice 'NOMS DES PHOTOS : déjà revenu à l''état du relevé, rien n''est écrit.';
    return;
  end if;
  if v_actuelle is distinct from v_apres then
    raise exception 'NOMS DES PHOTOS : les photos demandées de public.brands ne sont pas celles laissées par l''aller (empreinte %, attendue %). Rien n''est écrit. Ne pas relancer : transmettre ce message.', v_actuelle, v_apres;
  end if;
  v_autres_avant := (select ${sqlAutres("b")} from public.brands b);

  with retours as (
    select r.id, r.pos, r.nom, r.ancien, r.nouveau
    from jsonb_to_recordset(v_retours) as r(id uuid, pos integer, nom text, ancien text, nouveau text)
  ),
  retablis as (
    select b.id,
           jsonb_agg(case when r.ancien is null then t.e else jsonb_set(t.e, '{label}', to_jsonb(r.ancien)) end order by t.ord) as protocole
    from public.brands b
    cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
    left join retours r on r.id = b.id and r.pos = t.ord and r.nom = t.e->>'name' and r.nouveau = t.e->>'label'
    group by b.id
    having count(r.ancien) > 0
  )
  update public.brands b
     set photo_protocol = k.protocole
    from retablis k
   where b.id = k.id;
  get diagnostics v_lignes = row_count;

  if v_lignes <> ${LIGNES} then
    raise exception 'NOMS DES PHOTOS : % lignes écrites, ${LIGNES} attendues. Tout est annulé, rien n''est écrit. Transmettre ce message.', v_lignes;
  end if;
  v_actuelle := (select ${sqlEmpreinteNoms("b")} from public.brands b);
  if v_actuelle is distinct from v_avant then
    raise exception 'NOMS DES PHOTOS : le résultat n''est pas l''état du relevé (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_actuelle, v_avant;
  end if;
  v_autres_apres := (select ${sqlAutres("b")} from public.brands b);
  if v_autres_apres is distinct from v_autres_avant then
    raise exception 'NOMS DES PHOTOS : une autre colonne de public.brands a changé pendant l''écriture (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_autres_apres, v_autres_avant;
  end if;
  raise notice 'NOMS DES PHOTOS : ${TOTAL} anciens noms remis dans ${LIGNES} lignes de marque.';
end
$bloc$;
${FIN.retour}
`;

// ── 4. Le contrôle de production (lecture seule) ───────────────────────────────────────────────

const controle = `${BANDEAU}
-- LegitVision — noms des photos : CONTRÔLE DE PRODUCTION (lecture seule)
-- Fichier généré (outils/${NOM}/generer.mjs). Une seule requête, qui ne fait
-- que lire : elle rejoue l'aller « à blanc », sans rien écrire, et compare aux
-- empreintes prévues par le générateur. Elle recalcule aussi, depuis la base,
-- la liste que le retour arrière porte (ligne de marque, position, ancien nom)
-- et compare son empreinte à celle de la liste écrite dans le script.
-- Attendu avant l'aller : les quatre colonnes « …_conforme » à true,
-- corrections_au_mauvais_compte et doublons_apres à 0.
${BANDEAU}

with
corrections as (
  select c.n, c.nom, c.ancien, c.nouveau, c.emplacements
  from jsonb_to_recordset(${entreDollars(jsonCorrections, "corrections")}::jsonb)
    as c(n integer, nom text, ancien text, nouveau text, emplacements integer)
),
emplacements as (
  select b.id, t.ord as pos, t.e, t.e->>'name' as nom, t.e->>'label' as libelle
  from public.brands b
  cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
),
a_corriger as (
  select e.id, e.pos, c.n, c.nom, c.ancien, c.nouveau
  from emplacements e
  join corrections c on c.nom = e.nom and c.ancien = e.libelle
),
apres as (
  select e.id,
         jsonb_agg(case when k.nouveau is null then e.e else jsonb_set(e.e, '{label}', to_jsonb(k.nouveau)) end order by e.pos) as photo_protocol
  from emplacements e
  left join a_corriger k on k.id = e.id and k.pos = e.pos
  group by e.id
),
comptes as (
  select c.n, c.emplacements, (select count(*) from a_corriger k where k.n = c.n)::integer as trouves
  from corrections c
)
select
  to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as controle_le,
  (select count(*) from public.brands)::integer as lignes,
  (select count(*) from emplacements)::integer as emplacements,
  (select count(*) from a_corriger)::integer as a_corriger,
  (select count(distinct k.id) from a_corriger k)::integer as lignes_a_corriger,
  (select count(*) from comptes k where k.trouves <> k.emplacements)::integer as corrections_au_mauvais_compte,
  (select count(*) from (select a.id, t.e->>'label' from apres a cross join lateral jsonb_array_elements(a.photo_protocol) as t(e) group by 1, 2 having count(*) > 1) d)::integer as doublons_apres,
  (select count(*) from (select e.id, e.nom from emplacements e group by 1, 2 having count(*) > 1) d)::integer as identifiants_en_double,
  (select ${sqlEmpreinteNoms("b")} from public.brands b) as empreinte_noms,
  (select ${sqlEmpreinteNoms("a")} from apres a) as empreinte_apres_simulee,
  (select ${sqlAutres("b")} from public.brands b) as empreinte_autres_colonnes,
  (select ${sqlEmpreinteNoms("b")} from public.brands b) = '${AVANT}' as avant_conforme,
  (select ${sqlEmpreinteNoms("a")} from apres a) = '${APRES}' as apres_simule_conforme,
  (select md5(coalesce(string_agg(k.id::text || '|' || k.pos || '|' || k.nom || '|' || k.ancien || '|' || k.nouveau, E'\\n' order by k.id, k.pos), '')) from a_corriger k) = '${LISTE_RETOUR}' as liste_du_retour_conforme,
  (select count(*) from apres a) = (select count(*) from public.brands) as toutes_les_lignes_simulees_conforme;
`;

// ── Écriture ───────────────────────────────────────────────────────────────────────────────────

const attendus = {
  releve_le: DATE_RELEVE,
  corrections: corrections.length,
  noms_a_corriger: TOTAL,
  lignes_a_corriger: LIGNES,
  lignes: NB_LIGNES,
  emplacements: NB_EMPLACEMENTS,
  empreinte_noms_avant: AVANT,
  empreinte_noms_apres: APRES,
  empreinte_autres_colonnes: AUTRES,
  empreinte_liste_du_retour: LISTE_RETOUR,
  verdict_avant: `PRÊT : ${TOTAL} noms de photos à corriger dans ${LIGNES} lignes de marque`,
  verdict_apres: `APPLIQUÉ : les ${corrections.length} corrections sont en place`,
};

const depot = SORTIE ?? resolve(ICI, "../..");
const outils = SORTIE ?? ICI;
mkdirSync(depot, { recursive: true });
const fichiers = [
  [`${depot}/${NOM}-etat.sql`, etat],
  [`${depot}/${NOM}-aller.sql`, aller],
  [`${depot}/${NOM}-retour.sql`, retour],
  [`${outils}/controle-prod.sql`, controle],
  [`${outils}/attendus.json`, `${JSON.stringify(attendus, null, 2)}\n`],
];
for (const [chemin, contenu] of fichiers) {
  // Un fichier, une instruction : jamais de second point-virgule de fin d'instruction hors du bloc.
  writeFileSync(chemin, contenu, "utf8");
}
console.log(`${corrections.length} corrections, ${TOTAL} noms dans ${LIGNES} lignes de marque (table : ${NB_LIGNES} lignes, ${NB_EMPLACEMENTS} photos demandées).`);
console.log(`empreinte des noms avant : ${AVANT}`);
console.log(`empreinte des noms après : ${APRES}`);
console.log(`empreinte des autres colonnes (inchangée par l'aller comme par le retour) : ${AUTRES}`);
for (const [chemin, contenu] of fichiers) console.log(`écrit : ${chemin} (${Buffer.byteLength(contenu)} octets)`);
