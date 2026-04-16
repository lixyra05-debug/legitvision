import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { SuccessBanner } from "@/components/stripe/SuccessBanner";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { deleteAnalysis } from "./actions";
import {
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

  // Bind delete actions for deletable analyses (passed as props to client component)
  const deleteActions: Record<string, () => Promise<void>> = {};
  for (const a of formattedAnalyses) {
    if (DELETABLE_STATUSES.includes(a.status)) {
      deleteActions[a.id] = deleteAnalysis.bind(null, a.id);
    }
  }

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "vous";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

      {/* ── Navigation ── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(10,10,11,0.75)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span
              className="font-heading text-base font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              LegitVision
            </span>
          </Link>
          <UserMenu />
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* Stripe success banner */}
        {searchParams.session_id && (
          <div className="mb-6">
            <SuccessBanner />
          </div>
        )}

        {/* Bento grid dashboard */}
        <DashboardGrid
          profile={profile ?? null}
          analyses={formattedAnalyses}
          firstName={firstName}
          deleteActions={deleteActions}
        />
      </main>
    </div>
  );
}
