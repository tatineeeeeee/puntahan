"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";

export function useTrackPageView() {
  const pathname = usePathname();
  const track = useMutation(api.analytics.trackEvent);

  useEffect(() => {
    track({ event: "page_view", page: pathname }).catch(() => {
      // Silently fail — analytics should never break the app
    });
  }, [pathname, track]);
}
