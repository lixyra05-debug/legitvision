// La VRAIE route /api/analyze contre un faux PostgREST en mémoire : le crédit
// est réservé avant l'appel au modèle (course au débit) et rendu quand
// l'analyse n'est pas décomptée ; le client ne lit « aucun crédit décompté »
// que si c'est vrai. Scénarios de la relecture adverse du 27/09.
// Coût IA (analysis_costs, migration 020) : une ligne par appel au modèle,
// écrite après la réponse au client, sans jamais changer l'issue de l'analyse.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import Anthropic from "@anthropic-ai/sdk";
import { createFakeSupabase, seedAnalyses, type FakeDb } from "./support/fake-supabase";
import type { CoutIa } from "@/lib/ai/cout-ia";
import { MODELE_ANALYSE } from "@/lib/ai/tarifs";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;

process.env.ANTHROPIC_API_KEY = "sk-test";

type ModelResult = Record<string, unknown>;
type Tache = () => Promise<void>;
const current: {
  userId: string;
  client: unknown;
  model: () => Promise<ModelResult>;
  photoValid: boolean;
  /** Tâches remises à après la réponse (after de Next) : exécutées par apresLaReponse(). */
  apres: Tache[];
} = { userId: "", client: null, model: async () => ({}), photoValid: true, apres: [] };

const reel = (await import(module("lib/ai/analyze.ts"))) as typeof import("@/lib/ai/analyze");
// Même instance que celle de la route : le coût rattaché à une erreur la suit.
const couts = (await import(module("lib/ai/cout-ia.ts"))) as typeof import("@/lib/ai/cout-ia");
mock.module(module("lib/apres-reponse.ts"), {
  namedExports: { apresReponse: (tache: Tache) => { current.apres.push(tache); } },
});
mock.module(module("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: current.userId } } }) } }),
  },
});
mock.module(module("lib/supabase/admin.ts"), { namedExports: { createAdminClient: () => current.client } });
mock.module(module("lib/ai/analyze.ts"), {
  namedExports: {
    ...reel,
    runAnalysis: () => current.model(),
    validateImageBuffer: async () =>
      current.photoValid ? { valid: true } : { valid: false, reason: "La photo « Semelle » est trop petite." },
  },
});
const { POST } = (await import(module("app/api/analyze/route.ts"))) as typeof import("@/app/api/analyze/route");

let n = 0;
function setup(credits: number, analyses: string[]): { db: FakeDb; userId: string } {
  const userId = `user-${++n}`;
  const { db, client } = createFakeSupabase(seedAnalyses({ userId, credits, analyses }));
  current.userId = userId;
  current.client = client;
  current.photoValid = true;
  current.apres = [];
  return { db, userId };
}

async function post(analysisId: string, extra: Record<string, unknown> = {}) {
  const res = await POST({ json: async () => ({ analysisId, ...extra }) } as never);
  return { status: res.status, body: (await res.json()) as { error?: string; code?: string; overallScore?: number | null; insufficient?: boolean } };
}

// Coût mesuré d'un appel : 20 000 jetons d'entrée, 4 000 de sortie dont 3 000 de réflexion, 0,2 $.
const COUT = couts.mesurerCoutIa({
  model: "claude-opus-4-8",
  stop_reason: "end_turn",
  _request_id: "req_route",
  usage: { input_tokens: 20_000, output_tokens: 4_000, output_tokens_details: { thinking_tokens: 3_000 }, inference_geo: "global" },
});

const ok = (extra: ModelResult = {}): ModelResult => ({
  overallScore: 88, confidence: "high", verdict: "likely_authentic", insufficient: false,
  subScores: { sole: 88 }, findings: [{ zone: "sole", observation: "ok", score: 88 }],
  aiRawResponse: { confidence_level: "high", analyst_summary: "…", missing_evidence: [] }, coutIa: COUT, ...extra,
});
const A = (i: number) => `00000000-0000-4000-8000-00000000000${i}`;
const refunds = (db: FakeDb) => db.credits_transactions.filter((t) => t.type === "refund");
const usages = (db: FakeDb) => db.credits_transactions.filter((t) => t.type === "usage");
const AUCUN_CREDIT = /Aucun crédit n'a été décompté/;
const COUT_NON_ENREGISTRE = "[analyze] coût IA non enregistré";

