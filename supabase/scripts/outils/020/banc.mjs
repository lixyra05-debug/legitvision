// Banc d'essai de la migration 020, sur une base locale (PGlite 0.3.x) : JAMAIS en production.
//
//   LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc.mjs
//   BANC_MAJ=oui … : écrit dans supabase/scripts/020_etat.sql les valeurs attendues qu'il mesure.
//
// Il rejoue les migrations 001 à 019 sur le socle de socle-supabase.sql, vérifie que l'état
// obtenu est celui de la production (supabase/checks/etat_base.attendu.tsv, schémas public et
// private), puis éprouve, chacun sur une base neuve :
//   la requête d'état avant, après, et après le retour arrière, sous trois réglages de l'éditeur ;
//   la migration (les 60 lignes de son contrôle interne), rejouée une seconde fois ;
//   le contrôle d'après (supabase/checks/020_controle.sql) ;
//   le retour arrière, puis la migration de nouveau ;
//   les refus : paiement crédité deux fois, migration plus récente, retour avec une offre au registre ;
//   la migration coupée à chaque instruction : rien n'est appliqué.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const P = process.env.LV_PGLITE;
if (!P) throw new Error("LV_PGLITE : chemin de @electric-sql/pglite/dist/index.js");
const { PGlite } = await import(P);
const { uuid_ossp } = await import(P.replace(/index\.js$/, "contrib/uuid_ossp.js"));
const { pgcrypto } = await import(P.replace(/index\.js$/, "contrib/pgcrypto.js"));

const DEPOT = new URL("../../../../", import.meta.url).pathname;
const lire = (chemin) => readFileSync(join(DEPOT, chemin), "utf8");
const SOCLE = readFileSync(new URL("socle-supabase.sql", import.meta.url), "utf8");
const MIGRATIONS = readdirSync(join(DEPOT, "supabase/migrations")).filter((f) => /^0(0\d|1\d)_.*\.sql$/.test(f)).sort();
const M020 = lire("supabase/migrations/020_offre_premier_achat_et_cout_ia.sql");
const RETOUR = lire("supabase/scripts/020_retour.sql");
const CONTROLE = lire("supabase/checks/020_controle.sql");
const ETAT_BASE = lire("supabase/checks/etat_base.sql");
const FICHIER_ETAT = join(DEPOT, "supabase/scripts/020_etat.sql");
let ETAT = readFileSync(FICHIER_ETAT, "utf8");

let controles = 0;
let echecs = 0;
function verifie(intitule, condition, detail = "") {
  controles++;
  if (!condition) echecs++;
  console.log(`${condition ? "ok   " : "ÉCHEC"} ${intitule}${!condition && detail ? ` : ${detail}` : ""}`);
}

/** Une base neuve : socle, migrations 001 à 019, et quelques données qui ressemblent à la production. */
async function baseNeuve() {
  const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
  await db.exec(SOCLE);
  for (const f of MIGRATIONS) {
    let sql = lire(`supabase/migrations/${f}`);
    sql = sql.replace(/create extension if not exists "moddatetime";/i, "-- moddatetime : fonction du socle");
    await db.exec(sql);
  }
  // Trois comptes, deux achats (deux paiements distincts), une analyse offerte, une analyse.
  await db.exec(`
    insert into auth.users (id, email) values
      ('00000000-0000-4000-8000-0000000000a1', 'a@essai.test'),
      ('00000000-0000-4000-8000-0000000000a2', 'b@essai.test'),
      ('00000000-0000-4000-8000-0000000000a3', 'c@essai.test');
    begin;
    set local role service_role;
    update public.profiles set credits_remaining = 1 where id = '00000000-0000-4000-8000-0000000000a1';
    update public.profiles set credits_remaining = 2 where id = '00000000-0000-4000-8000-0000000000a2';
    insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id) values
      ('00000000-0000-4000-8000-0000000000a1', 'purchase', 1, 1, 'Achat', 'pi_essai_1'),
      ('00000000-0000-4000-8000-0000000000a2', 'purchase', 1, 1, 'Achat', 'pi_essai_2'),
      ('00000000-0000-4000-8000-0000000000a2', 'bonus', 1, 2, 'Bonus', null),
      ('00000000-0000-4000-8000-0000000000a3', 'usage', -1, 0, 'Analyse', null);
    commit;`);
  return db;
}

const derniere = (resultats) => resultats.at(-1)?.rows ?? [];

