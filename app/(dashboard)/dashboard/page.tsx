import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";

export const metadata = {
  title: "Dashboard — LegitVision",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-emerald-500" />
            <span className="font-heading text-lg font-bold tracking-tight">
              LegitVision
            </span>
          </Link>
          <UserMenu />
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Bienvenue, {user.user_metadata?.full_name ?? user.email}
            </p>
          </div>
          <Link
            href="/check/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            <Plus className="size-4" />
            Nouvelle analyse
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="text-muted-foreground">
            Aucune analyse pour le moment.
          </p>
          <Link
            href="/check/new"
            className="mt-4 text-sm text-emerald-500 hover:text-emerald-400"
          >
            Lancer votre première analyse →
          </Link>
        </div>
      </main>
    </div>
  );
}
