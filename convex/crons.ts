import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Every hour: delete rate-limit rows whose window expired long ago
crons.interval(
  "prune rate limits",
  { hours: 1 },
  internal.rateLimit.pruneExpired,
);

// Every 24 hours: drop analytics events older than 30 days to keep the
// dashboard query bounded
crons.interval(
  "prune analytics events",
  { hours: 24 },
  internal.analytics.pruneOldEvents,
);

export default crons;
