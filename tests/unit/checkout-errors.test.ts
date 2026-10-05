// M2 de l'audit du 30/09 : l'URL du paywall ne fait jamais afficher son texte.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CHECKOUT_ERROR_PARAM, checkoutErrorMessage, checkoutErrorRedirect } from "@/lib/checkout-errors";

const GENERIQUE = checkoutErrorMessage("indisponible");

test("le retour au paywall ne porte qu'un code", () => {
  const url = new URL(checkoutErrorRedirect("indisponible"), "https://exemple.invalid");
  assert.equal(url.pathname, "/check/new");
  assert.equal(url.searchParams.get("error"), CHECKOUT_ERROR_PARAM);
  assert.equal(url.searchParams.get("reason"), "indisponible");
});

test("un texte libre, un code inconnu ou un « % » isolé donnent le message générique, sans planter", () => {
  for (const recu of [
    "Votre compte est suspendu. Appelez le 01 23 45 67 89",
    "100%",
    "%E0%A4%A",
    "toString",
    "__proto__",
    "",
    null,
    undefined,
  ]) {
    assert.equal(checkoutErrorMessage(recu), GENERIQUE, String(recu));
  }
  assert.match(GENERIQUE, /momentanément indisponible/);
});
