// Sur téléphone (moins de 640 px), le bouton FR/EN des en-têtes est masqué
// (LanguageToggle) : toujours en français, et aussi en anglais dans l'en-tête
// du tableau de bord. La langue doit rester accessible ailleurs, pour tout
// visiteur (décision d'Hector du 05/10) : dans le pied de page de l'accueil
// (FooterLinksI18n) et dans le menu du compte (UserMenu, menu MenuDuCompte).
// Ce test échoue si l'une de ces deux commandes disparaît, se masque à une
// largeur, perd son libellé dans la langue de destination, sa cible de 24 px,
// son focus visible ou son effet (toggleLocale).
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;
const source = (chemin: string) => readFileSync(new URL(chemin, racine), "utf8");

// Langue du visiteur, simulée : useTranslation lit `langue` et compte les bascules.
let langue: "fr" | "en" = "fr";
let bascules = 0;
mock.module(module("lib/i18n/LanguageProvider.tsx"), {
  namedExports: {
    useTranslation: () => ({
      locale: langue,
      t: (cle: string) => cle,
      setLocale: () => {},
      toggleLocale: () => {
        bascules += 1;
      },
    }),
  },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
// UserMenu les importe ; le menu ouvert (MenuDuCompte) ne s'en sert pas.
mock.module("next/navigation", { namedExports: { useRouter: () => ({ push() {}, refresh() {} }) } });
mock.module(module("lib/supabase/client.ts"), { namedExports: { createClient: () => ({}) } });

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { FooterLinksI18n } = (await import(
  module("components/landing/LandingI18nClient.tsx")
)) as typeof import("@/components/landing/LandingI18nClient");
const { MenuDuCompte } = (await import(module("components/auth/UserMenu.tsx"))) as typeof import("@/components/auth/UserMenu");
const { BasculeLangue } = (await import(module("components/BasculeLangue.tsx"))) as typeof import("@/components/BasculeLangue");
const { LanguageToggle } = (await import(module("components/LanguageToggle.tsx"))) as typeof import("@/components/LanguageToggle");

const LIBELLE = {
  fr: { texte: "English version", lang: "en" },
  en: { texte: "Version française", lang: "fr" },
} as const;

const texte = (html: string) => html.replace(/<[^>]+>/g, "").trim();
const attributs = (ouvrante: string) =>
  new Map([...ouvrante.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, nom, valeur]) => [nom, valeur]));

/** Les boutons d'un fragment HTML : attributs et texte. */
function boutons(html: string) {
  return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(([, ouvrante, contenu]) => ({
    attributs: attributs(ouvrante),
    texte: texte(contenu),
  }));
}

/**
 * Classes qui retirent un élément de l'affichage, à toutes les largeurs ou à
 * certaines, dans du HTML rendu (class) ou dans un fichier source (className).
 */
function classesQuiMasquent(html: string): string[] {
  return [...html.matchAll(/\bclass(?:Name)?="([^"]*)"/g)]
    .flatMap(([, classes]) => classes.split(/\s+/))
    .filter((classe) => ["hidden", "invisible", "sr-only", "collapse"].includes(classe.split(":").pop() ?? ""));
}

/** Vérifie la commande de langue d'un fragment rendu, pour la langue courante. */
function verifierCommande(html: string, lieu: string) {
  const attendu = LIBELLE[langue];
  const commande = boutons(html).find((b) => b.texte === attendu.texte);
  assert.ok(commande, `${lieu} : pas de bouton « ${attendu.texte} » (visiteur en ${langue})`);
  assert.equal(commande.attributs.get("type"), "button");
  // Libellé dans la langue de destination, annoncé comme tel (WCAG 3.1.2).
  assert.equal(commande.attributs.get("lang"), attendu.lang, `${lieu} : attribut lang`);
  // Le texte affiché est le nom accessible : pas d'aria-label qui le remplacerait.
  assert.equal(commande.attributs.has("aria-label"), false, `${lieu} : aria-label inattendu`);
  const classes = (commande.attributs.get("class") ?? "").split(/\s+/);
  // Cible d'au moins 24 px de haut (une unité Tailwind vaut 4 px).
  const hauteur = classes.map((c) => c.match(/^min-h-(\d+)$/)).find(Boolean);
  assert.ok(hauteur && Number(hauteur[1]) * 4 >= 24, `${lieu} : hauteur minimale absente ou sous 24 px`);
  // Focus visible : anneau --ring, opaque, comme les boutons des en-têtes.
  for (const classe of ["focus-visible:ring-2", "focus-visible:ring-ring"]) {
    assert.ok(classes.includes(classe), `${lieu} : classe de focus absente : ${classe}`);
  }
  // Texte lisible : --muted-foreground (7,5:1 en sombre), jamais --subtle-foreground
  // (4,3:1), réservé aux mentions accessoires (app/globals.css).
  assert.ok(classes.includes("text-muted-foreground"), `${lieu} : couleur de texte`);
  // Affichée à toutes les largeurs : rien dans le fragment ne la masque.
  assert.deepEqual(classesQuiMasquent(html), [], `${lieu} : classe qui masque`);
}

