// Le rapport, le tableau de bord et l'assistant dans un vrai navigateur
// (Chromium de Playwright), avec les vrais composants et la feuille de style
// du site : ce qu'un rendu statique ne voit pas. Décisions d'Hector des 05/10
// et 06/10 :
// - sur un rapport, sous 1024 px, le bouton de l'assistant est dans le flux, à
//   la fin de la page, à droite de la colonne ; sur le tableau de bord, sous
//   1360 px ; à partir de ce seuil et partout ailleurs, il flotte comme avant ;
// - le panneau de l'assistant s'ouvre et se ferme comme avant.
// Ces tests échouent si : le bouton redevient flottant sur un rapport sous
// 1024 px ou sur le tableau de bord sous 1360 px ; il quitte le coin de la
// fenêtre ailleurs (analyse introuvable ou erreur à l'adresse d'un rapport
// comprises) ; flottant, il est à moins de 24 px de la colonne de droite des
// cartes du tableau de bord, que la barre de défilement prenne de la place
// dans la fenêtre ou non ; panneau ouvert, il se pose sur le panneau ou sur
// « Envoyer » ; un clic sur la croix, sur le bouton ou hors du panneau ne
// ferme plus ; un nom de zone long touche sa note.
// Sans Chromium sur la machine, ils ne s'exécutent pas et le disent.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import type { Page } from "@playwright/test";
import type { ReportData } from "@/components/check/ReportView";
import type { PageRendue } from "./support/navigateur/page-assistant";
import { donneesDuTableauDeBord } from "./support/faux-tableau-de-bord";
import { CHROMIUM_ABSENT, empaqueter, feuilleDeStyle, lancerChromium, ouvrirPage } from "./support/navigateur";

const navigateur = await lancerChromium();
const skip = navigateur ? false : CHROMIUM_ABSENT;
// Le même, dont la barre de défilement peut prendre de la place dans la
// fenêtre, comme sous Windows (tableau de bord, plus bas).
const navigateurAvecBarre = navigateur ? await lancerChromium({ barreDeDefilement: true }) : null;
after(() => Promise.all([navigateur?.close(), navigateurAvecBarre?.close()]));

const css = navigateur ? await feuilleDeStyle() : "";
const script = navigateur
  ? empaqueter("tests/unit/support/navigateur/page-assistant.tsx", {
      "next/link": "tests/unit/support/navigateur/next-link.tsx",
      "next/navigation": "tests/unit/support/navigateur/next-navigation.ts",
      "next/font/local": "tests/unit/support/navigateur/next-font.ts",
      // Le tableau de bord est un composant serveur : sa page est exécutée
      // telle quelle, avec un faux Supabase et sans action serveur.
      "lib/supabase/server.ts": "tests/unit/support/navigateur/supabase.ts",
      "lib/supabase/admin.ts": "tests/unit/support/navigateur/supabase.ts",
      "lib/supabase/client.ts": "tests/unit/support/navigateur/supabase.ts",
      "app/(dashboard)/dashboard/actions.ts": "tests/unit/support/navigateur/actions.ts",
    })
  : "";

// ── Rapports ────────────────────────────────────────────────────────────────

const BASE: ReportData = {
  id: "0f8fad5b-d9cb-469f-a165-70867728950e",
  brandName: "Nike",
  modelName: "Air Force 1",
  status: "completed",
  verdict: "likely_authentic",
  confidence: "high",
  aiConfidence: "high",
  overallScore: 82,
  subScores: { stitching: 100, mesh: 100, toe_box: 90, swoosh: 80, heel_tab: 78, date_code: 88 },
  findings: [
    { zone: "stitching", observation: "Points réguliers, fil de la bonne teinte.", score: 90 },
    { zone: "swoosh", observation: "Courbe et pointe conformes au modèle.", score: 80 },
    { zone: "heel_tab", observation: "Broderie nette, lettres bien espacées.", score: 78 },
  ],
  analystSummary: "Les zones visibles sont cohérentes avec le modèle.",
  missingEvidence: [],
  ocrExtracted: null,
  recommendations: ["Comparez la semelle avec une paire de référence."],
  createdAt: "2026-10-05T10:00:00.000Z",
  // Noms longs du catalogue (relevé du 2026-10-05) : ceux qui touchaient leur note.
  zoneNames: {
    mesh: "Qualité mesh et superpositions matières",
    toe_box: "Forme et perforations de la toe box",
    swoosh: "Forme et placement du Swoosh",
    heel_tab: "Languette du talon",
  },
};

const VIDE = { verdict: null, confidence: null, aiConfidence: null, overallScore: null, subScores: null, findings: null, analystSummary: null, recommendations: null };

/** Rapports plus courts qu'une fenêtre de téléphone. */
const COURTS: Array<[string, ReportData]> = [
  ["analyse en cours", { ...BASE, ...VIDE, status: "analyzing" }],
  ["lancement", { ...BASE, ...VIDE, status: "pending" }],
  ["analyse non aboutie", { ...BASE, ...VIDE, status: "failed" }],
  ["photos insuffisantes", { ...BASE, ...VIDE, verdict: "inconclusive", confidence: "low", aiConfidence: "insufficient" }],
];

