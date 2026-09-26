// L'appel au modèle doit s'arrêter à l'échéance, même si le SDK ne regarde pas
// le signal (attente entre deux tentatives, consigne Retry-After). Aucun appel
// à l'API Anthropic : un serveur HTTP local, sur 127.0.0.1, joue l'API.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { runWithDeadline } from "@/lib/analysis-deadline";

class Expire extends Error {}

test("résultat rendu si run finit avant l'échéance", async () => {
  const valeur = await runWithDeadline(1000, async () => "ok", () => new Expire());
  assert.equal(valeur, "ok");
});

test("à l'échéance : rejet par onTimeout et signal déclenché, même si run ne réagit pas", async () => {
  let signalRecu: AbortSignal | undefined;
  const debut = Date.now();
  await assert.rejects(
    runWithDeadline(
      50,
      (signal) => {
        signalRecu = signal;
        return new Promise<never>(() => {}); // ne finit jamais, ignore le signal
      },
      () => new Expire("délai"),
    ),
    Expire,
  );
  const duree = Date.now() - debut;
  assert.ok(duree >= 45 && duree < 1000, `rejet après ${duree} ms`);
  assert.equal(signalRecu?.aborted, true);
});

test("échéance déjà passée : rejet sans appeler run", async () => {
  let appele = false;
  await assert.rejects(
    runWithDeadline(0, async () => {
      appele = true;
    }, () => new Expire()),
    Expire,
  );
  assert.equal(appele, false);
});

test("une erreur de run avant l'échéance passe telle quelle", async () => {
  await assert.rejects(
    runWithDeadline(1000, async () => {
      throw new TypeError("autre");
    }, () => new Expire()),
    TypeError,
  );
});

// ── runAnalysis contre une fausse API locale ──

type Handler = (req: IncomingMessage, res: ServerResponse) => void;
type Analyse = typeof import("@/lib/ai/analyze");

describe("runAnalysis borné par l'échéance", () => {
  let handler: Handler = () => {};
  let requetes = 0;
  let fermees = 0;
  let runAnalysis: Analyse["runAnalysis"];
  let AnalysisError: Analyse["AnalysisError"];
  const serveur = createServer((req, res) => {
    requetes++;
    req.on("close", () => {
      if (!res.writableEnded) fermees++;
    });
    handler(req, res);
  });

  before(async () => {
    await new Promise<void>((resolve) => serveur.listen(0, "127.0.0.1", resolve));
    const { port } = serveur.address() as AddressInfo;
    // Clé factice et API locale : aucune requête ne peut partir vers Anthropic.
    process.env.ANTHROPIC_API_KEY = "cle-factice-de-test";
    process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${port}`;
    ({ runAnalysis, AnalysisError } = await import("@/lib/ai/analyze"));
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

  test("API qui ne répond pas : ANALYSIS_TIMEOUT à l'échéance, requête HTTP abandonnée", async () => {
    requetes = 0;
    fermees = 0;
    handler = () => {}; // ne répond jamais
    const debut = Date.now();
    await assert.rejects(runAnalysis({ ...ENTREE, deadline: Date.now() + 300 }), (err: unknown) => {
      assert.ok(err instanceof AnalysisError);
      assert.equal(err.code, "ANALYSIS_TIMEOUT");
      assert.match(err.message, /Aucun crédit n'a été décompté/);
      return true;
    });
    const duree = Date.now() - debut;
    assert.ok(duree < 1500, `rejet après ${duree} ms`);
    assert.equal(requetes, 1);
    // Le signal a coupé la connexion côté client.
    await new Promise((r) => setTimeout(r, 100));
    assert.equal(fermees, 1);
  });

  test("API surchargée (529) : nouvelles tentatives, mais jamais au-delà de l'échéance", async () => {
    requetes = 0;
    handler = (_req, res) => {
      res.writeHead(529, { "content-type": "application/json" });
      res.end(JSON.stringify({ type: "error", error: { type: "overloaded_error", message: "Overloaded" } }));
    };
    const debut = Date.now();
    await assert.rejects(runAnalysis({ ...ENTREE, deadline: Date.now() + 1000 }), (err: unknown) => {
      assert.ok(err instanceof AnalysisError);
      assert.equal(err.code, "ANALYSIS_TIMEOUT");
      return true;
    });
    const duree = Date.now() - debut;
    // Le SDK attend 0,375 à 0,5 s puis 0,75 à 1 s entre deux tentatives : sans la
    // course de runWithDeadline, il attendrait au-delà de l'échéance de 1 s. La
    // troisième tentative ne peut pas partir avant ~1,13 s (0,375 + 0,75 s au
    // moins) ; la deuxième part avant ~0,55 s. Une machine très lente peut n'en
    // faire qu'une : l'essentiel est de ne jamais dépasser l'échéance.
    assert.ok(duree < 1500, `rejet après ${duree} ms`);
    assert.ok(requetes >= 1 && requetes <= 2, `${requetes} requête(s) : jamais une troisième au-delà de l'échéance`);
  });

  test("échéance déjà passée : aucune requête envoyée", async () => {
    requetes = 0;
    await assert.rejects(runAnalysis({ ...ENTREE, deadline: Date.now() - 1 }), (err: unknown) => {
      assert.ok(err instanceof AnalysisError);
      assert.equal(err.code, "ANALYSIS_TIMEOUT");
      return true;
    });
    assert.equal(requetes, 0);
  });
});
