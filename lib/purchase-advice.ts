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
 * Reconnaître large serait un défaut : « demandez la preuve d'achat »,
 * « conservez la facture d'achat », « avant tout achat, faites contrôler
 * l'article » sont des vérifications, pas des conseils d'achat.
 *
 * Sans dépendance : tests/unit/consigne-sans-conseil-achat.test.ts.
 */

// L'apostrophe peut être droite ou typographique. Pas de limite de mot devant
// une lettre accentuée : sans le drapeau « u », elle n'est pas tenue pour une
// lettre.
const A = "['’]";

const MOTIFS: RegExp[] = [
  // Ne pas acheter : « n'achetez pas », « ne l'achetez pas », « ne pas acheter », « à ne pas acheter ».
  new RegExp(`\\bn${A}ach[eè]te`, "i"),
  new RegExp(`\\bne\\s+(?:l${A}|les\\s+|pas\\s+|surtout\\s+pas\\s+)ach[eè]te`, "i"),
  // Éviter, déconseiller, renoncer à, fuir l'achat : « éviter absolument cet achat », « achat déconseillé ».
  new RegExp(`[ée]vit(?:ez|er|e)\\b[^.!?]{0,40}\\bachat`, "i"),
  new RegExp(`d[ée]conseill[^.!?]{0,40}\\b(?:achat|acheter|acqu[ée]r)|\\bachat\\b[^.!?]{0,30}d[ée]conseill`, "i"),
  new RegExp(`\\brenonce[rz]?\\b[^.!?]{0,30}\\b(?:achat|acheter|transaction)`, "i"),
  new RegExp(`passez votre chemin|\\bfuyez\\b|(?:^|\\s)à fuir\\b`, "i"),
  // Acheter : « achetez », « vous pouvez l'acheter », « achat recommandé », « acheter les yeux fermés ».
  new RegExp(`\\bachetez\\b`, "i"),
  new RegExp(`\\bvous pouvez\\s+(?:l${A}|les\\s+)?acheter\\b`, "i"),
  new RegExp(`\\bachat\\s+(?:recommand|conseill|s[ûu]r\\b|sans risque|possible sans)`, "i"),
  new RegExp(`\\bacheter\\s+(?:en toute confiance|sans crainte|sans risque|sans h[ée]siter|les yeux ferm[ée]s)`, "i"),
  new RegExp(`\\bbonne affaire\\b|\\bfoncez\\b`, "i"),
  // Payer ou ne pas payer : « ne payez pas », « payez par… », « n'envoyez pas d'argent ».
  new RegExp(`\\bpayez\\b|\\bne\\s+pas\\s+payer\\b|\\bne\\s+(?:r[ée]glez|versez)\\b`, "i"),
  new RegExp(`\\bn${A}envoyez\\s+(?:pas|aucun)[^.!?]{0,20}(?:argent|paiement|virement|acompte)`, "i"),
];

/** Ce texte porte-t-il un conseil d'achat ou de paiement ? Une valeur qui n'est pas un texte : non. */
export function isPurchaseAdvice(text: unknown): boolean {
  return typeof text === "string" && MOTIFS.some((motif) => motif.test(text));
}

/** La liste, sans les éléments qui portent un conseil d'achat ou de paiement ; null reste null. */
export function withoutPurchaseAdvice(list: string[] | null): string[] | null {
  return list === null ? null : list.filter((element) => !isPurchaseAdvice(element));
}
