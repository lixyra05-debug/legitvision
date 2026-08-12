"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { FindingCard, type Finding } from "./FindingCard";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { getScoreColor, getScoreSolidBg } from "@/lib/types";
import type { Verdict, Confidence } from "@/lib/types";

const VERDICT_TO_KEY: Record<Verdict, "authentic" | "suspect" | "fake"> = {
  likely_authentic: "authentic",
  inconclusive: "suspect",
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
  inconclusive: {
    Icon: ShieldAlert,
    color: "text-warning",
    bg: "border-warning/30 bg-warning/10",
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
  medium: {
    color: "text-warning",
    bg: "border-warning/20 bg-warning/[0.08]",
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
      <div className="flex items-center justify-between">
        <span className="text-ui capitalize text-muted-foreground">
          {label.replace(/_/g, " ")}
        </span>
        <span className={`text-ui font-semibold tabular-nums ${textColor}`}>
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
  const isPending =
    data.status === "pending" ||
    data.status === "uploading" ||
    data.status === "analyzing";

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

  const ocrEntries = data.ocrExtracted
    ? Object.entries(data.ocrExtracted).filter(([, v]) => v && v.trim() !== "")
    : [];

  const recommendations = (data.recommendations ?? []).filter(Boolean);
  const missingEvidence = (data.missingEvidence ?? []).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-ui text-muted-foreground transition-colors duration-fast hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-12">
        {/* ── HEADER ── */}
        <div className="space-y-3">
          {verdictCfg && (
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

        {/* ── PENDING STATE ── */}
        {isPending && (
          <div className="flex flex-col items-center gap-6 rounded-lg border border-line-subtle bg-card py-16">
            <Loader2 className="size-12 animate-spin text-muted-foreground" />
            <div className="text-center">
              <p className="font-heading text-lead font-semibold">
                {t("check.analyzing")}
              </p>
              <p className="mt-1 text-ui text-muted-foreground">
                {t("results.expertReviewDesc")}
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

        {/* ── EXPERT REVIEW NOTICE ── */}
        {data.status === "expert_review" && data.confidence !== "low" && (
          <div className="flex items-start gap-3 rounded-md border border-warning/20 bg-warning/[0.08] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="text-ui font-semibold text-warning">
                {t("results.expertReviewTitle")}
              </p>
              <p className="mt-0.5 text-ui text-muted-foreground">
                {t("results.expertReviewDesc")}
              </p>
            </div>
          </div>
        )}

        {/* ── INSUFFICIENT — photos insuffisantes (P1-3) ── */}
        {isComplete && isInsufficient && (
          <div className="rounded-lg border border-verdict-inconclusive/30 bg-verdict-inconclusive/[0.08] p-6 text-center sm:p-8">
            <ShieldAlert className="mx-auto size-10 text-verdict-inconclusive" />
            <p className="mt-3 font-heading text-lead font-semibold text-verdict-inconclusive">
              {t("results.insufficientTitle")}
            </p>
            <p className="mt-1 text-ui text-muted-foreground">
              {t("results.insufficientDesc")}
            </p>
            <p className="mt-2 text-caption text-muted-foreground/80">
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

              {confidenceCfg && (
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

              {data.analystSummary && (
                {/* bg-surface-raised et non bg-surface : le parent est bg-card,
                    et --card dérive de --surface — l'encart se confondrait avec lui. */}
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
                      <SubScoreBar label={zone} score={score} />
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
                      <FindingCard {...f} />
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

        {/* ── ACTIONS ── */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-line px-5 py-3 text-ui font-medium transition-colors duration-fast hover:border-line-strong hover:bg-surface-raised"
          >
            <ArrowLeft className="size-4" />
            {t("nav.dashboard")}
          </Link>
          <Link
            href="/check/new"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
          >
            <Plus className="size-4" />
            {t("results.newAnalysis")}
          </Link>
        </div>
      </main>
    </div>
  );
}
