// Le rapport et l'assistant dans un vrai navigateur (Chromium de Playwright),
// avec les vrais composants et la feuille de style du site : ce qu'un rendu
// statique ne voit pas. Décisions d'Hector du 05/10 :
// - sur un rapport, sous 640 px, le bouton de l'assistant est dans le flux, à
//   la fin de la page, à droite ; à partir de 640 px et partout ailleurs, il
//   flotte comme avant ;
// - le panneau de l'assistant s'ouvre et se ferme comme avant.
// Ces tests échouent si : le bouton redevient flottant sur un rapport sous
// 640 px ; il quitte le coin de la fenêtre ailleurs (analyse introuvable ou
// erreur à l'adresse d'un rapport comprises) ; panneau ouvert, il se pose sur
// le panneau ou sur « Envoyer » ; un clic sur la croix, sur le bouton ou hors
// du panneau ne ferme plus ; un nom de zone long touche sa note.
// Sans Chromium sur la machine, ils ne s'exécutent pas et le disent.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import type { Page } from "@playwright/test";
import type { ReportData } from "@/components/check/ReportView";
import type { PageRendue } from "./support/navigateur/page-assistant";
import { CHROMIUM_ABSENT, empaqueter, feuilleDeStyle, lancerChromium, ouvrirPage } from "./support/navigateur";

const navigateur = await lancerChromium();
const skip = navigateur ? false : CHROMIUM_ABSENT;
after(() => navigateur?.close());

