import { Doc } from "../../convex/_generated/dataModel";

export interface FilterState {
  budgetMin: number;
  budgetMax: number;
  minRating: number;
  season: string;
  regions: Set<string>;
  categories: Set<string>;
  hasPhotos: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  budgetMin: 0,
  budgetMax: 30000,
  minRating: 0,
  season: "any",
  regions: new Set(),
  categories: new Set(),
  hasPhotos: false,
};

export function filterDestinations(
  destinations: Doc<"destinations">[],
  filters: FilterState,
): Doc<"destinations">[] {
  return destinations.filter((d) => {
    if (d.budgetMin > filters.budgetMax || d.budgetMax < filters.budgetMin) {
      return false;
    }

    if (filters.minRating > 0 && d.avgRating < filters.minRating) {
      return false;
    }

    if (filters.season !== "any" && d.bestTimeToVisit) {
      const visitLower = d.bestTimeToVisit.toLowerCase();
      if (filters.season === "dry" && !visitLower.includes("dry") && !visitLower.includes("year-round")) {
        return false;
      }
      if (filters.season === "rainy" && !visitLower.includes("rainy") && !visitLower.includes("year-round")) {
        return false;
      }
    }

    if (filters.regions.size > 0 && !filters.regions.has(d.region)) {
      return false;
    }

    if (filters.categories.size > 0) {
      if (!d.categories.some((c) => filters.categories.has(c))) {
        return false;
      }
    }

    if (filters.hasPhotos && d.photosCount === 0) {
      return false;
    }

    return true;
  });
}

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.budgetMin > 0 || filters.budgetMax < 30000) count++;
  if (filters.minRating > 0) count++;
  if (filters.season !== "any") count++;
  if (filters.regions.size > 0) count++;
  if (filters.categories.size > 0) count++;
  if (filters.hasPhotos) count++;
  return count;
}