const rapport = (donnees: ReportData = BASE): PageRendue => ({ ecran: "rapport", donnees });
/** Le tableau de bord d'un compte qui a `analyses` analyses (24 par page). */
const tableauDeBord = (analyses: number): PageRendue => ({ ecran: "tableau-de-bord", donnees: donneesDuTableauDeBord(analyses) });

async function ouvrir(contenu: PageRendue, largeur: number, hauteur: number) {
  assert.ok(navigateur);
  const rendu = await ouvrirPage(navigateur, { css, script, page: contenu, largeur, hauteur });
  await rendu.page.waitForSelector(BOUTON);
  return rendu;
}

// ── Mesures ─────────────────────────────────────────────────────────────────

const BOUTON = 'button[aria-label$="assistant"]';
const CROIX = 'button[aria-label="Fermer le chat"]';
const ENVOYER = 'button[aria-label="Envoyer"]';

const bas = (page: Page) => page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
/**
 * La même page dans une fenêtre d'une autre taille, remise en haut. La place
 * du bouton ne tient qu'à la feuille de style : une page ouverte une fois se
 * mesure à plusieurs largeurs. Les tests du panneau, plus bas, ouvrent chacun
 * une page neuve à leur taille.
 */
async function redimensionner(page: Page, largeur: number, hauteur: number) {
  await tailleDeFenetre(page, largeur, hauteur);
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Change la taille de la fenêtre et attend que la mise en page l'ait prise :
 * juste après le changement, Chromium calcule encore un instant « 100vh »
 * (la hauteur minimale de <body>) avec l'ancienne hauteur. `barre` : la
 * largeur que la barre de défilement prend dans la fenêtre, quand elle en
 * prend ; le contenu a alors cette largeur de moins, ce qui sert de témoin.
 */
async function tailleDeFenetre(page: Page, largeur: number, hauteur: number, barre = 0) {
  await page.setViewportSize({ width: largeur, height: hauteur });
  await page.waitForFunction(
    ([l, h, b]) =>
      window.innerWidth === l &&
      document.documentElement.clientWidth === l - b &&
      getComputedStyle(document.body).minHeight === `${h}px`,
    [largeur, hauteur, barre],
  );
}
const ouvert = (page: Page) => page.locator(CROIX).count().then((n) => n === 1);

/** Où sont le bouton de l'assistant, son conteneur, le panneau et « Envoyer ». */
function mesurer(page: Page) {
  return page.evaluate(
    ([selBouton, selCroix, selEnvoyer]) => {
      const rect = (e: Element | null | undefined) => {
        if (!e) return null;
        const { top, right, bottom, left, width, height } = e.getBoundingClientRect();
        return { top, right, bottom, left, width, height };
      };
      const bouton = document.querySelector<HTMLElement>(selBouton);
      if (!bouton) throw new Error("bouton de l'assistant absent");
      // Sa place dans la page, sans l'agrandissement au survol (hover:scale-105)
      // ni sa transition, qui déplacent ses bords de plus d'un pixel.
      const { transform, transition } = bouton.style;
      bouton.style.transition = "none";
      bouton.style.transform = "none";
      const placeDuBouton = rect(bouton)!;
      bouton.style.transform = transform;
      bouton.style.transition = transition;
      const croix = document.querySelector(selCroix);
      // Le panneau : l'ancêtre fixé de la croix.
      let panneau: Element | null = croix;
      while (panneau && getComputedStyle(panneau).position !== "fixed") panneau = panneau.parentElement;
      const envoyer = document.querySelector(selEnvoyer);
      const e = rect(envoyer);
      const auCentre = e ? document.elementFromPoint(e.left + e.width / 2, e.top + e.height / 2) : null;
      const principal = document.querySelector("main");
      return {
        position: getComputedStyle(bouton).position,
        nom: bouton.getAttribute("aria-label"),
        bouton: placeDuBouton,
        conteneur: rect(bouton.parentElement)!,
        panneau: rect(panneau),
        envoyer: e,
        auCentreDEnvoyer: auCentre?.closest("button")?.getAttribute("aria-label") ?? null,
        // Le dernier bloc du contenu : la rangée de boutons du bas d'un rapport,
        // les cartes ou la pagination du tableau de bord.
        dernierBloc: rect(principal?.lastElementChild),
        // Tout ce qui se clique dans le contenu : boutons, cartes, liens.
        liens: [...(principal?.querySelectorAll("a, button") ?? [])].map((lien) => rect(lien)!),
        basDuContenu: principal ? getComputedStyle(principal).paddingBottom : null,
        hauteurMinimale: principal?.parentElement ? getComputedStyle(principal.parentElement).minHeight : null,
        fenetre: { largeur: window.innerWidth, hauteur: window.innerHeight },
        page: { hauteur: document.documentElement.scrollHeight, largeur: document.documentElement.scrollWidth, defilement: window.scrollY },
      };
    },
    [BOUTON, CROIX, ENVOYER],
  );
}

type Rect = { top: number; right: number; bottom: number; left: number };
const recouvrement = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
const proche = (obtenu: number, attendu: number, message: string) =>
  assert.ok(Math.abs(obtenu - attendu) <= 0.5, `${message} : ${obtenu}, ${attendu} attendu`);

type Mesures = Awaited<ReturnType<typeof mesurer>>;

/** Le bouton flotte dans le coin bas droit de la fenêtre, à 24 px des bords. */
function flottant(m: Mesures, cas: string) {
  assert.equal(m.position, "fixed", cas);
  proche(m.fenetre.largeur - m.bouton.right, 24, `${cas}, marge droite`);
  proche(m.fenetre.hauteur - m.bouton.bottom, 24, `${cas}, marge basse`);
}

/**
 * Le bouton est dans le flux, à la fin du contenu : 24 px sous le dernier
 * bloc, à droite de la colonne de la page (`colonne` px au plus, centrée, à
 * 16 px de son bord), sans rien recouvrir de ce qui se clique.
 */
function dansLeFlux(m: Mesures, colonne: number, cas: string) {
  assert.equal(m.position, "static", cas);
  // Le bloc de la page n'a plus de hauteur minimale : le bouton suit le contenu.
  assert.equal(m.hauteurMinimale, "0px", `${cas} : le bloc de la page garde la hauteur de l'écran`);
  assert.ok(m.dernierBloc, `${cas} : contenu sans dernier bloc`);
  proche(m.bouton.top - m.dernierBloc.bottom, 24, `${cas}, écart avec le dernier bloc`);
  proche(m.dernierBloc.right - m.bouton.right, 0, `${cas}, alignement à droite de la colonne`);
  proche(m.fenetre.largeur - m.bouton.right, Math.max(0, (m.fenetre.largeur - colonne) / 2) + 16, `${cas}, marge droite`);
  assert.ok(m.liens.length > 0, `${cas} : aucun lien dans le contenu`);
  for (const lien of m.liens) assert.equal(recouvrement(m.bouton, lien), 0, `${cas} : le bouton recouvre un lien ou un bouton`);
  assert.equal(m.page.largeur, m.fenetre.largeur, `${cas} : défilement horizontal`);
}

/** Colonnes des deux pages : max-w-3xl pour le rapport, max-w-6xl pour le tableau de bord. */
const COLONNE_DU_RAPPORT = 768;
const COLONNE_DU_TABLEAU_DE_BORD = 1152;

// ── Le bouton, sur un rapport : dans le flux sous 1024 px, flottant à partir de 1024 px ──

test("rapport, sous 1024 px : le bouton de l'assistant est à la fin de la page, à droite de la colonne, et ne flotte plus sur le rapport", { skip }, async () => {
  // Téléphones (320, 390), l'ancien seuil (639, 640), tablettes (768, 834), dernier pixel (1023).
  const { page, erreurs, fermer } = await ouvrir(rapport(), 320, 740);
  for (const largeur of [320, 390, 639, 640, 768, 834, 1023]) {
    await redimensionner(page, largeur, 740);
    const haut = await mesurer(page);
    assert.equal(haut.position, "static", `${largeur} px`);
    // Page en haut : le bouton est sous la fenêtre, il ne couvre rien du rapport.
    assert.ok(haut.bouton.top >= haut.fenetre.hauteur, `${largeur} px : bouton visible en haut de page`);
    await bas(page);
    const m = await mesurer(page);
    // Après le contenu : 24 px sous le dernier bouton, puis 24 px jusqu'à la fin de la page.
    dansLeFlux(m, COLONNE_DU_RAPPORT, `${largeur} px`);
    proche(m.page.hauteur - (m.bouton.bottom + m.page.defilement), 24, `${largeur} px, marge sous le bouton`);
    assert.equal(m.basDuContenu, "24px", `${largeur} px : place d'un bouton flottant gardée sous le rapport`);
  }
  assert.deepEqual(erreurs, []);
  await fermer();
});

test("rapport, à partir de 1024 px : le bouton flotte en bas à droite, hors de la colonne, et le rapport lui garde sa place", { skip }, async () => {
  const { page, erreurs, fermer } = await ouvrir(rapport(), 1024, 800);
  for (const largeur of [1024, 1280, 1440]) {
    await redimensionner(page, largeur, 800);
    await bas(page);
    const m = await mesurer(page);
    flottant(m, `${largeur} px`);
    assert.equal(m.conteneur.height, 0, "le conteneur du bouton pèse dans la page");
    assert.equal(m.basDuContenu, "96px", "place réservée sous « Nouvelle analyse »");
    assert.equal(m.hauteurMinimale, "800px", `${largeur} px : le rapport n'occupe plus toute la fenêtre`);
    for (const lien of m.liens) assert.equal(recouvrement(m.bouton, lien), 0, `${largeur} px : le bouton flottant recouvre un bouton du rapport`);
    assert.equal(m.page.largeur, largeur, `${largeur} px : défilement horizontal`);
  }
  assert.deepEqual(erreurs, []);
  await fermer();
});

for (const [nom, donnees] of COURTS) {
  test(`rapport court (${nom}), sous 1024 px : le bouton suit le contenu, il n'est pas repoussé sous l'écran`, { skip }, async () => {
    const { page, fermer } = await ouvrir(rapport(donnees), 390, 844);
    for (const [largeur, hauteur] of [[390, 844], [834, 1112]]) {
      await redimensionner(page, largeur, hauteur);
      const m = await mesurer(page);
      dansLeFlux(m, COLONNE_DU_RAPPORT, `${largeur} × ${hauteur}`);
      assert.ok(m.bouton.bottom <= m.fenetre.hauteur, `${largeur} × ${hauteur} : bouton sous l'écran (${m.bouton.bottom})`);
      assert.equal(m.page.hauteur, m.fenetre.hauteur, `${largeur} × ${hauteur} : la page défile alors qu'elle tient dans la fenêtre`);
    }
    await fermer();
  });
}

for (const ecran of ["introuvable", "erreur"] as const) {
  test(`écran « ${ecran} » à l'adresse d'un rapport : ce n'est pas un rapport, le bouton flotte et reste visible`, { skip }, async () => {
    const { page, erreurs, fermer } = await ouvrir({ ecran }, 320, 568);
    for (const [largeur, hauteur] of [[320, 568], [390, 844], [639, 800], [640, 800], [834, 1112], [1023, 768], [1024, 768], [1359, 800], [1360, 800]]) {
      await redimensionner(page, largeur, hauteur);
      const m = await mesurer(page);
      flottant(m, `${largeur} × ${hauteur}`);
      assert.equal(m.page.hauteur, hauteur, `${largeur} × ${hauteur} : la page gagne du défilement`);
    }
    assert.deepEqual(erreurs, []);
    await fermer();
  });
}

// ── Le bouton, sur le tableau de bord : dans le flux sous 1360 px, flottant à partir de 1360 px ──
// 1360 = 1152 (colonne de la page, max-w-6xl) + 2 × 104 (56 px du bouton + 24 px
// jusqu'au bord de la fenêtre + 24 px d'écart avec la colonne) : tailwind.config.ts.
// Les cartes sont en retrait de 16 px dans la colonne (px-4) : à 1360 px, il y
// a 40 px entre elles et le bouton flottant.

/** Les cartes d'analyse du tableau de bord : chacune est un lien vers son rapport. */
const cartes = (page: Page) => page.locator('main a[href^="/check/0f8fad5b"]').count();

/** Le bouton de l'assistant et les cartes du tableau de bord (le bloc à bordure qui contient le lien de chaque analyse). */
function mesurerLesCartes(page: Page) {
  return page.evaluate((selBouton) => {
    const bouton = document.querySelector<HTMLElement>(selBouton);
    if (!bouton) throw new Error("bouton de l'assistant absent");
    // Sa place, sans l'agrandissement au survol ni sa transition (voir mesurer).
    const { transform, transition } = bouton.style;
    bouton.style.transition = "none";
    bouton.style.transform = "none";
    const b = bouton.getBoundingClientRect();
    bouton.style.transform = transform;
    bouton.style.transition = transition;
    const blocs = [...document.querySelectorAll('main a[href^="/check/0f8fad5b"]')].map((lien) =>
      (lien.parentElement as Element).getBoundingClientRect(),
    );
    return {
      position: getComputedStyle(bouton).position,
      cartes: blocs.length,
      // Du bord droit de la colonne de droite des cartes au bord gauche du bouton.
      ecart: b.left - Math.max(...blocs.map((bloc) => bloc.right)),
      aLaHauteurDuBouton: blocs.filter((bloc) => bloc.bottom > b.top && bloc.top < b.bottom).length,
      // Les cartes que le bouton recouvre, ne serait-ce que d'une fraction de pixel.
      recouvertes: blocs.filter(
        (bloc) => Math.min(bloc.right, b.right) > Math.max(bloc.left, b.left) && Math.min(bloc.bottom, b.bottom) > Math.max(bloc.top, b.top),
      ).length,
      defilementHorizontal: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, BOUTON);
}

/**
 * Page en bas, le bouton flotte à côté des cartes : aucune n'est recouverte, et
 * il reste `ecart` px (au dixième de pixel), 24 au moins, entre leur colonne
 * de droite et lui.
 */
function flottantACoteDesCartes(c: Awaited<ReturnType<typeof mesurerLesCartes>>, ecart: number, cas: string) {
  assert.equal(c.position, "fixed", cas);
  assert.equal(c.cartes, 24, `${cas} : 24 cartes attendues`);
  // Témoin : la dernière rangée de cartes est à la hauteur du bouton.
  assert.ok(c.aLaHauteurDuBouton > 0, `${cas} : aucune carte à la hauteur du bouton, rien n'est mesuré`);
  assert.equal(c.recouvertes, 0, `${cas} : le bouton flottant recouvre une carte`);
  assert.ok(c.ecart >= 24, `${cas} : ${c.ecart} px entre les cartes et le bouton flottant, 24 px au moins attendus`);
  assert.ok(Math.abs(c.ecart - ecart) <= 0.1, `${cas}, écart entre les cartes et le bouton : ${c.ecart} px, ${ecart} px attendus`);
  assert.equal(c.defilementHorizontal, 0, `${cas} : défilement horizontal`);
}

// 24 analyses : une page pleine, le dernier bloc est la grille des cartes.
// 30 analyses : la première de deux pages, le dernier bloc est la pagination.
for (const [analyses, dernierBloc] of [[24, "les cartes"], [30, "la pagination"]] as const) {
  test(`tableau de bord, sous 1360 px (${analyses} analyses, après ${dernierBloc}) : le bouton de l'assistant est à la fin de la page, à droite de la colonne, et ne flotte plus sur les cartes`, { skip }, async () => {
    // Téléphone (390), tablettes (768, 1024), 1280 px, où le bouton flottant
    // touchait encore la colonne de droite des cartes, dernier pixel (1359).
    const { page, erreurs, fermer } = await ouvrir(tableauDeBord(analyses), 390, 800);
    assert.equal(await cartes(page), 24, "24 cartes attendues");
    assert.equal(await page.locator('main nav[aria-label="Pages de l\'historique"]').count(), analyses > 24 ? 1 : 0);
    for (const largeur of [390, 768, 1024, 1280, 1359]) {
      const cas = `${largeur} px`;
      await redimensionner(page, largeur, 800);
      const haut = await mesurer(page);
      assert.equal(haut.position, "static", cas);
      // Page en haut : le bouton est sous la fenêtre, il ne couvre aucune carte.
      assert.ok(haut.bouton.top >= haut.fenetre.hauteur, `${cas} : bouton visible en haut de page`);
      await bas(page);
      const m = await mesurer(page);
      // Après le contenu : 24 px sous le dernier bloc, puis 24 px jusqu'à la fin de la page.
      dansLeFlux(m, COLONNE_DU_TABLEAU_DE_BORD, cas);
      proche(m.page.hauteur - (m.bouton.bottom + m.page.defilement), 24, `${cas}, marge sous le bouton`);
    }
    assert.deepEqual(erreurs, []);
    await fermer();
  });
}

test("tableau de bord, à partir de 1360 px : le bouton flotte en bas à droite, à 24 px au moins de la colonne de droite des cartes, et la page ne change pas", { skip }, async () => {
  const { page, erreurs, fermer } = await ouvrir(tableauDeBord(24), 1360, 800);
  assert.equal(await cartes(page), 24, "24 cartes attendues");
  // Entre les cartes et le bouton : 40 px au seuil, puis la moitié de ce que la fenêtre gagne.
  for (const [largeur, ecart] of [[1360, 40], [1440, 80]]) {
    const cas = `${largeur} px`;
    await redimensionner(page, largeur, 800);
    await bas(page);
    const m = await mesurer(page);
    flottant(m, cas);
    assert.equal(m.conteneur.height, 0, `${cas} : le conteneur du bouton pèse dans la page`);
    // La page garde son bas (sm:py-12) et sa hauteur minimale d'écran.
    assert.equal(m.basDuContenu, "48px", cas);
    assert.equal(m.hauteurMinimale, "800px", cas);
    for (const lien of m.liens) assert.equal(recouvrement(m.bouton, lien), 0, `${cas} : le bouton flottant recouvre un lien ou un bouton`);
    assert.equal(m.page.largeur, largeur, `${cas} : défilement horizontal`);
    flottantACoteDesCartes(await mesurerLesCartes(page), ecart, cas);
  }
  assert.deepEqual(erreurs, []);
  await fermer();
});

// Le seuil est une largeur de fenêtre, barre de défilement comprise ; le
// contenu, lui, se met en page sans elle. Quand la barre prend de la place
// (Windows, ou macOS réglé sur « toujours afficher »), une fenêtre de 1360 px
// laisse 1345 px au contenu avec une barre de 15 px, 1343 px avec une barre de
// 17 px : le bouton flotte déjà, et l'écart avec les cartes perd la moitié de
// la barre (32,5 px, 31,5 px). Sans barre (Mac, téléphone : elle se pose sur la
// page), il est de 40 px. Chaque largeur de 1359 à 1440 px est mesurée, dans
// les trois cas : le bouton flottant ne recouvre aucune carte à aucune d'elles.
for (const barre of [0, 15, 17]) {
  const nom = barre ? `barre de défilement de ${barre} px qui prend de la place` : "sans barre de défilement";
  const auSeuil = 40 - barre / 2;
  test(`tableau de bord, ${nom}, pixel par pixel : dans le flux à 1359 px ; de 1360 à 1440 px, le bouton flottant ne recouvre aucune carte et reste à 24 px au moins de leur colonne de droite (${String(auSeuil).replace(".", ",")} px à 1360 px)`, { skip }, async () => {
    const chromium = barre ? navigateurAvecBarre : navigateur;
    assert.ok(chromium);
    const { page, erreurs, fermer } = await ouvrirPage(chromium, { css, script, page: tableauDeBord(24), largeur: 1359, hauteur: 800 });
    await page.waitForSelector(BOUTON);
    if (barre) await page.addStyleTag({ content: `::-webkit-scrollbar { width: ${barre}px; }` });
    for (let largeur = 1359; largeur <= 1440; largeur++) {
      const cas = `fenêtre de ${largeur} px, ${nom}`;
      // Témoin : le contenu a `barre` px de moins que la fenêtre.
      await tailleDeFenetre(page, largeur, 800, barre);
      await bas(page);
      const c = await mesurerLesCartes(page);
      if (largeur < 1360) {
        // Sous le seuil, le bouton est dans le flux, sous les cartes : il n'en touche aucune.
        assert.equal(c.position, "static", cas);
        assert.equal(c.cartes, 24, `${cas} : 24 cartes attendues`);
        assert.equal(c.recouvertes, 0, `${cas} : le bouton, dans le flux, recouvre une carte`);
        assert.equal(c.defilementHorizontal, 0, `${cas} : défilement horizontal`);
        continue;
      }
      // Le contenu gagne 1 px par pixel de fenêtre, l'écart la moitié.
      flottantACoteDesCartes(c, auSeuil + (largeur - 1360) / 2, cas);
    }
    assert.deepEqual(erreurs, []);
    await fermer();
  });
}

test("tableau de bord court, sous 1360 px : le bouton suit le contenu, il n'est pas repoussé sous l'écran", { skip }, async () => {
  // Une seule analyse : la page tient dans la fenêtre.
  const { page, erreurs, fermer } = await ouvrir(tableauDeBord(1), 390, 844);
  assert.equal(await cartes(page), 1);
  for (const [largeur, hauteur] of [[390, 844], [1024, 768], [1280, 800], [1359, 800]]) {
    const cas = `${largeur} × ${hauteur}`;
    await redimensionner(page, largeur, hauteur);
    const m = await mesurer(page);
    dansLeFlux(m, COLONNE_DU_TABLEAU_DE_BORD, cas);
    assert.ok(m.bouton.bottom <= m.fenetre.hauteur, `${cas} : bouton sous l'écran (${m.bouton.bottom})`);
    assert.equal(m.page.hauteur, m.fenetre.hauteur, `${cas} : la page défile alors qu'elle tient dans la fenêtre`);
  }
  assert.deepEqual(erreurs, []);
  await fermer();
});

test("tableau de bord sans analyse, sous 1360 px : le bouton est sous l'encadré « Aucune analyse », dans le flux", { skip }, async () => {
  const { page, erreurs, fermer } = await ouvrir(tableauDeBord(0), 390, 844);
  assert.equal(await page.getByText("Aucune analyse", { exact: true }).count(), 1);
  for (const [largeur, hauteur] of [[390, 844], [1024, 768], [1359, 800]]) {
    await redimensionner(page, largeur, hauteur);
    await bas(page);
    dansLeFlux(await mesurer(page), COLONNE_DU_TABLEAU_DE_BORD, `${largeur} × ${hauteur}`);
  }
  assert.deepEqual(erreurs, []);
  await fermer();
});

// ── Le panneau : il s'ouvre et se ferme comme avant ─────────────────────────

/** Ouvre le panneau par le bouton et vérifie sa place : fixé, 96 px au-dessus du bas, 24 px du bord droit. */
async function ouvrirLePanneau(page: Page, cas: string) {
  await page.locator(BOUTON).click();
  assert.equal(await ouvert(page), true, `${cas} : le bouton n'ouvre pas le panneau`);
  const m = await mesurer(page);
  assert.equal(m.nom, "Fermer l'assistant", cas);
  assert.ok(m.panneau && m.envoyer, `${cas} : panneau sans « Envoyer »`);
  proche(m.fenetre.hauteur - m.panneau.bottom, 96, `${cas}, bas du panneau`);
  proche(m.fenetre.largeur - m.panneau.right, 24, `${cas}, droite du panneau`);
  // Le bouton, flottant sous le panneau : il ne le touche pas.
  flottant(m, `${cas}, panneau ouvert`);
  assert.equal(recouvrement(m.bouton, m.panneau), 0, `${cas} : le bouton est posé sur le panneau`);
  assert.equal(m.auCentreDEnvoyer, "Envoyer", `${cas} : « Envoyer » est recouvert`);
  return m;
}

// Chaque cas : la page, la fenêtre, et où est le bouton panneau fermé (dans le
// flux sous le seuil de la page, flottant à partir de lui).
for (const [nom, contenu, largeur, hauteur, panneauFerme] of [
  ["rapport complet", rapport(), 360, 740, "static"],
  ["rapport complet", rapport(), 639, 800, "static"],
  ["rapport court (analyse en cours)", rapport(COURTS[0][1]), 412, 839, "static"],
  // Tablette : bouton dans le flux, à droite de la colonne.
  ["rapport complet", rapport(), 834, 1112, "static"],
  ["rapport complet", rapport(), 1280, 800, "fixed"],
  // Tableau de bord : dans le flux (tablette ; page longue à 1280 px, l'ancien
  // seuil, et au dernier pixel, la plage que le seuil de 1360 px ajoute ; page
  // courte au dernier pixel), et flottant.
  ["tableau de bord", tableauDeBord(24), 1024, 768, "static"],
  ["tableau de bord", tableauDeBord(24), 1280, 800, "static"],
  ["tableau de bord", tableauDeBord(24), 1359, 800, "static"],
  ["tableau de bord court", tableauDeBord(1), 1359, 800, "static"],
  ["tableau de bord", tableauDeBord(24), 1360, 800, "fixed"],
] as const) {
  test(`${nom}, ${largeur} × ${hauteur} : le panneau s'ouvre par le bouton, se ferme par la croix, par le bouton et par un clic à l'extérieur`, { skip }, async () => {
    const cas = `${nom}, ${largeur} × ${hauteur}`;
    const { page, erreurs, fermer } = await ouvrir(contenu, largeur, hauteur);
    await bas(page);
    const avant = await mesurer(page);
    assert.equal(await ouvert(page), false);
    assert.equal(avant.nom, "Ouvrir l'assistant");
    // Témoin : panneau fermé, le bouton est bien là où cette largeur le met.
    assert.equal(avant.position, panneauFerme, `${cas} : place du bouton, panneau fermé`);

    // La croix du panneau. La page garde sa hauteur à l'ouverture et à la fermeture.
    const pendant = await ouvrirLePanneau(page, cas);
    assert.equal(pendant.page.hauteur, avant.page.hauteur, `${cas} : la page change de hauteur à l'ouverture`);
    assert.equal(pendant.page.defilement, avant.page.defilement, `${cas} : la page saute à l'ouverture`);
    await page.locator(CROIX).click();
    assert.equal(await ouvert(page), false, `${cas} : la croix ne ferme pas`);
    assert.deepEqual(await mesurer(page), avant, `${cas} : la page n'est pas revenue à son état de départ`);

    // Le bouton lui-même, cliqué au bord du rond : il ferme, et ne rouvre pas.
    await ouvrirLePanneau(page, cas);
    await page.locator(BOUTON).click({ position: { x: 3, y: 28 } });
    await page.waitForTimeout(100);
    assert.equal(await ouvert(page), false, `${cas} : le bouton ne ferme pas`);

    // Un clic sur la page, en haut de la fenêtre.
    await ouvrirLePanneau(page, cas);
    await page.mouse.click(4, 100);
    assert.equal(await ouvert(page), false, `${cas} : un clic sur la page ne ferme pas`);

    // Un clic à côté du bouton, à sa hauteur, et dans la marge sous lui.
    for (const [x, depuisLeBas] of [[4, 52], [4, 12], [largeur - 4, 12]]) {
      const m = await ouvrirLePanneau(page, cas);
      await page.mouse.click(x, m.fenetre.hauteur - depuisLeBas);
      assert.equal(await ouvert(page), false, `${cas} : un clic à côté du bouton (${x}, bas − ${depuisLeBas}) ne ferme pas`);
    }

    // Un clic dans le panneau ne le ferme pas ; « Envoyer » envoie la question.
    const m = await ouvrirLePanneau(page, cas);
    assert.ok(m.panneau);
    await page.mouse.click(m.panneau.left + 120, m.panneau.top + 24);
    assert.equal(await ouvert(page), true, `${cas} : un clic dans le panneau le ferme`);
    await page.locator("form input").fill("Combien de photos faut-il ?");
    await page.locator(ENVOYER).click();
    assert.equal(await ouvert(page), true, `${cas} : « Envoyer » ferme le panneau`);
    assert.equal(await page.getByText("Combien de photos faut-il ?", { exact: true }).count(), 1, `${cas} : la question n'est pas partie`);
    assert.equal(await page.locator("form input").inputValue(), "", `${cas} : la question est restée dans le champ`);
    assert.deepEqual(erreurs, []);
    await fermer();
  });
}

test("page courte, fenêtre haute : panneau ouvert, le bouton ne se pose jamais sur le panneau ni sur « Envoyer »", { skip }, async () => {
  // Du contenu plus haut que la fenêtre à la fenêtre bien plus haute que lui :
  // tous les 20 px sur téléphone, cinq hauteurs sur tablette.
  const hauteurs: number[] = [];
  for (let hauteur = 600; hauteur <= 1000; hauteur += 20) hauteurs.push(hauteur);
  const quelquesHauteurs = [600, 700, 800, 900, 1000];
  const courtes: Array<[string, PageRendue, Array<[number, number[]]>]> = [
    ...COURTS.map(([nom, donnees]): [string, PageRendue, Array<[number, number[]]>] => [
      `rapport court (${nom})`,
      rapport(donnees),
      [[360, hauteurs], [412, hauteurs], [834, quelquesHauteurs]],
    ]),
    ["tableau de bord court", tableauDeBord(1), [[412, hauteurs], [1024, quelquesHauteurs], [1359, quelquesHauteurs]]],
  ];
  for (const [nom, contenu, fenetres] of courtes) {
    const { page, fermer } = await ouvrir(contenu, fenetres[0][0], 700);
    await page.locator(BOUTON).click();
    for (const [largeur, hauteursDeFenetre] of fenetres) {
      for (const hauteur of hauteursDeFenetre) {
        // Panneau et bouton sont fixés à la fenêtre : leur place suit sa taille aussitôt.
        await page.setViewportSize({ width: largeur, height: hauteur });
        const m = await mesurer(page);
        const cas = `${nom}, ${largeur} × ${hauteur}`;
        assert.ok(m.panneau && m.envoyer, `${cas} : panneau fermé`);
        assert.equal(recouvrement(m.bouton, m.panneau), 0, `${cas} : le bouton est posé sur le panneau`);
        assert.equal(m.auCentreDEnvoyer, "Envoyer", `${cas} : un appui sur « Envoyer » tombe sur « ${m.auCentreDEnvoyer} »`);
      }
    }
    await fermer();
  }
});

// ── « Scores par zone » : un nom long ne touche jamais sa note ──────────────

test("« Scores par zone » : au moins 12 px entre un nom de zone, même long, et sa note", { skip }, async () => {
  const { page, fermer } = await ouvrir(rapport(), 320, 740);
  const largeurs = [];
  for (let largeur = 320; largeur <= 430; largeur += 5) largeurs.push(largeur);
  for (let largeur = 640; largeur <= 720; largeur += 10) largeurs.push(largeur);
  for (const largeur of largeurs) {
    await page.setViewportSize({ width: largeur, height: 740 });
    const lignes = await page.evaluate(() =>
      [...document.querySelectorAll("span.tabular-nums")]
        .filter((note) => note.parentElement?.children.length === 2 && note.previousElementSibling?.tagName === "SPAN")
        .map((note) => {
          const nom = note.previousElementSibling as Element;
          return {
            nom: nom.textContent,
            note: note.textContent,
            ecart: note.getBoundingClientRect().left - nom.getBoundingClientRect().right,
            dansLaLigne: note.getBoundingClientRect().right <= (note.parentElement as Element).getBoundingClientRect().right + 0.5,
          };
        }),
    );
    assert.equal(lignes.length, 6, "six barres attendues");
    assert.ok(lignes.some((ligne) => ligne.nom === "Qualité mesh et superpositions matières" && ligne.note === "100"));
    for (const ligne of lignes) {
      assert.ok(ligne.ecart >= 11.5, `${largeur} px : « ${ligne.nom} » à ${ligne.ecart.toFixed(1)} px de sa note`);
      assert.ok(ligne.dansLaLigne, `${largeur} px : la note de « ${ligne.nom} » sort de sa ligne`);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), largeur, `${largeur} px : défilement horizontal`);
  }
  await fermer();
});

// ── Observations : la note reste en haut à droite, quel que soit le nom ─────

test("observations : la note reste sur la ligne du nom, à droite, que le nom soit court, moyen ou long", { skip }, async () => {
  // Un nom en français est plus long qu'un identifiant. Avant, selon sa
  // longueur, la note passait seule sur une deuxième ligne, ou le badge
  // descendait avec elle : les cartes d'une même liste n'avaient plus la même
  // forme. Ce test échoue si la note quitte la première ligne du nom, si elle
  // touche le nom ou le badge, ou si un badge sort de sa carte.
  const donnees: ReportData = {
    ...BASE,
    findings: [
      { zone: "stitching", observation: "Points réguliers.", score: 90 },
      { zone: "tongue_label", observation: "Texte légèrement décentré.", score: 58, severity: "important" },
      { zone: "swoosh", observation: "Courbe et pointe conformes.", score: 80 },
      { zone: "toe_box", observation: "Perforations alignées.", score: 85 },
    ],
  };
  const { page, fermer } = await ouvrir(rapport(donnees), 320, 740);
  const largeurs = [];
  for (let largeur = 320; largeur <= 430; largeur += 10) largeurs.push(largeur);
  largeurs.push(640, 1280);
  for (const largeur of largeurs) {
    await page.setViewportSize({ width: largeur, height: 740 });
    const cartes = await page.evaluate(() =>
      [...document.querySelectorAll("span.tabular-nums")]
        .filter((note) => note.previousElementSibling?.tagName === "DIV")
        .map((note) => {
          const groupe = note.previousElementSibling as Element;
          const [nom, badge] = [groupe.firstElementChild as Element, groupe.lastElementChild as Element];
          const premiereLigne = nom.getClientRects()[0];
          const n = note.getBoundingClientRect();
          const carte = (note.closest(".rounded-md") as Element).getBoundingClientRect();
          return {
            nom: nom.textContent,
            badge: badge.textContent,
            note: note.textContent,
            centreDeLaNote: n.top + n.height / 2,
            ligneDuNom: { haut: premiereLigne.top, bas: premiereLigne.bottom },
            ecart: n.left - groupe.getBoundingClientRect().right,
            margeDroite: (note.parentElement as Element).getBoundingClientRect().right - n.right,
            badgeDansLaCarte: badge.getBoundingClientRect().right <= carte.right && badge.getBoundingClientRect().left >= carte.left,
          };
        }),
    );
    assert.deepEqual(
      cartes.map((carte) => [carte.nom, carte.badge, carte.note]),
      [
        ["Coutures", "Conforme", "90/100"],
        ["Étiquette de taille", "À vérifier", "58/100"],
        ["Forme et placement du Swoosh", "Conforme", "80/100"],
        ["Forme et perforations de la toe box", "Conforme", "85/100"],
      ],
    );
    for (const carte of cartes) {
      const cas = `${largeur} px, « ${carte.nom} »`;
      assert.ok(
        carte.centreDeLaNote > carte.ligneDuNom.haut && carte.centreDeLaNote < carte.ligneDuNom.bas,
        `${cas} : la note n'est plus sur la première ligne du nom`,
      );
      assert.ok(carte.ecart >= 11.5, `${cas} : la note est à ${carte.ecart.toFixed(1)} px du nom ou du badge`);
      assert.ok(Math.abs(carte.margeDroite) <= 0.5, `${cas} : la note n'est pas à droite de la carte`);
      assert.ok(carte.badgeDansLaCarte, `${cas} : le badge sort de la carte`);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), largeur, `${largeur} px : défilement horizontal`);
  }
  await fermer();
});
