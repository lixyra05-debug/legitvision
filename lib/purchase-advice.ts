/**
 * Conseils d'achat et de paiement : le rapport n'en donne jamais (décision
 * d'Hector, 2026-10-13 : « jamais de formulation qui ressemble à un conseil
 * d'achat ou à une garantie »). Le rapport est une estimation ; acheter ou
 * non, payer ou non, reste la décision du client.
 *
 * La consigne l'interdit à l'IA (lib/ai/authentication-prompts.ts), mais une
 * consigne n'est pas une garantie : le 2026-10-13, un rapport de production
 * conseillait « Éviter absolument cet achat - article clairement
 * frauduleux ». Ce fichier reconnaît ces formules ; la page du rapport retire
 * de la liste des recommandations celles qui en portent une, pour les
 * rapports déjà enregistrés comme pour les suivants. La réponse de l'IA reste
 * enregistrée telle quelle.
 *
 * Ce qui est reconnu, ce sont des CONSTRUCTIONS, pas des mots : un verbe
 * d'achat ou de paiement à l'impératif ou à l'infinitif (« n'achetez pas »,
 * « ne pas verser d'acompte », « payer uniquement via la plateforme »), ou
 * l'achat lui-même conseillé, déconseillé ou évité (« achat à éviter »,
 * « je déconseille l'achat », « vous pouvez l'acheter »). Le mot « achat »
 * seul ne suffit jamais : « vérifier la date d'achat sur la facture »,
 * « preuve d'achat recommandée », « pour éviter tout doute, demandez la
 * facture d'achat » et « si vous achetez cette paire d'occasion, demandez la
 * facture » sont des vérifications, que le rapport doit garder.
 *
 * Sans dépendance : tests/unit/consigne-sans-conseil-achat.test.ts.
 */

// L'apostrophe peut être droite ou typographique. Pas de limite de mot devant
// une lettre accentuée : sans le drapeau « u », elle n'est pas tenue pour une
// lettre.
const A = "['’]";
/** Fin de mot, même après une lettre accentuée (« recommandé. ») : « \\b » ne la verrait pas. */
const FIN = "(?![a-zà-öø-ÿ])";
/** La suite d'un mot français, accents compris (« déconseill » + « ée »). */
const SUITE = "[a-zà-öø-ÿ]*";
/** Les adverbes qui se glissent entre le verbe et son objet : « éviter absolument cet achat ». */
const ADVERBES = `(?:\\s+(?:absolument|surtout|donc|plut[oô]t|vraiment|imp[ée]rativement|fortement|vivement|clairement|si\\s+possible|pour\\s+l${A}instant))*`;
/** La négation et ses pronoms : « ne », « n' », « ne pas », « ne surtout pas l' », « ne les ». */
const NE = `\\bn(?:e\\s+|${A}\\s*)(?:(?:surtout\\s+)?(?:pas|jamais|plus|rien)\\s+)?(?:l${A}\\s*|les\\s+|le\\s+|la\\s+|lui\\s+|leur\\s+|en\\s+|y\\s+)?`;
/** Devant un verbe : pas « si vous … », qui pose une condition (« si vous n'achetez pas en boutique, demandez… »). */
const PAS_UNE_CONDITION = `(?<!\\b(?:si|quand|lorsque)\\s+(?:vous|tu|on|l${A}on)\\s+(?:n${A}\\s*|ne\\s+)?(?:l${A}\\s*|les\\s+|le\\s+|la\\s+)?)`;
/** Ni après un sujet : « vous achetez », « que vous n'achetez pas » décrivent, ils ne conseillent pas. */
const PAS_UN_CONSTAT = `(?<!\\b(?:vous|tu)\\s+(?:n${A}\\s*|ne\\s+)?(?:l${A}\\s*|les\\s+|le\\s+|la\\s+)?)`;
/** L'achat comme objet : « cet achat », « l'achat », « tout paiement », « la transaction ». */
const OBJET = `(?:cet\\s+|cette\\s+|l${A}\\s*|la\\s+|le\\s+|tout\\s+|toute\\s+|aucun\\s+|aucune\\s+|un\\s+tel\\s+|une\\s+telle\\s+|votre\\s+|son\\s+|ce\\s+type\\s+d${A}\\s*)(?:achat|acquisition|transaction|paiement|r[èe]glement|virement)`;
/** « achat », mais pas dans « preuve d'achat », « date d'achat », « facture d'achat ». */
const ACHAT = `(?<!\\bd${A}\\s?)\\b(?:achat|acquisition|transaction)`;
/** L'argent qu'on verse : il distingue « ne pas envoyer d'argent » de « ne pas envoyer de photo floue ». */
const ARGENT = `\\b(?:argent|acompte|arrhes|somme|montant|paiement|virement|euros?|fonds|caution)\\b`;
/** Un paiement comme document n'est pas un conseil : « preuve de paiement », « reçu de paiement par carte ». */
const PAIEMENT = `(?<!\\b(?:preuve|re[çc]u|justificatif|confirmation|ticket|facture|trace|historique)s?\\s+d[eu]\\s+)\\bpaiement`;

