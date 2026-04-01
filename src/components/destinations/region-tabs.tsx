"use client";

import { cn } from "@/lib/utils";

const regions = [
  { label: "All", value: undefined, color: "bg-charcoal" },
  { label: "NCR", value: "NCR", color: "bg-ncr" },
  { label: "Luzon", value: "Luzon", color: "bg-luzon" },
  { label: "Visayas", value: "Visayas", color: "bg-visayas" },
  { label: "Mindanao", value: "Mindanao", color: "bg-mindanao" },
] as const;

interface RegionTabsProps {
  activeRegion: string | undefined;
  onRegionChange: (region: string | undefined) => void;
}

export function RegionTabs({ activeRegion, onRegionChange }: RegionTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
      {regions.map((r) => {
        const isActive = activeRegion === r.value;
        return (
          <button
            key={r.label}
            role="tab"
            aria-selected={isActive}
            onClick={() => onRegionChange(r.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-charcoal text-white"
                : "bg-sand text-charcoal hover:bg-sand/80",
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", r.color)}
              aria-hidden="true"
            />
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
