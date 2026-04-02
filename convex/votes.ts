import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getCurrentUserOrThrow, getCurrentUser } from "./helpers";

export const castVote = mutation({
  args: {
    tipId: v.id("tips"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existing = await ctx.db
      .query("votes")
      .withIndex("by_user_and_tip", (q) =>
        q.eq("userId", user._id).eq("tipId", args.tipId),
      )
      .unique();

    const tip = await ctx.db.get(args.tipId);
    if (!tip) throw new Error("Tip not found");

    const tipAuthor = await ctx.db.get(tip.userId);

    if (existing) {
      if (existing.direction === args.direction) {
        // Remove vote (toggle off)
        await ctx.db.delete(existing._id);

        const upDelta = args.direction === "up" ? -1 : 0;
        const downDelta = args.direction === "down" ? -1 : 0;
        await ctx.db.patch(args.tipId, {
          upvotes: tip.upvotes + upDelta,
          downvotes: tip.downvotes + downDelta,
        });
        if (tipAuthor && args.direction === "up") {
          await ctx.db.patch(tip.userId, {
            upvotesReceived: tipAuthor.upvotesReceived - 1,
          });
        }
        return null;
      } else {
        // Switch vote direction
        await ctx.db.patch(existing._id, { direction: args.direction });

        const wasUp = existing.direction === "up";
        await ctx.db.patch(args.tipId, {
          upvotes: tip.upvotes + (wasUp ? -1 : 1),
          downvotes: tip.downvotes + (wasUp ? 1 : -1),
        });
        if (tipAuthor) {
          await ctx.db.patch(tip.userId, {
            upvotesReceived:
              tipAuthor.upvotesReceived + (wasUp ? -1 : 1),
          });
        }
        return args.direction;
      }
    } else {
      // New vote
      await ctx.db.insert("votes", {
        userId: user._id,
        tipId: args.tipId,
        direction: args.direction,
      });

      await ctx.db.patch(args.tipId, {
        upvotes: tip.upvotes + (args.direction === "up" ? 1 : 0),
        downvotes: tip.downvotes + (args.direction === "down" ? 1 : 0),
      });
      if (tipAuthor && args.direction === "up") {
        await ctx.db.patch(tip.userId, {
          upvotesReceived: tipAuthor.upvotesReceived + 1,
        });
        // Notify tip author of upvote (don't notify self)
        if (tip.userId !== user._id) {
          await ctx.runMutation(internal.notifications.create, {
            userId: tip.userId,
            type: "tip_upvoted",
            message: "Your tip received an upvote!",
            relatedId: tip._id,
          });
        }
      }
      return args.direction;
    }
  },
});

export const getVoteForTip = query({
  args: { tipId: v.id("tips") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_and_tip", (q) =>
        q.eq("userId", user._id).eq("tipId", args.tipId),
      )
      .unique();

    return vote?.direction ?? null;
  },
});
