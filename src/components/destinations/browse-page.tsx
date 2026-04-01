"use client";

import { useCallback, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RegionTabs } from "./region-tabs";
import { CategoryFilter } from "./category-filter";
import { SearchBar } from "./search-bar";
import { SortDropdown, type SortOption } from "./sort-dropdown";
import { DestinationGrid } from "./destination-grid";

export function BrowsePage() {
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("rating");

  const destinations = useQuery(api.destinations.list, { region });
  const searchResults = useQuery(
    api.destinations.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip",
  );

  const displayedDestinations = searchQuery.length >= 2
    ? searchResults
    : destinations;

  const handleToggleCategory = useCallback((category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <SortDropdown value={sort} onChange={setSort} />
      </div>
      <RegionTabs activeRegion={region} onRegionChange={setRegion} />
      <CategoryFilter
        activeCategories={activeCategories}
        onToggle={handleToggleCategory}
      />
      <DestinationGrid
        destinations={displayedDestinations}
        activeCategories={activeCategories}
        sort={sort}
      />
    </div>
  );
}
