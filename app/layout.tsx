import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora } from "next/font/google";
import { cn } from "@/lib/utils";
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

export const metadata: Metadata = {
  title: "LegitVision — Authentification d'articles de luxe par IA",
  description:
    "Vérifiez l'authenticité de vos articles de luxe grâce à l'intelligence artificielle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn("dark antialiased", inter.variable, spaceGrotesk.variable, sora.variable)}
    >
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
