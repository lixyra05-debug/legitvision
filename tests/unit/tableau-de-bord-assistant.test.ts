// Le bouton de l'assistant recouvrait la colonne de droite des cartes du
// tableau de bord sur tablette. Décision d'Hector du 06/10 : comme sur le
// rapport, il est rendu dans le flux, à la fin de la page, ici sous 1360 px.
// C'est la page qui le demande, par sa marque data-assistant-flux="1360", lue
// par la variante « assistant-flux: » (tailwind.config.ts).
// Ce test exécute la VRAIE page (app/(dashboard)/dashboard/page.tsx) avec un
// faux Supabase, rend ce qu'elle retourne et échoue si : la marque n'est plus
// sur le bloc de la page, dans l'un de ses états ; le bloc garde sa hauteur
// d'écran sous le seuil ; le contenu ne laisse plus 24 px au bouton. La place
// du bouton elle-même est mesurée dans Chromium (rapport-navigateur.test.ts).
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { translations } from "@/lib/i18n/translations";
import { clientDuTableauDeBord, donneesDuTableauDeBord, type DonneesTableauDeBord } from "./support/faux-tableau-de-bord";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;

/** t("section.cle") lu dans les vrais textes français. */
function t(cle: string): string {
  let valeur: unknown = translations.fr;
  for (const partie of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[partie] : undefined;
  }
  return typeof valeur === "string" ? valeur : cle;
}

let donnees: DonneesTableauDeBord = donneesDuTableauDeBord(0);
let connecte = true;
const client = () => {
  const faux = clientDuTableauDeBord(() => donnees);
  return { ...faux, auth: { ...faux.auth, getUser: async () => ({ data: { user: connecte ? donnees.utilisateur : null } }) } };
};

mock.module(adresseDe("lib/supabase/server.ts"), { namedExports: { createClient: async () => client() } });
mock.module(adresseDe("lib/supabase/admin.ts"), { namedExports: { createAdminClient: () => client() } });
mock.module(adresseDe("lib/supabase/client.ts"), { namedExports: { createClient: () => client() } });
// Les actions serveur (« use server ») n'existent que dans Next.
mock.module(adresseDe("app/(dashboard)/dashboard/actions.ts"), { namedExports: { deleteAnalysis: async () => {} } });
mock.module("next/navigation", {
  namedExports: {
    redirect: (vers: string) => {
      throw new Error(`redirect ${vers}`);
    },
    useRouter: () => ({ push() {}, refresh() {} }),
  },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: { useTranslation: () => ({ locale: "fr", t, setLocale() {}, toggleLocale() {} }) },
});
// next/font/local n'existe qu'à la compilation de Next : on remplace la police.
mock.module(adresseDe("components/brand/police-marque.ts"), {
  namedExports: { archivoMarque: { variable: "variable-police-marque", className: "", style: { fontFamily: "" } } },
});
mock.module(adresseDe("components/ThemeProvider.tsx"), {
  namedExports: { useTheme: () => ({ theme: "dark", toggleTheme() {}, setTheme() {} }) },
});

const { renderToStaticMarkup } = await import("react-dom/server");
const { default: DashboardPage } = (await import(
  adresseDe("app/(dashboard)/dashboard/page.tsx")
)) as typeof import("@/app/(dashboard)/dashboard/page");

/** Le HTML de la vraie page, pour un compte qui a `analyses` analyses. */
async function rendre(analyses: number, recherche: Record<string, string> = {}): Promise<string> {
  donnees = donneesDuTableauDeBord(analyses);
  return renderToStaticMarkup(await DashboardPage({ searchParams: Promise.resolve(recherche) }));
}

const texte = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");
/** Les cartes d'analyse : chacune est un lien vers son rapport. */
const cartes = (html: string) => html.split('href="/check/0f8fad5b').length - 1;

