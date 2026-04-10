import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./helpers";

export const create = mutation({
  args: {
    name: v.string(),
    items: v.array(v.object({ text: v.string(), isChecked: v.boolean() })),
    itineraryId: v.optional(v.id("itineraries")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (args.name.length > 200) throw new Error("Name too long");
    if (args.items.some((i) => i.text.length > 500)) throw new Error("Item text too long");

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
    if (args.items.some((i) => i.text.length > 500)) throw new Error("Item text too long");

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
      .take(100);
  },
});

export const getByItinerary = query({
  args: { itineraryId: v.id("itineraries") },
  handler: async (ctx, args) => {
    const itinerary = await ctx.db.get(args.itineraryId);
    if (!itinerary) return null;

    // Verify access: public itinerary, owner, or collaborator
    if (!itinerary.isPublic) {
      const user = await getCurrentUser(ctx);
      const isOwner = user && itinerary.userId === user._id;
      const isCollaborator = user && itinerary.sharedWith.some(
        (s: { userId: typeof user._id }) => s.userId === user._id,
      );
      if (!isOwner && !isCollaborator) return null;
    }

    return await ctx.db
      .query("checklists")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.itineraryId))
      .unique();
  },
});
