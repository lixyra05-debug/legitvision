// Coût IA de chaque appel au modèle (lib/ai/cout-ia.ts) : fonctions pures,
// sans réseau. Tarifs de lib/ai/tarifs.ts (relevé du 2026-09-30) : Opus 4.8,
// 5 $ en entrée, 25 $ en sortie, 6,25 $ / 10 $ en écriture de cache (5 min /
// 1 h), 0,50 $ en lecture, par million de jetons ; ×1,1 en région « us ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MODELE_INCONNU,
  coutIaDe,
  coutIaNonMesure,
  ligneCoutIa,
  mesurerCoutIa,
  rattacherCoutIa,
  type CoutIa,
} from "@/lib/ai/cout-ia";
import { MODELE_ANALYSE, TARIFS } from "@/lib/ai/tarifs";

const RACINE = new URL("../../", import.meta.url);

/** Réponse du modèle réduite à ce que lit mesurerCoutIa. */
function reponse(usage: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  return { model: "claude-opus-4-8", stop_reason: "end_turn", usage, ...extra };
}

/** Consommation inconnue : ni jetons ni coût, jamais un 0 supposé. */
function assertInconnue(cout: CoutIa, message?: string) {
  assert.equal(cout.measured, false, message);
  for (const champ of [
    "input_tokens",
    "output_tokens",
    "thinking_tokens",
    "cache_write_5m_tokens",
    "cache_write_1h_tokens",
    "cache_read_tokens",
    "cost_usd",
    "price_list_date",
  ] as const) {
    assert.equal(cout[champ], null, `${champ} ${message ?? ""}`);
  }
}

test("Opus 4.8 : 20 000 jetons d'entrée et 4 000 de sortie coûtent 0,2 $", () => {
  const cout = mesurerCoutIa(
    reponse({ input_tokens: 20_000, output_tokens: 4_000, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, inference_geo: "global" }),
  );
  assert.equal(cout.cost_usd, 0.2);
  assert.equal(cout.price_list_date, "2026-09-30");
  assert.equal(cout.model, "claude-opus-4-8");
  assert.equal(cout.measured, true);
  assert.equal(cout.stop_reason, "end_turn");
  assert.equal(cout.inference_geo, "global");
  assert.deepEqual(
    [cout.input_tokens, cout.output_tokens, cout.cache_write_5m_tokens, cout.cache_write_1h_tokens, cout.cache_read_tokens],
    [20_000, 4_000, 0, 0, 0],
  );
});

test("identifiant de requête lu comme le pose le SDK (propriété non énumérable)", () => {
  const r = reponse({ input_tokens: 1, output_tokens: 1 });
  Object.defineProperty(r, "_request_id", { value: "req_011CZ", enumerable: false });
  assert.equal(mesurerCoutIa(r).request_id, "req_011CZ");
  assert.equal(mesurerCoutIa(reponse({ input_tokens: 1, output_tokens: 1 })).request_id, null);
});

test("la réflexion est déjà dans output_tokens : relevée, jamais ajoutée", () => {
  const sans = mesurerCoutIa(reponse({ input_tokens: 20_000, output_tokens: 4_000 }));
  const avec = mesurerCoutIa(
    reponse({ input_tokens: 20_000, output_tokens: 4_000, output_tokens_details: { thinking_tokens: 3_000 } }),
  );
  assert.equal(avec.cost_usd, 0.2);
  assert.equal(avec.cost_usd, sans.cost_usd);
  assert.equal(avec.thinking_tokens, 3_000);
  assert.equal(sans.thinking_tokens, null, "champ absent : nul, pas 0");
});

