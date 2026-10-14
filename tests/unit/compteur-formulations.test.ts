// Compteur hebdomadaire des formulations interdites (décision d'Hector du 13/10) :
// supabase/checks/compteur-formulations.sql, une requête en lecture seule lancée
// chaque semaine sur les vrais rapports. Elle reprend en SQL les motifs de
// lib/forbidden-wording.ts.
// Ce test échoue si le fichier contient autre chose qu'une requête de lecture,
// ou, quand un PostgreSQL d'essai est disponible (LV_PGLITE), si la requête
// range une phrase autrement que lib/forbidden-wording.ts : famille par
// famille, hors guillemets et entre guillemets ; et si un conseil d'achat que
// lib/purchase-advice.ts reconnaît échappe à la liste « à lire ».
//
// Banc :  LV_PGLITE=/chemin/vers/@electric-sql/pglite/dist/index.js node … --test tests/unit/compteur-formulations.test.ts
// (PGlite 0.3.x ; « npx @electric-sql/pglite » l'installe dans le cache de npx.) Sans LV_PGLITE, le banc est sauté.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { forbiddenWordings, type ForbiddenWording } from "@/lib/forbidden-wording";
import { isPurchaseAdvice } from "@/lib/purchase-advice";
import { AUTRES_TEXTES, CONSEILS_D_ACHAT, VERIFICATIONS } from "./support/phrases-formulations";

const SQL = readFileSync(new URL("../../supabase/checks/compteur-formulations.sql", import.meta.url), "utf8");

/** Le nom que la requête donne à chaque famille de lib/forbidden-wording.ts (le conseil d'achat a sa propre liste, « à lire »). */
const NOMS: Record<Exclude<ForbiddenWording, "purchase_advice">, string> = {
  probability: "probabilité",
  certification: "certification ou garantie",
  fraud: "frauduleux",
  scam: "arnaque",
  score: "score cité",
};

test("compteur : le fichier ne contient qu'une requête, qui ne fait que lire public.analyses", () => {
  const nu = SQL.replace(/^\s*--.*$/gm, "").replace(/\$re\$[\s\S]*?\$re\$/g, "''").trim();
  assert.equal((nu.match(/;/g) ?? []).length, 1, "une seule instruction");
  assert.ok(nu.endsWith(";") && /^with\b/i.test(nu), "une requête « with … select »");
  assert.doesNotMatch(nu, /\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|do|lock|set|call|execute|into)\b/i);
  // Une seule table lue.
  assert.deepEqual([...new Set((nu.match(/\bpublic\.\w+/g) ?? []))], ["public.analyses"]);
  // La dernière ligne dit quel fichier c'est : l'éditeur la montre après un collage.
  assert.equal(SQL.trimEnd().split("\n").pop(), "-- FIN — compteur hebdomadaire des formulations interdites (lecture seule)");
  // Chaque famille de lib/forbidden-wording.ts a sa ligne, sous le nom attendu.
  for (const nom of Object.values(NOMS)) assert.ok(SQL.includes(`'${nom}'`), nom);
});

/** Ce que lib/forbidden-wording.ts voit dans ce qu'un texte recopie entre guillemets. */
function entreGuillemets(texte: string): ForbiddenWording[] {
  const cites = [...texte.matchAll(/«([^«»]{0,120})»|“([^“”]{0,120})”|"([^"]{0,120})"/g)].map((m) => m[1] ?? m[2] ?? m[3] ?? "");
  return forbiddenWordings(cites.join(" ")).filter((f) => f !== "purchase_advice");
}

