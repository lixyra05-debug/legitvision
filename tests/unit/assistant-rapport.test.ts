// La bulle de l'assistant recouvrait les notes des zones et le bouton du bas
// du rapport sur téléphone (décision d'Hector du 05/10). Sur un rapport
// affiché, sous 640 px, le bouton de l'assistant n'est plus flottant : il est
// rendu dans le flux, à la fin de la page, aligné à droite avec la marge de la
// page. À partir de 640 px, et sur toutes les autres pages, rien ne change.
//
// Ce fichier vérifie, sans navigateur, ce qui porte ce comportement : les
// classes du bouton et de son conteneur, la règle CSS « rapport-mobile: »
// (tailwind.config.ts), la marque data-rapport du rapport, et la place du
// panneau dans le source. Le comportement lui-même (où est le bouton, ce que
// font les clics) est vérifié dans Chromium par rapport-navigateur.test.ts.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
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

const SUR_UN_RAPPORT = "rapport-mobile:";

test("hors d'un rapport, et à partir de 640 px : le bouton flotte en bas à droite, son conteneur ne pèse rien", () => {
  const { conteneur, bouton } = assistant();
  for (const classe of ["fixed", "bottom-6", "right-6", "z-50", "size-14"]) {
    assert.ok(bouton.includes(classe), `bouton sans ${classe}`);
  }
  // Tout ce qui met le bouton dans le flux est sous la condition « rapport-mobile: ».
  assert.deepEqual(conteneur.filter((c) => !c.startsWith(SUR_UN_RAPPORT)), [], "le conteneur prend de la place hors d'un rapport");
  assert.deepEqual(bouton.filter((c) => /^(sm|md|lg|xl|max-sm):/.test(c)), [], "la position du bouton dépend d'une autre largeur");
});

test("sur un rapport, sous 640 px : le bouton est dans le flux, à droite, avec la marge de la page", () => {
  const { conteneur, bouton } = assistant();
  assert.deepEqual(bouton.filter((c) => c.startsWith(SUR_UN_RAPPORT)), [`${SUR_UN_RAPPORT}static`]);
  // Aligné à droite, à 16 px du bord (px-4, la marge du rapport), 24 px sous lui.
  // min-h-20 : 56 px du bouton + 24 px ; la page garde sa hauteur quand le
  // panneau s'ouvre et que le bouton quitte le flux.
  assert.deepEqual(
    [...conteneur].sort(),
    ["flex", "justify-end", "min-h-20", "pb-6", "px-4"].map((c) => SUR_UN_RAPPORT + c).sort(),
  );
});

test("« rapport-mobile: » : sous 640 px, et seulement si la page affiche un rapport (data-rapport)", async () => {
  const { css } = await postcss([tailwindcss({ ...config, corePlugins: { preflight: false } })]).process(
    "@tailwind utilities;",
    { from: undefined },
  );
  const attendues: Array<[string, string]> = [
    ["static", "position: static"],
    ["flex", "display: flex"],
    ["min-h-20", "min-height: 5rem"],
    ["justify-end", "justify-content: flex-end"],
    ["px-4", "padding-left: 1rem"],
    ["pb-6", "padding-bottom: 1.5rem"],
    ["min-h-0", "min-height: 0px"],
  ];
  for (const [classe, declaration] of attendues) {
    // Le sélecteur entier : un navigateur sans :has() ignore toute la règle, et
    // garde donc ensemble le bouton flottant et la place réservée sous le rapport.
    const selecteur = `body:has([data-rapport]) .rapport-mobile\\:${classe} {`;
    const position = css.indexOf(selecteur);
    assert.ok(position >= 0, `règle absente de la CSS compilée : ${selecteur}`);
    assert.ok(css.slice(position, css.indexOf("}", position)).includes(declaration), `${classe} : ${declaration} attendu`);
    // Sous 640 px : le complément exact de « sm: » (min-width: 640px).
    const media = css.lastIndexOf("@media", position);
    assert.equal(css.slice(media, css.indexOf("{", media)).trim(), "@media not all and (min-width: 640px)", classe);
  }
  // Aucune règle « rapport-mobile: » ne s'applique hors de cette condition.
  const regles = [...css.matchAll(/^.*\.rapport-mobile\\:[^{]*\{/gm)].map(([regle]) => regle.trim());
  assert.equal(regles.length, attendues.length, regles.join("\n"));
  for (const regle of regles) assert.ok(regle.startsWith("body:has([data-rapport]) "), regle);
  assert.match(css, /@media \(min-width: 640px\)/, "« sm » ne vaut plus 640 px");
});

test("le rapport se signale par data-rapport, et non par son adresse : une page 404 ou d'erreur n'est pas un rapport", () => {
  const rapport = source("components/check/ReportView.tsx");
  assert.match(rapport, /return \(\s*(?:\/\/[^\n]*\n\s*)*<div data-rapport className="[^"]*">/, "data-rapport n'est plus sur le bloc racine du rapport");
  for (const fichier of ["app/not-found.tsx", "app/error.tsx", "app/global-error.tsx", "app/layout.tsx"]) {
    assert.ok(!source(fichier).includes("data-rapport"), `${fichier} se déclare comme un rapport`);
  }
  // L'assistant ne décide plus d'après l'adresse.
  assert.doesNotMatch(source("components/chat/ChatWidget.tsx"), /usePathname|next\/navigation/);
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
  // Panneau ouvert, le bouton est flottant partout, rapport compris.
  assert.match(widget, /className=\{`\$\{BOUTON_FLOTTANT\} \$\{open \? "" : BOUTON_DANS_LE_FLUX\} /);
});

test("l'assistant est monté après le contenu de la page : dans le flux, il vient à la fin", () => {
  const racineDuSite = source("app/layout.tsx");
  assert.match(racineDuSite, /\{children\}\s*<ChatWidget \/>/);
});