/** Coupe console.error/warn pendant un scénario (les échecs voulus journalisent). */
async function silence<T>(fn: () => Promise<T>): Promise<T> {
  const e = console.error, w = console.warn;
  console.error = () => {};
  console.warn = () => {};
  try { return await fn(); } finally { console.error = e; console.warn = w; }
}

/** Exécute, dans l'ordre, ce que la route a remis à après sa réponse. */
async function apresLaReponse(): Promise<void> {
  for (let tache = current.apres.shift(); tache; tache = current.apres.shift()) await tache();
}

/** Lignes de analysis_costs, sans id ni created_at (valeurs par défaut de la table). */
const lignesCout = (db: FakeDb) => db.analysis_costs.map(({ id: _id, created_at: _creeLe, ...ligne }) => ligne);

/** Erreur levée après la réponse du modèle, qui emporte le coût de l'appel (comme dans runAnalysis). */
function echecApresReponse(code: string, message: string, cout: CoutIa = COUT): Error {
  const erreur = new reel.AnalysisError(message, code);
  couts.rattacherCoutIa(erreur, cout);
  return erreur;
}
const ILLISIBLE = "L'IA a renvoyé une réponse illisible. Aucun crédit n'a été décompté : relancez l'analyse.";

test("1 crédit, 3 analyses lancées ensemble : une seule passe au modèle", async () => {
  const { db } = setup(1, [A(1), A(2), A(3)]);
  let appels = 0;
  current.model = async () => { appels++; return ok(); };
  const r = await silence(() => Promise.all([post(A(1)), post(A(2)), post(A(3))]));
  assert.equal(appels, 1);
  assert.deepEqual(r.map((x) => x.status).sort(), [200, 402, 402]);
  assert.equal(db.profiles[0].credits_remaining, 0);
});

test("rapport enregistré : crédit décompté, réservation marquée « rapport enregistré »", async () => {
  const { db } = setup(2, [A(1)]);
  current.model = async () => ok();
  const r = await post(A(1));
  assert.equal(r.status, 200);
  assert.equal(db.profiles[0].credits_remaining, 1);
  const usage = db.credits_transactions.filter((t) => t.type === "usage");
  assert.equal(usage.length, 1);
  assert.match(String(usage[0].description), /— rapport enregistré$/);
});

test("échec du modèle : crédit rendu une fois, message « aucun crédit »", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => { throw new reel.AnalysisError(reel.ANALYSIS_TIMEOUT_MESSAGE, "ANALYSIS_TIMEOUT"); };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(refunds(db).length, 1);
  assert.equal(db.analyses[0].status, "failed");
});

test("base injoignable après l'appel au modèle : jamais « aucun crédit », le client sait quoi faire", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => {
    db.faults.push(() => ({ error: { message: "TypeError: fetch failed" } }));
    return ok();
  };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "REFUND_PENDING");
  assert.doesNotMatch(r.body.error ?? "", AUCUN_CREDIT);
  assert.match(r.body.error ?? "", /legitvision\.contact@gmail\.com/);
});

test("remboursement refusé à l'écriture : pas rejoué, le client est prévenu", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => { throw new Error("boom"); };
  db.faults.push((c) => (c.table === "profiles" && c.op === "update" ? { commitThenError: { message: "fetch failed" } } : undefined));
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "REFUND_PENDING");
  assert.equal(db.profiles[0].credits_remaining, 1, "rendu une seule fois, même si la réponse s'est perdue");
  assert.equal(db.calls.filter((c) => c.table === "profiles" && c.op === "update").length, 1);
  assert.match(String(usages(db)[0].description), /— remboursement incertain : vérifier le solde$/, "trace pour le support");
});

