// isOwnPhotoPath : seul un fichier du dossier de l'analyse est suivi par le
// serveur (clé de service). Cas de la relecture adverse du 27/09 : « %2e%2e »,
// que fetch résout en « .. ».
import { test } from "node:test";
import assert from "node:assert/strict";
import { isOwnPhotoPath } from "@/lib/photo-path";

const U = "11111111-1111-4111-8111-111111111111";
const A = "22222222-2222-4222-8222-222222222222";
const V = "33333333-3333-4333-8333-333333333333";

test("chemins légitimes : nom de fichier dans le dossier de l'analyse", () => {
  for (const nom of ["sole.jpg", "tag_inside.webp", "sole.IMG 1234", "box-label.PNG"]) {
    assert.equal(isOwnPhotoPath(`${U}/${A}/${nom}`, U, A), true, nom);
  }
});

test("remontées de dossier, encodées ou non : refusées", () => {
  for (const nom of [
    `%2e%2e/%2e%2e/${V}/${A}/sole.jpg`,
    `.%2E/x.jpg`,
    `%2E%2E`,
    `../${V}/sole.jpg`,
    `..`,
    `.`,
    `a\\..\\..\\${V}\\sole.jpg`,
    `\t./x`,
    `.\u0009.`,
  ]) {
    assert.equal(isOwnPhotoPath(`${U}/${A}/${nom}`, U, A), false, JSON.stringify(nom));
  }
});

test("sous-dossier, requête, fragment, nom vide : refusés", () => {
  for (const nom of ["x/y.jpg", "sole.jpg?x=1", "sole.jpg#a", ""]) {
    assert.equal(isOwnPhotoPath(`${U}/${A}/${nom}`, U, A), false, JSON.stringify(nom));
  }
});

test("dossier d'un autre utilisateur ou d'une autre analyse : refusé", () => {
  assert.equal(isOwnPhotoPath(`${V}/${A}/sole.jpg`, U, A), false);
  assert.equal(isOwnPhotoPath(`${U}/${V}/sole.jpg`, U, A), false);
  assert.equal(isOwnPhotoPath(`${U}/${A}x/sole.jpg`, U, A), false);
  assert.equal(isOwnPhotoPath(null, U, A), false);
  assert.equal(isOwnPhotoPath(42, U, A), false);
});
