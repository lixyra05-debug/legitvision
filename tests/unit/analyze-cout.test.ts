// runAnalysis capte le coût de l'appel au modèle dès sa réponse : il est rendu
// avec le rapport, ou emporté par l'erreur levée ensuite (réponse tronquée,
// vide, illisible, incomplète). Requête partie puis perdue sans réponse
// lisible (échéance, connexion perdue, corps coupé) : appel non mesuré. Aucune
// requête partie, ou erreur HTTP du service à chaque tentative : aucun coût.
// Aucun appel à l'API Anthropic : un serveur HTTP local, sur 127.0.0.1, joue l'API.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import Anthropic from "@anthropic-ai/sdk";

type Handler = (req: IncomingMessage, res: ServerResponse) => void;
type Analyse = typeof import("@/lib/ai/analyze");
type Couts = typeof import("@/lib/ai/cout-ia");

const USAGE = {
  input_tokens: 20_000,
  output_tokens: 4_000,
  cache_creation_input_tokens: 0,
  cache_read_input_tokens: 0,
  cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
  output_tokens_details: { thinking_tokens: 3_000 },
  inference_geo: "global",
  service_tier: "standard",
};

const RAPPORT = {
  overall_score: 82,
  confidence_level: "high",
  verdict: "likely_authentic",
  sub_scores: { stitching: 82 },
  findings: [],
  missing_evidence: [],
  ocr_extracted: {},
  recommendations: [],
  analyst_summary: "Coutures régulières.",
};

/** Réponse de l'API Messages (200) : texte donné, ou aucun bloc texte si null. */
function message(texte: string | null, extra: Record<string, unknown> = {}) {
  return {
    id: "msg_test",
    type: "message",
    role: "assistant",
    model: "claude-opus-4-8",
    content: texte === null ? [{ type: "thinking", thinking: "", signature: "sig" }] : [{ type: "text", text: texte }],
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: USAGE,
    ...extra,
  };
}

