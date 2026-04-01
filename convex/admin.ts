import { v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";

async function assertAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
  if (!user || user.role !== "admin") throw new Error("Not authorized");

  return user;
}

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const users = await ctx.db.query("users").collect();
    const destinations = await ctx.db.query("destinations").collect();
    const tips = await ctx.db.query("tips").collect();
    const pendingTips = tips.filter((t) => !t.isApproved);

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
      .collect();

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
    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    await ctx.db.patch(args.userId, { role: args.role });
  },
});
