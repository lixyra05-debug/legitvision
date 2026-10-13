import { CheckCircle2, AlertTriangle, XCircle, CircleDashed } from "lucide-react";
import { zoneNameIn, type ZoneNames } from "@/lib/zone-names";

export interface Finding {
  zone: string;
  observation: string;
  /** Absente quand l'IA n'a pas noté l'observation : elle s'affiche alors sans note. */
  score?: number;
  severity?: "critical" | "important" | "minor";
}

type Status = "pass" | "warn" | "fail";

/** Une note lisible : un nombre fini. Rien ne valide les observations rendues par l'IA. */
const hasScore = (f: Finding): f is Finding & { score: number } =>
  typeof f.score === "number" && Number.isFinite(f.score);

/**
 * Le jugement d'une observation : la gravité rendue par l'IA, sinon sa note.
 * Sans gravité ni note, null : rien ne permet de juger, et l'observation ne
 * doit surtout pas tomber sur « Suspect » (avant le 13/10, une note absente
 * se comparait à 40 et donnait « Suspect », en rouge, suivi de « /100 » seul).
 */
function resolveStatus(f: Finding): Status | null {
  if (f.severity === "critical") return "fail";
  if (f.severity === "important") return "warn";
  if (f.severity === "minor") return "pass";
  if (!hasScore(f)) return null;
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
    labelColor: "text-verdict-authentic",
    labelBg: "bg-verdict-authentic/10",
    icon: CheckCircle2,
    iconColor: "text-verdict-authentic",
    cardBg: "border-verdict-authentic/15 bg-verdict-authentic/5",
  },
  warn: {
    // « À vérifier » et non « Attention » (décision d'Hector du 05/10).
    label: "À vérifier",
    labelColor: "text-warning",
    labelBg: "bg-warning/10",
    icon: AlertTriangle,
    iconColor: "text-warning",
    cardBg: "border-warning/15 bg-warning/5",
  },
  fail: {
    label: "Suspect",
    labelColor: "text-verdict-fake",
    labelBg: "bg-verdict-fake/10",
    icon: XCircle,
    iconColor: "text-verdict-fake",
    cardBg: "border-verdict-fake/15 bg-verdict-fake/5",
  },
};

/**
 * Observation sans gravité ni note : un libellé et une icône qui ne jugent
 * pas, sans vert, ambre ni rouge. Le commentaire de l'IA reste (décision
 * d'Hector, 2026-10-13 : une observation sans note ne s'affiche pas
 * « Suspect »).
 */
const UNSCORED = {
  label: "Sans note",
  labelColor: "text-muted-foreground",
  labelBg: "bg-surface-raised",
  icon: CircleDashed,
  iconColor: "text-muted-foreground",
  cardBg: "border-line-subtle bg-card",
};

/**
 * `zoneNames` : table des noms des zones du rapport (zoneNamesForReport,
 * lib/zone-names.ts), la même que celle des barres de « Scores par zone ». La
 * zone rendue par l'IA peut être un identifiant ou un texte libre : le titre
 * est son nom en français quand il est connu, sinon l'identifiant rendu
 * lisible.
 */
export function FindingCard({
  zoneNames,
  ...finding
}: Finding & { zoneNames?: ZoneNames | null }) {
  const status = resolveStatus(finding);
  const zoneName = zoneNameIn(zoneNames, finding.zone);
  const { label, labelColor, labelBg, icon: Icon, iconColor, cardBg } =
    status === null ? UNSCORED : STATUS_CONFIG[status];

  return (
    <div className={`rounded-md border p-4 ${cardBg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${iconColor}`} />
        <div className="min-w-0 flex-1">
          {/* La note reste en haut à droite, sur la ligne du nom. Un nom en
              français est plus long qu'un identifiant : s'il ne tient pas avec
              son badge, le badge passe dessous, dans leur groupe, sans emporter
              la note. Les cartes d'une même liste gardent ainsi la même forme. */}
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
              {/* Pas de « capitalize » : il écrirait « Code Date / Puce Rfid ». */}
              {zoneName !== "" && (
                <span className="text-ui font-semibold text-foreground">
                  {zoneName}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-caption font-semibold uppercase tracking-wide ${labelColor} ${labelBg}`}
              >
                {label}
              </span>
            </div>
            {/* Sans note lisible, la place de la note reste vide : jamais
                « /100 » seul. */}
            {hasScore(finding) && (
              <span className="shrink-0 text-caption tabular-nums text-muted-foreground">
                {finding.score}/100
              </span>
            )}
          </div>
          <p className="mt-1.5 text-ui leading-relaxed text-muted-foreground">
            {finding.observation}
          </p>
        </div>
      </div>
    </div>
  );
}
