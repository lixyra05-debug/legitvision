/**
 * Schémas JSON-LD pour les pages HUB et intermédiaires (niveaux 1-2) du SEO
 * programmatique. Ces pages n'avaient aucune donnée structurée (P2-2 de l'audit).
 *
 * - BreadcrumbList : fil d'Ariane (mêmes champs que les builders de feuilles).
 * - ItemList : liste des pages enfants (marques d'un hub, modèles/signaux d'une
 *   page marque…) pour aider Google à comprendre la hiérarchie du site.
 *
 * Les fonctions sont génériques : l'appelant fournit des URL ABSOLUES.
 */

type JsonLd = Record<string, unknown>;
type LinkedItem = { name: string; url: string };

export function buildBreadcrumbListSchema(crumbs: LinkedItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildItemListSchema(name: string, items: LinkedItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
