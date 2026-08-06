/**
 * Briques JSON-LD partagées par les trois corpus SEO (guide, legit-check,
 * acheter-authentique) — évite de tripler auteur, éditeur et liste d'étapes.
 *
 * `author` et `publisher` référencent le même `@id` que le nœud Organization
 * du graphe déclaré dans app/layout.tsx : les propriétés sont répétées inline
 * pour que chaque bloc reste autonome à la lecture (parsing LLM), tout en
 * pointant sur le nœud canonique du graphe.
 */
import { SITE_URL } from "@/lib/site-url";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const ARTICLE_AUTHOR: JsonLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "LegitVision",
  url: SITE_URL,
};

export const ARTICLE_PUBLISHER: JsonLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "LegitVision",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
};

export const ARTICLE_IS_PART_OF: JsonLd = { "@id": WEBSITE_ID };

/**
 * Étapes d'authentification sous forme d'ItemList.
 *
 * TechArticle ne supporte pas `step` / `tool` / `totalTime` / `estimatedCost`
 * (propriétés propres à HowTo). Les étapes sont donc émises dans un schéma
 * distinct plutôt que perdues.
 */
export function buildStepsItemListSchema(
  name: string,
  canonical: string,
  items: readonly { title: string; description: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonical}#steps`,
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.description,
    })),
  };
}
