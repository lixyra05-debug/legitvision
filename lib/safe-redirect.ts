/**
 * Destination de redirection sûre : un chemin de CE site, jamais une autre
 * origine. Sert au formulaire de connexion (`?redirect=`) et aux routes de
 * retour d'authentification (`?next=`).
 *
 * Un test de préfixe ne suffit pas : les navigateurs lisent « \ » comme « / »
 * et suppriment tabulations et retours à la ligne, si bien que « /\hote » ou
 * « /<tab>/hote » deviennent « //hote », une autre origine. On résout donc le
 * chemin comme le ferait le navigateur, et on vérifie l'origine obtenue.
 *
 * Le chemin rendu est vérifié à son tour : la résolution retire les segments
 * « . » et « .. », si bien que « /.//hote » ou « /%2e//hote » donnent le chemin
 * « //hote », qu'un navigateur, router.push ou new URL(chemin, base) lisent
 * comme une autre origine (constat de la relecture du 17/10/2026).
 */
const ORIGINE_DE_TEST = "https://legitvision.invalid";

export function safeRedirectPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw || !raw.startsWith("/")) return fallback;
  try {
    const url = new URL(raw, ORIGINE_DE_TEST);
    if (url.origin !== ORIGINE_DE_TEST) return fallback;
    const chemin = `${url.pathname}${url.search}${url.hash}`;
    if (chemin.startsWith("//") || new URL(chemin, ORIGINE_DE_TEST).origin !== ORIGINE_DE_TEST) return fallback;
    return chemin;
  } catch {
    return fallback;
  }
}
