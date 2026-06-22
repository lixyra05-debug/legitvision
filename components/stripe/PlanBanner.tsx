"use client";

import { Zap, Crown, Infinity } from "lucide-react";
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
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Crown className="size-5 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold">{t("planBanner.businessName")}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Infinity className="size-3" />
              {t("planBanner.businessDesc")}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
          {t("planBanner.active")}
        </span>
      </div>
    );
  }

  if (plan === "pro") {
    const isMultiple = creditsRemaining > 1;
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Zap className="size-5 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold">{t("planBanner.proName")}</p>
            <p className="text-xs text-muted-foreground">
              {creditsRemaining}{" "}
              {isMultiple
                ? t("planBanner.proCreditsRemainingPlural")
                : t("planBanner.proCreditsRemaining")}
            </p>
          </div>
        </div>
        <a
          href="/checkout?plan=business"
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <Crown className="size-3" />
          {t("planBanner.upgradeToBusiness")}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">{t("planBanner.noActiveTitle")}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("planBanner.noActiveDesc")}
        </p>
      </div>
      <div className="flex gap-2">
        <a
          href="/checkout?plan=pro"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <Zap className="size-3" />
          {t("planBanner.proCta")}
        </a>
        <a
          href="/checkout?plan=business"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
        >
          <Crown className="size-3" />
          {t("planBanner.businessCta")}
        </a>
      </div>
    </div>
  );
}