test("réservation validée mais réponse perdue : crédit rendu, modèle jamais appelé", async () => {
  const { db } = setup(1, [A(1)]);
  db.faults.push((c) => (c.table === "rpc" ? { commitThenError: { message: "TypeError: fetch failed" } } : undefined));
  let appels = 0;
  current.model = async () => { appels++; return ok(); };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 503);
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(appels, 0);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(refunds(db).length, 1);
  assert.equal(db.analyses[0].status, "failed");
});

test("réservation en erreur sans écriture : rien à rendre, même si un lancement antérieur a débité", async () => {
  const { db, userId } = setup(1, [A(1)]);
  // Lancement antérieur de la même analyse (statut remis à « pending » par l'utilisateur).
  db.credits_transactions.push({ id: "old", user_id: userId, type: "usage", amount: -1, analysis_id: A(1), description: `Analyse ${A(1)} (lancement ancien) — rapport enregistré` });
  db.faults.push((c) => (c.table === "rpc" ? { error: { message: "TypeError: fetch failed" } } : undefined));
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 503);
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(refunds(db).length, 0, "le débit du lancement antérieur n'est pas rendu");
});

test("rapport enregistré mais réponse perdue : le rapport est dû, rien n'est rendu", async () => {
  const { db } = setup(1, [A(1)]);
  db.faults.push((c) => (c.table === "analyses" && c.op === "update" && c.values?.overall_score != null ? { commitThenError: { message: "TypeError: fetch failed" } } : undefined));
  current.model = async () => ok();
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 200, "le client est envoyé vers son rapport");
  assert.equal(db.analyses[0].status, "completed");
  assert.equal(db.profiles[0].credits_remaining, 0);
  assert.equal(refunds(db).length, 0);
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "report", failure_code: null }], "coût d'un rapport dû");
});

test("photos insuffisantes : crédit rendu, rien de ce que le modèle a dit n'est gardé hormis le motif", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => ok({
    insufficient: true, confidence: "low", verdict: "inconclusive", overallScore: 71,
    aiRawResponse: { confidence_level: "insufficient", missing_evidence: ["étiquette"], analyst_summary: "détail payant" },
  });
  const r = await post(A(1));
  assert.equal(r.status, 200);
  assert.equal(r.body.insufficient, true);
  assert.equal(r.body.overallScore, null);
  assert.equal(db.profiles[0].credits_remaining, 1);
  const a = db.analyses[0];
  assert.equal(a.overall_score, null);
  assert.equal(a.sub_scores, null);
  assert.equal(a.findings, null);
  assert.deepEqual(a.ai_raw_response, { confidence_level: "insufficient", missing_evidence: ["étiquette"] });
  await apresLaReponse();
  assert.deepEqual(
    lignesCout(db),
    [{ ...COUT, analysis_id: A(1), outcome: "insufficient", failure_code: null }],
    "le coût va dans analysis_costs, pas dans le rapport"
  );
});

test("photo refusée par la validation serveur : aucune réservation", async () => {
  const { db } = setup(1, [A(1)]);
  current.photoValid = false;
  current.model = async () => ok();
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 400);
  assert.match(r.body.error ?? "", /aucun crédit n'a été décompté/);
  assert.equal(db.calls.filter((c) => c.table === "rpc").length, 0);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(db.analyses[0].status, "failed");
});

