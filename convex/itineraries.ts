import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUser, getCurrentUserOrThrow } from "./helpers";

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  // Rejection sampling to avoid modulo bias: 36 * 7 = 252, reject bytes >= 252
  while (result.length < 16) {
    const bytes = new Uint8Array(16 - result.length);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < 252) result += chars[b % chars.length];
      if (result.length === 16) break;
    }
  }
  return result;
}

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (args.name.length > 200) throw new Error("Name too long");
    if (args.description && args.description.length > 2000) throw new Error("Description too long");

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

    // Public itineraries are accessible to everyone
    if (!itinerary.isPublic) {
      const user = await getCurrentUser(ctx);
      const isOwner = user && itinerary.userId === user._id;
      const isCollaborator = user && itinerary.sharedWith.some(
        (s: { userId: Id<"users"> }) => s.userId === user._id,
      );
      if (!isOwner && !isCollaborator) return null;
    }

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
      .take(100);
  },
});

export const listSharedWithMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    // Query the denormalized itinerary_shares table for efficient lookup
    const shares = await ctx.db
      .query("itinerary_shares")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(100);

    const itineraries = await Promise.all(
      shares.map((s) => ctx.db.get(s.itineraryId)),
    );
    return itineraries.filter(Boolean);
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
    if (args.name !== undefined && args.name.length > 200) throw new Error("Name too long");
    if (args.description !== undefined && args.description.length > 2000) throw new Error("Description too long");
    // Only owners can change publication status — editors cannot expose a private itinerary
    if (args.isPublic !== undefined && !isOwner) {
      throw new Error("Only the owner can change publication status");
    }

    await ctx.db.patch(args.id, {
      updatedAt: Date.now(),
      ...(args.name !== undefined && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.days !== undefined && { days: args.days }),
      ...(args.isPublic !== undefined && { isPublic: args.isPublic }),
    });
  },
});

export const revokeShareLink = mutation({
  args: { id: v.id("itineraries") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, { shareToken: undefined });
  },
});

export const rotateShareLink = mutation({
  args: { id: v.id("itineraries") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }
    const token = generateToken();
    await ctx.db.patch(args.id, { shareToken: token });
    return token;
  },
});

export const removeCollaborator = mutation({
  args: {
    id: v.id("itineraries"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const itinerary = await ctx.db.get(args.id);
    if (!itinerary || itinerary.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      sharedWith: itinerary.sharedWith.filter(
        (s: { userId: Id<"users"> }) => s.userId !== args.userId,
      ),
    });

    const share = await ctx.db
      .query("itinerary_shares")
      .withIndex("by_itinerary_and_user", (q) =>
        q.eq("itineraryId", args.id).eq("userId", args.userId),
      )
      .unique();
    if (share) {
      await ctx.db.delete(share._id);
    }
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

    // Clean up denormalized share records
    const shares = await ctx.db
      .query("itinerary_shares")
      .withIndex("by_itinerary", (q) => q.eq("itineraryId", args.id))
      .take(100);
    for (const share of shares) {
      await ctx.db.delete(share._id);
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
    accessLevel: v.union(v.literal("view"), v.literal("edit")),
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
    // Silent no-op if the email doesn't match a user, to avoid leaking which
    // emails are registered (email-enumeration oracle). Owner can still see
    // the current collaborator list to confirm.
    if (!targetUser) return;

    const alreadyShared = itinerary.sharedWith.some(
      (s: { userId: Id<"users"> }) => s.userId === targetUser._id,
    );
    if (alreadyShared) return;

    await ctx.db.patch(args.id, {
      sharedWith: [
        ...itinerary.sharedWith,
        { userId: targetUser._id, accessLevel: args.accessLevel },
      ],
    });

    // Denormalized share record for efficient lookups
    await ctx.db.insert("itinerary_shares", {
      itineraryId: args.id,
      userId: targetUser._id,
      accessLevel: args.accessLevel,
    });
  },
});
