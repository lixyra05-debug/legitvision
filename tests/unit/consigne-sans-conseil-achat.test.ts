// Décision d'Hector du 13/10 : « jamais de formulation qui ressemble à un
// conseil d'achat ou à une garantie ». Ce jour-là, un rapport de production
// conseillait « Éviter absolument cet achat - article clairement frauduleux ».
// Trois protections, tenues ici :
// 1. la consigne envoyée à l'IA interdit les conseils d'achat et de paiement,
//    dans tous les champs, et ne demande plus un « conseil actionnable » ;
// 2. la page du rapport retire de la liste des recommandations celles qui en
//    portent un quand même, pour les rapports déjà enregistrés comme pour les
//    suivants (lib/purchase-advice.ts) ;
// 3. la consigne entière a une empreinte : elle ne change pas par mégarde.
// Ce test échoue si la règle quitte la consigne, si le format redemande un
// conseil, si une formule d'achat ou de paiement n'est plus reconnue, si une
// vérification légitime (« demandez la preuve d'achat ») est retirée à tort,
// si un conseil d'achat s'affiche dans un rapport, ou si la consigne change.
// Les autres mots interdits à l'IA (probabilité, certification, frauduleux,
// arnaque) : tests/unit/consigne-mots-interdits.test.ts.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { BRAND_EXPERTISE_BRANDS, NO_PURCHASE_ADVICE_RULE, RECOMMENDATION_FORMAT, getAuthenticationPrompt } from "@/lib/ai/authentication-prompts";
import { translations } from "@/lib/i18n/translations";
import { PURCHASE_ADVICE_PATTERNS, isPurchaseAdvice, withoutPurchaseAdvice } from "@/lib/purchase-advice";
import type { AuthenticationPoint } from "@/lib/types";
import { CONSEILS_D_ACHAT, VERIFICATIONS } from "./support/phrases-formulations";

const racine = new URL("../../", import.meta.url);
const adresseDe = (chemin: string) => new URL(chemin, racine).href;
const FR = translations.fr.results;

const POINTS: AuthenticationPoint[] = [
  { zone: "stitching", label: "Coutures (régularité, couleur du fil, tension)", weight: 0.6 },
  { zone: "tongue_label", label: "Étiquette de taille (languette : taille, code produit, pays)", weight: 0.4 },
];
const PHOTOS = ["Vue de face (overall_front)", "Étiquette de taille (size_tag)"];

// ── 1. La consigne ─────────────────────────────────────────

/** Les consignes construites pour des articles de toute sorte : chaque catégorie, une variante, une collaboration, des points propres au modèle. */
const CONSIGNES: Array<[nom: string, consigne: { systemPrompt: string; userPrompt: string }]> = [
  ["sneakers", getAuthenticationPrompt("Nike", "Dunk Low", "sneakers", POINTS, PHOTOS)],
  ["sac", getAuthenticationPrompt("Louis Vuitton", "Speedy 30", "bag", POINTS, PHOTOS)],
  ["vêtement, variante", getAuthenticationPrompt("Stone Island", "Crewneck", "clothing", POINTS, PHOTOS, "Ghost")],
  ["collaboration", getAuthenticationPrompt("Nike", "Air Force 1", "sneakers", POINTS, PHOTOS, null, "Off-White")],
  ["points propres au modèle", getAuthenticationPrompt("Maison Margiela", "GATS", "sneakers", POINTS, PHOTOS, "Standard", null, ["4 points de couture", "semelle en gomme"])],
  ["marque inconnue", getAuthenticationPrompt("Marque Inconnue", "Modèle", "watch", [], [])],
];

test("consigne : la règle « jamais de conseil d'achat ni de paiement » est dans les règles absolues, pour tout article", () => {
  for (const [nom, { systemPrompt }] of CONSIGNES) {
    const debut = systemPrompt.indexOf("RÈGLES ABSOLUES :");
    const fin = systemPrompt.indexOf("MÉTHODOLOGIE :");
    assert.ok(debut > 0 && fin > debut, `${nom} : sections introuvables`);
    const regles = systemPrompt.slice(debut, fin);
    assert.ok(regles.includes(NO_PURCHASE_ADVICE_RULE), `${nom} : la règle n'est pas dans les règles absolues`);
    assert.equal(systemPrompt.split(NO_PURCHASE_ADVICE_RULE).length - 1, 1, `${nom} : la règle doit figurer une fois`);
  }
});

