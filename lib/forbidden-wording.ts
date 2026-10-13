/**
 * Formulations que le rapport n'emploie jamais (décisions d'Hector du
 * 2026-10-13). Cinq familles :
 * - conseil d'achat ou de paiement (lib/purchase-advice.ts) ;
 * - probabilité : le score est une note de conformité, jamais une chance en
 *   pourcentage ;
 * - certification ou garantie : le rapport est une estimation (CLAUDE.md,
 *   règle 1, pour les deux) ;
 * - « frauduleux », « fraude » ;
 * - « arnaque », « escroquerie » : un écart se décrit (« non conforme »,
 *   « indices de contrefaçon »), il n'accuse personne.
 *
 * La consigne les interdit à l'IA (lib/ai/authentication-prompts.ts). Ce
 * fichier les reconnaît dans un texte : la mesure de fiabilité
 * (scripts/fiabilite) compte ainsi ce que l'IA écrit malgré la consigne.
 *
 * « probablement authentique », « probable contrefaçon », « 85/100 » et
 * « 100 % coton » ne sont pas des formulations interdites : le verdict se dit
 * avec « probablement », un score se cite sur 100, une étiquette de
 * composition se recopie.
 *
 * tests/unit/consigne-mots-interdits.test.ts.
 */
import { isPurchaseAdvice } from "@/lib/purchase-advice";

/** Les familles, dans l'ordre où elles se comptent et s'affichent. */
export const FORBIDDEN_WORDINGS = ["purchase_advice", "probability", "certification", "fraud", "scam"] as const;

export type ForbiddenWording = (typeof FORBIDDEN_WORDINGS)[number];

// L'apostrophe peut être droite ou typographique.
const A = "['’]";
// « 85 % », « 85% », « 85,5 % », « 85 pour cent ».
const POURCENT = "\\d{1,3}(?:[.,]\\d+)?\\s*(?:%|pour\\s*cent)";

const MOTIFS: Record<Exclude<ForbiddenWording, "purchase_advice">, RegExp[]> = {
  probability: [
    /probabilit/i,
    /\bchances?\b/i,
    // Un pourcentage de chances ou de certitude : « 85 % de chances », « 100 % authentique », « 90 % sûr ».
    new RegExp(`${POURCENT}\\s*(?:de\\s+|d${A}\\s*)?(?:risques?\\b|certitude|confiance|sûr|authenti|contref)`, "i"),
    // Le même, dans l'autre sens : « authentique à 85 % », « authenticité estimée à 85 % », « certitude de 90 % ».
    new RegExp(
      `(?:authenti\\S*|contref\\S*|\\bsûre?s?|\\bcertaine?s?|\\bcertitude|\\bconfiance)\\s+(?:estim[ée]e?s?\\s+)?(?:à|de|d${A}environ)\\s+(?:environ\\s+)?${POURCENT}`,
      "i",
    ),
  ],
  // « certification », « certifié », « certifier », « certificat » ; « garanti », « garantie », « garantir ».
  certification: [/certifi/i, /garanti/i],
  // « frauduleux », « frauduleuse », « frauduleusement », « fraude ».
  fraud: [/fraud/i],
  // « arnaque », « arnaquer » ; « escroc », « escroquerie ».
  scam: [/arnaqu/i, /escro(?:c|qu)/i],
};

/** Les familles de formulations interdites que porte ce texte, dans l'ordre de FORBIDDEN_WORDINGS. Une valeur qui n'est pas un texte : aucune. */
export function forbiddenWordings(text: unknown): ForbiddenWording[] {
  if (typeof text !== "string") return [];
  return FORBIDDEN_WORDINGS.filter((famille) =>
    famille === "purchase_advice" ? isPurchaseAdvice(text) : MOTIFS[famille].some((motif) => motif.test(text)),
  );
}
