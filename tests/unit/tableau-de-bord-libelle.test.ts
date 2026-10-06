// « Dashboard » devient « Tableau de bord » dans tous les textes français
// affichés (décision d'Hector du 05/10) : menu du compte, bouton du bas du
// rapport, titre de la page, lien de la page d'abonnement, bouton de l'étape 1
// d'une nouvelle analyse. Les textes anglais, les routes, les identifiants et
// les noms de composants ne changent pas.
// Ce test échoue si le mot « Dashboard » revient dans un texte français, ou
// si l'un de ces libellés cesse de venir de la clé traduite.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { translations } from "@/lib/i18n/translations";

const racine = new URL("../../", import.meta.url);
const RACINE = fileURLToPath(racine);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;
const source = (chemin: string) => readFileSync(join(RACINE, chemin), "utf8");

test("textes français : « Tableau de bord » ; textes anglais : « Dashboard », inchangés", () => {
  assert.equal(translations.fr.nav.dashboard, "Tableau de bord");
  assert.equal(translations.fr.userMenu.dashboard, "Tableau de bord");
  assert.equal(translations.en.nav.dashboard, "Dashboard");
  assert.equal(translations.en.userMenu.dashboard, "Dashboard");
});

/** Tous les textes d'un dictionnaire, sans ses clés. */
function textes(noeud: unknown): string[] {
  if (typeof noeud === "string") return [noeud];
  return noeud && typeof noeud === "object" ? Object.values(noeud).flatMap(textes) : [];
}

test("aucun texte français ne dit plus « dashboard », avec ou sans majuscule", () => {
  assert.deepEqual(textes(translations.fr).filter((texte) => /dashboard/i.test(texte)), []);
  // Témoin : la recherche trouve bien le mot là où il reste, en anglais.
  assert.equal(textes(translations.en).filter((texte) => /dashboard/i.test(texte)).length, 2);
});

test("le mot « Dashboard » ne reste, seul, que dans les deux textes anglais", () => {
  // Le mot isolé : « DashboardGreeting », « LayoutDashboard » ou « /dashboard »
  // sont des noms de composants et des routes, qui ne changent pas.
  const restes: string[] = [];
  for (const dossier of ["app", "components", "lib", "supabase/emails"]) {
    for (const fichier of readdirSync(join(RACINE, dossier), { recursive: true, encoding: "utf8" })) {
      if (!/\.(tsx?|html)$/.test(fichier)) continue;
      const chemin = join(dossier, fichier);
      source(chemin)
        .split("\n")
        .forEach((ligne, i) => {
          if (/\bDashboard\b/.test(ligne)) restes.push(`${chemin}:${i + 1} ${ligne.trim()}`);
        });
    }
  }
  const traductions = source("lib/i18n/translations.ts").split("\n");
  const debutAnglais = traductions.findIndex((ligne) => /^ {2}en: \{$/.test(ligne)) + 1;
  assert.ok(debutAnglais > 0, "bloc « en » introuvable dans lib/i18n/translations.ts");
  assert.equal(restes.length, 2, restes.join("\n"));
  for (const reste of restes) {
    const [, numero] = reste.match(/^lib\/i18n\/translations\.ts:(\d+) dashboard: "Dashboard",$/) ?? [];
    assert.ok(numero && Number(numero) > debutAnglais, `hors des textes anglais : ${reste}`);
  }
});

test("titre de la page du tableau de bord : « Tableau de bord »", () => {
  assert.match(source("app/(dashboard)/dashboard/page.tsx"), /export const metadata = \{\s*title: "Tableau de bord",\s*\};/);
});

test("nouvelle analyse, étape 1 : le bouton de retour prend le libellé traduit", () => {
  assert.match(source("app/(dashboard)/check/new/page.tsx"), /\{step === 1 \? t\("nav\.dashboard"\) : "Retour"\}/);
});

// ── Rendus : menu du compte et lien de la page d'abonnement ─────────────────

let langue: "fr" | "en" = "fr";
function t(cle: string): string {
  let valeur: unknown = translations[langue];
  for (const partie of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[partie] : undefined;
  }
  return typeof valeur === "string" ? valeur : cle;
}
mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: { useTranslation: () => ({ locale: langue, t, setLocale() {}, toggleLocale() {} }) },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
mock.module("next/navigation", { namedExports: { useRouter: () => ({ push() {}, refresh() {} }) } });
mock.module(adresseDe("lib/supabase/client.ts"), { namedExports: { createClient: () => ({}) } });
// La page d'abonnement importe son bouton de résiliation, qui n'est pas rendu ici.
mock.module(adresseDe("app/(dashboard)/dashboard/subscription/CancelButton.tsx"), {
  namedExports: { CancelButton: () => null },
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { MenuDuCompte } = (await import(adresseDe("components/auth/UserMenu.tsx"))) as typeof import("@/components/auth/UserMenu");
const { SubscriptionBackLabel } = (await import(
  adresseDe("components/dashboard/SubscriptionI18nClient.tsx")
)) as typeof import("@/components/dashboard/SubscriptionI18nClient");

const texte = (html: string) => html.replace(/<[^>]+>/g, "").trim();

/** Texte du lien du menu du compte qui mène au tableau de bord. */
function lienDuMenu(): string {
  const html = renderToStaticMarkup(
    createElement(MenuDuCompte, { nom: "Hector V", email: "hector@example.com", onFermer() {}, onDeconnexion() {} }),
  );
  const lien = html.match(/<a\b[^>]*href="\/dashboard"[^>]*>([\s\S]*?)<\/a>/);
  assert.ok(lien, "menu du compte : lien vers /dashboard absent");
  return texte(lien[1]);
}

test("menu du compte : « Tableau de bord » en français, « Dashboard » en anglais", () => {
  langue = "fr";
  assert.equal(lienDuMenu(), "Tableau de bord");
  langue = "en";
  assert.equal(lienDuMenu(), "Dashboard");
  langue = "fr";
});

test("page d'abonnement : le lien de retour s'appelle « Tableau de bord », et la page le rend", () => {
  langue = "fr";
  assert.equal(renderToStaticMarkup(createElement(SubscriptionBackLabel)), "Tableau de bord");
  langue = "en";
  assert.equal(renderToStaticMarkup(createElement(SubscriptionBackLabel)), "Dashboard");
  langue = "fr";
  assert.match(
    source("app/(dashboard)/dashboard/subscription/page.tsx"),
    /<Link\s+href="\/dashboard"[^>]*>\s*<ArrowLeft className="size-4" \/>\s*<SubscriptionBackLabel \/>\s*<\/Link>/,
  );
});
