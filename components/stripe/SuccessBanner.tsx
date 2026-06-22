"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function SuccessBanner({
  variant = "purchase",
}: {
  variant?: "purchase" | "planChange";
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  // Retirer le session_id de l'URL sans recharger la page
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("session_id");
    url.searchParams.delete("plan_changed");
    window.history.replaceState({}, "", url.toString());
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">
            {t(variant === "planChange" ? "successBanner.planChangeTitle" : "successBanner.title")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(variant === "planChange" ? "successBanner.planChangeDesc" : "successBanner.desc")}
          </p>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
