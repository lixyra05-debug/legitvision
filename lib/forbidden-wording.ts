/**
 * Formulations que le rapport n'emploie jamais (décisions d'Hector du
 * 2026-10-13). Six familles :
 * - conseil d'achat ou de paiement (lib/purchase-advice.ts) ;
 * - probabilité : le score est une note de conformité, jamais une chance en
 *   pourcentage ;
 * - certification ou garantie : le rapport est une estimation (CLAUDE.md,
 *   règle 1, pour les deux) ;
 * - « frauduleux », « fraude » ;
 * - « arnaque », « escroquerie » : un écart se décrit (« non conforme »,
 *   « indices de contrefaçon »), il n'accuse personne ;
 * - score cité dans un texte (« 85/100 », « score de 78 ») : le score affiché
 *   est recalculé par le serveur, un chiffre écrit dans une phrase pourrait le
 *   contredire. Il ne paraît que dans le champ prévu par l'interface.
 *
 * La consigne les interdit à l'IA (lib/ai/authentication-prompts.ts). Ce
 * fichier les reconnaît dans un texte. Le compteur hebdomadaire des vrais
 * rapports (supabase/checks/compteur-formulations.sql, lecture seule) suit les
 * mêmes familles, écrites en SQL ; son banc les confronte à ce fichier.
 *
 * Ne sont pas des formulations interdites :
 * - « probablement authentique », « probable contrefaçon » : le verdict se dit
 *   avec « probablement » ;
 * - « 100 % coton », « semelle usée à 30 % » : un pourcentage ne compte que
 *   dans une phrase qui parle d'authenticité, de score, de confiance ou de
 *   risque (« authentique à 85 % », « score de confiance : 85 % ») ;
 * - « certificat », le document fourni avec un article : le catalogue lui-même
 *   demande d'examiner « Emballage (dust bag, boîte, certificat) » ;
 * - un texte recopié d'une photo entre guillemets (« RDS Certified ») : la
 *   consigne le permet, c'est une lecture d'étiquette, pas une affirmation ;
 * - « par chance », « deuxième chance ».
 *
 * tests/unit/consigne-mots-interdits.test.ts.
 */
import { isPurchaseAdvice } from "@/lib/purchase-advice";

/** Les familles, dans l'ordre où elles se comptent et s'affichent. */
export const FORBIDDEN_WORDINGS = ["purchase_advice", "probability", "certification", "fraud", "scam", "score"] as const;

export type ForbiddenWording = (typeof FORBIDDEN_WORDINGS)[number];

// L'apostrophe peut être droite ou typographique.
const A = "['’]";
// « 85 % », « 85% », « 85,5 % », « 85 pour cent ».
const POURCENT = /\d{1,3}(?:[.,]\d+)?\s*(?:%|pour\s*cent)/i;
// Ce dont parle une phrase quand son pourcentage est une chance ou une certitude. « sûr » porte son accent : « sur » n'en est pas un.
const SUJET_D_UN_POURCENTAGE = new RegExp(
  `authenti|contref|confiance|certitude|fiab|probab|\\brisque|\\bchances?\\b|\\bscore|\\bsûre?s?(?![a-zà-öø-ÿ])|\\bverdict`,
  "i",
);

/** Le texte sans ce qu'il recopie entre guillemets : français, anglais ou droits. Une citation de plus de 120 caractères n'en est pas une. */
function sansCitations(text: string): string {
  return text.replace(/«[^«»]{0,120}»|“[^“”]{0,120}”|"[^"]{0,120}"/g, " ");
}

/** Les phrases d'un texte : un pourcentage et son sujet se cherchent dans la même. */
function phrases(text: string): string[] {
  return text.split(/(?<=[.!?…;])\s+/);
}

const MOTIFS: Record<Exclude<ForbiddenWording, "purchase_advice">, RegExp[]> = {
  probability: [
    /probabilit/i,
    // « de fortes chances », « 9 chances sur 10 », « aucune chance que… ». Pas « par chance », « deuxième chance ».
    /\bchances\b/i,
    new RegExp(`\\bchance\\s+(?:que\\b|qu${A}|sur\\s+\\d|d${A}\\s*[êe]tre)`, "i"),
  ],
  // « certification », « certifié », « certifier ». Pas « certificat », le document. « garanti », « garantie », « garantir ».
  certification: [/certifi(?!cats?\b)/i, /garanti/i],
  // « frauduleux », « frauduleuse », « frauduleusement », « fraude ».
  fraud: [/fraud/i],
  // « arnaque », « arnaquer » ; « escroc », « escroquerie ».
  scam: [/arnaqu/i, /escro(?:c|qu)/i],
  score: [
    // « 85/100 » ; pas une date (« 05/10/2026 »).
    /(?<![/\d])\d{1,3}\s*\/\s*100\b/,
    // « 40 sur 100 », « 7 sur 10 ».
    /\b\d{1,3}\s+sur\s+(?:100|10|20)\b/i,
    // « score de 78 », « score global de 85 », « score de confiance : 85 % ». Pas « le score reflète 3 anomalies ».
    new RegExp(`\\bscores?\\b(?:\\s+[^\\s.!?;:=]+){0,4}?(?:\\s+(?:de|à|est\\s+de|atteint|vaut)\\s+|\\s*[:=]\\s*)\\d{1,3}(?!\\d)`, "i"),
  ],
};

/** Une chance ou une certitude en pourcentage : « authentique à 85 % », « 85 % de chances », « score de confiance : 85 % ». */
function probabilityAsPercentage(text: string): boolean {
  return phrases(text).some((phrase) => POURCENT.test(phrase) && SUJET_D_UN_POURCENTAGE.test(phrase));
}

/** Les familles de formulations interdites que porte ce texte, dans l'ordre de FORBIDDEN_WORDINGS. Une valeur qui n'est pas un texte : aucune. */
export function forbiddenWordings(text: unknown): ForbiddenWording[] {
  if (typeof text !== "string") return [];
  // Un conseil d'achat reste un conseil entre guillemets ; les quatre autres familles ne se cherchent pas dans une citation.
  const propos = sansCitations(text);
  return FORBIDDEN_WORDINGS.filter((famille) => {
    if (famille === "purchase_advice") return isPurchaseAdvice(text);
    if (famille === "probability" && probabilityAsPercentage(propos)) return true;
    return MOTIFS[famille].some((motif) => motif.test(propos));
  });
}
