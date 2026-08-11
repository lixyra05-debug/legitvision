import Link from "next/link";
import Image from "next/image";
import type { SeoPageData } from "@/lib/seo/types";
import { SITE_URL } from "@/lib/site-url";
import {
  CONTENT_REVISED,
  formatContentDate,
} from "@/lib/seo/content-dates";

export function SeoHero({ data }: { data: SeoPageData }) {
  return (
    <section className="relative overflow-hidden border-b border-line-subtle">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${data.platform.accentColor}25 0%, transparent 70%)`,
        }}
      />

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

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-lg font-heading text-h4 font-bold text-white shadow-lg"
              style={{ backgroundColor: data.platform.accentColor }}
            >
              {data.platform.shortLabel}
            </div>
            <span className="text-h3 text-subtle">×</span>
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src={data.brand.logo}
                alt={data.brand.name}
                fill
                className="object-contain p-1.5"
                sizes="56px"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Guide 2026
            </span>
            <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              {data.signals.length} signaux d&apos;authentification
            </span>
            <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Analyse IA 3,99 €
            </span>
            <time
              dateTime={CONTENT_REVISED.acheterAuthentique}
              className="rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground"
            >
              Mis à jour le {formatContentDate(CONTENT_REVISED.acheterAuthentique)}
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
            href={`/auth?source=seo&ref=${data.trackingRef}&intent=analyze`}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
          >
            Analyser ma photo — 3,99 €
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
            IA entraînée sur &gt; 100 000 paires
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            Protocole photo guidé
          </div>
        </div>
      </div>
    </section>
  );
}
