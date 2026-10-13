// Banc d'essai indépendant du générateur : les deux scripts SQL du dépôt, pris comme des boîtes
// noires, sur une base PGlite (PostgreSQL en mémoire, aucun réseau) peuplée d'après corrections-v2.json.
// Il ne lit pas le générateur : il ne connaît que les titres d'étape, les mots des verdicts et la
// table des corrections. L'état attendu après l'aller est calculé ici, en JavaScript (oracle).
//
// Lancer :  LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc-independant.mjs
// (PGlite 0.3.x ; « npx @electric-sql/pglite » l'installe dans le cache de npx.) Compter 1,5 Go de
// mémoire et une minute. Dernier passage : 2026-10-12, 43 contrôles, tout passe.
import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.LV_PGLITE) { console.error("LV_PGLITE manque : chemin de @electric-sql/pglite/dist/index.js"); process.exit(2); }
const { PGlite } = await import(process.env.LV_PGLITE);
const ICI = dirname(fileURLToPath(import.meta.url));

// Les scripts éprouvés : ceux de supabase/scripts/ par défaut, ou un autre dossier donné en argument.
const DEPOT = process.argv[2] ?? resolve(ICI, "../..");
const corrections = JSON.parse(readFileSync(`${ICI}/corrections-v2.json`, "utf8"));
const courts = readFileSync(`${ICI}/ids-profil-court.txt`, "utf8").trim().split("\n");
const TOTAL = corrections.reduce((s, c) => s + c.points, 0);

/** Les trois étapes d'un script, découpées sur ses titres. */
function etapes(fichier) {
  const sql = readFileSync(`${DEPOT}/${fichier}`, "utf8");
  const morceaux = sql.split(/^-- ═══ ÉTAPE \d.*$/m);
  if (morceaux.length !== 4) throw new Error(`${fichier} : ${morceaux.length - 1} étapes trouvées`);
  return { un: morceaux[1], deux: morceaux[2], trois: morceaux[3], entier: sql };
}
const aller = etapes("2026-10-06-libelles-catalogue.sql");
const retour = etapes("2026-10-06-libelles-catalogue-retour.sql");

const pt = (zone, label, weight, plus = {}) => ({ zone, label, weight, ...plus });
const SAC = [pt("stitching", "Coutures (regularite, couleur du fil, tension)", 0.15), pt("hardware", "Hardware/ferrures (gravure, poids, finition)", 0.15), pt("zipper", "Fermeture eclair (YKK/Lampo, fluidite)", 0.15), pt("interior_label", "Etiquette interieure (police, numero de serie)", 0.15), pt("leather", "Cuir/materiau (grain, odeur, souplesse)", 0.1), pt("lining", "Doublure (couleur, texture, logo)", 0.1), pt("hot_stamp", "Stamp/marquage a chaud", 0.05), pt("logo_monogram", "Logo et monogramme (alignement, symetrie)", 0.05), pt("date_code", "Code date / puce RFID", 0.05), pt("packaging", "Emballage (dust bag, boite, certificat)", 0.05)];
const VET_LONG = [pt("fabric", "Tissu (poids, texture, grain)", 0.2), pt("print_embroidery", "Print/Broderie (qualite, alignement)", 0.2), pt("neck_label", "Etiquette col (marque, taille, composition)", 0.15), pt("wash_label", "Etiquette de lavage", 0.15), pt("stitching", "Coutures et finitions", 0.1), pt("tags", "Tags et etiquettes volantes", 0.1), pt("closures", "Fermetures (zip YKK, boutons)", 0.05), pt("packaging", "Emballage et packaging", 0.05)];
const VET_COURT = [pt("fabric", "Tissu", 0.2), pt("print_embroidery", "Print/Broderie", 0.2), pt("neck_label", "Etiquette col", 0.2), pt("stitching", "Coutures", 0.15), pt("tags", "Tags", 0.1), pt("closures", "Fermetures", 0.1), pt("packaging", "Emballage", 0.05)];
const SNK_LONG = [pt("stitching", "Coutures et finitions", 0.15), pt("materials", "Materiaux (cuir, mesh, daim)", 0.15), pt("tongue_label", "Etiquette de langue (taille, code produit, pays)", 0.15), pt("sole_pattern", "Semelle (motif, texture, logo)", 0.15), pt("logo_placement", "Logo (placement, taille, symetrie)", 0.15), pt("product_code", "Code produit interieur", 0.1), pt("box_label", "Boite et emballage (etiquette, code-barres)", 0.1), pt("eyelets", "Oeillets et lacets", 0.05)];
const SNK_COURT = [pt("stitching", "Coutures", 0.2), pt("materials", "Materiaux", 0.2), pt("tongue_label", "Etiquette langue", 0.2), pt("sole_pattern", "Semelle", 0.2), pt("logo_placement", "Logo placement", 0.1), pt("product_code", "Code produit", 0.1)];
const PROFILS = [SAC, VET_LONG, VET_COURT, SNK_LONG, SNK_COURT];
const dansUnProfil = (c) => PROFILS.some((p) => p.some((x) => x.zone === c.zone && x.label === c.ancien));

