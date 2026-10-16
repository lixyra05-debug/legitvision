// Banc d'essai des trois requêtes des noms de photos, prises comme des boîtes noires, sur une base
// PGlite (PostgreSQL 17 en mémoire, aucun réseau) chargée avec le relevé de production du 2026-10-13.
// Il ne lit pas le générateur : il ne connaît que les fichiers SQL, la table des corrections, le
// relevé et attendus.json. L'état attendu après l'aller est recalculé ici (oracle), en JavaScript.
//
// Lancer :  LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node banc.mjs [dossier des scripts]
// (PGlite 0.3.x ; « npx @electric-sql/pglite » l'installe dans le cache de npx.)
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.LV_PGLITE) { console.error("LV_PGLITE manque : chemin de @electric-sql/pglite/dist/index.js"); process.exit(2); }
const { PGlite } = await import(process.env.LV_PGLITE);
const ICI = dirname(fileURLToPath(import.meta.url));
const DEPOT = process.argv[2] ? resolve(process.argv[2]) : resolve(ICI, "../..");

const corrections = JSON.parse(readFileSync(`${ICI}/corrections.json`, "utf8"));
const releve = JSON.parse(readFileSync(`${ICI}/releve-2026-10-13.json`, "utf8"));
const attendus = JSON.parse(readFileSync(`${ICI}/attendus.json`, "utf8"));
const SQL = {
  etat: readFileSync(`${DEPOT}/2026-10-13-noms-photos-etat.sql`, "utf8"),
  aller: readFileSync(`${DEPOT}/2026-10-13-noms-photos-aller.sql`, "utf8"),
  retour: readFileSync(`${DEPOT}/2026-10-13-noms-photos-retour.sql`, "utf8"),
};

let echecs = 0, controles = 0;
const verifier = (ok, message) => { controles++; if (!ok) echecs++; console.log(`${ok ? "ok   " : "ÉCHEC"} ${message}`); };
const court = (t) => String(t ?? "").replace(/\s+/g, " ").slice(0, 150);

// ── La base ────────────────────────────────────────────────────────────────────────────────────

const OUVERTES = [];   // au plus deux bases ouvertes : la plus ancienne est fermée
async function base(lignes = releve) {
  while (OUVERTES.length > 1) await OUVERTES.shift().close();
  const db = new PGlite();
  OUVERTES.push(db);
  // Les colonnes de public.brands relevées en production le 2026-10-13.
  await db.exec(`create table public.brands (id uuid primary key, name text not null, slug text not null, category text not null, logo_url text,
    photo_protocol jsonb not null, is_active boolean not null, created_at timestamptz not null);`);
  for (const b of lignes)
    await db.query("insert into public.brands (id, name, slug, category, logo_url, photo_protocol, is_active, created_at) values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)",
      [b.id, b.name, b.slug, b.category, b.logo_url, JSON.stringify(b.photo_protocol), b.is_active, b.created_at]);
  return db;
}

/** Toute la table, au caractère près : le protocole en texte, et le reste de la ligne. */
async function photo(db) {
  const { rows } = await db.query("select id::text as id, photo_protocol::text as texte, photo_protocol as protocole, (to_jsonb(b) - 'photo_protocol')::text as reste from public.brands b order by id");
  return rows;
}
const meme = (a, b) => JSON.stringify(a.map((l) => [l.id, l.texte, l.reste])) === JSON.stringify(b.map((l) => [l.id, l.texte, l.reste]));
const memeReste = (a, b) => JSON.stringify(a.map((l) => [l.id, l.reste])) === JSON.stringify(b.map((l) => [l.id, l.reste]));

/** Lance UN fichier par le protocole étendu, qui refuse plusieurs instructions : { erreur, lignes }. */
async function lancer(db, sql) {
  try {
    const { rows } = await db.query(sql);
    return { erreur: null, lignes: rows ?? [] };
  } catch (e) {
    try { await db.exec("rollback"); } catch {}
    return { erreur: String(e.message).split("\n")[0], lignes: [] };
  }
}
const etat = async (db) => {
  const r = await lancer(db, SQL.etat);
  return { ...r, verdict: r.lignes[0]?.resultat ?? "", noms: r.lignes[0]?.empreinte_noms ?? null, autres: r.lignes[0]?.empreinte_autres_colonnes ?? null };
};

