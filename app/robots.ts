import type { MetadataRoute } from "next";
import { SITE_URL as BASE_URL } from "@/lib/site-url";

// Pages hors index : API, connexion, espace client, paiement.
// Un groupe nommé REMPLACE le groupe « * » pour son robot (RFC 9309 §2.2.1) :
// il n'hérite pas de ses règles. La liste est donc répétée dans chaque groupe,
// depuis cette seule constante.
const DISALLOW = ["/api/", "/auth", "/dashboard", "/check", "/admin", "/checkout"];

// Robots des moteurs de réponse IA, autorisés explicitement sur le reste du site.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/"], disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
