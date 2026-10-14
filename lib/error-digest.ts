/**
 * Lecture d'une erreur reçue par un écran d'erreur (app/error.tsx,
 * app/global-error.tsx). Next transmet la valeur levée telle quelle : elle
 * n'est pas forcément une Error (ErrorInfo de next/error la type `unknown`).
 * On la lit donc sans rien supposer de son type, et sans jamais son message,
 * qui peut contenir des données.
 */

/** Identifiant de l'erreur côté serveur (digest), s'il y en a un et que c'est un texte. */
export function errorDigest(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("digest" in error)) return null;
  const { digest } = error;
  return typeof digest === "string" && digest !== "" ? digest : null;
}

/** Type de l'erreur, jamais son message. */
export function errorName(error: unknown): string {
  return error instanceof Error ? error.name : typeof error;
}
