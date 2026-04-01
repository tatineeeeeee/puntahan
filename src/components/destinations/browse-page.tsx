"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { RegionTabs } from "./region-tabs";
import { CategoryFilter } from "./category-filter";
import { DestinationGrid } from "./destination-grid";

export function BrowsePage() {
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(),
  );

  const destinations = useQuery(api.destinations.list, { region });

  function handleToggleCategory(category: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <RegionTabs activeRegion={region} onRegionChange={setRegion} />
      <CategoryFilter
        activeCategories={activeCategories}
        onToggle={handleToggleCategory}
      />
      <DestinationGrid
        destinations={destinations}
        activeCategories={activeCategories}
      />
    </div>
  );
}
