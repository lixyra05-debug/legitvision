"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { brandRowKey } from "@/lib/catalog-counts";

type BrandEntry = {
  name: string;
  logo?: string;
};

type Category = "sneakers" | "vetements" | "sacs";

// Maps tab ID → DB category value
const DB_CATEGORY: Record<Category, string> = {
  sneakers: "sneakers",
  vetements: "clothing",
  sacs: "bag",
};

// Une tuile ne s'affiche que si sa ligne (marque × catégorie) a au moins un
// modèle analysable, compté dans la base au rendu (lib/catalog-counts.ts) : le
// compteur n'est jamais écrit à la main, et une tuile qui mènerait à un
// sélecteur vide disparaît d'elle-même — puis revient quand la ligne a de
// nouveau des modèles analysables.
const BRANDS: Record<Category, BrandEntry[]> = {
  sneakers: [
    { name: "Nike", logo: "/images/brands/nike.jpg" },
    { name: "adidas", logo: "/images/brands/adidas.png" },
    { name: "New Balance", logo: "/images/brands/new-balance.png" },
    // « Jordan » et non « Jordan Brand » : ce champ n'est pas seulement le
    // libellé affiché, il part tel quel dans /check/new?brand= et y est résolu
    // par .ilike("name", …) — une égalité, pas un LIKE partiel. La base stocke
    // « Jordan » (migration 001).
    { name: "Jordan", logo: "/images/brands/jordan-brand.png" },
    { name: "BAPE", logo: "/images/brands/bape.webp" },
    { name: "Converse", logo: "/images/brands/converse.png" },
    { name: "Vans", logo: "/images/brands/vans.png" },
    { name: "Puma", logo: "/images/brands/puma.png" },
    { name: "Reebok", logo: "/images/brands/reebok.png" },
    { name: "Salomon", logo: "/images/brands/salomon.png" },
    { name: "Balenciaga", logo: "/images/brands/balenciaga.png" },
    { name: "Louis Vuitton", logo: "/images/brands/louis-vuitton.png" },
    { name: "Dior", logo: "/images/brands/dior.png" },
    { name: "Gucci", logo: "/images/brands/gucci.png" },
    { name: "Prada", logo: "/images/brands/prada.png" },
    { name: "Chanel", logo: "/images/brands/chanel.png" },
    { name: "Hermès", logo: "/images/brands/hermes.png" },
    { name: "Bottega Veneta", logo: "/images/brands/bottega-veneta.png" },
    { name: "Maison Margiela", logo: "/images/brands/maison-margiela.png" },
    { name: "New Era", logo: "/images/brands/new-era.png" },
    { name: "Asics", logo: "/images/brands/asics.png" },
    { name: "ON Running", logo: "/images/brands/on-running.png" },
  ],
  vetements: [
    // Off-White et BAPE sont ABSENTES de cet onglet volontairement : la base ne
    // les porte qu'en `sneakers`, donc la tuile menait a /check/new?…&category=
    // clothing, ou la resolution echoue en silence et l'utilisateur atterrit sur
    // un selecteur vide. Une tuile qui ne mene nulle part est pire que pas de
    // tuile. A remettre des que le catalogue aura les lignes clothing ET leurs
    // modeles — voir CLAUDE.md, chantier catalogue.
    { name: "Supreme", logo: "/images/brands/supreme.png" },
    { name: "Palace", logo: "/images/brands/palace.png" },
    { name: "Stone Island", logo: "/images/brands/stone-island.png" },
    { name: "CP Company", logo: "/images/brands/cp-company.png" },
    { name: "Stüssy", logo: "/images/brands/stussy.png" },
    { name: "Comme des Garçons", logo: "/images/brands/comme-des-garcons.png" },
    { name: "The North Face" },
    { name: "Carhartt WIP", logo: "/images/brands/carhartt-wip.png" },
    { name: "Anti Social Social Club", logo: "/images/brands/anti-social-social-club.png" },
    { name: "Fear of God", logo: "/images/brands/fear-of-god.png" },
    { name: "Balenciaga", logo: "/images/brands/balenciaga.png" },
    { name: "Louis Vuitton", logo: "/images/brands/louis-vuitton.png" },
    { name: "Gucci", logo: "/images/brands/gucci.png" },
    { name: "Dior", logo: "/images/brands/dior.png" },
    { name: "Moncler", logo: "/images/brands/moncler.png" },
    { name: "Canada Goose", logo: "/images/brands/canada-goose.png" },
    { name: "Trapstar", logo: "/images/brands/trapstar.png" },
    { name: "Represent", logo: "/images/brands/represent.png" },
    { name: "Kith", logo: "/images/brands/kith.png" },
    { name: "Chrome Hearts", logo: "/images/brands/chrome-hearts.png" },
  ],
  sacs: [
    { name: "Louis Vuitton", logo: "/images/brands/louis-vuitton.png" },
    { name: "Chanel", logo: "/images/brands/chanel.png" },
    { name: "Hermès", logo: "/images/brands/hermes.png" },
    { name: "Gucci", logo: "/images/brands/gucci.png" },
    { name: "Prada", logo: "/images/brands/prada.png" },
    { name: "Dior", logo: "/images/brands/dior.png" },
    { name: "Balenciaga", logo: "/images/brands/balenciaga.png" },
    { name: "Bottega Veneta", logo: "/images/brands/bottega-veneta.png" },
    { name: "Saint Laurent", logo: "/images/brands/saint-laurent.png" },
    { name: "Celine", logo: "/images/brands/celine.png" },
    { name: "Fendi", logo: "/images/brands/fendi.png" },
    { name: "Valentino", logo: "/images/brands/valentino.png" },
    { name: "Givenchy", logo: "/images/brands/givenchy.png" },
    { name: "Goyard", logo: "/images/brands/goyard.png" },
    { name: "Jacquemus", logo: "/images/brands/jacquemus.png" },
    { name: "Miu Miu", logo: "/images/brands/miu-miu.png" },
    { name: "Longchamp", logo: "/images/brands/longchamp.jpeg" },
    { name: "Guess", logo: "/images/brands/guess.png" },
    { name: "Michael Kors" },
    { name: "Vanessa Bruno", logo: "/images/brands/vanessa-bruno.png" },
  ],
};

