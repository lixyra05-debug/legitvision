"use client";

import { useState } from "react";
import Image from "next/image";

type BrandEntry = {
  name: string;
  models: number;
  logo?: string;
};

type Category = "sneakers" | "vetements" | "sacs";

// Maps tab ID → DB category value
const DB_CATEGORY: Record<Category, string> = {
  sneakers: "sneakers",
  vetements: "clothing",
  sacs: "bag",
};

const BRANDS: Record<Category, BrandEntry[]> = {
  sneakers: [
    { name: "Nike", models: 20, logo: "/images/brands/nike.jpg" },
    { name: "adidas", models: 16, logo: "/images/brands/adidas.png" },
    { name: "New Balance", models: 9, logo: "/images/brands/new-balance.png" },
    { name: "Jordan Brand", models: 7, logo: "/images/brands/jordan-brand.png" },
    { name: "BAPE", models: 3, logo: "/images/brands/bape.webp" },
    { name: "Converse", models: 4, logo: "/images/brands/converse.png" },
    { name: "Vans", models: 6, logo: "/images/brands/vans.png" },
    { name: "Puma", models: 5, logo: "/images/brands/puma.png" },
    { name: "Reebok", models: 5, logo: "/images/brands/reebok.png" },
    { name: "Salomon", models: 4, logo: "/images/brands/salomon.png" },
    { name: "Balenciaga", models: 4, logo: "/images/brands/balenciaga.png" },
    { name: "Louis Vuitton", models: 4, logo: "/images/brands/louis-vuitton.png" },
    { name: "Dior", models: 4, logo: "/images/brands/dior.png" },
    { name: "Gucci", models: 4, logo: "/images/brands/gucci.png" },
    { name: "Prada", models: 3, logo: "/images/brands/prada.png" },
    { name: "Chanel", models: 2, logo: "/images/brands/chanel.png" },
    { name: "Hermès", models: 2, logo: "/images/brands/hermes.png" },
    { name: "Bottega Veneta", models: 2, logo: "/images/brands/bottega-veneta.png" },
    { name: "Maison Margiela", models: 3, logo: "/images/brands/maison-margiela.png" },
    { name: "New Era", models: 2, logo: "/images/brands/new-era.png" },
    { name: "Asics", models: 5, logo: "/images/brands/asics.png" },
    { name: "ON Running", models: 5, logo: "/images/brands/on-running.png" },
  ],
  vetements: [
    { name: "Supreme", models: 11, logo: "/images/brands/supreme.png" },
    { name: "Off-White", models: 8, logo: "/images/brands/off-white.png" },
    { name: "Palace", models: 5, logo: "/images/brands/palace.png" },
    { name: "Stone Island", models: 6, logo: "/images/brands/stone-island.png" },
    { name: "CP Company", models: 6, logo: "/images/brands/cp-company.png" },
    { name: "Stüssy", models: 6, logo: "/images/brands/stussy.png" },
    { name: "BAPE", models: 6, logo: "/images/brands/bape.webp" },
    { name: "Comme des Garçons", models: 5, logo: "/images/brands/comme-des-garcons.png" },
    { name: "The North Face", models: 6 },
    { name: "Carhartt WIP", models: 7, logo: "/images/brands/carhartt-wip.png" },
    { name: "Anti Social Social Club", models: 3, logo: "/images/brands/anti-social-social-club.png" },
    { name: "Fear of God", models: 5, logo: "/images/brands/fear-of-god.png" },
    { name: "Balenciaga", models: 7, logo: "/images/brands/balenciaga.png" },
    { name: "Louis Vuitton", models: 5, logo: "/images/brands/louis-vuitton.png" },
    { name: "Gucci", models: 6, logo: "/images/brands/gucci.png" },
    { name: "Dior", models: 5, logo: "/images/brands/dior.png" },
    { name: "Moncler", models: 4, logo: "/images/brands/moncler.png" },
    { name: "Canada Goose", models: 4, logo: "/images/brands/canada-goose.png" },
    { name: "Trapstar", models: 4, logo: "/images/brands/trapstar.png" },
    { name: "Represent", models: 3, logo: "/images/brands/represent.png" },
    { name: "Kith", models: 4, logo: "/images/brands/kith.png" },
    { name: "Chrome Hearts", models: 7, logo: "/images/brands/chrome-hearts.png" },
  ],
  sacs: [
    { name: "Louis Vuitton", models: 20, logo: "/images/brands/louis-vuitton.png" },
    { name: "Chanel", models: 11, logo: "/images/brands/chanel.png" },
    { name: "Hermès", models: 10, logo: "/images/brands/hermes.png" },
    { name: "Gucci", models: 11, logo: "/images/brands/gucci.png" },
    { name: "Prada", models: 11, logo: "/images/brands/prada.png" },
    { name: "Dior", models: 10, logo: "/images/brands/dior.png" },
    { name: "Balenciaga", models: 12, logo: "/images/brands/balenciaga.png" },
    { name: "Bottega Veneta", models: 9, logo: "/images/brands/bottega-veneta.png" },
    { name: "Saint Laurent", models: 10, logo: "/images/brands/saint-laurent.png" },
    { name: "Celine", models: 9, logo: "/images/brands/celine.png" },
    { name: "Fendi", models: 9, logo: "/images/brands/fendi.png" },
    { name: "Valentino", models: 5, logo: "/images/brands/valentino.png" },
    { name: "Givenchy", models: 5, logo: "/images/brands/givenchy.png" },
    { name: "Goyard", models: 7, logo: "/images/brands/goyard.png" },
    { name: "Jacquemus", models: 9, logo: "/images/brands/jacquemus.png" },
    { name: "Miu Miu", models: 7, logo: "/images/brands/miu-miu.png" },
    { name: "Longchamp", models: 6, logo: "/images/brands/longchamp.jpeg" },
    { name: "Guess", models: 5, logo: "/images/brands/guess.png" },
    { name: "Michael Kors", models: 6 },
    { name: "Vanessa Bruno", models: 5, logo: "/images/brands/vanessa-bruno.png" },
  ],
};

