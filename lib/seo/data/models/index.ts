import type { ModelData } from "../../legit-check-types";
import { nikeModels } from "./nike";
import { adidasModels } from "./adidas";
import { newBalanceModels } from "./new-balance";
import { airJordanModels } from "./air-jordan";
import { louisVuittonModels } from "./louis-vuitton";
import { chanelModels } from "./chanel";
import { hermesModels } from "./hermes";
import { gucciModels } from "./gucci";
import { diorModels } from "./dior";
import { pradaModels } from "./prada";
import { supremeModels } from "./supreme";
import { offWhiteModels } from "./off-white";
import { stoneIslandModels } from "./stone-island";
import { bapeModels } from "./bape";

export const models: ModelData[] = [
  ...nikeModels,
  ...adidasModels,
  ...newBalanceModels,
  ...airJordanModels,
  ...louisVuittonModels,
  ...chanelModels,
  ...hermesModels,
  ...gucciModels,
  ...diorModels,
  ...pradaModels,
  ...supremeModels,
  ...offWhiteModels,
  ...stoneIslandModels,
  ...bapeModels,
];

export function getModelsByBrand(brandSlug: string): ModelData[] {
  return models.filter((m) => m.brandSlug === brandSlug);
}

export function getModelBySlugs(
  brandSlug: string,
  modelSlug: string,
): ModelData | undefined {
  return models.find(
    (m) => m.brandSlug === brandSlug && m.slug === modelSlug,
  );
}

export function getAllModelParams() {
  return models.map((m) => ({
    brand: m.brandSlug,
    model: m.slug,
  }));
}

export function getBrandSlugsWithModels(): string[] {
  return Array.from(new Set(models.map((m) => m.brandSlug)));
}
