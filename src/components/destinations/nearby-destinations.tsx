"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { haversineDistance } from "@/lib/haversine";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const NearbyMap = dynamic(
  () => import("./nearby-map").then((m) => m.NearbyMap),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full rounded-xl" /> },
);

interface NearbyDestinationsProps {
  destinationId: Id<"destinations">;
  latitude: number;
  longitude: number;
}

export function NearbyDestinations({
  destinationId,
  latitude,
  longitude,
}: NearbyDestinationsProps) {
  const allDestinations = useQuery(api.destinations.list, {});

  const nearby = useMemo(() => {
    if (!allDestinations) return undefined;

    return allDestinations
      .filter((d) => d._id !== destinationId)
      .map((d) => ({
        ...d,
        distance: haversineDistance(latitude, longitude, d.latitude, d.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);
  }, [allDestinations, destinationId, latitude, longitude]);

  const mapPins = useMemo(() => {
    if (!nearby || nearby.length === 0) return [];
    return [
      { name: "Current", slug: "", latitude, longitude, isCurrent: true },
      ...nearby.map((d) => ({
        name: d.name,
        slug: d.slug,
        latitude: d.latitude,
        longitude: d.longitude,
        isCurrent: false,
      })),
    ];
  }, [nearby, latitude, longitude]);

  if (!nearby || nearby.length === 0) return null;

  return (
    <div className="rounded-xl bg-sand p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
        Nearby Destinations
      </h3>
      <div className="mt-3">
        <NearbyMap pins={mapPins} center={[latitude, longitude]} />
      </div>
      <ul className="mt-3 space-y-2">
        {nearby.slice(0, 4).map((dest) => (
          <li key={dest._id}>
            <Link
              href={`/destination/${dest.slug}`}
              className="block rounded-lg bg-white/60 p-2 transition-colors hover:bg-white"
            >
              <p className="truncate text-sm font-medium text-charcoal">
                {dest.name}
              </p>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-warm-gray">
                  {dest.province}
                </span>
                <Badge variant="default" className="flex-none text-[10px]">
                  {Math.round(dest.distance)} km
                </Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