test("cache : écritures 5 min et 1 h et lectures, chacune à son tarif", () => {
  const cout = mesurerCoutIa(
    reponse({
      input_tokens: 1_000,
      output_tokens: 0,
      cache_creation_input_tokens: 2_000,
      cache_creation: { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: 500 },
      cache_read_input_tokens: 3_000,
    }),
  );
  // 1 000 × 5 + 1 500 × 6,25 + 500 × 10 + 3 000 × 0,5 = 20 875 micro-dollars
  assert.equal(cout.cost_usd, 0.020875);
  assert.deepEqual([cout.cache_write_5m_tokens, cout.cache_write_1h_tokens, cout.cache_read_tokens], [1_500, 500, 3_000]);
});

test("cache sans détail par durée : tout au tarif 5 min ; champs nuls : 0", () => {
  const cout = mesurerCoutIa(
    reponse({ input_tokens: 1_000, output_tokens: 0, cache_creation_input_tokens: 2_000, cache_creation: null, cache_read_input_tokens: null }),
  );
  // 1 000 × 5 + 2 000 × 6,25 = 17 500 micro-dollars
  assert.equal(cout.cost_usd, 0.0175);
  assert.deepEqual([cout.cache_write_5m_tokens, cout.cache_write_1h_tokens, cout.cache_read_tokens], [2_000, 0, 0]);
});

test("champ de cache présent mais invalide : consommation inconnue, jamais comptée à 0", () => {
  assertInconnue(mesurerCoutIa(reponse({ input_tokens: 1_000, output_tokens: 10, cache_read_input_tokens: -5 })));
  assertInconnue(mesurerCoutIa(reponse({ input_tokens: 1_000, output_tokens: 10, cache_creation_input_tokens: "12" })));
});

test("détail de cache présent mais invalide, ou qui ne fait pas le total : consommation inconnue, jamais une répartition supposée", () => {
  const usage = { input_tokens: 1_000, output_tokens: 0, cache_creation_input_tokens: 2_000 };
  const details: unknown[] = [
    { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: -1 },
    { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: "500" },
    { ephemeral_5m_input_tokens: 1_500 }, // champ 1 h absent
    {},
    "2000",
    [1_500, 500],
    { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: 400 }, // 1 900 ≠ 2 000
  ];
  for (const [i, cache_creation] of details.entries()) {
    assertInconnue(mesurerCoutIa(reponse({ ...usage, cache_creation })), `détail ${i}`);
  }
  const detailValide = { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: 500 };
  assertInconnue(
    mesurerCoutIa(reponse({ ...usage, cache_creation_input_tokens: "x", cache_creation: detailValide })),
    "total invalide, détail valide",
  );
  assertInconnue(
    mesurerCoutIa(reponse({ input_tokens: 1_000, output_tokens: 0, cache_creation: detailValide })),
    "total absent (0), détail de 2 000",
  );
});

test("inference_geo « us » : ×1,1 ; « global » ou absente : ×1 ; autre région : aucun tarif supposé", () => {
  const usage = { input_tokens: 20_000, output_tokens: 4_000 };
  assert.equal(mesurerCoutIa(reponse({ ...usage, inference_geo: "us" })).cost_usd, 0.22);
  assert.equal(mesurerCoutIa(reponse({ ...usage, inference_geo: "global" })).cost_usd, 0.2);
  assert.equal(mesurerCoutIa(reponse({ ...usage, inference_geo: null })).cost_usd, 0.2);
  const ailleurs = mesurerCoutIa(reponse({ ...usage, inference_geo: "eu" }));
  assert.equal(ailleurs.cost_usd, null);
  assert.equal(ailleurs.price_list_date, null);
  assert.equal(ailleurs.measured, true, "jetons gardés");
  assert.equal(ailleurs.input_tokens, 20_000);
});

