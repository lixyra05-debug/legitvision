"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Eye,
  AlertCircle,
  ScanText,
  Lightbulb,
  Loader2,
  Upload,
} from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { FindingCard, type Finding } from "./FindingCard";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import { Marque } from "@/components/brand/Marque";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { getScoreColor, getScoreSolidBg } from "@/lib/types";
import type { Verdict, Confidence } from "@/lib/types";
import { REPORT_REFRESH_SECONDS } from "@/lib/analysis-limits";
import { zoneNameIn, zoneNamesForReport, type ZoneNames } from "@/lib/zone-names";

// Un verdict non concluant (score de 45 à 74) s'affiche « Résultat non
// concluant », et plus « Éléments suspects » : un non concluant ne doit jamais
// accuser l'article (décision d'Hector du 06/10). Même texte sur les cartes du
// tableau de bord (getVerdictLabel, lib/types.ts).
const VERDICT_TO_KEY: Record<Verdict, "authentic" | "inconclusive" | "fake"> = {
  likely_authentic: "authentic",
  inconclusive: "inconclusive",
  likely_fake: "fake",
};

// ── Types ──

export interface ReportData {
  id: string;
  brandName: string;
  modelName: string;
  status: string;
  verdict: Verdict | null;
  confidence: Confidence | null;
  aiConfidence: "high" | "medium" | "low" | "insufficient" | null;
  overallScore: number | null;
  subScores: Record<string, number> | null;
  findings: Finding[] | null;
  analystSummary: string | null;
  missingEvidence: string[] | null;
  ocrExtracted: Record<string, string> | null;
  recommendations: string[] | null;
  createdAt: string;
  /** Noms affichés des zones du modèle, par identifiant normalisé (lib/zone-names.ts). */
  zoneNames: ZoneNames | null;
}

// ── Constants ──

// Visual config (icons + colors) — labels résolus via t() côté composant.
const VERDICT_VISUAL: Record<
  Verdict,
  { Icon: typeof ShieldCheck; color: string; bg: string }
> = {
  likely_authentic: {
    Icon: ShieldCheck,
    color: "text-verdict-authentic",
    bg: "border-verdict-authentic/30 bg-verdict-authentic/10",
  },
  // Couleur du verdict non concluant, jamais l'ambre (décision du 04/10).
  inconclusive: {
    Icon: ShieldAlert,
    color: "text-verdict-inconclusive",
    bg: "border-verdict-inconclusive/30 bg-verdict-inconclusive/10",
  },
  likely_fake: {
    Icon: ShieldX,
    color: "text-verdict-fake",
    bg: "border-verdict-fake/30 bg-verdict-fake/10",
  },
};

const CONFIDENCE_VISUAL: Record<
  Confidence,
  { color: string; bg: string }
> = {
  high: {
    color: "text-muted-foreground",
    bg: "border-line bg-surface-raised",
  },
  // L'ambre est réservé à la confiance faible (décision du 04/10) : la
  // confiance moyenne reste neutre.
  medium: {
    color: "text-muted-foreground",
    bg: "border-line bg-surface-raised",
  },
  low: {
    color: "text-warning",
    bg: "border-warning/30 bg-warning/[0.12]",
  },
};

const CONFIDENCE_LABEL_KEY: Record<Confidence, string> = {
  high: "results.confidenceHigh",
  medium: "results.confidenceMedium",
  low: "results.confidenceLow",
};

const CONFIDENCE_DESC_KEY: Record<Confidence, string> = {
  high: "results.confidenceHighDesc",
  medium: "results.confidenceMediumDesc",
  low: "results.confidenceLowDesc",
};

const OCR_LABEL_KEY: Record<string, string> = {
  size_label_text: "results.sizeLabelText",
  product_code: "results.productCode",
  manufacturing_info: "results.manufacturingInfo",
};

// ── Sub-components ──

/**
 * Relit la page (composant serveur) toutes les REPORT_REFRESH_SECONDS tant
 * que l'analyse n'est pas terminée, et dès que l'onglet redevient visible.
 * Chaque relecture passe aussi par la reprise des analyses bloquées
 * (check/[id]/page.tsx) : une analyse abandonnée finit donc affichée en
 * échec, sans action du client. Démonté dès que le statut est final.
 */