test("consigne : la règle nomme les quatre champs de texte, la formule relevée en production, et dit à qui revient la décision", () => {
  for (const attendu of [
    "Tu ne donnes JAMAIS de conseil d'achat ni de paiement, dans aucun champ",
    '"recommendations"', '"analyst_summary"', '"findings"', '"missing_evidence"',
    '"n\'achetez pas"', '"évitez cet achat"', '"éviter absolument cet achat"', '"passez votre chemin"', '"vous pouvez l\'acheter"', '"ne payez pas"',
    "ni aucune formule équivalente",
    "Acheter ou non est la décision de l'utilisateur",
  ]) {
    assert.ok(NO_PURCHASE_ADVICE_RULE.includes(attendu), `« ${attendu} » absent de la règle`);
  }
  // Une règle de la liste, comme les autres : elle tient sur une ligne et commence par un tiret.
  assert.match(NO_PURCHASE_ADVICE_RULE, /^- [^\n]+$/);
});

test("consigne : le format ne demande plus un « conseil actionnable », mais une vérification à faire", () => {
  assert.ok(RECOMMENDATION_FORMAT.startsWith("<vérification à faire, en français"), RECOMMENDATION_FORMAT);
  assert.ok(RECOMMENDATION_FORMAT.endsWith("jamais un conseil d'achat ou de paiement>"), RECOMMENDATION_FORMAT);
  for (const [nom, { systemPrompt, userPrompt }] of CONSIGNES) {
    assert.ok(systemPrompt.includes(`"recommendations": ["${RECOMMENDATION_FORMAT}"],`), `${nom} : format des recommandations`);
    for (const texte of [systemPrompt, userPrompt]) {
      assert.doesNotMatch(texte, /conseil actionnable/i, `${nom} : « conseil actionnable » est revenu`);
      // Le mot « conseil » ne reste dans la consigne que pour l'interdire.
      for (const ligne of texte.split("\n").filter((l) => /conseil/i.test(l))) {
        assert.match(ligne, /JAMAIS de conseil d'achat|jamais un conseil d'achat/, `${nom} : « conseil » hors de l'interdiction : ${ligne.slice(0, 120)}`);
      }
    }
  }
});

test("consigne : son empreinte. Elle ne change pas par mégarde, pour aucune marque", () => {
  // Si ce test échoue, la consigne envoyée à l'IA a changé. Tout changement de
  // la consigne est montré à Hector, en entier, avant d'aller en production
  // (règle du 13/10). Après un changement voulu : mettre cette empreinte à
  // jour, et régénérer la requête figée de l'outil de fiabilité (branche de la
  // refonte). Toutes les consignes entrent dans l'empreinte : une phrase
  // ajoutée à l'expertise d'une seule marque la change aussi.
  const toutes = [
    ...BRAND_EXPERTISE_BRANDS.map((marque) => getAuthenticationPrompt(marque, "Modèle", "sneakers", POINTS, PHOTOS)),
    ...CONSIGNES.map(([, consigne]) => consigne),
  ];
  assert.ok(toutes.length > 45, String(toutes.length));
  const empreinte = createHash("sha256");
  for (const { systemPrompt, userPrompt } of toutes) empreinte.update(`${systemPrompt}\n\u0000\n${userPrompt}\n\u0001\n`);
  assert.equal(empreinte.digest("hex"), "997b84b5330a798d520d824011d91d9d960cdb1ee49cf48de483fa934989ef04");
});

// ── 2. Reconnaître un conseil d'achat ou de paiement ───────

test("conseil d'achat ou de paiement : chaque formule est reconnue, dont celle relevée en production", () => {
  for (const conseil of CONSEILS_D_ACHAT) assert.equal(isPurchaseAdvice(conseil), true, `non reconnu : « ${conseil} »`);
  // En capitales aussi, et au milieu d'une phrase.
  assert.equal(isPurchaseAdvice("ÉVITER ABSOLUMENT CET ACHAT"), true);
  assert.equal(isPurchaseAdvice("Au vu de ces anomalies, n'achetez pas cette paire avant un contrôle."), true);
});

