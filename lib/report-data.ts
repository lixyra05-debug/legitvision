/**
 * Ce que la page du rapport transmet à l'écran quand cela vient de la réponse
 * de l'IA (analyses.findings, analyses.ai_raw_response).
 *
 * La route ne valide que le score, les notes par zone, le verdict et la
 * confiance (lib/ai/analyze.ts) : le reste est enregistré tel que le modèle
 * l'a rendu. Une liste rendue sous une autre forme (un objet, un texte), ou un
 * texte rendu en objet, faisait planter l'écran d'un rapport payé
 * (« findings.map is not a function »). Ces fonctions ne laissent passer que
 * la forme attendue : ce qui ne l'a pas est écarté ou ramené à cette forme,
 * sans jamais lever d'erreur. Le rapport ne doit jamais s'afficher en erreur
 * (décision d'Hector, 2026-10-13) ; dans le pire cas, la page de repli
 * app/(dashboard)/check/[id]/error.tsx prend le relais.
 *
 * Sans dépendance : ces fonctions tournent sur le serveur (la page) et se
 * testent seules (tests/unit/rapport-donnees.test.ts).
 */
import type { Finding } from "@/components/check/FindingCard";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Un texte non vide, tel qu'il a été écrit ; tout le reste (objet, liste, nombre, vide) rend null. */
export function readText(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Un texte à lire d'une traite (le résumé, le commentaire d'une observation).
 * Une liste de textes, rendue à la place du texte, est jointe par une espace :
 * elle s'affichait déjà, bout à bout. Tout le reste rend null.
 */
export function readProse(value: unknown): string | null {
  if (Array.isArray(value)) {
    const morceaux = value.filter((element): element is string => readText(element) !== null);
    return morceaux.length > 0 ? morceaux.join(" ") : null;
  }
  return readText(value);
}

/**
 * Une liste de textes non vides. Un texte seul, rendu à la place de la liste,
 * devient une liste d'un élément ; les éléments qui ne sont pas des textes
 * sont écartés. Tout le reste rend null.
 */
export function readTextList(value: unknown): string[] | null {
  if (typeof value === "string") {
    const seul = readText(value);
    return seul === null ? null : [seul];
  }
  if (!Array.isArray(value)) return null;
  return value.filter((element): element is string => readText(element) !== null);
}

/**
 * Les textes lus sur l'article (étiquette, code produit) : un objet dont les
 * valeurs sont des textes. Une valeur numérique (une taille, « 42 ») est
 * écrite en texte, tant qu'elle s'écrit sans perte (un numéro de série de
 * vingt chiffres s'afficherait arrondi) ; les autres valeurs sont écartées.
 */
export function readOcr(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) return null;
  const lus: Record<string, string> = {};
  for (const [cle, valeur] of Object.entries(value)) {
    if (typeof valeur === "string" && valeur.trim() !== "") lus[cle] = valeur;
    else if (typeof valeur === "number" && Math.abs(valeur) <= Number.MAX_SAFE_INTEGER) lus[cle] = String(valeur);
  }
  return lus;
}

/** Les notes par zone : un objet. Une liste ou un texte ne nomme aucune zone. */
export function readSubScores(value: unknown): Record<string, number> | null {
  return isRecord(value) ? (value as Record<string, number>) : null;
}

const NIVEAUX = ["high", "medium", "low", "insufficient"] as const;
type AiConfidence = (typeof NIVEAUX)[number];

/** La confiance déclarée par l'IA, si c'est l'une des quatre valeurs attendues. */
export function readAiConfidence(value: unknown): AiConfidence | null {
  return NIVEAUX.find((niveau) => niveau === value) ?? null;
}

const GRAVITES = ["critical", "important", "minor"] as const;

/**
 * La note d'une observation : un nombre fini, ou son écriture décimale
 * (« 85 »). Tout le reste (absente, vide, « 85/100 », booléen) n'est pas une
 * note : l'observation s'affiche alors sans note, jamais avec « undefined ».
 */
function readScore(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && /^\s*-?\d+(?:\.\d+)?\s*$/.test(value)) {
    // Une écriture de quatre cents chiffres donne Infinity : ce n'est pas une note.
    const note = Number(value);
    return Number.isFinite(note) ? note : undefined;
  }
  return undefined;
}

/** Une observation ramenée à sa forme, ou null si elle ne dit rien (ni zone, ni texte, ni note, ni gravité). */
function readFinding(value: unknown, zoneParDefaut = ""): Finding | null {
  // Un texte seul à la place de l'observation : c'est son commentaire.
  const source = typeof value === "string" ? { observation: value } : value;
  if (!isRecord(source)) return null;
  const zone = readText(source.zone) ?? zoneParDefaut;
  const observation = readProse(source.observation) ?? "";
  const score = readScore(source.score);
  const severity = GRAVITES.find((gravite) => gravite === source.severity);
  if (zone === "" && observation === "" && score === undefined && severity === undefined) return null;
  return { zone, observation, ...(score === undefined ? {} : { score }), ...(severity === undefined ? {} : { severity }) };
}

/** Les champs d'une observation : dans un objet « une observation par zone », aucune zone ne porte ces noms. */
const CHAMPS = ["zone", "observation", "score", "severity"];

/**
 * Les observations du rapport : une liste d'observations bien formées. Un
 * objet rendu à la place de la liste est relu : comme une observation seule
 * s'il porte lui-même une zone ou un commentaire en texte, sinon zone par zone
 * (une observation par clé ; une clé faite de chiffres est un rang, pas une
 * zone). Une observation vide ou illisible est écartée. Tout le reste rend
 * null.
 */
export function readFindings(value: unknown): Finding[] | null {
  if (Array.isArray(value)) {
    return value.map((element) => readFinding(element)).filter((finding): finding is Finding => finding !== null);
  }
  if (isRecord(value)) {
    // Une seule observation rendue sans sa liste : elle porte sa zone ou son commentaire.
    if (readText(value.zone) !== null || readProse(value.observation) !== null) {
      const seule = readFinding(value);
      return seule === null ? [] : [seule];
    }
    return Object.entries(value)
      .filter(([cle]) => !CHAMPS.includes(cle))
      .map(([cle, element]) => readFinding(element, /^\d+$/.test(cle) ? "" : cle))
      .filter((finding): finding is Finding => finding !== null);
  }
  return null;
}