function construire() {
  const modeles = [];
  const ajouter = (points, { id = randomUUID(), actif = true } = {}) => { modeles.push({ id, points, actif }); return id; };
  for (let i = 0; i < 175; i++) ajouter(SAC);
  for (let i = 0; i < 98; i++) ajouter(VET_LONG);
  courts.forEach((id, i) => ajouter(VET_COURT, { id, actif: i !== 0 })); // l'un des 28 est inactif, comme en production
  for (let i = 0; i < 84; i++) ajouter(SNK_LONG);
  for (let i = 0; i < 31; i++) ajouter(SNK_COURT);
  // Modèles faits à la main : les corrections à identifiants (hors les 28 courts, déjà posés), regroupées par modèle.
  const parModele = new Map();
  for (const c of corrections) {
    if (dansUnProfil(c)) continue;
    if (c.ids) for (const id of c.ids) parModele.set(id, [...(parModele.get(id) ?? []), c]);
    else for (let i = 0; i < c.points; i++) parModele.set(randomUUID(), [c]);
  }
  for (const [id, liste] of parModele)
    ajouter([pt("swoosh", "Forme et placement du Swoosh", 0.5), ...liste.map((c, i) => pt(c.zone, c.ancien, 0.3 / liste.length, i === 0 ? { note: "clé en plus", z: null } : {})), pt("midsole", "Forme de la midsole", 0.2)], { id });
  // Témoins qui ne doivent pas bouger.
  ajouter([pt("toe_box", "Forme de la toe box", 0.6), pt("stitching", "Coutures (régularité, couleur)", 0.4)]);
  ajouter([]);
  ajouter([{ zone: "stitching", weight: 1 }, { label: "Tags", weight: 0.5 }, pt("tags", null, 0.5), "texte", 12, null, { zone: 3, label: "Semelle" }]); // points mal formés
  ajouter({ zone: "tags", label: "Tags" }); // pas un tableau
  ajouter([pt("hardware", "Tags", 0.5), pt("tags", "Hardware/ferrures (gravure, poids, finition)", 0.5), pt("tongue_tag", "Semelle", 0.1)]); // bons libellés, mauvaise zone
  ajouter([pt("stitching", "Coutures", 0.15), pt("eyelets", "Œillets et lacets déjà corrects", 0.85)], { actif: false });
  return modeles;
}

