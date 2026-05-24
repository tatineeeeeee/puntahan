"use client";

import { useState } from "react";
import Link from "next/link";
import { useComparison } from "@/lib/comparison-context";

const MAX_COMPARE = 3;

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M3 8h7M3 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 10l3-2-3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CompareFloatingButton() {
  const { selected, remove, clear } = useComparison();
  const [open, setOpen] = useState(false);
  const remaining = MAX_COMPARE - selected.length;

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expandable panel */}
      {open && (
        <div className="w-56 rounded-2xl border border-warm-gray/10 bg-surface-highest p-3 shadow-xl">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-warm-gray">
            Comparing
          </p>

          <ul className="space-y-1">
            {selected.map((dest) => (
              <li key={dest.id} className="flex items-center gap-2 rounded-lg px-1 py-1">
                <span className="flex-1 truncate text-sm font-medium text-charcoal">
                  {dest.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(dest.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-warm-gray transition-colors hover:bg-red-100 hover:text-red-500"
                  aria-label={`Remove ${dest.name} from comparison`}
                >
                  <XIcon />
                </button>
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <p className="mt-2 px-1 text-xs text-warm-gray/60">
              +{remaining} slot{remaining > 1 ? "s" : ""} available
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 border-t border-warm-gray/10 pt-3">
            <Link
              href="/compare"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-teal py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-teal/90"
            >
              Compare →
            </Link>
            <button
              type="button"
              onClick={() => { clear(); setOpen(false); }}
              className="text-xs text-warm-gray transition-colors hover:text-red-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open ? "true" : "false"}
        aria-label={`Compare panel — ${selected.length} destination${selected.length > 1 ? "s" : ""} selected`}
        className="flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-teal/90"
      >
        <CompareIcon />
        Compare ({selected.length})
      </button>
    </div>
  );
}
