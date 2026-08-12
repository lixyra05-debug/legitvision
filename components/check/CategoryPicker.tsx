"use client";

import Image from "next/image";
import { Footprints, ShoppingBag, Shirt } from "lucide-react";
import type { Category } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const CATEGORIES: {
  value: Category;
  labelKey: string;
  descKey: string;
  icon: typeof Footprints;
  image: string;
}[] = [
  {
    value: "sneakers",
    labelKey: "check.sneakers",
    descKey: "check.sneakersDesc",
    icon: Footprints,
    image: "/images/sneakers.webp",
  },
  {
    value: "bag",
    labelKey: "check.bags",
    descKey: "check.bagsDesc",
    icon: ShoppingBag,
    image: "/images/bags.webp",
  },
  {
    value: "clothing",
    labelKey: "check.clothing",
    descKey: "check.clothingDesc",
    icon: Shirt,
    image: "/images/clothing.webp",
  },
];

interface CategoryPickerProps {
  selected: Category | null;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="font-heading text-h4 font-bold sm:text-h3">
        {t("check.categoryTitle")}
      </h2>
      <p className="mt-2 text-ui text-muted-foreground">
        {t("check.categorySubtitle")}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`group flex flex-col overflow-hidden rounded-md border text-center transition-[color,background-color,border-color,transform] duration-fast hover:-translate-y-0.5 hover:shadow-card ${
              selected === cat.value
                ? "border-accent bg-accent/10 shadow-card"
                : "border-line-subtle bg-card hover:border-line-strong"
            }`}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-md bg-surface-raised">
              <Image
                src={cat.image}
                alt={t(cat.labelKey)}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-center p-6">
              <div
                className={`mb-4 flex size-14 items-center justify-center rounded-md transition-colors duration-fast ${
                  selected === cat.value
                    ? "bg-accent/20"
                    : "bg-surface-raised group-hover:bg-surface-hover"
                }`}
              >
                <cat.icon
                  className={`size-7 ${
                    selected === cat.value
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <span className="font-heading text-ui font-semibold">
                {t(cat.labelKey)}
              </span>
              <span className="mt-1 text-caption text-muted-foreground">
                {t(cat.descKey)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
