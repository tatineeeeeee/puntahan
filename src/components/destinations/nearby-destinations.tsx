"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { haversineDistance } from "@/lib/haversine";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
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
    <div>
      <h2 className="text-lg font-bold text-charcoal">Nearby Destinations</h2>
      <div className="mt-3">
        <NearbyMap pins={mapPins} center={[latitude, longitude]} />
      </div>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {nearby.map((dest) => (
          <Link
            key={dest._id}
            href={`/destination/${dest.slug}`}
            className="flex-none w-56 rounded-xl bg-sand p-3 hover:shadow-md transition-shadow"
          >
            <p className="font-bold text-sm text-charcoal truncate">
              {dest.name}
            </p>
            <p className="text-xs text-warm-gray">{dest.province}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Rating value={dest.avgRating} size="sm" />
              <Badge variant="default" className="text-[10px]">
                {Math.round(dest.distance)} km
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
