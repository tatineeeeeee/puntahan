"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SearchBar } from "./search-bar";
import { SortDropdown, type SortOption } from "./sort-dropdown";
import { DestinationGrid } from "./destination-grid";
import { AdvancedFilterPanel } from "@/components/search/advanced-filter-panel";
import {
  filterDestinations,
  filtersToSearchParams,
  searchParamsToFilters,
  type FilterState,
} from "@/lib/filter-utils";
import { RegionCards } from "./region-cards";
import { BudgetPills } from "./budget-pills";
import { CommunityPicks } from "./community-picks";
import { TopContributors } from "./top-contributors";
import { cn } from "@/lib/utils";

const MapView = dynamic(() => import("./map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-125 w-full rounded-xl bg-sand animate-pulse" />
  ),
});

export function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  // Initialize from URL on first render
  const initial = useMemo(
    () => searchParamsToFilters(new URLSearchParams(searchParams.toString())),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [searchQuery, setSearchQuery] = useState(initial.q);
  const [sort, setSort] = useState<SortOption>(initial.sort as SortOption);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [filters, setFilters] = useState<FilterState>(initial.filters);

  // Sync state → URL
  const syncToUrl = useCallback(
    (q: string, s: SortOption, f: FilterState) => {
      const params = filtersToSearchParams(f, s, q);
      const str = params.toString();
      router.replace(str ? `?${str}` : "/", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    syncToUrl(searchQuery, sort, filters);
  }, [searchQuery, sort, filters, syncToUrl]);

  const destinations = useQuery(api.destinations.list, {});
  const searchResults = useQuery(
    api.destinations.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip",
  );

  const source = searchQuery.length >= 2 ? searchResults : destinations;

  const filtered = useMemo(() => {
    if (!source) return undefined;
    return filterDestinations(source, filters);
  }, [source, filters]);

  function handleRegionToggle(region: string) {
    setFilters((prev) => {
      const next = new Set(prev.regions);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return { ...prev, regions: next };
    });
  }

  function handleBudgetCategoryChange(category: string) {
    setFilters((prev) => ({ ...prev, budgetCategory: category }));
  }

  const filteredWithoutBudgetCategory = useMemo(() => {
    if (!source) return undefined;
    return filterDestinations(source, { ...filters, budgetCategory: "" });
  }, [source, filters]);

  return (
    <div className="space-y-8">
      {/* Search toolbar */}
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
                "flex items-center justify-center min-h-11 min-w-11 px-3 py-2 text-sm transition-colors",
                view === "grid"
                  ? "bg-charcoal text-warm-white"
                  : "bg-surface-highest text-charcoal hover:bg-sand",
              )}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={cn(
                "flex items-center justify-center min-h-11 min-w-11 px-3 py-2 text-sm transition-colors",
                view === "map"
                  ? "bg-charcoal text-warm-white"
                  : "bg-surface-highest text-charcoal hover:bg-sand",
              )}
              aria-label="Map view"
              aria-pressed={view === "map"}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15.817.113A.5.5 0 0116 .5v14a.5.5 0 01-.402.49l-5 1a.502.502 0 01-.196 0L5.5 15.01l-4.902.98A.5.5 0 010 15.5v-14a.5.5 0 01.402-.49l5-1a.502.502 0 01.196 0L10.5.99l4.902-.98a.5.5 0 01.415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <RegionCards
        activeRegions={filters.regions}
        onRegionToggle={handleRegionToggle}
      />
      <BudgetPills
        activeCategory={filters.budgetCategory}
        onCategoryChange={handleBudgetCategoryChange}
        destinations={filteredWithoutBudgetCategory}
      />
      <AdvancedFilterPanel filters={filters} onChange={setFilters} />

      {/* Main content — immediately after filters */}
      {view === "grid" ? (
        <DestinationGrid
          destinations={filtered}
          activeCategories={new Set()}
          sort={sort}
        />
      ) : filtered ? (
        <MapView destinations={filtered} />
      ) : (
        <div className="h-125 w-full rounded-xl bg-sand animate-pulse" />
      )}

      {/* Social proof — below main content */}
      <hr className="border-warm-gray/10" />
      <CommunityPicks />
      <TopContributors />
    </div>
  );
}
