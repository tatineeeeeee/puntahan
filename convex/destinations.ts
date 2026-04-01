import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q;

    if (args.region) {
      q = ctx.db
        .query("destinations")
        .withIndex("by_region", (idx) => idx.eq("region", args.region!));
    } else {
      q = ctx.db
        .query("destinations")
        .withIndex("by_published", (idx) => idx.eq("isPublished", true));
    }

    return await q.collect();
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("destinations")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .take(20);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("destinations")
      .withIndex("by_slug", (idx) => idx.eq("slug", args.slug))
      .unique();
  },
});
