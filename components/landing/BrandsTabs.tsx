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
  ],
};

// ── Category banner metadata ─────────────────────────────────────────────────

type CategoryMeta = {
  label: string;
  sublabel: string;
  emoji: string;
  accent: string;
  glowColor: string;
  borderColor: string;
};

const CATEGORY_META: Record<Category, CategoryMeta> = {
  sneakers: {
    label: "Sneakers",
    sublabel: "Nike · Jordan · adidas · New Balance · BAPE · Salomon",
    emoji: "👟",
    accent: "#10B981",
    glowColor: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.35)",
  },
  vetements: {
    label: "Vêtements",
    sublabel: "Supreme · Off-White · Balenciaga · Stone Island · Moncler",
    emoji: "👕",
    accent: "#818CF8",
    glowColor: "rgba(129,140,248,0.1)",
    borderColor: "rgba(129,140,248,0.35)",
  },
  sacs: {
    label: "Sacs & Maroquinerie",
    sublabel: "Louis Vuitton · Chanel · Hermès · Gucci · Prada · Dior",
    emoji: "👜",
    accent: "#D4A843",
    glowColor: "rgba(212,168,67,0.1)",
    borderColor: "rgba(212,168,67,0.35)",
  },
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
      {/* ── Category banner ── */}
      <div
        className="relative mb-6 h-36 overflow-hidden rounded-2xl sm:h-[200px]"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {(Object.keys(CATEGORY_META) as Category[]).map((key) => {
          const meta = CATEGORY_META[key];
          const brandCount = BRANDS[key].length;
          const totalModels = BRANDS[key].reduce((s, b) => s + b.models, 0);

          return (
            <div
              key={key}
              aria-hidden={active !== key}
              style={{
                position: "absolute",
                inset: 0,
                opacity: active === key ? 1 : 0,
                transition: "opacity 0.45s ease",
                background: "#141416",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "0 24px 20px",
                overflow: "hidden",
                pointerEvents: active === key ? "auto" : "none",
              }}
            >
              {/* Radial glow — left */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at 15% 60%, ${meta.glowColor} 0%, transparent 65%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Top border light streak */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent 0%, ${meta.borderColor} 30%, ${meta.borderColor} 70%, transparent 100%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Ghost emoji — right */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 100,
                  lineHeight: 1,
                  opacity: 0.1,
                  userSelect: "none",
                  pointerEvents: "none",
                  filter: "grayscale(20%)",
                }}
              >
                {meta.emoji}
              </div>

              {/* Stats badge — top right */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  padding: "3px 11px",
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontSize: 11,
                  color: "#8A8A8E",
                  lineHeight: 1.6,
                }}
              >
                {brandCount} marques · {totalModels}+ modèles
              </div>

              {/* Bottom fade overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 72,
                  background:
                    "linear-gradient(to top, rgba(10,10,11,0.75), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* Text content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: meta.accent,
                    marginBottom: 6,
                  }}
                >
                  Catégorie
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#F5F5F7",
                    lineHeight: 1.1,
                    marginBottom: 5,
                  }}
                >
                  {meta.label}
                </p>
                <p
                  style={{ fontSize: 12, color: "#8A8A8E", lineHeight: 1.4 }}
                >
                  {meta.sublabel}
                </p>
              </div>
            </div>
          );
        })}
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
