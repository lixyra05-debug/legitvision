import Link from "next/link";
import type { Metadata } from "next";
import { platforms } from "@/lib/seo/data/platforms";
import { SeoNav } from "@/components/seo/SeoNav";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Acheter authentique : guides d'authentification par plateforme",
  description:
    "60 guides 2026 pour acheter sans contrefaçon sur Vinted, Vestiaire Collective, Leboncoin, eBay, Depop et Facebook Marketplace. Nike, Jordan, Louis Vuitton, Chanel, Hermès et plus.",
  alternates: { canonical: "/acheter-authentique" },
  openGraph: {
    title: "Acheter authentique — Guides LegitVision",
    description:
      "Sélection de 60 guides d'authentification pour les 6 plateformes seconde main les plus populaires.",
    url: `${SITE_URL}/acheter-authentique`,
    type: "website",
  },
};

export default function AcheterAuthentiqueHubPage() {
  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Acheter authentique", url: `${SITE_URL}/acheter-authentique` },
    ]),
    buildItemListSchema(
      "Plateformes couvertes",
      platforms.map((p) => ({
        name: p.name,
        url: `${SITE_URL}/acheter-authentique/${p.slug}`,
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
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
            60 guides d&apos;authentification
          </span>
          <h1 className="mt-4 font-heading text-display font-bold">
            Acheter authentique, sans se faire piéger.
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            Guides 2026 pour reconnaître les vraies sneakers et les vrais sacs de luxe sur les 6 plateformes seconde main les plus utilisées en France. Signaux techniques, arnaques récurrentes, prix marché, et analyse IA en 90 secondes à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth?source=seo&ref=hub-acheter-authentique"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              Analyser une photo — 3,99 €
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

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-h2 font-bold">
          Choisissez votre plateforme
        </h2>
        <p className="mt-2 text-ui text-muted-foreground">
          Chaque plateforme a ses arnaques et ses garde-fous. Accédez aux 10 guides de marques pour celle qui vous intéresse.
        </p>

        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <RevealItem key={platform.slug}>
              <Link
                href={`/acheter-authentique/${platform.slug}`}
                className="group relative block h-full overflow-hidden rounded-lg border border-line-subtle bg-surface p-6 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: platform.accentColor }}
                />
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-md font-heading text-body font-bold text-white shadow-lg"
                    style={{ backgroundColor: platform.accentColor }}
                  >
                    {platform.shortLabel}
                  </div>
                  <div>
                    <h3 className="font-heading text-h4 font-semibold text-foreground group-hover:text-accent transition-colors duration-fast">
                      {platform.name}
                    </h3>
                    <p className="text-caption text-muted-foreground">{platform.userBaseFr}</p>
                  </div>
                </div>
                <p className="mt-4 text-ui text-muted-foreground line-clamp-3">
                  {platform.tagline}
                </p>
                <div className="mt-5 flex items-center justify-between text-caption">
                  <span className="text-muted-foreground">10 guides disponibles</span>
                  <span className="font-medium text-accent opacity-0 transition-opacity duration-fast group-hover:opacity-100">
                    Voir les guides →
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Authentification IA pour sneakers et sacs de luxe.
        </div>
      </footer>
    </div>
  );
}
