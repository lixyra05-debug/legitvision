// Contraste WCAG entre deux jetons de app/globals.css, pour les tests qui
// vérifient qu'un texte reste lisible dans les deux thèmes. Mêmes calculs que
// tests/unit/theme-clair.test.ts (hsl arrondi à l'entier, comme le navigateur).
import { readFileSync } from "node:fs";

export type Rvb = [number, number, number];

const CSS = readFileSync(new URL("../../../app/globals.css", import.meta.url), "utf8");

/** Triplets HSL déclarés dans le premier bloc qui suit `selecteur` (les var(…) sont ignorés). */
function bloc(selecteur: string): Map<string, string> {
  const debut = CSS.indexOf(`${selecteur} {`);
  if (debut < 0) throw new Error(`bloc ${selecteur} introuvable dans app/globals.css`);
  const texte = CSS.slice(debut, CSS.indexOf("}", debut)).replace(/\/\*[\s\S]*?\*\//g, "");
  const valeurs = new Map<string, string>();
  for (const [, nom, valeur] of texte.matchAll(/--([\w-]+):\s*([\d.]+ [\d.]+% [\d.]+%);/g)) {
    valeurs.set(nom, valeur);
  }
  return valeurs;
}

/** Jetons d'un thème : le clair hérite du sombre ce qu'il ne redéfinit pas. */
export function jetons(theme: "sombre" | "clair"): Map<string, string> {
  const sombre = bloc(".dark");
  return theme === "sombre" ? sombre : new Map([...sombre, ...bloc(".light")]);
}

/** hsl() → rvb arrondi à l'entier. */
export function rvb(triplet: string | undefined): Rvb {
  if (!triplet) throw new Error("jeton absent");
  const [h, s, l] = triplet.split(" ").map((v) => parseFloat(v) / (v.endsWith("%") ? 100 : 1));
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  return [f(0), f(8), f(4)];
}

/** Couleur affichée d'un aplat translucide posé sur un fond opaque. */
export const melange = (avant: Rvb, fond: Rvb, alpha: number): Rvb =>
  avant.map((v, i) => Math.round(alpha * v + (1 - alpha) * fond[i])) as Rvb;

export function contraste(a: Rvb, b: Rvb): number {
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
