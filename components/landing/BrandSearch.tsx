"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
}

const CATEGORY_LABELS: Record<string, string> = {
  sneakers: "Sneakers",
  bags: "Sacs",
  watches: "Montres",
  clothing: "Vêtements",
};

export function BrandSearch() {
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: brandsData }, { data: modelsData }] = await Promise.all([
        supabase.from("brands").select("id, name, category").order("name"),
        supabase
          .from("models")
          .select("id, name, brands(name, category)")
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
              subtitle: CATEGORY_LABELS[b.category] ?? b.category,
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
            })
          ),
      ].slice(0, 8);

  async function handleResultClick(result: SearchResult) {
    setOpen(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth?redirect=/check/new";
      return;
    }

    // Build URL with pre-selection params
    const params = new URLSearchParams();
    if (result.type === "brand") {
      params.set("brand", result.name);
    } else {
      if (result.brandName) params.set("brand", result.brandName);
      params.set("model", result.name);
    }

    window.location.href = `/check/new?${params.toString()}`;
  }

  return (
    <div ref={containerRef} className="relative mx-auto mb-10 max-w-xl">
      {/* Input */}
      <div
        className="flex items-center gap-3 rounded-xl border px-5 py-3.5 transition-colors focus-within:border-emerald-500/40"
        style={{ background: "#1E1E26", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher une marque ou un modèle..."
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-white"
            aria-label="Effacer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && q.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border shadow-2xl shadow-black/60"
          style={{
            background: "#1E1E26",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {results.length === 0 ? (
            <div className="px-5 py-4 text-sm text-muted-foreground">
              Aucun résultat —{" "}
              <a
                href="mailto:legitvision.contact@gmail.com"
                className="text-emerald-400 transition-colors hover:text-emerald-300"
              >
                contactez-nous
              </a>{" "}
              pour demander cette marque.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {result.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                    {result.type === "brand" ? "Marque" : "Modèle"}
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
