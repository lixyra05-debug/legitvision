"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { NO_AUTH_POINTS } from "@/lib/analyzable";

/**
 * Design system : surfaces et bordures opaques. L'emerald reste dosé : il ne
 * porte que le lien de contact et le focus du champ. Le badge MARQUE/MODÈLE,
 * qui n'encode pas de verdict, est neutre.
 */

interface Brand {
  id: string;
  name: string;
  category: string;
}

interface ModelRow {
  id: string;
  name: string;
  brand_name: string;
  category: string;
}

interface SearchResult {
  type: "brand" | "model";
  id: string;
  name: string;
  subtitle: string;
  brandName?: string; // for models: used as ?brand= query param
  // Catégorie de la ligne de marque : une marque peut avoir une ligne par
  // catégorie (Dior sacs, sneakers, vêtements) et /check/new départage par elle.
  category: string;
}

// Clés AU SINGULIER : ce Record est indexé par `brands.category`, dont les
// valeurs sont "sneakers" | "bag" | "watch" | "clothing" (lib/types.ts:5, et la
// contrainte CHECK de la migration 001). Les clés plurielles précédentes
// n'étaient jamais atteintes : le fallback affichait « bag » et « watch » en
// brut à la place du libellé traduit.
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  sneakers: "brandsTabs.sneakers",
  bag: "brandsTabs.bags",
  watch: "brandsTabs.watches",
  clothing: "brandsTabs.clothing",
};

export function BrandSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      // Seuls les modèles analysables, et les marques qui en ont au moins un :
      // voir lib/analyzable.ts
      const [{ data: brandsData }, { data: modelsData }] = await Promise.all([
        supabase
          .from("brands")
          .select("id, name, category, models!inner()")
          .eq("models.is_active", true)
          .neq("models.authentication_points", NO_AUTH_POINTS)
          .order("name"),
        supabase
          .from("models")
          .select("id, name, brands(name, category)")
          .eq("is_active", true)
          .neq("authentication_points", NO_AUTH_POINTS)
          .order("name"),
      ]);

      if (brandsData) setBrands(brandsData);
      if (modelsData) {
        setModels(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (modelsData as any[]).map((m) => ({
            id: m.id,
            name: m.name,
            brand_name: m.brands?.name ?? "",
            category: m.brands?.category ?? "",
          }))
        );
      }
    }
    load();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const q = query.toLowerCase().trim();

  const results: SearchResult[] = q.length < 1
    ? []
    : [
        ...brands
          .filter((b) => b.name.toLowerCase().includes(q))
          .map(
            (b): SearchResult => ({
              type: "brand",
              id: `b-${b.id}`,
              name: b.name,
              subtitle: CATEGORY_LABEL_KEYS[b.category]
                ? t(CATEGORY_LABEL_KEYS[b.category])
                : b.category,
              category: b.category,
            })
          ),
        ...models
          .filter((m) => m.name.toLowerCase().includes(q))
          .map(
            (m): SearchResult => ({
              type: "model",
              id: `m-${m.id}`,
              name: m.name,
              subtitle: m.brand_name,
              brandName: m.brand_name,
              category: m.category,
            })
          ),
      ].slice(0, 8);

  function handleResultClick(result: SearchResult) {
    setOpen(false);

    // Même chemin que les pages SEO : /check/new avec la sélection. Non
    // connecté, le proxy renvoie vers /auth?redirect=<ce lien> et la connexion
    // ramène ici, marque, modèle et catégorie compris.
    const params = new URLSearchParams();
    if (result.type === "brand") {
      params.set("brand", result.name);
    } else {
      if (result.brandName) params.set("brand", result.brandName);
      params.set("model", result.name);
    }
    if (result.category) params.set("category", result.category);

    window.location.href = `/check/new?${params.toString()}`;
  }

  return (
    <div ref={containerRef} className="relative mx-auto mb-12 max-w-xl">
      {/* Input */}
      <div className="flex items-center gap-3 rounded-md border border-line bg-surface-raised px-6 py-3 transition-colors duration-fast focus-within:border-accent/50">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("brandSearch.placeholder")}
          className="flex-1 bg-transparent text-ui text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-caption text-muted-foreground transition-colors duration-fast hover:text-foreground"
            aria-label="Effacer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && q.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-line bg-popover shadow-2xl shadow-black/60">
          {results.length === 0 ? (
            <div className="px-6 py-4 text-ui text-muted-foreground">
              {t("brandSearch.noResults")} —{" "}
              <a
                href="mailto:legitvision.contact@gmail.com"
                className="text-accent transition-colors duration-fast hover:text-accent-hover"
              >
                {t("common.contact")}
              </a>{" "}
              {t("brandSearch.tryOther")}
            </div>
          ) : (
            <div className="divide-y divide-line">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors duration-fast hover:bg-surface-hover"
                >
                  <div>
                    <p className="text-ui font-medium text-foreground">
                      {result.name}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {result.subtitle}
                    </p>
                  </div>
                  <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-caption font-medium uppercase text-muted-foreground">
                    {result.type === "brand"
                      ? t("brandSearch.brand")
                      : t("brandSearch.model")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
