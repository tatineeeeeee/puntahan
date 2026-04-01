import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggle = mutation({
  args: {
    destinationId: v.id("destinations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_destination", (q) =>
        q.eq("userId", user._id).eq("destinationId", args.destinationId),
      )
      .unique();

    const dest = await ctx.db.get(args.destinationId);

    if (existing) {
      await ctx.db.delete(existing._id);
      if (dest) {
        await ctx.db.patch(args.destinationId, {
          bookmarksCount: Math.max(0, dest.bookmarksCount - 1),
        });
      }
      await ctx.db.patch(user._id, {
        bookmarksCount: Math.max(0, user.bookmarksCount - 1),
      });
      return false;
    } else {
      await ctx.db.insert("bookmarks", {
        userId: user._id,
        destinationId: args.destinationId,
        isVisited: false,
      });
      if (dest) {
        await ctx.db.patch(args.destinationId, {
          bookmarksCount: dest.bookmarksCount + 1,
        });
      }
      await ctx.db.patch(user._id, {
        bookmarksCount: user.bookmarksCount + 1,
      });
      return true;
    }
  },
});

export const isBookmarked = query({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) return false;

    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_destination", (q) =>
        q.eq("userId", user._id).eq("destinationId", args.destinationId),
      )
      .unique();

    return bookmark !== null;
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

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return await Promise.all(
      bookmarks.map(async (bm) => {
        const dest = await ctx.db.get(bm.destinationId);
        return {
          ...bm,
          destination: dest,
        };
      }),
    );
  },
});

export const toggleVisited = mutation({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_destination", (q) =>
        q.eq("userId", user._id).eq("destinationId", args.destinationId),
      )
      .unique();

    if (!bookmark) throw new Error("Bookmark not found");

    const newVisited = !bookmark.isVisited;
    await ctx.db.patch(bookmark._id, { isVisited: newVisited });

    await ctx.db.patch(user._id, {
      destinationsVisited: user.destinationsVisited + (newVisited ? 1 : -1),
    });

    return newVisited;
  },
});
