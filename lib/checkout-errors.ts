/**
 * Erreurs de la page de paiement (/checkout), renvoyées à /check/new par
 * ?error=stripe_unavailable&reason=<code>. L'URL ne transporte qu'un CODE : le
 * message affiché vient toujours de cette table. Avant le 04/10, le texte de
 * l'URL s'affichait tel quel dans l'encadré « Paiement Stripe indisponible » :
 * un lien forgé faisait parler le site, et un « % » isolé le faisait planter.
 */
export const CHECKOUT_ERROR_PARAM = "stripe_unavailable";

const MESSAGES = {
  indisponible:
    "Le service de paiement est momentanément indisponible. Réessayez dans quelques instants.",
} as const;

export type CheckoutErrorCode = keyof typeof MESSAGES;

/** Adresse de retour vers le paywall, avec le code de l'erreur. */
export function checkoutErrorRedirect(code: CheckoutErrorCode): string {
  return `/check/new?error=${CHECKOUT_ERROR_PARAM}&reason=${code}`;
}

/** Message d'un code reçu dans l'URL ; un code inconnu (ou absent) reçoit le message générique. */
export function checkoutErrorMessage(code: string | null | undefined): string {
  return code !== null && code !== undefined && Object.prototype.hasOwnProperty.call(MESSAGES, code)
    ? MESSAGES[code as CheckoutErrorCode]
    : MESSAGES.indisponible;
}
