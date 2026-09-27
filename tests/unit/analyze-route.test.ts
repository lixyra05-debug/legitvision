// La VRAIE route /api/analyze contre un faux PostgREST en mémoire : le crédit
// est réservé avant l'appel au modèle (course au débit) et rendu quand
// l'analyse n'est pas décomptée ; le client ne lit « aucun crédit décompté »
// que si c'est vrai. Scénarios de la relecture adverse du 27/09.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createFakeSupabase, seedAnalyses, type FakeDb } from "./support/fake-supabase";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;

process.env.ANTHROPIC_API_KEY = "sk-test";

type ModelResult = Record<string, unknown>;
const current: {
  userId: string;
  client: unknown;
  model: () => Promise<ModelResult>;
  photoValid: boolean;
} = { userId: "", client: null, model: async () => ({}), photoValid: true };

const reel = (await import(module("lib/ai/analyze.ts"))) as typeof import("@/lib/ai/analyze");
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
  return { db, userId };
}

async function post(analysisId: string, extra: Record<string, unknown> = {}) {
  const res = await POST({ json: async () => ({ analysisId, ...extra }) } as never);
  return { status: res.status, body: (await res.json()) as { error?: string; code?: string; overallScore?: number | null; insufficient?: boolean } };
}

const ok = (extra: ModelResult = {}): ModelResult => ({
  overallScore: 88, confidence: "high", verdict: "likely_authentic", insufficient: false,
  subScores: { sole: 88 }, findings: [{ zone: "sole", observation: "ok", score: 88 }],
  aiRawResponse: { confidence_level: "high", analyst_summary: "…", missing_evidence: [] }, ...extra,
});
const A = (i: number) => `00000000-0000-4000-8000-00000000000${i}`;
const refunds = (db: FakeDb) => db.credits_transactions.filter((t) => t.type === "refund");
const usages = (db: FakeDb) => db.credits_transactions.filter((t) => t.type === "usage");
const AUCUN_CREDIT = /Aucun crédit n'a été décompté/;

/** Coupe console.error/warn pendant un scénario (les échecs voulus journalisent). */
async function silence<T>(fn: () => Promise<T>): Promise<T> {
  const e = console.error, w = console.warn;
  console.error = () => {};
  console.warn = () => {};
  try { return await fn(); } finally { console.error = e; console.warn = w; }
}

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