describe("coût de l'appel au modèle, capté par runAnalysis", () => {
  let handler: Handler = () => {};
  let requetes = 0;
  let runAnalysis: Analyse["runAnalysis"];
  let AnalysisError: Analyse["AnalysisError"];
  let couts: Couts;
  const serveur = createServer((req, res) => {
    requetes++;
    handler(req, res);
  });

  before(async () => {
    await new Promise<void>((resolve) => serveur.listen(0, "127.0.0.1", resolve));
    const { port } = serveur.address() as AddressInfo;
    // Clé factice et API locale : aucune requête ne peut partir vers Anthropic.
    process.env.ANTHROPIC_API_KEY = "cle-factice-de-test";
    process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${port}`;
    ({ runAnalysis, AnalysisError } = await import("@/lib/ai/analyze"));
    couts = await import("@/lib/ai/cout-ia");
  });

  after(() => {
    serveur.closeAllConnections();
    serveur.close();
  });

  const ENTREE = {
    images: [],
    brandName: "Nike",
    modelName: "Air Force 1",
    category: "sneakers",
    authenticationPoints: [{ zone: "stitching", label: "Coutures", weight: 1 }],
  };
  const lancer = (delaiMs = 5_000) => runAnalysis({ ...ENTREE, deadline: Date.now() + delaiMs });

  function repondre(corps: unknown, statut = 200): Handler {
    return (_req, res) => {
      res.writeHead(statut, { "content-type": "application/json", "request-id": "req_test_cout" });
      res.end(JSON.stringify(corps));
    };
  }

  /** L'erreur levée par runAnalysis, et le coût qu'elle emporte. */
  async function echec(delaiMs?: number): Promise<{ erreur: unknown; cout: ReturnType<Couts["coutIaDe"]> }> {
    try {
      await lancer(delaiMs);
    } catch (erreur) {
      return { erreur, cout: couts.coutIaDe(erreur) };
    }
    throw new Error("runAnalysis aurait dû échouer");
  }

  test("réponse complète : rapport et coût mesuré (jetons, 0,2 $, identifiant, stop_reason)", async () => {
    handler = repondre(message(JSON.stringify(RAPPORT)));
    const resultat = await lancer();
    assert.equal(resultat.overallScore, 82);
    assert.deepEqual(resultat.coutIa, {
      model: "claude-opus-4-8",
      request_id: "req_test_cout",
      measured: true,
      input_tokens: 20_000,
      output_tokens: 4_000,
      thinking_tokens: 3_000,
      cache_write_5m_tokens: 0,
      cache_write_1h_tokens: 0,
      cache_read_tokens: 0,
      inference_geo: "global",
      cost_usd: 0.2,
      price_list_date: "2026-09-30",
      stop_reason: "end_turn",
    });
    assert.equal("coutIa" in resultat.aiRawResponse, false, "le coût n'entre pas dans le rapport");
  });

  test("réponse tronquée (max_tokens) : MAX_TOKENS, l'erreur emporte le coût", async () => {
    handler = repondre(
      message('{"overall_score": 8', { stop_reason: "max_tokens", usage: { ...USAGE, output_tokens: 16_000 } }),
    );
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "MAX_TOKENS");
    assert.match(erreur.message, /Aucun crédit n'a été décompté/);
    assert.equal(cout?.output_tokens, 16_000);
    // 20 000 × 5 + 16 000 × 25 = 500 000 micro-dollars
    assert.equal(cout?.cost_usd, 0.5);
    assert.equal(cout?.stop_reason, "max_tokens");
  });

  test("texte illisible : PARSE_ERROR avec son coût", async () => {
    handler = repondre(message("Voici mon analyse : tout va bien."));
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "PARSE_ERROR");
    assert.equal(cout?.cost_usd, 0.2);
  });

  test("aucun bloc texte : NO_RESPONSE avec son coût", async () => {
    handler = repondre(message(null));
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "NO_RESPONSE");
    assert.equal(cout?.cost_usd, 0.2);
  });

  test("JSON incomplet : INVALID_RESPONSE avec son coût", async () => {
    handler = repondre(message(JSON.stringify({ overall_score: "élevé" })));
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "INVALID_RESPONSE");
    assert.equal(cout?.cost_usd, 0.2);
  });

  test("JSON null : l'erreur imprévue emporte aussi son coût", async () => {
    handler = repondre(message("null"));
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof Error);
    assert.equal(cout?.measured, true);
    assert.equal(cout?.cost_usd, 0.2);
  });

  test("API muette : ANALYSIS_TIMEOUT, appel parti rattaché comme non mesuré", async () => {
    requetes = 0;
    handler = () => {}; // ne répond jamais
    const { erreur, cout } = await echec(300);
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "ANALYSIS_TIMEOUT");
    assert.equal(requetes, 1);
    assert.deepEqual(cout, couts.coutIaNonMesure("claude-opus-4-8"));
  });

  test("échéance déjà passée : ANALYSIS_TIMEOUT sans coût, rien n'est parti", async () => {
    requetes = 0;
    handler = repondre(message(JSON.stringify(RAPPORT)));
    const { erreur, cout } = await echec(-1);
    assert.ok(erreur instanceof AnalysisError);
    assert.equal(erreur.code, "ANALYSIS_TIMEOUT");
    assert.equal(requetes, 0);
    assert.equal(cout, null);
  });

  test("erreur 400 du service : aucun coût rattaché", async () => {
    requetes = 0;
    handler = repondre({ type: "error", error: { type: "invalid_request_error", message: "max_tokens: invalid" } }, 400);
    const { erreur, cout } = await echec();
    assert.equal((erreur as { status?: number }).status, 400);
    assert.equal(requetes, 1, "400 : pas de nouvelle tentative");
    assert.equal(cout, null);
  });

  /** L'API lit toute la requête, puis la connexion tombe sans réponse. */
  function perdreLaConnexion(req: IncomingMessage): void {
    req.resume();
    req.on("end", () => setTimeout(() => req.socket.destroy(), 20));
  }

  /** Erreur 529 (surcharge) : le SDK retente ; `retry-after-ms` abrège l'attente du test. */
  function surcharge(_req: IncomingMessage, res: ServerResponse): void {
    res.writeHead(529, { "content-type": "application/json", "retry-after-ms": "1" });
    res.end(JSON.stringify({ type: "error", error: { type: "overloaded_error", message: "Overloaded" } }));
  }

  test("connexion perdue après l'envoi, à chaque tentative : APIConnectionError, appel non mesuré", async () => {
    requetes = 0;
    handler = perdreLaConnexion;
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof Anthropic.APIConnectionError, "levée par le SDK après ses nouvelles tentatives");
    assert.equal(requetes, 3, "1 tentative et 2 nouvelles");
    assert.deepEqual(cout, couts.coutIaNonMesure("claude-opus-4-8"));
  });

  test("réponse 200 au corps coupé en lecture : le modèle est allé au bout, appel non mesuré", async () => {
    requetes = 0;
    handler = (req, res) => {
      req.resume();
      req.on("end", () => {
        // L'en-tête annonce 5 000 octets ; la connexion tombe après quelques-uns.
        res.writeHead(200, { "content-type": "application/json", "content-length": "5000", "request-id": "req_coupe" });
        res.write('{"id":"msg_test","type":"message","role":"assistant","model":"claude-opus-4-8","usage":{"input_tokens":20000,');
        setTimeout(() => req.socket.destroy(), 20);
      });
    };
    const { erreur, cout } = await echec();
    assert.ok(erreur instanceof Error);
    assert.equal((erreur as { status?: number }).status, undefined, "pas une réponse d'erreur du service");
    assert.equal(requetes, 1, "réponse reçue : pas de nouvelle tentative");
    assert.deepEqual(cout, couts.coutIaNonMesure("claude-opus-4-8"));
  });

  test("tentative perdue, puis erreur 529 aux suivantes : la tentative perdue compte, appel non mesuré", async () => {
    requetes = 0;
    handler = (req, res) => (requetes === 1 ? perdreLaConnexion(req) : surcharge(req, res));
    const { erreur, cout } = await echec();
    assert.equal((erreur as { status?: number }).status, 529);
    assert.equal(requetes, 3);
    assert.deepEqual(cout, couts.coutIaNonMesure("claude-opus-4-8"));
  });

  test("erreur 529 du service à chaque tentative : aucun coût rattaché", async () => {
    requetes = 0;
    handler = surcharge;
    const { erreur, cout } = await echec();
    assert.equal((erreur as { status?: number }).status, 529);
    assert.equal(requetes, 3, "529 : 2 nouvelles tentatives");
    assert.equal(cout, null);
  });
});
