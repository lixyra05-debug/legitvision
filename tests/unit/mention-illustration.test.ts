// Toute image ou vidéo générée par IA que le site affiche porte la mention
// « Image d'illustration » ou « Vidéo d'illustration » (décision d'Hector du
// 14/10/2026 : « Toutes les images et vidéos IA doivent afficher la mention
// « image / vidéo d'illustration » »), posée par
// components/ui/mention-illustration.tsx. Une photo réelle ne la porte pas.
//
// Médias IA du site, avec leur provenance (un nouveau média IA s'ajoute ici) :
// - images des catégories sacs et vêtements : générées par ChatGPT ; leurs
//   originaux sont signés C2PA par OpenAI (relevé du 14/10/2026) ;
// - vidéo de présentation de l'accueil et son image d'attente : générées par IA
//   (Hector, 14/10/2026).
// La catégorie sneakers montre une photo réelle de la paire Travis (décision
// d'Hector du 15/10/2026) : sans mention, et jamais dans le dépôt, qui est public.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { IMAGES_CATEGORIES } from "@/lib/images-categories";

const RACINE = new URL("../../", import.meta.url).pathname;
const MEDIAS_IA = [
  "/images/categories/sacs.webp",
  "/images/categories/vetements.webp",
  "/images/hero-poster.webp",
  "/videos/hero-video.mp4",
];
const PHOTO_TRAVIS = "/images/categories/travis.png";
const MENTION = /<MentionIllustration\b|(?:Image|Vidéo) d'illustration/;

function sources(dossier: string): string[] {
  return readdirSync(join(RACINE, dossier)).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(join(RACINE, chemin)).isDirectory()) return sources(chemin);
    return /\.(ts|tsx)$/.test(nom) && !/\.test\./.test(nom) ? [chemin] : [];
  });
}
const lire = (chemin: string) => readFileSync(join(RACINE, chemin), "utf8");

test("chaque média IA de la liste existe dans public/", () => {
  for (const media of MEDIAS_IA) assert.ok(existsSync(join(RACINE, "public", media)), media);
});

test("tout fichier qui affiche directement un média IA pose la mention « d'illustration »", () => {
  const affichent = ["app", "components", "lib"]
    .flatMap(sources)
    .filter((chemin) => chemin !== "lib/images-categories.ts")
    .filter((chemin) => MEDIAS_IA.some((media) => lire(chemin).includes(media)));
  // La vidéo de présentation de l'accueil (app/page.tsx).
  assert.ok(affichent.length >= 1, "la recherche ne trouve plus les médias");
  assert.deepEqual(affichent.filter((chemin) => !MENTION.test(lire(chemin))), []);
});

test("images des catégories : les images IA sont marquées, la photo de la Travis ne l'est pas", () => {
  for (const [categorie, image] of Object.entries(IMAGES_CATEGORIES)) {
    assert.equal(image.ia, MEDIAS_IA.includes(image.src), categorie);
  }
  assert.deepEqual(IMAGES_CATEGORIES.sneakers, { src: PHOTO_TRAVIS, ia: false });
  // Le bandeau et les cartes posent la mention seulement sur une image IA.
  for (const chemin of ["components/landing/BrandsTabs.tsx", "components/check/CategoryPicker.tsx"]) {
    const code = lire(chemin);
    assert.match(code, /IMAGES_CATEGORIES/, chemin);
    assert.match(code, /\.ia && <MentionIllustration type="image" \/>/, chemin);
  }
});

test("la photo de la Travis n'est jamais suivie par Git (dépôt public)", () => {
  const suivis = execFileSync("git", ["ls-files", "--", "public/images/categories"], { cwd: RACINE, encoding: "utf8" });
  assert.ok(!suivis.includes("travis"), suivis);
});

test("la photo de la Travis est présente dans public/ (hors Git : à copier avant toute construction ou tout déploiement)", () => {
  assert.ok(existsSync(join(RACINE, "public", PHOTO_TRAVIS)), PHOTO_TRAVIS);
});

test("la mention dit « Image d'illustration » ou « Vidéo d'illustration »", () => {
  const composant = lire("components/ui/mention-illustration.tsx");
  assert.match(composant, /"Vidéo d'illustration"/);
  assert.match(composant, /"Image d'illustration"/);
});
