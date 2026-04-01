"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RegionTabs } from "./region-tabs";
import { CategoryFilter } from "./category-filter";
import { SearchBar } from "./search-bar";
import { SortDropdown, type SortOption } from "./sort-dropdown";
import { DestinationGrid } from "./destination-grid";
import { cn } from "@/lib/utils";

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-125 w-full rounded-xl bg-sand animate-pulse" />
  ),
});

export function BrowsePage() {
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("rating");
  const [view, setView] = useState<"grid" | "map">("grid");

  const destinations = useQuery(api.destinations.list, { region });
  const searchResults = useQuery(
    api.destinations.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip",
  );

  const displayedDestinations =
    searchQuery.length >= 2 ? searchResults : destinations;

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
        <div className="flex gap-2">
          <SortDropdown value={sort} onChange={setSort} />
          <div className="flex rounded-lg border border-warm-gray/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "px-3 py-2 text-sm transition-colors",
                view === "grid"
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal hover:bg-sand",
              )}
              aria-label="Grid view"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={cn(
                "px-3 py-2 text-sm transition-colors",
                view === "map"
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal hover:bg-sand",
              )}
              aria-label="Map view"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15.817.113A.5.5 0 0116 .5v14a.5.5 0 01-.402.49l-5 1a.502.502 0 01-.196 0L5.5 15.01l-4.902.98A.5.5 0 010 15.5v-14a.5.5 0 01.402-.49l5-1a.502.502 0 01.196 0L10.5.99l4.902-.98a.5.5 0 01.415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <RegionTabs activeRegion={region} onRegionChange={setRegion} />
      <CategoryFilter
        activeCategories={activeCategories}
        onToggle={handleToggleCategory}
      />
      {view === "grid" ? (
        <DestinationGrid
          destinations={displayedDestinations}
          activeCategories={activeCategories}
          sort={sort}
        />
      ) : displayedDestinations ? (
        <MapView destinations={displayedDestinations} />
      ) : (
        <div className="h-125 w-full rounded-xl bg-sand animate-pulse" />
      )}
    </div>
  );
}
