import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "Aucun abonnement actif à résilier" },
      { status: 404 },
    );
  }

  try {
    const sub = await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    return NextResponse.json({
      ok: true,
      cancelAt: sub.items.data[0]?.current_period_end ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
