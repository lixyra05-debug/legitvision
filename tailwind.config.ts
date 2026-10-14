import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindAnimate from "tailwindcss-animate";

/**
 * Largeurs de fenêtre sous lesquelles une page peut demander le bouton de
 * l'assistant dans le flux, à la fin de son contenu, au lieu du bouton
 * flottant (décisions d'Hector des 05/10 et 06/10). La page le demande par
 * data-assistant-flux="lg" ou "1360" sur son bloc ; voir la variante
 * « assistant-flux: », en bas de ce fichier. Chaque marque est associée à sa
 * largeur. Constante non exportée : le chargeur de Tailwind verserait un
 * export nommé dans la configuration.
 * - « lg », le rapport : le point de rupture du site, lu dans le thème
 *   (1024 px). Sa colonne fait 768 px au plus (max-w-3xl), et le bouton
 *   flottant la recouvre jusqu'à 896 px de large.
 * - « 1360 », le tableau de bord : 1360 px, qui n'est pas un point de rupture
 *   du site. 1360 = 1152 (largeur maximale du contenu, max-w-6xl) + 2 × 104
 *   (56 px du bouton + 24 px entre lui et le bord de la fenêtre + 24 px
 *   d'écart avec la colonne). À 1360 px, les cartes, en retrait de 16 px
 *   dans la colonne (px-4), sont à 40 px du bouton ; à 31,5 px quand une
 *   barre de défilement de 17 px prend de la place dans la fenêtre. Avec
 *   « xl » (1280 px), le premier seuil essayé, le bouton flottant touchait à
 *   1280 px la colonne de droite des cartes (0 px d'écart), et mordait dessus
 *   quand une barre de défilement prenait de la place.
 */
const ASSISTANT_DANS_LE_FLUX: ReadonlyArray<{
  marque: string;
  largeur: (theme: (chemin: string) => string) => string;
}> = [
  { marque: "lg", largeur: (theme) => theme("screens.lg") },
  { marque: "1360", largeur: () => "1360px" },
];

