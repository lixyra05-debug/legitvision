import type { Locale } from "@/lib/i18n/translations";

export type ChatbotRule = {
  keywords: string[];
  response: { fr: string; en: string };
};

const CONTACT_EMAIL = "legitvision.contact@gmail.com";

/**
 * Règles chatbot bilingues FR/EN.
 * Les keywords incluent FR + EN pour permettre le matching dans les 2 langues
 * quel que soit le mode courant (un user FR peut écrire "price" et matcher).
 * La réponse retournée dépend du locale courant (matchResponse).
 */
export const CHATBOT_RULES: ChatbotRule[] = [
  {
    keywords: [
      "prix",
      "tarif",
      "tarifs",
      "cout",
      "coute",
      "couts",
      "coutent",
      "combien",
      "cher",
      "price",
      "pricing",
      "cost",
      "fee",
      "fees",
      "how much",
    ],
    response: {
      fr:
        "Nous proposons 3 formules adaptées à vos besoins :\n\n" +
        "• Utilisation unique — 3,99€ par analyse\n" +
        "• Mensuel — 19,99€/mois pour 10 analyses\n" +
        "• Premium — 29,99€/mois pour 50 analyses\n\n" +
        "Chaque analyse inclut un rapport détaillé avec score sur 100, sous-scores par zone et recommandations. Vous pouvez commencer avec une analyse unique pour tester.",
      en:
        "We offer 3 plans to fit your needs:\n\n" +
        "• Single use — €3.99 per analysis\n" +
        "• Monthly — €19.99/month for 10 analyses\n" +
        "• Premium — €29.99/month for 50 analyses\n\n" +
        "Every analysis includes a detailed report with a score out of 100, per-zone sub-scores and recommendations. You can start with a single analysis to test.",
    },
  },
  {
    keywords: [
      "resilier",
      "resiliation",
      "annuler",
      "annulation",
      "desabonner",
      "desabonnement",
      "abonnement",
      "abonnements",
      "cancel",
      "cancellation",
      "unsubscribe",
      "subscription",
    ],
    response: {
      fr:
        "Pour gérer ou résilier votre abonnement :\n\n" +
        "1. Connectez-vous à votre compte\n" +
        "2. Cliquez sur votre avatar en haut à droite\n" +
        "3. Sélectionnez « Gérer l'abonnement »\n\n" +
        `La résiliation prend effet à la fin de la période en cours. Vous conservez l'accès jusqu'à cette date. Besoin d'aide ? Écrivez-nous à ${CONTACT_EMAIL}`,
      en:
        "To manage or cancel your subscription:\n\n" +
        "1. Sign in to your account\n" +
        "2. Click your avatar in the top right\n" +
        "3. Select \"Manage subscription\"\n\n" +
        `Cancellation takes effect at the end of the current period. You keep access until that date. Need help? Email us at ${CONTACT_EMAIL}`,
    },
  },
  {
    keywords: [
      "comment",
      "fonctionne",
      "fonctionnement",
      "marche",
      "utiliser",
      "how",
      "how does it work",
      "use",
      "using",
    ],
    response: {
      fr:
        "C'est très simple :\n\n" +
        "1. Choisissez la catégorie (sneakers, sac, vêtement)\n" +
        "2. Sélectionnez la marque et le modèle\n" +
        "3. Prenez des photos en suivant notre guide\n" +
        "4. Notre IA analyse 8 zones d'authentification\n" +
        "5. Recevez votre rapport en moins de 30 secondes\n\n" +
        "Le rapport inclut un score global sur 100, des sous-scores par zone, la détection OCR des codes et des recommandations personnalisées.",
      en:
        "It's very simple:\n\n" +
        "1. Pick the category (sneakers, bag, clothing)\n" +
        "2. Select the brand and model\n" +
        "3. Take photos following our guide\n" +
        "4. Our AI analyzes 8 authentication zones\n" +
        "5. Get your report in under 30 seconds\n\n" +
        "The report includes a global score out of 100, per-zone sub-scores, OCR detection of codes and personalized recommendations.",
    },
  },
  {
    keywords: [
      "marque",
      "marques",
      "modele",
      "modeles",
      "catalogue",
      "brand",
      "brands",
      "model",
      "models",
      "catalog",
    ],
    response: {
      fr:
        "Nous supportons plus de 47 marques et 340+ modèles dans 3 catégories :\n\n" +
        "👟 Sneakers : Nike, Jordan, adidas, New Balance, Yeezy, Balenciaga, Dior, Gucci, Prada, Asics, ON Running…\n" +
        "👜 Sacs : Louis Vuitton, Chanel, Hermès, Gucci, Dior, Prada, Longchamp, Michael Kors…\n" +
        "👕 Vêtements : Supreme, Off-White, Stone Island, Moncler, Chrome Hearts, Palm Angels…\n\n" +
        "Utilisez la barre de recherche sur notre page d'accueil pour trouver votre article.",
      en:
        "We support over 47 brands and 340+ models across 3 categories:\n\n" +
        "👟 Sneakers: Nike, Jordan, adidas, New Balance, Yeezy, Balenciaga, Dior, Gucci, Prada, Asics, ON Running…\n" +
        "👜 Bags: Louis Vuitton, Chanel, Hermès, Gucci, Dior, Prada, Longchamp, Michael Kors…\n" +
        "👕 Clothing: Supreme, Off-White, Stone Island, Moncler, Chrome Hearts, Palm Angels…\n\n" +
        "Use the search bar on our homepage to find your item.",
    },
  },
  {
    keywords: [
      "fiable",
      "fiabilite",
      "precision",
      "exact",
      "confiance",
      "reliable",
      "reliability",
      "accurate",
      "accuracy",
      "trust",
    ],
    response: {
      fr:
        "Notre IA analyse chaque photo selon 8 zones d'authentification spécifiques à chaque marque et modèle. Par exemple, pour une Air Jordan 1, nous vérifions le Swoosh, les coutures, l'étiquette de langue, la semelle, etc.\n\n" +
        "Important : LegitVision est un outil de pré-authentification visuelle. Nous fournissons un score de confiance, pas un certificat officiel. Pour les articles de grande valeur, nous recommandons de croiser nos résultats avec un expert.",
      en:
        "Our AI analyzes each photo across 8 authentication zones specific to each brand and model. For example, on an Air Jordan 1, we check the Swoosh, stitching, tongue label, outsole, etc.\n\n" +
        "Important: LegitVision is a visual pre-authentication tool. We provide a confidence score, not an official certificate. For high-value items, we recommend cross-checking our results with an expert.",
    },
  },
  {
    keywords: [
      "contact",
      "contactez",
      "aide",
      "probleme",
      "problemes",
      "support",
      "help",
      "issue",
      "issues",
      "bug",
    ],
    response: {
      fr:
        "Vous pouvez nous contacter par email :\n" +
        `📧 ${CONTACT_EMAIL}\n\n` +
        "Nous répondons sous 24h du lundi au vendredi. N'hésitez pas à nous envoyer des captures d'écran si vous rencontrez un problème technique.",
      en:
        "You can reach us by email:\n" +
        `📧 ${CONTACT_EMAIL}\n\n` +
        "We reply within 24 hours, Monday to Friday. Don't hesitate to send screenshots if you encounter a technical issue.",
    },
  },
  {
    keywords: [
      "bonjour",
      "bonsoir",
      "salut",
      "hello",
      "hey",
      "coucou",
      "hi",
    ],
    response: {
      fr:
        "Bonjour ! 👋 Bienvenue sur LegitVision. Comment puis-je vous aider ?\n\n" +
        "Voici ce que je peux faire :\n" +
        "• Vous expliquer nos tarifs\n" +
        "• Vous guider pour lancer une analyse\n" +
        "• Vous renseigner sur les marques supportées\n" +
        "• Répondre à vos questions sur la fiabilité",
      en:
        "Hi! 👋 Welcome to LegitVision. How can I help?\n\n" +
        "Here's what I can do:\n" +
        "• Explain our pricing\n" +
        "• Guide you to launch an analysis\n" +
        "• Tell you about supported brands\n" +
        "• Answer your questions about reliability",
    },
  },
  {
    keywords: [
      "merci",
      "super",
      "parfait",
      "genial",
      "ok",
      "okay",
      "thanks",
      "thank you",
      "great",
      "awesome",
    ],
    response: {
      fr: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne authentification ! 🔍",
      en: "You're welcome! Feel free to ask if you have other questions. Happy authenticating! 🔍",
    },
  },
];

export const DEFAULT_RESPONSE = {
  fr:
    "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous aider avec :\n\n" +
    "• Tarifs et formules\n" +
    "• Comment fonctionne l'analyse\n" +
    "• Marques et modèles supportés\n" +
    "• Contact et support\n\n" +
    `Ou écrivez-nous directement à ${CONTACT_EMAIL}`,
  en:
    "I'm not sure I understand your question. Here's what I can help with:\n\n" +
    "• Pricing and plans\n" +
    "• How the analysis works\n" +
    "• Supported brands and models\n" +
    "• Contact and support\n\n" +
    `Or email us directly at ${CONTACT_EMAIL}`,
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches keywords on word boundaries so "stock" ne déclenche pas "ok", ni "cherche" ne déclenche "cher".
export function matchResponse(input: string, locale: Locale = "fr"): string {
  const text = normalize(input);
  for (const rule of CHATBOT_RULES) {
    for (const k of rule.keywords) {
      const re = new RegExp(`\\b${escapeRegex(k)}\\b`);
      if (re.test(text)) return rule.response[locale];
    }
  }
  return DEFAULT_RESPONSE[locale];
}