/** La requête d'état, sous un réglage de search_path donné. */
async function etat(db, searchPath = `"$user", public, extensions`) {
  await db.exec(`set search_path = ${searchPath};`);
  const lignes = derniere(await db.exec(ETAT));
  await db.exec(`set search_path = "$user", public, extensions;`);
  return { verdict: String(lignes[0]?.resultat ?? ""), empreinte: String(lignes[0]?.empreinte_base ?? ""), lignes };
}
const REGLAGES = [`"$user", public, extensions`, `"$user", public`, `pg_catalog`];

/** L'état de la base (etat_base.sql), limité aux schémas public et private, sans la fonction du socle. */
async function etatBase(db) {
  const lignes = derniere(await db.exec(ETAT_BASE)).map((r) => `${r.type_}\t${r.objet}\t${r.empreinte}`);
  await db.exec(`set search_path = "$user", public, extensions;`);
  return lignes.filter(garde);
}
function garde(ligne) {
  const objet = ligne.split("\t")[1];
  return (objet.startsWith("public.") || objet.startsWith("private.")) && !objet.startsWith("public.moddatetime(");
}

/** Les écritures et les comptes qui ne doivent pas bouger quand une étape est refusée. */
async function donnees(db) {
  const r = derniere(await db.exec(`select (select count(*) from auth.users) || '/' || (select sum(credits_remaining) from public.profiles)
    || '/' || (select count(*) || ':' || sum(amount) from public.credits_transactions) || '/' || (select count(*) from private.migrations) as d`));
  return String(r[0].d);
}

async function erreur(db, sql) {
  try {
    await db.exec(sql);
    return null;
  } catch (e) {
    try { await db.exec("rollback"); } catch {}
    return String(e.message);
  }
}

// ── 1. La base rejouée est celle de la production ─────────────────────────────
{
  const db = await baseNeuve();
  const local = await etatBase(db);
  const attendu = lire("supabase/checks/etat_base.attendu.tsv").trimEnd().split("\n").filter(garde);
  const a = new Set(attendu);
  const l = new Set(local);
  const manque = attendu.filter((x) => !l.has(x));
  const enTrop = local.filter((x) => !a.has(x));
  verifie(`base rejouée (001 à 019) = production : ${attendu.length} lignes des schémas public et private identiques`,
    manque.length === 0 && enTrop.length === 0 && attendu.length > 150, `manque ${manque.length}, en trop ${enTrop.length} : ${[...manque, ...enTrop].slice(0, 3).join(" || ")}`);
  await db.close();
}

// ── 2. Les valeurs attendues de la requête d'état ─────────────────────────────
const mesure = {};
{
  const db = await baseNeuve();
  const avant = [];
  for (const reglage of REGLAGES) avant.push((await etat(db, reglage)).empreinte);
  mesure.avant = avant[0];
  verifie("empreinte d'avant : la même sous les trois réglages de l'éditeur", new Set(avant).size === 1 && /^[0-9a-f]{32}$/.test(avant[0]), avant.join(" "));
  await db.exec(M020);
  const apres = [];
  for (const reglage of REGLAGES) apres.push((await etat(db, reglage)).empreinte);
  mesure.apres = apres[0];
  verifie("empreinte d'après : la même sous les trois réglages, et différente d'avant", new Set(apres).size === 1 && apres[0] !== avant[0], apres.join(" "));
  const corps = derniere(await db.exec(`select proname, md5(prosrc) as m from pg_proc where pronamespace = 'public'::regnamespace
    and proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer') order by proname`));
  mesure.corps = Object.fromEntries(corps.map((r) => [r.proname, r.m]));
  await db.close();
}
const VALEURS = {
  EMPREINTE_AVANT: mesure.avant,
  EMPREINTE_APRES: mesure.apres,
  CORPS_CREDIT: mesure.corps.credit_single_purchase,
  CORPS_GRANT: mesure.corps.grant_first_purchase_offer,
  CORPS_WITHDRAW: mesure.corps.withdraw_first_purchase_offer,
};
{
  // Les valeurs sont écrites à la place des repères, ou des valeurs précédentes (32 caractères hexadécimaux, dans l'ordre).
  const motifs = [
    [/'(EMPREINTE_AVANT|[0-9a-f]{32})'::text as avant/, (v) => `'${v}'::text as avant`, VALEURS.EMPREINTE_AVANT],
    [/'(EMPREINTE_APRES|[0-9a-f]{32})'::text as apres/, (v) => `'${v}'::text as apres`, VALEURS.EMPREINTE_APRES],
    [/'credit_single_purchase', '(CORPS_CREDIT|[0-9a-f]{32})'/, (v) => `'credit_single_purchase', '${v}'`, VALEURS.CORPS_CREDIT],
    [/'grant_first_purchase_offer', '(CORPS_GRANT|[0-9a-f]{32})'/, (v) => `'grant_first_purchase_offer', '${v}'`, VALEURS.CORPS_GRANT],
    [/'withdraw_first_purchase_offer', '(CORPS_WITHDRAW|[0-9a-f]{32})'/, (v) => `'withdraw_first_purchase_offer', '${v}'`, VALEURS.CORPS_WITHDRAW],
  ];
  let neuf = ETAT;
  for (const [motif, ecrire, valeur] of motifs) {
    if (!motif.test(neuf)) throw new Error(`repère introuvable dans 020_etat.sql : ${motif}`);
    neuf = neuf.replace(motif, ecrire(valeur));
  }
  if (neuf !== ETAT && process.env.BANC_MAJ === "oui") {
    writeFileSync(FICHIER_ETAT, neuf);
    ETAT = neuf;
    console.log("020_etat.sql : valeurs attendues écrites");
  }
  verifie("020_etat.sql porte les valeurs mesurées par le banc (sinon : BANC_MAJ=oui)", neuf === ETAT);
  console.log(`  avant ${VALEURS.EMPREINTE_AVANT}, après ${VALEURS.EMPREINTE_APRES}`);
}

