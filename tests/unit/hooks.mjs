// Crochet de résolution ESM, sans dépendance :
// - « @/x » (alias de tsconfig.json) devient <racine du dépôt>/x ;
// - un chemin relatif sans extension essaie .ts, .tsx puis /index.ts, comme
//   le fait la résolution « bundler » de TypeScript.
// Les paquets nommés (sharp, @anthropic-ai/sdk) gardent la résolution normale.
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RACINE = new URL("../../", import.meta.url);
const EXTENSIONS = [".ts", ".tsx", "/index.ts"];

function estFichier(url) {
  const chemin = fileURLToPath(url);
  return existsSync(chemin) && statSync(chemin).isFile();
}

export async function resolve(specifier, context, nextResolve) {
  let cible = specifier;
  if (cible.startsWith("@/")) cible = new URL(cible.slice(2), RACINE).href;

  const relatif = cible.startsWith("./") || cible.startsWith("../");
  if ((relatif || cible.startsWith("file:")) && context.parentURL?.startsWith("file:")) {
    const url = new URL(cible, context.parentURL);
    if (!estFichier(url)) {
      for (const extension of EXTENSIONS) {
        const candidat = new URL(url.href + extension);
        if (estFichier(candidat)) return nextResolve(candidat.href, context);
      }
    }
  }
  return nextResolve(cible, context);
}
