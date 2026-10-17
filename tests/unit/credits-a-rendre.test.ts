// Crédits à rendre (décision d'Hector du 17/10) : supabase/checks/credits-a-rendre.sql,
// une requête en lecture seule qu'Hector lance chaque mardi dans l'éditeur SQL de
// Supabase. Elle liste les lancements dont le crédit n'est ni consommé par un
// rapport ni rendu, d'après les mentions que la route ajoute à la ligne « usage ».
// Ce test échoue si le fichier contient autre chose qu'une requête de lecture, si
// la route écrit une réservation, une mention ou un remboursement sous une forme
// que la requête ne lit pas, ou, quand un PostgreSQL d'essai est disponible
// (LV_PGLITE), si un cas est mal rangé.
//
// Banc :  LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node … --test tests/unit/credits-a-rendre.test.ts
// (PGlite 0.3.x ; « npx @electric-sql/pglite » l'installe dans le cache de npx.) Sans LV_PGLITE, le banc est sauté.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const lire = (chemin: string) => readFileSync(new URL(`../../${chemin}`, import.meta.url), "utf8");
const SQL = lire("supabase/checks/credits-a-rendre.sql");
const ROUTE = lire("app/api/analyze/route.ts");
const REMBOURSEMENT = lire("lib/credit-release.ts");

/** Le code de la requête, sans ses commentaires ni ses textes entre apostrophes. */
const CODE = SQL.replace(/^\s*--.*$/gm, "").replace(/'(?:[^']|'')*'/g, "''").trim();

test("crédits à rendre : le fichier ne contient qu'une requête, qui ne fait que lire", () => {
  assert.equal((CODE.match(/;/g) ?? []).length, 1, "une seule instruction");
  assert.ok(CODE.endsWith(";") && /^with\b/i.test(CODE), "une requête « with … select »");
  assert.doesNotMatch(CODE, /\b(insert|update|delete|merge|drop|alter|create|grant|revoke|truncate|copy|do|lock|set|call|execute|into|nextval|setval)\b/i);
  assert.doesNotMatch(CODE, /\bpg_\w+/i, "aucune fonction système");
  assert.deepEqual([...new Set(CODE.match(/\bpublic\.\w+/g) ?? [])].sort(), ["public.analyses", "public.credits_transactions", "public.profiles"]);
  // La dernière ligne dit quel fichier c'est : l'éditeur la montre après un collage.
  assert.equal(SQL.trimEnd().split("\n").pop(), "-- FIN — crédits à rendre (lecture seule)");
});

test("crédits à rendre : la réservation, la mention et le remboursement ont la forme que la requête lit", () => {
  assert.ok(ROUTE.includes("const reservation = `Analyse ${analysisId} (lancement ${crypto.randomUUID()})`;"), "réservation");
  assert.ok(ROUTE.includes("description: `${launch.reservation} — ${mention}`"), "mention ajoutée à la ligne « usage »");
  assert.ok(REMBOURSEMENT.includes('type: "refund",'), "type de la ligne de remboursement");
  assert.ok(REMBOURSEMENT.includes("description: `Crédit rendu — ${motif} — ${reservation}`"), "le remboursement cite la réservation");
  // Ce qui rend un rapport non décompté : la même lecture que le code.
  const code = [ROUTE, ...["lib/analysis-insufficient.ts", "lib/analysis-coverage.ts"].filter((f) => existsSync(new URL(`../../${f}`, import.meta.url))).map(lire)].join("\n");
  assert.match(code, /confidence_level[^\n]*"insufficient"/, "analyse sans résultat");
  if (code.includes("COVERAGE_MARKER_KEY")) {
    assert.match(code, /COVERAGE_MARKER_KEY = "server_coverage"/, "marqueur de couverture");
    assert.match(code, /\bcharged: boolean;/, "décision « décompté » dans le marqueur");
  }
});

test("crédits à rendre : chaque mention que la route écrit sur la ligne « usage » est connue de la requête", () => {
  const appels = [...ROUTE.matchAll(/markReservation\(\s*admin,\s*launch,\s*([\s\S]*?)\);/g)].map((m) => m[1].replace(/\s+/g, " ").trim());
  assert.ok(appels.length >= 4, String(appels.length));
  for (const appel of appels) {
    // Des textes écrits en clair seulement : une mention calculée échapperait à la requête.
    assert.match(appel, /^(?:"[^"]+"|outcome === "uncertain" \? "[^"]+" : "[^"]+")$/, appel);
    for (const [, mention] of appel.matchAll(/"([^"]+)"/g)) {
      if (mention === "uncertain") continue;
      assert.ok(SQL.includes(`'${mention.replace(/'/g, "''")}'`), `mention inconnue de la requête : « ${mention} »`);
    }
  }
});

