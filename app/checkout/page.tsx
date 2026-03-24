import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, getPriceId, getOrCreateCustomer } from "@/lib/stripe/server";

const PAID_PLANS = ["pro", "business"] as const;
type PaidPlanId = (typeof PAID_PLANS)[number];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  // 1. Auth (middleware already ensures user is logged in, but double-check)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth?redirect=/checkout?plan=" + (searchParams.plan ?? "pro"));

  // 2. Validate plan
  const planId = searchParams.plan as PaidPlanId;
  if (!planId || !PAID_PLANS.includes(planId)) {
    redirect("/#pricing");
  }

  // 3. Fetch profile
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_plan")
    .eq("id", user.id)
    .single();

  // Already on this plan → go to dashboard
  if (profile?.subscription_plan === planId) {
    redirect("/dashboard");
  }

  try {
    // 4. Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      user.id,
      user.email!,
      profile?.stripe_customer_id
    );

    if (!profile?.stripe_customer_id) {
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // 5. Create Checkout Session
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [
        {
          price: getPriceId(planId),
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: planId,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        plan: planId,
      },
      allow_promotion_codes: true,
      locale: "fr",
    });

    if (!session.url) redirect("/#pricing");

    // 6. Redirect to Stripe Checkout
    redirect(session.url);
  } catch (error) {
    console.error("[checkout] Error:", error);
    redirect("/#pricing");
  }
}
