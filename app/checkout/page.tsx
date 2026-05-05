import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPriceId } from "@/lib/stripe/server";
import Stripe from "stripe";

// Construit l'URL de redirect d'erreur — ramène l'utilisateur sur le paywall
// avec un message clair (au lieu de revenir silencieusement sur la landing).
function buildErrorRedirect(reason: string): string {
  return `/check/new?error=stripe_unavailable&reason=${encodeURIComponent(reason)}`;
}

const PAID_PLANS = ["pro", "business", "single"] as const;
type PaidPlanId = (typeof PAID_PLANS)[number];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const rawPlan = searchParams.plan;

  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectParam = encodeURIComponent(`/checkout?plan=${rawPlan ?? "pro"}`);
    redirect(`/auth?redirect=${redirectParam}`);
  }

  // ── 2. Validate plan ─────────────────────────────────────────────────────
  const planId = rawPlan as PaidPlanId;
  if (!rawPlan || !PAID_PLANS.includes(planId)) {
    redirect("/#pricing");
  }

  // ── 3. Fetch profile ─────────────────────────────────────────────────────
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_plan")
    .eq("id", user.id)
    .single();

  // ── 4. Already on this plan → dashboard (skip for single — always allowed) ─
  if (planId !== "single" && profile?.subscription_plan === planId) {
    redirect("/dashboard");
  }

  // ── 5. Env vars check ────────────────────────────────────────────────────
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    redirect(buildErrorRedirect("STRIPE_SECRET_KEY non défini sur le serveur"));
  }

  // ── 6. Create Stripe session ──────────────────────────────────────────────
  // IMPORTANT: redirect() must be called OUTSIDE any try/catch.
  // In Next.js, redirect() throws a special NEXT_REDIRECT error.
  // If called inside a try/catch, the catch block swallows it and
  // the redirect never happens. We store the URL/error in variables instead.
  let sessionUrl: string | null = null;
  let stripeErrorMessage: string | null = null;

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Save customer ID (best effort — don't block checkout if this fails)
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://legitvision.vercel.app";

    const priceId = getPriceId(planId);

    let session: import("stripe").Stripe.Checkout.Session;

    if (planId === "single") {
      // ── Paiement unique (1 analyse, mode: "payment") ─────────────────────
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&purchased=single`,
        cancel_url: `${baseUrl}/check/new`,
        payment_intent_data: {
          metadata: { supabase_user_id: user.id, plan: "single" },
        },
        metadata: { supabase_user_id: user.id, plan: "single" },
        locale: "fr",
      });
    } else {
      // ── Abonnement récurrent (pro / business) ─────────────────────────────
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/check/new`,
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan: planId },
        },
        metadata: { supabase_user_id: user.id, plan: planId },
        allow_promotion_codes: true,
        locale: "fr",
      });
    }

    sessionUrl = session.url;
  } catch (err) {
    stripeErrorMessage =
      err instanceof Error ? err.message : String(err);
    console.error("[checkout] Stripe error:", stripeErrorMessage);
  }

  // ── 7. Redirect — OUTSIDE try/catch ───────────────────────────────────────
  if (!sessionUrl) {
    redirect(buildErrorRedirect(stripeErrorMessage ?? "session_creation_failed"));
  }

  redirect(sessionUrl);
}
