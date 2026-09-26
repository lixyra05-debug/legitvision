// Les durées de l'analyse ont une source unique (lib/analysis-limits.ts). Next
// et Vercel exigent pourtant une valeur littérale de maxDuration dans la route
// et dans vercel.json : ces tests échouent dès que l'une d'elles diverge.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ANALYSIS_CLIENT_TIMEOUT_SECONDS,
  ANALYSIS_END_MARGIN_SECONDS,
  ANALYSIS_MAX_SECONDS,
  ANALYSIS_OUTCOME_MAX_MINUTES,
  ANALYSIS_STALE_AFTER_SECONDS,
  LAUNCH_STALE_AFTER_SECONDS,
  REPORT_REFRESH_SECONDS,
  UPLOAD_STALE_AFTER_SECONDS,
  analysisModelDeadline,
  staleCutoffs,
  staleKind,
} from "@/lib/analysis-limits";

const RACINE = new URL("../../", import.meta.url);
const ROUTE = "app/api/analyze/route.ts";

test("maxDuration de la route = ANALYSIS_MAX_SECONDS (valeur littérale exigée par Next)", () => {
  const source = readFileSync(new URL(ROUTE, RACINE), "utf8");
  const declarations = [...source.matchAll(/export\s+const\s+maxDuration\s*=\s*([^;\n]+)/g)];
  assert.equal(declarations.length, 1, "une seule déclaration de maxDuration attendue");
  assert.equal(declarations[0][1].trim(), String(ANALYSIS_MAX_SECONDS));
});

test("maxDuration de vercel.json = ANALYSIS_MAX_SECONDS", () => {
  const config = JSON.parse(readFileSync(new URL("vercel.json", RACINE), "utf8")) as {
    functions?: Record<string, { maxDuration?: number }>;
  };
  assert.equal(config.functions?.[ROUTE]?.maxDuration, ANALYSIS_MAX_SECONDS);
});

test("offre Hobby avec Fluid : 300 s au plus", () => {
  assert.ok(ANALYSIS_MAX_SECONDS <= 300);
});

test("l'appel au modèle s'arrête avant la coupure de la plateforme", () => {
  const debut = 1_000_000;
  const echeance = analysisModelDeadline(debut);
  assert.ok(ANALYSIS_END_MARGIN_SECONDS > 0);
  assert.equal(echeance, debut + (ANALYSIS_MAX_SECONDS - ANALYSIS_END_MARGIN_SECONDS) * 1000);
  assert.ok(echeance < debut + ANALYSIS_MAX_SECONDS * 1000);
});

test("le client attend un peu plus que la fonction, et la reprise attend plus encore", () => {
  assert.ok(ANALYSIS_CLIENT_TIMEOUT_SECONDS > ANALYSIS_MAX_SECONDS);
  assert.ok(ANALYSIS_STALE_AFTER_SECONDS > ANALYSIS_MAX_SECONDS);
  assert.ok(UPLOAD_STALE_AFTER_SECONDS > ANALYSIS_STALE_AFTER_SECONDS);
  // Un lancement perdu est reconnu bien avant un envoi interrompu.
  assert.ok(LAUNCH_STALE_AFTER_SECONDS < UPLOAD_STALE_AFTER_SECONDS);
});

test("la borne annoncée au client couvre le pire cas de la reprise", () => {
  const pireCas =
    Math.max(ANALYSIS_STALE_AFTER_SECONDS, LAUNCH_STALE_AFTER_SECONDS) + REPORT_REFRESH_SECONDS;
  assert.ok(Number.isInteger(ANALYSIS_OUTCOME_MAX_MINUTES));
  assert.ok(ANALYSIS_OUTCOME_MAX_MINUTES * 60 >= pireCas);
  // Arrondi à la minute supérieure, pas au-delà.
  assert.ok((ANALYSIS_OUTCOME_MAX_MINUTES - 1) * 60 < pireCas);
});

test("staleKind : analyse « analyzing » bloquée au-delà du seuil seulement", () => {
  const maintenant = Date.parse("2026-09-26T12:00:00Z");
  const il = (s: number) => new Date(maintenant - s * 1000).toISOString();
  assert.equal(staleKind("analyzing", il(ANALYSIS_STALE_AFTER_SECONDS - 1), maintenant), null);
  assert.equal(staleKind("analyzing", il(ANALYSIS_STALE_AFTER_SECONDS + 1), maintenant), "timed_out");
});

test("staleKind : analyse « uploading » non lancée au-delà de son propre seuil", () => {
  const maintenant = Date.parse("2026-09-26T12:00:00Z");
  const il = (s: number) => new Date(maintenant - s * 1000).toISOString();
  // Un envoi lent mais légitime n'est pas coupé au seuil de l'analyse.
  assert.equal(staleKind("uploading", il(ANALYSIS_STALE_AFTER_SECONDS + 1), maintenant), null);
  assert.equal(staleKind("uploading", il(UPLOAD_STALE_AFTER_SECONDS - 1), maintenant), null);
  assert.equal(staleKind("uploading", il(UPLOAD_STALE_AFTER_SECONDS + 1), maintenant), "not_started");
});

test("staleKind : analyse « pending » (lancement demandé) perdue au-delà de son seuil court", () => {
  const maintenant = Date.parse("2026-09-26T12:00:00Z");
  const il = (s: number) => new Date(maintenant - s * 1000).toISOString();
  assert.equal(staleKind("pending", il(LAUNCH_STALE_AFTER_SECONDS - 1), maintenant), null);
  assert.equal(staleKind("pending", il(LAUNCH_STALE_AFTER_SECONDS + 1), maintenant), "not_started");
});

test("staleKind : une analyse terminée ou en échec n'est jamais reprise", () => {
  const maintenant = Date.parse("2026-09-26T12:00:00Z");
  const vieille = new Date(maintenant - 86_400_000).toISOString();
  for (const statut of ["completed", "expert_review", "failed"]) {
    assert.equal(staleKind(statut, vieille, maintenant), null, statut);
  }
  assert.equal(staleKind("analyzing", "pas une date", maintenant), null);
});

test("staleCutoffs : mêmes seuils que staleKind", () => {
  const maintenant = Date.parse("2026-09-26T12:00:00Z");
  const { analyzingBefore, uploadingBefore, pendingBefore } = staleCutoffs(maintenant);
  assert.equal(Date.parse(analyzingBefore), maintenant - ANALYSIS_STALE_AFTER_SECONDS * 1000);
  assert.equal(Date.parse(uploadingBefore), maintenant - UPLOAD_STALE_AFTER_SECONDS * 1000);
  assert.equal(Date.parse(pendingBefore), maintenant - LAUNCH_STALE_AFTER_SECONDS * 1000);
});
