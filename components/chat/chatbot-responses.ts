export type ChatbotRule = {
  keywords: string[];
  response: string;
};

export const CHATBOT_RULES: ChatbotRule[] = [
  {
    keywords: ["resilier", "annuler", "abonnement"],
    response:
      "Vous pouvez gérer votre abonnement depuis votre profil : Menu → Gérer mon abonnement (/dashboard/subscription).",
  },
  {
    keywords: ["prix", "tarif", "cout", "coute", "coutent"],
    response:
      "Nous proposons 3 formules : Utilisation unique à 3,99€, Mensuel à 19,99€/mois (10 analyses), Premium à 29,99€/mois (50 analyses).",
  },
  {
    keywords: ["comment", "fonctionne", "marche"],
    response:
      "Prenez des photos de votre article, notre IA analyse 8 zones d'authentification et vous donne un score de confiance en moins de 30 secondes.",
  },
  {
    keywords: ["marque", "modele"],
    response:
      "Nous supportons plus de 47 marques et 340+ modèles : Nike, Jordan, adidas, Louis Vuitton, Chanel, Hermès, Dior, et bien d'autres.",
  },
  {
    keywords: ["fiable", "precision", "exact", "fiabilite"],
    response:
      "LegitVision est un outil de pré-authentification visuelle. Nous ne délivrons pas de certificat officiel mais notre IA analyse chaque détail avec une grande précision.",
  },
  {
    keywords: ["contact", "aide", "probleme", "assistance"],
    response:
      "Contactez-nous à contact@lyxiria.fr. Nous répondons sous 24h.",
  },
];

export const DEFAULT_RESPONSE =
  "Je ne suis pas sûr de comprendre. Vous pouvez reformuler ou nous contacter à contact@lyxiria.fr.";

export const WELCOME_MESSAGE =
  "Bonjour 👋 Je suis l'assistant LegitVision. Posez-moi une question sur les prix, les marques, le fonctionnement ou la résiliation.";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchResponse(input: string): string {
  const text = normalize(input);
  for (const rule of CHATBOT_RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.response;
    }
  }
  return DEFAULT_RESPONSE;
}
