// Le VRAI webhook Stripe contre un faux PostgREST en mémoire (signature
// remplacée, aucun appel à Stripe) : un ajout de crédits dont rien n'a été
// écrit est renvoyé par Stripe ; un ajout à l'issue inconnue n'est jamais
// rejoué (double crédit) ; un changement de formule n'écrase pas un débit
// concurrent. Scénarios de la relecture adverse du 27/09.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createFakeSupabase, seedAnalyses, type FakeDb } from "./support/fake-supabase";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

const current: { client: unknown } = { client: null };
mock.module(module("lib/stripe/server.ts"), {
  namedExports: {
    stripe: { webhooks: { constructEvent: (body: string) => JSON.parse(body) } },
    getPlanFromPriceId: (id: string) => (id === "price_pro" ? "pro" : id === "price_business" ? "business" : null),
  },
});
mock.module(module("lib/supabase/admin.ts"), { namedExports: { createAdminClient: () => current.client } });
mock.module(module("lib/emails/send.ts"), { namedExports: { sendTransactionalEmail: async () => ({ ok: true }) } });
const { POST } = (await import(module("app/api/webhooks/stripe/route.ts"))) as typeof import("@/app/api/webhooks/stripe/route");
const { PLAN_CREDITS } = await import("@/lib/stripe/config");

/** Un profil, et une table stripe_events en mémoire (dédoublonnage des événements). */
function setup(credits: number, extra: Record<string, unknown> = {}): { db: FakeDb; userId: string; events: Set<string> } {
  const userId = "dddddddd-0000-4000-8000-000000000001";
  const { db, client } = createFakeSupabase(seedAnalyses({ userId, credits, analyses: [] }));
  Object.assign(db.profiles[0], extra);
  const events = new Set<string>();
  current.client = {
    from(table: string) {
      if (table === "stripe_events") {
        return {
          insert: async (v: { id: string }) =>
            events.has(v.id) ? { error: { code: "23505", message: "duplicate" } } : (events.add(v.id), { error: null }),
          delete: () => ({ eq: async (_c: string, id: string) => { events.delete(id); return { error: null }; } }),
        };
      }
      return (client as { from: (t: string) => unknown }).from(table);
    },
    auth: { admin: { getUserById: async () => ({ data: { user: null } }) } },
  };
  return { db, userId, events };
}

async function deliver(event: unknown): Promise<number> {
  const body = JSON.stringify(event);
  const res = await POST({ text: async () => body, headers: { get: () => "sig" } } as never);
  return res.status;
}

async function silence<T>(fn: () => Promise<T>): Promise<T> {
  const e = console.error, w = console.warn;
  console.error = () => {};
  console.warn = () => {};
  try { return await fn(); } finally { console.error = e; console.warn = w; }
}

const single = (userId: string) => ({
  id: "evt_single_1", type: "checkout.session.completed",
  data: { object: { id: "cs_1", mode: "payment", client_reference_id: userId, payment_intent: "pi_1" } },
});

test("ajout à l'issue inconnue : 200, pas de renvoi, crédité une seule fois", async () => {
  const { db, userId } = setup(0);
  let premier = true;
  db.faults.push((c) => {
    if (premier && c.table === "profiles" && c.op === "update") { premier = false; return { commitThenError: { message: "fetch failed" } }; }
    return undefined;
  });
  assert.equal(await silence(() => deliver(single(userId))), 200);
  assert.equal(await silence(() => deliver(single(userId))), 200, "un éventuel renvoi est dédoublonné");
  assert.equal(db.profiles[0].credits_remaining, 1);
});

test("lecture du profil en erreur : 500, l'événement est renvoyé puis crédité une fois", async () => {
  const { db, userId, events } = setup(0);
  let premier = true;
  db.faults.push((c) => {
    if (premier && c.table === "profiles" && c.op === "select") { premier = false; return { error: { message: "fetch failed" } }; }
    return undefined;
  });
  assert.equal(await silence(() => deliver(single(userId))), 500);
  assert.equal(events.size, 0, "marque retirée : Stripe peut renvoyer");
  assert.equal(await silence(() => deliver(single(userId))), 200);
  assert.equal(db.profiles[0].credits_remaining, 1);
});

test("rien d'écrit : 500, puis le renvoi crédite une fois", async () => {
  const { db, userId } = setup(0);
  let selects = 0;
  db.faults.push((c) => {
    if (c.table === "profiles" && c.op === "select" && ++selects === 2) return { error: { message: "fetch failed" } };
    return undefined;
  });
  assert.equal(await silence(() => deliver(single(userId))), 500);
  assert.equal(await silence(() => deliver(single(userId))), 200);
  assert.equal(db.profiles[0].credits_remaining, 1);
});

test("changement de formule pendant une réservation : le débit n'est pas écrasé", async () => {
  const { db, userId } = setup(5, { subscription_plan: "pro", stripe_customer_id: "cus_1" });
  let premier = true;
  db.faults.push((c) => {
    if (premier && c.table === "profiles" && c.op === "update" && c.values?.subscription_plan === "business") {
      premier = false;
      // decrement_credits_atomic d'une analyse, validé entre la lecture et l'écriture du webhook
      const p = db.profiles[0] as { credits_remaining: number };
      p.credits_remaining -= 1;
      db.credits_transactions.push({ type: "usage", amount: -1, user_id: userId, balance_after: p.credits_remaining });
    }
    return undefined;
  });
  const evt = {
    id: "evt_up_1", type: "customer.subscription.updated",
    data: { object: { customer: "cus_1", items: { data: [{ price: { id: "price_business" } }] } } },
  };
  assert.equal(await silence(() => deliver(evt)), 500, "solde modifié entre-temps : Stripe renvoie");
  assert.equal(await silence(() => deliver(evt)), 200);
  assert.equal(db.profiles[0].credits_remaining, 5 - 1 + (PLAN_CREDITS.business - PLAN_CREDITS.pro));
  assert.equal(db.profiles[0].subscription_plan, "business");
});
