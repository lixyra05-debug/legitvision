// Messages d'erreur de l'analyse montrés au client : vrais, et sans promesse
// sur une cause que la route a déjà exclue (photos validées puis réencodées).
import { test } from "node:test";
import assert from "node:assert/strict";
import { AnalysisError, handleAnalysisError } from "@/lib/ai/analyze";

// Corps d'erreur tel que le renvoie l'API Anthropic (APIError.error).
function erreur400(message: string) {
  return {
    status: 400,
    message: `400 ${JSON.stringify({ type: "error", error: { type: "invalid_request_error", message } })}`,
    error: { type: "error", error: { type: "invalid_request_error", message } },
  };
}

// Les échecs attendus écrivent au journal : on le fait taire pendant le test.
function sansJournal<T>(f: () => T): T {
  const original = console.error;
  console.error = () => {};
  try {
    return f();
  } finally {
    console.error = original;
  }
}

test("400 sur un paramètre de requête : message générique, pas de photo mise en cause", () => {
  const { message, code } = sansJournal(() =>
    handleAnalysisError(erreur400("thinking.budget_tokens: Extra inputs are not permitted")),
  );
  assert.equal(code, "BAD_REQUEST");
  assert.doesNotMatch(message, /photo/i);
  assert.match(message, /Aucun crédit n'a été décompté/);
});

test("400 qui désigne une image : la photo est mise en cause", () => {
  const { message, code } = sansJournal(() =>
    handleAnalysisError(
      erreur400("messages.0.content.3.image.source.base64: image exceeds 5 MB maximum"),
    ),
  );
  assert.equal(code, "BAD_REQUEST_IMAGE");
  assert.match(message, /photos?/);
  assert.match(message, /Aucun crédit n'a été décompté/);
});

test("400 sans corps lisible : repli sur le message de l'erreur", () => {
  assert.equal(sansJournal(() => handleAnalysisError({ status: 400, message: "400 status code (no body)" })).code, "BAD_REQUEST");
  assert.equal(
    sansJournal(() => handleAnalysisError({ status: 400, message: "400 Could not process image" })).code,
    "BAD_REQUEST_IMAGE",
  );
});

test("AnalysisError : son message passe tel quel", () => {
  const { message, code } = sansJournal(() =>
    handleAnalysisError(new AnalysisError("Message clair.", "ANALYSIS_TIMEOUT")),
  );
  assert.equal(message, "Message clair.");
  assert.equal(code, "ANALYSIS_TIMEOUT");
});
