import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkRateLimit } from "./rateLimit";

export const listByItinerary = query({
  args: { itineraryId: v.id("itineraries") },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("trip_suggestions")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.itineraryId))
      .collect();

    return await Promise.all(
      suggestions.map(async (s) => {
        const dest = await ctx.db.get(s.destinationId);
        return {
          ...s,
          destinationName: dest?.name ?? "Unknown",
          destinationProvince: dest?.province ?? "",
          destinationRegion: dest?.region ?? "",
        };
      }),
    );
  },
});

export const suggest = mutation({
  args: {
    itineraryId: v.id("itineraries"),
    destinationId: v.id("destinations"),
    suggestedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.suggestedBy.trim();
    if (!name) throw new Error("Name is required");
    if (name.length > 100) throw new Error("Name must be under 100 characters");
    await checkRateLimit(ctx, `suggest:${name}`, 10);

    // Check if this destination was already suggested for this itinerary
    const existing = await ctx.db
      .query("trip_suggestions")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.itineraryId))
      .collect();

    const alreadySuggested = existing.find(
      (s) => s.destinationId === args.destinationId,
    );
    if (alreadySuggested) {
      throw new Error("This destination was already suggested");
    }
    if (existing.length >= 20) {
      throw new Error("Maximum suggestions reached for this itinerary");
    }

    await ctx.db.insert("trip_suggestions", {
      itineraryId: args.itineraryId,
      destinationId: args.destinationId,
      suggestedBy: name,
      votes: 1,
      voters: [name],
      createdAt: Date.now(),
    });
  },
});

export const vote = mutation({
  args: {
    suggestionId: v.id("trip_suggestions"),
    voterName: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.voterName.trim();
    if (!name) throw new Error("Name is required");
    if (name.length > 100) throw new Error("Name must be under 100 characters");

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) throw new Error("Suggestion not found");

    if (suggestion.voters.includes(name)) {
      throw new Error("You already voted for this suggestion");
    }

    await ctx.db.patch(args.suggestionId, {
      votes: suggestion.votes + 1,
      voters: [...suggestion.voters, name],
    });
  },
});
