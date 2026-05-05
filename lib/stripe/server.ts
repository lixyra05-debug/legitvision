/**
 * Client Stripe côté serveur — NE PAS importer dans les composants client.
 */
import Stripe from "stripe";
import type { PlanId } from "./config";

function createStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });
}

// Lazy singleton — ne s'instancie qu'au premier appel, pas au build
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) _stripe = createStripeClient();
  return _stripe;
}

// Alias pratique pour les imports directs dans les routes
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/** Résout le Stripe Price ID à partir du plan (single = paiement unique 3,99€) */
export function getPriceId(planId: "single" | "pro" | "business"): string {
  const id =
    planId === "single"
      ? process.env.STRIPE_SINGLE_PRICE_ID
      : planId === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_BUSINESS_PRICE_ID;

  if (!id) {
    throw new Error(
      `STRIPE_${planId.toUpperCase()}_PRICE_ID n'est pas défini dans les variables d'environnement`
    );
  }
  return id;
}

/** Retrouve le plan à partir d'un Stripe Price ID */
export function getPlanFromPriceId(priceId: string): PlanId | null {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return "business";
  return null;
}

/** Crée ou récupère un Stripe Customer pour un utilisateur */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  if (existingCustomerId) return existingCustomerId;

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });
  return customer.id;
}
