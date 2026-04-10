import { MutationCtx } from "./_generated/server";

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