// Les états de la page : sans analyse, une analyse, une page pleine, la
// première et la seconde de deux pages, et le retour d'un paiement.
const ETATS: Array<[string, number, Record<string, string>, number]> = [
  ["sans analyse", 0, {}, 0],
  ["une analyse", 1, {}, 1],
  ["une page pleine", 24, {}, 24],
  ["première de deux pages", 30, {}, 24],
  ["seconde de deux pages", 30, { page: "2" }, 6],
  ["retour d'un paiement", 3, { session_id: "essai", purchased: "single" }, 3],
];

for (const [etat, analyses, recherche, cartesAttendues] of ETATS) {
  test(`tableau de bord (${etat}) : la page demande le bouton de l'assistant dans le flux sous 1360 px`, async () => {
    const html = await rendre(analyses, recherche);
    assert.equal(cartes(html), cartesAttendues, "témoin : la page a rendu ses analyses");
    // La marque est sur le bloc racine de la page : c'est elle que lit « assistant-flux: ».
    const bloc = html.match(/^<div data-assistant-flux="1360" class="([^"]*)">/)?.[1].split(/\s+/);
    assert.ok(bloc, `bloc de la page sans data-assistant-flux="1360" : ${html.slice(0, 80)}`);
    assert.equal(html.split("data-assistant-flux").length - 1, 1, "une seule marque attendue");
    // Sous 1360 px, pas de hauteur minimale : le bouton suit le contenu. Sinon, toute la fenêtre, comme avant.
    assert.deepEqual(bloc, ["min-h-screen", "bg-background", "assistant-flux:min-h-0"]);
    // Le contenu : la colonne de 1152 px, et 24 px sous le dernier bloc quand
    // le bouton est dans le flux ; le bas de page d'avant quand il flotte.
    const principal = html.match(/<main class="([^"]*)">/)?.[1].split(/\s+/);
    assert.deepEqual(principal, ["mx-auto", "max-w-6xl", "px-4", "py-8", "sm:py-12", "assistant-flux:pb-6"]);
    // <main> est un enfant direct du bloc marqué, après l'en-tête.
    assert.match(html, /^<div data-assistant-flux="1360"[^>]*><nav\b[\s\S]*?<\/nav><main\b/);
    assert.match(html, /<\/main><\/div>$/);
  });
}

test("témoin : la page rendue est bien le tableau de bord, avec ses textes et son compte", async () => {
  const html = await rendre(30);
  const affiche = texte(html);
  assert.ok(affiche.includes("Bonjour, Hector"), affiche.slice(0, 200));
  assert.ok(affiche.includes("30 analyses effectuées"));
  assert.ok(affiche.includes("Air Force 1 '07 (1)") && affiche.includes("Air Force 1 '07 (24)") && !affiche.includes("Air Force 1 '07 (25)"));
  assert.match(html, /<nav aria-label="Pages de l(?:'|&#x27;)historique"/);
  assert.ok(texte(await rendre(0)).includes("Aucune analyse"));
});

test("visiteur non connecté : la page redirige vers la connexion, sans rien rendre", async () => {
  connecte = false;
  try {
    await assert.rejects(() => DashboardPage({ searchParams: Promise.resolve({}) }), /redirect \/auth/);
  } finally {
    connecte = true;
  }
});

test("cartes : un verdict non concluant se lit « Résultat non concluant », jamais « Éléments suspects » (décision d'Hector du 06/10)", async () => {
  const html = await rendre(3);
  const libelles = [...html.matchAll(/<p class="mt-3 text-ui font-medium (text-verdict-[a-z]+)">([^<]*)<\/p>/g)].map(([, classe, libelle]) => [classe, libelle]);
  assert.deepEqual(libelles, [
    ["text-verdict-authentic", "Probablement authentique"],
    ["text-verdict-inconclusive", "Résultat non concluant"],
    ["text-verdict-fake", "Probablement contrefait"],
  ]);
  assert.doesNotMatch(texte(html), /[ÉE]l[ée]ments\s+suspects/i);
});
