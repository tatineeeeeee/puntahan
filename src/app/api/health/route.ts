import { NextResponse } from "next/server";

/**
 * Health check endpoint — used by uptime monitors (UptimeRobot, Healthchecks.io, etc.)
 * Returns 200 with basic info when the app is up.
 *
 * Monitor URL: GET https://puntahan.vercel.app/api/health
 */
export const runtime = "edge";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "puntahan",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        // Don't cache health checks — monitors need a live response
        "Cache-Control": "no-store",
      },
    },
  );
}
