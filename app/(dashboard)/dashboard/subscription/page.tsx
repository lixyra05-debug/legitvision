import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  SubscriptionPageHeader,
  SubscriptionNoActive,
  SubscriptionActive,
  SubscriptionContactNote,
} from "@/components/dashboard/SubscriptionI18nClient";

export const metadata = {
  title: "Gérer mon abonnement",
};

// Plan labels resolved client-side via SubscriptionActive component (i18n FR/EN).
// Date formatting deferred to client (FormattedDate / SubscriptionActive).

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
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <SubscriptionPageHeader />

        {!hasActiveSubscription ? (
          <SubscriptionNoActive credits={credits} />
        ) : (
          <SubscriptionActive
            plan={plan}
            credits={credits}
            cancelAtPeriodEnd={cancelAtPeriodEnd}
            periodEndUnix={periodEnd}
          />
        )}

        <SubscriptionContactNote />
      </main>
    </div>
  );
}
