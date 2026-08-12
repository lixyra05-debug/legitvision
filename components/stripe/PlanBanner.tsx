"use client";

import { Zap, Crown } from "lucide-react";
import type { PlanId } from "@/lib/stripe/config";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface PlanBannerProps {
  plan: PlanId;
  creditsRemaining: number;
}

export function PlanBanner({ plan, creditsRemaining }: PlanBannerProps) {
  const { t } = useTranslation();

  if (plan === "business") {
    return (
      <div className="flex items-center justify-between rounded-md border border-line bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Crown className="size-5 text-muted-foreground" />
          <div>
            <p className="text-ui font-semibold">{t("planBanner.businessName")}</p>
            <p className="text-caption text-muted-foreground">
              {t("planBanner.businessDesc")}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
          {t("planBanner.active")}
        </span>
      </div>
    );
  }

  if (plan === "pro") {
    const isMultiple = creditsRemaining > 1;
    return (
      <div className="flex items-center justify-between rounded-md border border-line bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <Zap className="size-5 text-muted-foreground" />
          <div>
            <p className="text-ui font-semibold">{t("planBanner.proName")}</p>
            <p className="text-caption text-muted-foreground">
              {creditsRemaining}{" "}
              {isMultiple
                ? t("planBanner.proCreditsRemainingPlural")
                : t("planBanner.proCreditsRemaining")}
            </p>
          </div>
        </div>
        <a
          href="/checkout?plan=business"
          className="flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-caption font-medium text-accent transition-colors duration-fast hover:bg-accent/20"
        >
          <Crown className="size-3" />
          {t("planBanner.upgradeToBusiness")}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-ui font-semibold">{t("planBanner.noActiveTitle")}</p>
        <p className="mt-0.5 text-caption text-muted-foreground">
          {t("planBanner.noActiveDesc")}
        </p>
      </div>
      <div className="flex gap-2">
        <a
          href="/checkout?plan=pro"
          className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-caption font-semibold text-accent transition-colors duration-fast hover:bg-accent/20"
        >
          <Zap className="size-3" />
          {t("planBanner.proCta")}
        </a>
        <a
          href="/checkout?plan=business"
          className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-caption font-medium text-muted-foreground transition-colors duration-fast hover:border-line-strong hover:text-foreground"
        >
          <Crown className="size-3" />
          {t("planBanner.businessCta")}
        </a>
      </div>
    </div>
  );
}
