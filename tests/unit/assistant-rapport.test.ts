// La bulle de l'assistant recouvrait les notes des zones et le bouton du bas
// du rapport, puis, sur tablette, la colonne de droite des cartes du tableau
// de bord (décisions d'Hector des 05/10 et 06/10). Sur un rapport affiché,
// sous 1024 px, et sur le tableau de bord, sous 1360 px, le bouton de
// l'assistant n'est plus flottant : il est rendu dans le flux, à la fin de la
// page, à droite de la colonne de la page. À partir de ce seuil, et sur toutes
// les autres pages, rien ne change.
//
// Ce fichier vérifie, sans navigateur, ce qui porte ce comportement : les
// classes du bouton et de son conteneur, les règles CSS « assistant-flux: »
// (tailwind.config.ts), la marque data-assistant-flux des deux pages, et la
// place du panneau dans le source. Le comportement lui-même (où est le bouton,
// ce que font les clics) est vérifié dans Chromium par
// rapport-navigateur.test.ts, et le rendu de la vraie page du tableau de bord
// par tableau-de-bord-assistant.test.ts.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { sep } from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import config from "../../tailwind.config";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;
const source = (chemin: string) => readFileSync(new URL(chemin, racine), "utf8");

mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: { useTranslation: () => ({ locale: "fr", t: (cle: string) => cle, setLocale() {}, toggleLocale() {} }) },
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { ChatWidget } = (await import(
  adresseDe("components/chat/ChatWidget.tsx")
)) as typeof import("@/components/chat/ChatWidget");

/** Le conteneur et le bouton de l'assistant, panneau fermé. */
function assistant() {
  const html = renderToStaticMarkup(createElement(ChatWidget));
  const conteneur = html.match(/^<div(?: class="([^"]*)")?>/);
  const bouton = html.match(/<button\b[^>]*\bclass="([^"]*)"[^>]*>/);
  assert.ok(conteneur && bouton, `rendu inattendu : ${html}`);
  assert.equal(html.split("<button").length - 1, 1, "panneau fermé : un seul bouton, celui de l'assistant");
  assert.match(html, /aria-label="Ouvrir l(?:'|&#x27;)assistant"/);
  return {
    conteneur: (conteneur[1] ?? "").split(/\s+/).filter(Boolean),
    bouton: bouton[1].split(/\s+/).filter(Boolean),
  };
}

// Sur une page qui demande le bouton dans le flux, sous son seuil.
const DANS_LE_FLUX = "assistant-flux:";
// La même condition, pour une seule des deux marques : la colonne de la page.
const COLONNES: Record<string, string> = { lg: "max-w-3xl", "1360": "max-w-6xl" };
const classesDeColonne = Object.entries(COLONNES).map(([seuil, largeur]) => `assistant-flux-${seuil}:${largeur}`);

test("hors de ces pages, et à partir de leur seuil : le bouton flotte en bas à droite, son conteneur ne pèse rien", () => {
  const { conteneur, bouton } = assistant();
  for (const classe of ["fixed", "bottom-6", "right-6", "z-50", "size-14"]) {
    assert.ok(bouton.includes(classe), `bouton sans ${classe}`);
  }
  // Tout ce qui met le bouton dans le flux est sous la condition « assistant-flux ».
  assert.deepEqual(conteneur.filter((c) => !c.startsWith("assistant-flux")), [], "le conteneur prend de la place hors de ces pages");
  assert.deepEqual(bouton.filter((c) => /^(sm|md|lg|xl|2xl|max-\w+):/.test(c)), [], "la position du bouton dépend d'une autre largeur");
});