type PGliteDb = {
  exec(sql: string): Promise<unknown>;
  query(sql: string, params?: unknown[]): Promise<{ rows: Array<Record<string, unknown>> }>;
  close(): Promise<void>;
};

/** Un lancement d'essai et ce que la requête doit en dire (null : absent de la liste). */
type Cas = {
  nom: string;
  mention?: string;
  /** Statut de l'analyse ; null : analyse absente. */
  statut?: string | null;
  reponse?: unknown;
  /** Solde actuel du compte ; null : compte absent. */
  solde: number | null;
  /** Lignes du journal écrites après la réservation (le solde après chacune suit la précédente). */
  apres?: Array<{ type: string; montant: number; cite?: "ce lancement" | "un autre lancement" }>;
  /** Âge de la réservation (intervalle PostgreSQL) ; 2 jours si rien n'est dit. */
  ancienneté?: string;
  ancienFormat?: boolean;
  attendu: "À RENDRE" | "À VÉRIFIER" | "POUR INFORMATION" | null;
  /** Crédit revenu sans ligne du journal juste après la réservation (0 si rien n'est dit) : l'écart attendu. */
  ecart?: number;
};

const RAPPORT = { confidence_level: "high", analyst_summary: "…" };
const SOLDE_APRES_RESERVATION = 4;

