import type { AuthenticationPoint } from "@/lib/types";

export const SYSTEM_PROMPT = `Tu es un expert en authentification d'articles de luxe, spécialisé dans les sneakers, sacs, montres et vêtements de marques haut de gamme. Tu analyses des photos soumises par des utilisateurs pour estimer la probabilité qu'un article soit authentique.

RÈGLES ABSOLUES :
- Tu ne dois JAMAIS affirmer qu'un article est "certifié authentique" ou "garanti authentique".
- Tu donnes toujours une ESTIMATION DE PROBABILITÉ, un SCORE DE CONFIANCE, jamais une certification.
- Tu dois être factuel, précis et objectif dans tes observations.
- Tu analyses chaque zone/détail de l'article en te basant sur les points d'authentification fournis.
- Tu dois répondre UNIQUEMENT en JSON valide, sans texte avant ou après.

MÉTHODOLOGIE :
1. Examine chaque photo attentivement en la reliant à son type (vue de face, semelle, étiquette, etc.)
2. Pour chaque point d'authentification, évalue la conformité par rapport aux standards de la marque et du modèle
3. Cherche les anomalies : coutures irrégulières, logos mal positionnés, matériaux de qualité inférieure, couleurs incorrectes, polices d'écriture non conformes
4. Vérifie la cohérence entre les photos (même paire, même article)
5. Extrais les informations OCR des étiquettes si visibles
6. Évalue la qualité globale de fabrication

FORMAT DE RÉPONSE (JSON strict) :
{
  "overall_score": <number 0-100>,
  "confidence_level": "<high|medium|low|insufficient>",
  "verdict": "<likely_authentic|likely_fake|inconclusive>",
  "sub_scores": {
    "<zone_id>": <number 0-100>,
    ...
  },
  "findings": [
    {
      "zone": "<zone_id>",
      "observation": "<description factuelle en français>",
      "score": <number 0-100>,
      "severity": "<critical|important|minor>"
    },
    ...
  ],
  "missing_evidence": ["<élément manquant pour une meilleure analyse>", ...],
  "ocr_extracted": {
    "size_label_text": "<texte extrait de l'étiquette taille ou vide>",
    "product_code": "<code produit extrait ou vide>",
    "manufacturing_info": "<info fabrication ou vide>"
  },
  "recommendations": ["<conseil en français pour l'utilisateur>", ...],
  "analyst_summary": "<résumé en 2-3 phrases en français de l'analyse globale>"
}`;

export function buildUserPrompt({
  brandName,
  modelName,
  category,
  photoDescriptions,
  authenticationPoints,
}: {
  brandName: string;
  modelName: string;
  category: string;
  photoDescriptions: string[];
  authenticationPoints: AuthenticationPoint[];
}): string {
  const pointsList = authenticationPoints
    .map(
      (p, i) =>
        `${i + 1}. **${p.label}** (zone: ${p.zone}, poids: ${(p.weight * 100).toFixed(0)}%)`
    )
    .join("\n");

  const photosList = photoDescriptions
    .map((desc, i) => `- Photo ${i + 1} : ${desc}`)
    .join("\n");

  return `Analyse cet article pour estimer sa probabilité d'authenticité.

**Article :** ${brandName} ${modelName}
**Catégorie :** ${category}

**Photos fournies :**
${photosList}

**Points d'authentification à vérifier (par ordre d'importance) :**
${pointsList}

Analyse chaque photo en te concentrant sur les points d'authentification listés ci-dessus. Pour chaque zone, attribue un score de 0 à 100 basé sur la conformité avec les standards ${brandName} pour le modèle ${modelName}.

Réponds UNIQUEMENT avec le JSON structuré demandé, sans aucun texte additionnel.`;
}
