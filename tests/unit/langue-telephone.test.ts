// Sur téléphone (moins de 640 px), le bouton FR/EN des en-têtes est masqué
// (LanguageToggle) : toujours en français, et aussi en anglais dans l'en-tête
// du tableau de bord. La langue doit rester accessible ailleurs, pour tout
// visiteur (décision d'Hector du 05/10) : dans le pied de page de l'accueil
// (FooterLinksI18n) et dans le menu du compte (UserMenu : CompteConnecte, le
// bouton aux initiales, ouvre MenuDuCompte).
// Ce test échoue si l'une de ces deux commandes disparaît, se masque à une
// largeur, perd son libellé dans la langue de destination, sa cible de 24 px,
// son focus visible ou son effet (toggleLocale). Il échoue aussi si le chemin
// vers le menu du compte se perd, là où il est la seule commande de langue
// sous 640 px (tableau de bord, nouvelle analyse) : menu absent de l'en-tête
// ou masqué, bouton sans nom ni état annoncé.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

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
// UserMenu les importe ; le bouton du compte et son menu ne s'en servent pas.
mock.module("next/navigation", { namedExports: { useRouter: () => ({ push() {}, refresh() {} }) } });
mock.module(module("lib/supabase/client.ts"), { namedExports: { createClient: () => ({}) } });

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { FooterLinksI18n } = (await import(
  module("components/landing/LandingI18nClient.tsx")
)) as typeof import("@/components/landing/LandingI18nClient");
const { CompteConnecte, MenuDuCompte, MENU_DU_COMPTE_ID } = (await import(
  module("components/auth/UserMenu.tsx")
)) as typeof import("@/components/auth/UserMenu");
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

/** Classe qui retire un élément de l'affichage, à toutes les largeurs ou à certaines. */
const masque = (classe: string) => ["hidden", "invisible", "sr-only", "collapse"].includes(classe.split(":").pop() ?? "");

