// La VRAIE route de la purge (app/api/cron/purge-photos/route.ts) sur un faux
// stockage, sans réseau. Revue du 05/10 : la marge ne tolère qu'un échec, et
// rien ne signalait un passage en échec ou manqué. Désormais :
// - un passage qui échoue, ou qui trouve une photo de plus de 30 jours, envoie
//   une alerte par e-mail ;
// - un passage réussi envoie un battement à la sonde (PURGE_HEARTBEAT_URL) ;
// - le passage à blanc ne signale rien ; sans CRON_SECRET, l'appel est refusé
//   et journalisé.
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { fauxAdmin, type Objet } from "./support/faux-stockage-photos";

const racine = new URL("../../", import.meta.url);
const module = (chemin: string) => new URL(chemin, racine).href;

type Email = { to: string; subject: string; html: string };
const etat: { client: unknown; emails: Email[] } = { client: null, emails: [] };
mock.module(module("lib/supabase/admin.ts"), { namedExports: { createAdminClient: () => etat.client } });
mock.module(module("lib/emails/send.ts"), {
  namedExports: {
    sendTransactionalEmail: async (email: Email) => {
      etat.emails.push(email);
      return { ok: true };
    },
  },
});
const { GET } = (await import(module("app/api/cron/purge-photos/route.ts"))) as typeof import("@/app/api/cron/purge-photos/route");
const { NextRequest } = await import("next/server");
const { PHOTO_RETENTION_DAYS } = await import("@/lib/site-facts");

const SECRET = "secret-de-test";
const SONDE = "https://sonde.example/battement/jeton";
const HEURE = 3_600_000;
const ilYa = (heures: number) => new Date(Date.now() - heures * HEURE).toISOString();

/** Appelle la route ; journaux et fetch remplacés le temps de l'appel. */
async function appeler({
  objets = [] as Objet[],
  panne,
  auth = `Bearer ${SECRET}`,
  dry = false,
}: { objets?: Objet[]; panne?: string; auth?: string | null; dry?: boolean } = {}) {
  etat.client = fauxAdmin(objets, [], { panne }).admin;
  etat.emails = [];
  const battements: string[] = [];
  const erreurs: string[] = [];
  const { fetch: fetchReel, console: c } = globalThis;
  const [err, info, warn] = [c.error, c.info, c.warn];
  globalThis.fetch = (async (url: string | URL | Request) => {
    battements.push(String(url));
    return new Response(null, { status: 200 });
  }) as typeof fetch;
  c.error = (...args: unknown[]) => void erreurs.push(args.map(String).join(" "));
  c.info = () => {};
  c.warn = () => {};
  try {
    const headers = new Headers();
    if (auth) headers.set("authorization", auth);
    const reponse = await GET(new NextRequest(`http://localhost/api/cron/purge-photos${dry ? "?dry=1" : ""}`, { headers }));
    return { statut: reponse.status, corps: (await reponse.json()) as Record<string, unknown>, emails: etat.emails, battements, erreurs };
  } finally {
    globalThis.fetch = fetchReel;
    [c.error, c.info, c.warn] = [err, info, warn];
  }
}

function avecEnv(env: Record<string, string | undefined>, essai: () => Promise<void>) {
  return async () => {
    const avant = Object.fromEntries(Object.keys(env).map((k) => [k, process.env[k]]));
    for (const [k, v] of Object.entries(env)) v === undefined ? delete process.env[k] : (process.env[k] = v);
    try {
      await essai();
    } finally {
      for (const [k, v] of Object.entries(avant)) v === undefined ? delete process.env[k] : (process.env[k] = v);
    }
  };
}

const ENV = { CRON_SECRET: SECRET, PURGE_HEARTBEAT_URL: SONDE, PURGE_ALERT_EMAIL: undefined };
const recente: Objet = { path: "u1/a1/sole.jpg", writtenAt: ilYa(24), size: 10 };
const enRetard: Objet = { path: "u2/a2/box.jpg", writtenAt: ilYa(PHOTO_RETENTION_DAYS * 24 + 5), size: 20 };

