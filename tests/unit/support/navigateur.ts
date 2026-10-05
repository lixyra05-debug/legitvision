// Rend de vrais composants du dépôt dans le Chromium de Playwright, hors de
// Next, pour les tests qui ont besoin d'une mise en page ou d'un clic : un
// rendu statique (renderToStaticMarkup) ne voit ni l'un ni l'autre.
// Sans dépendance de plus : TypeScript transpile les fichiers (comme
// tests/unit/hooks.mjs), Tailwind compile app/globals.css, et le navigateur
// est celui de @playwright/test, déjà en devDependencies. Aucune requête ne
// sort : la page est servie par l'interception, tout le reste est refusé.
import { existsSync, readFileSync, statSync } from "node:fs";
import { builtinModules, createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "@playwright/test";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import ts from "typescript";
import config from "../../../tailwind.config";

const RACINE = fileURLToPath(new URL("../../../", import.meta.url));
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".mjs", ".cjs", "/index.ts", "/index.tsx", "/index.js"];

function fichier(chemin: string): string | null {
  for (const extension of EXTENSIONS) {
    const candidat = chemin + extension;
    if (existsSync(candidat) && statSync(candidat).isFile()) return candidat;
  }
  return null;
}

/**
 * Un seul script pour le navigateur : `entree` et tout ce qu'elle importe, en
 * modules CommonJS. `remplacements` donne, par nom d'import, le fichier qui
 * tient lieu de ce que seul Next sait fournir (next/link, next/navigation…).
 * Un import introuvable est une erreur, sauf un module de Node, qui ne lève
 * que si le navigateur le demande vraiment.
 */
export function empaqueter(entree: string, remplacements: Record<string, string> = {}): string {
  const modules = new Map<string, { code: string; imports: Record<string, string | null> }>();

  function resoudre(nom: string, depuis: string): string | null {
    if (remplacements[nom]) return path.resolve(RACINE, remplacements[nom]);
    if (nom.startsWith("node:") || builtinModules.includes(nom)) return null;
    if (nom.startsWith("@/") || nom.startsWith(".")) {
      const cible = nom.startsWith("@/") ? path.join(RACINE, nom.slice(2)) : path.resolve(path.dirname(depuis), nom);
      const trouve = fichier(cible);
      if (!trouve) throw new Error(`import introuvable : ${nom} depuis ${depuis}`);
      return trouve;
    }
    return createRequire(depuis).resolve(nom);
  }

  function ajouter(chemin: string): void {
    if (modules.has(chemin)) return;
    const source = readFileSync(chemin, "utf8");
    if (chemin.endsWith(".json")) {
      modules.set(chemin, { code: `module.exports=${source}`, imports: {} });
      return;
    }
    const aTranspiler = /\.(tsx?|mjs)$/.test(chemin) || /^\s*(import|export)\s/m.test(source);
    const code = aTranspiler
      ? ts.transpileModule(source, {
          fileName: chemin,
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
            allowJs: true,
          },
        }).outputText
      : source;
    const imports: Record<string, string | null> = {};
    modules.set(chemin, { code, imports });
    for (const [, nom] of code.matchAll(/\brequire\(\s*["']([^"']+)["']\s*\)/g)) {
      const cible = resoudre(nom, chemin);
      imports[nom] = cible;
      if (cible) ajouter(cible);
    }
  }

  const depart = path.resolve(RACINE, entree);
  ajouter(depart);
  let script = "var process={env:{NODE_ENV:'production'}};var global=window;(function(){var M={},C={};\n";
  for (const [chemin, { code, imports }] of modules) {
    script += `M[${JSON.stringify(chemin)}]=[function(module,exports,require){${code}\n},${JSON.stringify(imports)}];\n`;
  }
  script +=
    "function charger(f){if(C[f])return C[f].exports;var m=C[f]={exports:{}};" +
    "M[f][0](m,m.exports,function(n){var c=M[f][1][n];if(!c)throw new Error('module absent : '+n+' depuis '+f);return charger(c);});" +
    `return m.exports;}\ncharger(${JSON.stringify(depart)});})();`;
  return script;
}

/** La feuille de style du site : app/globals.css compilée par Tailwind, avec la configuration du dépôt. */
export async function feuilleDeStyle(): Promise<string> {
  const globals = path.join(RACINE, "app/globals.css");
  // Les chemins de `content` sont relatifs au dossier courant : on les ancre au dépôt.
  const content = (config.content as string[]).map((motif) => path.join(RACINE, motif));
  const { css } = await postcss([tailwindcss({ ...config, content })]).process(readFileSync(globals, "utf8"), {
    from: globals,
  });
  return css;
}

/** Le Chromium de Playwright, ou null s'il n'est pas installé sur la machine. */
export async function lancerChromium(): Promise<Browser | null> {
  try {
    return await chromium.launch();
  } catch (erreur) {
    if (/Executable doesn't exist/.test(String(erreur))) return null;
    throw erreur;
  }
}

export const CHROMIUM_ABSENT =
  "Chromium de Playwright absent de cette machine (pnpm exec playwright install chromium) : test non exécuté";

const ADRESSE = "http://rendu.test/";

/**
 * Ouvre une page à la mise en page racine du site (app/layout.tsx : <html> au
 * thème sombre, <body> et ses classes), y exécute `script` après avoir posé
 * `window.__PAGE`, et attend que React ait rendu. Les erreurs de la page sont
 * relevées dans `erreurs`.
 */
export async function ouvrirPage(
  navigateur: Browser,
  options: { css: string; script: string; page: unknown; largeur: number; hauteur: number },
): Promise<{ page: Page; erreurs: string[]; fermer: () => Promise<void> }> {
  const contexte = await navigateur.newContext({
    viewport: { width: options.largeur, height: options.hauteur },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await contexte.newPage();
  const erreurs: string[] = [];
  page.on("pageerror", (erreur) => erreurs.push(String(erreur)));
  const html =
    `<!doctype html><html lang="fr" class="antialiased dark"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><style>${options.css}</style></head>` +
    `<body class="bg-background text-foreground min-h-screen">` +
    `<script>window.__PAGE=${JSON.stringify(options.page).replace(/</g, "\\u003c")};</script>` +
    `<script>${options.script.replace(/<\/script/g, "<\\/script")}</script></body></html>`;
  await page.route("**/*", (route) =>
    route.request().url() === ADRESSE ? route.fulfill({ contentType: "text/html", body: html }) : route.abort(),
  );
  await page.goto(ADRESSE);
  await page.waitForSelector("[data-rendu]", { state: "attached" });
  return { page, erreurs, fermer: () => contexte.close() };
}