const OUVERTES = [];   // au plus trois bases ouvertes : les plus anciennes sont fermées
async function base(modeles) {
  while (OUVERTES.length > 2) await OUVERTES.shift().close();
  const db = new PGlite();
  OUVERTES.push(db);
  await db.exec(`
    create table public.brands (id uuid primary key, name text not null, category text not null, is_active boolean not null default true);
    create table public.models (id uuid primary key, brand_id uuid not null references public.brands(id) on delete cascade, name text not null, slug text not null,
      is_active boolean not null default true, authentication_points jsonb not null default '[]'::jsonb, specific_auth_points jsonb, variants jsonb not null default '[]'::jsonb,
      collaborations jsonb not null default '[]'::jsonb, min_photos int not null default 8, max_photos int not null default 12, created_at timestamptz not null default now(), unique (brand_id, slug));
  `);
  const marque = randomUUID();
  await db.query("insert into public.brands (id, name, category) values ($1, 'Marque', 'bag')", [marque]);
  for (const [i, m] of modeles.entries())
    await db.query("insert into public.models (id, brand_id, name, slug, is_active, authentication_points, specific_auth_points) values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)",
      [m.id, marque, `Modèle ${i}`, `modele-${i}`, m.actif, JSON.stringify(m.points), i % 7 === 0 ? JSON.stringify(["texte libre"]) : null]);
  return { db, marque };
}

const md5 = (t) => createHash("md5").update(t).digest("hex");
const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x));
async function etat(db) {
  const { rows } = await db.query("select id::text as id, authentication_points::text as texte, md5(row(brand_id, name, slug, is_active, specific_auth_points, variants, collaborations, min_photos, max_photos, created_at)::text) as reste, authentication_points as tableau from public.models order by id");
  return rows;
}
const empreinte = (lignes) => md5(lignes.map((l) => `${l.id}:${l.texte}:${l.reste}`).join("|"));
async function objets(db) {
  const { rows } = await db.query("select (select count(*) from pg_class where relnamespace not in (select oid from pg_namespace where nspname like 'pg_%' or nspname = 'information_schema'))::int as classes, (select count(*) from pg_proc where pronamespace = 'public'::regnamespace)::int as fonctions");
  return JSON.stringify(rows[0]);
}
/** Exécute un morceau de SQL ; rend { erreur, verdict } : la première ligne du dernier résultat, à plat. */
async function lancer(db, sql) {
  try {
    const resultats = await db.exec(sql);
    const dernier = [...resultats].reverse().find((r) => r.rows && r.rows.length > 0);
    return { erreur: null, verdict: dernier ? Object.values(dernier.rows[0]).filter((v) => typeof v === "string").join(" ¦ ") : "" };
  } catch (e) {
    try { await db.exec("rollback"); } catch {}
    return { erreur: String(e.message).split("\n")[0], verdict: "" };
  }
}
/** Oracle : le tableau attendu après l'aller, d'après la table seule. */
const corrige = (tableau) => !Array.isArray(tableau) ? tableau : tableau.map((p) => {
  if (!p || typeof p !== "object" || Array.isArray(p) || typeof p.zone !== "string" || typeof p.label !== "string") return p;
  const c = corrections.find((x) => x.zone === p.zone && x.ancien === p.label);
  return c ? { ...p, label: c.nouveau } : p;
});

let echecs = 0, controles = 0;
const verifier = (ok, message) => { controles++; if (!ok) echecs++; console.log(`${ok ? "ok   " : "ÉCHEC"} ${message}`); };
const court = (t) => (t ?? "").replace(/\s+/g, " ").slice(0, 110);

// ───────────────────────────── 1. Parcours nominal ─────────────────────────────
const modeles = construire();
const { db, marque } = await base(modeles);
const depart = await etat(db), objetsDepart = await objets(db);
{
  const { rows } = await db.query(`select p->>'zone' as zone, p->>'label' as label, count(*)::int as n from public.models m, jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) p where jsonb_typeof(p) = 'object' and jsonb_typeof(p->'zone') = 'string' and jsonb_typeof(p->'label') = 'string' group by 1, 2`);
  const table = new Map(rows.map((r) => [`${r.zone}|${r.label}`, r.n]));
  verifier(corrections.every((c) => table.get(`${c.zone}|${c.ancien}`) === c.points), `base de départ : chacun des ${corrections.length} anciens libellés a son nombre de points (${TOTAL} en tout)`);
  verifier(corrections.every((c) => !table.has(`${c.zone}|${c.nouveau}`) || (c.zone === "packaging" && c.nouveau === "Emballage" && table.get("packaging|Emballage") === 28)), "base de départ : aucun nouveau libellé déjà porté, sauf les 28 « Emballage »");
}
const attendu = new Map(depart.map((l) => [l.id, canon(corrige(l.tableau))]));

