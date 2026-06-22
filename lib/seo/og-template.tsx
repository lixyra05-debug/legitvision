import { ImageResponse } from "next/og";

/**
 * Style commun à toutes les images Open Graph générées dynamiquement
 * (route racine + pages SEO legit-check / guide / acheter-authentique).
 *
 * Contraintes satori (moteur de next/og) respectées :
 *  - tout <div> ayant PLUSIEURS enfants doit avoir `display: "flex"` ;
 *  - aucune police personnalisée n'est chargée → la police par défaut de
 *    next/og est utilisée (couvre le latin et les accents FR / le symbole €) ;
 *  - aucun accès disque/réseau → rend la génération build-safe en runtime Node.
 */

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
          Pré-authentification par IA · 3,99 € / analyse
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
