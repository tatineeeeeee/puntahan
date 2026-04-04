import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow, getCurrentUser } from "./helpers";

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
    photosStorageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (args.content.length < 10 || args.content.length > 5000) {
      throw new Error("Content must be between 10 and 5000 characters");
    }

    const dest = await ctx.db.get(args.destinationId);
    if (!dest || !dest.isPublished) throw new Error("Destination not found");

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
      photosStorageIds: (args.photosStorageIds ?? []).slice(0, 3),
      weightedScore: 0,
      createdAt: Date.now(),
      isApproved: true,
    });

    // Update destination stats
    {
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
      .withIndex("by_destination_and_approved", (q) =>
        q.eq("destinationId", args.destinationId).eq("isApproved", true),
      )
      .take(200);

    return await Promise.all(
      tips.map(async (tip) => {
        const user = await ctx.db.get(tip.userId);
        const photoUrls = await Promise.all(
          tip.photosStorageIds.map((id) => ctx.storage.getUrl(id)),
        );
        return {
          ...tip,
          photoUrls: photoUrls.filter((url): url is string => url !== null),
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

export const getProvinceTipCounts = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return {};
    const tips = await ctx.db
      .query("tips")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .collect();
    const counts: Record<string, number> = {};
    for (const tip of tips) {
      const dest = await ctx.db.get(tip.destinationId);
      if (dest) {
        counts[dest.province] = (counts[dest.province] ?? 0) + 1;
      }
    }
    return counts;
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const tips = await ctx.db
      .query("tips")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(200);

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
