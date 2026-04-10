"use client";

import { useTrackPageView } from "@/lib/hooks/use-track";

export function PageTracker() {
  useTrackPageView();
  return null;
}