test("sur un rapport ou sur le tableau de bord, sous le seuil de la page : le bouton est dans le flux, à droite de la colonne, avec la marge de la page", () => {
  const { conteneur, bouton } = assistant();
  assert.deepEqual(bouton.filter((c) => c.startsWith("assistant-flux")), [`${DANS_LE_FLUX}static`]);
  // Dans la colonne de la page (centrée, à sa largeur), aligné à droite, à
  // 16 px du bord (px-4, la marge des deux pages), 24 px sous lui. min-h-20 :
  // 56 px du bouton + 24 px ; la page garde sa hauteur quand le panneau
  // s'ouvre et que le bouton quitte le flux.
  assert.deepEqual(
    [...conteneur].sort(),
    [...["flex", "justify-end", "min-h-20", "mx-auto", "pb-6", "px-4"].map((c) => DANS_LE_FLUX + c), ...classesDeColonne].sort(),
  );
});

// Les utilitaires du site, compilés par Tailwind avec la configuration du dépôt.
const { css } = await postcss([tailwindcss({ ...config, corePlugins: { preflight: false } })]).process(
  "@tailwind utilities;",
  { from: undefined },
);
// Les deux seuils décidés, chacun sous sa marque : le rapport sous « lg »
// (1024 px, le point de rupture du site), le tableau de bord sous 1360 px.
// 1360 = 1152 (largeur maximale de son contenu, max-w-6xl) + 2 × 104 (56 px du
// bouton + 24 px entre lui et le bord de la fenêtre + 24 px d'écart avec la
// colonne) ; ce n'est pas un point de rupture du site.
const SEUILS: Array<[string, string]> = [["lg", "1024px"], ["1360", "1360px"]];