const menuOuvert = () =>
  renderToStaticMarkup(
    createElement(MenuDuCompte, { nom: "Hector V", email: "hector@example.com", onFermer() {}, onDeconnexion() {} }),
  );

/** Éléments d'un arbre React, sans rendre les composants qu'il contient. */
type Noeud = { type: unknown; props: { children?: unknown } & Record<string, unknown> };
function elements(noeud: unknown): Noeud[] {
  if (Array.isArray(noeud)) return noeud.flatMap(elements);
  if (!noeud || typeof noeud !== "object" || !("props" in noeud)) return [];
  const element = noeud as Noeud;
  return [element, ...elements(element.props.children)];
}

/** Clique la commande de langue de l'arbre : renvoie le nombre de bascules. */
function cliquer(arbre: unknown, lieu: string): number {
  const commande = elements(arbre).find((e) => e.type === BasculeLangue);
  assert.ok(commande, `${lieu} : BasculeLangue absente de l'arbre`);
  const bouton = BasculeLangue(commande.props as Parameters<typeof BasculeLangue>[0]);
  const avant = bascules;
  (bouton.props as { onClick: () => void }).onClick();
  return bascules - avant;
}

for (const visiteur of ["fr", "en"] as const) {
  test(`pied de page de l'accueil, visiteur en ${visiteur} : « ${LIBELLE[visiteur].texte} »`, () => {
    langue = visiteur;
    verifierCommande(renderToStaticMarkup(createElement(FooterLinksI18n)), "pied de page");
    assert.equal(cliquer(FooterLinksI18n(), "pied de page"), 1, "pied de page : la commande ne bascule pas la langue");
  });

  test(`menu du compte, visiteur en ${visiteur} : « ${LIBELLE[visiteur].texte} »`, () => {
    langue = visiteur;
    verifierCommande(menuOuvert(), "menu du compte");
    const props = { nom: "Hector V", email: "hector@example.com", onFermer() {}, onDeconnexion() {} };
    assert.equal(cliquer(MenuDuCompte(props), "menu du compte"), 1, "menu du compte : la commande ne bascule pas la langue");
  });
}

test("l'accueil rend la commande dans son pied de page, et UserMenu son menu ouvert", () => {
  const accueil = source("app/page.tsx");
  const pied = accueil.slice(accueil.indexOf("<footer"), accueil.indexOf("</footer>"));
  assert.match(pied, /<FooterLinksI18n \/>/, "app/page.tsx : FooterLinksI18n absent du pied de page");
  assert.deepEqual(classesQuiMasquent(pied), [], "app/page.tsx : classe qui masque dans le pied de page");
  assert.match(source("components/auth/UserMenu.tsx"), /\{open && \(\s*<MenuDuCompte\b/, "UserMenu ne rend plus MenuDuCompte");
});

test("en-têtes : le bouton FR/EN reste masqué sur téléphone en français, et en anglais avec masqueSurTelephone", () => {
  const classes = (props: { masqueSurTelephone?: boolean }) =>
    attributs(renderToStaticMarkup(createElement(LanguageToggle, props)).match(/^<button\b([^>]*)>/)?.[1] ?? "")
      .get("class")
      ?.split(/\s+/) ?? [];
  langue = "fr";
  assert.ok(classes({}).includes("hidden") && classes({}).includes("sm:flex"));
  langue = "en";
  assert.ok(!classes({}).includes("hidden"), "en anglais, sans masqueSurTelephone : affiché");
  assert.ok(classes({ masqueSurTelephone: true }).includes("hidden"));
});
