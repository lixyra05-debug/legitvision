import type { MetadataRoute } from "next";
import { platforms } from "@/lib/seo/data/platforms";
import { intersections } from "@/lib/seo/data/intersections";
import {
  getBrandSlugsWithModels,
  getAllModelParams,
} from "@/lib/seo/data/models";

const BASE_URL = "https://legitvision.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgu`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const seoHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/acheter-authentique`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const platformHubs: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${BASE_URL}/acheter-authentique/${platform.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const leafPages: MetadataRoute.Sitemap = intersections.map((i) => ({
    url: `${BASE_URL}/acheter-authentique/${i.platformSlug}/${i.brandSlug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legitCheckHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/legit-check`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const legitCheckBrandHubs: MetadataRoute.Sitemap = getBrandSlugsWithModels().map(
    (slug) => ({
      url: `${BASE_URL}/legit-check/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const legitCheckModelPages: MetadataRoute.Sitemap = getAllModelParams().map(
    (p) => ({
      url: `${BASE_URL}/legit-check/${p.brand}/${p.model}`,
      lastModified: now,
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
  ];
}
