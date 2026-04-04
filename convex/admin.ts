import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAdmin } from "./helpers";

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const [users, destinations, tips, pendingTips] = await Promise.all([
      ctx.db.query("users").take(1000),
      ctx.db.query("destinations").take(1000),
      ctx.db.query("tips").take(1000),
      ctx.db
        .query("tips")
        .withIndex("by_approved", (q) => q.eq("isApproved", false))
        .take(100),
    ]);

    return {
      totalUsers: users.length,
      totalDestinations: destinations.length,
      totalTips: tips.length,
      pendingTips: pendingTips.length,
    };
  },
});

export const pendingTips = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const tips = await ctx.db
      .query("tips")
      .withIndex("by_approved", (q) => q.eq("isApproved", false))
      .take(100);

    return await Promise.all(
      tips.map(async (tip) => {
        const user = await ctx.db.get(tip.userId);
        const dest = await ctx.db.get(tip.destinationId);
        return {
          ...tip,
          userName: user?.name ?? "Anonymous",
          destinationName: dest?.name ?? "Unknown",
        };
      }),
    );
  },
});

export const approveTip = mutation({
  args: { tipId: v.id("tips") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.tipId, { isApproved: true });
  },
});

export const rejectTip = mutation({
  args: { tipId: v.id("tips") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const tip = await ctx.db.get(args.tipId);
    if (tip) {
      await ctx.db.delete(args.tipId);
      // Update destination stats
      const dest = await ctx.db.get(tip.destinationId);
      if (dest && dest.tipsCount > 0) {
        await ctx.db.patch(tip.destinationId, {
          tipsCount: dest.tipsCount - 1,
        });
      }
    }
  },
});

export const allUsers = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await ctx.db.query("users").take(500);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const setAdvisory = mutation({
  args: {
    destinationId: v.id("destinations"),
    level: v.union(v.literal("info"), v.literal("warning"), v.literal("alert")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.destinationId, {
      advisory: {
        level: args.level,
        message: args.message,
        updatedAt: Date.now(),
      },
    });
  },
});

export const clearAdvisory = mutation({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.destinationId, { advisory: undefined });
  },
});
