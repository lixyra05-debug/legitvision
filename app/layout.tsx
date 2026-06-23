import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";

// Inline script exécuté SYNCHRONE avant React : applique la classe "dark"/"light"
// sur <html> selon localStorage. Évite le flash (FOUC) au chargement.
const themeInitScript = `(function(){try{var t=localStorage.getItem('legitvision-theme');document.documentElement.classList.add(t==='light'?'light':'dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const SITE_URL = "https://legitvision.vercel.app";
const SITE_NAME = "LegitVision";
const DEFAULT_TITLE =
  "LegitVision — Authentification d'articles de luxe par IA";
const DEFAULT_DESCRIPTION =
  "Vérifiez l'authenticité de vos sneakers, sacs et vêtements de luxe en moins de 30 secondes. Score de confiance par IA Vision, analyse de 8 zones d'authentification. 3,99 €/scan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — LegitVision",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "authentification luxe",
    "vérification sneakers",
    "contrefaçon IA",
    "authentification sac",
    "legit check",
    "scanner IA produits luxe",
    "détection contrefaçon",
  ],
  authors: [{ name: "LegitVision" }],
  creator: "LegitVision",
  publisher: "LegitVision",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    // images fournies par app/opengraph-image.tsx (file convention),
    // qui cascade aussi vers toutes les pages sans opengraph-image dédié.
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    // twitter:image retombe automatiquement sur openGraph.images (next/og).
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "technology",
  verification: {
    google: "VOhBjPTzBpcjDAFaqoWEK-CJlyJp5poSUQLhV1gy-Ms",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "LegitVision authentifie les articles de luxe (sneakers, sacs, vêtements) par intelligence artificielle.",
      foundingLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "legitvision.contact@gmail.com",
        availableLanguage: ["French", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "antialiased",
        inter.variable,
        spaceGrotesk.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ChatWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
