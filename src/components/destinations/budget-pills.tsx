"use client";

import { useMemo } from "react";
import { type Doc } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS = [
  { value: "Budget", label: "Budget", detail: "under ₱5k" },
  { value: "Mid-range", label: "Mid-range", detail: "₱5k–15k" },
  { value: "Luxury", label: "Luxury", detail: "₱15k+" },
] as const;

interface BudgetPillsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  destinations: Doc<"destinations">[] | undefined;
}

export function BudgetPills({
  activeCategory,
  onCategoryChange,
  destinations,
}: BudgetPillsProps) {
  const counts = useMemo(() => {
    if (!destinations) return null;
    return {
      Budget: destinations.filter((d) => d.budgetCategory === "Budget").length,
      "Mid-range": destinations.filter(
        (d) => d.budgetCategory === "Mid-range",
      ).length,
      Luxury: destinations.filter((d) => d.budgetCategory === "Luxury").length,
    };
  }, [destinations]);

  return (
    <div className="flex flex-wrap gap-2">
      {BUDGET_OPTIONS.map((option) => {
        const isActive = activeCategory === option.value;
        const count = counts?.[option.value];

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() =>
              onCategoryChange(isActive ? "" : option.value)
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sunset text-white"
                : "bg-sand text-charcoal hover:bg-surface-hover",
            )}
          >
            {option.label}
            <span
              className={cn(
                "text-xs",
                isActive ? "text-white/80" : "text-warm-gray",
              )}
            >
              ({option.detail})
            </span>
            <span
              className={cn(
                "ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-warm-gray/15 text-warm-gray",
              )}
            >
              {count ?? "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
