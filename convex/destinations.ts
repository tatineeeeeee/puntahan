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

    const destinations = await q.take(500);

    // N+1 join for tip previews — acceptable for ~23 destinations, won't scale past ~100
    return await Promise.all(
      destinations.map(async (dest) => {
        if (dest.tipsCount === 0) {
          return { ...dest, topTipPreview: null };
        }

        const tips = await ctx.db
          .query("tips")
          .withIndex("by_destination_and_approved", (t) =>
            t.eq("destinationId", dest._id).eq("isApproved", true),
          )
          .take(200);

        const topTip =
          tips.sort((a, b) => b.weightedScore - a.weightedScore)[0] ?? null;

        if (!topTip) {
          return { ...dest, topTipPreview: null };
        }

        const user = await ctx.db.get(topTip.userId);
        const content =
          topTip.content.length > 60
            ? topTip.content.slice(0, 60) + "…"
            : topTip.content;

        return {
          ...dest,
          topTipPreview: { content, authorName: user?.name ?? "Anonymous" },
        };
      }),
    );
  },
});

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("destinations")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .take(20);

    return await Promise.all(
      results.map(async (dest) => {
        if (dest.tipsCount === 0) {
          return { ...dest, topTipPreview: null };
        }

        const tips = await ctx.db
          .query("tips")
          .withIndex("by_destination_and_approved", (t) =>
            t.eq("destinationId", dest._id).eq("isApproved", true),
          )
          .take(200);

        const topTip =
          tips.sort((a, b) => b.weightedScore - a.weightedScore)[0] ?? null;

        if (!topTip) {
          return { ...dest, topTipPreview: null };
        }

        const user = await ctx.db.get(topTip.userId);
        const content =
          topTip.content.length > 60
            ? topTip.content.slice(0, 60) + "…"
            : topTip.content;

        return {
          ...dest,
          topTipPreview: { content, authorName: user?.name ?? "Anonymous" },
        };
      }),
    );
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

export const listTopRated = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("destinations")
      .withIndex("by_published", (idx) => idx.eq("isPublished", true))
      .collect();

    const withTips = all
      .filter((d) => d.tipsCount > 0)
      .sort((a, b) =>
        b.avgRating !== a.avgRating
          ? b.avgRating - a.avgRating
          : b.tipsCount - a.tipsCount,
      )
      .slice(0, 4);

    return await Promise.all(
      withTips.map(async (dest) => {
        const tips = await ctx.db
          .query("tips")
          .withIndex("by_destination_and_approved", (q) =>
            q.eq("destinationId", dest._id).eq("isApproved", true),
          )
          .take(200);

        const topTip =
          tips.sort((a, b) => b.weightedScore - a.weightedScore)[0] ?? null;

        let authorName = "Anonymous";
        if (topTip) {
          const user = await ctx.db.get(topTip.userId);
          authorName = user?.name ?? "Anonymous";
        }

        return {
          _id: dest._id,
          name: dest.name,
          slug: dest.slug,
          region: dest.region,
          province: dest.province,
          heroImageUrl: dest.heroImageUrl,
          avgRating: dest.avgRating,
          tipsCount: dest.tipsCount,
          budgetMin: dest.budgetMin,
          budgetMax: dest.budgetMax,
          budgetCategory: dest.budgetCategory,
          topTip: topTip
            ? {
                content:
                  topTip.content.length > 80
                    ? topTip.content.slice(0, 80) + "…"
                    : topTip.content,
                authorName,
              }
            : null,
        };
      }),
    );
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
