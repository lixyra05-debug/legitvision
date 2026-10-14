// I9 de l'audit du 30/09 : les classes des paliers de score n'étaient écrites
// que dans lib/types.ts, que Tailwind ne lisait pas. Barres « Scores par zone »
// et pastilles sortaient sans couleur en production. Ce test compile la CSS
// avec la configuration du site et vérifie que chaque classe existe.
// Décision d'Hector du 04/10 : jamais d'ambre pour un score.
import { test } from "node:test";
import assert from "node:assert/strict";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import config from "../../tailwind.config";
import { getScoreBgColor, getScoreColor, getScoreHsl, getScoreSolidBg } from "@/lib/types";

const SCORES = { authentique: 90, nonConcluant: 60, contrefait: 20 } as const;

/** Sélecteur CSS échappé d'une classe Tailwind (« bg-x/10 » → « .bg-x\/10 »). */
const selecteur = (classe: string) => `.${classe.replace(/[/[\].]/g, (c) => `\\${c}`)}`;

test("chaque classe de palier de score est dans la CSS compilée", async () => {
  const { css } = await postcss([tailwindcss({ ...config, corePlugins: { preflight: false } })]).process(
    "@tailwind utilities;",
    { from: undefined }
  );
  const classes = Object.values(SCORES).flatMap((s) =>
    [getScoreColor(s), getScoreBgColor(s), getScoreSolidBg(s)].flatMap((c) => c.split(/\s+/))
  );
  const manquantes = classes.filter((c) => !css.includes(`${selecteur(c)} {`) && !css.includes(`${selecteur(c)}{`));
  assert.deepEqual(manquantes, [], "classes absentes de la CSS compilée");
});

test("la bande 45-74 prend la couleur « non concluant », jamais l'ambre", () => {
  const s = SCORES.nonConcluant;
  for (const classe of [getScoreColor(s), getScoreBgColor(s), getScoreSolidBg(s)]) {
    assert.match(classe, /verdict-inconclusive/, classe);
    assert.doesNotMatch(classe, /warning/, classe);
  }
  assert.equal(getScoreHsl(s), "hsl(var(--verdict-inconclusive))");
  for (const s2 of Object.values(SCORES)) {
    assert.doesNotMatch([getScoreColor(s2), getScoreBgColor(s2), getScoreSolidBg(s2), getScoreHsl(s2)].join(" "), /warning/);
  }
});
