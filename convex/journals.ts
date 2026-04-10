import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./helpers";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    destinationIds: v.array(v.id("destinations")),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    if (args.title.length > 200) throw new Error("Title too long");
    if (args.content.length > 10000) throw new Error("Content too long");

    return await ctx.db.insert("journals", {
      userId: user._id,
      title: args.title,
      content: args.content,
      destinationIds: args.destinationIds,
      isPublic: args.isPublic,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const journals = await ctx.db
      .query("journals")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(20);

    return await Promise.all(
      journals.map(async (j) => {
        const user = await ctx.db.get(j.userId);
        return {
          ...j,
          userName: user?.name ?? "Anonymous",
          userImage: user?.imageUrl ?? null,
        };
      }),
    );
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("journals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(100);
  },
});
