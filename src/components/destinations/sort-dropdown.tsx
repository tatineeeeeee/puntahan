"use client";

import { cn } from "@/lib/utils";

export type SortOption = "rating" | "budget-low" | "budget-high" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "budget-low", label: "Budget: Low → High" },
  { value: "budget-high", label: "Budget: High → Low" },
  { value: "name", label: "A → Z" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className={cn(
        "rounded-lg border border-warm-gray/20 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal",
        className,
      )}
      aria-label="Sort destinations"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