/**
 * SOCLE DESIGN SYSTEM — passe 1 (tokens uniquement, aucune surface reskinnée).
 *
 * Toutes les valeurs viennent de app/globals.css, source unique. Ce fichier ne
 * fait que les exposer à Tailwind : il ne contient aucune couleur en dur.
 *
 * ── Règle du vert ────────────────────────────────────────────────────────────
 * L'emerald est RÉSERVÉ aux verdicts d'authentification. Il n'est plus joignable
 * que par `text-verdict-authentic` / `bg-verdict-authentic` / `border-verdict-authentic`,
 * et ces classes n'ont le droit d'apparaître que dans ReportView, ScoreGauge et
 * les composants de verdict. L'accent d'interface (boutons secondaires, liens,
 * focus, bordures actives) est le champagne : `accent`, `primary`, `ring`.
 *
 * ── Ce qui n'est volontairement PAS supprimé ─────────────────────────────────
 * Les échelles Tailwind par défaut (spacing, fontSize, rounded-xl/2xl/3xl) restent
 * actives. Les élaguer maintenant casserait les centaines de classes hors échelle
 * encore en place (p-5, gap-10, text-3xl, rounded-2xl…). L'élagage est la DERNIÈRE
 * étape du reskin, pas la première : on ne retire une valeur qu'une fois qu'aucun
 * fichier ne l'utilise. Les tokens ci-dessous sont donc additifs, et c'est la revue
 * qui fait respecter l'échelle canonique en attendant.
 *
 * Échelle d'espacement canonique (base 4px) — seules valeurs autorisées dans le
 * code neuf : 1(4) 2(8) 3(12) 4(16) 6(24) 8(32) 12(48) 16(64) 24(96).
 * Palier micro toléré : 0.5(2) et 1.5(6), uniquement dans un composant < 32px.
 * Bannies : 5, 7, 10, 14, 20, 32, 36 et tous les autres demi-pas.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Classes des paliers de score (TIER_* et getScore*), écrites seulement là :
    // sans cette ligne, barres et pastilles sortaient sans couleur en production.
    "./lib/types.ts",
  ],
  theme: {
    extend: {
      colors: {
        // ── Chrome : fonds, texte, bordures ───────────────────────────────
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        // Texte tertiaire — 4,3:1. `text-subtle` UNIQUEMENT, jamais en fond :
        // ce ratio ne passe AA qu'à partir de 18px et ne doit donc porter aucune
        // information nécessaire (horodatages, mentions accessoires).
        subtle: "hsl(var(--subtle-foreground) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          raised: "hsl(var(--surface-raised) / <alpha-value>)",
          // Survol d'un item DANS une surface élevée (popover, dropdown, menu).
          // `bg-surface` y assombrirait au lieu d'éclaircir.
          hover: "hsl(var(--surface-hover) / <alpha-value>)",
        },
        line: {
          subtle: "hsl(var(--line-subtle) / <alpha-value>)",
          DEFAULT: "hsl(var(--line) / <alpha-value>)",
          strong: "hsl(var(--line-strong) / <alpha-value>)",
        },

        // ── Accent d'interface : l'emerald de marque, dosé ────────────────
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          hover: "hsl(var(--accent-hover) / <alpha-value>)",
          muted: "hsl(var(--accent-muted) / <alpha-value>)",
        },

        // ── Verdicts — RÉSERVÉS aux composants d'authentification ─────────
        verdict: {
          authentic: "hsl(var(--verdict-authentic) / <alpha-value>)",
          fake: "hsl(var(--verdict-fake) / <alpha-value>)",
          inconclusive: "hsl(var(--verdict-inconclusive) / <alpha-value>)",
        },

        // ── Avertissement — surtout PAS un verdict ────────────────────────
        // Met en garde sur une pratique (« à éviter », « arnaque récurrente »),
        // ne qualifie jamais l'authenticité d'un article.
        warning: "hsl(var(--warning) / <alpha-value>)",

        // ── Rôles shadcn, dérivés des tokens ci-dessus dans globals.css ───
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        // <alpha-value> ajouté sur border et input : bg-input/30, bg-input/50,
        // border-destructive/50 et consorts (≈60 usages) ne se généraient pas
        // de façon fiable sans lui.
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        // Le mot LEGITVISION seul (components/brand/Marque.tsx), qui pose
        // lui-même la variable --font-marque.
        marque: ["var(--font-marque)", "system-ui", "sans-serif"],
      },

      /**
       * Échelle typographique — 9 pas, chacun porteur de son interligne et de son
       * approche. Les pas fluides utilisent clamp() : un seul token couvre 375px
       * → 1280px, ce qui supprime les `text-3xl sm:text-4xl` au point d'usage.
       *
       * Aucun nom Tailwind par défaut n'est écrasé : text-xs/sm/base/lg/xl/2xl…
       * restent disponibles le temps du reskin. Correspondance de migration :
       *   text-xs  → text-caption    text-sm  → text-ui     text-base → text-body
       *   text-lg  → text-lead       text-xl  → text-h4     text-2xl  → text-h3
       *   text-3xl → text-h2         text-4xl → text-h1     text-5xl/6xl → text-display
       */
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        ui: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        lead: ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        h4: ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        h3: [
          "clamp(1.5rem, 1.448rem + 0.221vw, 1.625rem)",
          { lineHeight: "1.3", letterSpacing: "-0.015em" },
        ],
        h2: [
          "clamp(1.875rem, 1.72rem + 0.663vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ],
        h1: [
          "clamp(2.375rem, 2.116rem + 1.105vw, 3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em" },
        ],
        display: [
          "clamp(3rem, 2.482rem + 2.21vw, 4.25rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
      },

      // Échelle canonique : sm 8 / md 12 / lg 16 / full.
      //
      // `rounded-lg` est volontairement bindé sur --radius-md (12px) et non sur
      // --radius-lg : ses 33 usages actuels — plus Button et Input de components/ui —
      // sont des contrôles de petite taille, qui relèvent du palier md. À 16px un
      // input h-8 (32px) devient une pilule pleine, le rayon étant plafonné à la
      // moitié du côté. Le binding basculera sur --radius-lg quand le reskin aura
      // renommé ces usages en `rounded-md`.
      //
      // rounded-xl / 2xl / 3xl restent les défauts Tailwind le temps de la migration.
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-md)",
      },

      boxShadow: {
        card: "var(--shadow-card)",
      },

      // Une seule courbe, partout. DEFAULT la rend implicite pour les ~165
      // transitions qui n'en déclarent aucune.
      transitionTimingFunction: {
        DEFAULT: "var(--ease)",
        brand: "var(--ease)",
      },

      // 3 durées. DEFAULT fait passer le défaut Tailwind de 150ms à 220ms.
      transitionDuration: {
        DEFAULT: "var(--dur-base)",
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [
    tailwindAnimate,
    // « assistant-flux: » : sur une page qui demande le bouton de l'assistant
    // dans le flux (elle pose data-assistant-flux="lg" ou "1360" sur son bloc),
    // sous la largeur de cette marque. Le rapport le demande sous « lg »
    // (1024 px), le tableau de bord sous 1360 px (ASSISTANT_DANS_LE_FLUX, plus
    // haut). Sert au bouton de l'assistant, rendu à la fin de la page au lieu
    // de flotter sur son contenu (components/chat/ChatWidget.tsx), et à la
    // place que la page lui réservait. « assistant-flux-lg: » et
    // « assistant-flux-1360: » ne valent que pour l'une des deux marques : la
    // largeur de la colonne de la page.
    // La condition est lue dans la page elle-même, pas dans son adresse : une
    // page 404 ou d'erreur à l'adresse d'un rapport n'est pas un rapport. Un
    // navigateur sans :has() ignore ces règles en bloc et garde le bouton
    // flottant, avec la place réservée sous la page.
    plugin(({ addVariant, theme }) => {
      const sous = ({ marque, largeur }: (typeof ASSISTANT_DANS_LE_FLUX)[number]) =>
        `@media not all and (min-width: ${largeur(theme)}) { body:has([data-assistant-flux="${marque}"]) & }`;
      addVariant("assistant-flux", ASSISTANT_DANS_LE_FLUX.map(sous));
      for (const seuil of ASSISTANT_DANS_LE_FLUX) addVariant(`assistant-flux-${seuil.marque}`, sous(seuil));
    }),
  ],
};
export default config;
