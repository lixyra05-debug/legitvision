import type { AuthSignal } from "@/lib/seo/types";

const DIFFICULTY_LABELS = {
  1: "Facile",
  2: "Intermédiaire",
  3: "Expert",
} as const;

const DIFFICULTY_STYLES = {
  1: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  2: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  3: "bg-rose-500/10 text-rose-300 border-rose-500/30",
} as const;

export function SignalCard({
  signal,
  index,
}: {
  signal: AuthSignal;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-heading text-sm font-bold text-emerald-400">
          {String(index + 1).padStart(2, "0")}
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[signal.difficulty]}`}
        >
          {DIFFICULTY_LABELS[signal.difficulty]}
        </span>
      </div>

      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
        {signal.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {signal.description}
      </p>
    </article>
  );
}
