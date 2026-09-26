// Chargé par `node --import ./tests/unit/register.mjs` : installe le crochet de
// résolution qui permet d'exécuter le TypeScript du dépôt hors de Next, avec la
// seule suppression native des types de Node (≥ 22.18).
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