// ── 3. Le parcours : état, migration, état, contrôle, rejeu, retour, état, migration ──
{
  const db = await baseNeuve();
  for (const reglage of REGLAGES) {
    const e = await etat(db, reglage);
    verifie(`état avant (search_path ${reglage}) : PRÊT`, e.verdict.startsWith("PRÊT : ") && e.empreinte === VALEURS.EMPREINTE_AVANT, e.verdict);
  }
  const d0 = await donnees(db);
  const res = await db.exec(M020);
  const tableau = derniere(res);
  verifie("migration : le tableau de son contrôle a 60 lignes, toutes « ok »",
    tableau.length === 60 && tableau.every((r) => r.resultat === "ok"),
    tableau.filter((r) => r.resultat !== "ok").map((r) => `${r.ordre} ${r.controle} : ${r.observe}`).join(" | ") || `${tableau.length} lignes`);
  verifie("migration : les données d'avant n'ont pas bougé (comptes, soldes, journal), le registre a une ligne de plus",
    (await donnees(db)) === d0.replace(/\/(\d+)$/, (_, n) => `/${Number(n) + 1}`), `${d0} → ${await donnees(db)}`);
  for (const reglage of REGLAGES) {
    const e = await etat(db, reglage);
    verifie(`état après (search_path ${reglage}) : APPLIQUÉE`, e.verdict.startsWith("APPLIQUÉE : ") && e.empreinte === VALEURS.EMPREINTE_APRES, e.verdict);
  }
  const controle = derniere(await db.exec(CONTROLE));
  await db.exec(`set search_path = "$user", public, extensions;`);
  verifie("contrôle d'après (020_controle.sql) : chaque ligne « ok » ou « info »",
    controle.length > 20 && controle.every((r) => r.resultat === "ok" || r.resultat === "info"),
    controle.filter((r) => r.resultat !== "ok" && r.resultat !== "info").map((r) => `${r.ordre} ${r.controle} : attendu ${r.attendu}, observé ${r.observe}`).join(" | "));
  const rejeu = derniere(await db.exec(M020));
  verifie("migration rejouée : 60 lignes « ok » de nouveau, état APPLIQUÉE",
    rejeu.length === 60 && rejeu.every((r) => r.resultat === "ok") && (await etat(db)).verdict.startsWith("APPLIQUÉE : "));
  const retour = derniere(await db.exec(RETOUR));
  verifie("retour arrière : son tableau dit aucun, aucune, 19", retour.length === 3 && retour.every((r) => r.observe === r.attendu),
    JSON.stringify(retour));
  const e = await etat(db);
  verifie("état après le retour : PRÊT, empreinte d'avant au caractère près", e.verdict.startsWith("PRÊT : ") && e.empreinte === VALEURS.EMPREINTE_AVANT, e.verdict);
  verifie("retour : les données n'ont pas bougé", (await donnees(db)) === d0, `${d0} → ${await donnees(db)}`);
  const encore = derniere(await db.exec(M020));
  verifie("migration après le retour : 60 lignes « ok », état APPLIQUÉE",
    encore.length === 60 && encore.every((r) => r.resultat === "ok") && (await etat(db)).verdict.startsWith("APPLIQUÉE : "));
  // Une offre au registre : le retour refuse et ne retire rien.
  await db.exec(`begin; set local role service_role;
    select * from public.credit_single_purchase('00000000-0000-4000-8000-0000000000a3', 'pi_essai_3', false, true, 'fp_essai_3', null, 'visa', '4242', 'FR', 'Achat', 'Offerte');
    commit;`);
  const refus = await erreur(db, RETOUR);
  verifie("retour avec une offre au registre : refusé, rien de retiré",
    /registre des offres contient 1 ligne/.test(refus ?? "") && (await etat(db)).verdict.startsWith("ÉCARTS : ") === false && (await etat(db)).lignes[2].resultat.includes("6 sur 6"),
    refus ?? "accepté");
  await db.close();
}