function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const interval = setInterval(refreshIfVisible, REPORT_REFRESH_SECONDS * 1000);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [router]);
  return null;
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const textColor = getScoreColor(score);
  const barColor = getScoreSolidBg(score);

  return (
    <div className="space-y-1.5">
      {/* gap-3 : un nom long passe à la ligne avant de toucher sa note. */}
      <div className="flex items-center justify-between gap-3">
        {/* Le nom de la zone, déjà en français : pas de « capitalize », qui
            écrirait « Code Date / Puce Rfid ». */}
        <span className="text-ui text-muted-foreground">{label}</span>
        <span className={`shrink-0 text-ui font-semibold tabular-nums ${textColor}`}>
          {score}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{
            width: `${width}%`,
            transition: "width 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  count,
}: {
  icon: typeof Eye;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-surface-raised">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <h2 className="font-heading text-body font-semibold">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-ui font-normal text-muted-foreground">
            ({count})
          </span>
        )}
      </h2>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ── Main export ──

export function ReportView({ data }: { data: ReportData }) {
  // Pas lancée : envoi des photos pas terminé, ou interrompu (rien ne dit lequel).
  const isNotStarted = data.status === "uploading";
  // Photos toutes envoyées, lancement demandé : la route va la réserver, ou la
  // demande s'est perdue (la reprise la passera en échec).
  const isLaunching = data.status === "pending";
  // Lancée : la route travaille (ou a été coupée ; la reprise la passera en échec).
  const isAnalyzing = data.status === "analyzing";
  const isPending = isNotStarted || isLaunching || isAnalyzing;

  const isFailed = data.status === "failed";

  const isComplete =
    data.status === "completed" || data.status === "expert_review";

  // P1-3 : l'IA a jugé les photos insuffisantes (lu via ai_raw_response.confidence_level)
  const isInsufficient = data.aiConfidence === "insufficient";

  const { t } = useTranslation();
  const verdictCfg = data.verdict ? VERDICT_VISUAL[data.verdict] : null;
  const verdictLabel = data.verdict
    ? t(`results.${VERDICT_TO_KEY[data.verdict]}`)
    : null;
  const confidenceCfg = data.confidence
    ? CONFIDENCE_VISUAL[data.confidence]
    : null;
  const confidenceLabel = data.confidence
    ? t(CONFIDENCE_LABEL_KEY[data.confidence])
    : null;
  const confidenceDesc = data.confidence
    ? t(CONFIDENCE_DESC_KEY[data.confidence])
    : null;

  const subScoreEntries = data.subScores
    ? Object.entries(data.subScores).filter(([, v]) => typeof v === "number")
    : [];

  const findings = data.findings ?? [];

  // Une seule table des noms pour tout le rapport : barres et observations y
  // lisent le nom de leur zone, et deux zones n'y portent jamais le même nom,
  // même quand l'IA en a noté une hors des points du modèle (décision d'Hector
  // du 06/10, lib/zone-names.ts). Toute zone que le rapport affiche doit
  // entrer dans cette liste.
  const zoneNames = zoneNamesForReport(data.zoneNames, [
    ...subScoreEntries.map(([zone]) => zone),
    ...findings.map((finding) => finding?.zone),
  ]);

  const ocrEntries = data.ocrExtracted
    ? Object.entries(data.ocrExtracted).filter(([, v]) => v && v.trim() !== "")
    : [];

  const recommendations = (data.recommendations ?? []).filter(Boolean);
  const missingEvidence = (data.missingEvidence ?? []).filter(Boolean);

  // Le panneau « Photos insuffisantes » est affiché : il porte le bouton vert
  // de l'écran, « Reprendre de meilleures photos ».
  const showsInsufficientPanel = isComplete && isInsufficient;

  return (
    // data-assistant-flux="lg" : la page affiche un rapport, et demande le
    // bouton de l'assistant dans le flux sous 1024 px. C'est ce que lit la
    // variante « assistant-flux: » (tailwind.config.ts) : sous ce seuil, le
    // bouton est rendu après ce bloc (ChatWidget), au lieu de flotter sur la
    // colonne du rapport. Ce bloc n'a alors pas de hauteur minimale : le
    // bouton suit le contenu au lieu d'être repoussé sous l'écran quand le
    // rapport est court. Le fond de <body> est le même (bg-background,
    // min-h-screen) : rien ne change à l'œil.
    <div data-assistant-flux="lg" className="min-h-screen bg-background assistant-flux:min-h-0">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Marque href="/dashboard" />
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {/* Sur téléphone, la flèche seule : son nom reste lu (sr-only) et sa
                cible fait 36 px. Libellé en français (règle 16). */}
            <Link
              href="/dashboard"
              className="flex min-h-9 min-w-9 items-center justify-center gap-1.5 text-ui text-muted-foreground transition-colors duration-fast hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only sm:not-sr-only">Tableau de bord</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* pb-24 : la bulle de l'assistant, flottante, ne couvre pas « Nouvelle
          analyse ». Sous 1024 px, elle est dans le flux, 24 px sous le dernier
          bouton (pb-6) ; sous la même condition qu'elle (assistant-flux), pour
          qu'un navigateur qui la garde flottante garde aussi sa place. */}
      <main className="mx-auto max-w-3xl space-y-6 px-4 pt-8 pb-24 sm:pt-12 assistant-flux:pb-6">
        {/* ── HEADER ── */}
        <div className="space-y-3">
          {/* Photos jugées insuffisantes : pas de badge de verdict (« Résultat non
              concluant » est un verdict facturé) ; le panneau dédié plus bas dit
              « non facturée ». */}
          {verdictCfg && !isInsufficient && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${verdictCfg.bg}`}
            >
              <verdictCfg.Icon className={`size-4 ${verdictCfg.color}`} />
              <span className={`text-ui font-semibold ${verdictCfg.color}`}>
                {verdictLabel}
              </span>
            </div>
          )}
          {isFailed && !verdictCfg && (
            <div className="inline-flex items-center gap-2 rounded-full border border-verdict-fake/30 bg-verdict-fake/10 px-4 py-1.5">
              <ShieldX className="size-4 text-verdict-fake" />
              <span className="text-ui font-semibold text-verdict-fake">
                {t("results.analysisFailedShort")}
              </span>
            </div>
          )}

          <div>
            <h1 className="font-heading text-h2 font-bold">
              {data.brandName}{" "}
              <span className="text-muted-foreground">{data.modelName}</span>
            </h1>
            <p className="mt-1 text-ui text-muted-foreground">
              Analyse #{data.id.slice(0, 8).toUpperCase()} ·{" "}
              {formatDate(data.createdAt)}
            </p>
          </div>
        </div>

        {/* ── PENDING STATE — la page se relit seule jusqu'au statut final ── */}
        {isPending && <AutoRefresh />}
        {isAnalyzing && (
          <div className="flex flex-col items-center gap-6 rounded-lg border border-line-subtle bg-card px-6 py-16">
            <Loader2 className="size-12 animate-spin text-muted-foreground" />
            <div className="text-center">
              <p className="font-heading text-lead font-semibold">
                {t("check.analyzing")}
              </p>
              <p className="mt-1 text-ui text-muted-foreground">
                {t("results.analyzingDesc")}
              </p>
            </div>
          </div>
        )}
        {isLaunching && (
          <div className="flex flex-col items-center gap-6 rounded-lg border border-line-subtle bg-card px-6 py-16">
            <Loader2 className="size-12 animate-spin text-muted-foreground" />
            <div className="text-center">
              <p className="font-heading text-lead font-semibold">
                {t("results.launchingTitle")}
              </p>
              <p className="mt-1 text-ui text-muted-foreground">
                {t("results.launchingDesc")}
              </p>
            </div>
          </div>
        )}
        {isNotStarted && (
          <div className="flex flex-col items-center gap-6 rounded-lg border border-line-subtle bg-card px-6 py-16">
            <Upload className="size-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-heading text-lead font-semibold">
                {t("results.notStartedTitle")}
              </p>
              <p className="mt-1 text-ui text-muted-foreground">
                {t("results.notStartedDesc")}
              </p>
            </div>
          </div>
        )}

        {/* ── FAILED STATE ── */}
        {isFailed && (
          <div className="rounded-lg border border-verdict-fake/20 bg-verdict-fake/5 p-8 text-center">
            <ShieldX className="mx-auto size-10 text-verdict-fake" />
            <p className="mt-3 font-heading text-lead font-semibold">
              {t("results.analysisFailedTitle")}
            </p>
            <p className="mt-1 text-ui text-muted-foreground">
              {t("results.analysisFailedDesc")}
            </p>
          </div>
        )}

        {/* ── RÉSULTAT INCERTAIN (statut « expert_review » : aucune revue humaine n'existe) ──
            Seulement sous un verdict non concluant, jamais sous un verdict rouge
            (scores 40 à 44), et à sa couleur : l'ambre est réservé à la confiance
            faible, qui a son propre encadré plus bas (M20, décision du 04/10). */}
        {data.status === "expert_review" && data.verdict === "inconclusive" && data.confidence !== "low" && !isInsufficient && (
          <div className="flex items-start gap-3 rounded-md border border-verdict-inconclusive/20 bg-verdict-inconclusive/[0.08] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-verdict-inconclusive" />
            <div>
              <p className="text-ui font-semibold text-verdict-inconclusive">
                {t("results.uncertainResultTitle")}
              </p>
              <p className="mt-0.5 text-ui text-muted-foreground">
                {t("results.uncertainResultDesc")}
              </p>
            </div>
          </div>
        )}

        {/* ── INSUFFICIENT — photos insuffisantes (P1-3) ── */}
        {showsInsufficientPanel && (
          <div className="rounded-lg border border-verdict-inconclusive/30 bg-verdict-inconclusive/[0.08] p-6 text-center sm:p-8">
            <ShieldAlert className="mx-auto size-10 text-verdict-inconclusive" />
            <p className="mt-3 font-heading text-lead font-semibold text-verdict-inconclusive">
              {t("results.insufficientTitle")}
            </p>
            <p className="mt-1 text-ui text-muted-foreground">
              {t("results.insufficientDesc")}
            </p>
            {/* Sans opacité : à 80 %, cette phrase tombait à 3,56:1 en thème
                clair sur le fond du panneau (5,38:1 désormais ; 6,87:1 en sombre). */}
            <p className="mt-2 text-caption text-muted-foreground">
              {t("results.insufficientNoCredit")}
            </p>
            {missingEvidence.length > 0 && (
              <div className="mt-5 rounded-md border border-verdict-inconclusive/20 bg-verdict-inconclusive/5 p-4 text-left">
                <p className="mb-2 text-ui font-semibold text-verdict-inconclusive">
                  {t("results.missingEvidenceTitle")}
                </p>
                <ul className="space-y-2">
                  {missingEvidence.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-ui text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-verdict-inconclusive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              href="/check/new"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
            >
              <Plus className="size-4" />
              {t("results.insufficientCta")}
            </Link>
          </div>
        )}

        {/* ── LOW CONFIDENCE WARNING (P1-3) ── */}
        {isComplete && !isInsufficient && data.confidence === "low" && (
          <div className="flex items-start gap-3 rounded-md border border-warning/20 bg-warning/[0.08] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="text-ui font-semibold text-warning">
                {t("results.lowConfidenceWarnTitle")}
              </p>
              <p className="mt-0.5 text-ui text-muted-foreground">
                {t("results.lowConfidenceWarnDesc")}
              </p>
            </div>
          </div>
        )}

        {/* ── MAIN REPORT (completed or expert_review) ── */}
        {isComplete && !isInsufficient && data.overallScore !== null && (
          <>
            {/* Score + Confidence */}
            <div className="rounded-lg border border-line-subtle bg-card p-6">
              <ScoreGauge score={data.overallScore} size={220} />

              {/* Confiance faible : un seul encadré ambre, le bandeau placé
                  avant le score (décision d'Hector du 05/10). Ce bloc ne
                  s'affiche qu'en confiance haute ou modérée. */}
              {confidenceCfg && data.confidence !== "low" && (
                <div
                  className={`mt-6 rounded-md border p-4 ${confidenceCfg.bg}`}
                >
                  <div className="flex items-center gap-2">
                    <Eye className={`size-4 ${confidenceCfg.color}`} />
                    <span
                      className={`text-ui font-semibold ${confidenceCfg.color}`}
                    >
                      {confidenceLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-ui text-muted-foreground">
                    {confidenceDesc}
                  </p>
                </div>
              )}

              {/* bg-surface-raised et non bg-surface : le parent est bg-card,
                  et --card dérive de --surface — l'encart se confondrait avec lui. */}
              {data.analystSummary && (
                <div className="mt-4 rounded-md border border-line-subtle bg-surface-raised p-4">
                  <p className="text-ui leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {t("results.summary")} :{" "}
                    </span>
                    {data.analystSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Sub-scores */}
            {subScoreEntries.length > 0 && (
              <div className="space-y-4 rounded-lg border border-line-subtle bg-card p-6">
                <SectionTitle
                  icon={Eye}
                  title={t("results.subScoresTitle")}
                  count={subScoreEntries.length}
                />
                <RevealGroup className="mt-2 grid gap-4 sm:grid-cols-2">
                  {subScoreEntries.map(([zone, score]) => (
                    <RevealItem key={zone} className="h-full">
                      {/* Note sans nom de zone (clé vide ou faite de
                          séparateurs, réponse de l'IA mal formée) : la note
                          reste affichée, sous un libellé neutre. */}
                      <SubScoreBar
                        label={zoneNameIn(zoneNames, zone) || t("results.unnamedZone")}
                        score={score}
                      />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            {/* Findings */}
            {findings.length > 0 && (
              <div className="space-y-4">
                <SectionTitle
                  icon={ShieldCheck}
                  title={t("results.findingsTitle")}
                  count={findings.length}
                />
                <RevealGroup className="space-y-3">
                  {findings.map((f, i) => (
                    <RevealItem key={i}>
                      <FindingCard {...f} zoneNames={zoneNames} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            {/* Missing evidence */}
            {missingEvidence.length > 0 && (
              <div className="space-y-4">
                <SectionTitle
                  icon={AlertCircle}
                  title={t("results.missingEvidenceTitle")}
                  count={missingEvidence.length}
                />
                <div className="rounded-md border border-verdict-inconclusive/20 bg-verdict-inconclusive/5 p-4">
                  <ul className="space-y-2">
                    {missingEvidence.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-ui text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-verdict-inconclusive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* OCR */}
            {ocrEntries.length > 0 && (
              <div className="space-y-4">
                <SectionTitle icon={ScanText} title={t("results.ocrTitle")} />
                <div className="divide-y divide-line-subtle rounded-md border border-line-subtle bg-card">
                  {ocrEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                    >
                      <span className="text-ui text-muted-foreground">
                        {OCR_LABEL_KEY[key]
                          ? t(OCR_LABEL_KEY[key])
                          : key.replace(/_/g, " ")}
                      </span>
                      <span className="text-right font-mono text-ui text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-4">
                <SectionTitle
                  icon={Lightbulb}
                  title={t("results.recommendationsTitle")}
                  count={recommendations.length}
                />
                <RevealGroup className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <RevealItem key={i}>
                      <div className="flex items-start gap-3 rounded-md border border-line-subtle bg-card px-4 py-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-raised text-caption font-bold text-muted-foreground">
                          {i + 1}
                        </span>
                        <p className="text-ui leading-relaxed text-muted-foreground">
                          {rec}
                        </p>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}
          </>
        )}

        {/* ── ACTIONS ──
            Un seul bouton vert sur l'écran « Photos insuffisantes » (décision
            d'Hector du 06/10) : quand son panneau est affiché, le bouton
            « Reprendre de meilleures photos » mène déjà à une nouvelle analyse.
            « Nouvelle analyse » n'est pas répété ici, « Tableau de bord » reste. */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-line px-5 py-3 text-ui font-medium transition-colors duration-fast hover:border-line-strong hover:bg-surface-raised"
          >
            <ArrowLeft className="size-4" />
            {t("nav.dashboard")}
          </Link>
          {!showsInsufficientPanel && (
            <Link
              href="/check/new"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              <Plus className="size-4" />
              {t("results.newAnalysis")}
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
