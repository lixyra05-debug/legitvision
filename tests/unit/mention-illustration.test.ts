// Toute image ou vidéo générée par IA que le site affiche porte la mention
// « Image d'illustration » ou « Vidéo d'illustration » (décision d'Hector du
// 14/10/2026 : « Toutes les images et vidéos IA doivent afficher la mention
// « image / vidéo d'illustration » »), posée par
// components/ui/mention-illustration.tsx.
//
// Médias IA du site, avec leur provenance (un nouveau média IA s'ajoute ici) :
// - images de catégories : générées par Gemini ; leurs originaux sont signés
//   C2PA par Google et le filigrane ✦ de Gemini est dans l'image (relevé du
//   14/10/2026) ;
// - vidéo de présentation de l'accueil et son image d'attente : générées par IA
//   (Hector, 14/10/2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RACINE = new URL("../../", import.meta.url).pathname;
const MEDIAS_IA = [
  "/images/sneakers.webp",
  "/images/bags.webp",
  "/images/clothing.webp",
  "/images/hero-poster.webp",
  "/videos/hero-video.mp4",
];
const MENTION = /<MentionIllustration\b|(?:Image|Vidéo) d'illustration/;

function sources(dossier: string): string[] {
  return readdirSync(join(RACINE, dossier)).flatMap((nom) => {
    const chemin = join(dossier, nom);
    if (statSync(join(RACINE, chemin)).isDirectory()) return sources(chemin);
    return /\.(ts|tsx)$/.test(nom) && !/\.test\./.test(nom) ? [chemin] : [];
  });
}

test("chaque média IA de la liste existe dans public/", () => {
  for (const media of MEDIAS_IA) assert.ok(existsSync(join(RACINE, "public", media)), media);
});

test("tout fichier qui affiche un média IA pose la mention « d'illustration »", () => {
  const affichent = ["app", "components", "lib"]
    .flatMap(sources)
    .filter((chemin) => MEDIAS_IA.some((media) => readFileSync(join(RACINE, chemin), "utf8").includes(media)));
  // Accueil (vidéo), bandeau des catégories, cartes de « Nouvelle analyse », comparateur.
  assert.ok(affichent.length >= 4, `${affichent.length} fichiers seulement : la recherche ne trouve plus les médias`);
  const sansMention = affichent.filter((chemin) => !MENTION.test(readFileSync(join(RACINE, chemin), "utf8")));
  assert.deepEqual(sansMention, []);
});

test("la mention dit « Image d'illustration » ou « Vidéo d'illustration »", () => {
  const composant = readFileSync(join(RACINE, "components/ui/mention-illustration.tsx"), "utf8");
  assert.match(composant, /"Vidéo d'illustration"/);
  assert.match(composant, /"Image d'illustration"/);
});
