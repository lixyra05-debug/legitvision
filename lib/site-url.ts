/**
 * Source de vérité UNIQUE de l'URL publique du site.
 *
 * Toute URL absolue émise par l'application doit passer par ici : metadataBase,
 * canonicals, sitemap, robots, og:url, @id des JSON-LD, success_url/cancel_url
 * Stripe, liens des emails transactionnels. Aucune occurrence du domaine en dur
 * ne doit subsister ailleurs dans app/, lib/ ou components/.
 *
 * Configuration : poser NEXT_PUBLIC_SITE_URL sur Vercel et dans .env.local
 * (ex. https://legitvision.app). Le préfixe NEXT_PUBLIC_ est nécessaire :
 * la valeur est inlinée au build et doit rester lisible côté client.
 *
 * NEXT_PUBLIC_APP_URL est un alias historique conservé le temps de la
 * migration, pour qu'aucun environnement ne bascule sur le fallback prod
 * avant que la nouvelle variable soit posée partout. À retirer ensuite.
 *
 * Une seule dérogation dans le code : app/api/stripe/checkout/route.ts, dont le
 * dernier fallback est l'origine de la requête et non le domaine de prod. Voir
 * le commentaire sur place.
 */
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://legitvision.vercel.app";

/** Retire le ou les slashs finaux d'une URL de base (évite les `//` en concaténation). */
export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/** URL absolue du site, sans slash final. */
export const SITE_URL = normalizeBaseUrl(RAW_SITE_URL);

/** Construit une URL absolue à partir d'un chemin : siteUrl("/guide") → "https://…/guide". */
export function siteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
