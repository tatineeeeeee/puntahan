"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareModal } from "./share-modal";
import { CollaboratorAvatars } from "./collaborator-avatars";
import Link from "next/link";

interface ItineraryDetailProps {
  itineraryId: Id<"itineraries">;
}

export function ItineraryDetail({ itineraryId }: ItineraryDetailProps) {
  const router = useRouter();
  const data = useQuery(api.itineraries.getById, { id: itineraryId });
  const update = useMutation(api.itineraries.update);
  const remove = useMutation(api.itineraries.remove);
  const [addingDest, setAddingDest] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showShare, setShowShare] = useState(false);

  const searchResults = useQuery(
    api.destinations.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip",
  );

  if (data === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (data === null) {
    return <p className="text-warm-gray">Itinerary not found.</p>;
  }

  const { destinationMap, collaborators, ...itinerary } = data;

  // Budget estimate
  const allDestIds = new Set(itinerary.days.flatMap((d) => d.destinationIds));
  let totalBudgetMin = 0;
  let totalBudgetMax = 0;
  allDestIds.forEach((id) => {
    const dest = destinationMap[id];
    if (dest) {
      totalBudgetMin += dest.budgetMin;
      totalBudgetMax += dest.budgetMax;
    }
  });

  async function handleAddDestination(dayIndex: number, destId: Id<"destinations">) {
    const newDays = [...itinerary.days];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      destinationIds: [...newDays[dayIndex].destinationIds, destId],
    };
    await update({ id: itineraryId, days: newDays });
    setAddingDest(null);
    setSearchQuery("");
  }

  async function handleRemoveDestination(dayIndex: number, destIndex: number) {
    const newDays = [...itinerary.days];
    const newDestIds = [...newDays[dayIndex].destinationIds];
    newDestIds.splice(destIndex, 1);
    newDays[dayIndex] = { ...newDays[dayIndex], destinationIds: newDestIds };
    await update({ id: itineraryId, days: newDays });
  }

  async function handleAddDay() {
    const newDays = [
      ...itinerary.days,
      { dayNumber: itinerary.days.length + 1, destinationIds: [] as Id<"destinations">[], notes: undefined },
    ];
    await update({ id: itineraryId, days: newDays });
  }

  async function handleRemoveDay(dayIndex: number) {
    if (itinerary.days.length <= 1) return;
    const newDays = itinerary.days
      .filter((_, i) => i !== dayIndex)
      .map((d, i) => ({ ...d, dayNumber: i + 1 }));
    await update({ id: itineraryId, days: newDays });
  }

  async function handleDelete() {
    await remove({ id: itineraryId });
    router.push("/itineraries");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-charcoal">{itinerary.name}</h2>
          {collaborators && <CollaboratorAvatars collaborators={collaborators} />}
        </div>
        <div className="flex gap-2">
          {itinerary.shareToken && (
            <Link href={`/itinerary/${itinerary.shareToken}/vote`}>
              <Button variant="primary" size="sm">
                Group Vote
              </Button>
            </Link>
          )}
          <Button variant="secondary" size="sm" onClick={() => setShowShare(true)}>
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            className="print:hidden"
          >
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="print:hidden">
            Delete
          </Button>
        </div>
      </div>

      {showShare && (
        <ShareModal
          itineraryId={itineraryId}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <Badge variant="default">{itinerary.days.length} days</Badge>
        <Badge variant="default">{allDestIds.size} destinations</Badge>
        <Badge variant="budget">
          ₱{totalBudgetMin.toLocaleString()}–{totalBudgetMax.toLocaleString()}
        </Badge>
      </div>

      {/* Days */}
      {itinerary.days.map((day, dayIndex) => (
        <div key={dayIndex} className="rounded-xl bg-sand p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-charcoal">
              Day {day.dayNumber}
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddingDest(dayIndex)}
              >
                + Add
              </Button>
              {itinerary.days.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDay(dayIndex)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Destinations for this day */}
          {day.destinationIds.length === 0 ? (
            <p className="text-xs text-warm-gray">No destinations added yet.</p>
          ) : (
            <div className="space-y-2">
              {day.destinationIds.map((destId, destIndex) => {
                const dest = destinationMap[destId as string];
                return (
                  <div
                    key={`${destId}-${destIndex}`}
                    className="flex items-center justify-between rounded-lg bg-warm-white p-2"
                  >
                    <Link
                      href={`/destination/${dest?.slug ?? ""}`}
                      className="text-sm font-medium text-charcoal hover:text-teal"
                    >
                      {dest?.name ?? "Unknown"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(dayIndex, destIndex)}
                      className="text-xs text-warm-gray hover:text-coral"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add destination search */}
          {addingDest === dayIndex && (
            <div className="space-y-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
              />
              {searchResults && searchResults.length > 0 && (
                <div className="space-y-1">
                  {searchResults.map((dest) => (
                    <button
                      key={dest._id}
                      type="button"
                      onClick={() => handleAddDestination(dayIndex, dest._id)}
                      className="block w-full text-left rounded-lg bg-warm-white p-2 text-sm text-charcoal hover:bg-teal/10"
                    >
                      {dest.name} — {dest.province}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <Button variant="secondary" onClick={handleAddDay}>
        + Add Day
      </Button>
    </div>
  );
}
