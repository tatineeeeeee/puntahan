import { query } from "./_generated/server";

export const topContributors = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_tips_count")
      .order("desc")
      .take(10);
    return users.map((u) => ({
      _id: u._id,
      name: u.name ?? "Anonymous",
      imageUrl: u.imageUrl ?? null,
      tipsCount: u.tipsCount,
      upvotesReceived: u.upvotesReceived,
      destinationsVisited: u.destinationsVisited,
      photosUploaded: u.photosUploaded,
    }));
  },
});

export const topByUpvotes = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_upvotes_received")
      .order("desc")
      .take(10);
    return users.map((u) => ({
      _id: u._id,
      name: u.name ?? "Anonymous",
      imageUrl: u.imageUrl ?? null,
      tipsCount: u.tipsCount,
      upvotesReceived: u.upvotesReceived,
    }));
  },
});

export const topDestinations = query({
  args: {},
  handler: async (ctx) => {
    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .take(200);
    return destinations
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 10)
      .map((d) => ({
        _id: d._id,
        name: d.name,
        slug: d.slug,
        region: d.region,
        avgRating: d.avgRating,
        tipsCount: d.tipsCount,
      }));
  },
});
