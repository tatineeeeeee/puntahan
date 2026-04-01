import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const savePhoto = mutation({
  args: {
    destinationId: v.id("destinations"),
    storageId: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.insert("photos", {
      destinationId: args.destinationId,
      uploadedBy: user._id,
      storageId: args.storageId,
      caption: args.caption,
      uploadedAt: Date.now(),
    });

    const dest = await ctx.db.get(args.destinationId);
    if (dest) {
      await ctx.db.patch(args.destinationId, {
        photosCount: dest.photosCount + 1,
      });
    }

    await ctx.db.patch(user._id, {
      photosUploaded: user.photosUploaded + 1,
    });
  },
});

export const listByDestination = query({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_destination", (q) =>
        q.eq("destinationId", args.destinationId),
      )
      .collect();

    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      })),
    );
  },
});
