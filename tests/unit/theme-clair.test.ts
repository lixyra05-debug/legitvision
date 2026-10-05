// Décision d'Hector du 04/10 : l'accent du thème clair est #047857 (mode jour
// de Figma). Ce test lit les jetons de app/globals.css et vérifie les contrastes
// WCAG qu'ils doivent tenir : texte blanc sur l'accent et sur son survol, accent
// en texte sur le fond et sur une carte. Le thème sombre ne change pas.
// Revue du 05/10 : au survol d'une carte (--surface-hover, qui vaut --line) ou
// d'un lien en bg-accent/20, l'accent ne tient pas 4,5:1 en clair ; le texte y
// passe à --accent-hover. Le test vérifie ces paires, et que le code les emploie.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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

/** Couleur affichée d'un fond translucide (bg-x/alpha) posé sur un fond opaque. */
const melange = (avant: Rvb, fond: Rvb, alpha: number): Rvb =>
  avant.map((v, i) => Math.round(alpha * v + (1 - alpha) * fond[i])) as Rvb;

test("--surface-hover vaut --line, dans les deux thèmes", () => {
  assert.match(CSS, /--surface-hover:\s*var\(--line\);/);
  assert.ok(!jetons(".light").has("surface-hover"), "le clair ne redéfinit pas --surface-hover");
});

test("survol d'une carte : l'accent ne tient pas 4,5:1 en clair, --accent-hover si, dans les deux thèmes", () => {
  assert.ok(contraste(rvb(clair.get("accent")), rvb(clair.get("line"))) < 4.5, "sinon le passage à accent-hover est inutile");
  const sombre = jetons(".dark");
  for (const [nom, theme] of [["clair", clair], ["sombre", sombre]] as const) {
    const ratio = contraste(rvb(theme.get("accent-hover")), rvb(theme.get("line")));
    assert.ok(ratio >= 4.5, `${nom} : --accent-hover sur --surface-hover (--line), ${ratio.toFixed(2)}:1`);
  }
});

test("survol d'un lien en bg-accent/20 sur une carte : --accent-hover tient 4,5:1, dans les deux thèmes", () => {
  const sombre = jetons(".dark");
  for (const [nom, theme] of [["clair", clair], ["sombre", sombre]] as const) {
    const fond = melange(rvb(theme.get("accent")), rvb(theme.get("surface")), 0.2);
    const ratio = contraste(rvb(theme.get("accent-hover")), fond);
    assert.ok(ratio >= 4.5, `${nom} : ${ratio.toFixed(2)}:1 sur ${hexa(fond)}`);
  }
});

// ── Le code emploie --accent-hover là où le fond fonce au survol ─────────────

const RACINE = fileURLToPath(new URL("../../", import.meta.url));
const SOURCES = ["app", "components"].flatMap((dossier) =>
  readdirSync(join(RACINE, dossier), { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join(dossier, f)),
);
const classes = (fichier: string) =>
  [...readFileSync(join(RACINE, fichier), "utf8").matchAll(/className="([^"]*)"/g)].map(([, c]) => c.split(/\s+/));

test("aucun texte d'accent au survol d'une carte : group-hover:text-accent-hover, et les libellés qui n'apparaissent qu'au survol aussi", () => {
  const fautes: string[] = [];
  for (const fichier of SOURCES) {
    for (const c of classes(fichier)) {
      if (c.includes("group-hover:text-accent")) fautes.push(`${fichier} : group-hover:text-accent`);
      if (c.includes("text-accent") && c.includes("opacity-0") && c.includes("group-hover:opacity-100")) {
        fautes.push(`${fichier} : libellé visible au survol seulement, en text-accent`);
      }
    }
  }
  assert.deepEqual(fautes, []);
});

test("lien en text-accent qui fonce au survol (hover:bg-accent/20) : hover:text-accent-hover", () => {
  const fautes: string[] = [];
  for (const fichier of SOURCES) {
    for (const c of classes(fichier)) {
      if (c.includes("text-accent") && c.includes("hover:bg-accent/20") && !c.includes("hover:text-accent-hover")) {
        fautes.push(fichier);
      }
    }
  }
  assert.deepEqual(fautes, []);
});

