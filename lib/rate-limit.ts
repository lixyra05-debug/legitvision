import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate-limiting des routes sensibles (analyse, paiement, résiliation).
 *
 * - Si UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN sont définis →
 *   limites distribuées (état partagé entre toutes les instances serverless),
 *   tant qu'Upstash répond.
 * - Sinon → limiteur en mémoire, par instance (se réinitialise au recyclage
 *   d'instance, n'est pas partagé entre instances). Un avertissement est
 *   journalisé au démarrage.
 * - Upstash est BORNÉ : au-delà de UPSTASH_TIMEOUT_MS, ou en cas d'erreur, la
 *   requête est jugée par le limiteur en mémoire (plus de « fail-open » qui
 *   laissait tout passer), et Upstash est désactivé sur cette instance pendant
 *   UPSTASH_BREAKER_MS (disjoncteur). La première requête après ce délai
 *   réessaie Upstash : une base Upstash réparée reprend la main seule.
 *
 * Pourquoi : le 2026-09-26, l'hôte Upstash configuré ne se résolvait plus
 * (NXDOMAIN). Le client Upstash réessayait 5 fois avec attente croissante :
 * environ 4,3 s perdues à chaque analyse, paiement ou résiliation, pour une
 * limite qui laissait finalement tout passer.
 */

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms
};

/** Limiteur distant (Upstash en production, simulé dans les tests). */
export interface RemoteLimiter {
  limit(identifier: string, limit: number, windowSec: number): Promise<RateLimitResult>;
}

/**
 * Délai maximal accordé à Upstash. Un appel sain fait un ou deux allers-retours
 * HTTP (script Lua, rechargé s'il manque) : quelques dizaines de ms dans la
 * même région, moins de 200 ms même à travers l'Atlantique (fonctions à iad1).
 * 500 ms laissent cette marge, et bornent la perte quand Upstash ne répond pas.
 */
export const UPSTASH_TIMEOUT_MS = 500;

/**
 * Durée de désactivation d'Upstash sur une instance après un échec : tant
 * qu'Upstash est en panne, au plus une requête toutes les 5 minutes par
 * instance paie le délai ci-dessus, et une base réparée est reprise sous
 * 5 minutes.
 */
export const UPSTASH_BREAKER_MS = 5 * 60 * 1000;

/** Erreur levée quand Upstash dépasse son délai. */
class RemoteTimeoutError extends Error {
  constructor(ms: number) {
    super(`délai de ${ms} ms dépassé`);
    this.name = "RemoteTimeoutError";
  }
}

/**
 * Cause d'échec, SANS secret : ni jeton, ni URL, ni commande (le message
 * d'erreur d'Upstash recopie la commande, donc l'identifiant de l'utilisateur).
 */
function describeFailure(err: unknown): string {
  if (err instanceof RemoteTimeoutError) return err.message;
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause;
    const code =
      cause && typeof cause === "object" && "code" in cause
        ? (cause as { code: unknown }).code
        : (err as Error & { code?: unknown }).code;
    return code ? `${err.name} (${String(code)})` : err.name;
  }
  return "erreur inconnue";
}

type Logger = Pick<Console, "info" | "warn">;

/**
 * Crée un limiteur : `remote` (Upstash) borné, doublé du limiteur en mémoire.
 * Exporté pour les tests, qui y injectent un faux client.
 */
