import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    destinationId: v.id("destinations"),
    content: v.string(),
    rating: v.number(),
    budgetBreakdown: v.array(
      v.object({
        category: v.string(),
        amount: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const totalBudget = args.budgetBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const tipId = await ctx.db.insert("tips", {
      userId: user._id,
      destinationId: args.destinationId,
      content: args.content,
      rating: args.rating,
      budgetBreakdown: args.budgetBreakdown,
      totalBudget,
      upvotes: 0,
      downvotes: 0,
      photosStorageIds: [],
      createdAt: Date.now(),
      isApproved: true,
    });

    // Update destination stats atomically
    const dest = await ctx.db.get(args.destinationId);
    if (dest) {
      const newCount = dest.tipsCount + 1;
      const newAvg =
        (dest.avgRating * dest.tipsCount + args.rating) / newCount;
      await ctx.db.patch(args.destinationId, {
        tipsCount: newCount,
        avgRating: Math.round(newAvg * 10) / 10,
      });
    }

    // Update user stats
    await ctx.db.patch(user._id, {
      tipsCount: user.tipsCount + 1,
    });

    return tipId;
  },
});

export const listByDestination = query({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    const tips = await ctx.db
      .query("tips")
      .withIndex("by_destination", (q) =>
        q.eq("destinationId", args.destinationId),
      )
      .collect();

    return await Promise.all(
      tips.map(async (tip) => {
        const user = await ctx.db.get(tip.userId);
        return {
          ...tip,
          userName: user?.name ?? "Anonymous",
          userImage: user?.imageUrl ?? null,
          userTipsCount: user?.tipsCount ?? 0,
          userUpvotesReceived: user?.upvotesReceived ?? 0,
          userDestinationsVisited: user?.destinationsVisited ?? 0,
          userPhotosUploaded: user?.photosUploaded ?? 0,
        };
      }),
    );
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) return [];

    const tips = await ctx.db
      .query("tips")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return await Promise.all(
      tips.map(async (tip) => {
        const dest = await ctx.db.get(tip.destinationId);
        return {
          ...tip,
          destinationName: dest?.name ?? "Unknown",
          destinationSlug: dest?.slug ?? "",
        };
      }),
    );
  },
});
