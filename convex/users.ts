import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
  },
});

export const addCredits = mutation({
  args: { userId: v.id("users"), amount: v.number(), description: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;
    
    await ctx.db.patch(args.userId, { credits: (user.credits || 0) + args.amount });
    
    await ctx.db.insert("transactions", {
      userId: args.userId,
      amount: args.amount,
      description: args.description,
      createdAt: Date.now(),
    });
  }
});

export const getTransactions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("transactions").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const getMissions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("missions").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const updateMissionProgress = mutation({
  args: { missionId: v.id("missions") },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId);
    if (!mission) return;
    
    if (mission.progress < mission.total) {
      await ctx.db.patch(args.missionId, { progress: mission.progress + 1 });
      
      // If completed, maybe reward credits?
      if (mission.progress + 1 >= mission.total) {
        const user = await ctx.db.get(mission.userId);
        if (user) {
          await ctx.db.patch(user._id, { credits: (user.credits || 0) + mission.reward });
          await ctx.db.insert("transactions", {
            userId: user._id,
            amount: mission.reward,
            description: `Mission Completed: ${mission.title}`,
            createdAt: Date.now(),
          });
        }
      }
    }
  }
});

export const syncUser = mutation({
  args: {
    uid: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first();

    if (existingUser) {
      // Update info if it changed
      const updates: any = {};
      if (existingUser.displayName !== args.displayName) updates.displayName = args.displayName ?? existingUser.displayName;
      if (existingUser.avatarUrl !== args.avatarUrl) updates.avatarUrl = args.avatarUrl ?? existingUser.avatarUrl;
      
      // Migration for existing users without credits
      if (existingUser.credits === undefined) updates.credits = 1000;

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingUser._id, updates);
      }
      return existingUser._id;
    } else {
      // Create new user
      const username = "user_" + Math.random().toString(36).substring(2, 8);
      return await ctx.db.insert("users", {
        uid: args.uid,
        username,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        followersCount: 0,
        followingCount: 0,
        credits: 1000, // Starting credits
        level: 1,
        xp: 0,
        streak: 0,
      });
    }
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first();
  },
});

/**
 * Library consolidated
 */

export const getElements = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("aielements").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const deleteNovel = mutation({
  args: { novelId: v.id("novels") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.novelId);
  }
});

export const deleteElement = mutation({
  args: { elementId: v.id("aielements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.elementId);
  }
});

export const createElement = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    type: v.string(),
    img: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aielements", {
      name: args.name,
      type: args.type,
      img: args.img,
      status: "Ready",
      userId: args.userId,
      createdAt: Date.now(),
    });
  },
});

export const getImages = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("aiimages").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const getViralElements = query({
  handler: async (ctx) => {
    const elements = await ctx.db.query("aielements").take(20);
    const users = await Promise.all(
      elements.map(e => ctx.db.get(e.userId))
    );
    return elements.map((e, idx) => ({
        ...e,
        author: users[idx]
    }));
  }
});

export const getNovels = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("novels").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
  },
});

export const markAllNotificationsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
      
    // Delete all user notifications
    return await Promise.all(
       notifications.map(n => ctx.db.delete(n._id))
    );
  }
});

export const toggleFollow = mutation({
  args: { followerId: v.id("users"), followedId: v.id("users") },
  handler: async (ctx, args) => {
    if (args.followerId === args.followedId) return;
    
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_followed", (q) => 
        q.eq("followerId", args.followerId).eq("followedId", args.followedId)
      )
      .first();

    const follower = await ctx.db.get(args.followerId);
    const followed = await ctx.db.get(args.followedId);

    if (existing) {
      await ctx.db.delete(existing._id);
      
      if (follower) await ctx.db.patch(args.followerId, { followingCount: Math.max(0, follower.followingCount - 1) });
      if (followed) await ctx.db.patch(args.followedId, { followersCount: Math.max(0, followed.followersCount - 1) });
      
      return false; // unfoled
    } else {
      await ctx.db.insert("follows", {
        followerId: args.followerId,
        followedId: args.followedId,
        createdAt: Date.now(),
      });
      
      if (follower) await ctx.db.patch(args.followerId, { followingCount: follower.followingCount + 1 });
      if (followed) await ctx.db.patch(args.followedId, { followersCount: followed.followersCount + 1 });
      
      return true; // followed
    }
  },
});

export const getFollowingFeed = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
      
    const followedIds = follows.map(f => f.followedId);
    
    if (followedIds.length === 0) return [];
    
    // Naively get recent videos and filter, or collect all videos of followed users
    // Convex limited array queries, better to get videos by those users and sort
    
    let allVideos = [];
    for (const authorId of followedIds) {
      const vids = await ctx.db.query("videos").withIndex("by_authorId", q => q.eq("authorId", authorId)).order("desc").take(50);
      allVideos.push(...vids);
    }
    
    allVideos.sort((a, b) => b.createdAt - a.createdAt);
    allVideos = allVideos.slice(0, args.limit ?? 20);
    
    return await Promise.all(
      allVideos.map(async (item) => {
        const author = await ctx.db.get(item.authorId);
        return { ...item, author };
      })
    );
  },
});