/** Oracle : le protocole attendu après l'aller, d'après la table des corrections seule. */
const corrige = (protocole) => protocole.map((e) => {
  const c = corrections.find((x) => x.nom === e.name && x.ancien === e.label);
  return c ? { ...e, label: c.nouveau } : e;
});
const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x));

// ── 0. Un fichier, une instruction ─────────────────────────────────────────────────────────────

const sansCommentaires = (sql) => sql.replace(/^\s*--.*$/gm, "");
/** Le texte sans ses listes JSON (corrections, retours) : il reste le SQL lui-même, corps du bloc compris. */
const sansListes = (sql) => sansCommentaires(sql).replace(/\$(corrections|retours)\$[\s\S]*?\$\1\$/g, "''");
for (const [nom, sql] of Object.entries(SQL)) {
  // Hors commentaires et hors chaînes entre dollars, il ne reste qu'un point-virgule : le dernier caractère utile.
  const nu = sansCommentaires(sql).replace(/\$([a-z]*)\$[\s\S]*?\$\1\$/g, "''").trim();
  verifier((nu.match(/;/g) ?? []).length === 1 && nu.endsWith(";"), `${nom} : une seule instruction dans le fichier`);
  // Dans tout le SQL, corps du bloc compris : aucune autre écriture que l'update, aucun objet créé.
  const corps = sansListes(sql);
  verifier(!/\b(drop|truncate|delete|alter|create|grant|revoke|insert|copy|execute|into)\b/i.test(corps), `${nom} : ni drop, ni truncate, ni delete, ni alter, ni create, ni grant, ni insert, ni « into », corps du bloc compris`);
  const ecritures = corps.match(/\bupdate\s+\S+/gi) ?? [];
  verifier(nom === "etat" ? ecritures.length === 0 : ecritures.length === 1 && /^update\s+public\.brands$/i.test(ecritures[0]), `${nom} : ${nom === "etat" ? "aucun update" : "un seul update, sur public.brands"}`);
  // La dernière ligne dit laquelle des trois requêtes c'est.
  const fin = sql.trimEnd().split("\n").pop();
  verifier(fin.startsWith("-- FIN — noms des photos : ") && Object.values(SQL).filter((x) => x.trimEnd().endsWith(fin)).length === 1, `${nom} : dernière ligne « ${fin} », propre à ce fichier`);
}
{
  const nu = sansListes(SQL.etat);
  verifier(!/\b(update|do|lock|set)\b/i.test(nu), "état : ni update, ni bloc, ni verrou (lecture seule)");
}

// ── 1. Parcours nominal ────────────────────────────────────────────────────────────────────────

const db = await base();
const depart = await photo(db);
verifier(depart.length === attendus.lignes && depart.reduce((s, l) => s + l.protocole.length, 0) === attendus.emplacements, `base de départ : ${attendus.lignes} lignes, ${attendus.emplacements} emplacements`);

let e = await etat(db);
verifier(e.erreur === null && e.verdict.startsWith(attendus.verdict_avant), `état avant : « ${court(e.verdict)} »`);
verifier(e.noms === attendus.empreinte_noms_avant, `état avant : empreinte des noms ${e.noms} (prévue ${attendus.empreinte_noms_avant})`);
verifier(e.lignes.length === corrections.length + 1 && e.lignes.every((l, i) => l.n === i), `état : ${corrections.length + 1} lignes, numérotées de 0 à ${corrections.length}`);
verifier(JSON.stringify(Object.keys(e.lignes[0])) === JSON.stringify(["n", "resultat", "empreinte_noms", "empreinte_autres_colonnes", "a_corriger", "au_releve", "portent_le_nouveau"]), "état : colonnes n, resultat, puis les deux empreintes, puis les comptes");
verifier(e.lignes.slice(1).every((l) => l.empreinte_noms === null && l.empreinte_autres_colonnes === null), "état : seules les empreintes de la première ligne sont remplies");
verifier(corrections.every((c) => { const l = e.lignes[c.n]; return l.a_corriger === c.emplacements && l.au_releve === c.emplacements && l.resultat === `${c.nom} : « ${c.ancien} » → « ${c.nouveau} »`; }), "état avant : chaque correction a son nombre d'emplacements à corriger, celui du relevé");
verifier(e.lignes[0].a_corriger === attendus.noms_a_corriger, `état avant : ${attendus.noms_a_corriger} noms à corriger`);
const autresDepart = e.autres;
verifier(autresDepart === attendus.empreinte_autres_colonnes, `état avant : empreinte des autres colonnes ${autresDepart} (prévue ${attendus.empreinte_autres_colonnes})`);
verifier(meme(depart, await photo(db)), "la requête d'état n'écrit rien");

