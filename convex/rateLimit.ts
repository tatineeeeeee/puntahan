import { MutationCtx, internalMutation } from "./_generated/server";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function checkRateLimit(
  ctx: MutationCtx,
  key: string,
  maxCount: number,
): Promise<void> {
  const now = Date.now();
  const existing = await ctx.db
    .query("rate_limits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .first();

  if (!existing) {
    await ctx.db.insert("rate_limits", { key, count: 1, windowStart: now });
    return;
  }

  // Window expired — reset
  if (now - existing.windowStart > WINDOW_MS) {
    await ctx.db.patch(existing._id, { count: 1, windowStart: now });
    return;
  }

  if (existing.count >= maxCount) {
    throw new Error("You're doing that too fast. Try again in a few minutes.");
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}

/**
 * Scheduled cleanup: delete rate-limit rows whose window has expired.
 * Without this, the table grows monotonically with every distinct key.
 */
export const pruneExpired = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - WINDOW_MS * 2;
    const stale = await ctx.db.query("rate_limits").take(1000);
    let deleted = 0;
    for (const row of stale) {
      if (row.windowStart < cutoff) {
        await ctx.db.delete(row._id);
        deleted++;
      }
    }
    return { deleted };
  },
});
