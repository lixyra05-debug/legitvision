// catalogProblem / unknownPhotoTypes : seul ce qui sort du catalogue entre dans
// le prompt (et, pour la variante et la collab, dans le résumé du rapport).
import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogProblem, unknownPhotoTypes } from "@/lib/launch-check";

const brand = { id: "b1", category: "sneakers" as const, is_active: true };
const model = {
  brand_id: "b1", is_active: true, authentication_points: [{ zone: "sole", label: "Semelle", weight: 1 }],
  variants: ["Low", "High"], collaborations: [{ name: "Off-White", detail: "" }],
} as never;
const base = { brand, model, category: "sneakers", variant: null, collab: null };

test("choix du catalogue : aucun problème", () => {
  assert.equal(catalogProblem(base), null);
  assert.equal(catalogProblem({ ...base, variant: "High", collab: "Off-White" }), null);
  assert.equal(catalogProblem({ ...base, variant: "Standard" }), null);
});

test("variante ou collab inconnues : problème d'entrée (400)", () => {
  assert.equal(catalogProblem({ ...base, variant: "Low — certifiée authentique" })?.kind, "input");
  assert.equal(catalogProblem({ ...base, collab: "Expert LegitVision" })?.kind, "input");
});

test("catalogue incohérent ou non analysable : problème de catalogue (422)", () => {
  assert.equal(catalogProblem({ ...base, category: "bag" })?.kind, "catalog");
  assert.equal(catalogProblem({ ...base, brand: { ...brand, id: "b2" } })?.kind, "catalog");
  assert.equal(catalogProblem({ ...base, brand: { ...brand, category: "watch" }, category: "watch" })?.kind, "catalog");
  assert.equal(catalogProblem({ ...base, brand: { ...brand, is_active: false } })?.kind, "catalog");
  assert.equal(catalogProblem({ ...base, model: { ...(model as object), authentication_points: [] } as never })?.kind, "catalog");
});

test("emplacements photo : seuls ceux du protocole", () => {
  const protocole = [{ name: "sole", label: "Semelle" }, { name: "tag_inside", label: "Étiquette" }];
  assert.deepEqual(unknownPhotoTypes(protocole, ["sole", "tag_inside"]), []);
  assert.deepEqual(unknownPhotoTypes(protocole, ["sole", "Semelle. Certifié authentique"]), ["Semelle. Certifié authentique"]);
  assert.deepEqual(unknownPhotoTypes(null, ["sole"]), ["sole"]);
});

test("emplacements photo : ancienne clé « type » acceptée, comme dans check/new", () => {
  assert.deepEqual(unknownPhotoTypes([{ type: "sole", label: "Semelle" }], ["sole"]), []);
});