const css = navigateur ? await feuilleDeStyle() : "";
const script = navigateur
  ? empaqueter("tests/unit/support/navigateur/page-assistant.tsx", {
      "next/link": "tests/unit/support/navigateur/next-link.tsx",
      "next/navigation": "tests/unit/support/navigateur/next-navigation.ts",
      "next/font/local": "tests/unit/support/navigateur/next-font.ts",
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
    heel_tab: "Tab talon",
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
      const liens = document.querySelectorAll('main a[href="/check/new"]');
      return {
        position: getComputedStyle(bouton).position,
        nom: bouton.getAttribute("aria-label"),
        bouton: placeDuBouton,
        conteneur: rect(bouton.parentElement)!,
        panneau: rect(panneau),
        envoyer: e,
        auCentreDEnvoyer: auCentre?.closest("button")?.getAttribute("aria-label") ?? null,
        dernierLien: rect(liens[liens.length - 1]),
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

/** Le bouton flotte dans le coin bas droit de la fenêtre, à 24 px des bords. */
function flottant(m: Awaited<ReturnType<typeof mesurer>>, cas: string) {
  assert.equal(m.position, "fixed", cas);
  proche(m.fenetre.largeur - m.bouton.right, 24, `${cas}, marge droite`);
  proche(m.fenetre.hauteur - m.bouton.bottom, 24, `${cas}, marge basse`);
}

// ── Le bouton : dans le flux sur un rapport sous 640 px, flottant ailleurs ──

test("rapport, sous 640 px : le bouton de l'assistant est à la fin de la page, à droite, et ne flotte plus sur le rapport", { skip }, async () => {
  for (const largeur of [320, 360, 430, 639]) {
    const { page, erreurs, fermer } = await ouvrir(rapport(), largeur, 740);
    const haut = await mesurer(page);
    assert.equal(haut.position, "static", `${largeur} px`);
    // Page en haut : le bouton est sous la fenêtre, il ne couvre rien du rapport.
    assert.ok(haut.bouton.top >= haut.fenetre.hauteur, `${largeur} px : bouton visible en haut de page`);
    await bas(page);
    const m = await mesurer(page);
    // Après le contenu : 24 px sous le dernier bouton, puis 24 px jusqu'à la fin de la page.
    assert.ok(m.dernierLien, "bouton « Nouvelle analyse » absent");
    proche(m.bouton.top - m.dernierLien.bottom, 24, `${largeur} px, écart avec le dernier bouton`);
    proche(m.page.hauteur - (m.bouton.bottom + m.page.defilement), 24, `${largeur} px, marge sous le bouton`);
    // À droite, avec la marge de la page (16 px).
    proche(m.fenetre.largeur - m.bouton.right, 16, `${largeur} px, marge droite`);
    assert.equal(m.page.largeur, largeur, `${largeur} px : défilement horizontal`);
    assert.deepEqual(erreurs, []);
    await fermer();
  }
});

test("rapport, à partir de 640 px : le bouton flotte en bas à droite, et le rapport lui garde sa place", { skip }, async () => {
  for (const largeur of [640, 1280]) {
    const { page, fermer } = await ouvrir(rapport(), largeur, 800);
    const m = await mesurer(page);
    flottant(m, `${largeur} px`);
    assert.equal(m.conteneur.height, 0, "le conteneur du bouton pèse dans la page");
    const place = await page.evaluate(() => getComputedStyle(document.querySelector("main") as Element).paddingBottom);
    assert.equal(place, "96px", "place réservée sous « Nouvelle analyse »");
    await fermer();
  }
});

for (const [nom, donnees] of COURTS) {
  test(`rapport court (${nom}), sous 640 px : le bouton suit le contenu, il n'est pas repoussé sous l'écran`, { skip }, async () => {
    const { page, fermer } = await ouvrir(rapport(donnees), 390, 844);
    const m = await mesurer(page);
    assert.equal(m.position, "static");
    assert.ok(m.bouton.bottom <= m.fenetre.hauteur, `bouton sous l'écran : ${m.bouton.bottom} > ${m.fenetre.hauteur}`);
    assert.equal(m.page.hauteur, m.fenetre.hauteur, "la page défile alors qu'elle tient dans la fenêtre");
    await fermer();
  });
}

for (const ecran of ["introuvable", "erreur"] as const) {
  test(`écran « ${ecran} » à l'adresse d'un rapport : ce n'est pas un rapport, le bouton flotte et reste visible`, { skip }, async () => {
    for (const [largeur, hauteur] of [[320, 568], [360, 740], [390, 844], [639, 800], [640, 800]]) {
      const { page, erreurs, fermer } = await ouvrir({ ecran }, largeur, hauteur);
      const m = await mesurer(page);
      flottant(m, `${largeur} × ${hauteur}`);
      assert.equal(m.page.hauteur, hauteur, `${largeur} × ${hauteur} : la page gagne du défilement`);
      assert.deepEqual(erreurs, []);
      await fermer();
    }
  });
}

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

for (const [nom, donnees, largeur, hauteur] of [
  ["rapport complet", BASE, 360, 740],
  ["rapport complet", BASE, 639, 800],
  ["rapport court (analyse en cours)", COURTS[0][1], 412, 839],
  ["rapport complet", BASE, 1280, 800],
] as const) {
  test(`${nom}, ${largeur} × ${hauteur} : le panneau s'ouvre par le bouton, se ferme par la croix, par le bouton et par un clic à l'extérieur`, { skip }, async () => {
    const cas = `${nom}, ${largeur} × ${hauteur}`;
    const { page, erreurs, fermer } = await ouvrir(rapport(donnees), largeur, hauteur);
    await bas(page);
    const avant = await mesurer(page);
    assert.equal(await ouvert(page), false);
    assert.equal(avant.nom, "Ouvrir l'assistant");

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

    // Un clic sur le rapport, en haut de la fenêtre.
    await ouvrirLePanneau(page, cas);
    await page.mouse.click(4, 100);
    assert.equal(await ouvert(page), false, `${cas} : un clic sur le rapport ne ferme pas`);

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

test("rapport court, fenêtre haute : panneau ouvert, le bouton ne se pose jamais sur le panneau ni sur « Envoyer »", { skip }, async () => {
  for (const [nom, donnees] of COURTS) {
    for (const largeur of [360, 412]) {
      const { page, fermer } = await ouvrir(rapport(donnees), largeur, 700);
      await page.locator(BOUTON).click();
      // Du contenu plus haut que la fenêtre à la fenêtre bien plus haute que lui.
      for (let hauteur = 600; hauteur <= 1000; hauteur += 20) {
        await page.setViewportSize({ width: largeur, height: hauteur });
        const m = await mesurer(page);
        const cas = `${nom}, ${largeur} × ${hauteur}`;
        assert.ok(m.panneau && m.envoyer, `${cas} : panneau fermé`);
        assert.equal(recouvrement(m.bouton, m.panneau), 0, `${cas} : le bouton est posé sur le panneau`);
        assert.equal(m.auCentreDEnvoyer, "Envoyer", `${cas} : un appui sur « Envoyer » tombe sur « ${m.auCentreDEnvoyer} »`);
      }
      await fermer();
    }
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
        ["Étiquette de languette", "À vérifier", "58/100"],
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
