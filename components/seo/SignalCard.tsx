import type { AuthSignal } from "@/lib/seo/types";

const DIFFICULTY_LABELS = {
  1: "Facile",
  2: "Intermédiaire",
  3: "Expert",
} as const;

const DIFFICULTY_STYLES = {
  1: "border-line text-muted-foreground",
  2: "border-line text-foreground",
  3: "border-line-strong text-foreground font-semibold",
} as const;

export function SignalCard({
  signal,
  index,
}: {
  signal: AuthSignal;
  index: number;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-lg border border-line-subtle bg-surface p-6 transition-colors duration-fast hover:border-line hover:bg-surface-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-raised font-heading text-ui font-bold text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-caption font-medium ${DIFFICULTY_STYLES[signal.difficulty]}`}
        >
          {DIFFICULTY_LABELS[signal.difficulty]}
        </span>
      </div>

      <h3 className="mt-4 font-heading text-h4 font-semibold text-foreground">
        {signal.title}
      </h3>
      <p className="mt-2 text-ui leading-relaxed text-muted-foreground">
        {signal.description}
      </p>
    </article>
  );
}
