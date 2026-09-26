// Pagination de l'historique : toutes les analyses restent accessibles.
import { test } from "node:test";
import assert from "node:assert/strict";
import { HISTORY_PAGE_SIZE, historyWindow, parseHistoryPage } from "@/lib/analysis-history";

test("parseHistoryPage : entier ≥ 1, 1 par défaut", () => {
  assert.equal(parseHistoryPage(undefined), 1);
  assert.equal(parseHistoryPage(""), 1);
  assert.equal(parseHistoryPage("3"), 3);
  assert.equal(parseHistoryPage(["4", "9"]), 4);
  for (const invalide of ["0", "-2", "1.5", "abc", "2e3", "9999999"]) {
    assert.equal(parseHistoryPage(invalide), 1, invalide);
  }
});

test("historyWindow : chaque analyse apparaît sur exactement une page", () => {
  const total = HISTORY_PAGE_SIZE * 3 + 5;
  const vues: number[] = [];
  const { pageCount } = historyWindow(1, total);
  assert.equal(pageCount, 4);
  for (let page = 1; page <= pageCount; page++) {
    const w = historyWindow(page, total);
    for (let i = w.from; i <= Math.min(w.to, total - 1); i++) vues.push(i);
  }
  assert.deepEqual(vues, Array.from({ length: total }, (_, i) => i));
});

test("historyWindow : page au-delà de la dernière → dernière page ; aucun total → page 1", () => {
  assert.deepEqual(historyWindow(9, HISTORY_PAGE_SIZE + 1), {
    page: 2,
    pageCount: 2,
    from: HISTORY_PAGE_SIZE,
    to: HISTORY_PAGE_SIZE * 2 - 1,
  });
  assert.deepEqual(historyWindow(3, 0), { page: 1, pageCount: 1, from: 0, to: HISTORY_PAGE_SIZE - 1 });
});
