/**
 * Tarifs de l'API Anthropic pour le modèle de l'analyse : SOURCE UNIQUE.
 *
 * Le coût de chaque appel (lib/ai/cout-ia.ts) est calculé avec ces tarifs,
 * au prix catalogue, hors taxes, en USD. Ils ne s'appliquent qu'au modèle
 * relevé : si la réponse vient d'un autre modèle, le coût reste nul et les
 * jetons sont gardés. Jamais de tarif supposé.
 *
 * Changer de modèle (MODELE_ANALYSE) impose un nouveau relevé daté des tarifs.
 *
 * Relevé du 2026-09-30, API directe (ni Bedrock, ni Vertex) :
 * - https://platform.claude.com/docs/en/about-claude/pricing, ligne Claude
 *   Opus 4.8 : 5 $ / 6,25 $ / 10 $ / 0,50 $ / 25 $ par million de jetons ;
 *   inference_geo « us » : ×1,1 sur toutes les catégories (modèles 4.6 et
 *   suivants) ; aucun surcoût au-delà de 200 k jetons sur ces modèles ;
 * - skill claude-api, tableau « Current Models » (relevé du 2026-09-25) :
 *   Opus 4.8 à 5 $ en entrée et 25 $ en sortie ; écriture en cache ×1,25
 *   (5 min) et ×2 (1 h), lecture ×0,1.
 * La réflexion est facturée en sortie et déjà comptée dans output_tokens :
 * elle n'a pas de tarif propre.
 */

/** Modèle appelé par l'analyse (lib/ai/analyze.ts). */
export const MODELE_ANALYSE = "claude-opus-4-8";

export const TARIFS = {
  modele: MODELE_ANALYSE,
  releve_le: "2026-09-30",
  source: "https://platform.claude.com/docs/en/about-claude/pricing",
  // USD par million de jetons, inference_geo « global »
  entree: 5,
  sortie: 25,
  cache_ecriture_5_min: 6.25,
  cache_ecriture_1_h: 10,
  cache_lecture: 0.5,
  // inference_geo « us » : ×1,1 sur toutes les catégories
  multiplicateur_geo_us: 1.1,
} as const;