// ── 4. Les refus de la migration ──────────────────────────────────────────────
{
  const db = await baseNeuve();
  await db.exec(`begin; set local role service_role;
    insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)
    values ('00000000-0000-4000-8000-0000000000a1', 'purchase', 1, 2, 'Achat crédité deux fois', 'pi_essai_1');
    commit;`);
  const e = await etat(db);
  verifie("état avec un paiement crédité deux fois : ÉCARTS, 1 doublon", e.verdict.startsWith("ÉCARTS : ") && e.lignes[4].resultat.includes(": 1 "), e.verdict);
  const d0 = await donnees(db);
  const refus = await erreur(db, M020);
  verifie("migration avec un paiement crédité deux fois : refusée, rien d'appliqué",
    /paiements crédités plusieurs fois/.test(refus ?? "") && (await donnees(db)) === d0 && (await etat(db)).lignes[2].resultat.includes(": 0 sur 6"), refus ?? "acceptée");
  await db.close();
}
{
  const db = await baseNeuve();
  await db.exec(`insert into private.migrations (numero, nom) values (21, 'essai_plus_recente');`);
  const refus = await erreur(db, M020);
  verifie("migration après une migration plus récente : refusée, rien d'appliqué",
    /ne se rejoue pas après une migration plus récente/.test(refus ?? "") && (await etat(db)).lignes[2].resultat.includes(": 0 sur 6"), refus ?? "acceptée");
  const e = await etat(db);
  verifie("état avec une migration plus récente : ÉCARTS", e.verdict.startsWith("ÉCARTS : "), e.verdict);
  await db.close();
}

// ── 5. La migration coupée : rien n'est appliqué ──────────────────────────────
{
  // Coupée au milieu de chaque instruction de premier niveau (et en son début) : l'instruction incomplète
  // échoue, la transaction est annulée. Coupée juste avant « commit » : la transaction reste ouverte et
  // n'est jamais validée ; la fin de la session l'annule (ici : rollback explicite).
  const db = await baseNeuve();
  const d0 = await donnees(db);
  const fin = M020.lastIndexOf("\ncommit;");
  const coupes = [];
  for (let i = M020.indexOf("\nbegin;") + 8; i < fin; i += Math.max(1, Math.floor((fin - i) / 40)) + 97) coupes.push(i);
  coupes.push(fin);
  let appliquees = 0;
  for (const c of coupes) {
    await erreur(db, M020.slice(0, c));
    try { await db.exec("rollback"); } catch {}
    const e = await etat(db);
    if (!e.verdict.startsWith("PRÊT : ") || (await donnees(db)) !== d0) appliquees++;
  }
  verifie(`migration coupée à ${coupes.length} endroits (dont juste avant « commit ») : rien d'appliqué, état PRÊT`, appliquees === 0, `${appliquees} coupe(s) ont laissé une trace`);
  await db.close();
}

// ── 6. Les fichiers ───────────────────────────────────────────────────────────
for (const [nom, texte, fin] of [
  ["020_etat.sql", ETAT, "-- FIN — migration 020 : requête d'état (lecture seule)"],
  ["020_offre_premier_achat_et_cout_ia.sql", M020, "-- FIN — migration 020 : offre de premier achat et coût IA"],
  ["020_retour.sql", RETOUR, "-- FIN — migration 020 : retour arrière"],
]) {
  verifie(`${nom} : dernière ligne « ${fin} »`, texte.trimEnd().split("\n").pop() === fin, texte.trimEnd().split("\n").pop());
}
{
  const nu = ETAT.replace(/^\s*--.*$/gm, "");
  verifie("020_etat.sql : une seule instruction, qui ne fait que lire", (nu.match(/;/g) ?? []).length === 1 && /^\s*with\b/i.test(nu)
    && !/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|lock|set|call|execute|into)\b/i.test(nu.replace(/'[^']*'/g, "''")));
}

console.log(`\n${controles} contrôles, ${echecs} échec(s).`);
process.exit(echecs ? 1 : 0);
