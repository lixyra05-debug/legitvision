import type { ScamPattern } from "@/lib/seo/types";

const FREQUENCY_LABELS = {
  "very-common": "Très fréquent",
  common: "Fréquent",
  occasional: "Occasionnel",
} as const;

export function ScamAlert({ scam }: { scam: ScamPattern }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-foreground">
              {scam.title}
            </h3>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
              {FREQUENCY_LABELS[scam.frequency]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {scam.description}
          </p>
        </div>
      </div>
    </article>
  );
}
