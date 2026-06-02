import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser, assertAdmin } from "./helpers";
import { checkRateLimit } from "./rateLimit";

const EVENT_TYPES = [
  "page_view",
  "tip_created",
  "vote_cast",
  "search",
  "bookmark_toggled",
  "photo_uploaded",
] as const;

const eventValidator = v.union(
  ...EVENT_TYPES.map((e) => v.literal(e)),
) as ReturnType<typeof v.union>;

const MAX_PAGE_LEN = 200;
const MAX_METADATA_LEN = 500;

export const trackEvent = mutation({
  args: {
    event: eventValidator,
    page: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Rate-limit per authenticated user or per "anonymous" bucket (best-effort).
    // Anonymous users share one bucket — keeps the table from being flooded
    // by a single unauthenticated bot.
    const rateKey = user ? `analytics:${user._id}` : "analytics:anonymous";
    await checkRateLimit(ctx, rateKey, user ? 500 : 100);

    if (args.page && args.page.length > MAX_PAGE_LEN) {
      throw new Error("Page too long");
    }
    if (args.metadata && args.metadata.length > MAX_METADATA_LEN) {
      throw new Error("Metadata too long");
    }

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
    await assertAdmin(ctx);

    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Fetch all event buckets in parallel — they are independent queries
    const [recentPageViews, recentTips, recentVotes, recentSearches] =
      await Promise.all([
        // Page views last 24h — bound to 10k to prevent dashboard DoS
        ctx.db
          .query("analytics_events")
          .withIndex("by_event_and_date", (q) =>
            q.eq("event", "page_view").gte("createdAt", dayAgo),
          )
          .take(10000),
        ctx.db
          .query("analytics_events")
          .withIndex("by_event_and_date", (q) =>
            q.eq("event", "tip_created").gte("createdAt", weekAgo),
          )
          .take(10000),
        ctx.db
          .query("analytics_events")
          .withIndex("by_event_and_date", (q) =>
            q.eq("event", "vote_cast").gte("createdAt", weekAgo),
          )
          .take(10000),
        ctx.db
          .query("analytics_events")
          .withIndex("by_event_and_date", (q) =>
            q.eq("event", "search").gte("createdAt", weekAgo),
          )
          .take(10000),
      ]);

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

/**
 * Scheduled cleanup: delete analytics events older than 30 days.
 * Keeps the table bounded so dashboard queries stay fast.
 */
export const pruneOldEvents = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const old = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_and_date", (q) =>
        q.eq("event", "page_view").lt("createdAt", cutoff),
      )
      .take(500);
    for (const row of old) {
      await ctx.db.delete(row._id);
    }
    return { deleted: old.length };
  },
});
