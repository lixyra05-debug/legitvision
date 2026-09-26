// Disjoncteur et repli du limiteur de débit, sans réseau : un faux client
// Upstash qui ne répond pas, échoue ou répond.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter, type RateLimitResult, type RemoteLimiter } from "@/lib/rate-limit";

const MINUTE = 60;
const SECRET = "https://jeton-secret@exemple.upstash.io";

function journal() {
  const lignes: string[] = [];
  return {
    lignes,
    logger: {
      info: (...args: unknown[]) => void lignes.push(args.join(" ")),
      warn: (...args: unknown[]) => void lignes.push(args.join(" ")),
    },
  };
}

function horloge(depart = 1_000_000) {
  let t = depart;
  return { now: () => t, avancer: (ms: number) => void (t += ms) };
}

function faux(comportement: () => Promise<RateLimitResult>) {
  let appels = 0;
  const remote: RemoteLimiter = {
    limit: () => {
      appels++;
      return comportement();
    },
  };
  return { remote, appels: () => appels };
}

test("Upstash qui ne répond pas : décision en mémoire au délai, puis disjoncteur", async () => {
  const { remote, appels } = faux(() => new Promise<never>(() => {}));
  const { lignes, logger } = journal();
  const h = horloge();
  const limiteur = createRateLimiter({ remote, timeoutMs: 40, breakerMs: 60_000, now: h.now, logger });

  const debut = Date.now();
  const premier = await limiteur.limit("analyze:u1", 2, MINUTE);
  const duree = Date.now() - debut;
  assert.equal(premier.success, true);
  assert.ok(duree >= 35 && duree < 1000, `attente de ${duree} ms`);
  assert.equal(limiteur.isRemoteDisabled(), true);
  assert.equal(lignes.length, 1);
  assert.match(lignes[0], /Upstash indisponible \(délai de 40 ms dépassé\)/);

  // Disjoncteur ouvert : plus d'appel à Upstash, et la limite est RÉELLE (plus de fail-open).
  const deuxieme = await limiteur.limit("analyze:u1", 2, MINUTE);
  const troisieme = await limiteur.limit("analyze:u1", 2, MINUTE);
  assert.equal(deuxieme.success, true);
  assert.equal(troisieme.success, false, "la 3e requête sur 2 permises doit être refusée");
  assert.equal(appels(), 1);
});

test("Upstash en erreur (DNS introuvable) : repli immédiat, journal sans secret", async () => {
  const { remote, appels } = faux(async () => {
    const cause = Object.assign(new Error(`getaddrinfo ENOTFOUND ${SECRET}`), { code: "ENOTFOUND" });
    throw new TypeError(`fetch failed ${SECRET}`, { cause });
  });
  const { lignes, logger } = journal();
  const h = horloge();
  const limiteur = createRateLimiter({ remote, timeoutMs: 500, breakerMs: 60_000, now: h.now, logger });

  const debut = Date.now();
  const r = await limiteur.limit("checkout:u2", 5, MINUTE);
  assert.ok(Date.now() - debut < 100, "aucune attente sur une erreur immédiate");
  assert.equal(r.success, true);
  assert.equal(r.remaining, 4);
  assert.equal(appels(), 1);
  assert.equal(lignes.length, 1);
  assert.match(lignes[0], /TypeError \(ENOTFOUND\)/);
  assert.ok(!lignes[0].includes("jeton-secret"), "le journal ne doit contenir ni URL ni jeton");
  assert.ok(!lignes[0].includes("checkout:u2"), "le journal ne doit pas recopier l'identifiant");
});

test("après le délai du disjoncteur : Upstash réessayé, puis rétabli s'il répond", async () => {
  let enPanne = true;
  const { remote, appels } = faux(async () => {
    if (enPanne) throw new Error("panne");
    return { success: true, remaining: 9, reset: 42 };
  });
  const { lignes, logger } = journal();
  const h = horloge();
  const limiteur = createRateLimiter({ remote, timeoutMs: 100, breakerMs: 60_000, now: h.now, logger });

  await limiteur.limit("cancel:u3", 10, MINUTE);
  assert.equal(appels(), 1);

  h.avancer(59_999);
  await limiteur.limit("cancel:u3", 10, MINUTE);
  assert.equal(appels(), 1, "toujours désactivé avant la fin du délai");

  h.avancer(2);
  enPanne = false;
  const r = await limiteur.limit("cancel:u3", 10, MINUTE);
  assert.equal(appels(), 2);
  assert.deepEqual(r, { success: true, remaining: 9, reset: 42 });
  assert.equal(limiteur.isRemoteDisabled(), false);
  assert.match(lignes.at(-1) ?? "", /Upstash répond de nouveau/);
});

test("Upstash sain : sa décision est suivie, y compris un refus", async () => {
  const { remote, appels } = faux(async () => ({ success: false, remaining: 0, reset: 123 }));
  const { lignes, logger } = journal();
  const limiteur = createRateLimiter({ remote, timeoutMs: 100, logger });
  const r = await limiteur.limit("analyze:u4", 10, MINUTE);
  assert.deepEqual(r, { success: false, remaining: 0, reset: 123 });
  assert.equal(appels(), 1);
  assert.equal(lignes.length, 0);
  assert.equal(limiteur.isRemoteDisabled(), false);
});

test("sans Upstash : limite en mémoire, par identifiant et par fenêtre", async () => {
  const h = horloge();
  const limiteur = createRateLimiter({ remote: null, now: h.now, logger: journal().logger });
  assert.equal((await limiteur.limit("a", 1, MINUTE)).success, true);
  assert.equal((await limiteur.limit("a", 1, MINUTE)).success, false);
  assert.equal((await limiteur.limit("b", 1, MINUTE)).success, true);
  h.avancer(MINUTE * 1000);
  assert.equal((await limiteur.limit("a", 1, MINUTE)).success, true, "fenêtre écoulée");
});
