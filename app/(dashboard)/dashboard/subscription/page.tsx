import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { CancelButton } from "./CancelButton";

export const metadata = {
  title: "Gérer mon abonnement",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  starter: "Starter",
  pro: "Pro — 19,99 €/mois",
  business: "Business — 29,99 €/mois",
};

function formatDate(unixSec: number): string {
  return new Date(unixSec * 1000).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SubscriptionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?redirect=/dashboard/subscription");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_plan, stripe_subscription_id, credits_remaining")
    .eq("id", user.id)
    .single();

  const plan = profile?.subscription_plan ?? "free";
  const planLabel = PLAN_LABELS[plan] ?? plan;
  const credits = profile?.credits_remaining ?? 0;

  let cancelAtPeriodEnd = false;
  let periodEnd: number | null = null;
  let status: string | null = null;

  if (profile?.stripe_subscription_id) {
    try {
      const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      cancelAtPeriodEnd = sub.cancel_at_period_end;
      periodEnd = sub.items.data[0]?.current_period_end ?? null;
      status = sub.status;
    } catch {
      // Subscription may have been deleted server-side; fall through.
    }
  }

  const hasActiveSubscription =
    plan !== "free" &&
    !!profile?.stripe_subscription_id &&
    (status === "active" || status === "trialing");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Gérer mon abonnement
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Consultez votre plan et résiliez à tout moment.
        </p>

        {!hasActiveSubscription ? (
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
            />
            <div className="relative flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Sparkles className="size-8 text-emerald-400" />
              </div>
              <h2 className="mt-6 font-heading text-xl font-bold tracking-tight">
                Vous n&apos;avez aucun abonnement actif
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Souscrivez à un plan pour analyser vos articles en illimité et
                bénéficier du support prioritaire.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
                <span>Crédits disponibles</span>
                <span className="font-semibold text-foreground">{credits}</span>
              </div>
              <Link
                href="/#pricing"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Voir nos offres
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-0 size-48 rounded-full bg-emerald-500/10 blur-3xl"
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Plan actuel
                  </p>
                  <p className="mt-1 font-heading text-xl font-semibold">
                    {planLabel}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {credits} crédit{credits > 1 ? "s" : ""} disponible
                    {credits > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <ShieldCheck className="size-6 text-emerald-400" />
                </div>
              </div>

              {cancelAtPeriodEnd && periodEnd && (
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm text-amber-400">
                    Résiliation programmée. Votre abonnement restera actif
                    jusqu&apos;au{" "}
                    <span className="font-semibold">{formatDate(periodEnd)}</span>.
                    Vous ne serez plus facturé après cette date.
                  </p>
                </div>
              )}

              {!cancelAtPeriodEnd && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez résilier à tout moment. L&apos;abonnement restera
                    actif jusqu&apos;à la fin de la période déjà payée.
                  </p>
                  <div className="mt-4">
                    <CancelButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Besoin d&apos;aide ?{" "}
          <a
            href="mailto:legitvision.contact@gmail.com"
            className="text-emerald-400 hover:text-emerald-300"
          >
            legitvision.contact@gmail.com
          </a>
        </p>
      </main>
    </div>
  );
}
