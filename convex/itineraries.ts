import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("itineraries", {
      userId: user._id,
      name: args.name,
      description: args.description,
      days: [{ dayNumber: 1, destinationIds: [], notes: undefined }],
      isPublic: false,
      sharedWith: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getById = query({
  args: { id: v.id("itineraries") },
  handler: async (ctx, args) => {
    const itinerary = await ctx.db.get(args.id);
    if (!itinerary) return null;

    // Resolve all unique destination IDs across days
    const allDestIds = new Set(
      itinerary.days.flatMap((d) => d.destinationIds),
    );
    const destinations = await Promise.all(
      [...allDestIds].map((id) => ctx.db.get(id)),
    );
    const destMap = Object.fromEntries(
      destinations.filter(Boolean).map((d) => [d!._id, d]),
    );

    return { ...itinerary, destinationMap: destMap };
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

    return await ctx.db
      .query("itineraries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("itineraries"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    days: v.optional(
      v.array(
        v.object({
          dayNumber: v.number(),
          destinationIds: v.array(v.id("destinations")),
          notes: v.optional(v.string()),
        }),
      ),
    ),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary) throw new Error("Not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;
    if (args.days !== undefined) patch.days = args.days;
    if (args.isPublic !== undefined) patch.isPublic = args.isPublic;

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("itineraries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary) throw new Error("Not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
