import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlatformBySlug, platforms } from "@/lib/seo/data/platforms";
import { brands } from "@/lib/seo/data/brands";
import { intersections } from "@/lib/seo/data/intersections";
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
  return platforms.map((p) => ({ plateforme: p.slug }));
}

type Props = { params: { plateforme: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const platform = getPlatformBySlug(params.plateforme);
  if (!platform) return {};

  const title = `Acheter authentique sur ${platform.name} : les 10 guides par marque`;
  const description = `Guides 2026 pour éviter les contrefaçons Nike, Jordan, Louis Vuitton, Chanel, Hermès et 5 autres marques sur ${platform.name}. Signaux d'authentification, arnaques, analyse IA à 3,99 €.`;

  return {
    title,
    description,
    alternates: { canonical: `/acheter-authentique/${platform.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/acheter-authentique/${platform.slug}`,
      type: "website",
    },
  };
}

export default function PlatformHubPage({ params }: Props) {
  const platform = getPlatformBySlug(params.plateforme);
  if (!platform) notFound();

  const platformBrands = intersections
    .filter((i) => i.platformSlug === platform.slug)
    .map((i) => brands.find((b) => b.slug === i.brandSlug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Acheter authentique", url: `${SITE_URL}/acheter-authentique` },
      {
        name: platform.name,
        url: `${SITE_URL}/acheter-authentique/${platform.slug}`,
      },
    ]),
    buildItemListSchema(
      `Marques sur ${platform.name}`,
      platformBrands.map((b) => ({
        name: b.name,
        url: `${SITE_URL}/acheter-authentique/${platform.slug}/${b.slug}`,
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
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${platform.accentColor}25 0%, transparent 70%)`,
          }}
        />

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
                  href="/acheter-authentique"
                  className="hover:text-foreground transition-colors duration-fast"
                >
                  Acheter authentique
                </Link>
              </li>
              <li className="text-subtle">/</li>
              <li className="text-foreground">{platform.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-lg font-heading text-h3 font-bold text-white shadow-lg"
              style={{ backgroundColor: platform.accentColor }}
            >
              {platform.shortLabel}
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-2.5 py-0.5 text-caption font-medium text-muted-foreground">
                Guide 2026
              </span>
              <p className="mt-1 text-caption text-muted-foreground">{platform.userBaseFr}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-h1 font-bold">
            Acheter authentique sur {platform.name} : les 10 marques les plus contrefaites
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {platform.tagline}. Choisissez la marque qui vous intéresse — chaque guide détaille les signaux techniques, les arnaques récurrentes sur {platform.name}, et les prix marché 2026.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <h2 className="font-heading text-h2 font-bold">
            Ce que {platform.name} fait (et ne fait pas)
          </h2>
          <p className="mt-4 text-lead leading-relaxed text-muted-foreground">
            {platform.description}
          </p>
          {platform.authProgram && (
            <div className="mt-6 rounded-lg border border-line-subtle bg-surface p-6">
              <h3 className="font-heading text-h4 font-semibold text-foreground">
                Programme d&apos;authentification {platform.name}
              </h3>
              <p className="mt-2 text-ui text-muted-foreground">{platform.authProgram}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-heading text-h2 font-bold">
            Les 10 guides par marque
          </h2>
          <p className="mt-2 text-ui text-muted-foreground">
            Chaque guide combine les signaux d&apos;authentification propres à la marque et les arnaques spécifiques à {platform.name}.
          </p>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformBrands.map((brand) => (
              <RevealItem key={brand.slug}>
                <Link
                  href={`/acheter-authentique/${platform.slug}/${brand.slug}`}
                  className="group block h-full rounded-lg border border-line-subtle bg-surface p-5 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-h4 font-semibold text-foreground group-hover:text-accent transition-colors duration-fast">
                        {brand.name}
                      </h3>
                      <p className="text-caption text-muted-foreground">{brand.priceRange}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-caption text-muted-foreground line-clamp-2">
                    {brand.tagline}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Authentification IA pour sneakers et sacs de luxe.
        </div>
      </footer>
    </div>
  );
}