/** Classes qui masquent, dans du HTML rendu (class) ou dans un fichier source (className). */
function classesQuiMasquent(html: string): string[] {
  return [...html.matchAll(/\bclass(?:Name)?="([^"]*)"/g)].flatMap(([, classes]) => classes.split(/\s+/)).filter(masque);
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

/** Nom attendu du bouton du compte : ses initiales, puis ce qu'il ouvre. */
const NOM_DU_BOUTON = "HV, menu du compte et langue";

/** Le bouton du compte (initiales « HV ») tel que UserMenu le rend une fois la session lue, menu fermé ou ouvert. */
const compte = (ouvertParDefaut: boolean) =>
  renderToStaticMarkup(
    createElement(CompteConnecte, { initiales: "HV", nom: "Hector V", email: "hector@example.com", onDeconnexion() {}, ouvertParDefaut }),
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

/**
 * Chaque <Composant … /> d'un fichier source, lu par l'analyseur de TypeScript :
 * ses attributs, les éléments JSX qui l'entourent (du plus proche au plus
 * lointain), et ce qui peut le soustraire à l'affichage ou aux lecteurs
 * d'écran : rendu sous condition avant d'atteindre son <nav>, ancêtre masqué
 * par une classe ou un attribut, classes ou attributs calculés (invérifiables).
 */
function rendusDe(chemin: string, composant: string) {
  const fichier = ts.createSourceFile(chemin, source(chemin), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const rendus: { attributs: string[]; ancetres: string[]; sousCondition: boolean; masques: string[] }[] = [];
  const visiter = (noeud: ts.Node): void => {
    if (ts.isJsxSelfClosingElement(noeud) && noeud.tagName.getText(fichier) === composant) {
      const rendu = {
        attributs: noeud.attributes.properties.map((a) => a.getText(fichier)),
        ancetres: [] as string[],
        sousCondition: false,
        masques: [] as string[],
      };
      for (let parent: ts.Node | undefined = noeud.parent; parent; parent = parent.parent) {
        if (ts.isJsxExpression(parent) && !rendu.ancetres.includes("nav")) rendu.sousCondition = true;
        if (!ts.isJsxElement(parent)) continue;
        const ouvrante = parent.openingElement;
        rendu.ancetres.push(ouvrante.tagName.getText(fichier));
        for (const attribut of ouvrante.attributes.properties) {
          if (!ts.isJsxAttribute(attribut)) {
            rendu.masques.push(attribut.getText(fichier));
            continue;
          }
          const nom = attribut.name.getText(fichier);
          if (["hidden", "inert", "aria-hidden"].includes(nom)) rendu.masques.push(nom);
          if (nom !== "className") continue;
          const valeur = attribut.initializer;
          if (valeur && ts.isStringLiteral(valeur)) rendu.masques.push(...valeur.text.split(/\s+/).filter(masque));
          else rendu.masques.push("className calculé");
        }
      }
      rendus.push(rendu);
    }
    ts.forEachChild(noeud, visiter);
  };
  visiter(fichier);
  return rendus;
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

  // Le bouton aux initiales est la porte du menu : un lecteur d'écran doit
  // entendre ce qu'il ouvre et s'il est ouvert (WCAG 4.1.2, 2.4.6, 2.5.3).
  test(`bouton du compte, visiteur en ${visiteur} : nommé, état annoncé, menu désigné, jamais masqué`, () => {
    langue = visiteur;
    const ferme = compte(false);
    const [bouton, ...autres] = boutons(ferme);
    assert.ok(bouton && autres.length === 0, "menu fermé : un seul bouton attendu, celui du compte");
    assert.equal(bouton.attributs.get("type"), "button");
    // Les initiales affichées ouvrent le nom ; la suite dit ce que le bouton
    // ouvre (un menu, le compte, la langue), en français dans les deux langues,
    // annoncé comme tel (lang) : on n'ajoute plus de texte à la version anglaise.
    assert.equal(bouton.texte, "HV");
    assert.equal(bouton.attributs.get("aria-label"), NOM_DU_BOUTON);
    assert.equal(bouton.attributs.get("lang"), "fr");
    assert.equal(bouton.attributs.get("aria-expanded"), "false");
    assert.equal(bouton.attributs.has("aria-controls"), false, "menu fermé : aria-controls ne désigne rien");
    assert.deepEqual(classesQuiMasquent(ferme), [], "bouton du compte : classe qui masque");

    const ouvert = compte(true);
    const declencheur = boutons(ouvert)[0];
    assert.equal(declencheur.attributs.get("aria-label"), NOM_DU_BOUTON);
    assert.equal(declencheur.attributs.get("aria-expanded"), "true");
    assert.equal(declencheur.attributs.get("aria-controls"), MENU_DU_COMPTE_ID);
    assert.equal(ouvert.split(`id="${MENU_DU_COMPTE_ID}"`).length - 1, 1, "le menu désigné par aria-controls est rendu une fois");
    assert.deepEqual(classesQuiMasquent(ouvert), [], "menu du compte ouvert : classe qui masque");
    assert.ok(
      boutons(ouvert).some((b) => b.texte === LIBELLE[visiteur].texte && b.attributs.get("lang") === LIBELLE[visiteur].lang),
      "menu ouvert depuis le bouton : commande de langue absente",
    );
  });

  // Bouton FR/EN des en-têtes : son nom commence par le libellé affiché
  // (WCAG 2.5.3) et dit la destination dans sa langue (WCAG 3.1.2).
  test(`bouton FR/EN des en-têtes, visiteur en ${visiteur} : nom « ${visiteur.toUpperCase()}, ${LIBELLE[visiteur].texte} »`, () => {
    langue = visiteur;
    const [bouton] = boutons(renderToStaticMarkup(createElement(LanguageToggle)));
    assert.equal(bouton.attributs.get("type"), "button");
    assert.equal(bouton.texte, visiteur.toUpperCase());
    assert.equal(bouton.attributs.get("aria-label"), `${bouton.texte}, ${LIBELLE[visiteur].texte}`);
    assert.equal(bouton.attributs.get("lang"), LIBELLE[visiteur].lang);
  });
}

test("l'accueil rend la commande dans son pied de page, et UserMenu son menu ouvert", () => {
  const accueil = source("app/page.tsx");
  const pied = accueil.slice(accueil.indexOf("<footer"), accueil.indexOf("</footer>"));
  assert.match(pied, /<FooterLinksI18n \/>/, "app/page.tsx : FooterLinksI18n absent du pied de page");
  assert.deepEqual(classesQuiMasquent(pied), [], "app/page.tsx : classe qui masque dans le pied de page");
  const menu = source("components/auth/UserMenu.tsx");
  assert.match(menu, /return \(\s*<CompteConnecte\b/, "UserMenu ne rend plus CompteConnecte au visiteur connecté");
  assert.match(menu, /\{open && \(\s*<MenuDuCompte\b/, "CompteConnecte ne rend plus MenuDuCompte");
});

// Sous 640 px, le bouton FR/EN est masqué sur ces deux écrans (dans les deux
// langues sur le tableau de bord, en français sur la nouvelle analyse) : le
// menu du compte y est la seule commande de langue.
for (const [ecran, chemin] of [
  ["tableau de bord", "app/(dashboard)/dashboard/page.tsx"],
  ["nouvelle analyse", "app/(dashboard)/check/new/page.tsx"],
] as const) {
  test(`${ecran} : le menu du compte est dans l'en-tête, sans condition, et rien ne le masque`, () => {
    const rendus = rendusDe(chemin, "UserMenu");
    assert.equal(rendus.length, 1, `${chemin} : <UserMenu /> rendu ${rendus.length} fois, 1 attendue`);
    const [menu] = rendus;
    assert.deepEqual(menu.attributs, ["connecte"], `${chemin} : <UserMenu connecte /> attendu`);
    assert.ok(menu.ancetres.includes("nav"), `${chemin} : <UserMenu /> hors de l'en-tête (<nav>)`);
    assert.equal(menu.sousCondition, false, `${chemin} : <UserMenu /> rendu sous condition`);
    assert.deepEqual(menu.masques, [], `${chemin} : un élément qui entoure <UserMenu /> le masque`);
  });
}

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
