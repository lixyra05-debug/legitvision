// Abonnements fermés jusqu'à la 020 (SUBSCRIPTIONS_ON_SALE = false, décision
// d'Hector du 27/09) : le serveur n'ouvre aucune session d'abonnement, même
// depuis un ancien lien ; l'analyse unique reste en vente ; aucun texte public
// ne propose d'abonnement. La page /checkout (TSX, non chargeable ici) applique
// isPlanOnSale avant toute session ou changement de formule.
import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;

type Appel = { methode: string; params: unknown };
const etat: {
  user: { id: string; email: string } | null;
  appels: Appel[];
} = { user: null, appels: [] };

mock.module(module("lib/supabase/server.ts"), {
  namedExports: {
    createClient: async () => ({ auth: { getUser: async () => ({ data: { user: etat.user } }) } }),
  },
});
mock.module(module("lib/supabase/admin.ts"), {
  namedExports: {
    createAdminClient: () => ({
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
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
    getOrCreateCustomer: async () => "cus_test",
  },
});

process.env.STRIPE_SECRET_KEY = "sk_test_faux";

const { SUBSCRIPTIONS_ON_SALE, isPlanOnSale } = (await import(module("lib/stripe/config.ts"))) as typeof import("@/lib/stripe/config");
const { POST } = (await import(module("app/api/stripe/checkout/route.ts"))) as typeof import("@/app/api/stripe/checkout/route");
const { getFaqItems } = (await import(module("components/landing/faq-data.ts"))) as typeof import("@/components/landing/faq-data");
const { matchResponse } = (await import(module("components/chat/chatbot-responses.ts"))) as typeof import("@/components/chat/chatbot-responses");

beforeEach(() => {
  etat.user = { id: "user-1", email: "client@example.com" };
  etat.appels = [];
});

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

test("formules en vente : l'analyse unique seule (règle de la page /checkout)", () => {
  assert.equal(isPlanOnSale("single"), true);
  assert.equal(isPlanOnSale("pro"), false);
  assert.equal(isPlanOnSale("business"), false);
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
