import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN_CREDITS } from "@/lib/stripe/config";
import type { PlanId } from "@/lib/stripe/config";

// Désactiver le body parsing automatique de Next.js — Stripe a besoin du corps brut
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  if (!WEBHOOK_SECRET) {
    console.error("[webhook/stripe] STRIPE_WEBHOOK_SECRET non défini");
    return NextResponse.json({ error: "Config manquante" }, { status: 500 });
  }

  // Vérifier la signature Stripe
  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook/stripe] Signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  console.log("[webhook/stripe] Event reçu:", event.type, event.id);

  try {
    switch (event.type) {
      // ── Souscription créée et payée ──────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.client_reference_id ?? session.metadata?.supabase_user_id;
        const planId = session.metadata?.plan as PlanId | undefined;

        if (!userId || !planId) {
          console.error("[webhook/stripe] checkout.session.completed: metadata manquante", session.id);
          break;
        }

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        // Mettre à jour le plan dans profiles
        const { error } = await admin
          .from("profiles")
          .update({
            subscription_plan: planId,
            stripe_customer_id: customerId ?? undefined,
            stripe_subscription_id: subscriptionId ?? undefined,
          })
          .eq("id", userId);

        if (error) {
          console.error("[webhook/stripe] Erreur update profil:", error.message);
        } else {
          console.log(`[webhook/stripe] Plan mis à jour → ${planId} pour user ${userId}`);
        }
        break;
      }

      // ── Facture payée (initial + renouvellement mensuel) ─────────────────
      case "invoice.paid": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) break;

        // Trouver le plan à partir du premier line item
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lineItem = invoice.lines?.data[0] as any;
        const priceId: string | undefined = lineItem?.price?.id ?? lineItem?.pricing?.price_details?.price_id;
        const planId = priceId ? getPlanFromPriceId(priceId) : null;

        if (!planId) {
          console.warn("[webhook/stripe] invoice.paid: plan inconnu pour priceId", priceId);
          break;
        }

        // Retrouver l'utilisateur via stripe_customer_id
        const { data: profile } = await admin
          .from("profiles")
          .select("id, credits_remaining")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("[webhook/stripe] invoice.paid: profil non trouvé pour customer", customerId);
          break;
        }

        // Pour Business, pas de recharge numérique (bypass dans /api/analyze)
        // On log quand même la transaction pour l'historique
        const creditsToAdd = PLAN_CREDITS[planId];
        const newBalance =
          planId === "business"
            ? profile.credits_remaining // pas de changement réel
            : profile.credits_remaining + creditsToAdd;

        if (planId !== "business") {
          await admin
            .from("profiles")
            .update({ credits_remaining: newBalance })
            .eq("id", profile.id);
        }

        // Logger la transaction
        const description =
          planId === "business"
            ? `Renouvellement plan Business (illimité) — facture ${invoice.id}`
            : `Recharge mensuelle ${creditsToAdd} crédits — plan ${planId} — facture ${invoice.id}`;

        await admin.from("credits_transactions").insert({
          user_id: profile.id,
          type: "purchase",
          amount: planId === "business" ? 0 : creditsToAdd,
          balance_after: newBalance,
          description,
          stripe_payment_id: invoice.payment_intent
            ? typeof invoice.payment_intent === "string"
              ? invoice.payment_intent
              : invoice.payment_intent.id
            : null,
        });

        console.log(
          `[webhook/stripe] invoice.paid: +${creditsToAdd} crédits → user ${profile.id} (plan ${planId})`
        );
        break;
      }

      // ── Abonnement résilié ────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as import("stripe").Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const { data: profile } = await admin
          .from("profiles")
          .select("id, credits_remaining")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("[webhook/stripe] subscription.deleted: profil non trouvé pour customer", customerId);
          break;
        }

        // Repasser en free avec 3 crédits
        await admin
          .from("profiles")
          .update({
            subscription_plan: "free",
            stripe_subscription_id: null,
            credits_remaining: 3,
          })
          .eq("id", profile.id);

        // Logger le retour au plan free
        await admin.from("credits_transactions").insert({
          user_id: profile.id,
          type: "bonus",
          amount: 3,
          balance_after: 3,
          description: "Retour au plan Free après résiliation",
          stripe_payment_id: null,
        });

        console.log(`[webhook/stripe] Abonnement résilié → retour Free pour user ${profile.id}`);
        break;
      }

      default:
        console.log("[webhook/stripe] Event ignoré:", event.type);
    }
  } catch (error) {
    console.error("[webhook/stripe] Erreur traitement event:", error);
    // Retourner 200 quand même pour éviter que Stripe ne réessaie
    return NextResponse.json({ received: true, error: "Erreur interne" });
  }

  return NextResponse.json({ received: true });
}
