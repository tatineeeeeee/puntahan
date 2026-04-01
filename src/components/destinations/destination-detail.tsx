"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { PhotoGallery } from "./photo-gallery";
import { PhotoUpload } from "./photo-upload";
import { NearbyDestinations } from "./nearby-destinations";
import { BookmarkButton } from "./bookmark-button";
import { TipList } from "@/components/tips/tip-list";

const regionBadgeVariant = {
  NCR: "region-ncr",
  Luzon: "region-luzon",
  Visayas: "region-visayas",
  Mindanao: "region-mindanao",
} as const;

interface DestinationDetailProps {
  slug: string;
}

export function DestinationDetail({ slug }: DestinationDetailProps) {
  const destination = useQuery(api.destinations.getBySlug, { slug });

  if (destination === undefined) {
    return <DetailSkeleton />;
  }

  if (destination === null) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          Destination not found
        </p>
      </div>
    );
  }

  const variant =
    regionBadgeVariant[destination.region as keyof typeof regionBadgeVariant] ??
    "default";
  const budgetLabel = `₱${destination.budgetMin.toLocaleString()}–${destination.budgetMax.toLocaleString()}`;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 bg-linear-to-br from-teal/20 to-coral/20 flex items-end sm:h-80">
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-6">
          <Badge variant={variant} className="mb-2">
            {destination.region}
          </Badge>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {destination.name}
          </h1>
          <p className="mt-1 text-white/80">{destination.province}</p>
        </div>
        <div className="absolute top-4 right-4">
          <BookmarkButton
            destinationId={destination._id}
            className="text-white hover:text-coral"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating + Budget */}
            <div className="flex flex-wrap items-center gap-4">
              <Rating value={destination.avgRating} size="md" />
              <Badge variant="budget">{budgetLabel}</Badge>
              <span className="text-sm text-warm-gray">
                {destination.budgetCategory}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-charcoal">About</h2>
              <p className="mt-2 leading-relaxed text-charcoal/80">
                {destination.description}
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {destination.categories.map((cat) => (
                <Badge key={cat}>{cat}</Badge>
              ))}
            </div>

            {/* Photos */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-charcoal">
                  Photos ({destination.photosCount})
                </h2>
                <PhotoUpload destinationId={destination._id} />
              </div>
              <div className="mt-3">
                <PhotoGallery destinationId={destination._id} />
              </div>
            </div>

            {/* Tags */}
            {destination.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-warm-gray/10 px-2.5 py-0.5 text-xs text-warm-gray"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Time */}
            {destination.bestTimeToVisit && (
              <div className="rounded-xl bg-sand p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
                  Best Time to Visit
                </h3>
                <p className="mt-1 text-sm text-charcoal/80">
                  {destination.bestTimeToVisit}
                </p>
              </div>
            )}

            {/* Festivals */}
            {destination.festivals.length > 0 && (
              <div className="rounded-xl bg-sand p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
                  Festivals & Events
                </h3>
                <ul className="mt-2 space-y-2">
                  {destination.festivals.map((fest) => (
                    <li key={fest.name}>
                      <span className="font-medium text-sm text-charcoal">
                        {fest.name}
                      </span>
                      {fest.description && (
                        <p className="text-xs text-warm-gray">
                          {fest.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats */}
            <div className="rounded-xl bg-sand p-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
                Community
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <p className="font-bold text-charcoal">
                    {destination.tipsCount}
                  </p>
                  <p className="text-xs text-warm-gray">Tips</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal">
                    {destination.bookmarksCount}
                  </p>
                  <p className="text-xs text-warm-gray">Bookmarks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Travel Tips
          </h2>
          <TipList destinationId={destination._id} />
        </div>

        {/* Nearby */}
        <NearbyDestinations
          destinationId={destination._id}
          latitude={destination.latitude}
          longitude={destination.longitude}
        />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-64 w-full rounded-none sm:h-80" />
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