test("chemin de photo hors du dossier de l'analyse, encodé ou non : refusé avant tout lancement", async () => {
  for (const chemin of [
    (u: string) => `autre-utilisateur/${A(1)}/sole.jpg`,
    (u: string) => `${u}/${A(1)}/%2e%2e/%2e%2e/victime/${A(2)}/sole.jpg`,
    (u: string) => `${u}/${A(1)}/.%2E/.%2E/victime/${A(2)}/sole.jpg`,
  ]) {
    const { db, userId } = setup(1, [A(1)]);
    db.analysis_photos[0].storage_path = chemin(userId);
    current.model = async () => ok();
    const r = await post(A(1));
    assert.equal(r.status, 400, String(db.analysis_photos[0].storage_path));
    assert.equal(db.analyses[0].status, "pending");
    assert.equal(db.calls.filter((c) => c.table === "storage" || c.table === "rpc").length, 0);
  }
});

test("solde remis en arrière par un déclencheur : remboursement non déclaré réussi", async () => {
  const { db } = setup(1, [A(1)]);
  db.guardRevert = true;
  current.model = async () => { throw new Error("boom"); };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "REFUND_PENDING");
  assert.equal(db.profiles[0].credits_remaining, 0);
  assert.equal(refunds(db).length, 0, "aucune ligne « refund » mensongère");
  assert.match(String(usages(db)[0].description), /— crédit à rendre$/, "trace pour le support");
});

test("statut remis à « pending » pendant l'analyse puis relance : chaque rapport est payé", async () => {
  const { db } = setup(2, [A(1)]);
  let premier = true;
  let relance: Promise<{ status: number }> | undefined;
  current.model = async () => {
    if (premier) {
      premier = false;
      db.analyses[0].status = "pending"; // ce que permettait la base avant la migration 018
      relance = post(A(1));
      await new Promise((r) => setTimeout(r, 30));
      return ok();
    }
    await new Promise((r) => setTimeout(r, 60));
    return ok({ overallScore: 20, verdict: "likely_fake" });
  };
  const r1 = await silence(() => post(A(1)));
  await silence(async () => relance);
  assert.equal(r1.status, 200);
  assert.equal(db.analyses[0].overall_score, 88);
  assert.equal(db.profiles[0].credits_remaining, 0, "deux lancements, deux crédits : aucun rapport gratuit");
});

test("photos insuffisantes, rapport enregistré mais réponse perdue : crédit rendu, réservation non marquée « rapport »", async () => {
  const { db } = setup(1, [A(1)]);
  db.faults.push((c) => (c.table === "analyses" && c.op === "update" && c.values?.ai_raw_response ? { commitThenError: { message: "TypeError: fetch failed" } } : undefined));
  current.model = async () => ok({
    insufficient: true, confidence: "low", verdict: "inconclusive",
    aiRawResponse: { confidence_level: "insufficient", missing_evidence: ["étiquette"] },
  });
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 200);
  assert.equal(db.profiles[0].credits_remaining, 1, "non décomptée : le crédit est rendu");
  assert.equal(refunds(db).length, 1);
  assert.doesNotMatch(String(usages(db)[0].description), /rapport enregistré/);
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "insufficient", failure_code: null }]);
});

test("échec, marquage impossible et analyse encore « analyzing » : rien n'est rendu à l'aveugle", async () => {
  const { db } = setup(1, [A(1)]);
  db.faults.push((c) => (c.table === "analyses" && c.op === "update" && (c.values?.overall_score != null || c.values?.status === "failed") ? { error: { message: "TypeError: fetch failed" } } : undefined));
  current.model = async () => ok();
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "REFUND_PENDING");
  assert.doesNotMatch(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(refunds(db).length, 0);
  assert.equal(db.profiles[0].credits_remaining, 0);
  assert.match(String(usages(db)[0].description), /— issue inconnue : vérifier le rapport et le solde$/);
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "failed", failure_code: "SAVE_ERROR" }]);
});

