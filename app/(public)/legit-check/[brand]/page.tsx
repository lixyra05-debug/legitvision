import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import {
  getBrandSlugsWithModels,
  getModelsByBrand,
} from "@/lib/seo/data/models";
import { SeoNav } from "@/components/seo/SeoNav";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getBrandSlugsWithModels().map((brand) => ({ brand }));
}

type Props = { params: { brand: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.brand);
  if (!brand) return {};
  const models = getModelsByBrand(brand.slug);

  const title = `Legit Check ${brand.name} : ${models.length} guides d'authentification par modèle`;
  const description = `Guides 2026 pour authentifier ${models.length} modèles ${brand.name} : signaux techniques spécifiques, arnaques récurrentes, prix marché et pré-authentification IA à 3,99 €.`;

  return {
    title,
    description,
    alternates: { canonical: `/legit-check/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/legit-check/${brand.slug}`,
      type: "website",
    },
  };
}

export default function BrandLegitCheckHub({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  if (!brand) notFound();

  const brandModels = getModelsByBrand(brand.slug);
  if (brandModels.length === 0) notFound();

  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Legit Check", url: `${SITE_URL}/legit-check` },
      { name: brand.name, url: `${SITE_URL}/legit-check/${brand.slug}` },
    ]),
    buildItemListSchema(
      `Modèles ${brand.name}`,
      brandModels.map((m) => ({
        name: m.name,
        url: `${SITE_URL}/legit-check/${brand.slug}/${m.slug}`,
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
                  href="/legit-check"
                  className="hover:text-foreground transition-colors duration-fast"
                >
                  Legit Check
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
                Legit Check 2026
              </span>
              <p className="mt-1 text-caption text-muted-foreground">{brand.priceRange}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-h1 font-bold">
            Legit Check {brand.name} : {brandModels.length} modèles à authentifier
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {brand.tagline}. Sélectionnez le modèle — chaque guide détaille les signaux techniques propres à cette référence, les arnaques spécifiques, et les prix marché 2026.
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
            Choisissez votre modèle
          </h2>
          <p className="mt-2 text-ui text-muted-foreground">
            {brandModels.length} modèles documentés avec 5 signaux d&apos;authentification spécifiques chacun.
          </p>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandModels.map((model) => (
              <RevealItem key={model.slug}>
                <Link
                  href={`/legit-check/${brand.slug}/${model.slug}`}
                  className="group block h-full rounded-lg border border-line-subtle bg-surface p-5 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
                >
                  <h3 className="font-heading text-h4 font-semibold text-foreground group-hover:text-accent transition-colors duration-fast">
                    {model.name}
                  </h3>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {model.priceRange} · {model.retailYear}
                  </p>
                  <p className="mt-3 text-caption text-muted-foreground line-clamp-3">
                    {model.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-caption">
                    <span className="rounded-full border border-line bg-surface-raised px-2 py-0.5 text-muted-foreground">
                      {model.signals.length} signaux
                    </span>
                    <span className="rounded-full border border-line bg-surface-raised px-2 py-0.5 text-muted-foreground">
                      {model.scams.length} arnaques
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
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
              Photo + IA + 90 secondes = score de confiance détaillé. Évitez {brand.priceRange} de perte pour 3,99 €.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/auth?source=seo&ref=legit-check-hub-${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
              >
                Lancer ma pré-authentification
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center rounded-full border border-line bg-surface-raised px-6 py-3 text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
              >
                Voir les forfaits
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