test("inference_geo « us » : ×1,1 aussi sur les écritures et les lectures en cache", () => {
  const cout = mesurerCoutIa(
    reponse({
      input_tokens: 1_000,
      output_tokens: 0,
      cache_creation_input_tokens: 2_000,
      cache_creation: { ephemeral_5m_input_tokens: 1_500, ephemeral_1h_input_tokens: 500 },
      cache_read_input_tokens: 3_000,
      inference_geo: "us",
    }),
  );
  // (1 000 × 5 + 1 500 × 6,25 + 500 × 10 + 3 000 × 0,5) × 1,1 = 20 875 × 1,1
  // = 22 962,5 micro-dollars → 22 963. Sur l'entrée et la sortie seules : 21 375.
  assert.equal(cout.cost_usd, 0.022963);
  assert.equal(cout.price_list_date, "2026-09-30");
});

test("inference_geo illisible (nombre, chaîne vide, objet, booléen) : aucun tarif supposé, jetons gardés", () => {
  for (const inference_geo of [1, "", {}, false]) {
    const cas = JSON.stringify(inference_geo);
    const cout = mesurerCoutIa(reponse({ input_tokens: 20_000, output_tokens: 4_000, inference_geo }));
    assert.equal(cout.cost_usd, null, cas);
    assert.equal(cout.price_list_date, null, cas);
    assert.equal(cout.inference_geo, null, cas);
    assert.equal(cout.measured, true, `${cas} : jetons gardés`);
    assert.equal(cout.input_tokens, 20_000, cas);
  }
});

test("coût arrondi au millionième de dollar (colonne numeric(12,6))", () => {
  // 3 × 5 × 1,1 = 16,5 micro-dollars → 17
  assert.equal(mesurerCoutIa(reponse({ input_tokens: 3, output_tokens: 0, inference_geo: "us" })).cost_usd, 0.000017);
  // 1 lecture en cache = 0,5 micro-dollar → 1
  assert.equal(mesurerCoutIa(reponse({ input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 1 })).cost_usd, 0.000001);
});

test("modèle sans tarif relevé : jetons gardés, coût nul, jamais de tarif supposé", () => {
  const autre = mesurerCoutIa({ ...reponse({ input_tokens: 20_000, output_tokens: 4_000 }), model: "claude-opus-5-5" });
  assert.equal(autre.model, "claude-opus-5-5");
  assert.equal(autre.measured, true);
  assert.deepEqual([autre.input_tokens, autre.output_tokens], [20_000, 4_000]);
  assert.equal(autre.cost_usd, null);
  assert.equal(autre.price_list_date, null);

  const anonyme = mesurerCoutIa({ usage: { input_tokens: 20_000, output_tokens: 4_000 } });
  assert.equal(anonyme.model, MODELE_INCONNU);
  assert.equal(anonyme.cost_usd, null);
  assert.equal(anonyme.input_tokens, 20_000);
});

test("usage absent ou malformé : aucune erreur levée, jetons et coût nuls", () => {
  const cas: unknown[] = [
    undefined,
    null,
    "réponse",
    42,
    [],
    { model: "claude-opus-4-8" },
    { model: "claude-opus-4-8", usage: null },
    { model: "claude-opus-4-8", usage: [] },
    reponse({ output_tokens: 4_000 }),
    reponse({ input_tokens: "20000", output_tokens: 4_000 }),
    reponse({ input_tokens: -1, output_tokens: 4_000 }),
    reponse({ input_tokens: 1.5, output_tokens: 4_000 }),
    reponse({ input_tokens: Number.NaN, output_tokens: 4_000 }),
    reponse({ input_tokens: 3_000_000_000, output_tokens: 4_000 }), // hors d'une colonne integer
    {
      model: "claude-opus-4-8",
      get usage() {
        throw new Error("accesseur en panne");
      },
    },
  ];
  for (const [i, r] of cas.entries()) {
    let cout: CoutIa | undefined;
    assert.doesNotThrow(() => {
      cout = mesurerCoutIa(r);
    }, `cas ${i}`);
    assertInconnue(cout as CoutIa, `cas ${i}`);
  }
});

test("coutIaNonMesure : appel coupé, jetons et coût nuls, modèle demandé", () => {
  const cout = coutIaNonMesure(MODELE_ANALYSE);
  assertInconnue(cout);
  assert.equal(cout.model, "claude-opus-4-8");
  assert.equal(cout.request_id, null);
  assert.equal(cout.stop_reason, null);
  assert.equal(cout.inference_geo, null);
});

