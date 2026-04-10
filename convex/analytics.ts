import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./helpers";

export const trackEvent = mutation({
  args: {
    event: v.string(),
    page: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.insert("analytics_events", {
      event: args.event,
      page: args.page,
      metadata: args.metadata,
      userId: user?._id,
      createdAt: Date.now(),
    });
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Page views last 24h
    const recentPageViews = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_and_date", (q) =>
        q.eq("event", "page_view").gte("createdAt", dayAgo),
      )
      .collect();

    // Tips created last 7 days
    const recentTips = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_and_date", (q) =>
        q.eq("event", "tip_created").gte("createdAt", weekAgo),
      )
      .collect();

    // Votes last 7 days
    const recentVotes = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_and_date", (q) =>
        q.eq("event", "vote_cast").gte("createdAt", weekAgo),
      )
      .collect();

    // Searches last 7 days
    const recentSearches = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_and_date", (q) =>
        q.eq("event", "search").gte("createdAt", weekAgo),
      )
      .collect();

    // Top pages (last 24h)
    const pageCounts: Record<string, number> = {};
    for (const e of recentPageViews) {
      if (e.page) {
        pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1;
      }
    }
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    return {
      pageViews24h: recentPageViews.length,
      tipsCreated7d: recentTips.length,
      votesCast7d: recentVotes.length,
      searches7d: recentSearches.length,
      topPages,
    };
  },
});
