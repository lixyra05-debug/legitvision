import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Coins, Trash2 } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PlanBanner } from "@/components/stripe/PlanBanner";
import { SuccessBanner } from "@/components/stripe/SuccessBanner";
import {
  DashboardGreeting,
  DashboardNewAnalysisButton,
  DashboardEmptyState,
  DashboardCreditsLabel,
  VerdictLabel,
  StatusLabel,
  FormattedDate,
} from "@/components/dashboard/DashboardI18nClient";
import { deleteAnalysis } from "./actions";
import {
  getScoreColor,
  getScoreBgColor,
  type AnalysisWithDetails,
  type Profile,
} from "@/lib/types";

const DELETABLE_STATUSES = ["failed", "uploading", "pending"];

export const metadata = {
  title: "Dashboard — LegitVision",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch profile for credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Fetch analyses with brand/model names
  const { data: analyses } = await supabase
    .from("analyses")
    .select(
      `
      *,
      brands!inner(name, slug),
      models!inner(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const formattedAnalyses: AnalysisWithDetails[] = (analyses ?? []).map(
    (a: Record<string, unknown>) => ({
      ...(a as unknown as AnalysisWithDetails),
      brand_name: (a.brands as { name: string }).name,
      brand_slug: (a.brands as { slug: string }).slug,
      model_name: (a.models as { name: string }).name,
    })
  );

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={240}
              height={64}
              className="h-16 w-auto"
              priority
              unoptimized
            />
          </Link>
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm">
                <Coins className="size-4 text-emerald-500" />
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
        {searchParams.session_id && <SuccessBanner />}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <DashboardGreeting
              firstName={firstName ?? ""}
              count={formattedAnalyses.length}
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formattedAnalyses.map((analysis) => {
              const isDeletable = DELETABLE_STATUSES.includes(analysis.status);
              const deleteAction = deleteAnalysis.bind(null, analysis.id);

              return (
                <div
                  key={analysis.id}
                  className="group relative rounded-2xl border border-white/5 bg-card transition-colors hover:border-emerald-500/20"
                >
                  {/* Bouton Supprimer — visible au survol pour les analyses bloquées */}
                  {isDeletable && (
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        title="Supprimer cette analyse"
                        className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
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
                        <p className="font-heading text-sm font-semibold">
                          {analysis.brand_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.model_name}
                        </p>
                      </div>
                      {analysis.overall_score != null ? (
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${getScoreBgColor(analysis.overall_score)}`}
                        >
                          <span
                            className={`font-heading text-lg font-bold ${getScoreColor(analysis.overall_score)}`}
                          >
                            {analysis.overall_score}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`flex h-7 shrink-0 items-center rounded-full px-3 text-xs ${
                            analysis.status === "failed"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          <StatusLabel status={analysis.status} />
                        </div>
                      )}
                    </div>

                    {analysis.verdict && (
                      <p
                        className={`mt-3 text-sm font-medium ${getScoreColor(analysis.overall_score ?? 0)}`}
                      >
                        <VerdictLabel verdict={analysis.verdict} />
                      </p>
                    )}

                    <p className="mt-3 text-xs text-muted-foreground">
                      <FormattedDate value={analysis.created_at} />
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
