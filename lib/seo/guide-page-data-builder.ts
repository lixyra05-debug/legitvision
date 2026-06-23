import type { GuidePageData, GuideSignal } from "./guide-types";
import type { BreadcrumbItem, RelatedPage } from "./types";
import { getBrandBySlug } from "./data/brands";
import {
  getSignalBySlugs,
  getSignalsByBrand,
  signals as allSignals,
} from "./data/signals";
import { getModelsByBrand } from "./data/models";
import { intersections } from "./data/intersections";
import { platforms } from "./data/platforms";

const SITE_URL = "https://legitvision.vercel.app";
const BASE_PATH = "/guide";

export function buildGuidePageData(
  brandSlug: string,
  signalSlug: string,
): GuidePageData | null {
  const brand = getBrandBySlug(brandSlug);
  const signal = getSignalBySlugs(brandSlug, signalSlug);
  if (!brand || !signal) return null;

  const slugPath = `${BASE_PATH}/${brand.slug}/${signal.slug}`;
  const canonical = `${SITE_URL}${slugPath}`;

  const title = `${signal.name} — ${brand.name}`;
  const description = `${signal.tagline}. Guide détaillé : ${signal.steps.length} étapes, ${signal.commonErrors.length} erreurs fréquentes, FAQ et pré-authentification IA ${brand.name} en 90 secondes à 3,99 €.`;
  const h1 = `Comment vérifier ${signal.name} sur un ${brand.name} authentique`;
  const subtitle = signal.tagline;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Guides", url: `${SITE_URL}${BASE_PATH}` },
    { name: brand.name, url: `${SITE_URL}${BASE_PATH}/${brand.slug}` },
    { name: signal.name, url: canonical },
  ];

  const relatedPages = buildRelatedPages(signal);
  const trackingRef = `guide-${brand.slug}-${signal.slug}`;
  // schema.image (HowTo JSON-LD) → image OG racine : URL STABLE sans hash de build.
  // og:image / twitter:image per-page sont gérés par opengraph-image.tsx (file
  // convention), dont l'URL contient un hash de build non connu ici.
  const ogImage = "/opengraph-image";
  const checkUrl = `/check/new?brand=${encodeURIComponent(brand.name)}&source=seo&ref=${trackingRef}`;

  return {
    brand,
    signal,
    title,
    description,
    h1,
    subtitle,
    canonical,
    ogImage,
    breadcrumbs,
    intro: signal.intro,
    steps: signal.steps,
    commonErrors: signal.commonErrors,
    counterfeiterTactics: signal.counterfeiterTactics,
    faqs: signal.faqs,
    relatedPages,
    trackingRef,
    checkUrl,
  };
}

function buildRelatedPages(currentSignal: GuideSignal): RelatedPage[] {
  const brandSlug = currentSignal.brandSlug;

  const sameBrandSignals: RelatedPage[] = getSignalsByBrand(brandSlug)
    .filter((s) => s.slug !== currentSignal.slug)
    .slice(0, 3)
    .map((s) => ({
      label: `${s.name}`,
      href: `${BASE_PATH}/${brandSlug}/${s.slug}`,
      sublabel: s.tagline,
    }));

  const sameBrandModels: RelatedPage[] = getModelsByBrand(brandSlug)
    .slice(0, 2)
    .map((m) => ({
      label: `Legit Check ${m.name}`,
      href: `/legit-check/${brandSlug}/${m.slug}`,
      sublabel: m.tagline,
    }));

  const brandName = getBrandBySlug(brandSlug)?.name ?? brandSlug;

  const sameBrandPlatforms: RelatedPage[] = intersections
    .filter((i) => i.brandSlug === brandSlug)
    .slice(0, 2)
    .map((i) => {
      const platform = platforms.find((p) => p.slug === i.platformSlug);
      return {
        label: `Acheter ${brandName} authentique sur ${platform?.name ?? i.platformSlug}`,
        href: `/acheter-authentique/${i.platformSlug}/${i.brandSlug}`,
        sublabel: platform?.tagline ?? "",
      };
    });

  const hubs: RelatedPage[] = [
    {
      label: "Tous les guides signal × marque",
      href: BASE_PATH,
      sublabel: "66 guides d'authentification par signal et marque",
    },
    {
      label: `Tous les guides ${brandName}`,
      href: `${BASE_PATH}/${brandSlug}`,
      sublabel: `${getSignalsByBrand(brandSlug).length} signaux spécifiques`,
    },
  ];

  const crossBrand: RelatedPage[] = allSignals
    .filter(
      (s) =>
        s.brandSlug !== brandSlug && s.category === currentSignal.category,
    )
    .slice(0, 2)
    .map((s) => {
      const brand = getBrandBySlug(s.brandSlug);
      return {
        label: `${brand?.name ?? s.brandSlug} : ${s.name}`,
        href: `${BASE_PATH}/${s.brandSlug}/${s.slug}`,
        sublabel: s.tagline,
      };
    });

  return [
    ...sameBrandSignals,
    ...sameBrandModels,
    ...sameBrandPlatforms,
    ...hubs,
    ...crossBrand,
  ].slice(0, 12);
}

export function getAllGuideParams(): { brand: string; signal: string }[] {
  return allSignals.map((s) => ({ brand: s.brandSlug, signal: s.slug }));
}

export function getBrandSlugsWithSignals(): string[] {
  return Array.from(new Set(allSignals.map((s) => s.brandSlug)));
}
