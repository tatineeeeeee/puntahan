"use client";

import { type FilterState, DEFAULT_FILTERS, getActiveFilterCount } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const REGIONS = ["NCR", "Luzon", "Visayas", "Mindanao"];
const CATEGORIES = ["Beach", "Mountain", "Historical", "Island Hopping", "Waterfall", "City", "Food Trip"];

interface AdvancedFilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function AdvancedFilterPanel({ filters, onChange }: AdvancedFilterPanelProps) {
  const [open, setOpen] = useState(false);
  const activeCount = getActiveFilterCount(filters);

  function toggleSet(set: Set<string>, value: string): Set<string> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          Filters
          {activeCount > 0 && (
            <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs text-warm-gray hover:text-coral"
          >
            Clear all
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 rounded-xl bg-sand p-4 space-y-4">
          {/* Budget range */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-2">
              Budget Range (PHP)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.budgetMin}
                onChange={(e) =>
                  onChange({ ...filters, budgetMin: parseInt(e.target.value) || 0 })
                }
                className="w-24 rounded-lg border border-warm-gray/20 px-2 py-1 text-sm"
                placeholder="Min"
                min={0}
              />
              <span className="text-warm-gray">–</span>
              <input
                type="number"
                value={filters.budgetMax}
                onChange={(e) =>
                  onChange({ ...filters, budgetMax: parseInt(e.target.value) || 30000 })
                }
                className="w-24 rounded-lg border border-warm-gray/20 px-2 py-1 text-sm"
                placeholder="Max"
                min={0}
              />
            </div>
          </div>

          {/* Min rating */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-2">
              Minimum Rating
            </p>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChange({ ...filters, minRating: r })}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                    filters.minRating === r
                      ? "bg-sunset text-white"
                      : "bg-warm-white text-charcoal hover:bg-warm-gray/10",
                  )}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-2">
              Best Season
            </p>
            <div className="flex gap-1">
              {[
                { value: "any", label: "Any" },
                { value: "dry", label: "Dry Season" },
                { value: "rainy", label: "Rainy Season" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onChange({ ...filters, season: s.value })}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                    filters.season === s.value
                      ? "bg-teal text-white"
                      : "bg-warm-white text-charcoal hover:bg-warm-gray/10",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-2">
              Regions
            </p>
            <div className="flex flex-wrap gap-1">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, regions: toggleSet(filters.regions, r) })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filters.regions.has(r)
                      ? "bg-charcoal text-white"
                      : "bg-warm-white text-charcoal hover:bg-warm-gray/10",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal mb-2">
              Activities
            </p>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, categories: toggleSet(filters.categories, c) })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filters.categories.has(c)
                      ? "bg-teal text-white"
                      : "bg-warm-white text-charcoal hover:bg-warm-gray/10",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Has photos */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasPhotos}
              onChange={(e) => onChange({ ...filters, hasPhotos: e.target.checked })}
              className="h-4 w-4 rounded border-warm-gray/30 text-teal focus:ring-teal"
            />
            <span className="text-sm text-charcoal">Has photos only</span>
          </label>
        </div>
      )}
    </div>
  );
}