/** Les constructions reconnues. Exportées pour le test : chacune doit y avoir une phrase que seule elle reconnaît. */
export const PURCHASE_ADVICE_PATTERNS: readonly RegExp[] = [
  // ── Ne pas acheter ──
  // « n'achetez pas », « ne l'achetez pas », « ne pas acheter », « ne surtout pas l'acheter », « je n'achèterais pas ».
  new RegExp(`${PAS_UNE_CONDITION}${NE}ach[eè]t`, "i"),
  // « éviter d'acheter », « évitez de l'acheter », « évitez de payer ».
  new RegExp(`[ée]vit(?:ez|er|e|ons)\\b${ADVERBES}\\s+d(?:e\\s+|${A}\\s*)(?:l${A}\\s*|les\\s+|le\\s+|la\\s+)?(?:acheter|acqu[ée]rir|payer)`, "i"),
  // « éviter absolument cet achat », « évitez l'achat », « évitez tout paiement », « évitez cette transaction ».
  new RegExp(`[ée]vit(?:ez|er|e|ons)\\b${ADVERBES}\\s+${OBJET}`, "i"),
  // « renoncer à l'achat », « renoncez à acheter ».
  new RegExp(`\\brenon[cç]\\w*\\s+à\\s+(?:${OBJET}|acheter|acqu[ée]rir)`, "i"),
  // « passez votre chemin », « fuyez », « à fuir », « mieux vaut s'abstenir », « abstenez-vous d'acheter ».
  new RegExp(`passez\\s+votre\\s+chemin|\\bfuyez\\b|(?:^|\\s)à\\s+fuir\\b|mieux\\s+vaut\\s+s${A}abstenir|\\babst\\w+(?:-vous)?\\s+d(?:e\\s+|${A}\\s*)(?:l${A}\\s*)?(?:acheter|achat|payer|acqu[ée]rir)`, "i"),
  // « ne finalisez pas la transaction », « ne procédez pas à l'achat », « n'effectuez aucun paiement ».
  new RegExp(`${NE}(?:finalis|conclu|proc[ée]d|valid|confirm|effectu|fai(?:tes|re))\\w*(?:\\s+(?:pas|plus|jamais|surtout\\s+pas))?\\s+(?:à\\s+)?${OBJET}`, "i"),

  // ── L'achat conseillé, déconseillé, évité ──
  // « achat à éviter », « achat déconseillé », « achat non recommandé », « transaction déconseillée », « l'achat est déconseillé »,
  // « achat recommandé », « achat sûr », « achat sans risque ». Jamais « preuve d'achat recommandée ».
  new RegExp(
    `${ACHAT}(?:\\s+(?:est|reste|semble|para[îi]t|serait)(?:\\s+donc)?)?\\s+(?:(?:fortement|vivement|clairement|vraiment|très|tout\\s+à\\s+fait|non|peu|pas)\\s+)*` +
      `(?:à\\s+[ée]viter|à\\s+proscrire|à\\s+fuir|d[ée]conseill${SUITE}|recommand[ée]e?s?${FIN}|conseill[ée]e?s?${FIN}|sûre?s?${FIN}|risqu[ée]e?s?${FIN}|sans\\s+risque|possible\\s+sans|en\\s+toute\\s+(?:confiance|s[ée]curit[ée]|s[ée]r[ée]nit[ée]))`,
    "i",
  ),
  // « je déconseille l'achat », « je ne recommande pas l'achat », « nous conseillons d'acheter ». Jamais « il est recommandé de demander la facture d'achat ».
  new RegExp(
    `(?:d[ée]conseill${SUITE}|recommand${SUITE}|conseill${SUITE})\\s+(?:(?:pas|plus|vivement|fortement)\\s+)*(?:${OBJET}|d(?:e\\s+|${A}\\s*)(?:l${A}\\s*|les\\s+)?(?:acheter|acqu[ée]rir|payer))`,
    "i",
  ),

  // ── Acheter ──
  // « achetez », « achetez-le sans hésiter ». Jamais « si vous achetez cette paire d'occasion, demandez la facture ».
  new RegExp(`${PAS_UNE_CONDITION}${PAS_UN_CONSTAT}\\bachetez\\b`, "i"),
  // « vous pouvez l'acheter », « vous pouvez procéder à l'achat », « peut être acheté en toute confiance ».
  new RegExp(
    `\\b(?:vous\\s+pouvez|tu\\s+peux|pouvez)\\s+(?:(?:donc|tout\\s+à\\s+fait|sans\\s+crainte|sans\\s+risque|sans\\s+h[ée]siter)\\s+)*(?:(?:l${A}\\s*|les\\s+|le\\s+|la\\s+)?(?:acheter|acqu[ée]rir|payer)|(?:proc[ée]der\\s+à|conclure|finaliser)\\s+${OBJET})`,
    "i",
  ),
  new RegExp(`\\bpeut\\s+être\\s+achet[ée]e?s?${FIN}`, "i"),
  // « n'hésitez pas à l'acheter ».
  new RegExp(`h[ée]sit\\w*\\s+(?:pas\\s+)?à\\s+(?:l${A}\\s*|les\\s+|le\\s+|la\\s+)?(?:acheter|acqu[ée]rir|payer)`, "i"),
  // « acheter en toute confiance », « achetez les yeux fermés », « achat en toute confiance ».
  new RegExp(
    `(?:\\b(?:acheter|achetez|achet[ée]e?s?|acqu[ée]rir)${FIN}|${ACHAT})[^.!?]{0,20}\\b(?:en\\s+toute\\s+(?:confiance|s[ée]curit[ée]|s[ée]r[ée]nit[ée])|sans\\s+(?:crainte|risque|h[ée]siter|h[ée]sitation)|les\\s+yeux\\s+ferm[ée]s)`,
    "i",
  ),
  // « bonne affaire », « foncez ».
  new RegExp(`\\b(?:bonne|excellente|belle)\\s+affaire\\b|\\bfoncez\\b`, "i"),

  // ── Payer ou ne pas payer ──
  // « ne payez pas », « ne pas payer », « ne rien payer avant… ».
  new RegExp(`${PAS_UNE_CONDITION}${NE}pay\\w+`, "i"),
  // « ne pas verser d'acompte », « n'envoyez pas d'argent », « ne faites aucun virement ».
  new RegExp(`${NE}(?:vers|envoy|r[eé]gl|transf[ée]r|vir|donn|fai(?:tes|re))\\w*[^.!?]{0,30}${ARGENT}`, "i"),
  // « ne réglez rien avant d'avoir vu la paire », « ne versez rien ».
  new RegExp(`\\bne\\s+(?:r[ée]glez|versez)\\b`, "i"),
  // « payez par la plateforme », et l'infinitif en tête de phrase : « Payer uniquement via la plateforme. »
  new RegExp(`${PAS_UNE_CONDITION}${PAS_UN_CONSTAT}\\bpayez\\b|(?:^|[.!?;:]\\s+|[-–—•]\\s*)payer\\b`, "i"),
  // « aucun paiement avant… », « paiement uniquement via… », « privilégiez un paiement sécurisé ». Jamais « preuve de paiement ».
  new RegExp(
    `\\b(?:aucun|tout)\\s+${PAIEMENT}\\b|${PAIEMENT}\\s+(?:s[ée]curis[ée]|prot[ée]g[ée]|uniquement|seulement|exclusivement|hors\\s+plateforme|en\\s+main\\s+propre|via\\b|par\\s+(?:virement|paypal|carte|la\\s+plateforme))`,
    "i",
  ),
  new RegExp(`(?:privil[ée]gi|pr[ée]f[ée]r|exig|utilis|pass(?:ez|er)\\s+par)\\w*[^.!?]{0,30}${PAIEMENT}\\b`, "i"),
];

/** Ce texte porte-t-il un conseil d'achat ou de paiement ? Une valeur qui n'est pas un texte : non. */
export function isPurchaseAdvice(text: unknown): boolean {
  return typeof text === "string" && PURCHASE_ADVICE_PATTERNS.some((motif) => motif.test(text));
}

/** La liste, sans les éléments qui portent un conseil d'achat ou de paiement ; null reste null. */
export function withoutPurchaseAdvice(list: string[] | null): string[] | null {
  return list === null ? null : list.filter((element) => !isPurchaseAdvice(element));
}