test("compteur, sur une base d'essai : chaque phrase est rangée comme par lib/forbidden-wording.ts", { skip: !process.env.LV_PGLITE }, async () => {
  const { PGlite } = (await import(process.env.LV_PGLITE as string)) as { PGlite: new () => { exec(sql: string): Promise<unknown>; query(sql: string, params?: unknown[]): Promise<{ rows: Array<Record<string, unknown>> }>; close(): Promise<void> } };
  const db = new PGlite();
  try {
    await db.exec("create table public.analyses (id uuid primary key, status text not null, created_at timestamptz not null, findings jsonb, ai_raw_response jsonb);");
    const phrases = [...new Set([...CONSEILS_D_ACHAT, ...VERIFICATIONS, ...AUTRES_TEXTES])];
    assert.ok(phrases.length > 170, String(phrases.length));
    // Une analyse par phrase ; la phrase va tour à tour dans chacun des quatre champs.
    for (const [i, phrase] of phrases.entries()) {
      const reponse: Record<string, unknown> = {};
      let observations: unknown = [];
      if (i % 4 === 0) reponse.analyst_summary = phrase;
      if (i % 4 === 1) observations = [{ zone: "z", observation: phrase, score: 50 }];
      if (i % 4 === 2) reponse.recommendations = [phrase];
      if (i % 4 === 3) reponse.missing_evidence = [phrase];
      await db.query("insert into public.analyses values ($1, $2, now() - interval '1 day', $3::jsonb, $4::jsonb)", [randomUUID(), i % 2 ? "completed" : "expert_review", JSON.stringify(observations), JSON.stringify(reponse)]);
    }
    // Ce que la requête ne doit pas compter : une analyse non terminée, une analyse de plus de 7 jours, des réponses mal formées.
    const HORS = "Article frauduleux, arnaque certifiée, score de 12/100.";
    await db.query("insert into public.analyses values ($1, 'failed', now(), '[]'::jsonb, $2::jsonb)", [randomUUID(), JSON.stringify({ analyst_summary: HORS })]);
    await db.query("insert into public.analyses values ($1, 'completed', now() - interval '8 days', '[]'::jsonb, $2::jsonb)", [randomUUID(), JSON.stringify({ analyst_summary: HORS })]);
    for (const malformee of ['"texte"', "[1, 2]", "12", "null", '{"analyst_summary": 3, "recommendations": "une seule", "missing_evidence": {"a": 1}}']) {
      await db.query("insert into public.analyses values ($1, 'completed', now(), $2::jsonb, $3::jsonb)", [randomUUID(), '{"zone": "z"}', malformee]);
    }
    await db.query("insert into public.analyses values ($1, 'completed', now(), $2::jsonb, null)", [randomUUID(), JSON.stringify([3, null, "texte", { zone: "z" }, { observation: 4 }])]);

    const { rows } = await db.query(SQL);
    const hors = new Map<string, Set<string>>();
    const entre = new Map<string, Set<string>>();
    const achat = new Set<string>();
    for (const r of rows) {
      const texte = String(r.texte);
      if (r.rubrique === "CAS") hors.set(texte, (hors.get(texte) ?? new Set()).add(String(r.famille)));
      if (r.rubrique === "ENTRE GUILLEMETS, À RELIRE") entre.set(texte, (entre.get(texte) ?? new Set()).add(String(r.famille)));
      if (r.rubrique === "ACHAT OU PAIEMENT, À LIRE") achat.add(texte);
    }
    assert.ok(!hors.has(HORS) && !entre.has(HORS), "une analyse non terminée ou de plus de 7 jours est comptée");

    const noms = (familles: ForbiddenWording[]) => familles.filter((f) => f !== "purchase_advice").map((f) => NOMS[f as keyof typeof NOMS]).sort();
    let ecarts = 0;
    for (const phrase of phrases) {
      const attenduHors = noms(forbiddenWordings(phrase));
      const attenduEntre = noms(entreGuillemets(phrase));
      const vuHors = [...(hors.get(phrase) ?? [])].sort();
      const vuEntre = [...(entre.get(phrase) ?? [])].sort();
      if (JSON.stringify(vuHors) !== JSON.stringify(attenduHors) || JSON.stringify(vuEntre) !== JSON.stringify(attenduEntre)) {
        ecarts++;
        console.log(`ÉCART « ${phrase} » : hors guillemets ${JSON.stringify(vuHors)} (attendu ${JSON.stringify(attenduHors)}), entre guillemets ${JSON.stringify(vuEntre)} (attendu ${JSON.stringify(attenduEntre)})`);
      }
    }
    assert.equal(ecarts, 0, `${ecarts} phrase(s) rangée(s) autrement que par lib/forbidden-wording.ts`);

    // La liste « à lire » ratisse large : aucun conseil d'achat reconnu par le site ne lui échappe.
    const echappes = phrases.filter((p) => isPurchaseAdvice(p) && !achat.has(p));
    assert.deepEqual(echappes, [], "conseils d'achat absents de la liste « à lire »");
    // Et un document demandé au vendeur n'y entre pas à lui seul : sinon la liste noierait les vrais cas.
    const DOCUMENTS = [
      "Demandez la preuve d'achat au vendeur : elle complète utilement ce résultat.",
      "Comparez le code produit avec celui de la preuve d'achat.",
      "Demandez la date et le lieu d'achat au vendeur.",
      "Vérifier la date d'achat sur la facture ou le ticket de caisse.",
      "Demander la facture d'achat sur papier à en-tête de la boutique.",
      "Le reçu de paiement par carte confirme la date d'achat.",
    ];
    for (const document of DOCUMENTS) {
      assert.ok(phrases.includes(document), `phrase d'essai disparue : « ${document} »`);
      assert.ok(!achat.has(document), `« ${document} » dans la liste « à lire »`);
    }
    // Une phrase qui parle d'acheter sans rien conseiller y entre : c'est la lecture qui tranche.
    for (const aLire of ["Avant tout achat, faites contrôler l'article par un expert indépendant.", "Si vous l'achetez en ligne, demandez des photos datées."]) {
      assert.ok(phrases.includes(aLire) && achat.has(aLire), `« ${aLire} » absente de la liste « à lire »`);
    }

    // Le bilan et les lignes par famille sont cohérents avec les cas listés.
    const bilan = rows.find((r) => r.rubrique === "BILAN");
    assert.match(String(bilan?.texte), new RegExp(`: ${phrases.length + 6} rapport\\(s\\) terminé\\(s\\), ${phrases.length} texte\\(s\\) lus\\. Formulations interdites hors guillemets : ${hors.size} texte\\(s\\)`));
    assert.ok(String(bilan?.texte).includes(`Entre guillemets, à relire : ${entre.size} texte(s). Achat ou paiement, à lire : ${achat.size} texte(s).`), String(bilan?.texte));
    const lignesFamilles = rows.filter((r) => r.rubrique === "FAMILLE");
    assert.deepEqual(lignesFamilles.map((r) => r.famille), Object.values(NOMS));
    for (const ligne of lignesFamilles) {
      const h = [...hors.values()].filter((s) => s.has(String(ligne.famille))).length;
      const e = [...entre.values()].filter((s) => s.has(String(ligne.famille))).length;
      assert.equal(ligne.texte, `hors guillemets : ${h} texte(s), entre guillemets : ${e} texte(s)`, String(ligne.famille));
    }
    console.log(`compteur : ${phrases.length} phrases, ${hors.size} avec une formulation hors guillemets, ${entre.size} entre guillemets, ${achat.size} à lire pour l'achat (dont ${phrases.filter((p) => achat.has(p) && !isPurchaseAdvice(p)).length} qui ne sont pas des conseils)`);
  } finally {
    await db.close();
  }
});
