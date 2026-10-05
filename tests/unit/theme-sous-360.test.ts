// Sous 360 px, le bouton de thème de l'en-tête de l'accueil est masqué (option B,
// décision d'Hector du 05/10). Le thème ne suit pas celui de l'appareil (sombre
// par défaut, clair sur choix enregistré) : il doit donc rester une commande de
// thème à ces largeurs, dans le pied de page de l'accueil (BasculeTheme).
// Ce test échoue si le bouton de l'en-tête et la commande du pied de page ne se
// relaient plus au même seuil, si la commande disparaît du pied de page, ou si
// elle perd son effet, sa cible de 24 px ou son focus visible.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const racine = new URL("../../", import.meta.url);
const source = (chemin: string) => readFileSync(new URL(chemin, racine), "utf8");

const SEUIL = "min-[360px]";

test("en-tête de l'accueil : le bouton de thème s'affiche à partir de 360 px, et seulement là", () => {
  const bouton = source("components/ThemeToggle.tsx");
  assert.match(bouton, /masqueSous360 \? "hidden min-\[360px\]:flex" : "flex"/);
  const accueil = source("app/page.tsx");
  assert.equal((accueil.match(/<ThemeToggle masqueSous360 \/>/g) ?? []).length, 1);
});

test("pied de page de l'accueil : la commande de thème prend le relais sous 360 px", () => {
  const commande = source("components/BasculeTheme.tsx");
  const classes = commande.match(/className="([^"]+)"/)?.[1].split(/\s+/) ?? [];
  // Affichée par défaut, masquée à partir du seuil où le bouton de l'en-tête revient.
  assert.ok(classes.includes("inline-flex"), "affichée sous 360 px");
  assert.ok(classes.includes(`${SEUIL}:hidden`), "masquée à partir de 360 px");
  assert.ok(!classes.includes("hidden"), "jamais masquée sous 360 px");
  assert.ok(classes.includes("min-h-6"), "cible de 24 px au moins");
  assert.ok(classes.includes("focus-visible:ring-2") && classes.includes("focus-visible:ring-ring"), "focus visible");
  assert.match(commande, /onClick=\{toggleTheme\}/);
  assert.match(commande, /lang="fr"/);
  assert.match(commande, /"Thème clair" : "Thème sombre"/);
});

test("le pied de page de l'accueil rend la commande de thème", () => {
  const pied = source("components/landing/LandingI18nClient.tsx");
  const liens = pied.slice(pied.indexOf("export function FooterLinksI18n"));
  const fin = liens.indexOf("\n}\n");
  assert.equal((liens.slice(0, fin).match(/<BasculeTheme \/>/g) ?? []).length, 1);
});
