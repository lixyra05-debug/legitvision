// Destination de redirection après la connexion (lib/safe-redirect.ts) : formulaire de
// connexion (?redirect=, router.push) et routes de retour de Google et de l'e-mail de
// confirmation (?next=, NextResponse.redirect(new URL(next, request.url))).
// Ce test échoue si une entrée mène à une autre origine, une fois le chemin rendu
// résolu comme le font le navigateur et ces routes, ou si une destination légitime est
// perdue en chemin.
import { test } from "node:test";
import assert from "node:assert/strict";
import { safeRedirectPath } from "@/lib/safe-redirect";

const SITE = "https://legitvision.app/api/auth/callback?code=abc";

test("chemins du site : rendus tels quels, paramètres compris", () => {
  for (const chemin of ["/dashboard", "/checkout?plan=single", "/check/new?brand=Nike&category=sneakers", "/check/123#rapport", "/./dashboard"]) {
    const rendu = safeRedirectPath(chemin);
    assert.equal(new URL(rendu, SITE).origin, "https://legitvision.app", chemin);
  }
  assert.equal(safeRedirectPath("/checkout?plan=single"), "/checkout?plan=single");
  assert.equal(safeRedirectPath("/./dashboard"), "/dashboard");
});

test("autre origine : jamais, sous aucune écriture ; repli sur le tableau de bord", () => {
  for (const hostile of [
    "https://exemple.com",
    "//exemple.com",
    "/\\exemple.com",
    "/\t/exemple.com",
    "/.//exemple.com/checkout?plan=single",
    "/%2e//exemple.com/checkout?plan=single",
    "/..//exemple.com",
    "/././/exemple.com",
    "/a/..//exemple.com",
    "/.\\/exemple.com",
    "/.//[",
    "/.//a b",
    "/.//%",
  ]) {
    const rendu = safeRedirectPath(hostile);
    assert.equal(rendu, "/dashboard", JSON.stringify(hostile));
    assert.equal(new URL(rendu, SITE).origin, "https://legitvision.app", JSON.stringify(hostile));
  }
});

test("repli : celui qu'on demande, et rien quand l'entrée manque", () => {
  assert.equal(safeRedirectPath(null), "/dashboard");
  assert.equal(safeRedirectPath(undefined), "/dashboard");
  assert.equal(safeRedirectPath(""), "/dashboard");
  assert.equal(safeRedirectPath("/.//exemple.com", ""), "");
});
