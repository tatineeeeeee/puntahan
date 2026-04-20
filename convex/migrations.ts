import { internalMutation } from "./_generated/server";

/**
 * Phase 64: trip_suggestions schema changed from string-based voters
 * to authenticated user-id voters. Run once after deploy to clear any
 * rows that would now fail schema validation.
 *
 * Invoke via: `bunx convex run migrations:resetTripSuggestions`
 */
export const resetTripSuggestions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("trip_suggestions").take(5000);
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { deleted: rows.length };
  },
});