test("chaque construction reconnue a sa phrase : en retirer une du fichier fait échouer ce test", () => {
  // Pour chaque motif, une phrase au moins que lui seul reconnaît : sans cela, il pourrait disparaître ou être
  // faussé sans qu'aucun test ne le voie.
  PURCHASE_ADVICE_PATTERNS.forEach((motif, i) => {
    const autres = PURCHASE_ADVICE_PATTERNS.filter((_, j) => j !== i);
    const propres = CONSEILS_D_ACHAT.filter((conseil) => motif.test(conseil) && !autres.some((autre) => autre.test(conseil)));
    assert.ok(propres.length > 0, `aucune phrase ne dépend du seul motif ${i + 1} : ${motif.source.slice(0, 100)}`);
  });
  assert.equal(PURCHASE_ADVICE_PATTERNS.length, 20);
});

test("vérification à faire : jamais prise pour un conseil d'achat, même quand elle parle d'achat ou de paiement", () => {
  for (const verification of VERIFICATIONS) assert.equal(isPurchaseAdvice(verification), false, `pris à tort : « ${verification} »`);
  for (const autre of [undefined, null, "", "   ", 12, {}, ["N'achetez pas"]]) assert.equal(isPurchaseAdvice(autre), false, JSON.stringify(autre));
});

test("liste de recommandations : les conseils d'achat en sortent, le reste garde son ordre", () => {
  assert.deepEqual(withoutPurchaseAdvice([VERIFICATIONS[0], CONSEILS_D_ACHAT[0], VERIFICATIONS[1], CONSEILS_D_ACHAT[4]]), [VERIFICATIONS[0], VERIFICATIONS[1]]);
  assert.deepEqual(withoutPurchaseAdvice(VERIFICATIONS), VERIFICATIONS);
  assert.deepEqual(withoutPurchaseAdvice(CONSEILS_D_ACHAT), []);
  assert.deepEqual(withoutPurchaseAdvice([]), []);
  assert.equal(withoutPurchaseAdvice(null), null);
});

// ── 3. Le rapport ──────────────────────────────────────────

const UTILISATEUR = "7c9e6679-7425-40de-944b-e07fc1f90ae7";
const ANALYSE = "0f8fad5b-d9cb-469f-a165-70867728950e";

/** t("section.cle") lu dans les vrais textes français. */
function t(cle: string): string {
  let valeur: unknown = translations.fr;
  for (const partie of cle.split(".")) {
    valeur = valeur && typeof valeur === "object" ? (valeur as Record<string, unknown>)[partie] : undefined;
  }
  return typeof valeur === "string" ? valeur : cle;
}

let conseilsEnregistres: unknown = [];
mock.module(adresseDe("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: UTILISATEUR } } }) },
      from() {
        const requete = {
          select: () => requete,
          eq: () => requete,
          single: async () => ({
            data: {
              id: ANALYSE, status: "completed", verdict: "likely_fake", confidence: "high", overall_score: 22,
              sub_scores: { stitching: 20, tongue_label: 25 },
              findings: [{ zone: "stitching", observation: "Fil irrégulier.", score: 20 }],
              ai_raw_response: { analyst_summary: "Plusieurs anomalies relevées.", confidence_level: "high", recommendations: conseilsEnregistres },
              created_at: "2026-10-05T10:00:00.000Z", updated_at: "2026-10-05T10:01:00.000Z",
              brand_id: "marque-1", model_id: "modele-1", brands: { name: "Nike" }, models: { name: "Dunk Low", authentication_points: POINTS },
            },
            error: null,
          }),
        };
        return requete;
      },
    }),
  },
});
mock.module(adresseDe("lib/supabase/admin.ts"), { namedExports: { createAdminClient: () => { throw new Error("clé du serveur demandée"); } } });
mock.module(adresseDe("lib/i18n/LanguageProvider.tsx"), {
  namedExports: { useTranslation: () => ({ locale: "fr", t, setLocale() {}, toggleLocale() {} }) },
});
// next/link est en CommonJS : sans cela, son import par défaut serait l'objet du module.
mock.module("next/link", { defaultExport: createRequire(import.meta.url)("next/link").default });
mock.module("next/navigation", {
  namedExports: {
    notFound: () => { throw new Error("notFound"); },
    redirect: (vers: string) => { throw new Error(`redirect ${vers}`); },
    useRouter: () => ({ push() {}, refresh() {} }),
  },
});
// next/font/local n'existe qu'à la compilation de Next : on remplace la police.
mock.module(adresseDe("components/brand/police-marque.ts"), {
  namedExports: { archivoMarque: { variable: "variable-police-marque", className: "", style: { fontFamily: "" } } },
});
mock.module(adresseDe("components/ThemeProvider.tsx"), {
  namedExports: { useTheme: () => ({ theme: "dark", toggleTheme() {}, setTheme() {} }) },
});

