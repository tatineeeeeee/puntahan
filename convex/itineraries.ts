import { v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

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
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("itineraries", {
      userId: user._id,
      name: args.name,
      description: args.description,
      days: [{ dayNumber: 1, destinationIds: [] as Id<"destinations">[], notes: undefined }],
      isPublic: false,
      sharedWith: [],
      shareToken: undefined,
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

    const allDestIds = new Set(
      itinerary.days.flatMap((d: { destinationIds: Id<"destinations">[] }) => d.destinationIds),
    );
    const destinations = await Promise.all(
      [...allDestIds].map((id) => ctx.db.get(id)),
    );
    const destMap = Object.fromEntries(
      destinations.filter(Boolean).map((d) => [d!._id, d]),
    );

    // Resolve collaborator info
    const collaborators = await Promise.all(
      itinerary.sharedWith.map(async (s: { userId: Id<"users">; accessLevel: string }) => {
        const u = await ctx.db.get(s.userId);
        return {
          userId: s.userId,
          accessLevel: s.accessLevel,
          name: u?.name ?? "Unknown",
          imageUrl: u?.imageUrl ?? null,
        };
      }),
    );

    return { ...itinerary, destinationMap: destMap, collaborators };
  },
});

export const getByShareToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const itinerary = await ctx.db
      .query("itineraries")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.token))
      .unique();
    if (!itinerary) return null;

    const allDestIds = new Set(
      itinerary.days.flatMap((d: { destinationIds: Id<"destinations">[] }) => d.destinationIds),
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
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("itineraries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const listSharedWithMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    // Get all itineraries and filter for shared ones
    // (In production, you'd want a separate index for this)
    const all = await ctx.db.query("itineraries").collect();
    return all.filter((it) =>
      it.sharedWith.some(
        (s: { userId: Id<"users"> }) => s.userId === user._id,
      ),
    );
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
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary) throw new Error("Not found");

    // Owner or editor can update
    const isOwner = itinerary.userId === user._id;
    const isEditor = itinerary.sharedWith.some(
      (s: { userId: Id<"users">; accessLevel: string }) =>
        s.userId === user._id && s.accessLevel === "edit",
    );
    if (!isOwner && !isEditor) throw new Error("Not authorized");

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
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const generateShareLink = mutation({
  args: { id: v.id("itineraries") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    const token = itinerary.shareToken ?? generateToken();
    if (!itinerary.shareToken) {
      await ctx.db.patch(args.id, { shareToken: token });
    }

    return token;
  },
});

export const addCollaborator = mutation({
  args: {
    id: v.id("itineraries"),
    email: v.string(),
    accessLevel: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!targetUser) throw new Error("User not found");

    const alreadyShared = itinerary.sharedWith.some(
      (s: { userId: Id<"users"> }) => s.userId === targetUser._id,
    );
    if (alreadyShared) throw new Error("Already shared with this user");

    await ctx.db.patch(args.id, {
      sharedWith: [
        ...itinerary.sharedWith,
        { userId: targetUser._id, accessLevel: args.accessLevel },
      ],
    });
  },
});
