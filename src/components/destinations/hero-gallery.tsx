"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Lightbox } from "@/components/ui/lightbox";

interface HeroGalleryProps {
  destinationId: Id<"destinations">;
  heroImageUrl?: string;
  destinationName: string;
}

export function HeroGallery({
  destinationId,
  heroImageUrl,
  destinationName,
}: HeroGalleryProps) {
  const photos = useQuery(api.photos.listByDestination, { destinationId });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Build combined image list: hero first, then community photos
  const allImages: { url: string; caption?: string }[] = [];
  if (heroImageUrl) {
    allImages.push({ url: heroImageUrl, caption: destinationName });
  }
  if (photos) {
    for (const p of photos) {
      if (p.url) allImages.push({ url: p.url, caption: p.caption ?? undefined });
    }
  }

  const total = allImages.length;

  const goNext = useCallback(() => {
    if (total > 1) setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total > 1) setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  }

  // Keyboard nav when focused
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lightboxOpen) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    // Only attach if more than 1 image
    if (total > 1) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [total, goNext, goPrev, lightboxOpen]);

  if (total === 0) return null;

  return (
    <>
      <div
        className="relative h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={allImages[currentIndex].url}
          alt={allImages[currentIndex].caption ?? destinationName}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="100vw"
          priority={currentIndex === 0}
        />

        {/* Click to open lightbox */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="Open photo gallery"
        />

        {/* Arrow buttons (desktop) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors hidden sm:block"
              aria-label="Previous photo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors hidden sm:block"
              aria-label="Next photo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Photo counter */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-20 rounded-full bg-charcoal/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {currentIndex + 1}/{total}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={allImages}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentIndex((i) => (i + 1) % total)}
          onPrev={() => setCurrentIndex((i) => (i - 1 + total) % total)}
        />
      )}
    </>
  );
}
