import type {
  LegitCheckPageData,
  ModelData,
} from "./legit-check-types";
import type { BreadcrumbItem, RelatedPage } from "./types";
import { getBrandBySlug } from "./data/brands";
import {
  getModelBySlugs,
  getModelsByBrand,
  models as allModels,
} from "./data/models";
import { SITE_URL } from "@/lib/site-url";

const BASE_PATH = "/legit-check";

export function buildLegitCheckPageData(
  brandSlug: string,
  modelSlug: string,
): LegitCheckPageData | null {
  const brand = getBrandBySlug(brandSlug);
  const model = getModelBySlugs(brandSlug, modelSlug);
  if (!brand || !model) return null;

  const slugPath = `${BASE_PATH}/${brand.slug}/${model.slug}`;
  const canonical = `${SITE_URL}${slugPath}`;

  const title = `Legit Check ${brand.name} ${model.name}`;
  const description = `Guide d'authentification ${brand.name} ${model.name} : ${model.signals.length} signaux techniques, arnaques récurrentes, prix marché ${model.priceRange}. Pré-authentification IA en 90 secondes à 3,99 €.`;
  const h1 = `${brand.name} ${model.name} : comment reconnaître un modèle authentique`;
  const subtitle = `${model.tagline}. Prix marché ${model.priceRange} — retail ${model.retailYear}. Le guide 2026 pour éviter les contrefaçons.`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Legit Check", url: `${SITE_URL}${BASE_PATH}` },
    { name: brand.name, url: `${SITE_URL}${BASE_PATH}/${brand.slug}` },
    { name: model.name, url: canonical },
  ];

  const relatedPages = buildRelatedPages(brand.slug, model.slug);
  const trackingRef = `legit-check-${brand.slug}-${model.slug}`;
  // schema.image (HowTo JSON-LD) → image OG racine : URL STABLE sans hash de build.
  // og:image / twitter:image per-page sont gérés par opengraph-image.tsx (file
  // convention), dont l'URL contient un hash de build non connu ici.
  const ogImage = "/opengraph-image";
  const checkUrl = `/auth?source=seo&ref=${trackingRef}`;

  return {
    brand,
    model,
    title,
    description,
    h1,
    subtitle,
    canonical,
    ogImage,
    breadcrumbs,
    intro: model.intro,
    signals: model.signals,
    scams: model.scams,
    faqs: model.faqs,
    relatedPages,
    trackingRef,
    checkUrl,
  };
}

function buildRelatedPages(
  currentBrandSlug: string,
  currentModelSlug: string,
): RelatedPage[] {
  const sameBrand: RelatedPage[] = getModelsByBrand(currentBrandSlug)
    .filter((m) => m.slug !== currentModelSlug)
    .slice(0, 6)
    .map((m) => ({
      label: `${m.name}`,
      href: `${BASE_PATH}/${currentBrandSlug}/${m.slug}`,
      sublabel: m.tagline,
    }));

  const currentModel = getModelBySlugs(currentBrandSlug, currentModelSlug);
  const currentCategory = currentModel?.category;

  const otherBrands: RelatedPage[] = allModels
    .filter(
      (m) =>
        m.brandSlug !== currentBrandSlug &&
        m.category === currentCategory,
    )
    .slice(0, 6)
    .map<RelatedPage>((m) => {
      const brand = getBrandBySlug(m.brandSlug);
      return {
        label: `${brand?.name ?? m.brandSlug} ${m.name}`,
        href: `${BASE_PATH}/${m.brandSlug}/${m.slug}`,
        sublabel: m.tagline,
      };
    });

  return [...sameBrand, ...otherBrands].slice(0, 12);
}

export type { ModelData };
