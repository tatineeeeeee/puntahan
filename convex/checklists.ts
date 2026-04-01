import { v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";

async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
}

export const create = mutation({
  args: {
    name: v.string(),
    items: v.array(v.object({ text: v.string(), isChecked: v.boolean() })),
    itineraryId: v.optional(v.id("itineraries")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("checklists", {
      userId: user._id,
      itineraryId: args.itineraryId,
      name: args.name,
      items: args.items,
      createdAt: Date.now(),
    });
  },
});

export const updateItems = mutation({
  args: {
    id: v.id("checklists"),
    items: v.array(v.object({ text: v.string(), isChecked: v.boolean() })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const checklist = await ctx.db.get(args.id);
    if (!checklist || checklist.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, { items: args.items });
  },
});

export const remove = mutation({
  args: { id: v.id("checklists") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const checklist = await ctx.db.get(args.id);
    if (!checklist || checklist.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("checklists")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getByItinerary = query({
  args: { itineraryId: v.id("itineraries") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("checklists")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.itineraryId))
      .unique();
  },
});
