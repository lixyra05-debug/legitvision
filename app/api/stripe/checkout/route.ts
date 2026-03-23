import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, getPriceId, getOrCreateCustomer } from "@/lib/stripe/server";
import type { PlanId } from "@/lib/stripe/config";

const PAID_PLANS = ["pro", "business"] as const;
type PaidPlanId = (typeof PAID_PLANS)[number];

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 2. Parse body
  let planId: PlanId;
  try {
    const body = await request.json();
    planId = body.planId;
    if (!PAID_PLANS.includes(planId as PaidPlanId)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  // 3. Récupérer le profil (pour stripe_customer_id éventuel)
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_plan")
    .eq("id", user.id)
    .single();

  // 4. Vérifier que l'user n'est pas déjà sur ce plan
  if (profile?.subscription_plan === planId) {
    return NextResponse.json(
      { error: "Vous êtes déjà sur ce plan" },
      { status: 409 }
    );
  }

  try {
    // 5. Créer ou récupérer le Stripe Customer
    const customerId = await getOrCreateCustomer(
      user.id,
      user.email!,
      profile?.stripe_customer_id
    );

    // Sauvegarder le customer ID si nouveau
    if (!profile?.stripe_customer_id) {
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // 6. Créer la Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      line_items: [
        {
          price: getPriceId(planId as PaidPlanId),
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout] Error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
