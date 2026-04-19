"use client";

import Image from "next/image";
import { Footprints, ShoppingBag, Shirt } from "lucide-react";
import type { Category } from "@/lib/types";

const CATEGORIES: {
  value: Category;
  label: string;
  description: string;
  icon: typeof Footprints;
  image: string;
}[] = [
  {
    value: "sneakers",
    label: "Sneakers",
    description: "Nike, Jordan, adidas, New Balance…",
    icon: Footprints,
    image: "/images/sneakers.png",
  },
  {
    value: "bag",
    label: "Sacs",
    description: "Louis Vuitton, Gucci, Chanel…",
    icon: ShoppingBag,
    image: "/images/bags.png",
  },
  {
    value: "clothing",
    label: "Vêtements",
    description: "Supreme, Off-White, Balenciaga…",
    icon: Shirt,
    image: "/images/clothing.png",
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
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`group flex flex-col overflow-hidden rounded-xl border text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              selected === cat.value
                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                : "border-white/5 bg-card hover:border-emerald-500/30"
            }`}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-white/5">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-center p-6">
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