export function createRateLimiter(options: {
  remote: RemoteLimiter | null;
  timeoutMs?: number;
  breakerMs?: number;
  now?: () => number;
  logger?: Logger;
}) {
  const remote = options.remote;
  const timeoutMs = options.timeoutMs ?? UPSTASH_TIMEOUT_MS;
  const breakerMs = options.breakerMs ?? UPSTASH_BREAKER_MS;
  const now = options.now ?? Date.now;
  const logger = options.logger ?? console;

  // ── Limiteur en mémoire (fenêtre glissante approximative, par instance) ──
  const memStore = new Map<string, number[]>();

  function memLimit(identifier: string, limit: number, windowSec: number): RateLimitResult {
    const t = now();
    const windowMs = windowSec * 1000;
    const hits = (memStore.get(identifier) ?? []).filter((h) => t - h < windowMs);

    if (hits.length >= limit) {
      memStore.set(identifier, hits);
      return { success: false, remaining: 0, reset: hits[0] + windowMs };
    }

    hits.push(t);
    memStore.set(identifier, hits);

    // Nettoyage léger pour borner la mémoire (par instance).
    if (memStore.size > 5000) {
      memStore.forEach((v, k) => {
        const fresh = v.filter((h) => t - h < windowMs);
        if (fresh.length === 0) memStore.delete(k);
        else memStore.set(k, fresh);
      });
    }

    return { success: true, remaining: limit - hits.length, reset: t + windowMs };
  }

  // ── Disjoncteur : Upstash désactivé jusqu'à cette date (ms) ; 0 = jamais déclenché ──
  let remoteDisabledUntil = 0;

  async function remoteLimit(
    client: RemoteLimiter,
    identifier: string,
    limit: number,
    windowSec: number,
  ): Promise<RateLimitResult> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new RemoteTimeoutError(timeoutMs)), timeoutMs);
    });
    try {
      return await Promise.race([client.limit(identifier, limit, windowSec), timeout]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }

  return {
    /** true tant que le disjoncteur tient Upstash à l'écart (tests, diagnostic). */
    isRemoteDisabled(): boolean {
      return remoteDisabledUntil > now();
    },

    /** Ne lève jamais d'erreur ; n'attend jamais plus de `timeoutMs`. */
    async limit(identifier: string, limit: number, windowSec: number): Promise<RateLimitResult> {
      if (!remote || remoteDisabledUntil > now()) {
        return memLimit(identifier, limit, windowSec);
      }

      const wasTripped = remoteDisabledUntil !== 0;
      try {
        const r = await remoteLimit(remote, identifier, limit, windowSec);
        if (wasTripped) {
          remoteDisabledUntil = 0;
          logger.info("[rate-limit] Upstash répond de nouveau : limites distribuées rétablies.");
        }
        return { success: r.success, remaining: r.remaining, reset: r.reset };
      } catch (err) {
        remoteDisabledUntil = now() + breakerMs;
        logger.warn(
          `[rate-limit] Upstash indisponible (${describeFailure(err)}) : limite en mémoire ` +
            `pour cette requête ; Upstash désactivé sur cette instance pendant ` +
            `${Math.round(breakerMs / 1000)} s.`,
        );
        return memLimit(identifier, limit, windowSec);
      }
    },
  };
}

// ── Instance du serveur, configurée par l'environnement ──

function createUpstashLimiter(redisUrl: string, redisToken: string): RemoteLimiter {
  // Aucune nouvelle tentative côté client Upstash : c'est le disjoncteur qui
  // décide. Chaque requête reçoit son propre signal, qui coupe la requête HTTP
  // au délai (sous forme de fonction, le client lève une erreur ; un signal
  // fixe lui ferait renvoyer une fausse réponse « Aborted »).
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
    retry: { retries: 0 },
    signal: () => AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
  });

  type SlidingWindowArg = Parameters<typeof Ratelimit.slidingWindow>[1];
  // Memoïse un Ratelimit par configuration (limit/fenêtre).
  const limiters = new Map<string, Ratelimit>();

  return {
    async limit(identifier, limit, windowSec) {
      const key = `${limit}:${windowSec}`;
      let limiter = limiters.get(key);
      if (!limiter) {
        limiter = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${windowSec} s` as SlidingWindowArg),
          prefix: "lv_rl",
          analytics: false,
          // 0 : pas de délai interne. Celui d'Upstash laisse PASSER la requête
          // à l'échéance ; le nôtre la confie au limiteur en mémoire.
          timeout: 0,
        });
        limiters.set(key, limiter);
      }
      const r = await limiter.limit(identifier);
      return { success: r.success, remaining: r.remaining, reset: r.reset };
    },
  };
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(url && token);

if (useUpstash) {
  // Marqueur positif greppable dans les logs (jamais de secret loggé).
  console.info(
    `[rate-limit] mode=upstash — limites distribuées, bornées à ${UPSTASH_TIMEOUT_MS} ms, ` +
      "repli en mémoire si Upstash ne répond pas.",
  );
} else {
  console.warn(
    "[rate-limit] mode=in-memory — UPSTASH_REDIS_REST_URL/TOKEN absents " +
      "(limites par instance). Configurez Upstash pour des limites partagées.",
  );
}

const serverLimiter = createRateLimiter({
  remote: useUpstash ? createUpstashLimiter(url as string, token as string) : null,
});

/**
 * Vérifie le quota pour un identifiant (typiquement `route:${user.id}`).
 * Ne lève jamais d'erreur et n'attend jamais plus de UPSTASH_TIMEOUT_MS.
 * @param windowSec fenêtre en secondes (ex. 60 = par minute)
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  return serverLimiter.limit(identifier, limit, windowSec);
}

/** Réponse 429 standard avec en-tête Retry-After (secondes). */
export function tooManyRequests(reset: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Trop de requêtes. Réessayez dans un instant." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
