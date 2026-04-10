"use client";

import { useEffect, useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ShareTipCtaProps {
  destinationId: Id<"destinations">;
  destinationName: string;
  tipsSectionRef: React.RefObject<HTMLDivElement | null>;
  onScrollToTips: () => void;
}

export function ShareTipCta({
  destinationId,
  destinationName,
  tipsSectionRef,
  onScrollToTips,
}: ShareTipCtaProps) {
  const { isAuthenticated } = useConvexAuth();
  const hasTipped = useQuery(
    api.tips.hasUserTipped,
    isAuthenticated ? { destinationId } : "skip",
  );
  const [visible, setVisible] = useState(true);

  // Hide when tips section scrolls into view
  useEffect(() => {
    const el = tipsSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [tipsSectionRef]);

  if (!isAuthenticated) return null;
  if (hasTipped === undefined || hasTipped) return null;
  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 sm:bottom-0">
      <div className="mx-auto max-w-6xl px-4 pb-3">
        <button
          type="button"
          onClick={onScrollToTips}
          className="w-full rounded-xl bg-coral px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-coral/90 transition-colors"
        >
          Been to {destinationName}? Share your tip
        </button>
      </div>
    </div>
  );
}