const CAS: Cas[] = [
  { nom: "rapport enregistré", mention: "rapport enregistré", statut: "completed", reponse: RAPPORT, solde: 4, attendu: null },
  { nom: "remboursement échoué", mention: "crédit à rendre", statut: "failed", solde: 4, attendu: "À RENDRE", ecart: 0 },
  { nom: "remboursement incertain, passé", mention: "remboursement incertain : vérifier le solde", statut: "failed", solde: 5, attendu: "POUR INFORMATION", ecart: 1 },
  { nom: "remboursement incertain, non passé", mention: "remboursement incertain : vérifier le solde", statut: "failed", solde: 4, attendu: "À RENDRE", ecart: 0 },
  { nom: "issue inconnue, rapport décompté", mention: "issue inconnue : vérifier le rapport et le solde", statut: "completed", reponse: RAPPORT, solde: 4, attendu: "POUR INFORMATION" },
  { nom: "issue inconnue, analyse sans résultat", mention: "issue inconnue : vérifier le rapport et le solde", statut: "completed", reponse: { confidence_level: "insufficient", insufficient_reason: "photos" }, solde: 4, attendu: "À RENDRE" },
  { nom: "issue inconnue, sous le seuil non décompté", mention: "issue inconnue : vérifier le rapport et le solde", statut: "expert_review", reponse: { ...RAPPORT, server_coverage: { coverage: 40, low_coverage: true, charged: false, scored_zones: [], unscored_zones: [] } }, solde: 4, attendu: "À RENDRE" },
  { nom: "issue inconnue, sous le seuil décompté", mention: "issue inconnue : vérifier le rapport et le solde", statut: "completed", reponse: { ...RAPPORT, server_coverage: { coverage: 40, low_coverage: true, charged: true, scored_zones: [], unscored_zones: [] } }, solde: 4, attendu: "POUR INFORMATION" },
  { nom: "issue inconnue, analyse restée en cours", mention: "issue inconnue : vérifier le rapport et le solde", statut: "analyzing", solde: 4, attendu: "À RENDRE" },
  { nom: "issue inconnue, réponse enregistrée sous une autre forme", mention: "issue inconnue : vérifier le rapport et le solde", statut: "completed", reponse: ["liste"], solde: 4, attendu: "POUR INFORMATION" },
  { nom: "sans mention, fonction coupée net", statut: "failed", solde: 4, attendu: "À RENDRE" },
  { nom: "sans mention, remboursement passé sans trace", statut: "failed", solde: 5, attendu: "POUR INFORMATION", ecart: 1 },
  { nom: "sans mention, rapport décompté (mention perdue)", statut: "completed", reponse: RAPPORT, solde: 4, attendu: "POUR INFORMATION" },
  { nom: "remboursement échoué puis rendu à la main", mention: "crédit à rendre", statut: "failed", solde: 5, apres: [{ type: "refund", montant: 1, cite: "ce lancement" }], attendu: null },
  { nom: "remboursement d'un autre lancement du compte", mention: "crédit à rendre", statut: "failed", solde: 5, apres: [{ type: "refund", montant: 1, cite: "un autre lancement" }], attendu: "À RENDRE", ecart: 0 },
  { nom: "lancement en cours (5 minutes)", statut: "analyzing", solde: 4, ancienneté: "5 minutes", attendu: null },
  { nom: "réservation incertaine", mention: "réservation incertaine : vérifier le solde", statut: "failed", solde: 4, attendu: "À RENDRE" },
  { nom: "information de plus de 8 jours", mention: "issue inconnue : vérifier le rapport et le solde", statut: "completed", reponse: RAPPORT, solde: 4, ancienneté: "20 days", attendu: null },
  { nom: "remboursement incertain passé, il y a 20 jours", mention: "remboursement incertain : vérifier le solde", statut: "failed", solde: 5, ancienneté: "20 days", attendu: null },
  { nom: "crédit dû depuis 20 jours", mention: "crédit à rendre", statut: "failed", solde: 4, ancienneté: "20 days", attendu: "À RENDRE" },
  { nom: "achat après un remboursement échoué", mention: "crédit à rendre", statut: "failed", solde: 9, apres: [{ type: "purchase", montant: 5 }], attendu: "À RENDRE", ecart: 0 },
  { nom: "achat après un remboursement incertain passé", mention: "remboursement incertain : vérifier le solde", statut: "failed", solde: 10, apres: [{ type: "purchase", montant: 5 }], attendu: "POUR INFORMATION", ecart: 1 },
  { nom: "mention inconnue", mention: "nouvelle mention", statut: "failed", solde: 4, attendu: "À VÉRIFIER" },
  { nom: "écart de 2", mention: "crédit à rendre", statut: "failed", solde: 6, attendu: "À VÉRIFIER", ecart: 2 },
  { nom: "analyse introuvable", mention: "crédit à rendre", statut: null, solde: 4, attendu: "À VÉRIFIER" },
  { nom: "compte introuvable", mention: "crédit à rendre", statut: "failed", solde: null, attendu: "À VÉRIFIER" },
  { nom: "remboursement échoué mais rapport décompté", mention: "crédit à rendre", statut: "completed", reponse: RAPPORT, solde: 4, attendu: "À VÉRIFIER" },
  { nom: "ligne d'avant la réservation (27/09)", statut: "failed", solde: 4, ancienFormat: true, attendu: null },
];