let r = await lancer(db, aller.trois);
verifier(r.erreur === null && !/APPLIQUÉ/.test(r.verdict.replace(/DÉJÀ APPLIQUÉ|PAS APPLIQUÉ|NON APPLIQUÉ/g, "")), `au départ, étape 3 de l'aller lancée seule : ne dit pas « APPLIQUÉ » (« ${court(r.verdict)} »)`);
r = await lancer(db, retour.un);
verifier(r.erreur === null && !/PRÊT POUR LE RETOUR/.test(r.verdict), `au départ, étape 1 du retour : ne dit pas « PRÊT POUR LE RETOUR » (« ${court(r.verdict)} »)`);
r = await lancer(db, aller.un);
verifier(r.erreur === null && /PRÊT/.test(r.verdict) && new RegExp(`\\b${TOTAL}\\b`).test(r.verdict), `aller, étape 1 : « PRÊT » avec ${TOTAL} points (« ${court(r.verdict)} »)`);
verifier(empreinte(await etat(db)) === empreinte(depart), "aller, étape 1 : n'écrit rien");
r = await lancer(db, aller.deux);
verifier(r.erreur === null, `aller, étape 2 : s'exécute ${r.erreur ?? ""}`);
const apres = await etat(db);
{
  const faux = apres.filter((l) => canon(l.tableau) !== attendu.get(l.id));
  verifier(faux.length === 0, `après l'aller : les ${apres.length} tableaux sont exactement ceux de l'oracle (${faux.length} écart(s)${faux[0] ? ` ; premier : ${faux[0].id}` : ""})`);
  const parId = new Map(depart.map((l) => [l.id, l]));
  let changes = 0, modifies = 0;
  for (const l of apres) {
    const d = parId.get(l.id);
    if (l.texte !== d.texte) modifies++;
    if (Array.isArray(d.tableau)) d.tableau.forEach((p, i) => { if (canon(p) !== canon(l.tableau[i])) changes++; });
  }
  verifier(changes === TOTAL, `après l'aller : ${changes} points changés (${TOTAL} attendus)`);
  verifier(apres.every((l) => l.reste === parId.get(l.id).reste) && apres.length === depart.length, "après l'aller : aucune autre colonne ne change, aucun modèle en plus ni en moins");
  console.log(`      (${modifies} modèles modifiés sur ${apres.length})`);
}
verifier((await objets(db)) === objetsDepart, "après l'aller : aucun objet permanent créé");
r = await lancer(db, aller.trois);
verifier(r.erreur === null && /APPLIQUÉ/.test(r.verdict), `aller, étape 3 : « APPLIQUÉ » (« ${court(r.verdict)} »)`);
r = await lancer(db, aller.un);
verifier(r.erreur === null && /DÉJÀ APPLIQUÉ/.test(r.verdict), `aller, étape 1 relancée après coup : « DÉJÀ APPLIQUÉ » (« ${court(r.verdict)} »)`);
const e1 = empreinte(apres);
r = await lancer(db, aller.deux);
verifier(r.erreur === null && empreinte(await etat(db)) === e1, `relance de l'aller : aucune écriture ${r.erreur ?? ""}`);

