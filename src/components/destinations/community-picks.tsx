"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";

const regionBadgeVariant = {
  NCR: "region-ncr",
  Luzon: "region-luzon",
  Visayas: "region-visayas",
  Mindanao: "region-mindanao",
} as const;

export function CommunityPicks() {
  const picks = useQuery(api.destinations.listTopRated);

  if (picks === undefined) {
    return <CommunityPicksSkeleton />;
  }

  if (picks.length < 3) {
    return null;
  }

  return (
    <section>
      <div className="mb-5 border-l-[3px] border-coral pl-3">
        <h2 className="text-lg font-bold text-charcoal">Community Picks</h2>
        <p className="text-sm text-warm-gray">
          Highest rated by the community
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((dest) => {
          const variant =
            regionBadgeVariant[
              dest.region as keyof typeof regionBadgeVariant
            ] ?? "default";

          return (
            <Link
              key={dest._id}
              href={`/destination/${dest.slug}`}
              className="group rounded-xl bg-sand overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-warm-gray/10">
                {dest.heroImageUrl ? (
                  <Image
                    src={dest.heroImageUrl}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-warm-gray text-xs">
                      Photo coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-charcoal truncate">
                    {dest.name}
                  </p>
                  <Badge variant={variant} className="shrink-0">
                    {dest.region}
                  </Badge>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  <Rating value={dest.avgRating} size="sm" />
                  <span className="text-xs text-warm-gray">
                    ({dest.tipsCount})
                  </span>
                </div>

                {dest.topTip && (
                  <p className="mt-2 text-xs italic text-warm-gray line-clamp-1">
                    &ldquo;{dest.topTip.content}&rdquo; &mdash;{" "}
                    {dest.topTip.authorName}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CommunityPicksSkeleton() {
  return (
    <section>
      <Skeleton className="mb-1 h-6 w-40" />
      <Skeleton className="mb-4 h-4 w-56" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl bg-sand overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
