import type { Intersection } from "../../types";
import { vintedIntersections } from "./vinted";
import { vestiaireIntersections } from "./vestiaire-collective";
import { leboncoinIntersections } from "./leboncoin";
import { ebayIntersections } from "./ebay";
import { depopIntersections } from "./depop";
import { facebookMarketplaceIntersections } from "./facebook-marketplace";

export const intersections: Intersection[] = [
  ...vintedIntersections,
  ...vestiaireIntersections,
  ...leboncoinIntersections,
  ...ebayIntersections,
  ...depopIntersections,
  ...facebookMarketplaceIntersections,
];

export function getIntersection(
  platformSlug: string,
  brandSlug: string,
): Intersection | undefined {
  return intersections.find(
    (i) => i.platformSlug === platformSlug && i.brandSlug === brandSlug,
  );
}
