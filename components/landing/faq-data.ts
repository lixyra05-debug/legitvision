import type { Locale } from "@/lib/i18n/translations";

export type FaqItem = { q: string; a: string };

const FAQ_ITEMS_FR: FaqItem[] = [
  {
    q: "Comment fonctionne l'analyse par IA ?",
    a: "Selon le modèle, notre IA Vision examine jusqu'à 10 zones d'authentification (coutures, logo, matériaux, étiquettes…). Pour calculer le score de confiance, elle s'appuie sur les repères de la marque et, quand notre base en contient, sur les points d'authentification propres au modèle (3 924 au total).",
  },
  {
    q: "Est-ce que LegitVision certifie l'authenticité ?",
    a: "Non. LegitVision fournit une estimation de probabilité basée sur l'analyse visuelle par IA. Nous ne délivrons pas de certificat d'authenticité. Pour une certification officielle, nous recommandons de consulter un expert agréé par la marque.",
  },
  {
    q: "Que se passe-t-il si l'IA se trompe ?",
    a: "L'IA peut se tromper, c'est pourquoi nous fournissons un score de confiance et non une certification. Si le score est entre 40 et 60, l'analyse est automatiquement signalée pour revue. Nous recommandons toujours de croiser nos résultats avec d'autres sources.",
  },
  {
    q: "Mes photos sont-elles stockées ?",
    a: "Vos photos sont hébergées de manière sécurisée en Europe (Supabase, Irlande) et servent uniquement à votre analyse. Pour la produire, elles sont transmises chiffrées à notre sous-traitant d'IA, Anthropic, qui les supprime sous 30 jours, sauf exceptions prévues par ses conditions, et ne s'en sert pas pour entraîner ses modèles. Nous conservons vos photos avec votre analyse ; vous pouvez en demander l'effacement à tout moment.",
  },
  {
    q: "Quelles marques sont supportées ?",
    a: "Vous pouvez analyser 520 modèles de 56 marques, en sneakers, sacs et vêtements : Nike, Jordan, adidas, New Balance, Louis Vuitton et bien d'autres. Nous ajoutons régulièrement de nouveaux modèles. Contactez-nous pour demander une marque spécifique.",
  },
  {
    q: "Combien coûte une analyse ?",
    a: "L'utilisation unique coûte 3,99€. Le forfait Mensuel est à 19,99€/mois pour 10 analyses. Le Premium est à 29,99€/mois pour 50 analyses. Aucune analyse gratuite n'est incluse.",
  },
  {
    q: "Combien de temps prend une analyse ?",
    a: "Il faut en médiane 47 secondes entre le lancement de l'analyse et le rapport, envoi des photos compris.",
  },
  {
    q: "Comment prendre de bonnes photos pour l'analyse ?",
    a: "Suivez notre guide photo intégré qui vous indique exactement quelles vues capturer. Utilisez un bon éclairage, un fond neutre, et une résolution d'au moins 800×800 pixels. Plus vos photos sont nettes, plus l'analyse sera précise.",
  },
];

const FAQ_ITEMS_EN: FaqItem[] = [
  {
    q: "How does the AI analysis work?",
    a: "Depending on the model, our Vision AI examines up to 10 authentication zones (stitching, logo, materials, labels…). To compute the confidence score, it relies on the brand's markers and, when our database has them, on the model's own authentication points (3,924 in total).",
  },
  {
    q: "Does LegitVision certify authenticity?",
    a: "No. LegitVision provides a probability estimate based on visual AI analysis. We do not issue certificates of authenticity. For an official certification, we recommend consulting a brand-approved expert.",
  },
  {
    q: "What if the AI gets it wrong?",
    a: "The AI can be wrong, which is why we provide a confidence score rather than a certification. If the score is between 40 and 60, the analysis is automatically flagged for review. We always recommend cross-checking our results with other sources.",
  },
  {
    q: "Are my photos stored?",
    a: "Your photos are securely hosted in Europe (Supabase, Ireland) and used only for your analysis. To produce it, they are sent encrypted to our AI subprocessor, Anthropic, which deletes them within 30 days, except as provided in its terms, and does not use them to train its models. We keep your photos with your analysis; you can ask us to erase them at any time.",
  },
  {
    q: "Which brands are supported?",
    a: "You can check 520 models from 56 brands, in sneakers, bags and clothing: Nike, Jordan, adidas, New Balance, Louis Vuitton and many more. We regularly add new models. Contact us to request a specific brand.",
  },
  {
    q: "How much does an analysis cost?",
    a: "Single use costs €3.99. The Monthly plan is €19.99/month for 10 analyses. Premium is €29.99/month for 50 analyses. No free analysis is included.",
  },
  {
    q: "How long does an analysis take?",
    a: "From launching the analysis to the report takes a median of 47 seconds, photo upload included.",
  },
  {
    q: "How do I take good photos for the analysis?",
    a: "Follow our built-in photo guide which tells you exactly which views to capture. Use good lighting, a neutral background, and a resolution of at least 800×800 pixels. The sharper your photos, the more accurate the analysis.",
  },
];

const FAQ_BY_LOCALE: Record<Locale, FaqItem[]> = {
  fr: FAQ_ITEMS_FR,
  en: FAQ_ITEMS_EN,
};

export function getFaqItems(locale: Locale): FaqItem[] {
  return FAQ_BY_LOCALE[locale] ?? FAQ_ITEMS_FR;
}

// Backward compat — pages SEO et anciens imports utilisent FAQ_ITEMS (FR par défaut)
export const FAQ_ITEMS = FAQ_ITEMS_FR;
