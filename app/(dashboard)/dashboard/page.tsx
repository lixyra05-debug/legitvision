import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Coins, Trash2 } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PlanBanner } from "@/components/stripe/PlanBanner";
import { SuccessBanner } from "@/components/stripe/SuccessBanner";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import {
  DashboardGreeting,
  DashboardNewAnalysisButton,
  DashboardEmptyState,
  DashboardCreditsLabel,
  VerdictLabel,
  StatusLabel,
  InsufficientLabel,
  FormattedDate,
  DashboardPagination,
} from "@/components/dashboard/DashboardI18nClient";
import { deleteAnalysis } from "./actions";
import { staleKind } from "@/lib/analysis-limits";
import { expireStaleAnalyses } from "@/lib/analysis-stale";
import {
  historyWindow,
  lookupCatalogNames,
  parseHistoryPage,
} from "@/lib/analysis-history";
import {
  getScoreColor,
  getScoreBgColor,
  type AnalysisWithDetails,
  type Profile,
} from "@/lib/types";

const DELETABLE_STATUSES = ["failed", "uploading", "pending"];

export const metadata = {
  title: "Dashboard",
};

type AnalysisRow = Omit<AnalysisWithDetails, "brand_name" | "brand_slug" | "model_name"> & {
  // Jointures facultatives : null si la marque ou le modèle a été désactivé
  // depuis (RLS « is_active = true »). Les noms sont alors relus en admin.
  brands: { name: string; slug: string } | null;
  models: { name: string } | null;
};

