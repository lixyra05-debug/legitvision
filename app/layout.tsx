import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora } from "next/font/google";
import { cn } from "@/lib/utils";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LegitVision — Authentification d'articles de luxe par IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
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
        email: "contact@legitvision.com",
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
        "dark antialiased",
        inter.variable,
        spaceGrotesk.variable,
        sora.variable,
      )}
    >
      <body className="bg-background text-foreground min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
