import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, getPriceId, getOrCreateCustomer } from "@/lib/stripe/server";
import { z } from "zod";
import { SITE_URL } from "@/lib/site-url";

// Construit l'URL de redirect d'erreur — ramène l'utilisateur sur le paywall
// avec un message clair (au lieu de revenir silencieusement sur la landing).
function buildErrorRedirect(reason: string): string {
  return `/check/new?error=stripe_unavailable&reason=${encodeURIComponent(reason)}`;
}

// D : message générique unique côté client (le détail est loggé serveur, jamais exposé).
const GENERIC_PAYMENT_ERROR =
  "Le service de paiement est momentanément indisponible. Réessayez dans quelques instants.";

// C : les 3 plans valides. "single" = paiement unique ; "pro"/"business" = abonnement.
const planParamSchema = z.enum(["single", "pro", "business"]);

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

  // ── 2. Validate plan (Zod : single | pro | business) ─────────────────────
  const planParse = planParamSchema.safeParse(rawPlan);
  if (!planParse.success) {
    redirect("/#pricing");
  }
  const planId = planParse.data;

  // ── 3. Fetch profile ─────────────────────────────────────────────────────
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, subscription_plan, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  // ── 4. Already on this plan → dashboard (skip for single — always allowed) ─
  if (planId !== "single" && profile?.subscription_plan === planId) {
    redirect("/dashboard");
  }

  // ── 5. Env vars check ────────────────────────────────────────────────────
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[checkout] STRIPE_SECRET_KEY non défini sur le serveur");
    redirect(buildErrorRedirect(GENERIC_PAYMENT_ERROR));
  }

  // ── 5b. Changement de plan avec abonnement DÉJÀ actif (pro/business) ──────
  // CAS B : ne PAS créer un 2e Checkout (= 2e abonnement = double facturation).
  // On modifie l'abonnement existant en place ; Stripe gère le prorata et
  // réutilise la carte enregistrée. redirect() reste HORS try/catch.
  let planChangeDone = false;
  let planChangeError: string | null = null;

  if (planId !== "single" && profile?.stripe_subscription_id) {
    try {
      const sub = await stripe.subscriptions.retrieve(
        profile.stripe_subscription_id
      );
      const modifiable = ["active", "trialing", "past_due", "unpaid"].includes(
        sub.status
      );
      if (modifiable) {
        const currentItemId = sub.items.data[0]?.id;
        if (!currentItemId) throw new Error("Abonnement sans item facturable.");
        await stripe.subscriptions.update(profile.stripe_subscription_id, {
          items: [{ id: currentItemId, price: getPriceId(planId) }],
          proration_behavior: "create_prorations",
        });
        // NB : la MAJ de subscription_plan ET des crédits (delta) est faite par le
        // webhook customer.subscription.updated = source de vérité unique. Ne PAS
        // mettre à jour le plan ici, sinon le webhook verrait ancien == nouveau et
        // ne créditerait jamais l'upgrade.
        planChangeDone = true;
      }
      // Abo non modifiable (canceled/incomplete) → on laisse le CAS A créer un nouvel abo.
    } catch (err) {
      // ID d'abonnement périmé (resource_missing) → fallback CAS A (nouveau Checkout),
      // pas d'erreur bloquante. Toute autre erreur → message clair à l'utilisateur.
      const code = (err as { code?: string }).code;
      if (code !== "resource_missing") {
        planChangeError = err instanceof Error ? err.message : String(err);
        console.error("[checkout] plan change error:", planChangeError);
      }
    }
  }

  // Redirections du CAS B — HORS try/catch (redirect() lève NEXT_REDIRECT).
  if (planChangeError) {
    // détail déjà loggé ci-dessus ; message générique côté client (D).
    redirect(buildErrorRedirect(GENERIC_PAYMENT_ERROR));
  }
  if (planChangeDone) {
    redirect("/dashboard?plan_changed=1");
  }

  // ── 6. Create Stripe session ──────────────────────────────────────────────
  // IMPORTANT: redirect() must be called OUTSIDE any try/catch.
  // In Next.js, redirect() throws a special NEXT_REDIRECT error.
  // If called inside a try/catch, the catch block swallows it and
  // the redirect never happens. We store the URL/error in variables instead.
  let sessionUrl: string | null = null;
  let stripeErrorMessage: string | null = null;

  try {
    // M6 : utiliser le singleton stripe (lazy-init) + helper getOrCreateCustomer
    const customerId = await getOrCreateCustomer(
      user.id,
      user.email!,
      profile?.stripe_customer_id ?? null
    );

    // Save customer ID si nouveau (best effort)
    if (!profile?.stripe_customer_id) {
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const baseUrl = SITE_URL;

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
    // détail déjà loggé (catch ci-dessus) ; message générique côté client (D).
    redirect(buildErrorRedirect(GENERIC_PAYMENT_ERROR));
  }

  redirect(sessionUrl);
}
