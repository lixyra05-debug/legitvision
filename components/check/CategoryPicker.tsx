"use client";

import { Footprints, ShoppingBag, Watch, Shirt } from "lucide-react";
import type { Category } from "@/lib/types";

const CATEGORIES: {
  value: Category;
  label: string;
  description: string;
  icon: typeof Footprints;
}[] = [
  {
    value: "sneakers",
    label: "Sneakers",
    description: "Nike, Jordan, adidas, New Balance…",
    icon: Footprints,
  },
  {
    value: "bag",
    label: "Sacs",
    description: "Louis Vuitton, Gucci, Chanel…",
    icon: ShoppingBag,
  },
  {
    value: "watch",
    label: "Montres",
    description: "Rolex, Omega, Audemars Piguet…",
    icon: Watch,
  },
  {
    value: "clothing",
    label: "Vêtements",
    description: "Supreme, Off-White, Balenciaga…",
    icon: Shirt,
  },
];

interface CategoryPickerProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <div>
      <h2 className="font-heading text-xl font-bold sm:text-2xl">
        Quelle catégorie ?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Sélectionnez le type d&apos;article à vérifier
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`group flex flex-col items-center rounded-2xl border p-6 text-center transition-all ${
              selected === cat.value
                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                : "border-white/5 bg-card hover:border-white/10"
            }`}
          >
            <div
              className={`mb-4 flex size-14 items-center justify-center rounded-xl transition-colors ${
                selected === cat.value
                  ? "bg-emerald-500/20"
                  : "bg-white/5 group-hover:bg-white/10"
              }`}
            >
              <cat.icon
                className={`size-7 ${
                  selected === cat.value
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <span className="font-heading text-sm font-semibold">
              {cat.label}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {cat.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