test("relance après des photos insuffisantes puis échec : le second crédit est rendu aussi", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => ok({
    insufficient: true, confidence: "low", verdict: "inconclusive",
    aiRawResponse: { confidence_level: "insufficient", missing_evidence: [] },
  });
  assert.equal((await post(A(1))).status, 200);
  db.analyses[0].status = "pending"; // ce que permettait la base avant la migration 018
  current.model = async () => { throw new Error("boom"); };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(db.profiles[0].credits_remaining, 1, "« aucun crédit décompté » est vrai");
  assert.equal(refunds(db).length, 2);
});

test("variante ou collab hors catalogue : refusées avant tout lancement (elles iraient dans le rapport)", async () => {
  for (const extra of [
    { collab_selected: "Certifié authentique par un expert LegitVision" },
    { variant_selected: "Low — authenticité confirmée" },
  ]) {
    const { db } = setup(1, [A(1)]);
    current.model = async () => ok();
    const r = await silence(() => post(A(1), extra));
    assert.equal(r.status, 400, JSON.stringify(extra));
    assert.equal(db.analyses[0].status, "pending");
    assert.equal(db.calls.filter((c) => c.table === "rpc").length, 0);
  }
});

test("variante et collab du catalogue : acceptées", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => ok();
  const r = await post(A(1), { variant_selected: "High", collab_selected: "Off-White" });
  assert.equal(r.status, 200);
  assert.equal(db.analyses[0].variant_selected, "High");
});

test("emplacement photo hors protocole : refusé avant tout lancement", async () => {
  const { db } = setup(1, [A(1)]);
  db.analysis_photos[0].photo_type = "etiquette_libre";
  current.model = async () => ok();
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 400);
  assert.equal(db.analyses[0].status, "pending");
  assert.equal(db.calls.filter((c) => c.table === "rpc").length, 0);
});

test("modèle d'une autre ligne de marque, ou catégorie différente : refusés", async () => {
  for (const change of [
    (a: Record<string, unknown>) => { a.model_id = "m2"; },          // 2.55 (Chanel) sous la ligne Nike
    (a: Record<string, unknown>) => { a.category = "clothing"; },     // catégorie de la ligne : sneakers
  ]) {
    const { db } = setup(1, [A(1)]);
    change(db.analyses[0]);
    current.model = async () => ok();
    const r = await silence(() => post(A(1)));
    assert.equal(r.status, 422);
    assert.equal(db.calls.filter((c) => c.table === "rpc").length, 0);
  }
});

// ── Coût IA : une ligne de analysis_costs par appel au modèle, après la réponse ──

test("rapport enregistré : coût enregistré après la réponse, ni dans le rapport ni dans la réponse", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => ok();
  const r = await post(A(1));
  assert.equal(r.status, 200);
  assert.equal(db.analysis_costs.length, 0, "rien n'est écrit avant la réponse au client");
  assert.equal(current.apres.length, 1);
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "report", failure_code: null }]);
  assert.equal(db.calls.at(-1)?.table, "analysis_costs", "dernière écriture, après le rapport et la réservation");
  assert.deepEqual(db.analyses[0].ai_raw_response, ok().aiRawResponse, "le rapport ne porte aucun coût");
  assert.doesNotMatch(JSON.stringify(r.body), /cost|cout|coût|token|jeton/i);
});

test("échec après la réponse du modèle (PARSE_ERROR) : coût mesuré avec son code, crédit rendu, « aucun crédit »", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => { throw echecApresReponse("PARSE_ERROR", ILLISIBLE); };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "PARSE_ERROR");
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(refunds(db).length, 1);
  assert.equal(db.analyses[0].status, "failed");
  assert.equal(db.analysis_costs.length, 0, "rien avant la réponse");
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "failed", failure_code: "PARSE_ERROR" }]);
  assert.equal(db.analyses[0].ai_raw_response, undefined, "l'échec n'écrit rien dans le rapport");
});

