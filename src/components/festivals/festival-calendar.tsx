"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const regionBadgeVariant: Record<string, "region-ncr" | "region-luzon" | "region-visayas" | "region-mindanao"> = {
  NCR: "region-ncr",
  Luzon: "region-luzon",
  Visayas: "region-visayas",
  Mindanao: "region-mindanao",
};

function getMonth() {
  return new Date().getMonth() + 1;
}

function noop() {
  return () => {};
}

export function FestivalCalendar() {
  const festivals = useQuery(api.festivals.listAll);
  const currentMonth = useSyncExternalStore(noop, getMonth, () => 0);

  if (festivals === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Group by month
  const byMonth = new Map<number, typeof festivals>();
  for (const f of festivals) {
    const list = byMonth.get(f.month) ?? [];
    list.push(f);
    byMonth.set(f.month, list);
  }

  // Happening now
  const happeningNow = currentMonth > 0 ? byMonth.get(currentMonth) ?? [] : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-charcoal mb-6">
        Festival Calendar
      </h1>

      {/* Happening Now banner */}
      {happeningNow.length > 0 && (
        <div className="mb-8 rounded-xl bg-sunset/10 p-5 border border-sunset/20">
          <h2 className="text-sm font-bold uppercase tracking-wide text-sunset mb-3">
            Happening Now — {currentMonth > 0 ? MONTH_NAMES[currentMonth - 1] : ""}
          </h2>
          <div className="space-y-2">
            {happeningNow.map((f) => (
              <Link
                key={`${f.name}-${f.destinationSlug}`}
                href={`/destination/${f.destinationSlug}`}
                className="flex items-center justify-between rounded-lg bg-warm-white p-3 hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-bold text-sm text-charcoal">{f.name}</p>
                  <p className="text-xs text-warm-gray">{f.destinationName}</p>
                </div>
                <Badge variant={regionBadgeVariant[f.region] ?? "default"}>
                  {f.region}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Month grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MONTH_NAMES.map((name, i) => {
          const month = i + 1;
          const monthFestivals = byMonth.get(month) ?? [];
          const isNow = currentMonth === month;

          return (
            <div
              key={name}
              className={`rounded-xl p-4 ${isNow ? "bg-sunset/5 ring-1 ring-sunset/20" : "bg-sand"}`}
            >
              <h3 className="text-sm font-bold text-charcoal mb-2">{name}</h3>
              {monthFestivals.length === 0 ? (
                <p className="text-xs text-warm-gray">No festivals</p>
              ) : (
                <div className="space-y-1.5">
                  {monthFestivals.map((f) => (
                    <Link
                      key={`${f.name}-${f.destinationSlug}`}
                      href={`/destination/${f.destinationSlug}`}
                      className="block text-xs hover:text-teal"
                    >
                      <span className="font-medium text-charcoal">{f.name}</span>
                      <span className="text-warm-gray"> — {f.destinationName}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