export const getIsFollowing = query({
  args: { followerId: v.id("users"), followedId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_followed", (q) => 
        q.eq("followerId", args.followerId).eq("followedId", args.followedId)
      )
      .first();
    return !!existing;
  },
});

export const getFollowsList = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
    return follows.map(f => f.followedId);
  },
});

export const createNovel = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("novels", {
      userId: args.userId,
      title: args.title,
      content: args.content,
      imageUrl: args.imageUrl,
      chapters: 1,
      progress: 10,
      color: "bg-purple-600",
      lastEditedAt: Date.now(),
    });
  },
});

export const getSeriesById = query({
  args: { seriesId: v.id("series") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.seriesId);
  },
});

export const getSeries = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("series").withIndex("by_userId", q => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const saveSeries = mutation({
  args: {
    userId: v.id("users"),
    seriesId: v.optional(v.id("series")),
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
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const { seriesId, ...data } = args;
    const seriesData = {
      ...data,
      lastEditedAt: Date.now(),
    };
    if (seriesId) {
      await ctx.db.patch(seriesId, seriesData);
      
      if (args.status === "published") {
        const existingVideo = await ctx.db.query("videos").withIndex("by_seriesId", q => q.eq("seriesId", seriesId)).first();
        if (!existingVideo) {
          // Find first completed video URL in shots
          const completedShot = args.shots.find(s => s.renderStatus === "completed" && s.videoUrl);
          await ctx.db.insert("videos", {
            authorId: args.userId,
            url: completedShot?.videoUrl || "", // Placeholder or first shot
            thumbnailUrl: completedShot?.image || undefined,
            prompt: args.masterPrompt || args.shots[0]?.prompt || "Series",
            desc: `Series: ${args.title}`,
            music: args.audioTrack || "Original Audio",
            aspectRatio: args.aspectRatio,
            resolution: "1080p",
            likes: 0,
            comments: 0,
            shares: 0,
            status: "completed",
            seriesId: seriesId,
            createdAt: Date.now(),
          });
        }
      }
      return seriesId;
    } else {
      const newSeriesId = await ctx.db.insert("series", seriesData);
      if (args.status === "published") {
          const completedShot = args.shots.find(s => s.renderStatus === "completed" && s.videoUrl);
          await ctx.db.insert("videos", {
            authorId: args.userId,
            url: completedShot?.videoUrl || "",
            thumbnailUrl: completedShot?.image || undefined,
            prompt: args.masterPrompt || args.shots[0]?.prompt || "Series",
            desc: `Series: ${args.title}`,
            music: args.audioTrack || "Original Audio",
            aspectRatio: args.aspectRatio,
            resolution: "1080p",
            likes: 0,
            comments: 0,
            shares: 0,
            status: "completed",
            seriesId: newSeriesId,
            createdAt: Date.now(),
          });
      }
      return newSeriesId;
    }
  },
});

export const deleteSeries = mutation({
  args: { seriesId: v.id("series") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.seriesId);
  },
});

export const getSeriesCollaborators = query({
  args: { seriesId: v.id("series") },
  handler: async (ctx, args) => {
    const collabs = await ctx.db.query("seriesCollaborators").withIndex("by_seriesId", q => q.eq("seriesId", args.seriesId)).collect();
    return await Promise.all(collabs.map(async c => {
      const u = await ctx.db.get(c.userId);
      return { ...c, user: u };
    }));
  },
});

export const addSeriesCollaborator = mutation({
  args: { seriesId: v.id("series"), search: v.string(), role: v.union(v.literal("Owner"), v.literal("Editor"), v.literal("Viewer")) },
  handler: async (ctx, args) => {
    // Search by username or display name
    const userMatches = await ctx.db.query("users")
      .filter(q => q.or(
        q.eq(q.field("username"), args.search),
        q.eq(q.field("displayName"), args.search)
      ))
      .collect();
    
    if(userMatches.length === 0) throw new Error("Artist / Director not found.");
    
    // Check if already a collaborator
    const existing = await ctx.db.query("seriesCollaborators")
      .withIndex("by_seriesId", q => q.eq("seriesId", args.seriesId))
      .filter(q => q.eq(q.field("userId"), userMatches[0]._id))
      .first();
    
    if (existing) throw new Error("Already a collaborator");

    await ctx.db.insert("seriesCollaborators", {
      seriesId: args.seriesId,
      userId: userMatches[0]._id,
      role: args.role,
      createdAt: Date.now()
    });
  }
});