export default async function DashboardPage(
  props: {
    searchParams: Promise<{
      session_id?: string;
      plan_changed?: string;
      purchased?: string;
      page?: string | string[];
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Profil (crédits) et nombre TOTAL d'analyses : l'historique est paginé,
  // toutes les analyses restent accessibles.
  const [{ data: profile }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>(),
    supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);
  const total = count ?? 0;
  const { page, pageCount, from, to } = historyWindow(
    parseHistoryPage(searchParams.page),
    total,
  );

  // Page d'analyses, plus récentes d'abord (id départage deux dates égales :
  // l'ordre reste stable d'une page à l'autre). Jointures SANS !inner : une
  // analyse dont la marque ou le modèle a été désactivé reste listée.
  const { data: analyses } = await supabase
    .from("analyses")
    .select(
      `
      *,
      brands(name, slug),
      models(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  const rows = (analyses ?? []) as unknown as AnalysisRow[];

  // Analyses abandonnées (fonction coupée, client parti pendant l'envoi,
  // demande de lancement perdue) : classées « failed » ici, comme sur leur
  // page. Aucun débit possible sur ce chemin : voir lib/analysis-stale.ts.
  // Noms manquants relus en admin.
  const now = Date.now();
  const staleRows = rows.filter((a) => staleKind(a.status, a.updated_at, now) !== null);
  const unnamed = rows.filter((a) => !a.brands || !a.models);
  let expired = new Set<string>();
  let names: Awaited<ReturnType<typeof lookupCatalogNames>> | null = null;
  if (staleRows.length > 0 || unnamed.length > 0) {
    const admin = createAdminClient();
    [expired, names] = await Promise.all([
      staleRows.length > 0
        ? expireStaleAnalyses(admin, user.id, staleRows, now)
        : Promise.resolve(new Set<string>()),
      unnamed.length > 0
        ? lookupCatalogNames(
            admin,
            unnamed.map((a) => a.brand_id),
            unnamed.map((a) => a.model_id),
          )
        : Promise.resolve(null),
    ]);
  }

  const formattedAnalyses: AnalysisWithDetails[] = rows.map(
    ({ brands, models, ...a }) => {
      const brand = brands ?? names?.brands.get(a.brand_id) ?? null;
      const model = models ?? names?.models.get(a.model_id) ?? null;
      return {
        ...a,
        status: expired.has(a.id) ? "failed" : a.status,
        brand_name: brand?.name ?? "",
        brand_slug: brand?.slug ?? "",
        model_name: model?.name ?? "",
      };
    }
  );

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={240}
              height={64}
              className="h-16 w-auto"
              priority
              fetchPriority="high"
            />
          </Link>
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-ui">
                {/* Icône neutre : le vert était constant, y compris à 0 crédit —
                    il ne signalait donc pas le solde, il le décorait. */}
                <Coins className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {profile.credits_remaining}
                </span>
                <DashboardCreditsLabel />
              </div>
            )}
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Bandeau succès Stripe */}
        {searchParams.session_id && (
          <SuccessBanner variant={searchParams.purchased === "single" ? "single" : "purchase"} />
        )}
        {searchParams.plan_changed && <SuccessBanner variant="planChange" />}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <DashboardGreeting
              firstName={firstName ?? ""}
              count={total}
            />
          </div>
          <DashboardNewAnalysisButton />
        </div>

        {/* Bandeau plan actuel */}
        {profile && (
          <div className="mt-6">
            <PlanBanner
              plan={(profile.subscription_plan as "free" | "pro" | "business") ?? "free"}
              creditsRemaining={profile.credits_remaining}
            />
          </div>
        )}

        {/* Analyses list */}
        {formattedAnalyses.length === 0 ? (
          <DashboardEmptyState />
        ) : (
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formattedAnalyses.map((analysis) => {
              const isDeletable = DELETABLE_STATUSES.includes(analysis.status);
              const deleteAction = deleteAnalysis.bind(null, analysis.id);
              // Même règle que le rapport (check/[id]) : photos jugées insuffisantes par
              // l'IA → analyse non facturée, ni score ni verdict affichés.
              const insufficient =
                (analysis.ai_raw_response as { confidence_level?: string } | null)
                  ?.confidence_level === "insufficient";

              return (
                <RevealItem key={analysis.id}>
                  {/* h-full : le RevealItem s'intercale entre la grille et la carte
                      et absorbe l'étirement de align-items:stretch. Sans lui, les
                      cartes d'une même rangée cessent d'être à la même hauteur. */}
                  <div className="group relative h-full rounded-lg border border-line-subtle bg-surface transition-colors duration-fast hover:border-line">
                    {/* Bouton Supprimer — visible au survol pour les analyses bloquées */}
                    {isDeletable && (
                      <form action={deleteAction}>
                        <button
                          type="submit"
                          title="Supprimer cette analyse"
                          className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity duration-fast hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    )}

                    <Link
                      href={`/check/${analysis.id}`}
                      className="block p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="pr-6">
                          <p className="font-heading text-ui font-semibold">
                            {analysis.brand_name}
                          </p>
                          <p className="text-ui text-muted-foreground">
                            {analysis.model_name}
                          </p>
                        </div>
                        {insufficient ? null : analysis.overall_score != null ? (
                          <div
                            className={`flex size-12 shrink-0 items-center justify-center rounded-md border ${getScoreBgColor(analysis.overall_score)}`}
                          >
                            <span
                              className={`font-heading text-lead font-bold ${getScoreColor(analysis.overall_score)}`}
                            >
                              {analysis.overall_score}
                            </span>
                          </div>
                        ) : (
                          // Pas encore de score : contour pointillé neutre, sans teinte de
                          // verdict, pour ne pas se confondre avec un score non concluant.
                          <div
                            className={`flex h-7 shrink-0 items-center rounded-full px-3 text-caption ${
                              analysis.status === "failed"
                                ? "bg-destructive/10 text-destructive"
                                : "border border-dashed border-line-strong text-muted-foreground"
                            }`}
                          >
                            <StatusLabel status={analysis.status} />
                          </div>
                        )}
                      </div>

                      {insufficient ? (
                        <p className="mt-3 text-ui font-medium text-muted-foreground">
                          <InsufficientLabel />
                        </p>
                      ) : (
                        analysis.verdict && (
                          <p
                            className={`mt-3 text-ui font-medium ${getScoreColor(analysis.overall_score ?? 0)}`}
                          >
                            <VerdictLabel verdict={analysis.verdict} />
                          </p>
                        )
                      )}

                      <p className="mt-3 text-caption text-muted-foreground">
                        <FormattedDate value={analysis.created_at} />
                      </p>
                    </Link>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}

        <DashboardPagination page={page} pageCount={pageCount} total={total} />
      </main>
    </div>
  );
}
