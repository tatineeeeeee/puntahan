"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

const REGIONS = [
  {
    name: "NCR",
    label: "Metro Manila",
    colorClass: "bg-ncr",
    ringClass: "ring-ncr",
    image:
      "https://images.unsplash.com/photo-1521295105158-fdc2a8225628?w=600&q=80",
  },
  {
    name: "Luzon",
    label: "Luzon",
    colorClass: "bg-luzon",
    ringClass: "ring-luzon",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80",
  },
  {
    name: "Visayas",
    label: "Visayas",
    colorClass: "bg-visayas",
    ringClass: "ring-visayas",
    image:
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80",
  },
  {
    name: "Mindanao",
    label: "Mindanao",
    colorClass: "bg-mindanao",
    ringClass: "ring-mindanao",
    image:
      "https://images.unsplash.com/photo-1545663544-b99bc58247a2?w=600&q=80",
  },
] as const;

interface RegionCardsProps {
  activeRegions: Set<string>;
  onRegionToggle: (region: string) => void;
}

export function RegionCards({ activeRegions, onRegionToggle }: RegionCardsProps) {
  const stats = useQuery(api.destinations.stats);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {REGIONS.map((region) => {
        const isActive = activeRegions.has(region.name);
        const count =
          stats?.byRegion[region.name as keyof typeof stats.byRegion];

        return (
          <button
            key={region.name}
            type="button"
            aria-pressed={isActive}
            onClick={() => onRegionToggle(region.name)}
            className={cn(
              "group relative h-28 overflow-hidden rounded-xl transition-all sm:h-36",
              isActive && "ring-2 ring-offset-2 ring-offset-background",
              isActive && region.ringClass,
            )}
          >
            <Image
              src={region.image}
              alt={`${region.label} destinations`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />

            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity",
                isActive && "from-black/70",
              )}
            />

            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-sm font-bold text-white sm:text-base">
                {region.label}
              </p>
              <p className="text-xs text-white/80">
                {count ?? "—"} destinations
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
