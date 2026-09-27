// Abonnements fermés jusqu'à la 020 (SUBSCRIPTIONS_ON_SALE = false, décision
// d'Hector du 27/09) : la page /checkout et /api/stripe/checkout n'ouvrent
// aucune session d'abonnement et ne changent aucune formule, même depuis un
// ancien lien ; l'analyse unique reste en vente ; aucun texte public ne propose
// d'abonnement.
import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;

type Appel = { methode: string; params: unknown };
const etat: {
  user: { id: string; email: string } | null;
  profil: Record<string, unknown> | null;
  appels: Appel[];
} = { user: null, profil: null, appels: [] };

class Redirection extends Error {
  url: string;
  constructor(url: string) {
    super(`NEXT_REDIRECT ${url}`);
    this.url = url;
  }
}

mock.module("next/navigation", {
  namedExports: {
    redirect: (url: string) => {
      throw new Redirection(url);
    },
  },
});

mock.module(module("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({ auth: { getUser: async () => ({ data: { user: etat.user } }) } }),
  },
});
mock.module(module("lib/supabase/admin.ts"), {
  namedExports: {
    createAdminClient: () => ({
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: etat.profil, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: null }) }),
      }),
    }),
  },
});
mock.module(module("lib/rate-limit.ts"), {
  namedExports: {
    rateLimit: async () => ({ success: true, reset: 0 }),
    tooManyRequests: () => new Response(null, { status: 429 }),
  },
});
const note = (methode: string) => async (...params: unknown[]) => {
  etat.appels.push({ methode, params: params[params.length === 1 ? 0 : 1] ?? params[0] });
  return { id: "cs_test", url: "https://checkout.stripe.com/c/pay/cs_test", status: "active", items: { data: [{ id: "si_1" }] } };
};
mock.module(module("lib/stripe/server.ts"), {
  namedExports: {
    stripe: {
      checkout: { sessions: { create: note("checkout.sessions.create") } },
      subscriptions: { retrieve: note("subscriptions.retrieve"), update: note("subscriptions.update") },
    },
    getPriceId: (plan: string) => `price_${plan}`,
    getOrCreateCustomer: async (...params: unknown[]) => {
      etat.appels.push({ methode: "getOrCreateCustomer", params });
      return "cus_test";
    },
  },
});

process.env.STRIPE_SECRET_KEY = "sk_test_faux";

const { SUBSCRIPTIONS_ON_SALE, isPlanOnSale } = (await import(module("lib/stripe/config.ts"))) as typeof import("@/lib/stripe/config");
const { POST } = (await import(module("app/api/stripe/checkout/route.ts"))) as typeof import("@/app/api/stripe/checkout/route");
const { default: CheckoutPage } = (await import(module("app/checkout/page.ts"))) as typeof import("@/app/checkout/page");
const { getFaqItems } = (await import(module("components/landing/faq-data.ts"))) as typeof import("@/components/landing/faq-data");
const { matchResponse } = (await import(module("components/chat/chatbot-responses.ts"))) as typeof import("@/components/chat/chatbot-responses");

beforeEach(() => {
  etat.user = { id: "user-1", email: "client@example.com" };
  etat.profil = { stripe_customer_id: "cus_test", subscription_plan: "free", stripe_subscription_id: null };
  etat.appels = [];
});

/** URL de redirection de la page /checkout (elle se termine toujours par redirect()). */
async function ouvrir(plan?: string): Promise<string> {
  try {
    await CheckoutPage({ searchParams: Promise.resolve(plan === undefined ? {} : { plan }) });
  } catch (err) {
    if (err instanceof Redirection) return err.url;
    throw err;
  }
  throw new Error("aucune redirection");
}

test("les abonnements sont fermés jusqu'à la 020", () => {
  assert.equal(SUBSCRIPTIONS_ON_SALE, false);
});

test("API /api/stripe/checkout : 403 pour pro et business, aucun appel à Stripe", async () => {
  for (const planId of ["pro", "business"]) {
    const res = await POST({ json: async () => ({ planId }) } as never);
    assert.equal(res.status, 403);
  }
  assert.deepEqual(etat.appels, []);
});

test("formules en vente : l'analyse unique seule", () => {
  assert.equal(isPlanOnSale("single"), true);
  assert.equal(isPlanOnSale("pro"), false);
  assert.equal(isPlanOnSale("business"), false);
});

test("/checkout?plan=pro|business : retour aux tarifs, ni client Stripe, ni session, ni changement de formule", async () => {
  for (const plan of ["pro", "business"]) {
    assert.equal(await ouvrir(plan), "/#pricing");
  }
  // Même pour un profil qui porte un abonnement (changement de formule en place).
  etat.profil = { stripe_customer_id: "cus_test", subscription_plan: "pro", stripe_subscription_id: "sub_1" };
  assert.equal(await ouvrir("business"), "/#pricing");
  assert.deepEqual(etat.appels, []);
});

test("/checkout?plan=single : session de paiement unique ouverte", async () => {
  assert.equal(await ouvrir("single"), "https://checkout.stripe.com/c/pay/cs_test");
  const sessions = etat.appels.filter((a) => a.methode === "checkout.sessions.create");
  assert.equal(sessions.length, 1);
  const params = sessions[0].params as { mode: string; line_items: { price: string }[]; success_url: string };
  assert.equal(params.mode, "payment");
  assert.equal(params.line_items[0].price, "price_single");
  assert.match(params.success_url, /purchased=single/);
  assert.equal(etat.appels.some((a) => a.methode.startsWith("subscriptions.")), false);
});

test("/checkout sans compte : la connexion ramène à l'analyse unique, pas à un abonnement", async () => {
  etat.user = null;
  assert.equal(await ouvrir(undefined), `/auth?redirect=${encodeURIComponent("/checkout?plan=single")}`);
});

test("FAQ et assistant : aucun abonnement proposé", () => {
  for (const locale of ["fr", "en"] as const) {
    const prix = getFaqItems(locale).find((i) => /coûte|cost/.test(i.q))?.a ?? "";
    assert.ok(prix.length > 0);
    assert.doesNotMatch(prix, /\/mois|\/month|Business|Premium|Mensuel|Monthly/);
  }
  for (const [question, locale] of [["combien ça coûte ?", "fr"], ["how much", "en"], ["résilier mon abonnement", "fr"]] as const) {
    assert.doesNotMatch(matchResponse(question, locale), /\/mois|\/month|Gérer l'abonnement|Manage subscription/);
  }
});