test("rattacherCoutIa et coutIaDe : le coût suit l'erreur, sans la changer ; rien pour une chaîne ou une erreur sans coût", () => {
  const cout = mesurerCoutIa(reponse({ input_tokens: 20_000, output_tokens: 4_000 }));
  class ErreurMetier extends Error {
    code = "PARSE_ERROR";
  }
  const metier = new ErreurMetier("réponse illisible");
  rattacherCoutIa(metier, cout);
  assert.equal(coutIaDe(metier), cout);
  assert.ok(metier instanceof ErreurMetier);
  assert.equal(metier.code, "PARSE_ERROR");
  assert.equal(metier.message, "réponse illisible");
  assert.deepEqual(Object.keys(metier), ["code"], "aucune propriété ajoutée à l'erreur");

  const imprevue = new TypeError("Cannot read properties of null");
  rattacherCoutIa(imprevue, cout);
  assert.equal(coutIaDe(imprevue), cout);

  rattacherCoutIa("chaîne levée", cout);
  assert.equal(coutIaDe("chaîne levée"), null);
  assert.equal(coutIaDe(new Error("sans coût")), null);
  assert.equal(coutIaDe(null), null);
  assert.equal(coutIaDe(undefined), null);
});

test("ligneCoutIa : exactement les colonnes de analysis_costs ; code d'échec seulement pour « failed »", () => {
  // Migration 020, table public.analysis_costs, sans id ni created_at (valeurs par défaut).
  const COLONNES = [
    "analysis_id",
    "model",
    "request_id",
    "measured",
    "input_tokens",
    "output_tokens",
    "thinking_tokens",
    "cache_write_5m_tokens",
    "cache_write_1h_tokens",
    "cache_read_tokens",
    "inference_geo",
    "cost_usd",
    "price_list_date",
    "stop_reason",
    "outcome",
    "failure_code",
  ];
  const cout = mesurerCoutIa(
    reponse({ input_tokens: 20_000, output_tokens: 4_000, output_tokens_details: { thinking_tokens: 3_000 }, inference_geo: "global" }),
  );
  const avecIntrus = { ...cout, cout_ia: "intrus" } as CoutIa;

  const echec = ligneCoutIa(avecIntrus, "a-1", "failed", "PARSE_ERROR");
  assert.deepEqual(Object.keys(echec).sort(), [...COLONNES].sort());
  assert.deepEqual(echec, { ...cout, analysis_id: "a-1", outcome: "failed", failure_code: "PARSE_ERROR" });

  assert.equal(ligneCoutIa(cout, "a-1", "report", "SAVE_ERROR").failure_code, null);
  assert.equal(ligneCoutIa(cout, "a-1", "insufficient").failure_code, null);

  const coupe = ligneCoutIa(coutIaNonMesure(MODELE_ANALYSE), "a-2", "failed", "ANALYSIS_TIMEOUT");
  assert.equal(coupe.measured, false);
  assert.equal(coupe.cost_usd, null);
  assert.equal(coupe.failure_code, "ANALYSIS_TIMEOUT");
});

test("le modèle appelé est celui des tarifs : aucun identifiant de modèle écrit en dur", () => {
  const source = readFileSync(new URL("lib/ai/analyze.ts", RACINE), "utf8");
  assert.match(source, /\bmodel:\s*MODELE_ANALYSE\b/);
  assert.doesNotMatch(source, /\bmodel:\s*["'`]/, "modèle écrit en dur dans l'appel");
  assert.equal(TARIFS.modele, MODELE_ANALYSE);
  const cout = mesurerCoutIa({ model: MODELE_ANALYSE, usage: { input_tokens: 1_000, output_tokens: 1_000 } });
  assert.notEqual(cout.cost_usd, null);
});
