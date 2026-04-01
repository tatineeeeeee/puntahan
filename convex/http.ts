import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return new Response("Server misconfigured", { status: 500 });
    }

    const body = await request.text();

    const wh = new Webhook(secret);
    let event: { type: string; data: Record<string, unknown> };

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as typeof event;
    } catch {
      console.error("Webhook verification failed");
      return new Response("Invalid signature", { status: 401 });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const data = event.data as {
        id: string;
        email_addresses: Array<{ email_address: string }>;
        first_name: string | null;
        last_name: string | null;
        image_url: string | null;
      };

      await ctx.runMutation(internal.users.upsertFromClerk, {
        clerkUserId: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        name:
          [data.first_name, data.last_name].filter(Boolean).join(" ") ||
          undefined,
        imageUrl: data.image_url ?? undefined,
      });
    } else if (event.type === "user.deleted") {
      const data = event.data as { id: string };
      await ctx.runMutation(internal.users.deleteFromClerk, {
        clerkUserId: data.id,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
