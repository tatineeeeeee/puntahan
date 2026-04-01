"use client";

import Link from "next/link";
import { useComparison } from "@/lib/comparison-context";

export function CompareFloatingButton() {
  const { selected } = useComparison();

  if (selected.length === 0) return null;

  return (
    <Link
      href="/compare"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-teal/90 transition-colors"
    >
      Compare ({selected.length})
    </Link>
  );
}
