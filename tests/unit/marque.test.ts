// Le logo devient le mot LEGITVISION, en texte (composant Marque, décision
// d'Hector du 04/10). Ce test échoue si un fichier d'interface (app/,
// components/) affiche encore l'image du logo, et vérifie le lien de la marque :
// sa destination, son nom accessible, l'absence d'image.
// Restent permis : les routes d'images (icône de l'onglet, images de partage),
// qui attendent le nouveau logo, et l'url d'Organization.logo dans les données
// structurées, qui ne s'affiche pas.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const racine = new URL("../../", import.meta.url);
const RACINE = fileURLToPath(racine);
const module = (chemin: string) => new URL(chemin, racine).href;

/** Chemins relatifs des fichiers d'un dossier du dépôt, récursivement. */
const fichiers = (dossier: string): string[] =>
  readdirSync(join(RACINE, dossier), { recursive: true, encoding: "utf8" }).map((f) => join(dossier, f));

/** Images du logo : les fichiers « logo » de public/, hors logos des marques analysées. */
const IMAGES_DU_LOGO = fichiers("public")
  .filter((f) => /logo/i.test(basename(f)) && !f.startsWith(join("public", "images", "brands") + sep))
  .map((f) => f.slice("public".length).split(sep).join("/"));

const SOURCE = /\.(tsx?|jsx?|mjs|css)$/;
const ROUTE_IMAGE = /^(icon|apple-icon|favicon|opengraph-image|twitter-image)\d*\./;
const ALT_DU_LOGO = /\balt\s*=\s*\{?\s*["'`]LegitVision["'`]/;
const DONNEE_STRUCTUREE = /^\s*url:\s/;

/** Lignes d'un fichier qui affichent l'image du logo. */
function affichagesDuLogo(source: string, images: string[]): string[] {
  return source
    .split("\n")
    .filter(
      (ligne) =>
        ALT_DU_LOGO.test(ligne) ||
        (images.some((image) => ligne.includes(image)) && !DONNEE_STRUCTUREE.test(ligne)),
    );
}

test("le contrôle reconnaît l'image du logo, et pas l'url des données structurées", () => {
  const images = ["/images/legitvision-logo.png", "/logo.png"];
  assert.equal(affichagesDuLogo('  src="/images/legitvision-logo.png"', images).length, 1);
  assert.equal(affichagesDuLogo("<img src={`${SITE_URL}/logo.png`} />", images).length, 1);
  assert.equal(affichagesDuLogo('  alt="LegitVision"', images).length, 1);
  assert.equal(affichagesDuLogo("        url: `${SITE_URL}/logo.png`,", images).length, 0);
});

test("aucun fichier d'interface n'affiche plus l'image du logo", () => {
  const restes: string[] = [];
  for (const fichier of [...fichiers("app"), ...fichiers("components")]) {
    if (!SOURCE.test(fichier) || ROUTE_IMAGE.test(basename(fichier))) continue;
    const source = readFileSync(join(RACINE, fichier), "utf8");
    for (const ligne of affichagesDuLogo(source, IMAGES_DU_LOGO)) restes.push(`${fichier} : ${ligne.trim()}`);
  }
  assert.deepEqual(restes, []);
});

// next/font/local n'existe qu'à la compilation de Next : on remplace la police.
mock.module(module("components/brand/police-marque.ts"), {
  namedExports: { archivoMarque: { variable: "variable-police-marque", className: "", style: { fontFamily: "" } } },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { Marque } = (await import(module("components/brand/Marque.tsx"))) as typeof import("@/components/brand/Marque");

/** Attributs de la balise ouvrante d'un fragment HTML. */
function attributs(html: string, balise: string): Map<string, string> {
  const ouvrante = html.match(new RegExp(`^<${balise}\\b([^>]*)>`));
  assert.ok(ouvrante, `le fragment ne commence pas par <${balise}> : ${html}`);
  return new Map([...ouvrante[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(([, nom, valeur]) => [nom, valeur]));
}
const texte = (html: string) => html.replace(/<[^>]+>/g, "");

for (const [href, nom] of [
  ["/", "LegitVision, accueil"],
  ["/dashboard", "LegitVision, tableau de bord"],
] as const) {
  test(`le lien de la marque vers ${href} : « ${nom} », sans image`, () => {
    const html = renderToStaticMarkup(createElement(Marque, { href }));
    const lien = attributs(html, "a");
    assert.equal(lien.get("href"), href);
    assert.equal(lien.get("aria-label"), nom);
    // Nom en français, même sous <html lang="en"> (visiteur resté en anglais) : WCAG 3.1.2.
    assert.equal(lien.get("lang"), "fr");
    // Le nom commence par le mot affiché (WCAG 2.5.3) : la commande vocale « LegitVision » le trouve.
    assert.ok(nom.startsWith(texte(html)), `« ${texte(html)} » absent du début de « ${nom} »`);
    assert.doesNotMatch(html, /<(img|picture|svg)\b/);
    // Cible d'au moins 24 px de haut (une unité Tailwind vaut 4 px).
    const hauteur = lien.get("class")?.match(/\bmin-h-(\d+)\b/);
    assert.ok(hauteur && Number(hauteur[1]) * 4 >= 24, `hauteur minimale absente : ${lien.get("class")}`);
  });
}

test("hors lien (pied de page, 404) : le mot seul, en capitales par le CSS, au style « Marque »", () => {
  const html = renderToStaticMarkup(createElement(Marque));
  assert.doesNotMatch(html, /<(a|img|picture|svg)\b/);
  assert.equal(texte(html), "LegitVision");
  const classes = new Set(attributs(html, "span").get("class")?.split(/\s+/));
  // Style de texte « Marque » de Figma : Archivo 800, largeur 125, 0,02 em,
  // interligne 100 %, 17 px puis 20 px ; police posée par la variable, sur le mot seul.
  for (const classe of [
    "variable-police-marque",
    "font-marque",
    "font-extrabold",
    "[font-stretch:125%]",
    "tracking-[0.02em]",
    "leading-none",
    "text-[1.0625rem]",
    "sm:text-[1.25rem]",
    "uppercase",
    "text-foreground",
    // Largeur réservée pendant le chargement de la police (voir le test suivant).
    "inline-block",
    "w-[8.588em]",
  ]) {
    assert.ok(classes.has(classe), `classe absente : ${classe}`);
  }
});

// Avances du mot en capitales, Archivo graisse 800 et largeur 125, en em : 8 368
// unités sur 1 000, mesurées avec HarfBuzz (hb-shape --variations=wght=800,wdth=125)
// sur la police complète dont le sous-ensemble est tiré (police-marque.ts).
const AVANCES_EM = 8.368;

test("largeur réservée = avances du mot + une fois l'espacement par lettre", () => {
  const html = renderToStaticMarkup(createElement(Marque));
  const classes = attributs(html, "span").get("class")?.split(/\s+/) ?? [];
  const em = (prefixe: string) => {
    const classe = classes.find((c) => c.startsWith(`${prefixe}-[`) && c.endsWith("em]"));
    assert.ok(classe, `classe ${prefixe}-[…em] absente`);
    return Number(classe.slice(prefixe.length + 2, -3));
  };
  const attendu = AVANCES_EM + texte(html).length * em("tracking");
  assert.equal(em("w").toFixed(3), attendu.toFixed(3), "largeur à recalculer : texte ou espacement changé");
});

// La police livrée, lue avec le fontkit embarqué par Next (celui de next/font/local).
const fontkit = createRequire(import.meta.url)("next/dist/compiled/@next/font/dist/fontkit") as {
  default: Ouvrir & { default?: Ouvrir };
};
type Ouvrir = (fichier: Buffer) => {
  hasGlyphForCodePoint(point: number): boolean;
  variationAxes: Record<string, { min: number; max: number }>;
};
const ouvrir = fontkit.default.default ?? fontkit.default;

test("la police du mot couvre chaque lettre affichée et garde les axes de graisse et de largeur", () => {
  const police = ouvrir(readFileSync(join(RACINE, "components/brand/fonts/archivo-marque.woff2")));
  const affiche = texte(renderToStaticMarkup(createElement(Marque))).toUpperCase();
  const absentes = [...new Set(affiche)].filter((lettre) => !police.hasGlyphForCodePoint(lettre.codePointAt(0)!));
  assert.deepEqual(absentes, [], "lettres absentes du sous-ensemble : le régénérer (police-marque.ts)");
  const { wght, wdth } = police.variationAxes;
  assert.ok(wght && wght.min <= 800 && wght.max >= 800, "axe wght absent ou sans la graisse 800");
  assert.ok(wdth && wdth.max >= 125, "axe wdth absent ou sous 125 : le mot perdrait sa largeur");
});

test("police-marque.ts déclare font-stretch en plage, sans quoi font-stretch: 125% n'atteint pas l'axe wdth", () => {
  const source = readFileSync(join(RACINE, "components/brand/police-marque.ts"), "utf8");
  assert.match(source, /declarations:\s*\[\{\s*prop:\s*"font-stretch",\s*value:\s*"62% 125%"\s*\}\]/);
});
