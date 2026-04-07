"use client";

import { cn } from "@/lib/utils";

const categories = [
  "Beach",
  "Mountain",
  "Historical",
  "Island Hopping",
  "Waterfall",
  "City",
  "Food Trip",
] as const;

interface CategoryFilterProps {
  activeCategories: Set<string>;
  onToggle: (category: string) => void;
}

export function CategoryFilter({ activeCategories, onToggle }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = activeCategories.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            aria-pressed={isActive}
            aria-label={`Filter by ${cat}`}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-teal text-white"
                : "bg-sand text-charcoal hover:bg-sand/80",
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
