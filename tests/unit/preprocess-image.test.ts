// preprocessImage doit redresser la photo selon son orientation EXIF avant de
// l'envoyer au modèle : un téléphone enregistre souvent l'image « couchée » avec
// une étiquette d'orientation, que le modèle ne lit pas.
import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { preprocessImage } from "@/lib/ai/analyze";

const ROUGE = { r: 220, g: 30, b: 30 };
const BLEU = { r: 30, g: 30, b: 220 };

/** JPEG stocké en 1000 × 800 : moitié gauche rouge, moitié droite bleue. */
async function photo(orientation?: number): Promise<Buffer> {
  const gauche = await sharp({ create: { width: 500, height: 800, channels: 3, background: ROUGE } }).png().toBuffer();
  const image = sharp({ create: { width: 1000, height: 800, channels: 3, background: BLEU } })
    .composite([{ input: gauche, left: 0, top: 0 }])
    .jpeg({ quality: 95 });
  return orientation ? image.withMetadata({ orientation }).toBuffer() : image.toBuffer();
}

async function pixel(image: Buffer, x: number, y: number) {
  const [r, g, b] = await sharp(image).extract({ left: x, top: y, width: 1, height: 1 }).raw().toBuffer();
  return { r, g, b };
}

const estRouge = (p: { r: number; b: number }) => p.r > 150 && p.b < 100;
const estBleu = (p: { r: number; b: number }) => p.b > 150 && p.r < 100;

test("orientation EXIF 6 (tournée de 90° dans le sens horaire) : image redressée", async () => {
  const sortie = await preprocessImage(await photo(6));
  const meta = await sharp(sortie).metadata();
  // Redressée : 800 de large, 1000 de haut ; la moitié gauche stockée passe en haut.
  assert.equal(meta.width, 800);
  assert.equal(meta.height, 1000);
  assert.ok(estRouge(await pixel(sortie, 400, 100)), "le haut doit être rouge");
  assert.ok(estBleu(await pixel(sortie, 400, 900)), "le bas doit être bleu");
  // Plus d'étiquette qui ferait tourner l'image une seconde fois.
  assert.ok(meta.orientation === undefined || meta.orientation === 1);
});

test("orientation EXIF 8 (tournée de 90° dans le sens antihoraire) : image redressée", async () => {
  const sortie = await preprocessImage(await photo(8));
  const meta = await sharp(sortie).metadata();
  assert.equal(meta.width, 800);
  assert.equal(meta.height, 1000);
  assert.ok(estBleu(await pixel(sortie, 400, 100)), "le haut doit être bleu");
  assert.ok(estRouge(await pixel(sortie, 400, 900)), "le bas doit être rouge");
});

test("sans orientation EXIF : image inchangée", async () => {
  const sortie = await preprocessImage(await photo());
  const meta = await sharp(sortie).metadata();
  assert.equal(meta.width, 1000);
  assert.equal(meta.height, 800);
  assert.ok(estRouge(await pixel(sortie, 100, 400)));
  assert.ok(estBleu(await pixel(sortie, 900, 400)));
});

test("réduction au plus grand côté de 1568 px conservée après redressement", async () => {
  const grande = await sharp({ create: { width: 4032, height: 3024, channels: 3, background: BLEU } })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  const meta = await sharp(await preprocessImage(grande)).metadata();
  assert.equal(meta.width, 1176);
  assert.equal(meta.height, 1568);
});