test("coupé à l'échéance après l'envoi : appel non mesuré enregistré (jetons et coût nuls)", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => {
    throw echecApresReponse("ANALYSIS_TIMEOUT", reel.ANALYSIS_TIMEOUT_MESSAGE, couts.coutIaNonMesure(MODELE_ANALYSE));
  };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(refunds(db).length, 1);
  await apresLaReponse();
  const [ligne] = lignesCout(db);
  assert.deepEqual(ligne, { ...couts.coutIaNonMesure(MODELE_ANALYSE), analysis_id: A(1), outcome: "failed", failure_code: "ANALYSIS_TIMEOUT" });
  assert.equal(ligne.measured, false);
  assert.equal(ligne.cost_usd, null);
  assert.equal(ligne.input_tokens, null);
});

test("connexion perdue après l'envoi, ou corps de la réponse coupé : appel non mesuré enregistré, code UNKNOWN", async () => {
  for (const erreur of [new Anthropic.APIConnectionError({ cause: new TypeError("fetch failed") }), new TypeError("terminated")]) {
    const { db } = setup(1, [A(1)]);
    current.model = async () => {
      couts.rattacherCoutIa(erreur, couts.coutIaNonMesure(MODELE_ANALYSE));
      throw erreur;
    };
    const r = await silence(() => post(A(1)));
    assert.equal(r.status, 500, erreur.message);
    assert.equal(r.body.code, "UNKNOWN", erreur.message);
    assert.match(r.body.error ?? "", AUCUN_CREDIT);
    assert.equal(refunds(db).length, 1);
    assert.equal(db.analysis_costs.length, 0, "rien avant la réponse");
    await apresLaReponse();
    assert.deepEqual(
      lignesCout(db),
      [{ ...couts.coutIaNonMesure(MODELE_ANALYSE), analysis_id: A(1), outcome: "failed", failure_code: "UNKNOWN" }],
      erreur.message
    );
  }
});

test("échec avant toute réponse du modèle (429 du service, photo illisible, échéance passée) : aucune ligne", async () => {
  for (const erreur of [
    Object.assign(new Error("429 rate_limit_error"), { status: 429 }),
    new reel.AnalysisError("Impossible de traiter la photo « Semelle ». Aucun crédit n'a été décompté.", "IMAGE_PROCESSING_ERROR"),
    new reel.AnalysisError(reel.ANALYSIS_TIMEOUT_MESSAGE, "ANALYSIS_TIMEOUT"),
  ]) {
    const { db } = setup(1, [A(1)]);
    current.model = async () => { throw erreur; };
    const r = await silence(() => post(A(1)));
    assert.equal(r.status, 500, erreur.message);
    assert.match(r.body.error ?? "", AUCUN_CREDIT);
    assert.equal(current.apres.length, 0, `rien à enregistrer : ${erreur.message}`);
    await apresLaReponse();
    assert.equal(db.analysis_costs.length, 0);
  }
});

test("rapport non enregistré (SAVE_ERROR) : l'échec garde le coût mesuré", async () => {
  const { db } = setup(1, [A(1)]);
  db.faults.push((c) => (c.table === "analyses" && c.op === "update" && c.values?.overall_score != null ? { error: { message: "TypeError: fetch failed" } } : undefined));
  current.model = async () => ok();
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "SAVE_ERROR");
  assert.match(r.body.error ?? "", AUCUN_CREDIT);
  assert.equal(db.profiles[0].credits_remaining, 1);
  assert.equal(db.analyses[0].status, "failed");
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "failed", failure_code: "SAVE_ERROR" }]);
});

test("analyse reprise en échec pendant l'appel (ANALYSIS_EXPIRED) : coût mesuré enregistré", async () => {
  const { db } = setup(1, [A(1)]);
  current.model = async () => {
    db.analyses[0].status = "failed"; // reprise des analyses bloquées (lib/analysis-stale.ts)
    return ok();
  };
  const r = await silence(() => post(A(1)));
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "ANALYSIS_EXPIRED");
  assert.equal(refunds(db).length, 1);
  await apresLaReponse();
  assert.deepEqual(lignesCout(db), [{ ...COUT, analysis_id: A(1), outcome: "failed", failure_code: "ANALYSIS_EXPIRED" }]);
});

