import type { GuideSignal } from "../../guide-types";
import { nikeSignals } from "./nike";
import { airJordanSignals } from "./air-jordan";
import { adidasSignals } from "./adidas";
import { newBalanceSignals } from "./new-balance";
import { louisVuittonSignals } from "./louis-vuitton";
import { chanelSignals } from "./chanel";
import { gucciSignals } from "./gucci";
import { hermesSignals } from "./hermes";
import { pradaSignals } from "./prada";
import { diorSignals } from "./dior";
import { supremeSignals } from "./supreme";
import { offWhiteSignals } from "./off-white";
import { stoneIslandSignals } from "./stone-island";
import { bapeSignals } from "./bape";

export const signals: GuideSignal[] = [
  ...nikeSignals,
  ...airJordanSignals,
  ...adidasSignals,
  ...newBalanceSignals,
  ...louisVuittonSignals,
  ...chanelSignals,
  ...gucciSignals,
  ...hermesSignals,
  ...pradaSignals,
  ...diorSignals,
  ...supremeSignals,
  ...offWhiteSignals,
  ...stoneIslandSignals,
  ...bapeSignals,
];

export function getSignalsByBrand(brandSlug: string): GuideSignal[] {
  return signals.filter((s) => s.brandSlug === brandSlug);
}

export function getSignalBySlugs(
  brandSlug: string,
  signalSlug: string,
): GuideSignal | undefined {
  return signals.find(
    (s) => s.brandSlug === brandSlug && s.slug === signalSlug,
  );
}

export function getSignalsByCategory(
  category: "sneakers" | "bags" | "clothing",
): GuideSignal[] {
  return signals.filter((s) => s.category === category);
}

export function getAllBrandSlugsWithSignals(): string[] {
  return Array.from(new Set(signals.map((s) => s.brandSlug)));
}
