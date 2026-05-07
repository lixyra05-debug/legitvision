import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN_CREDITS } from "@/lib/stripe/config";
import type { PlanId } from "@/lib/stripe/config";
import { renderPaymentConfirmationEmail } from "@/lib/emails/payment-confirmation";
import { sendTransactionalEmail } from "@/lib/emails/send";

const PLAN_EMAIL_LABELS: Record<string, string> = {
  "one-time": "Utilisation unique",
  pro: "Pro — 19,99 €/mois (10 analyses)",
  business: "Business — 29,99 €/mois (50 analyses)",
};

async function sendPaymentEmail(args: {
  userId: string;
  planKey: string;
  amountLabel: string;
  creditsAfter: number | null;
}) {
  try {
    const admin = createAdminClient();
    const { data: authUser } = await admin.auth.admin.getUserById(args.userId);
    const email = authUser?.user?.email;
    if (!email) return;
    const name =
      (authUser.user?.user_metadata?.full_name as string | undefined) ??
      email.split("@")[0] ??
      "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://legitvision.vercel.app";
    await sendTransactionalEmail({
      to: email,
      subject: "Merci pour votre achat — LegitVision",
      html: renderPaymentConfirmationEmail({
        name,
        planLabel: PLAN_EMAIL_LABELS[args.planKey] ?? args.planKey,
        amountLabel: args.amountLabel,
        creditsAfter: args.creditsAfter,
        dashboardUrl: `${appUrl}/dashboard`,
      }),
    });
  } catch (err) {
    console.error("[webhook/stripe] envoi email paiement échoué:", err);
  }
}

// Désactiver le body parsing automatique de Next.js — Stripe a besoin du corps brut
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook/stripe] STRIPE_WEBHOOK_SECRET non défini");
    return NextResponse.json({ error: "Config manquante" }, { status: 500 });
  }

  // Vérifier la signature Stripe
  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook/stripe] Signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotence : insertion atomique dans stripe_events. Si l'event.id existe
  // déjà (Postgres code 23505 = unique_violation), Stripe a retransmis — on
  // renvoie 200 sans retraiter pour éviter double crédit.
  const { error: dedupError } = await admin
    .from("stripe_events")
    .insert({ id: event.id, event_type: event.type });

  if (dedupError) {
    if (dedupError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[webhook/stripe] Erreur dédup:", dedupError);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }

  try {
    switch (event.type) {
      // ── Checkout complété (abonnement ou paiement unique) ────────────────
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.supabase_user_id;

        if (!userId) {
          console.error("[webhook/stripe] checkout.session.completed: userId manquant", session.id);
          break;
        }

        // ── Paiement unique : ajouter 1 crédit ──────────────────────────────
        if (session.mode === "payment") {
          const { data: profile, error: profileError } = await admin
            .from("profiles")
            .select("id, credits_remaining")
            .eq("id", userId)
            .single();

          if (profileError || !profile) {
            console.error("[webhook/stripe] single: profil non trouvé pour user", userId);
            break;
          }

          const newBalance = profile.credits_remaining + 1;
          await admin
            .from("profiles")
            .update({ credits_remaining: newBalance })
            .eq("id", userId);

          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null;

          await admin.from("credits_transactions").insert({
            user_id: userId,
            type: "purchase",
            amount: 1,
            balance_after: newBalance,
            description: "Achat utilisation unique — 1 crédit",
            stripe_payment_id: paymentIntentId,
          });

          await sendPaymentEmail({
            userId,
            planKey: "one-time",
            amountLabel: "3,99 €",
            creditsAfter: newBalance,
          });
          break;
        }

        // ── Abonnement : mettre à jour le plan ──────────────────────────────
        if (session.mode !== "subscription") break;

        const planId = session.metadata?.plan as PlanId | undefined;
        if (!planId) {
          console.error("[webhook/stripe] checkout.session.completed: planId manquant", session.id);
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
        }

        const amountLabel =
          planId === "pro"
            ? "19,99 €/mois"
            : planId === "business"
              ? "29,99 €/mois"
              : "";

        const { data: updatedProfile } = await admin
          .from("profiles")
          .select("credits_remaining")
          .eq("id", userId)
          .single();

        await sendPaymentEmail({
          userId,
          planKey: planId,
          amountLabel,
          creditsAfter: updatedProfile?.credits_remaining ?? null,
        });
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

        if (!planId) break;

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

        // B-BIZ-2 : tous les plans (pro=10, business=50) ajoutent leurs crédits
        const creditsToAdd = PLAN_CREDITS[planId];
        const newBalance = profile.credits_remaining + creditsToAdd;

        await admin
          .from("profiles")
          .update({ credits_remaining: newBalance })
          .eq("id", profile.id);

        await admin.from("credits_transactions").insert({
          user_id: profile.id,
          type: "purchase",
          amount: creditsToAdd,
          balance_after: newBalance,
          description: `Recharge mensuelle ${creditsToAdd} crédits — plan ${planId} — facture ${invoice.id}`,
          stripe_payment_id: invoice.payment_intent
            ? typeof invoice.payment_intent === "string"
              ? invoice.payment_intent
              : invoice.payment_intent.id
            : null,
        });
        break;
      }

      // ── Abonnement résilié ────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        // B-BIZ-1 : zéro crédit gratuit à la résiliation (cohérent mig 016 +
        // paywall obligatoire). On bascule juste le plan en free et on retire
        // l'ID subscription. Les crédits restants sont conservés (ce que
        // l'user a déjà payé), mais aucun bonus ajouté.
        const subscription = event.data.object as import("stripe").Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const { data: profile } = await admin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("[webhook/stripe] subscription.deleted: profil non trouvé pour customer", customerId);
          break;
        }

        await admin
          .from("profiles")
          .update({
            subscription_plan: "free",
            stripe_subscription_id: null,
          })
          .eq("id", profile.id);
        break;
      }

      default:
        break;
    }
  } catch (error) {
    // B-WHK-8 : Erreur runtime dans le switch — supprimer la marque idempotence
    // pour permettre à Stripe de retenter (jusqu'à 3 fois sur 72h). Sinon le
    // user a payé mais aucun crédit n'est ajouté.
    console.error("[webhook/stripe] Erreur traitement event:", error);
    await admin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