let r = await lancer(db, SQL.aller);
verifier(r.erreur === null && r.lignes.length === 0, `aller : aucune erreur, aucune ligne affichée${r.erreur ? ` (${court(r.erreur)})` : ""}`);
const corrigee = await photo(db);
verifier(corrigee.every((l, i) => canon(l.protocole) === canon(corrige(releve[i].photo_protocol))), "aller : chaque ligne de marque porte exactement le protocole attendu (oracle)");
verifier(corrigee.filter((l, i) => l.texte !== depart[i].texte).length === attendus.lignes_a_corriger, `aller : ${attendus.lignes_a_corriger} lignes de marque changées`);
verifier(corrigee.reduce((s, l, i) => s + l.protocole.filter((x, j) => x.label !== releve[i].photo_protocol[j].label).length, 0) === attendus.noms_a_corriger, `aller : ${attendus.noms_a_corriger} noms changés`);
verifier(corrigee.every((l, i) => l.protocole.every((x, j) => { const o = releve[i].photo_protocol[j]; return x.name === o.name && x.required === o.required && x.min_resolution === o.min_resolution && Object.keys(x).length === Object.keys(o).length; })), "aller : ordre, identifiant, « required » et « min_resolution » de chaque emplacement inchangés");
verifier(memeReste(depart, corrigee), "aller : les autres colonnes de public.brands sont inchangées");
verifier(corrigee.every((l) => new Set(l.protocole.map((x) => x.label)).size === l.protocole.length), "aller : aucune ligne de marque n'a deux photos du même nom");
e = await etat(db);
verifier(e.verdict.startsWith(attendus.verdict_apres), `état après : « ${court(e.verdict)} »`);
verifier(e.noms === attendus.empreinte_noms_apres, `état après : empreinte des noms ${e.noms} (prévue ${attendus.empreinte_noms_apres})`);
verifier(e.autres === autresDepart, "état après : empreinte des autres colonnes inchangée");
verifier(corrections.every((c) => e.lignes[c.n].a_corriger === 0) && e.lignes[0].a_corriger === 0, "état après : plus aucun nom à corriger");
verifier(corrections.every((c) => e.lignes[c.n].portent_le_nouveau >= c.emplacements), "état après : chaque nouveau nom est porté au moins autant de fois que sa correction en compte");

r = await lancer(db, SQL.aller);
verifier(r.erreur === null && meme(corrigee, await photo(db)), "aller relancé : aucune erreur, rien ne change");

r = await lancer(db, SQL.retour);
verifier(r.erreur === null && r.lignes.length === 0, `retour : aucune erreur, aucune ligne affichée${r.erreur ? ` (${court(r.erreur)})` : ""}`);
verifier(meme(depart, await photo(db)), "retour : la table est revenue à l'état du relevé, au caractère près");
e = await etat(db);
verifier(e.verdict.startsWith(attendus.verdict_avant) && e.noms === attendus.empreinte_noms_avant && e.autres === autresDepart, `état après le retour : « ${court(e.verdict)} », empreintes d'avant`);
r = await lancer(db, SQL.retour);
verifier(r.erreur === null && meme(depart, await photo(db)), "retour relancé : aucune erreur, rien ne change");
r = await lancer(db, SQL.aller);
verifier(r.erreur === null && meme(corrigee, await photo(db)), "aller après un retour : même état corrigé");

// ── 2. États que les blocs doivent refuser, sans rien écrire ───────────────────────────────────

