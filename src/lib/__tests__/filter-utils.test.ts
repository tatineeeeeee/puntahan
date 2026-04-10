import { describe, it, expect } from "vitest";
import {
  filterDestinations,
  filtersToSearchParams,
  searchParamsToFilters,
  getActiveFilterCount,
  DEFAULT_FILTERS,
  type FilterState,
} from "../filter-utils";

// Minimal destination stubs
function makeDest(overrides: Record<string, unknown> = {}) {
  return {
    _id: "test" as never,
    _creationTime: 0,
    name: "Test Dest",
    slug: "test-dest",
    description: "",
    region: "Visayas" as const,
    province: "Cebu",
    latitude: 10,
    longitude: 124,
    categories: ["Beach"],
    tags: [],
    avgRating: 4.5,
    tipsCount: 5,
    bookmarksCount: 0,
    budgetMin: 3000,
    budgetMax: 8000,
    budgetCategory: "Mid-range" as const,
    bestTimeToVisit: "Dry season (March–May)",
    festivals: [],
    photosCount: 3,
    isPublished: true,
    ...overrides,
  };
}

describe("filterDestinations", () => {
  it("returns all with default filters", () => {
    const dests = [makeDest(), makeDest({ name: "Two" })];
    expect(filterDestinations(dests, DEFAULT_FILTERS)).toHaveLength(2);
  });

  it("filters by region", () => {
    const dests = [
      makeDest({ region: "Visayas" }),
      makeDest({ region: "Luzon" }),
    ];
    const filters = { ...DEFAULT_FILTERS, regions: new Set(["Visayas"]) };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("filters by budget category", () => {
    const dests = [
      makeDest({ budgetCategory: "Budget" }),
      makeDest({ budgetCategory: "Luxury" }),
    ];
    const filters = { ...DEFAULT_FILTERS, budgetCategory: "Budget" };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("filters by minimum rating", () => {
    const dests = [
      makeDest({ avgRating: 4.5 }),
      makeDest({ avgRating: 2.0 }),
    ];
    const filters = { ...DEFAULT_FILTERS, minRating: 3 };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("filters by budget range", () => {
    const dests = [
      makeDest({ budgetMin: 1000, budgetMax: 3000 }),
      makeDest({ budgetMin: 20000, budgetMax: 50000 }),
    ];
    const filters = { ...DEFAULT_FILTERS, budgetMax: 5000 };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("filters by season (dry)", () => {
    const dests = [
      makeDest({ bestTimeToVisit: "Dry season" }),
      makeDest({ bestTimeToVisit: "Rainy season" }),
      makeDest({ bestTimeToVisit: "Year-round" }),
    ];
    const filters = { ...DEFAULT_FILTERS, season: "dry" };
    expect(filterDestinations(dests, filters)).toHaveLength(2);
  });

  it("filters by categories", () => {
    const dests = [
      makeDest({ categories: ["Beach", "Diving"] }),
      makeDest({ categories: ["Mountain"] }),
    ];
    const filters = { ...DEFAULT_FILTERS, categories: new Set(["Beach"]) };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("filters by hasPhotos", () => {
    const dests = [
      makeDest({ photosCount: 5 }),
      makeDest({ photosCount: 0 }),
    ];
    const filters = { ...DEFAULT_FILTERS, hasPhotos: true };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });

  it("combines multiple filters", () => {
    const dests = [
      makeDest({ region: "Visayas", budgetCategory: "Budget", avgRating: 4.5 }),
      makeDest({ region: "Visayas", budgetCategory: "Luxury", avgRating: 4.5 }),
      makeDest({ region: "Luzon", budgetCategory: "Budget", avgRating: 4.5 }),
    ];
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      regions: new Set(["Visayas"]),
      budgetCategory: "Budget",
    };
    expect(filterDestinations(dests, filters)).toHaveLength(1);
  });
});

describe("filtersToSearchParams / searchParamsToFilters round trip", () => {
  it("round-trips default filters", () => {
    const params = filtersToSearchParams(DEFAULT_FILTERS, "rating", "");
    const result = searchParamsToFilters(params);
    expect(result.q).toBe("");
    expect(result.sort).toBe("rating");
    expect(result.filters.budgetMin).toBe(0);
    expect(result.filters.budgetMax).toBe(30000);
    expect(result.filters.regions.size).toBe(0);
  });

  it("round-trips complex filters", () => {
    const filters: FilterState = {
      budgetMin: 5000,
      budgetMax: 15000,
      budgetCategory: "Mid-range",
      minRating: 4,
      season: "dry",
      regions: new Set(["Visayas", "Mindanao"]),
      categories: new Set(["Beach"]),
      hasPhotos: true,
    };
    const params = filtersToSearchParams(filters, "name", "boracay");
    const result = searchParamsToFilters(params);
    expect(result.q).toBe("boracay");
    expect(result.sort).toBe("name");
    expect(result.filters.budgetMin).toBe(5000);
    expect(result.filters.budgetMax).toBe(15000);
    expect(result.filters.budgetCategory).toBe("Mid-range");
    expect(result.filters.minRating).toBe(4);
    expect(result.filters.season).toBe("dry");
    expect(result.filters.regions).toEqual(new Set(["Visayas", "Mindanao"]));
    expect(result.filters.categories).toEqual(new Set(["Beach"]));
    expect(result.filters.hasPhotos).toBe(true);
  });
});

describe("getActiveFilterCount", () => {
  it("returns 0 for default filters", () => {
    expect(getActiveFilterCount(DEFAULT_FILTERS)).toBe(0);
  });

  it("counts each active filter", () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      budgetCategory: "Budget",
      minRating: 3,
      regions: new Set(["NCR"]),
    };
    expect(getActiveFilterCount(filters)).toBe(3);
  });
});
