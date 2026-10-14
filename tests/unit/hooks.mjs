// Crochet de résolution ESM, sans dépendance :
// - « @/x » (alias de tsconfig.json) devient <racine du dépôt>/x ;
// - un chemin relatif sans extension essaie .ts, .tsx puis /index.ts, comme
//   le fait la résolution « bundler » de TypeScript.
// Les paquets nommés (sharp, @anthropic-ai/sdk) gardent la résolution normale ;
// un sous-chemin sans carte « exports » (next/server) essaie aussi « .js »,
// comme le fait le bundler de Next.
// Et un crochet de chargement : un fichier .tsx est transpilé par TypeScript.
import { existsSync, readFileSync, statSync } from "node:fs";
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
  const sousCheminNu =
    !relatif && !cible.startsWith("file:") && !cible.startsWith("node:") &&
    /^(@[^/]+\/)?[^/@][^/]*\/.+/.test(cible) && !/\.[cm]?js$/.test(cible);
  try {
    return await nextResolve(cible, context);
  } catch (erreur) {
    if (sousCheminNu && erreur?.code === "ERR_MODULE_NOT_FOUND") {
      return nextResolve(`${cible}.js`, context);
    }
    throw erreur;
  }
}

// Node retire les types d'un .ts, mais ne lit pas le JSX d'un .tsx. TypeScript
// (déjà en devDependencies) le transpile en JSX automatique (react/jsx-runtime),
// comme le compilateur de Next ; les .ts gardent le chargement natif.
export async function load(url, context, nextLoad) {
  if (!url.startsWith("file:") || !new URL(url).pathname.endsWith(".tsx")) {
    return nextLoad(url, context);
  }
  const { default: ts } = await import("typescript");
  const chemin = fileURLToPath(url);
  const { outputText } = ts.transpileModule(readFileSync(chemin, "utf8"), {
    fileName: chemin,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return { format: "module", source: outputText, shortCircuit: true };
}
