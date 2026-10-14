// apresReponse (lib/apres-reponse.ts) remet une tâche à après la réponse, par
// `after` de Next. Hors d'une requête Next, `after` lève : la tâche part alors
// aussitôt, sans être attendue, et rien ne remonte à l'appelant.
import { test } from "node:test";
import assert from "node:assert/strict";
import { apresReponse } from "@/lib/apres-reponse";

/** Coupe console.warn pendant fn et rend ce qui y a été écrit. */
async function avertissements(fn: () => Promise<void>): Promise<unknown[][]> {
  const w = console.warn;
  const ecrits: unknown[][] = [];
  console.warn = (...args: unknown[]) => { ecrits.push(args); };
  try {
    await fn();
    return ecrits;
  } finally {
    console.warn = w;
  }
}

const tourSuivant = () => new Promise((resolve) => setImmediate(resolve));

test("hors d'une requête Next : la tâche s'exécute après l'appel, sans rien lever", async () => {
  let faite = false;
  const ecrits = await avertissements(async () => {
    assert.doesNotThrow(() => apresReponse(async () => { faite = true; }));
    assert.equal(faite, false, "jamais pendant l'appel : elle ne retarde pas la réponse");
    await tourSuivant();
  });
  assert.equal(faite, true);
  assert.match(String(ecrits[0]?.[0]), /after indisponible/);
});

test("une tâche qui échoue ne remonte pas : journalisée seulement", async () => {
  const ecrits = await avertissements(async () => {
    assert.doesNotThrow(() => apresReponse(async () => { throw new Error("panne"); }));
    await tourSuivant();
  });
  assert.ok(ecrits.some((args) => args[0] === "[apres-reponse] tâche en échec"));
});
