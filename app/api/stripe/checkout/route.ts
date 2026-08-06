import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, getPriceId, getOrCreateCustomer } from "@/lib/stripe/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { z } from "zod";
import { normalizeBaseUrl } from "@/lib/site-url";

// Cet endpoint ne gère QUE les abonnements (mode: subscription).
// "single" (paiement unique) passe par app/checkout/page.tsx, jamais ici.
const checkoutBodySchema = z.object({
  planId: z.enum(["pro", "business"]),
});

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 1b. Rate-limit (A) : 5 checkouts/min/user.
  const rl = await rateLimit(`checkout:${user.id}`, 5, 60);
  if (!rl.success) return tooManyRequests(rl.reset);

  // 2. Parse + validation Zod du body (C)
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }
  const checkoutParsed = checkoutBodySchema.safeParse(rawBody);
  if (!checkoutParsed.success) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }
  const planId = checkoutParsed.data.planId;

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
    // DÉROGATION VOLONTAIRE à la source unique lib/site-url.ts.
    // Partout ailleurs le dernier fallback est le domaine de prod. Pas ici :
    // sur un preview deployment sans variable d'env, renvoyer success_url vers
    // la prod ferait encaisser un vrai paiement pendant un test. L'origine de
    // la requête ramène l'utilisateur sur le déploiement qui a lancé le
    // checkout, quel qu'il soit. Les deux premiers maillons restent identiques
    // à ceux de lib/site-url.ts.
    const baseUrl = normalizeBaseUrl(
      process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        request.nextUrl.origin,
    );

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

    // M4 : guard contre session.url null
    if (!session.url) {
      console.error("[stripe/checkout] session.url is null", { sessionId: session.id });
      return NextResponse.json(
        { error: "Erreur création session Stripe (URL manquante)" },
        { status: 500 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    // D : ne jamais renvoyer le message Stripe verbatim au client.
    console.error("[stripe/checkout] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement. Réessayez." },
      { status: 500 }
    );
  }
}
