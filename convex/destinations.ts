import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {
    region: v.optional(v.union(v.literal("NCR"), v.literal("Luzon"), v.literal("Visayas"), v.literal("Mindanao"))),
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

    return await q.take(500);
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

export const getByIds = query({
  args: { ids: v.array(v.id("destinations")) },
  handler: async (ctx, args) => {
    const results = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    return results.filter((d): d is NonNullable<typeof d> => d !== null);
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

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_published", (idx) => idx.eq("isPublished", true))
      .collect();

    return {
      total: destinations.length,
      byRegion: {
        NCR: destinations.filter((d) => d.region === "NCR").length,
        Luzon: destinations.filter((d) => d.region === "Luzon").length,
        Visayas: destinations.filter((d) => d.region === "Visayas").length,
        Mindanao: destinations.filter((d) => d.region === "Mindanao").length,
      },
      byBudget: {
        Budget: destinations.filter((d) => d.budgetCategory === "Budget").length,
        "Mid-range": destinations.filter((d) => d.budgetCategory === "Mid-range").length,
        Luxury: destinations.filter((d) => d.budgetCategory === "Luxury").length,
      },
    };
  },
});
