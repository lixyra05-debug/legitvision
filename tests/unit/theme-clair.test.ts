// Décision d'Hector du 04/10 : l'accent du thème clair est #047857 (mode jour
// de Figma). Ce test lit les jetons de app/globals.css et vérifie les contrastes
// WCAG qu'ils doivent tenir : texte blanc sur l'accent et sur son survol, accent
// en texte sur le fond et sur une carte. Le thème sombre ne change pas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type Rvb = [number, number, number];

const CSS = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

/** Triplets HSL déclarés dans le premier bloc qui suit `selecteur` (les var(…) sont ignorés). */
function jetons(selecteur: string): Map<string, string> {
  const debut = CSS.indexOf(`${selecteur} {`);
  assert.ok(debut >= 0, `bloc ${selecteur} introuvable`);
  const bloc = CSS.slice(debut, CSS.indexOf("}", debut)).replace(/\/\*[\s\S]*?\*\//g, "");
  const valeurs = new Map<string, string>();
  for (const [, nom, valeur] of bloc.matchAll(/--([\w-]+):\s*([\d.]+ [\d.]+% [\d.]+%);/g)) {
    valeurs.set(nom, valeur);
  }
  return valeurs;
}

/** hsl() → rvb arrondi à l'entier, comme le navigateur. */
function rvb(triplet: string | undefined): Rvb {
  assert.ok(triplet, "jeton absent");
  const [h, s, l] = triplet.split(" ").map((v) => parseFloat(v) / (v.endsWith("%") ? 100 : 1));
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  return [f(0), f(8), f(4)];
}

const hexa = (c: Rvb) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

function contraste(a: Rvb, b: Rvb): number {
  const lum = (c: Rvb) => {
    const [r, g, bl] = c.map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [clair, sombre] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (clair + 0.05) / (sombre + 0.05);
}

const clair = jetons(".light");

test("thème clair : l'accent est #047857 et son survol #065F46", () => {
  assert.equal(hexa(rvb(clair.get("accent"))), "#047857");
  assert.equal(hexa(rvb(clair.get("accent-hover"))), "#065F46");
  assert.equal(hexa(rvb(clair.get("accent-foreground"))), "#FFFFFF");
});

test("thème clair : texte blanc sur l'accent et sur le survol, 4,5:1 au moins", () => {
  const blanc = rvb(clair.get("accent-foreground"));
  assert.ok(contraste(blanc, rvb(clair.get("accent"))) >= 4.5);
  assert.ok(contraste(blanc, rvb(clair.get("accent-hover"))) >= 4.5);
  assert.ok(contraste(blanc, rvb(clair.get("accent-hover"))) > contraste(blanc, rvb(clair.get("accent"))), "le survol fonce");
});

test("thème clair : l'accent en texte, 4,5:1 au moins sur le fond et sur une carte", () => {
  const accent = rvb(clair.get("accent"));
  for (const fond of ["background", "surface", "surface-raised"]) {
    const ratio = contraste(accent, rvb(clair.get(fond)));
    assert.ok(ratio >= 4.5, `--${fond} : ${ratio.toFixed(2)}:1`);
  }
});

test("thème sombre inchangé : accent #10B981, survol #34D399", () => {
  const sombre = jetons(".dark");
  assert.equal(hexa(rvb(sombre.get("accent"))), "#10B981");
  assert.equal(hexa(rvb(sombre.get("accent-hover"))), "#34D399");
});
