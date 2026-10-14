/**
 * Codes d'erreur reçus dans l'URL de /auth (?error=), posés par les routes de
 * retour d'authentification (app/auth/callback, app/api/auth/callback). Jamais
 * de texte de l'URL affiché tel quel : un lien forgé ferait parler le site
 * (« Votre compte est suspendu, appelez le… »). Un code inconnu reçoit le
 * message générique de la connexion.
 */
const URL_ERROR_KEYS: Record<string, string> = {
  callback_error: "auth.errorCallback",
};

const CLE_GENERIQUE = "auth.errorCallback";

/** Clé de traduction du message à afficher pour ce code, ou null sans erreur dans l'URL. */
export function cleErreurUrl(code: string | null | undefined): string | null {
  if (code === null || code === undefined || code === "") return null;
  return Object.prototype.hasOwnProperty.call(URL_ERROR_KEYS, code) ? URL_ERROR_KEYS[code] : CLE_GENERIQUE;
}
