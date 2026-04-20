import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./helpers";
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
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await checkRateLimit(ctx, `suggest:${user._id}`, 10);

    const itinerary = await ctx.db.get(args.itineraryId);
    if (!itinerary) throw new Error("Itinerary not found");

    const alreadySuggested = await ctx.db
      .query("trip_suggestions")
      .withIndex("by_itinerary_and_destination", (q) =>
        q.eq("itineraryId", args.itineraryId).eq("destinationId", args.destinationId),
      )
      .first();
    if (alreadySuggested) {
      throw new Error("This destination was already suggested");
    }

    const existingCount = await ctx.db
      .query("trip_suggestions")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.itineraryId))
      .take(21);
    if (existingCount.length >= 20) {
      throw new Error("Maximum suggestions reached for this itinerary");
    }

    await ctx.db.insert("trip_suggestions", {
      itineraryId: args.itineraryId,
      destinationId: args.destinationId,
      suggestedByUserId: user._id,
      suggestedByName: user.name ?? "Anonymous",
      votes: 1,
      voterUserIds: [user._id],
      createdAt: Date.now(),
    });
  },
});

export const vote = mutation({
  args: {
    suggestionId: v.id("trip_suggestions"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await checkRateLimit(ctx, `vote-suggestion:${user._id}`, 60);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) throw new Error("Suggestion not found");

    if (suggestion.voterUserIds.includes(user._id)) {
      throw new Error("You already voted for this suggestion");
    }

    await ctx.db.patch(args.suggestionId, {
      votes: suggestion.votes + 1,
      voterUserIds: [...suggestion.voterUserIds, user._id],
    });
  },
});
