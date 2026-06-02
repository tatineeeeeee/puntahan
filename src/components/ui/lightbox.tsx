"use client";

import { useCallback, useEffect, useRef } from "react";

interface LightboxProps {
  images: { url: string; caption?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = images[currentIndex];

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // Arrow keys only — Esc is handled natively via the cancel event
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onNext, onPrev],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!current) return null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      aria-label="Image lightbox"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={onClose}
    >
      {/* Stop propagation so clicks inside content don't close the lightbox */}
      <div
        className="relative flex h-full w-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          aria-label="Previous image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.caption ?? "Photo"}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />

        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          aria-label="Next image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          aria-label="Close lightbox"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {current.caption && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {current.caption}
          </p>
        )}

        <p className="absolute top-4 left-4 text-sm text-white/60">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </dialog>
  );
}
