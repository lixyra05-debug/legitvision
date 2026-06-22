import type {
  BreadcrumbItem,
  FAQItem,
  RelatedPage,
  SeoPageData,
} from "./types";
import { getPlatformBySlug, platforms } from "./data/platforms";
import { getBrandBySlug, brands } from "./data/brands";
import { getIntersection, intersections } from "./data/intersections";

const SITE_URL = "https://legitvision.vercel.app";
const BASE_PATH = "/acheter-authentique";

export function buildPlatformBrandPageData(
  platformSlug: string,
  brandSlug: string,
): SeoPageData | null {
  const platform = getPlatformBySlug(platformSlug);
  const brand = getBrandBySlug(brandSlug);
  const intersection = getIntersection(platformSlug, brandSlug);

  if (!platform || !brand || !intersection) return null;

  const slugPath = `${BASE_PATH}/${platform.slug}/${brand.slug}`;
  const canonical = `${SITE_URL}${slugPath}`;

  const title = `${brand.name} sur ${platform.name} : comment éviter les contrefaçons en 2026`;
  const description = `Guide complet pour acheter ${brand.productPossessive} ${brand.name} authentique sur ${platform.name}. Signaux d'authentification, arnaques courantes, prix marché, FAQ et analyse IA à 3,99 €.`;
  const h1 = `Comment reconnaître ${brand.productPossessive} vraie ${brand.name} sur ${platform.name}`;
  const subtitle = `${brand.tagline} — ${platform.tagline.toLowerCase()}. Le guide 2026 pour acheter sans se faire piéger.`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Acheter authentique", url: `${SITE_URL}${BASE_PATH}` },
    { name: platform.name, url: `${SITE_URL}${BASE_PATH}/${platform.slug}` },
    { name: brand.name, url: canonical },
  ];

  const introParagraphs: string[] = [
    `${platform.description} ${brand.name} y compte aujourd'hui parmi les marques les plus recherchées — et donc les plus contrefaites.`,
    intersection.angle,
    `Ce guide décrit les ${brand.signals.length} signaux techniques qui distinguent ${brand.productPossessive} ${brand.name} authentique d'une contrefaçon, les arnaques récurrentes sur ${platform.name}, et comment obtenir en 90 secondes une analyse IA à 3,99 € qui vous évite d'acheter un faux.`,
  ];

  const faqs: FAQItem[] = [
    ...intersection.faqs,
    ...platform.faqs.slice(0, 2),
    ...brand.faqs.slice(0, 2),
  ];

  const relatedPages = buildRelatedPages(platform.slug, brand.slug);

  const trackingRef = `${platform.slug}-${brand.slug}`;
  // schema.image (HowTo JSON-LD) → image OG racine : URL STABLE sans hash de build.
  // og:image / twitter:image per-page sont gérés par opengraph-image.tsx (file
  // convention), dont l'URL contient un hash de build non connu ici.
  const ogImage = "/opengraph-image";

  return {
    category: "platform-brand",
    platform,
    brand,
    title,
    description,
    h1,
    subtitle,
    canonical,
    ogImage,
    breadcrumbs,
    introParagraphs,
    signals: brand.signals,
    scams: platform.scams,
    faqs,
    relatedPages,
    trackingRef,
  };
}

function buildRelatedPages(
  currentPlatformSlug: string,
  currentBrandSlug: string,
): RelatedPage[] {
  const samePlatform = intersections
    .filter(
      (i) =>
        i.platformSlug === currentPlatformSlug &&
        i.brandSlug !== currentBrandSlug,
    )
    .slice(0, 4)
    .map<RelatedPage>((i) => {
      const brand = brands.find((b) => b.slug === i.brandSlug);
      const platform = platforms.find((p) => p.slug === i.platformSlug);
      return {
        label: `${brand?.name ?? i.brandSlug} sur ${platform?.name ?? i.platformSlug}`,
        href: `${BASE_PATH}/${i.platformSlug}/${i.brandSlug}`,
        sublabel: `Guide d'authentification ${brand?.name ?? ""}`,
      };
    });

  const sameBrand = intersections
    .filter(
      (i) =>
        i.brandSlug === currentBrandSlug &&
        i.platformSlug !== currentPlatformSlug,
    )
    .slice(0, 4)
    .map<RelatedPage>((i) => {
      const brand = brands.find((b) => b.slug === i.brandSlug);
      const platform = platforms.find((p) => p.slug === i.platformSlug);
      return {
        label: `${brand?.name ?? i.brandSlug} sur ${platform?.name ?? i.platformSlug}`,
        href: `${BASE_PATH}/${i.platformSlug}/${i.brandSlug}`,
        sublabel: `Arnaques ${platform?.name ?? ""} et comment les éviter`,
      };
    });

  return [...samePlatform, ...sameBrand];
}

export function getAllPlatformBrandParams() {
  return intersections.map((i) => ({
    plateforme: i.platformSlug,
    marque: i.brandSlug,
  }));
}