const { renderToStaticMarkup } = await import("react-dom/server");
const { default: CheckReportPage } = (await import(
  adresseDe("app/(dashboard)/check/[id]/page.tsx")
)) as typeof import("@/app/(dashboard)/check/[id]/page");

/** Le texte de la page du rapport dont la réponse enregistrée porte ces recommandations. */
async function rapport(recommandations: unknown): Promise<string> {
  conseilsEnregistres = recommandations;
  const html = renderToStaticMarkup(await CheckReportPage({ params: Promise.resolve({ id: ANALYSE }) }));
  return html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

test("rapport déjà enregistré avec un conseil d'achat : il ne s'affiche pas, les autres recommandations restent", async () => {
  const page = await rapport([
    "Éviter absolument cet achat - article clairement frauduleux",
    "Demandez la preuve d'achat au vendeur.",
    "N'achetez pas cet article.",
    "Faites contrôler la paire par un expert indépendant.",
  ]);
  // Le rapport lui-même, et les deux vérifications.
  for (const present of ["Nike", "Dunk Low", FR.fake, `${FR.recommendationsTitle} (2)`, "Demandez la preuve d'achat au vendeur.", "Faites contrôler la paire par un expert indépendant."]) {
    assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
  }
  for (const absent of ["Éviter absolument cet achat", "N'achetez pas"]) {
    assert.ok(!page.includes(absent), `« ${absent} » affiché : ${page}`);
  }
});

test("limite connue : le filtre ne retire que des recommandations ; un mot interdit ailleurs, ou sans conseil d'achat, s'affiche", async () => {
  // « frauduleux » sans conseil d'achat reste dans la liste : seuls les conseils d'achat en sortent. Le résumé et les
  // observations ne sont jamais réécrits à l'affichage : c'est la consigne qui les tient, et la mesure de fiabilité qui compte.
  const page = await rapport(["Montage frauduleux probable : faites contrôler la paire."]);
  assert.ok(page.includes(`${FR.recommendationsTitle} (1)`) && page.includes("Montage frauduleux probable"), page);
});

test("rapport dont toutes les recommandations sont des conseils d'achat : la section disparaît, le rapport reste", async () => {
  const page = await rapport(["Éviter absolument cet achat - article clairement frauduleux", "Ne payez pas en l'état."]);
  for (const present of ["Nike", "Dunk Low", FR.fake, "Plusieurs anomalies relevées.", "Fil irrégulier."]) {
    assert.ok(page.includes(present), `« ${present} » absent : ${page}`);
  }
  for (const absent of [FR.recommendationsTitle, "Éviter absolument", "Ne payez pas"]) {
    assert.ok(!page.includes(absent), `« ${absent} » affiché : ${page}`);
  }
});

test("témoin : sans conseil d'achat, toutes les recommandations s'affichent, dans leur ordre", async () => {
  const page = await rapport(VERIFICATIONS.slice(0, 4));
  assert.ok(page.includes(`${FR.recommendationsTitle} (4)`), page);
  let position = -1;
  for (const verification of VERIFICATIONS.slice(0, 4)) {
    const suivante = page.indexOf(verification);
    assert.ok(suivante > position, `« ${verification} » absent ou déplacé`);
    position = suivante;
  }
});
