import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { facts } from "@/lib/site-facts";

const FACTS = facts();

/**
 * Style commun à toutes les images Open Graph générées dynamiquement
 * (route racine + pages SEO legit-check / guide / acheter-authentique).
 *
 * Contraintes satori (moteur de next/og) respectées :
 *  - tout <div> ayant PLUSIEURS enfants doit avoir `display: "flex"` ;
 *  - police figée : Noto Sans latin regular (couvre les accents FR et le
 *    symbole €), lue sur disque une seule fois au chargement du module ;
 *  - aucun accès réseau → génération build-safe en runtime Node.
 */

// next@14.2.35 embarquait @vercel/og 0.6.3, dont la police par défaut était
// Noto Sans ; next@16.3.6 embarque @vercel/og 0.11.1, dont le défaut est Geist.
// Sans ce chargement explicite, toutes les cartes OG changent d'aspect. Fichier
// repris à l'identique de next@14.2.35 (dist/compiled/@vercel/og), licence SIL OFL 1.1.
const notoSans = await readFile(
  join(process.cwd(), "lib/seo/fonts/noto-sans-v27-latin-regular.ttf"),
);

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0A0A0B"; // fond dark premium
const EMERALD = "#10B981"; // accent
const WHITE = "#FFFFFF";
const MUTED = "#A1A1AA";
const SUBTLE = "#71717A";

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          backgroundColor: BG,
        }}
      >
        {/* Marque */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              backgroundColor: EMERALD,
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 800, color: BG }}>L</div>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: WHITE }}>
            LegitVision
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: EMERALD,
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: WHITE,
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 32, color: MUTED, marginTop: 22 }}>
            {subtitle}
          </div>
        </div>

        {/* Bandeau bas */}
        <div style={{ fontSize: 26, color: SUBTLE }}>
          {`Pré-authentification par IA · ${FACTS.priceSingle} / analyse`}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Noto Sans", data: notoSans, style: "normal", weight: 400 }],
    },
  );
}