r = await lancer(db, retour.un);
verifier(r.erreur === null && /PRÊT POUR LE RETOUR/.test(r.verdict), `retour, étape 1 : « PRÊT POUR LE RETOUR » (« ${court(r.verdict)} »)`);
r = await lancer(db, retour.deux);
verifier(r.erreur === null, `retour, étape 2 : s'exécute ${r.erreur ?? ""}`);
{
  const fin = await etat(db);
  const parId = new Map(depart.map((l) => [l.id, l]));
  const faux = fin.filter((l) => l.texte !== parId.get(l.id).texte || l.reste !== parId.get(l.id).reste);
  verifier(faux.length === 0 && fin.length === depart.length, `après aller puis retour : chaque modèle est identique au départ, au caractère près (${faux.length} écart(s)${faux[0] ? ` ; premier : ${faux[0].id}` : ""})`);
}
r = await lancer(db, retour.trois);
verifier(r.erreur === null && /À L'ÉTAT DE DÉPART/.test(r.verdict), `retour, étape 3 : « À L'ÉTAT DE DÉPART » (« ${court(r.verdict)} »)`);
r = await lancer(db, retour.deux);
verifier(r.erreur === null && empreinte(await etat(db)) === empreinte(depart), `relance du retour : aucune écriture ${r.erreur ?? ""}`);
await lancer(db, aller.deux); await lancer(db, retour.deux); r = await lancer(db, aller.deux);
verifier(r.erreur === null && empreinte(await etat(db)) === e1, "aller, retour, aller : même état final que le premier aller");
r = await lancer(db, retour.deux);
verifier(r.erreur === null && empreinte(await etat(db)) === empreinte(depart), "… puis retour : état de départ");
verifier((await objets(db)) === objetsDepart, "à la fin du parcours : aucun objet permanent créé");

// Fichier entier lancé d'un coup, sur une base neuve.
{
  const b = await base(construire());
  const d0 = await etat(b.db);
  const ra = await lancer(b.db, aller.entier);
  verifier(ra.erreur === null && /APPLIQUÉ/.test(ra.verdict), `fichier aller lancé d'un coup : « APPLIQUÉ » (« ${court(ra.verdict)} ») ${ra.erreur ?? ""}`);
  const rr = await lancer(b.db, retour.entier);
  const d1 = await etat(b.db);
  verifier(rr.erreur === null && /À L'ÉTAT DE DÉPART/.test(rr.verdict) && empreinte(d1) === empreinte(d0), `fichier retour lancé d'un coup : « À L'ÉTAT DE DÉPART » et base identique au départ ${rr.erreur ?? ""}`);
}

// ───────────────────────────── 2. États faussés ─────────────────────────────
// Chaque cas part d'une base neuve ; prepare() la fausse, puis le script visé doit s'arrêter sans rien écrire
// et son étape 1 ne doit pas donner le feu vert.
const snkCourt = (ms) => ms.filter((m) => m.points === SNK_COURT);
const idDe = (zone, ancien) => corrections.find((c) => c.zone === zone && c.ancien === ancien).ids;
const poser = (db, id, zone, libelle) => db.query(
  `update public.models m set authentication_points = (select jsonb_agg(case when e.p->>'zone' = $2 then jsonb_set(e.p, '{label}', to_jsonb($3::text)) else e.p end order by e.rang) from jsonb_array_elements(m.authentication_points) with ordinality e(p, rang)) where m.id = $1`, [id, zone, libelle]);

async function casAller(nom, prepare) {
  const ms = construire(); const b = await base(ms);
  await prepare(b.db, ms, b.marque);
  const avant = empreinte(await etat(b.db));
  const r1 = await lancer(b.db, aller.un);
  const r2 = await lancer(b.db, aller.deux);
  const intact = empreinte(await etat(b.db)) === avant;
  verifier(r2.erreur !== null && intact && r1.erreur === null && /ÉCARTS/.test(r1.verdict) && !/^PRÊT|¦ PRÊT/.test(r1.verdict),
    `aller refusé — ${nom} : étape 1 « ${court(r1.verdict).slice(0, 60)} », étape 2 ${r2.erreur ? `arrêtée (« ${court(r2.erreur).slice(0, 80)} »)` : "PASSÉE"}, base ${intact ? "intacte" : "MODIFIÉE"}`);
}
async function casRetour(nom, prepare, { doitPasser = false, retouche = null } = {}) {
  const ms = construire(); const b = await base(ms);
  const d0 = await etat(b.db);
  const ra = await lancer(b.db, aller.deux);
  if (ra.erreur) { verifier(false, `retour — ${nom} : l'aller préalable a échoué (${ra.erreur})`); return; }
  await prepare(b.db, ms, b.marque);
  const avant = empreinte(await etat(b.db));
  const r1 = await lancer(b.db, retour.un);
  const r2 = await lancer(b.db, retour.deux);
  const fin = await etat(b.db);
  if (doitPasser) {
    const parId = new Map(d0.map((l) => [l.id, l]));
    const faux = fin.filter((l) => parId.has(l.id) && canon(l.tableau) !== canon(retouche ? retouche(l.id, parId.get(l.id).tableau) : parId.get(l.id).tableau));
    verifier(r2.erreur === null && /PRÊT POUR LE RETOUR/.test(r1.verdict) && faux.length === 0, `retour accepté — ${nom} : les modèles d'origine reviennent au départ, retouches étrangères gardées (${faux.length} écart(s)) ${r2.erreur ?? ""}`);
  } else {
    const intact = empreinte(fin) === avant;
    verifier(r2.erreur !== null && intact && r1.erreur === null && /ÉCARTS/.test(r1.verdict) && !/PRÊT POUR LE RETOUR/.test(r1.verdict),
      `retour refusé — ${nom} : étape 1 « ${court(r1.verdict).slice(0, 60)} », étape 2 ${r2.erreur ? `arrêtée (« ${court(r2.erreur).slice(0, 80)} »)` : "PASSÉE"}, base ${intact ? "intacte" : "MODIFIÉE"}`);
  }
}
const nouveauModele = (db, marque, points, slug = `intrus-${randomUUID().slice(0, 8)}`) =>
  db.query("insert into public.models (id, brand_id, name, slug, authentication_points) values ($1, $2, 'Intrus', $3, $4::jsonb)", [randomUUID(), marque, slug, JSON.stringify(points)]);

await casAller("un modèle de plus porte un ancien libellé", (db, ms, marque) => nouveauModele(db, marque, [pt("eyelets", "Oeillets et lacets", 1)]));
await casAller("un 29e modèle au profil court", (db, ms, marque) => nouveauModele(db, marque, VET_COURT));
await casAller("un modèle déjà corrigé (état partiel)", (db, ms) => poser(db, ms[0].id, "hardware", "Pièces métalliques (gravure, poids, finition)"));
await casAller("un nouveau libellé déjà porté par un modèle imprévu", (db, ms, marque) => nouveauModele(db, marque, [pt("sole_pattern", "Semelle extérieure", 1)]));
await casAller("tongue_label : comptes justes mais listes fausses (un modèle listé échange son libellé avec un modèle « des autres »)", async (db, ms) => {
  await poser(db, idDe("tongue_label", "Étiquette de languette")[0], "tongue_label", "Etiquette langue");
  await poser(db, snkCourt(ms)[0].id, "tongue_label", "Étiquette de languette");
});
await casAller("tongue_tag : comptes justes mais deux modèles échangent leurs libellés entre deux listes", async (db) => {
  await poser(db, idDe("tongue_tag", "Étiquette de langue")[0], "tongue_tag", "Étiquette de languette");
  await poser(db, idDe("tongue_tag", "Étiquette de languette")[0], "tongue_tag", "Étiquette de langue");
});
await casAller("sole_pattern : les deux modèles à un point échangent leurs libellés", async (db) => {
  await poser(db, idDe("sole_pattern", "Motif de la semelle")[0], "sole_pattern", "Motif semelle extérieure");
  await poser(db, idDe("sole_pattern", "Motif semelle extérieure")[0], "sole_pattern", "Motif de la semelle");
});
await casAller("box_label : le point d'un libellé à un modèle est sur un autre modèle", async (db, ms, marque) => {
  await db.query("delete from public.models where id = $1", [idDe("box_label", "Étiquette boîte")[0]]);
  await nouveauModele(db, marque, [pt("box_label", "Étiquette boîte", 1)]);
});
await casAller("tags : un « Tags » hors des 28 modèles courts, un « Tags et etiquettes volantes » sur un modèle court", async (db, ms) => {
  await poser(db, courts[3], "tags", "Tags et etiquettes volantes");
  await poser(db, ms.find((m) => m.points === VET_LONG).id, "tags", "Tags");
});
await casAller("packaging : « Emballage » porté par un modèle long au lieu d'un court (28 en tout)", async (db, ms) => {
  await poser(db, courts[5], "packaging", "Emballage et packaging");
  await poser(db, ms.find((m) => m.points === VET_LONG).id, "packaging", "Emballage");
});
await casAller("base vide (mauvais projet)", (db) => db.query("delete from public.models"));

await casRetour("un 5e modèle porte « Étiquette de taille (languette) » parmi les listés (36 au lieu de 35)", (db, ms, marque) => nouveauModele(db, marque, [pt("tongue_label", "Étiquette de taille (languette)", 1)]));
await casRetour("tongue_tag : un 7e « Badge de languette » hors des deux listes", (db, ms, marque) => nouveauModele(db, marque, [pt("tongue_tag", "Badge de languette", 1)]));
await casRetour("tongue_label : un modèle listé a perdu son point, un modèle hors liste l'a gagné (compte inchangé)", async (db, ms, marque) => {
  await db.query("delete from public.models where id = $1", [idDe("tongue_label", "Étiquette de languette")[1]]);
  await nouveauModele(db, marque, [pt("tongue_label", "Étiquette de taille (languette)", 1)]);
});
await casRetour("un ancien libellé remis à la main sur un modèle (état partiel)", (db, ms) => poser(db, ms[0].id, "hardware", "Hardware/ferrures (gravure, poids, finition)"));
await casRetour("tags : un modèle court a perdu « Étiquettes volantes », un modèle créé le porte (126 en tout)", async (db, ms, marque) => {
  await poser(db, courts[7], "tags", "Étiquette (autre)");
  await nouveauModele(db, marque, [pt("tags", "Étiquettes volantes", 1)]);
});
await casRetour("packaging : un modèle court ne porte plus « Emballage », un modèle créé le porte (126 en tout)", async (db, ms, marque) => {
  await poser(db, courts[9], "packaging", "Emballage (autre)");
  await nouveauModele(db, marque, [pt("packaging", "Emballage", 1)]);
});
await casRetour("sole_pattern : un 3e modèle porte « Semelle extérieure (motif) »", (db, ms, marque) => nouveauModele(db, marque, [pt("sole_pattern", "Semelle extérieure (motif)", 1)]));
let retouchee = null;
await casRetour("le catalogue a bougé ailleurs (modèle créé sans aucun des libellés, modèle désactivé, autre libellé retouché)", async (db, ms, marque) => {
  await nouveauModele(db, marque, [pt("toe_box", "Forme de la toe box", 1)]);
  await db.query("update public.models set is_active = false where id = $1", [ms[1].id]);
  await poser(db, ms[2].id, "lining", "Doublure (couleur, texture)");
  retouchee = ms[2].id;
}, { doitPasser: true, retouche: (id, tableau) => (id === retouchee ? tableau.map((p) => (p.zone === "lining" ? { ...p, label: "Doublure (couleur, texture)" } : p)) : tableau) });

console.log(echecs === 0 ? `\nBANC INDÉPENDANT : ${controles} contrôles, tout passe` : `\nBANC INDÉPENDANT : ${controles} contrôles, ${echecs} ÉCHEC(S)`);
process.exit(echecs === 0 ? 0 : 1);
