import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import {
  getSignalsByBrand,
  getAllBrandSlugsWithSignals,
} from "@/lib/seo/data/signals";
import { SeoNav } from "@/components/seo/SeoNav";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBrandSlugsWithSignals().map((brand) => ({ brand }));
}

type Props = { params: { brand: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.brand);
  if (!brand) return {};
  const brandSignals = getSignalsByBrand(brand.slug);

  const title = `Guides ${brand.name} : ${brandSignals.length} signaux pour authentifier en 2026`;
  const description = `Guides 2026 pour pré-authentifier ${brand.name} signal par signal — ${brandSignals.length} protocoles détaillés avec étapes mesurables, erreurs fréquentes et techniques des faussaires. Pré-authentification IA à 3,99 €.`;

  return {
    title,
    description,
    alternates: { canonical: `/guide/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/guide/${brand.slug}`,
      type: "website",
    },
  };
}

export default function BrandGuideHub({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  if (!brand) notFound();

  const brandSignals = getSignalsByBrand(brand.slug);
  if (brandSignals.length === 0) notFound();

  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Guides", url: `${SITE_URL}/guide` },
      { name: brand.name, url: `${SITE_URL}/guide/${brand.slug}` },
    ]),
    buildItemListSchema(
      `Signaux ${brand.name}`,
      brandSignals.map((s) => ({
        name: s.name,
        url: `${SITE_URL}/guide/${brand.slug}/${s.slug}`,
      })),
    ),
  ];

  return (
    <div className="min-h-screen bg-background">
      {hubSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SeoNav />

      <section className="relative overflow-hidden border-b border-line-subtle">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-caption text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                  Accueil
                </Link>
              </li>
              <li className="text-subtle">/</li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-foreground transition-colors duration-fast"
                >
                  Guides
                </Link>
              </li>
              <li className="text-subtle">/</li>
              <li className="text-foreground">{brand.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white shadow-card">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain p-1.5"
                sizes="64px"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-2.5 py-0.5 text-caption font-medium text-muted-foreground">
                Guides 2026
              </span>
              <p className="mt-1 text-caption text-muted-foreground">{brand.priceRange}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-h1 font-bold">
            Guides {brand.name} : {brandSignals.length} signaux à maîtriser
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {brand.tagline}. Sélectionnez le signal — chaque guide détaille le protocole photo, les dimensions de référence, les polices, les couleurs Pantone, et les erreurs qui font rater une pré-authentification visuelle.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <h2 className="font-heading text-h2 font-bold">
            À propos de {brand.name}
          </h2>
          <p className="mt-4 text-lead leading-relaxed text-muted-foreground">
            {brand.description}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-h2 font-bold">
            Choisissez votre signal
          </h2>
          <p className="mt-2 text-ui text-muted-foreground">
            {brandSignals.length} signaux documentés avec protocole photo, étapes mesurables, erreurs fréquentes et FAQ.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandSignals.map((signal) => (
              <Link
                key={signal.slug}
                href={`/guide/${brand.slug}/${signal.slug}`}
                className="group block rounded-lg border border-line-subtle bg-surface p-5 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
              >
                <h3 className="font-heading text-h4 font-semibold text-foreground group-hover:text-accent transition-colors duration-fast">
                  {signal.name}
                </h3>
                <p className="mt-2 text-caption text-muted-foreground line-clamp-3">
                  {signal.tagline}
                </p>
                <div className="mt-4 flex items-center gap-2 text-caption">
                  <span className="rounded-full border border-line bg-surface-raised px-2 py-0.5 text-muted-foreground">
                    {signal.steps.length} étapes
                  </span>
                  <span className="rounded-full border border-line bg-surface-raised px-2 py-0.5 text-muted-foreground">
                    {signal.faqs.length} FAQ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-16 overflow-hidden rounded-lg border border-line bg-surface p-8 sm:p-12">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              Pré-authentifier votre {brand.name}
            </h2>
            <p className="mt-4 max-w-2xl text-body text-muted-foreground">
              Photo + IA + 90 secondes = score de confiance détaillé sur l&apos;ensemble des signaux. Estimation probabiliste, jamais une garantie.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/check/new?brand=${encodeURIComponent(brand.name)}&source=seo&ref=guide-hub-${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
              >
                Lancer ma pré-authentification
              </Link>
              <Link
                href={`/legit-check/${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-line bg-surface-raised px-6 py-3 text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
              >
                Guides modèle {brand.name}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
