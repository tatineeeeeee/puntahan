import { query } from "./_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const destinations = await ctx.db
      .query("destinations")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .take(500);

    const festivals: {
      name: string;
      month: number;
      description: string | undefined;
      destinationName: string;
      destinationSlug: string;
      region: string;
    }[] = [];

    for (const dest of destinations) {
      for (const fest of dest.festivals) {
        festivals.push({
          name: fest.name,
          month: fest.month,
          description: fest.description,
          destinationName: dest.name,
          destinationSlug: dest.slug,
          region: dest.region,
        });
      }
    }

    return festivals.sort((a, b) => a.month - b.month);
  },
});
