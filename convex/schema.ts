import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    tipsCount: v.number(),
    upvotesReceived: v.number(),
    destinationsVisited: v.number(),
    bookmarksCount: v.number(),
    photosUploaded: v.number(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_tips_count", ["tipsCount"])
    .index("by_upvotes_received", ["upvotesReceived"]),

  destinations: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    region: v.union(v.literal("NCR"), v.literal("Luzon"), v.literal("Visayas"), v.literal("Mindanao")),
    province: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    categories: v.array(v.string()),
    tags: v.array(v.string()),
    avgRating: v.number(),
    tipsCount: v.number(),
    bookmarksCount: v.number(),
    budgetMin: v.number(),
    budgetMax: v.number(),
    budgetCategory: v.union(v.literal("Budget"), v.literal("Mid-range"), v.literal("Luxury")),
    bestTimeToVisit: v.optional(v.string()),
    festivals: v.array(
      v.object({
        name: v.string(),
        month: v.number(),
        description: v.optional(v.string()),
      }),
    ),
    heroImageStorageId: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    photosCount: v.number(),
    isPublished: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_region", ["region"])
    .index("by_published", ["isPublished"])
    .searchIndex("search_name", { searchField: "name" }),

  tips: defineTable({
    userId: v.id("users"),
    destinationId: v.id("destinations"),
    content: v.string(),
    rating: v.number(),
    budgetBreakdown: v.array(
      v.object({
        category: v.string(),
        amount: v.number(),
      }),
    ),
    totalBudget: v.number(),
    upvotes: v.number(),
    downvotes: v.number(),
    photosStorageIds: v.array(v.string()),
    createdAt: v.number(),
    isApproved: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_destination", ["destinationId"])
    .index("by_user_and_destination", ["userId", "destinationId"])
    .index("by_destination_and_approved", ["destinationId", "isApproved"])
    .index("by_destination_and_created", ["destinationId", "createdAt"])
    .index("by_approved", ["isApproved"]),

  votes: defineTable({
    userId: v.id("users"),
    tipId: v.id("tips"),
    direction: v.union(v.literal("up"), v.literal("down")),
  })
    .index("by_user_and_tip", ["userId", "tipId"])
    .index("by_tip", ["tipId"])
    .index("by_user", ["userId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    destinationId: v.id("destinations"),
    isVisited: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_visited", ["userId", "isVisited"])
    .index("by_destination", ["destinationId"])
    .index("by_user_and_destination", ["userId", "destinationId"]),

  photos: defineTable({
    destinationId: v.id("destinations"),
    uploadedBy: v.id("users"),
    storageId: v.string(),
    caption: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_destination", ["destinationId"])
    .index("by_user", ["uploadedBy"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("tip_upvoted"), v.literal("new_tip_on_bookmarked"), v.literal("badge_earned")),
    message: v.string(),
    relatedId: v.optional(v.string()),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"]),

  itineraries: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    days: v.array(
      v.object({
        dayNumber: v.number(),
        destinationIds: v.array(v.id("destinations")),
        notes: v.optional(v.string()),
      }),
    ),
    isPublic: v.boolean(),
    sharedWith: v.array(
      v.object({
        userId: v.id("users"),
        accessLevel: v.union(v.literal("view"), v.literal("edit")),
      }),
    ),
    shareToken: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_public", ["userId", "isPublic"])
    .index("by_share_token", ["shareToken"]),

  itinerary_shares: defineTable({
    itineraryId: v.id("itineraries"),
    userId: v.id("users"),
    accessLevel: v.union(v.literal("view"), v.literal("edit")),
  })
    .index("by_user", ["userId"])
    .index("by_itinerary", ["itineraryId"])
    .index("by_itinerary_and_user", ["itineraryId", "userId"]),

  checklists: defineTable({
    userId: v.id("users"),
    itineraryId: v.optional(v.id("itineraries")),
    name: v.string(),
    items: v.array(
      v.object({
        text: v.string(),
        isChecked: v.boolean(),
      }),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_itinerary", ["itineraryId"]),

  journals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    destinationIds: v.array(v.id("destinations")),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"]),
});
