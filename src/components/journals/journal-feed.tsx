"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JournalFeed() {
  const { isAuthenticated } = useConvexAuth();
  const journals = useQuery(api.journals.listPublic);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Travel Journals</h1>
        {isAuthenticated && (
          <Link href="/journals/new">
            <Button>Write a Journal</Button>
          </Link>
        )}
      </div>

      {journals === undefined ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : journals.length === 0 ? (
        <p className="text-sm text-warm-gray">
          No journals yet. Be the first to share your travel story!
        </p>
      ) : (
        <div className="space-y-4">
          {journals.map((j) => (
            <div key={j._id} className="rounded-xl bg-sand p-5 space-y-2">
              <div className="flex items-center gap-3">
                {j.userImage ? (
                  <img
                    src={j.userImage}
                    alt={j.userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                    {j.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-charcoal">{j.userName}</p>
                  <p className="text-xs text-warm-gray">
                    {new Date(j.createdAt).toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <h2 className="text-lg font-bold text-charcoal">{j.title}</h2>
              <p className="text-sm text-charcoal/80 line-clamp-3">{j.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
