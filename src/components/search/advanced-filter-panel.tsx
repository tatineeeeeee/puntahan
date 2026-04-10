"use client";

import { type FilterState } from "@/lib/filter-utils";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Beach",
  "Mountain",
  "Historical",
  "Island Hopping",
  "Waterfall",
  "City",
  "Food Trip",
];

interface AdvancedFilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function AdvancedFilterPanel({
  filters,
  onChange,
}: AdvancedFilterPanelProps) {
  function toggleCategory(cat: string) {
    const next = new Set(filters.categories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    onChange({ ...filters, categories: next });
  }

  const hasActive =
    filters.categories.size > 0 ||
    filters.minRating > 0 ||
    filters.hasPhotos ||
    filters.season !== "any";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Activity pills */}
      {CATEGORIES.map((cat) => {
        const isActive = filters.categories.has(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-teal text-white"
                : "bg-surface-highest text-charcoal hover:bg-sand",
            )}
          >
            {cat}
          </button>
        );
      })}

      {/* Divider */}
      <div className="h-4 w-px bg-warm-gray/20" />

      {/* Quick filters */}
      <button
        type="button"
        onClick={() =>
          onChange({ ...filters, minRating: filters.minRating >= 4 ? 0 : 4 })
        }
        aria-pressed={filters.minRating >= 4}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          filters.minRating >= 4
            ? "bg-sunset text-white"
            : "bg-surface-highest text-charcoal hover:bg-sand",
        )}
      >
        ⭐ 4+ Stars
      </button>

      <button
        type="button"
        onClick={() => onChange({ ...filters, hasPhotos: !filters.hasPhotos })}
        aria-pressed={filters.hasPhotos}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          filters.hasPhotos
            ? "bg-teal text-white"
            : "bg-surface-highest text-charcoal hover:bg-sand",
        )}
      >
        📸 With Photos
      </button>

      {/* Clear */}
      {hasActive && (
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              categories: new Set(),
              minRating: 0,
              hasPhotos: false,
              season: "any",
            })
          }
          className="text-xs text-warm-gray hover:text-coral transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
