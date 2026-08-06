import type { MetadataRoute } from "next";
import { platforms } from "@/lib/seo/data/platforms";
import { intersections } from "@/lib/seo/data/intersections";
import {
  getBrandSlugsWithModels,
  getAllModelParams,
} from "@/lib/seo/data/models";
import {
  getAllGuideParams,
  getBrandSlugsWithSignals,
} from "@/lib/seo/guide-page-data-builder";
import { CONTENT_REVISED } from "@/lib/seo/content-dates";
import { SITE_URL as BASE_URL } from "@/lib/site-url";

// `lastModified` lit lib/seo/content-dates.ts — la même source que le
// `dateModified` des TechArticle et que le `<time>` visible des pages. Il
// utilisait auparavant `new Date()`, donc l'horodatage du build : les 239 URLs
// annonçaient une modification à chaque déploiement, contenu inchangé compris.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: CONTENT_REVISED.site,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: CONTENT_REVISED.site,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgu`,
      lastModified: CONTENT_REVISED.site,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: CONTENT_REVISED.site,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const seoHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/acheter-authentique`,
      lastModified: CONTENT_REVISED.hub,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const platformHubs: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${BASE_URL}/acheter-authentique/${platform.slug}`,
    lastModified: CONTENT_REVISED.hub,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const leafPages: MetadataRoute.Sitemap = intersections.map((i) => ({
    url: `${BASE_URL}/acheter-authentique/${i.platformSlug}/${i.brandSlug}`,
    lastModified: CONTENT_REVISED.acheterAuthentique,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legitCheckHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/legit-check`,
      lastModified: CONTENT_REVISED.hub,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const legitCheckBrandHubs: MetadataRoute.Sitemap = getBrandSlugsWithModels().map(
    (slug) => ({
      url: `${BASE_URL}/legit-check/${slug}`,
      lastModified: CONTENT_REVISED.hub,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const legitCheckModelPages: MetadataRoute.Sitemap = getAllModelParams().map(
    (p) => ({
      url: `${BASE_URL}/legit-check/${p.brand}/${p.model}`,
      lastModified: CONTENT_REVISED.legitCheck,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const guideHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/guide`,
      lastModified: CONTENT_REVISED.hub,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const guideBrandHubs: MetadataRoute.Sitemap = getBrandSlugsWithSignals().map(
    (slug) => ({
      url: `${BASE_URL}/guide/${slug}`,
      lastModified: CONTENT_REVISED.hub,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const guideSignalPages: MetadataRoute.Sitemap = getAllGuideParams().map(
    (p) => ({
      url: `${BASE_URL}/guide/${p.brand}/${p.signal}`,
      lastModified: CONTENT_REVISED.guide,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [
    ...staticEntries,
    ...seoHub,
    ...platformHubs,
    ...leafPages,
    ...legitCheckHub,
    ...legitCheckBrandHubs,
    ...legitCheckModelPages,
    ...guideHub,
    ...guideBrandHubs,
    ...guideSignalPages,
  ];
}
