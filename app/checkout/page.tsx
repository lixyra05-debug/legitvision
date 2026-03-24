import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPriceId } from "@/lib/stripe/server";
import Stripe from "stripe";

const PAID_PLANS = ["pro", "business"] as const;
type PaidPlanId = (typeof PAID_PLANS)[number];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const rawPlan = searchParams.plan;
  console.log("[checkout] ▶ Start — plan:", rawPlan);

  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[checkout] User:", user?.id ?? "not authenticated");

  if (!user) {
    // Properly encode the redirect URL so ?plan=pro is not stripped
    const redirectParam = encodeURIComponent(`/checkout?plan=${rawPlan ?? "pro"}`);
    console.log("[checkout] → /auth (not authenticated)");
    redirect(`/auth?redirect=${redirectParam}`);
  }

  // ── 2. Validate plan ─────────────────────────────────────────────────────
  const planId = rawPlan as PaidPlanId;
  if (!rawPlan || !PAID_PLANS.includes(planId)) {
    console.log("[checkout] Invalid plan:", rawPlan, "→ /#pricing");
    redirect("/#pricing");
  }

  // ── 3. Fetch profile ─────────────────────────────────────────────────────
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_plan")
    .eq("id", user.id)
    .single();

  console.log("[checkout] Profile:", {
    subscription_plan: profile?.subscription_plan ?? null,
    has_stripe_customer: !!profile?.stripe_customer_id,
    profile_error: profileError?.message ?? null,
  });

  // ── 4. Already on this plan → dashboard ──────────────────────────────────
  if (profile?.subscription_plan === planId) {
    console.log(
      "[checkout] Already on plan:",
      planId,
      "→ /dashboard (already subscribed)"
    );
    redirect("/dashboard");
  }

  // ── 5. Env vars check ────────────────────────────────────────────────────
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  console.log("[checkout] Env vars:", {
    STRIPE_SECRET_KEY: stripeKey ? "✓ set" : "✗ MISSING",
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID ? "✓ set" : "✗ MISSING",
    STRIPE_BUSINESS_PRICE_ID: process.env.STRIPE_BUSINESS_PRICE_ID
      ? "✓ set"
      : "✗ MISSING",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "(not set)",
  });

  if (!stripeKey) {
    console.error("[checkout] ✗ STRIPE_SECRET_KEY manquante — impossible de créer la session");
    redirect("/#pricing");
  }

  // ── 6. Create Stripe session ──────────────────────────────────────────────
  // IMPORTANT: redirect() must be called OUTSIDE any try/catch.
  // In Next.js, redirect() throws a special NEXT_REDIRECT error.
  // If called inside a try/catch, the catch block swallows it and
  // the redirect never happens. We store the URL in a variable instead.
  let sessionUrl: string | null = null;

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
      console.log("[checkout] New Stripe customer created:", customerId);

      // Save customer ID (best effort — don't block checkout if this fails)
      const { error: updateError } = await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
      if (updateError) {
        console.warn("[checkout] Could not save stripe_customer_id:", updateError.message);
      }
    } else {
      console.log("[checkout] Existing Stripe customer:", customerId);
    }

    const priceId = getPriceId(planId);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://legitvision.vercel.app";

    console.log("[checkout] Creating session:", { planId, priceId, baseUrl });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan: planId },
      },
      metadata: { supabase_user_id: user.id, plan: planId },
      allow_promotion_codes: true,
      locale: "fr",
    });

    sessionUrl = session.url;
    console.log("[checkout] Session created:", session.id, "| URL obtained:", !!sessionUrl);
  } catch (err) {
    console.error(
      "[checkout] ✗ Stripe error:",
      err instanceof Error ? err.message : String(err)
    );
  }

  // ── 7. Redirect — OUTSIDE try/catch ───────────────────────────────────────
  if (!sessionUrl) {
    console.log("[checkout] No session URL → /#pricing");
    redirect("/#pricing");
  }

  console.log("[checkout] ✓ Redirecting to Stripe Checkout");
  redirect(sessionUrl);
}
