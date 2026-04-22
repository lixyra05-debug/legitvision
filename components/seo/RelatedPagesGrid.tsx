import Link from "next/link";
import type { RelatedPage } from "@/lib/seo/types";

export function RelatedPagesGrid({ pages }: { pages: RelatedPage[] }) {
  if (pages.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        Continuer vers d&apos;autres guides
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Les mêmes arnaques peuvent cibler d&apos;autres marques ou d&apos;autres plateformes. Voici les guides les plus proches.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
          >
            <h3 className="font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-300">
              {page.label}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{page.sublabel}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
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
