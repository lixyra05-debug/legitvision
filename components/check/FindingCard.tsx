import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export interface Finding {
  zone: string;
  observation: string;
  score: number;
  severity?: "critical" | "important" | "minor";
}

type Status = "pass" | "warn" | "fail";

function resolveStatus(f: Finding): Status {
  if (f.severity === "critical") return "fail";
  if (f.severity === "important") return "warn";
  if (f.severity === "minor") return "pass";
  if (f.score >= 70) return "pass";
  if (f.score >= 40) return "warn";
  return "fail";
}

const STATUS_CONFIG: Record<
  Status,
  {
    label: string;
    labelColor: string;
    labelBg: string;
    icon: typeof CheckCircle2;
    iconColor: string;
    cardBg: string;
  }
> = {
  pass: {
    label: "Conforme",
    labelColor: "text-emerald-400",
    labelBg: "bg-emerald-500/10",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    cardBg: "border-emerald-500/15 bg-emerald-500/5",
  },
  warn: {
    label: "Attention",
    labelColor: "text-yellow-400",
    labelBg: "bg-yellow-500/10",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    cardBg: "border-yellow-500/15 bg-yellow-500/5",
  },
  fail: {
    label: "Suspect",
    labelColor: "text-red-400",
    labelBg: "bg-red-500/10",
    icon: XCircle,
    iconColor: "text-red-500",
    cardBg: "border-red-500/15 bg-red-500/5",
  },
};

export function FindingCard(finding: Finding) {
  const status = resolveStatus(finding);
  const { label, labelColor, labelBg, icon: Icon, iconColor, cardBg } =
    STATUS_CONFIG[status];

  return (
    <div className={`rounded-xl border p-4 ${cardBg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${iconColor}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold capitalize text-foreground">
              {finding.zone.replace(/_/g, " ")}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${labelColor} ${labelBg}`}
            >
              {label}
            </span>
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {finding.score}/100
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {finding.observation}
          </p>
        </div>
      </div>
    </div>
  );
}
