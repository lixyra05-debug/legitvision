/**
 * Traduction d'une expression régulière JavaScript du site en expression
 * PostgreSQL (moteur ARE), pour le compteur hebdomadaire des formulations
 * interdites (supabase/checks/compteur-formulations.sql) : la requête SQL
 * reconnaît exactement ce que reconnaissent lib/forbidden-wording.ts et
 * lib/purchase-advice.ts, quel que soit le réglage de langue de la base.
 *
 * Ce qui diffère entre les deux moteurs, et comment la traduction le rend :
 * - « \b » est en JavaScript une limite de mot ASCII ; en PostgreSQL c'est le
 *   retour arrière. Il devient une limite écrite en toutes lettres sur
 *   [a-z0-9_] (la requête compare sans tenir compte de la casse).
 * - « \w » et « \s » dépendent en PostgreSQL du réglage de langue. « \w »
 *   devient [a-z0-9_], comme en JavaScript sans le drapeau « u » ; « \s »
 *   devient la liste exacte des espaces de JavaScript, dont l'espace insécable
 *   de la typographie française (« 85 % », « Score : 85 »), et rien d'autre
 *   (pas U+0085, que la classe [[:space:]] de PostgreSQL accepte selon la langue).
 * - « . » devient « tout sauf un saut de ligne », comme en JavaScript.
 * - Seuls les drapeaux « i » (ou aucun, pour un motif sans lettre) sont admis :
 *   la requête compare toujours sans tenir compte de la casse.
 * Toute autre séquence inconnue arrête la traduction : mieux vaut un test
 * rouge qu'un compteur qui compte autre chose que le site.
 */

/** Les espaces de « \s » en JavaScript, sans les classes de PostgreSQL qui dépendent de la langue. */
const ESPACES = "\\u0009-\\u000d\\u0020\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff";
/** « . » en JavaScript : tout sauf les fins de ligne. */
const POINT = "[^\\u000a\\u000d\\u2028\\u2029]";
const MOT = "a-z0-9_";
/** « \b » : entre un caractère de mot et un autre qui n'en est pas un, dans un sens ou dans l'autre. */
const LIMITE = `(?:(?<![${MOT}])(?=[${MOT}])|(?<=[${MOT}])(?![${MOT}]))`;
/** « \b » dans une condition sur ce qui précède : la limite y consomme le caractère d'avant (ou le début du texte). */
const LIMITE_DANS_ARRIERE = `(?:^|[^${MOT}])`;

export function versPostgres(motif: RegExp): string {
  const source = motif.source;
  // La requête compare toujours sans la casse (« ~* ») : un motif sensible à la casse, ou à d'autres drapeaux, n'y aurait pas le même sens.
  if (!(motif.flags === "i" || (motif.flags === "" && !/[a-z]/i.test(source.replace(/\\./g, ""))))) {
    throw new Error(`drapeaux « ${motif.flags} » non traduits : ${source}`);
  }
  let sortie = "";
  let dansClasse = false;
  // Profondeur des conditions « (?<! … ) » et « (?<= … ) » ouvertes, avec la profondeur de parenthèses où chacune s'ouvre.
  const parentheses: Array<"arriere" | "autre"> = [];
  const dansArriere = () => parentheses.includes("arriere");
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === "\\") {
      const suivant = source[++i];
      if (suivant === undefined) throw new Error(`motif coupé : ${source}`);
      if (dansClasse) {
        if (suivant === "w") sortie += MOT;
        else if (suivant === "s") sortie += ESPACES;
        else if (suivant === "d") sortie += "0-9";
        else if ("/.-[]\\^".includes(suivant)) sortie += suivant === "/" ? "/" : `\\${suivant}`;
        else throw new Error(`séquence « \\${suivant} » dans une classe, non traduite : ${source}`);
        continue;
      }
      if (suivant === "b") {
        if (dansArriere()) {
          // La limite y précède forcément une lettre : directement, ou au début d'un groupe « (?: ».
          const apres = source.slice(i + 1).replace(/^\((?:\?:)?/, "");
          if (!/^[a-z]/i.test(apres)) throw new Error(`« \\b » non suivi d'une lettre dans une condition arrière : ${source}`);
          sortie += LIMITE_DANS_ARRIERE;
        } else sortie += LIMITE;
      } else if (suivant === "w") sortie += `[${MOT}]`;
      else if (suivant === "s") sortie += `[${ESPACES}]`;
      else if (suivant === "d") sortie += "[0-9]";
      else if (suivant === "/") sortie += "/";
      else if (".?*+()[]{}|^$-\\".includes(suivant)) sortie += `\\${suivant}`;
      else throw new Error(`séquence « \\${suivant} » non traduite : ${source}`);
      continue;
    }
    if (dansClasse) {
      if (c === "]") dansClasse = false;
      sortie += c;
      continue;
    }
    if (c === "[") {
      dansClasse = true;
      sortie += c;
      if (source[i + 1] === "^") sortie += source[++i];
      if (source[i + 1] === "]") throw new Error(`classe commençant par « ] » : ${source}`);
      continue;
    }
    if (c === ".") {
      sortie += POINT;
      continue;
    }
    if (c === "(") {
      parentheses.push(source.startsWith("(?<!", i) || source.startsWith("(?<=", i) ? "arriere" : "autre");
    } else if (c === ")") {
      parentheses.pop();
    }
    sortie += c;
  }
  if (dansClasse || parentheses.length > 0) throw new Error(`motif mal fermé : ${source}`);
  return sortie;
}

/** Plusieurs motifs en un seul : l'un ou l'autre. */
export function unionPostgres(motifs: readonly RegExp[]): string {
  return motifs.map((motif) => `(?:${versPostgres(motif)})`).join("|");
}
