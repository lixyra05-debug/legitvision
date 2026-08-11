import Link from "next/link";
import Image from "next/image";
import type { LegitCheckPageData } from "@/lib/seo/legit-check-types";
import { SeoNav } from "./SeoNav";
import { SignalCard } from "./SignalCard";
import { SeoFAQ } from "./SeoFAQ";
import { RelatedPagesGrid } from "./RelatedPagesGrid";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import { SITE_URL } from "@/lib/site-url";
import {
  CONTENT_REVISED,
  formatContentDate,
} from "@/lib/seo/content-dates";

const CATEGORY_LABELS = {
  sneakers: "Sneakers",
  bags: "Sacs de luxe",
  clothing: "Streetwear",
} as const;

function LegitCheckDisclaimer() {
  return (
    <div className="mt-12 rounded-lg border border-line-subtle bg-surface p-5">
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-caption leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Pré-authentification visuelle, pas garantie.</strong>{" "}
          Ce guide vous aide à détecter les signaux visuels d&apos;une contrefaçon, mais ne remplace pas une authentification humaine professionnelle. L&apos;analyse IA fournit une estimation probabiliste avec un score de confiance — jamais un certificat d&apos;authenticité. Pour les achats à haute valeur, croisez toujours plusieurs sources (authentificateur humain, receipt d&apos;origine, plateforme avec programme d&apos;authentification).
        </p>
      </div>
    </div>
  );
}

function LegitCheckScamCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-warning/20 bg-warning/[0.03] p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-warning/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-warning"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-h4 font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-ui leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LegitCheckPageTemplate({ data }: { data: LegitCheckPageData }) {
  const categoryLabel = CATEGORY_LABELS[data.model.category];

  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-line-subtle">
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
              {data.breadcrumbs.map((crumb, i) => {
                const isLast = i === data.breadcrumbs.length - 1;
                const path = crumb.url.replace(SITE_URL, "");
                return (
                  <li key={crumb.url} className="flex items-center gap-2">
                    {isLast ? (
                      <span className="text-foreground">{crumb.name}</span>
                    ) : (
                      <Link
                        href={path || "/"}
                        className="hover:text-foreground transition-colors duration-fast"
                      >
                        {crumb.name}
                      </Link>
                    )}
                    {!isLast && <span className="text-subtle">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src={data.brand.logo}
                alt={data.brand.name}
                fill
                className="object-contain p-1.5"
                sizes="56px"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
                Legit Check 2026
              </span>
              <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
                {categoryLabel}
              </span>
              <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
                {data.model.priceRange}
              </span>
              <time
                dateTime={CONTENT_REVISED.legitCheck}
                className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground"
              >
                Mis à jour le {formatContentDate(CONTENT_REVISED.legitCheck)}
              </time>
            </div>
          </div>

          <h1 className="mt-8 font-heading text-h1 font-bold">
            {data.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {data.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={data.checkUrl}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              Pré-authentifier ma photo — 3,99 €
            </Link>
            <a
              href="#signaux"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface-raised px-6 py-3 text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
            >
              Voir les {data.signals.length} signaux
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-caption text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
              Résultat en 90 secondes
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
              Score de confiance détaillé
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
              Protocole photo guidé
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <p className="text-lead leading-relaxed text-muted-foreground">
            {data.intro}
          </p>
        </section>

        <section id="signaux" className="mb-16 scroll-mt-20">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Authentification
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              Les {data.signals.length} signaux pour authentifier {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              Chaque signal est classé par difficulté. Plus la difficulté est élevée, plus il faut un œil entraîné ou une pré-authentification IA pour trancher.
            </p>
          </div>

          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {data.signals.map((signal, i) => (
              <RevealItem key={i}>
                <SignalCard signal={signal} index={i} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <div className="my-12 overflow-hidden rounded-lg border border-accent/20 bg-surface p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h3 className="font-heading text-h3 font-semibold text-foreground">
                Un doute sur votre {data.brand.name} {data.model.name} ?
              </h3>
              <p className="mt-2 text-ui text-muted-foreground">
                Uploadez 8 à 12 photos, obtenez une pré-authentification IA avec score de confiance en 90 secondes.
              </p>
            </div>
            <Link
              href={data.checkUrl}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              Analyser — 3,99 €
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-caption font-medium text-warning">
              Alerte arnaques
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              {data.scams.length} arnaques récurrentes sur {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              Ces schémas se retrouvent dans la quasi-totalité des contrefaçons signalées sur {data.brand.name} {data.model.name}. Si vous en cochez un seul, ralentissez avant d&apos;acheter.
            </p>
          </div>

          <RevealGroup className="grid gap-4">
            {data.scams.map((scam, i) => (
              <RevealItem key={i}>
                <LegitCheckScamCard
                  title={scam.title}
                  description={scam.description}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              FAQ
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              Questions fréquentes
            </h2>
          </div>
          <SeoFAQ faqs={data.faqs} />
        </section>

        <section className="relative mt-16 overflow-hidden rounded-lg border border-line bg-surface p-8 sm:p-12">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              Ne pariez plus sur votre prochain {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-4 max-w-2xl text-body text-muted-foreground">
              3,99 € pour éviter {data.model.priceRange} de perte. Score de confiance, estimation de probabilité et recommandations détaillées en 90 secondes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={data.checkUrl}
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

        <RelatedPagesGrid pages={data.relatedPages} />

        <LegitCheckDisclaimer />
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear de luxe.{" "}
          <span className="text-subtle">•</span>{" "}
          Les analyses fournissent une estimation probabiliste, jamais une garantie d&apos;authenticité.
        </div>
      </footer>
    </div>
  );
}
