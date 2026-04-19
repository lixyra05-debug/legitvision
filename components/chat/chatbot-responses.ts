export type ChatbotRule = {
  keywords: string[];
  response: string;
};

const CONTACT_EMAIL = "legitvision.contact@gmail.com";

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
    ],
    response:
      "Nous proposons 3 formules adaptées à vos besoins :\n\n" +
      "• Utilisation unique — 3,99€ par analyse\n" +
      "• Mensuel — 19,99€/mois pour 10 analyses\n" +
      "• Premium — 29,99€/mois pour 50 analyses\n\n" +
      "Chaque analyse inclut un rapport détaillé avec score sur 100, sous-scores par zone et recommandations. Vous pouvez commencer avec une analyse unique pour tester.",
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
    ],
    response:
      "Pour gérer ou résilier votre abonnement :\n\n" +
      "1. Connectez-vous à votre compte\n" +
      "2. Cliquez sur votre avatar en haut à droite\n" +
      "3. Sélectionnez « Gérer l'abonnement »\n\n" +
      `La résiliation prend effet à la fin de la période en cours. Vous conservez l'accès jusqu'à cette date. Besoin d'aide ? Écrivez-nous à ${CONTACT_EMAIL}`,
  },
  {
    keywords: ["comment", "fonctionne", "fonctionnement", "marche", "utiliser"],
    response:
      "C'est très simple :\n\n" +
      "1. Choisissez la catégorie (sneakers, sac, vêtement)\n" +
      "2. Sélectionnez la marque et le modèle\n" +
      "3. Prenez des photos en suivant notre guide\n" +
      "4. Notre IA analyse 8 zones d'authentification\n" +
      "5. Recevez votre rapport en moins de 30 secondes\n\n" +
      "Le rapport inclut un score global sur 100, des sous-scores par zone, la détection OCR des codes et des recommandations personnalisées.",
  },
  {
    keywords: ["marque", "marques", "modele", "modeles", "catalogue"],
    response:
      "Nous supportons plus de 47 marques et 340+ modèles dans 3 catégories :\n\n" +
      "👟 Sneakers : Nike, Jordan, adidas, New Balance, Yeezy, Balenciaga, Dior, Gucci, Prada, Asics, ON Running…\n" +
      "👜 Sacs : Louis Vuitton, Chanel, Hermès, Gucci, Dior, Prada, Longchamp, Michael Kors…\n" +
      "👕 Vêtements : Supreme, Off-White, Stone Island, Moncler, Chrome Hearts, Palm Angels…\n\n" +
      "Utilisez la barre de recherche sur notre page d'accueil pour trouver votre article.",
  },
  {
    keywords: ["fiable", "fiabilite", "precision", "exact", "confiance"],
    response:
      "Notre IA analyse chaque photo selon 8 zones d'authentification spécifiques à chaque marque et modèle. Par exemple, pour une Air Jordan 1, nous vérifions le Swoosh, les coutures, l'étiquette de langue, la semelle, etc.\n\n" +
      "Important : LegitVision est un outil de pré-authentification visuelle. Nous fournissons un score de confiance, pas un certificat officiel. Pour les articles de grande valeur, nous recommandons de croiser nos résultats avec un expert.",
  },
  {
    keywords: [
      "contact",
      "contactez",
      "aide",
      "probleme",
      "problemes",
      "support",
    ],
    response:
      "Vous pouvez nous contacter par email :\n" +
      `📧 ${CONTACT_EMAIL}\n\n` +
      "Nous répondons sous 24h du lundi au vendredi. N'hésitez pas à nous envoyer des captures d'écran si vous rencontrez un problème technique.",
  },
  {
    keywords: ["bonjour", "bonsoir", "salut", "hello", "hey", "coucou"],
    response:
      "Bonjour ! 👋 Bienvenue sur LegitVision. Comment puis-je vous aider ?\n\n" +
      "Voici ce que je peux faire :\n" +
      "• Vous expliquer nos tarifs\n" +
      "• Vous guider pour lancer une analyse\n" +
      "• Vous renseigner sur les marques supportées\n" +
      "• Répondre à vos questions sur la fiabilité",
  },
  {
    keywords: ["merci", "super", "parfait", "genial", "ok", "okay"],
    response:
      "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne authentification ! 🔍",
  },
];

export const DEFAULT_RESPONSE =
  "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous aider avec :\n\n" +
  "• Tarifs et formules\n" +
  "• Comment fonctionne l'analyse\n" +
  "• Marques et modèles supportés\n" +
  "• Contact et support\n\n" +
  `Ou écrivez-nous directement à ${CONTACT_EMAIL}`;

export const WELCOME_MESSAGE =
  "Bonjour 👋 Je suis l'assistant LegitVision. Posez-moi une question sur les prix, les marques, le fonctionnement ou la résiliation.";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches keywords on word boundaries so "stock" ne déclenche pas "ok", ni "cherche" ne déclenche "cher".
export function matchResponse(input: string): string {
  const text = normalize(input);
  for (const rule of CHATBOT_RULES) {
    for (const k of rule.keywords) {
      const re = new RegExp(`\\b${escapeRegex(k)}\\b`);
      if (re.test(text)) return rule.response;
    }
  }
  return DEFAULT_RESPONSE;
}