// ── Category banner images ───────────────────────────────────────────────────

const CATEGORY_BANNER: Record<Category, string> = {
  sneakers: "/images/sneakers.png",
  vetements: "/images/clothing.png",
  sacs: "/images/bags.png",
};

const CATEGORY_ALT: Record<Category, string> = {
  sneakers: "Sneakers — Nike, Jordan, adidas, New Balance",
  vetements: "Vêtements — Supreme, Off-White, Stone Island",
  sacs: "Sacs & Maroquinerie — Louis Vuitton, Chanel, Hermès",
};

const TABS: { id: Category; label: string; emoji: string }[] = [
  { id: "sneakers", label: "Sneakers", emoji: "👟" },
  { id: "vetements", label: "Vêtements", emoji: "👕" },
  { id: "sacs", label: "Sacs", emoji: "👜" },
];

// ── BrandLogo with error fallback ─────────────────────────────────────────────

function BrandLogoImage({ brand, active }: { brand: BrandEntry; active: Category }) {
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
        className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#1E1E26] p-4 transition-all hover:border-emerald-500/50 cursor-pointer w-full"
      >
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white">
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
          {brand.name}
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          {brand.models} modèle{brand.models > 1 ? "s" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleNav}
      className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-[#1E1E26] p-4 transition-all hover:scale-105 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer text-left w-full"
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
      <span className="text-center text-[11px] leading-tight text-muted-foreground/80">
        {brand.name}
      </span>
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
        {brand.models} modèle{brand.models > 1 ? "s" : ""}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BrandsTabs() {
  const [active, setActive] = useState<Category>("sneakers");
  const brands = BRANDS[active];

  return (
    <div>
      {/* ── Category banner (image swap) ── */}
      <div className="relative mb-6 h-[140px] overflow-hidden rounded-2xl sm:h-[200px]">
        {(Object.keys(CATEGORY_BANNER) as Category[]).map((key) => (
          <Image
            key={key}
            src={CATEGORY_BANNER[key]}
            alt={CATEGORY_ALT[key]}
            fill
            priority={key === "sneakers"}
            sizes="(max-width: 640px) 100vw, 1200px"
            className={`object-cover transition-opacity duration-500 ${
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
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
              active === tab.id
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "border border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Brand grid ── */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <BrandLogoImage
            key={`${active}-${brand.name}`}
            brand={brand}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
