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
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
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

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; Icon: typeof ShieldCheck; color: string; bg: string }
> = {
  likely_authentic: {
    label: "Probablement authentique",
    Icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "border-emerald-500/30 bg-emerald-500/10",
  },
  inconclusive: {
    label: "Résultat non concluant",
    Icon: ShieldAlert,
    color: "text-yellow-400",
    bg: "border-yellow-500/30 bg-yellow-500/10",
  },
  likely_fake: {
    label: "Probablement contrefait",
    Icon: ShieldX,
    color: "text-red-400",
    bg: "border-red-500/30 bg-red-500/10",
  },
};

const CONFIDENCE_CONFIG: Record<
  Confidence,
  { label: string; desc: string; color: string; bg: string }
> = {
  high: {
    label: "Haute confiance",
    desc: "L'IA a pu analyser clairement l'ensemble des éléments clés.",
    color: "text-emerald-400",
    bg: "border-emerald-500/20 bg-emerald-500/8",
  },
  medium: {
    label: "Confiance modérée",
    desc: "Certains éléments restent difficiles à évaluer avec les photos fournies.",
    color: "text-yellow-400",
    bg: "border-yellow-500/20 bg-yellow-500/8",
  },
  low: {
    label: "Faible confiance",
    desc: "Les photos ne permettent pas une analyse suffisamment précise.",
    color: "text-orange-400",
    bg: "border-orange-500/20 bg-orange-500/8",
  },
};

const OCR_LABELS: Record<string, string> = {
  size_label_text: "Étiquette taille",
  product_code: "Code produit",
  manufacturing_info: "Infos fabrication",
};

// ── Sub-components ──

function SubScoreBar({ label, score }: { label: string; score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const textColor =
    score >= 75
      ? "text-emerald-400"
      : score >= 45
        ? "text-yellow-400"
        : "text-red-400";
  const barColor =
    score >= 75
      ? "bg-emerald-500"
      : score >= 45
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm capitalize text-muted-foreground">
          {label.replace(/_/g, " ")}
        </span>
        <span className={`text-sm font-semibold tabular-nums ${textColor}`}>
          {score}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
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
      <div className="flex size-8 items-center justify-center rounded-lg bg-white/5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <h2 className="font-heading text-base font-semibold">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
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

  const { t } = useTranslation();
  const verdictCfg = data.verdict ? VERDICT_CONFIG[data.verdict] : null;
  const verdictLabel = data.verdict
    ? t(`results.${VERDICT_TO_KEY[data.verdict]}`)
    : null;
  const confidenceCfg = data.confidence
    ? CONFIDENCE_CONFIG[data.confidence]
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
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
              unoptimized
            />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
              <span className={`text-sm font-semibold ${verdictCfg.color}`}>
                {verdictLabel}
              </span>
            </div>
          )}
          {isFailed && !verdictCfg && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5">
              <ShieldX className="size-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                Analyse échouée
              </span>
            </div>
          )}

          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {data.brandName}{" "}
              <span className="text-muted-foreground">{data.modelName}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Analyse #{data.id.slice(0, 8).toUpperCase()} ·{" "}
              {formatDate(data.createdAt)}
            </p>
          </div>
        </div>

        {/* ── PENDING STATE ── */}
        {isPending && (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-card py-16">
            <Loader2 className="size-12 animate-spin text-emerald-500" />
            <div className="text-center">
              <p className="font-heading text-lg font-semibold">
                Analyse en cours…
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                L&apos;IA examine les photos, cela peut prendre quelques
                secondes.
              </p>
            </div>
          </div>
        )}

        {/* ── FAILED STATE ── */}
        {isFailed && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <ShieldX className="mx-auto size-10 text-red-500" />
            <p className="mt-3 font-heading text-lg font-semibold">
              L&apos;analyse a échoué
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Une erreur est survenue lors du traitement. Veuillez réessayer.
            </p>
          </div>
        )}

        {/* ── EXPERT REVIEW NOTICE ── */}
        {data.status === "expert_review" && (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/8 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-yellow-500" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">
                Revue par un expert en cours
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ce résultat est en cours de vérification par un expert humain.
                Les résultats ci-dessous sont préliminaires.
              </p>
            </div>
          </div>
        )}

        {/* ── MAIN REPORT (completed or expert_review) ── */}
        {isComplete && data.overallScore !== null && (
          <>
            {/* Score + Confidence */}
            <div className="rounded-2xl border border-white/5 bg-card p-6">
              <ScoreGauge score={data.overallScore} size={220} />

              {confidenceCfg && (
                <div
                  className={`mt-6 rounded-xl border p-4 ${confidenceCfg.bg}`}
                >
                  <div className="flex items-center gap-2">
                    <Eye className={`size-4 ${confidenceCfg.color}`} />
                    <span
                      className={`text-sm font-semibold ${confidenceCfg.color}`}
                    >
                      {confidenceCfg.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {confidenceCfg.desc}
                  </p>
                </div>
              )}

              {data.analystSummary && (
                <div className="mt-4 rounded-xl border border-white/5 bg-white/3 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Résumé :{" "}
                    </span>
                    {data.analystSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Sub-scores */}
            {subScoreEntries.length > 0 && (
              <div className="space-y-4 rounded-2xl border border-white/5 bg-card p-6">
                <SectionTitle
                  icon={Eye}
                  title={t("results.subScoresTitle")}
                  count={subScoreEntries.length}
                />
                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                  {subScoreEntries.map(([zone, score]) => (
                    <SubScoreBar key={zone} label={zone} score={score} />
                  ))}
                </div>
              </div>
            )}

            {/* Findings */}
            {findings.length > 0 && (
              <div className="space-y-4">
                <SectionTitle
                  icon={ShieldCheck}
                  title="Observations détaillées"
                  count={findings.length}
                />
                <div className="space-y-3">
                  {findings.map((f, i) => (
                    <FindingCard key={i} {...f} />
                  ))}
                </div>
              </div>
            )}

            {/* Missing evidence */}
            {missingEvidence.length > 0 && (
              <div className="space-y-4">
                <SectionTitle
                  icon={AlertCircle}
                  title="Éléments manquants"
                  count={missingEvidence.length}
                />
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <ul className="space-y-2">
                    {missingEvidence.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-orange-500" />
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
                <SectionTitle icon={ScanText} title="Textes détectés (OCR)" />
                <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-card">
                  {ocrEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                    >
                      <span className="text-sm text-muted-foreground">
                        {OCR_LABELS[key] ?? key.replace(/_/g, " ")}
                      </span>
                      <span className="text-right font-mono text-sm text-foreground">
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
                  title="Recommandations"
                  count={recommendations.length}
                />
                <div className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-white/5 bg-card px-4 py-3"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-500">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ACTIONS ── */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <ArrowLeft className="size-4" />
            Retour au dashboard
          </Link>
          <Link
            href="/check/new"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <Plus className="size-4" />
            Nouvelle analyse
          </Link>
        </div>
      </main>
    </div>
  );
}
