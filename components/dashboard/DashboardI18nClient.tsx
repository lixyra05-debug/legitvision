"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

/**
 * Libellé du solde de l'en-tête. Sur téléphone, il n'est pas affiché, mais les
 * lecteurs d'écran le lisent : « 12 crédits », et non « 12 ».
 */
export function DashboardCreditsLabel() {
  const { t } = useTranslation();
  return (
    <span className="sr-only text-muted-foreground sm:not-sr-only">
      {t("dashboard.credits")}
    </span>
  );
}

export function DeleteAnalysisTitle() {
  const { t } = useTranslation();
  return t("dashboard.deleteAnalysis");
}

/** Analyse que l'IA a jugée sur photos insuffisantes : non facturée, même libellé que le rapport. */
export function InsufficientLabel() {
  const { t } = useTranslation();
  return <>{t("results.insufficientTitle")}</>;
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

/**
 * Pagination de l'historique : plus récentes à gauche (page précédente), plus
 * anciennes à droite. Rien quand tout tient sur une page.
 */
export function DashboardPagination({
  page,
  pageCount,
  total,
}: {
  page: number;
  pageCount: number;
  total: number;
}) {
  const { t } = useTranslation();
  if (pageCount <= 1) return null;
  const href = (n: number) => (n <= 1 ? "/dashboard" : `/dashboard?page=${n}`);
  const linkClass =
    "inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-4 text-ui font-medium transition-colors duration-fast hover:border-line-strong hover:bg-surface-hover";
  return (
    <nav
      aria-label={t("dashboard.pagination")}
      className="mt-8 flex flex-wrap items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass}>
          <ChevronLeft className="size-4" />
          {t("dashboard.newer")}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <p className="text-ui text-muted-foreground">
        {t("dashboard.page")} {page} {t("dashboard.pageOf")} {pageCount} · {total}{" "}
        {total > 1 ? t("dashboard.analysesCountPlural") : t("dashboard.analysesCount")}
      </p>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={linkClass}>
          {t("dashboard.older")}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
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