test("« assistant-flux: » : sous le seuil que la page demande (data-assistant-flux), et seulement sur une page qui le demande", () => {
  const attendues: Array<[string, string]> = [
    ["static", "position: static"],
    ["flex", "display: flex"],
    ["mx-auto", "margin-left: auto"],
    ["min-h-20", "min-height: 5rem"],
    ["justify-end", "justify-content: flex-end"],
    ["px-4", "padding-left: 1rem"],
    ["pb-6", "padding-bottom: 1.5rem"],
    ["min-h-0", "min-height: 0px"],
  ];
  /** La règle d'une classe pour un seuil : sa déclaration, sous la requête de largeur de ce seuil. */
  const verifier = (variante: string, classe: string, declaration: string, seuil: string, largeur: string) => {
    // Le sélecteur entier : un navigateur sans :has() ignore toute la règle, et
    // garde donc ensemble le bouton flottant et la place réservée sous la page.
    const selecteur = `body:has([data-assistant-flux="${seuil}"]) .${variante}\\:${classe} {`;
    const position = css.indexOf(selecteur);
    assert.ok(position >= 0, `règle absente de la CSS compilée : ${selecteur}`);
    assert.equal(css.indexOf(selecteur, position + 1), -1, `règle en double : ${selecteur}`);
    assert.ok(css.slice(position, css.indexOf("}", position)).includes(declaration), `${classe} : ${declaration} attendu`);
    // Sous le seuil : le complément exact de « lg: », ou de (min-width: 1360px).
    const media = css.lastIndexOf("@media", position);
    assert.equal(css.slice(media, css.indexOf("{", media)).trim(), `@media not all and (min-width: ${largeur})`, `${classe}, ${seuil}`);
  };
  for (const [seuil, largeur] of SEUILS) {
    for (const [classe, declaration] of attendues) verifier("assistant-flux", classe, declaration, seuil, largeur);
  }
  // La colonne de chaque page, sous son seul seuil.
  verifier("assistant-flux-lg", "max-w-3xl", "max-width: 48rem", "lg", "1024px");
  verifier("assistant-flux-1360", "max-w-6xl", "max-width: 72rem", "1360", "1360px");
  // Aucune règle « assistant-flux » ne s'applique hors de ces conditions.
  const regles = [...css.matchAll(/^.*\.assistant-flux[\w-]*\\:[^{]*\{/gm)].map(([regle]) => regle.trim());
  assert.equal(regles.length, attendues.length * SEUILS.length + 2, regles.join("\n"));
  for (const regle of regles) assert.match(regle, /^body:has\(\[data-assistant-flux="(lg|1360)"\]\) \.assistant-flux/, regle);
  // Les marques que la feuille de style connaît : ces deux seuils, pas un de plus.
  assert.deepEqual(
    [...new Set([...css.matchAll(/data-assistant-flux="([^"]*)"/g)].map(([, seuil]) => seuil))].sort(),
    SEUILS.map(([seuil]) => seuil).sort(),
  );
  // La variante d'un seul seuil ne répond qu'à la marque de ce seuil.
  for (const regle of regles.filter((r) => /\.assistant-flux-(lg|1360)\\:/.test(r))) {
    const [, marque, variante] = regle.match(/data-assistant-flux="(lg|1360)"\]\) \.assistant-flux-(lg|1360)\\:/) ?? [];
    assert.equal(marque, variante, regle);
  }
  // « lg » est bien le point de rupture « lg: » du site, à 1024 px. « 1360 »
  // n'en est pas un : sa largeur est écrite dans la configuration.
  const ecrans = resolveConfig(config).theme.screens as Record<string, string>;
  assert.equal(ecrans.lg, "1024px", "« lg » ne vaut plus 1024px");
  assert.ok(!("1360" in ecrans), "« 1360 » est devenu un point de rupture du site");
  // L'ancienne marque du tableau de bord (« xl », 1280 px) a disparu.
  assert.ok(!css.includes('data-assistant-flux="xl"') && !css.includes("assistant-flux-xl"));
  // L'ancien nom de la variante et sa marque ont disparu.
  assert.ok(!css.includes("rapport-mobile") && !css.includes("data-rapport"));
});

test("« assistant-flux: » : la marque « lg » suit le point de rupture « lg: » du site, la marque « 1360 » vaut 1360 px", async () => {
  // Le même site, dont « lg: » passerait à 1000 px : la règle du rapport suit, celle du tableau de bord ne bouge pas.
  const { css: autre } = await postcss([
    tailwindcss({
      ...config,
      content: [{ raw: "assistant-flux:static assistant-flux-lg:max-w-3xl assistant-flux-1360:max-w-6xl" }],
      theme: { ...config.theme, extend: { ...config.theme?.extend, screens: { lg: "1000px" } } },
      corePlugins: { preflight: false },
    }),
  ]).process("@tailwind utilities;", { from: undefined });
  const largeurs = [...autre.matchAll(/@media not all and \(min-width: ([^)]*)\) \{\s*body:has\(\[data-assistant-flux="([^"]*)"\]\) \.(assistant-flux[\w-]*)\\:/g)].map(
    ([, largeur, marque, variante]) => `${variante} ${marque} ${largeur}`,
  );
  assert.deepEqual(largeurs.sort(), [
    "assistant-flux 1360 1360px",
    "assistant-flux lg 1000px",
    "assistant-flux-1360 1360 1360px",
    "assistant-flux-lg lg 1000px",
  ]);
});

/** Les marques posées dans le JSX d'un fichier (pas celles que citent ses commentaires). */
const marques = (code: string) => [...code.matchAll(/<[A-Za-z][^<>]*\sdata-assistant-flux="([^"]*)"/g)].map(([, seuil]) => seuil);

// Les pages qui demandent le bouton dans le flux : leur fichier, leur seuil.
const PAGES: Array<[string, string, string]> = [
  ["le rapport", "components/check/ReportView.tsx", "lg"],
  ["le tableau de bord", "app/(dashboard)/dashboard/page.tsx", "1360"],
];

for (const [nom, fichier, seuil] of PAGES) {
  test(`${nom} demande le bouton dans le flux sous « ${seuil} », par sa marque et non par son adresse, et sa colonne est celle que prend le bouton`, () => {
    const code = source(fichier);
    // La marque est sur le bloc racine de la page, sans condition : il perd sa hauteur minimale sous le seuil.
    const bloc = code.match(/return \(\s*(?:\/\/[^\n]*\n\s*)*<div data-assistant-flux="(\w+)" className="([^"]*)">/);
    assert.ok(bloc, `${fichier} : data-assistant-flux n'est plus sur le bloc racine`);
    assert.equal(bloc[1], seuil);
    assert.deepEqual(bloc[2].split(/\s+/), ["min-h-screen", "bg-background", "assistant-flux:min-h-0"]);
    assert.deepEqual(marques(code), [seuil], `${fichier} : une seule marque attendue`);
    // Le contenu : la colonne que le conteneur du bouton reprend pour ce seuil,
    // la même marge, et 24 px sous le dernier bloc quand le bouton est dans le flux.
    const principal = code.match(/<main className="([^"]*)">/)?.[1].split(/\s+/) ?? [];
    for (const classe of ["mx-auto", COLONNES[seuil], "px-4", "assistant-flux:pb-6"]) {
      assert.ok(principal.includes(classe), `${fichier} : <main> sans ${classe} (${principal.join(" ")})`);
    }
    assert.ok(classesDeColonne.includes(`assistant-flux-${seuil}:${COLONNES[seuil]}`));
  });
}

test("seuls le rapport et le tableau de bord demandent le bouton dans le flux : une page 404 ou d'erreur n'est pas un rapport", () => {
  const marquees: string[] = [];
  for (const dossier of ["app", "components"]) {
    for (const fichier of readdirSync(new URL(dossier, racine), { recursive: true, encoding: "utf8" })) {
      if (!/\.tsx?$/.test(fichier)) continue;
      const chemin = `${dossier}/${fichier.split(sep).join("/")}`;
      for (const seuil of marques(source(chemin))) marquees.push(`${chemin} : ${seuil}`);
    }
  }
  assert.deepEqual(marquees.sort(), PAGES.map(([, fichier, seuil]) => `${fichier} : ${seuil}`).sort());
  // Chaque marque est un seuil que la feuille de style connaît : sans règle pour elle, le bouton resterait flottant.
  for (const [, , seuil] of PAGES) assert.ok(css.includes(`body:has([data-assistant-flux="${seuil}"]) .assistant-flux\\:static {`), seuil);
  // L'assistant ne décide pas d'après l'adresse.
  assert.doesNotMatch(source("components/chat/ChatWidget.tsx"), /usePathname|next\/navigation/);
  // L'ancien nom n'est plus nulle part.
  for (const fichier of ["components/chat/ChatWidget.tsx", "components/check/ReportView.tsx", "tailwind.config.ts"]) {
    assert.doesNotMatch(source(fichier), /rapport-mobile|data-rapport/, fichier);
  }
});

test("source de l'assistant : le panneau garde sa place et ses commandes", () => {
  const widget = source("components/chat/ChatWidget.tsx");
  // Panneau : fixé au-dessus du bouton, à toutes les largeurs, sur toutes les pages.
  assert.match(
    widget,
    /\{open && \(\s*<div\s+ref=\{panelRef\}\s+className="fixed bottom-24 right-6 z-50 flex h-\[500px\] w-\[380px\] max-w-\[calc\(100vw-2rem\)\] flex-col /,
  );
  assert.match(widget, /onClick=\{\(\) => setOpen\(\(v\) => !v\)\}/, "le bouton n'ouvre ni ne ferme plus le panneau");
  assert.match(widget, /aria-label=\{open \? "Fermer l'assistant" : "Ouvrir l'assistant"\}/);
  assert.match(widget, /onClick=\{\(\) => setOpen\(false\)\}\s*className="[^"]*"\s*aria-label="Fermer le chat"/);
  // Panneau ouvert, le bouton est flottant partout, rapport et tableau de bord compris.
  assert.match(widget, /className=\{`\$\{BOUTON_FLOTTANT\} \$\{open \? "" : BOUTON_DANS_LE_FLUX\} /);
});

test("l'assistant est monté après le contenu de la page : dans le flux, il vient à la fin", () => {
  const racineDuSite = source("app/layout.tsx");
  assert.match(racineDuSite, /\{children\}\s*<ChatWidget \/>/);
});
