"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface VotingPageProps {
  token: string;
}

export function VotingPage({ token }: VotingPageProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const itinerary = useQuery(api.itineraries.getByShareToken, { token });
  const currentUser = useQuery(api.users.getCurrentUser);
  const suggestions = useQuery(
    api.tripSuggestions.listByItinerary,
    itinerary ? { itineraryId: itinerary._id } : "skip",
  );
  const searchResults = useQuery(
    api.destinations.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip",
  );

  const suggest = useMutation(api.tripSuggestions.suggest);
  const vote = useMutation(api.tripSuggestions.vote);

  if (itinerary === undefined || isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (itinerary === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-charcoal">Trip not found.</p>
      </div>
    );
  }

  async function handleSuggest(destId: Id<"destinations">) {
    try {
      await suggest({
        itineraryId: itinerary!._id,
        destinationId: destId,
      });
      setSearchQuery("");
    } catch {
      // Already suggested or rate-limited — silently ignore
    }
  }

  async function handleVote(suggestionId: Id<"trip_suggestions">) {
    try {
      await vote({ suggestionId });
    } catch {
      // Already voted — silently ignore
    }
  }

  const sorted = (suggestions ?? []).toSorted((a, b) => b.votes - a.votes);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">{itinerary.name}</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Suggest destinations and vote on where to go!
        </p>
      </div>

      {!isAuthenticated && (
        <div className="rounded-xl bg-sand p-4 text-center">
          <p className="text-sm text-charcoal mb-3">
            Sign in to suggest and vote on destinations.
          </p>
          <SignInButton mode="modal">
            <Button variant="primary" size="sm">
              Sign In to Vote
            </Button>
          </SignInButton>
        </div>
      )}

      {/* Suggest a destination */}
      {isAuthenticated && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-charcoal">
            Suggest a Destination
          </p>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
          />
          {searchResults && searchResults.length > 0 && (
            <div className="space-y-1 rounded-xl bg-sand p-2">
              {searchResults.slice(0, 5).map((dest) => (
                <button
                  key={dest._id}
                  type="button"
                  onClick={() => handleSuggest(dest._id)}
                  className="block w-full text-left rounded-lg bg-warm-white p-2 text-sm text-charcoal hover:bg-surface-hover transition-colors"
                >
                  {dest.name} — {dest.province}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions list */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-charcoal">
          Suggestions ({sorted.length})
        </h2>
        {sorted.length === 0 ? (
          <p className="text-sm text-warm-gray">
            No suggestions yet. Be the first!
          </p>
        ) : (
          sorted.map((s) => {
            const hasVoted = currentUser
              ? s.voterUserIds.includes(currentUser._id)
              : false;
            return (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-xl bg-sand p-4"
              >
                <div>
                  <p className="font-medium text-charcoal">
                    {s.destinationName}
                  </p>
                  <p className="text-xs text-warm-gray">
                    {s.destinationProvince} &middot; Suggested by{" "}
                    {s.suggestedByName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{s.votes} votes</Badge>
                  {isAuthenticated && !hasVoted && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleVote(s._id)}
                    >
                      Vote
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