const UNE = releve.find((b) => b.photo_protocol.some((x) => corrections.some((c) => c.nom === x.name && c.ancien === x.label)));
const INTACTE = releve.find((b) => !b.photo_protocol.some((x) => corrections.some((c) => c.nom === x.name && c.ancien === x.label)));
const VISE = UNE.photo_protocol.findIndex((x) => corrections.some((c) => c.nom === x.name && c.ancien === x.label));
const NEUVE = "00000000-0000-4000-8000-000000000001";
const ecarts = [
  ["un nom retouché dans une ligne que l'aller ne corrige pas", `update public.brands set photo_protocol = jsonb_set(photo_protocol, '{0,label}', '"Autre nom"') where id = '${INTACTE.id}'`],
  ["un nom à corriger déjà retouché à la main", `update public.brands set photo_protocol = jsonb_set(photo_protocol, '{${VISE},label}', '"Autre nom"') where id = '${UNE.id}'`],
  ["une ligne de marque ajoutée", `insert into public.brands (id, name, slug, category, photo_protocol, is_active, created_at) values ('${NEUVE}', 'Neuve', 'neuve', 'bag', '[{"name": "overall_back", "label": "Vue arriere", "required": true, "min_resolution": "800x800"}]', true, now())`],
  ["une ligne de marque supprimée", `delete from public.brands where id = '${INTACTE.id}'`],
  ["une photo devenue facultative", `update public.brands set photo_protocol = jsonb_set(photo_protocol, '{0,required}', 'false') where id = '${UNE.id}' and photo_protocol->0->>'required' = 'true'`],
  ["deux photos échangées", `update public.brands set photo_protocol = jsonb_build_array(photo_protocol->1, photo_protocol->0) || (photo_protocol - 0 - 0) where id = '${UNE.id}'`],
  ["une photo ajoutée à une ligne", `update public.brands set photo_protocol = photo_protocol || '[{"name": "extra", "label": "En plus", "required": false, "min_resolution": "800x800"}]'::jsonb where id = '${UNE.id}'`],
  ["un protocole vidé", `update public.brands set photo_protocol = '[]'::jsonb where id = '${UNE.id}'`],
];
for (const [cas, sql] of ecarts) {
  // Avant l'aller : l'aller refuse.
  let d = await base();
  await d.exec(sql);
  let avant = await photo(d);
  let x = await etat(d);
  verifier(x.verdict.startsWith("ÉCARTS"), `${cas}, avant l'aller : l'état dit « ÉCARTS »`);
  x = await lancer(d, SQL.aller);
  verifier(x.erreur !== null && x.erreur.includes("NOMS DES PHOTOS") && x.erreur.includes("Rien n'est écrit") && meme(avant, await photo(d)), `${cas}, avant l'aller : l'aller refuse et n'écrit rien (${court(x.erreur)})`);
  x = await lancer(d, SQL.retour);
  verifier(x.erreur !== null && meme(avant, await photo(d)), `${cas}, avant l'aller : le retour refuse et n'écrit rien`);
  // Après l'aller : le retour refuse.
  d = await base();
  await lancer(d, SQL.aller);
  await d.exec(sql);
  avant = await photo(d);
  x = await etat(d);
  verifier(x.verdict.startsWith("ÉCARTS"), `${cas}, après l'aller : l'état dit « ÉCARTS »`);
  x = await lancer(d, SQL.retour);
  verifier(x.erreur !== null && x.erreur.includes("NOMS DES PHOTOS") && x.erreur.includes("Rien n'est écrit") && meme(avant, await photo(d)), `${cas}, après l'aller : le retour refuse et n'écrit rien (${court(x.erreur)})`);
  x = await lancer(d, SQL.aller);
  verifier(x.erreur !== null && meme(avant, await photo(d)), `${cas}, après l'aller : l'aller refuse et n'écrit rien`);
}

// ── 3. Déclencheurs : une écriture parasite annule tout ────────────────────────────────────────

const declencheurs = [
  ["un déclencheur qui change une autre colonne", "new.slug := new.slug || '-x';", "une autre colonne"],
  ["un déclencheur qui retouche le protocole", `new.photo_protocol := new.photo_protocol || '[{"name": "extra", "label": "En plus", "required": false, "min_resolution": "800x800"}]'::jsonb;`, "n'est pas l'état"],
];
for (const [cas, corps, attendu] of declencheurs) {
  for (const sens of ["aller", "retour"]) {
    const d = await base();
    if (sens === "retour") await lancer(d, SQL.aller);
    await d.exec(`create function public.parasite() returns trigger language plpgsql as $f$ begin ${corps} return new; end $f$;
      create trigger parasite before update on public.brands for each row execute function public.parasite();`);
    const avant = await photo(d);
    const x = await lancer(d, SQL[sens]);
    verifier(x.erreur !== null && x.erreur.includes(attendu) && x.erreur.includes("Tout est annulé") && meme(avant, await photo(d)), `${cas} : ${sens === "aller" ? "l'aller" : "le retour"} s'annule en entier (${court(x.erreur)})`);
  }
}