test(
  "sans CRON_SECRET : 401, refus journalisé, ni purge ni signal",
  avecEnv({ ...ENV, CRON_SECRET: undefined }, async () => {
    const r = await appeler({ objets: [enRetard] });
    assert.equal(r.statut, 401);
    assert.ok(r.erreurs.some((e) => e.includes("CRON_SECRET absent")), r.erreurs.join("\n"));
    assert.equal(r.emails.length, 0);
    assert.equal(r.battements.length, 0);
  }),
);

test(
  "mauvais secret : 401, sans journal ni signal",
  avecEnv(ENV, async () => {
    for (const auth of ["Bearer autre-secret", null]) {
      const r = await appeler({ objets: [enRetard], auth });
      assert.equal(r.statut, 401);
      assert.deepEqual([r.erreurs, r.emails, r.battements], [[], [], []]);
    }
  }),
);

test(
  "passage réussi : battement envoyé à la sonde, aucune alerte",
  avecEnv(ENV, async () => {
    const r = await appeler({ objets: [recente] });
    assert.equal(r.statut, 200);
    assert.equal(r.corps.overdueObjects, 0);
    assert.deepEqual(r.battements, [SONDE]);
    assert.equal(r.emails.length, 0);
    assert.ok(!r.erreurs.some((e) => e.includes(SONDE)), "l'adresse de la sonde n'est jamais journalisée");
  }),
);

test(
  "sans PURGE_HEARTBEAT_URL : le passage réussit, sans battement",
  avecEnv({ ...ENV, PURGE_HEARTBEAT_URL: undefined }, async () => {
    const r = await appeler({ objets: [recente] });
    assert.equal(r.statut, 200);
    assert.equal(r.battements.length, 0);
  }),
);

test(
  "photo de plus de 30 jours au début du passage : alerte à l'adresse de contact, puis battement",
  avecEnv(ENV, async () => {
    const r = await appeler({ objets: [recente, enRetard] });
    assert.equal(r.statut, 200);
    assert.equal(r.corps.overdueObjects, 1);
    assert.equal(r.corps.deletedObjects, 1, "le passage la supprime");
    assert.equal(r.emails.length, 1);
    assert.equal(r.emails[0].to, "legitvision.contact@gmail.com");
    assert.match(r.emails[0].subject, /plus de 30 jours/);
    assert.match(r.emails[0].html, /1 photo\(s\) avaient plus de 30 jours/);
    assert.deepEqual(r.battements, [SONDE]);
  }),
);

test(
  "passage en échec : 500, alerte par e-mail (PURGE_ALERT_EMAIL), aucun battement",
  avecEnv({ ...ENV, PURGE_ALERT_EMAIL: "alertes@example.com" }, async () => {
    const r = await appeler({ objets: [recente], panne: "The connection to the database timed out" });
    assert.equal(r.statut, 500);
    assert.deepEqual(r.corps, { error: "Purge interrompue" });
    assert.equal(r.emails.length, 1);
    assert.equal(r.emails[0].to, "alertes@example.com");
    assert.match(r.emails[0].subject, /passage interrompu/);
    assert.doesNotMatch(r.emails[0].html, /timed out/, "le détail de l'erreur reste dans les journaux");
    assert.equal(r.battements.length, 0);
  }),
);

test(
  "passage à blanc (?dry=1) : ni alerte ni battement, même avec une photo de plus de 30 jours ou en échec",
  avecEnv(ENV, async () => {
    const compte = await appeler({ objets: [enRetard], dry: true });
    assert.equal(compte.statut, 200);
    assert.equal(compte.corps.overdueObjects, 1);
    assert.equal(compte.corps.deletedObjects, 0);
    const panne = await appeler({ panne: "base injoignable", dry: true });
    assert.equal(panne.statut, 500);
    for (const r of [compte, panne]) assert.deepEqual([r.emails, r.battements], [[], []]);
  }),
);
