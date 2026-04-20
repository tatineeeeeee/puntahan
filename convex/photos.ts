import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./helpers";
import { checkRateLimit } from "./rateLimit";
import { Id } from "./_generated/dataModel";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

async function assertStorageValid(ctx: MutationCtx, storageId: string) {
  const metadata = await ctx.storage.getMetadata(storageId as Id<"_storage">);
  if (!metadata) throw new Error("Upload not found");

  if (metadata.size > MAX_PHOTO_BYTES) {
    await ctx.storage.delete(storageId as Id<"_storage">);
    throw new Error("Photo exceeds 5 MB limit");
  }
  // Block SVG + reject any non-raster image type (SVG can contain script)
  if (!metadata.contentType || !ALLOWED_CONTENT_TYPES.has(metadata.contentType)) {
    await ctx.storage.delete(storageId as Id<"_storage">);
    throw new Error("Only JPEG, PNG, WebP, AVIF, or GIF images are allowed");
  }
  return metadata;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    await checkRateLimit(ctx, `photo-upload:${user._id}`, 30);
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
    const user = await getCurrentUserOrThrow(ctx);
    if (args.caption && args.caption.length > 500) throw new Error("Caption too long");

    await assertStorageValid(ctx, args.storageId);

    // Prevent double-save: one photo row per storageId
    const existing = await ctx.db
      .query("photos")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .first();
    if (existing) throw new Error("This photo has already been saved");

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

/**
 * Claim a storage upload for use in a tip. Must be called immediately after
 * the client POSTs the file to the upload URL. Validates size + content-type
 * and records ownership so `tips.create` can later verify the storageIds
 * it receives were actually uploaded by the current user.
 */
export const registerTipPhoto = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await checkRateLimit(ctx, `photo-register:${user._id}`, 30);

    // Idempotent for the same user; reject if someone else already claimed it
    const existing = await ctx.db
      .query("tip_photo_uploads")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .first();
    if (existing) {
      if (existing.uploadedBy !== user._id) {
        throw new Error("Upload already claimed by another user");
      }
      return;
    }

    const metadata = await assertStorageValid(ctx, args.storageId);

    await ctx.db.insert("tip_photo_uploads", {
      uploadedBy: user._id,
      storageId: args.storageId,
      contentType: metadata.contentType ?? "application/octet-stream",
      sizeBytes: metadata.size,
      createdAt: Date.now(),
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
      .take(100);

    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      })),
    );
  },
});
