"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Lightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";

interface PhotoGalleryProps {
  destinationId: Id<"destinations">;
}

export function PhotoGallery({ destinationId }: PhotoGalleryProps) {
  const photos = useQuery(api.photos.listByDestination, { destinationId });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos === undefined) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <p className="text-sm text-warm-gray">
        No photos yet. Be the first to share one!
      </p>
    );
  }

  const validPhotos = photos.filter(
    (p): p is typeof p & { url: string } => p.url !== null,
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {validPhotos.map((photo, i) => (
          <button
            key={photo._id}
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            aria-label={`View photo: ${photo.caption ?? "Community photo"}`}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? "Community photo"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={validPhotos.map((p) => ({
            url: p.url,
            caption: p.caption ?? undefined,
          }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev + 1) % validPhotos.length : 0,
            )
          }
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null
                ? (prev - 1 + validPhotos.length) % validPhotos.length
                : 0,
            )
          }
        />
      )}
    </>
  );
}
