"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import {
  getStatusLabel,
  getVerdictLabel,
  type AnalysisStatus,
  type Verdict,
} from "@/lib/types";

/**
 * Composants client pour la page /dashboard (server component avec metadata).
 * Permet l'i18n FR/EN sans casser le SSR.
 */

export function DashboardGreeting({
  firstName,
  count,
}: {
  firstName: string;
  count: number;
}) {
  const { t } = useTranslation();
  const isMultiple = count > 1;
  return (
    <>
      <h1 className="font-heading text-h2 font-bold">
        {t("dashboard.greeting")}, {firstName} 👋
      </h1>
      <p className="mt-1 text-ui text-muted-foreground">
        {count === 0
          ? t("dashboard.readyFirstCheck")
          : `${count} ${
              isMultiple
                ? t("dashboard.analysesCountPlural")
                : t("dashboard.analysesCount")
            } ${
              isMultiple
                ? t("dashboard.analysesPerformedPlural")
                : t("dashboard.analysesPerformed")
            }`}
      </p>
    </>
  );
}

export function DashboardNewAnalysisButton() {
  const { t } = useTranslation();
  return (
    <Link
      href="/check/new"
      className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
    >
      <Plus className="size-4" />
      {t("dashboard.newAnalysis")}
    </Link>
  );
}

export function DashboardEmptyState() {
  const { t } = useTranslation();
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-line py-20 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-lg bg-surface-raised">
        <Plus className="size-8 text-muted-foreground" />
      </div>
      <p className="text-lead font-medium">{t("dashboard.noAnalyses")}</p>
      <p className="mt-2 max-w-sm text-ui text-muted-foreground">
        {t("dashboard.noAnalysesDesc")}
      </p>
      <Link
        href="/check/new"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-accent px-5 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
      >
        <Plus className="size-4" />
        {t("dashboard.startAnalysis")}
      </Link>
    </div>
  );
}

export function DashboardCreditsLabel() {
  const { t } = useTranslation();
  return (
    <span className="hidden text-muted-foreground sm:inline">
      {t("dashboard.credits")}
    </span>
  );
}

export function DeleteAnalysisTitle() {
  const { t } = useTranslation();
  return t("dashboard.deleteAnalysis");
}

/** Verdict label localized (delegates to lib/types.getVerdictLabel) */
export function VerdictLabel({ verdict }: { verdict: Verdict }) {
  const { locale } = useTranslation();
  return <>{getVerdictLabel(verdict, locale)}</>;
}

/** Status label localized */
export function StatusLabel({ status }: { status: AnalysisStatus }) {
  const { locale } = useTranslation();
  return <>{getStatusLabel(status, locale)}</>;
}

/** Date formatted according to current locale (fr-FR / en-US) */
export function FormattedDate({ value }: { value: string }) {
  const { locale } = useTranslation();
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const formatted = new Date(value).toLocaleDateString(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return <>{formatted}</>;
}
