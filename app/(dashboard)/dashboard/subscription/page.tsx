import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?redirect=/dashboard/subscription");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_plan, stripe_subscription_id, credits_remaining")
    .eq("id", user.id)
    .single();

  const plan = profile?.subscription_plan ?? "free";
  const planLabel = PLAN_LABELS[plan] ?? plan;

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

        <div className="mt-10 rounded-2xl border border-white/10 bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Plan actuel
              </p>
              <p className="mt-1 font-heading text-xl font-semibold">{planLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.credits_remaining ?? 0} crédit
                {(profile?.credits_remaining ?? 0) > 1 ? "s" : ""} disponible
                {(profile?.credits_remaining ?? 0) > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck className="size-6 text-emerald-400" />
            </div>
          </div>

          {plan === "free" && (
            <div className="mt-6 border-t border-white/5 pt-6">
              <p className="text-sm text-muted-foreground">
                Vous n&apos;avez pas d&apos;abonnement actif.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
              >
                Voir les formules
              </Link>
            </div>
          )}

          {plan !== "free" && cancelAtPeriodEnd && periodEnd && (
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm text-amber-400">
                Résiliation programmée. Votre abonnement restera actif jusqu&apos;au{" "}
                <span className="font-semibold">{formatDate(periodEnd)}</span>.
                Vous ne serez plus facturé après cette date.
              </p>
            </div>
          )}

          {plan !== "free" && !cancelAtPeriodEnd && status === "active" && (
            <div className="mt-6 border-t border-white/5 pt-6">
              <p className="text-sm text-muted-foreground">
                Vous pouvez résilier à tout moment. L&apos;abonnement restera actif
                jusqu&apos;à la fin de la période déjà payée.
              </p>
              <div className="mt-4">
                <CancelButton />
              </div>
            </div>
          )}

          {plan !== "free" && !profile?.stripe_subscription_id && (
            <div className="mt-6 border-t border-white/5 pt-6 text-sm text-muted-foreground">
              Aucun ID d&apos;abonnement Stripe associé. Si vous avez souscrit récemment,
              rafraîchissez la page dans quelques instants.
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Besoin d&apos;aide ?{" "}
          <a
            href="mailto:contact@lyxiria.fr"
            className="text-emerald-400 hover:text-emerald-300"
          >
            contact@lyxiria.fr
          </a>
        </p>
      </main>
    </div>
  );
}