/** Coupe le journal pendant fn et rend les avertissements « coût IA non enregistré ». */
async function avertissementsCout<T>(fn: () => Promise<T>): Promise<{ valeur: T; avertissements: unknown[][] }> {
  const e = console.error, w = console.warn;
  const avertissements: unknown[][] = [];
  console.error = () => {};
  console.warn = (...args: unknown[]) => { if (args[0] === COUT_NON_ENREGISTRE) avertissements.push(args); };
  try { return { valeur: await fn(), avertissements }; } finally { console.error = e; console.warn = w; }
}

/** Le client Supabase lève (au lieu de rendre une erreur) dès qu'on vise cette table. */
function leverSur(table: string): void {
  const client = current.client as { from: (t: string) => unknown };
  const from = client.from;
  client.from = (t: string) => {
    if (t === table) throw new Error("client en panne");
    return from(t);
  };
}

/** Une analyse jouée jusqu'au bout, tâches d'après la réponse comprises : ce qu'en voient le client et la base. */
async function jouer(modele: () => Promise<ModelResult>, panne?: (db: FakeDb) => void) {
  const { db } = setup(1, [A(1)]);
  panne?.(db);
  current.model = modele;
  const { valeur: r, avertissements } = await avertissementsCout(async () => {
    const reponse = await post(A(1));
    await apresLaReponse();
    return reponse;
  });
  return {
    issue: {
      status: r.status,
      body: r.body,
      analyse: db.analyses[0].status,
      rapport: db.analyses[0].ai_raw_response ?? null,
      credits: db.profiles[0].credits_remaining,
      remboursements: refunds(db).length,
      reservation: usages(db).map((t) => String(t.description).replace(/lancement [0-9a-f-]+/, "lancement …")),
    },
    lignes: db.analysis_costs.length,
    avertissements,
  };
}

test("coût non enregistré (table absente avant la 020, base injoignable, exception) : statut, remboursement et réponse inchangés", async () => {
  const pannes: Array<[string, (db: FakeDb) => void]> = [
    ["table absente", (db) => db.faults.push((c) => (c.table === "analysis_costs" ? { error: { code: "PGRST205", message: "Could not find the table 'public.analysis_costs' in the schema cache" } } : undefined))],
    ["base injoignable", (db) => db.faults.push((c) => (c.table === "analysis_costs" ? { error: { message: "TypeError: fetch failed" } } : undefined))],
    ["exception du client", () => leverSur("analysis_costs")],
  ];
  const scenarios: Array<[string, () => Promise<ModelResult>]> = [
    ["rapport", async () => ok()],
    ["photos insuffisantes", async () => ok({
      insufficient: true, confidence: "low", verdict: "inconclusive",
      aiRawResponse: { confidence_level: "insufficient", missing_evidence: ["étiquette"] },
    })],
    ["échec après la réponse", async () => { throw echecApresReponse("PARSE_ERROR", ILLISIBLE); }],
  ];
  for (const [scenario, modele] of scenarios) {
    const reference = await jouer(modele);
    assert.equal(reference.lignes, 1, scenario);
    assert.deepEqual(reference.avertissements, [], scenario);
    for (const [panne, poser] of pannes) {
      const obtenu = await jouer(modele, poser);
      assert.deepEqual(obtenu.issue, reference.issue, `${scenario}, ${panne} : issue inchangée`);
      assert.equal(obtenu.lignes, 0, `${scenario}, ${panne}`);
      assert.deepEqual(
        obtenu.avertissements,
        [[COUT_NON_ENREGISTRE, { analysisId: A(1), cost_usd: COUT.cost_usd }]],
        `${scenario}, ${panne} : journalisé, sans autre donnée`
      );
    }
  }
});
