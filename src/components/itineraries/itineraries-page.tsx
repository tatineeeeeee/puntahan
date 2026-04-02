"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function ItinerariesPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const itineraries = useQuery(
    api.itineraries.listByUser,
    isAuthenticated ? {} : "skip",
  );
  const createItinerary = useMutation(api.itineraries.create);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">
          Sign in to create itineraries.
        </p>
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = await createItinerary({ name: name.trim() });
    setName("");
    setShowCreate(false);
    router.push(`/itineraries?selected=${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">My Itineraries</h1>
        <Button onClick={() => setShowCreate(true)}>New Itinerary</Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trip name (e.g. Palawan Adventure)"
            className="flex-1"
          />
          <Button type="submit" disabled={!name.trim()}>
            Create
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
        </form>
      )}

      {itineraries === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : itineraries.length === 0 ? (
        <p className="text-sm text-warm-gray">
          No itineraries yet. Create one to start planning your trip!
        </p>
      ) : (
        <div className="space-y-3">
          {itineraries.map((it) => {
            const destCount = it.days.reduce(
              (sum, d) => sum + d.destinationIds.length,
              0,
            );
            return (
              <Link
                key={it._id}
                href={`/itineraries?selected=${it._id}`}
                className="flex items-center justify-between rounded-xl bg-sand p-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-bold text-sm text-charcoal">{it.name}</p>
                  <p className="text-xs text-warm-gray">
                    {it.days.length} days · {destCount} destinations
                  </p>
                </div>
                <p className="text-xs text-warm-gray">
                  {new Date(it.updatedAt).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
