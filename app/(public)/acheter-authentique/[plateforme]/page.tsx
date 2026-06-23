import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlatformBySlug, platforms } from "@/lib/seo/data/platforms";
import { brands } from "@/lib/seo/data/brands";
import { intersections } from "@/lib/seo/data/intersections";
import { SeoNav } from "@/components/seo/SeoNav";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";

const SITE_URL = "https://legitvision.vercel.app";

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

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${platform.accentColor}25 0%, transparent 70%)`,
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li>
                <Link
                  href="/acheter-authentique"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Acheter authentique
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li className="text-foreground">{platform.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl font-heading text-2xl font-bold text-white shadow-lg"
              style={{ backgroundColor: platform.accentColor }}
            >
              {platform.shortLabel}
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                Guide 2026
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{platform.userBaseFr}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Acheter authentique sur {platform.name} : les 10 marques les plus contrefaites
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {platform.tagline}. Choisissez la marque qui vous intéresse — chaque guide détaille les signaux techniques, les arnaques récurrentes sur {platform.name}, et les prix marché 2026.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Ce que {platform.name} fait (et ne fait pas)
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {platform.description}
          </p>
          {platform.authProgram && (
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Programme d&apos;authentification {platform.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{platform.authProgram}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Les 10 guides par marque
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque guide combine les signaux d&apos;authentification propres à la marque et les arnaques spécifiques à {platform.name}.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/acheter-authentique/${platform.slug}/${brand.slug}`}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{brand.priceRange}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                  {brand.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Authentification IA pour sneakers et sacs de luxe.
        </div>
      </footer>
    </div>
  );
}
