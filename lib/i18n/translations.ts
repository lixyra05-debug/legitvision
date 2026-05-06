/**
 * Système i18n maison — pas de librairie externe.
 * Dictionnaire FR/EN organisé par section. Accès via t("section.key") dans
 * useTranslation() (lib/i18n/LanguageProvider.tsx).
 *
 * Hors scope : pages SEO (rester FR pour Google FR), prompts IA (analyse FR),
 * noms de marques/modèles (universels), routes API.
 */

export type Locale = "fr" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      analyze: "Analyser",
      pricing: "Tarifs",
      login: "Connexion",
      signup: "Inscription",
    },
    hero: {
      title: "Authentifiez vos articles de luxe par IA",
      subtitle: "Pré-authentification visuelle en 30 secondes",
      cta: "Vérifier maintenant",
    },
    check: {
      category: "Choisissez une catégorie",
      sneakers: "Sneakers",
      bags: "Sacs",
      clothing: "Vêtements",
      brand: "Choisissez une marque",
      model: "Choisissez un modèle",
      photos: "Ajoutez vos photos",
      analyze: "Lancer l'analyse",
      analyzing: "Analyse en cours...",
      noCredits: "Aucun crédit d'analyse",
      buyCredits: "Acheter des crédits",
      single: "Analyse unique",
      perMonth: "/mois",
    },
    pricing: {
      single: "Analyse unique",
      singleDesc: "1 analyse d'authentification IA",
      pro: "Pro",
      proDesc: "10 analyses par mois",
      premium: "Premium",
      premiumDesc: "50 analyses par mois",
      cta: "Commencer",
    },
    results: {
      score: "Score de confiance",
      authentic: "Probablement authentique",
      suspect: "Éléments suspects",
      fake: "Probablement contrefait",
    },
    footer: {
      legal: "Mentions légales",
      cgu: "CGU",
      privacy: "Confidentialité",
      disclaimer:
        "LegitVision est un outil de pré-authentification visuelle par intelligence artificielle. Nos résultats sont des estimations de probabilité, pas des certifications officielles.",
    },
    chatbot: {
      title: "Assistant LegitVision",
      placeholder: "Posez votre question...",
    },
  },
  en: {
    nav: {
      home: "Home",
      analyze: "Analyze",
      pricing: "Pricing",
      login: "Sign in",
      signup: "Sign up",
    },
    hero: {
      title: "Authenticate your luxury items with AI",
      subtitle: "Visual pre-authentication in 30 seconds",
      cta: "Check now",
    },
    check: {
      category: "Choose a category",
      sneakers: "Sneakers",
      bags: "Bags",
      clothing: "Clothing",
      brand: "Choose a brand",
      model: "Choose a model",
      photos: "Add your photos",
      analyze: "Start analysis",
      analyzing: "Analyzing...",
      noCredits: "No analysis credits",
      buyCredits: "Buy credits",
      single: "Single analysis",
      perMonth: "/month",
    },
    pricing: {
      single: "Single analysis",
      singleDesc: "1 AI authentication analysis",
      pro: "Pro",
      proDesc: "10 analyses per month",
      premium: "Premium",
      premiumDesc: "50 analyses per month",
      cta: "Get started",
    },
    results: {
      score: "Confidence score",
      authentic: "Likely authentic",
      suspect: "Suspicious elements",
      fake: "Likely counterfeit",
    },
    footer: {
      legal: "Legal notice",
      cgu: "Terms",
      privacy: "Privacy",
      disclaimer:
        "LegitVision is an AI-powered visual pre-authentication tool. Our results are probability estimates, not official certifications.",
    },
    chatbot: {
      title: "LegitVision Assistant",
      placeholder: "Ask a question...",
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];
