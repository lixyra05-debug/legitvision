import Link from "next/link";
import type { RelatedPage } from "@/lib/seo/types";

export function RelatedPagesGrid({ pages }: { pages: RelatedPage[] }) {
  if (pages.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-heading text-h2 font-bold">
        Continuer vers d&apos;autres guides
      </h2>
      <p className="mt-2 text-ui text-muted-foreground">
        Les mêmes arnaques peuvent cibler d&apos;autres marques ou d&apos;autres plateformes. Voici les guides les plus proches.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group block rounded-lg border border-line-subtle bg-surface p-4 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
          >
            <h3 className="font-heading text-ui font-semibold text-foreground transition-colors duration-fast group-hover:text-accent">
              {page.label}
            </h3>
            <p className="mt-1 text-caption text-muted-foreground">
              {page.sublabel}
            </p>
            <div className="mt-3 flex items-center gap-1 text-caption font-medium text-accent opacity-0 transition-opacity duration-fast group-hover:opacity-100">
              Lire le guide
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