// ── Category banner images ───────────────────────────────────────────────────

const CATEGORY_BANNER: Record<Category, string> = {
  sneakers: "/images/sneakers.webp",
  vetements: "/images/clothing.webp",
  sacs: "/images/bags.webp",
};

const CATEGORY_ALT_KEY: Record<Category, string> = {
  sneakers: "brandsTabs.sneakers",
  vetements: "brandsTabs.clothing",
  sacs: "brandsTabs.bags",
};

const TABS: { id: Category; labelKey: string; emoji: string }[] = [
  { id: "sneakers", labelKey: "brandsTabs.sneakers", emoji: "👟" },
  { id: "vetements", labelKey: "brandsTabs.clothing", emoji: "👕" },
  { id: "sacs", labelKey: "brandsTabs.bags", emoji: "👜" },
];

// ── BrandLogo with error fallback ─────────────────────────────────────────────

function BrandLogoImage({ brand, count, active }: { brand: BrandEntry; count: number; active: Category }) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const handleNav = () => {
    window.location.href =
      "/check/new?brand=" +
      encodeURIComponent(brand.name) +
      "&category=" +
      DB_CATEGORY[active];
  };

  if (!brand.logo || imgError) {
    // Pill text fallback
    return (
      <button
        onClick={handleNav}
        className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-line bg-surface-raised p-4 transition-[border-color] duration-fast hover:border-line-strong"
      >
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-caption font-medium text-foreground">
          <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />
          {brand.name}
        </div>
        <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-medium text-muted-foreground">
          {count}{" "}
          {count > 1
            ? t("brandsTabs.modelsCountPlural")
            : t("brandsTabs.modelsCount")}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleNav}
      className="group flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-line bg-surface-raised p-4 text-left transition-[transform,border-color,box-shadow] duration-fast hover:scale-105 hover:border-line-strong hover:shadow-lg"
    >
      <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md bg-white p-1">
        <Image
          src={brand.logo}
          alt={brand.name}
          height={28}
          width={56}
          onError={() => setImgError(true)}
          style={{
            objectFit: "contain",
            width: "auto",
            height: "28px",
            mixBlendMode: "multiply",
          }}
        />
      </div>
      <span className="text-center text-caption leading-tight text-muted-foreground">
        {brand.name}
      </span>
      <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-medium text-muted-foreground">
        {count}{" "}
        {count > 1
          ? t("brandsTabs.modelsCountPlural")
          : t("brandsTabs.modelsCount")}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BrandsTabs({ counts }: { counts: Record<string, number> }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<Category>("sneakers");
  const brands = BRANDS[active]
    .map((brand) => ({ brand, count: counts[brandRowKey(brand.name, DB_CATEGORY[active])] ?? 0 }))
    .filter(({ count }) => count > 0);

  return (
    <div>
      {/* ── Category banner (image swap) ── */}
      <div className="relative mb-6 h-[140px] overflow-hidden rounded-lg sm:h-[200px]">
        {(Object.keys(CATEGORY_BANNER) as Category[]).map((key) => (
          <Image
            key={key}
            src={CATEGORY_BANNER[key]}
            alt={t(CATEGORY_ALT_KEY[key])}
            fill
            priority={key === "sneakers"}
            fetchPriority={key === "sneakers" ? "high" : undefined}
            sizes="(max-width: 640px) 100vw, 1200px"
            className={`object-cover transition-opacity duration-slow ${
              active === key ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* ── Tab buttons ── */}
      <div className="flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 rounded-full px-6 py-2 text-ui font-medium transition-[background-color,border-color,color] duration-fast ${
              active === tab.id
                ? "bg-accent text-accent-foreground shadow-lg"
                : "border border-line bg-surface text-muted-foreground hover:border-line-strong hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{tab.emoji}</span>
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Brand grid ── */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map(({ brand, count }) => (
          <BrandLogoImage
            key={`${active}-${brand.name}`}
            brand={brand}
            count={count}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
