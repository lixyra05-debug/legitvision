// M2 de l'audit du 30/09 : /auth?error=<texte> n'affiche jamais le texte reçu.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cleErreurUrl } from "@/lib/auth-errors";

test("code connu : son message", () => {
  assert.equal(cleErreurUrl("callback_error"), "auth.errorCallback");
});

test("sans erreur dans l'URL : rien à afficher", () => {
  for (const recu of [null, undefined, ""]) assert.equal(cleErreurUrl(recu), null);
});

test("texte libre ou code inconnu : message générique, jamais le texte reçu", () => {
  for (const recu of ["Votre compte est suspendu. Appelez le 01 23 45 67 89", "toString", "__proto__", "100%"]) {
    assert.equal(cleErreurUrl(recu), "auth.errorCallback", recu);
  }
});