test("crédits à rendre, sur une base d'essai : chaque cas est rangé comme il faut", { skip: !process.env.LV_PGLITE }, async () => {
  const { PGlite } = (await import(process.env.LV_PGLITE as string)) as { PGlite: new () => PGliteDb };
  const db = new PGlite();
  try {
    // Les colonnes lues, aux types de la production (supabase/checks/etat_base.attendu.tsv).
    await db.exec(`
      create table public.profiles (id uuid primary key, credits_remaining integer not null default 0);
      create table public.analyses (id uuid primary key, user_id uuid not null, status text not null, ai_raw_response jsonb,
        created_at timestamptz not null default now(), updated_at timestamptz not null default now());
      create table public.credits_transactions (id uuid primary key default gen_random_uuid(), user_id uuid not null, type text not null,
        amount integer not null, balance_after integer not null, description text, analysis_id uuid, stripe_payment_id text,
        created_at timestamptz not null default now());
    `);
    const analyses = new Map<string, Cas>();
    for (const cas of CAS) {
      const compte = randomUUID();
      const analyse = randomUUID();
      const reservation = `Analyse ${analyse} (lancement ${randomUUID()})`;
      const description = cas.ancienFormat ? `Analyse ${analyse}` : cas.mention ? `${reservation} — ${cas.mention}` : reservation;
      const age = cas.ancienneté ?? "2 days";
      analyses.set(analyse, cas);
      if (cas.solde !== null) await db.query("insert into public.profiles values ($1, $2)", [compte, cas.solde]);
      if (cas.statut) {
        await db.query("insert into public.analyses (id, user_id, status, ai_raw_response) values ($1, $2, $3, $4::jsonb)", [
          analyse, compte, cas.statut, cas.reponse === undefined ? null : JSON.stringify(cas.reponse),
        ]);
      }
      await db.query(`insert into public.credits_transactions (user_id, type, amount, balance_after, description, analysis_id, created_at)
        values ($1, 'usage', -1, $2, $3, $4, now() - interval '${age}')`, [compte, SOLDE_APRES_RESERVATION, description, analyse]);
      let solde = SOLDE_APRES_RESERVATION + (cas.ecart ?? 0);
      for (const [i, ligne] of (cas.apres ?? []).entries()) {
        solde += ligne.montant;
        const texte = ligne.cite === "ce lancement" ? `Crédit rendu — à la main — ${reservation}`
          : ligne.cite === "un autre lancement" ? `Crédit rendu — échec de l'analyse — Analyse ${randomUUID()} (lancement ${randomUUID()})`
          : `Achat de ${ligne.montant} crédits`;
        await db.query(`insert into public.credits_transactions (user_id, type, amount, balance_after, description, created_at)
          values ($1, $2, $3, $4, $5, now() - interval '${age}' + interval '${i + 1} minutes')`, [compte, ligne.type, ligne.montant, solde, texte]);
      }
    }

    const { rows } = await db.query(SQL);
    const [bilan, ...lignes] = rows;
    assert.equal(bilan.ligne, "BILAN");

    // Chaque cas : présent sous la bonne ligne, ou absent.
    const vues = new Map(lignes.map((r) => [String(r.analyse), r]));
    const ecarts: string[] = [];
    for (const [analyse, cas] of analyses) {
      const vue = vues.get(analyse);
      if ((vue?.ligne ?? null) !== cas.attendu) ecarts.push(`${cas.nom} : attendu ${cas.attendu}, obtenu ${vue?.ligne ?? "absent"} (${vue?.rapport ?? ""}, écart ${vue?.["écart"] ?? ""})`);
      if (vue && cas.ecart !== undefined && Number(vue["écart"]) !== cas.ecart) ecarts.push(`${cas.nom} : écart ${vue["écart"]}`);
    }
    assert.deepEqual(ecarts, []);
    assert.equal(lignes.length, CAS.filter((c) => c.attendu !== null).length);

    // Le bilan compte les lancements contrôlés (hors lancement en cours et ligne d'avant le 27/09), puis chaque ligne.
    const compte = (ligne: string) => CAS.filter((c) => c.attendu === ligne).length;
    const controles = CAS.filter((c) => !c.ancienFormat && c.ancienneté !== "5 minutes").length;
    assert.equal(bilan["à faire"], `${controles} lancement(s) contrôlé(s) depuis le 27/09 : ${compte("À RENDRE")} à rendre, ${compte("À VÉRIFIER")} à vérifier, ${compte("POUR INFORMATION")} pour information`);

    // Ordre : à rendre, à vérifier, pour information ; ce qu'il faut faire, dit pour chaque ligne.
    const ordre = lignes.map((r) => r.ligne);
    assert.deepEqual(ordre, [...ordre].sort((a, b) => ["À RENDRE", "À VÉRIFIER", "POUR INFORMATION"].indexOf(String(a)) - ["À RENDRE", "À VÉRIFIER", "POUR INFORMATION"].indexOf(String(b))));
    for (const r of lignes) {
      const attendu = r.ligne === "À RENDRE" ? "Rendre 1 crédit : m'envoyer cette ligne"
        : r.ligne === "À VÉRIFIER" ? "À regarder ensemble avant de rendre quoi que ce soit"
        : r.rapport === "rapport décompté" ? "Rien à rendre : rapport livré et décompté"
        : "Rien à rendre : crédit déjà revenu, sans trace dans le journal";
      assert.equal(r["à faire"], attendu, String(r.cas));
      assert.match(String(r["lancé le"]), /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
    }
    const idDe = new Map([...analyses].map(([id, c]) => [c.nom, id]));
    assert.equal(vues.get(idDe.get("issue inconnue, sous le seuil non décompté") ?? "")?.rapport, "rapport non décompté (trop peu de zones notées)");
    assert.equal(vues.get(idDe.get("issue inconnue, analyse sans résultat") ?? "")?.rapport, "rapport non décompté (analyse sans résultat)");
  } finally {
    await db.close();
  }
});
