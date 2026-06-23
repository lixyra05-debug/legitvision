import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate-limiting des routes sensibles (paiement + analyse).
 *
 * - Si UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN sont définis →
 *   limites distribuées FIABLES (état partagé entre toutes les instances serverless).
 * - Sinon → fallback in-memory best-effort (par-instance, NON fiable à l'échelle :
 *   se réinitialise au recyclage d'instance et n'est pas partagé entre instances).
 *   Permet de déployer sans bloquer ; un warning est loggé.
 * - "Fail-open" : toute erreur du limiter laisse passer la requête — on ne casse
 *   JAMAIS un paiement ou une analyse à cause d'un souci d'infra de rate-limit.
 */

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number; // epoch ms
};

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(url && token);

const redis = useUpstash ? new Redis({ url: url as string, token: token as string }) : null;

if (useUpstash) {
  // Marqueur positif greppable dans les logs (jamais de secret loggé).
  console.log("[rate-limit] mode=upstash — limites distribuées fiables (Redis).");
} else {
  console.warn(
    "[rate-limit] mode=in-memory — UPSTASH_REDIS_REST_URL/TOKEN absents " +
      "(fallback best-effort, par-instance). Configurez Upstash pour des limites fiables en prod.",
  );
}

type SlidingWindowArg = Parameters<typeof Ratelimit.slidingWindow>[1];

// Memoïse un Ratelimit par configuration (limit/fenêtre).
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowSec: number): Ratelimit {
  const key = `${limit}:${windowSec}`;
  let limiter = upstashLimiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis as Redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s` as SlidingWindowArg),
      prefix: "lv_rl",
      analytics: false,
    });
    upstashLimiters.set(key, limiter);
  }
  return limiter;
}

// ── Fallback in-memory (sliding window approximatif) ──
const memStore = new Map<string, number[]>();

function memLimit(identifier: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const hits = (memStore.get(identifier) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    memStore.set(identifier, hits);
    return { success: false, remaining: 0, reset: hits[0] + windowMs };
  }

  hits.push(now);
  memStore.set(identifier, hits);

  // Nettoyage léger pour borner la mémoire (par-instance).
  if (memStore.size > 5000) {
    memStore.forEach((v, k) => {
      const fresh = v.filter((t) => now - t < windowMs);
      if (fresh.length === 0) memStore.delete(k);
      else memStore.set(k, fresh);
    });
  }

  return { success: true, remaining: limit - hits.length, reset: now + windowMs };
}

/**
 * Vérifie le quota pour un identifiant (typiquement `route:${user.id}`).
 * @param windowSec fenêtre en secondes (ex. 60 = par minute)
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  try {
    if (useUpstash && redis) {
      const r = await getUpstashLimiter(limit, windowSec).limit(identifier);
      return { success: r.success, remaining: r.remaining, reset: r.reset };
    }
    return memLimit(identifier, limit, windowSec);
  } catch (err) {
    // Fail-open : ne jamais bloquer le flux métier à cause du rate-limit.
    console.error("[rate-limit] erreur (fail-open) :", err);
    return { success: true, remaining: limit, reset: Date.now() + windowSec * 1000 };
  }
}

/** Réponse 429 standard avec en-tête Retry-After (secondes). */
export function tooManyRequests(reset: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Trop de requêtes. Réessayez dans un instant." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
