import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transactions: defineTable({
    userId: v.id("users"),
    description: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  missions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    reward: v.number(),
    progress: v.number(),
    total: v.number(),
    type: v.string(),
  }).index("by_userId", ["userId"]),

  users: defineTable({
    uid: v.string(), // Firebase UID
    username: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    followersCount: v.number(),
    followingCount: v.number(),
    credits: v.number(),
    level: v.optional(v.number()),
    xp: v.optional(v.number()),
    streak: v.optional(v.number()),
  }).index("by_uid", ["uid"])
    .index("by_username", ["username"])
    .index("by_followersCount", ["followersCount"]),

  videos: defineTable({
    userId: v.optional(v.string()), // Temporary string / optional for legacy
    authorId: v.id("users"), 
    url: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    prompt: v.optional(v.string()),
    desc: v.string(),
    music: v.string(),
    aspectRatio: v.string(),
    resolution: v.string(),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    createdAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
    seriesId: v.optional(v.id("series")),
  }).index("by_userId", ["userId"])
    .index("by_authorId", ["authorId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_seriesId", ["seriesId"]),

  stories: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    genre: v.string(),
    likes: v.number(),
    imageUrl: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
  
  comments: defineTable({
    videoId: v.id("videos"),
    authorId: v.id("users"),
    text: v.string(),
    likes: v.number(),
    createdAt: v.number(),
  }).index("by_videoId", ["videoId"]),

  likes: defineTable({
    videoId: v.id("videos"),
    userId: v.id("users"),
  }).index("by_videoId_userId", ["videoId", "userId"])
    .index("by_userId", ["userId"]),
    
  follows: defineTable({
    followerId: v.id("users"),
    followedId: v.id("users"),
    createdAt: v.number(),
  }).index("by_follower", ["followerId"])
    .index("by_followed", ["followedId"])
    .index("by_follower_followed", ["followerId", "followedId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    actorId: v.id("users"),
    entityId: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),

  audiotracks: defineTable({
    name: v.string(),
    category: v.string(),
    mood: v.string(),
    author: v.string(),
    duration: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  challenges: defineTable({
    title: v.string(),
    desc: v.string(),
    participants: v.string(),
    img: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
  
  challengeParticipants: defineTable({
    challengeId: v.string(), // can be an ID or a string '1' '2' from mock
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_challengeId", ["challengeId"])
    .index("by_userId", ["userId"])
    .index("by_challenge_user", ["challengeId", "userId"]),

  trendingTags: defineTable({
    tag: v.string(),
    count: v.string(),
  }),

  aielements: defineTable({
    name: v.string(),
    type: v.string(),
    img: v.optional(v.string()),
    status: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  aiimages: defineTable({
    url: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  novels: defineTable({
    title: v.string(),
    chapters: v.number(),
    progress: v.number(),
    color: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    userId: v.id("users"),
    lastEditedAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  seriesCollaborators: defineTable({
    seriesId: v.id("series"),
    userId: v.id("users"),
    role: v.union(v.literal("Owner"), v.literal("Editor"), v.literal("Viewer")),
    createdAt: v.number(),
  }).index("by_seriesId", ["seriesId"]).index("by_userId", ["userId"]).index("by_series_user", ["seriesId", "userId"]),

  series: defineTable({
    userId: v.id("users"),
    title: v.string(),
    masterPrompt: v.optional(v.string()),
    shots: v.array(v.object({
      id: v.number(),
      prompt: v.string(),
      image: v.optional(v.string()),
      duration: v.number(),
      transition: v.string(),
      motion: v.string(),
      audio: v.string(),
      videoUrl: v.optional(v.string()),
      renderStatus: v.optional(v.union(
        v.literal("idle"),
        v.literal("generating"),
        v.literal("completed"),
        v.literal("failed")
      )),
    })),
    audioTrack: v.optional(v.string()),
    model: v.string(),
    aspectRatio: v.string(),
    lastEditedAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
  }).index("by_userId", ["userId"]),
});