// ── 4. Un script retouché à la main ne peut pas écrire un autre état ───────────────────────────

{
  // Une correction retirée de l'aller : le résultat ne serait pas l'état prévu.
  const c = corrections[0];
  const ligne = new RegExp(`^\\s*\\{"n":${c.n},[^\\n]*\\n`, "m");
  const fausse = SQL.aller.replace(ligne, "");
  verifier(fausse !== SQL.aller, "sabotage : une correction retirée du texte de l'aller");
  let d = await base();
  let avant = await photo(d);
  let x = await lancer(d, fausse);
  verifier(x.erreur !== null && x.erreur.includes("Tout est annulé") && meme(avant, await photo(d)), `aller amputé d'une correction : il s'annule en entier (${court(x.erreur)})`);
  // Un nouveau nom changé dans l'aller.
  const autre = SQL.aller.replace('"nouveau":"Vue arrière"', '"nouveau":"Vue de dos"');
  verifier(autre !== SQL.aller, "sabotage : un nouveau nom changé dans le texte de l'aller");
  x = await lancer(d, autre);
  verifier(x.erreur !== null && x.erreur.includes("Tout est annulé") && meme(avant, await photo(d)), "aller au nouveau nom changé : il s'annule en entier");
  // Un ancien nom changé dans le retour, puis une ligne retirée du retour.
  d = await base();
  await lancer(d, SQL.aller);
  avant = await photo(d);
  const retourFaux = SQL.retour.replace('"ancien":"Vue arriere"', '"ancien":"Vue arrière"');
  verifier(retourFaux !== SQL.retour, "sabotage : un ancien nom changé dans le texte du retour");
  x = await lancer(d, retourFaux);
  verifier(x.erreur !== null && x.erreur.includes("Tout est annulé") && meme(avant, await photo(d)), `retour à l'ancien nom changé : il s'annule en entier (${court(x.erreur)})`);
  const retourAmpute = SQL.retour.replace(/^\s*\{"id":"[^\n]*\n/m, "");
  verifier(retourAmpute !== SQL.retour, "sabotage : un emplacement retiré du texte du retour");
  x = await lancer(d, retourAmpute);
  verifier(x.erreur !== null && x.erreur.includes("Tout est annulé") && meme(avant, await photo(d)), "retour amputé d'un emplacement : il s'annule en entier");
}

// ── 5. Les blocs collés ensemble, ou coupés ────────────────────────────────────────────────────

{
  const d = await base();
  const avant = await photo(d);
  let x = await lancer(d, SQL.aller.slice(0, SQL.aller.lastIndexOf("$bloc$")));
  verifier(x.erreur !== null && meme(avant, await photo(d)), `aller coupé avant sa fin : erreur de syntaxe, rien n'est écrit (${court(x.erreur)})`);
  x = await lancer(d, SQL.aller.slice(SQL.aller.indexOf("begin")));
  verifier(x.erreur !== null && meme(avant, await photo(d)), "aller privé de son début : erreur, rien n'est écrit");
  // Aller et retour collés ensemble (exécution en une fois) : la table revient à son état de départ.
  let erreur = null;
  try { await d.exec(`${SQL.aller}\n${SQL.retour}`); } catch (err) { erreur = err.message; }
  verifier(erreur === null && meme(avant, await photo(d)), "aller et retour collés ensemble : la table revient à l'état du relevé");
}

// ── 6. Une autre colonne a changé depuis le relevé : le verdict ne regarde que les photos demandées ──

{
  const d = await base();
  await d.exec(`update public.brands set is_active = false where id = '${INTACTE.id}'; update public.brands set logo_url = '/logo.png', name = name || ' (renommée)' where id = '${UNE.id}';`);
  const avant = await photo(d);
  let x = await etat(d);
  verifier(x.verdict.startsWith(attendus.verdict_avant) && x.noms === attendus.empreinte_noms_avant && x.autres !== attendus.empreinte_autres_colonnes, "autres colonnes changées : l'état dit « PRÊT », seule l'empreinte des autres colonnes diffère du relevé");
  const autres = x.autres;
  x = await lancer(d, SQL.aller);
  const apres = await photo(d);
  verifier(x.erreur === null && memeReste(avant, apres), "autres colonnes changées : l'aller passe et ne touche pas à ces colonnes");
  x = await etat(d);
  verifier(x.verdict.startsWith(attendus.verdict_apres) && x.noms === attendus.empreinte_noms_apres && x.autres === autres, "autres colonnes changées : « APPLIQUÉ », empreinte des autres colonnes inchangée par l'aller");
  x = await lancer(d, SQL.retour);
  verifier(x.erreur === null && meme(avant, await photo(d)), "autres colonnes changées : le retour rend la table d'avant l'aller, au caractère près");
}

// ── 7. La requête d'état restée dans l'éditeur, le bloc collé dessous : tout part, et le tableau date d'avant ──

{
  const d = await base();
  const resultats = await d.exec(`${SQL.etat}\n${SQL.aller}`);
  const tableau = resultats.find((r) => r.rows && r.rows.length > 0);
  verifier(tableau?.rows[0].resultat.startsWith(attendus.verdict_avant), "état et aller collés ensemble : le tableau affiché dit « PRÊT » (il est calculé avant l'écriture)");
  const x = await etat(d);
  verifier(x.verdict.startsWith(attendus.verdict_apres), "état et aller collés ensemble : l'écriture a pourtant eu lieu, la requête d'état lancée seule le dit");
}

// ── 8. Un morceau lancé seul ne crée rien et n'écrit rien ──────────────────────────────────────

{
  const d = await base();
  const objets = async () => (await d.query("select count(*)::int as n from pg_class where relnamespace = 'public'::regnamespace")).rows[0].n;
  const empreinte = async () => (await d.query("select md5(string_agg(id::text || photo_protocol::text || (to_jsonb(b) - 'photo_protocol')::text, '' order by id)) as e from public.brands b")).rows[0].e;
  const objetsAvant = await objets(), empreinteAvant = await empreinte();
  let lances = 0, changements = 0;
  const passes = []; // les morceaux qui n'ont levé aucune erreur
  const essayer = async (sql) => {
    lances++;
    try { await d.exec(sql); passes.push(sql); } catch { try { await d.exec("rollback"); } catch {} }
    if ((await empreinte()) !== empreinteAvant) changements++;
  };
  for (const nom of ["aller", "retour"]) {
    const lignes = SQL[nom].split("\n");
    const debutBloc = lignes.findIndex((l) => l.startsWith("do $bloc$"));
    // Chaque ligne seule (une sélection d'une ligne dans l'éditeur).
    for (const ligne of lignes) if (ligne.trim() !== "") await essayer(ligne);
    // Chaque début de fichier coupé à une fin de ligne (un collage incomplet).
    for (let k = 1; k < lignes.length; k++) if (lignes.slice(k).some((l) => l.trim() !== "" && !l.startsWith("--"))) await essayer(lignes.slice(0, k).join("\n"));
    // Chaque fin de fichier qui a perdu le début du bloc (une sélection commencée trop bas), hors lignes de liste.
    for (let k = debutBloc + 1; k < lignes.length; k++) if (!/^\s*\{"/.test(lignes[k])) await essayer(lignes.slice(k).join("\n"));
  }
  verifier(changements === 0, `morceaux des blocs lancés seuls (${lances} essais) : la table ne change à aucun moment`);
  verifier((await objets()) === objetsAvant, "morceaux des blocs lancés seuls : aucun objet créé dans le schéma public");
  // Ce qui passe sans erreur : des commentaires, ou une de ces quatre lignes seule, qui ne lit ni n'écrit aucune donnée.
  const SANS_EFFET = ["begin", "end", "set local lock_timeout = '5s';", "lock table public.brands in share row exclusive mode;"];
  const utile = (sql) => sql.split("\n").map((l) => l.trim()).filter((l) => l !== "" && !l.startsWith("--")).join("\n");
  verifier(passes.length > 0 && passes.every((sql) => utile(sql) === "" || SANS_EFFET.includes(utile(sql))), `morceaux des blocs lancés seuls : les ${passes.length} qui passent sans erreur sont des commentaires, ou « begin », « end », le délai ou le verrou seuls`);
}

for (const o of OUVERTES) await o.close();
console.log(`\n${controles} contrôles, ${echecs} échec(s).`);
process.exit(echecs === 0 ? 0 : 1);
