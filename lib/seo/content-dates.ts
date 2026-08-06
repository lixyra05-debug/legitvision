/**
 * Source de vérité UNIQUE des dates de contenu du SEO programmatique.
 *
 * Lue par app/sitemap.ts (`lastModified`) ET par les builders JSON-LD
 * (`datePublished` / `dateModified` des TechArticle) ET par le `<time>` visible
 * des templates — pour que les trois ne puissent pas diverger.
 *
 * Ces dates sont écrites à la main et décrivent la dernière révision RÉELLE du
 * contenu. Le sitemap utilisait auparavant `new Date()`, c'est-à-dire l'horodatage
 * du build : réutiliser cette source ferait déclarer à 198 pages une modification
 * à chaque déploiement, y compris quand rien n'a bougé. Date factice, signal
 * négatif côté moteurs, et aucun gain de citabilité côté IA.
 *
 * À bumper quand le contenu d'une section change vraiment :
 *   guide              → lib/seo/data/signals/
 *   legitCheck         → lib/seo/data/models/
 *   acheterAuthentique → lib/seo/data/intersections/, brands.ts, platforms.ts
 *   hub                → pages hub app/(public)/**, maillage interne
 *   site               → landing + pages légales
 *
 * Format : ISO 8601 date seule (YYYY-MM-DD), valide en `<lastmod>` sitemap
 * comme en schema.org Date comme en attribut `dateTime` HTML.
 */
export const CONTENT_PUBLISHED = "2026-04-22";

export const CONTENT_REVISED = {
  site: "2026-06-22",
  hub: "2026-06-24",
  guide: "2026-04-23",
  legitCheck: "2026-04-23",
  acheterAuthentique: "2026-04-23",
} as const;

/**
 * Formate une date ISO en français long : "2026-04-23" → "23 avril 2026".
 * Forcé en UTC pour rester déterministe entre le build et le rendu ISR.
 */
export function formatContentDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
