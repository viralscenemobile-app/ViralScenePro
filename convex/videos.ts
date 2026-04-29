import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getVideo = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.videoId);
  },
});

export const getFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const items = await ctx.db
      .query("videos")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);

    // Join with user data
    return await Promise.all(
      items.map(async (item) => {
        const author = await ctx.db.get(item.authorId);
        return {
          ...item,
          author,
        };
      })
    );
  },
});

export const deleteVideo = mutation({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.videoId);
  }
});

export const deleteImage = mutation({
  args: { imageId: v.id("aiimages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId);
  }
});

export const getVideos = query({
  args: { authorId: v.optional(v.id("users")), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let items;
    if (args.authorId) {
      items = await ctx.db.query("videos").withIndex("by_authorId", (q) => q.eq("authorId", args.authorId!)).collect();
    } else if (args.userId) {
      items = await ctx.db.query("videos").withIndex("by_userId", (q) => q.eq("userId", args.userId!)).collect();
    } else {
      items = await ctx.db.query("videos").withIndex("by_createdAt").order("desc").collect();
    }
    
    return await Promise.all(
      items.map(async (item) => {
        const author = await ctx.db.get(item.authorId);
        return { ...item, author };
      })
    );
  },
});

export const createVideoTask = mutation({
  args: { 
    userId: v.string(), 
    authorId: v.id("users"), 
    prompt: v.string(),
    desc: v.string(),
    music: v.string(),
    aspectRatio: v.string(),
    resolution: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", {
      userId: args.userId,
      authorId: args.authorId,
      prompt: args.prompt,
      desc: args.desc,
      music: args.music,
      aspectRatio: args.aspectRatio,
      resolution: args.resolution,
      status: "pending",
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: Date.now(),
    });
  },
});

export const updateVideoStatus = mutation({
  args: { 
    id: v.id("videos"), 
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ), 
    url: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      url: args.url,
      thumbnailUrl: args.thumbnailUrl,
      error: args.error,
    });
  },
});

export const toggleLike = mutation({
  args: { videoId: v.id("videos"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_videoId_userId", (q) => q.eq("videoId", args.videoId).eq("userId", args.userId))
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      const video = await ctx.db.get(args.videoId);
      if (video) {
        await ctx.db.patch(args.videoId, { likes: Math.max(0, video.likes - 1) });
      }
      return false; // unliked
    } else {
      await ctx.db.insert("likes", {
        videoId: args.videoId,
        userId: args.userId,
      });
      const video = await ctx.db.get(args.videoId);
      if (video) {
        await ctx.db.patch(args.videoId, { likes: video.likes + 1 });
      }
      return true; // liked
    }
  },
});

export const getComments = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
      .order("desc")
      .collect();
      
    return await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return { ...comment, author };
      })
    );
  },
});

export const addComment = mutation({
  args: { videoId: v.id("videos"), text: v.string(), authorId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      videoId: args.videoId,
      authorId: args.authorId,
      text: args.text,
      likes: 0,
      createdAt: Date.now(),
    });
    const video = await ctx.db.get(args.videoId);
    if (video) {
        await ctx.db.patch(args.videoId, { comments: video.comments + 1 });
    }
  },
});

export const generateVideo = action({
  args: { videoId: v.id("videos"), prompt: v.string() },
  handler: async (ctx, args) => {
    try {
      await ctx.runMutation(api.videos.updateVideoStatus, {
        id: args.videoId,
        status: "processing",
      });

      const deApiKey = process.env.DEAPI_API_KEY;
      if (!deApiKey) throw new Error("DEAPI_API_KEY not configured");
      
      const response = await fetch("https://api.deapi.ai/v1/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deApiKey}`,
        },
        body: JSON.stringify({ 
          prompt: args.prompt,
          model: "luma-dream-machine-v1",
          aspect_ratio: "16:9",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`deAPI error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      const finalUrl = result.video_url || result.url || result.data?.url;
      
      if (!finalUrl) throw new Error("No video URL returned from deAPI");

      await ctx.runMutation(api.videos.updateVideoStatus, {
        id: args.videoId,
        status: "completed",
        url: finalUrl,
        thumbnailUrl: finalUrl,
      });

    } catch (error: any) {
      console.error(error);
      await ctx.runMutation(api.videos.updateVideoStatus, {
        id: args.videoId,
        status: "failed",
        error: error.message, 
      });
    }
  },
});

export const getStories = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("stories").withIndex("by_createdAt").order("desc").take(10);
    return await Promise.all(items.map(async (item) => {
        const author = await ctx.db.get(item.authorId);
        return { ...item, author };
    }));
  },
});

export const getTopVideos = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("videos").withIndex("by_createdAt").order("desc").take(10);
    return await Promise.all(items.map(async (item) => {
        const author = await ctx.db.get(item.authorId);
        return { ...item, author };
    }));
  },
});

export const getChallenges = query({
  handler: async (ctx) => {
    return await ctx.db.query("challenges").withIndex("by_createdAt").order("desc").take(10);
  },
});

export const getTrendingTags = query({
  handler: async (ctx) => {
    return await ctx.db.query("trendingTags").collect();
  },
});

export const getTopCreators = query({
  handler: async (ctx) => {
    return await ctx.db.query("users")
      .withIndex("by_followersCount")
      .order("desc")
      .take(10);
  },
});

export const getAudioTracks = query({
  handler: async (ctx) => {
    return await ctx.db.query("audiotracks").order("desc").collect();
  },
});

export const saveImage = mutation({
    args: { userId: v.id("users"), url: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("aiimages", {
            userId: args.userId,
            url: args.url,
            createdAt: Date.now(),
        });
    },
});

export const generateImageAction = action({
    args: { 
        userId: v.id("users"), 
        prompt: v.string(),
        negativePrompt: v.optional(v.string()),
        seed: v.optional(v.string()),
        style: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const deApiKey = process.env.DEAPI_API_KEY;
        let imageUrl: string | null = null;
        
        const fullPrompt = args.style 
          ? `${args.style}: ${args.prompt}` 
          : args.prompt;

        if (deApiKey) {
          try {
            const body: any = { 
                prompt: fullPrompt,
                model: "flux-pro-v1",
                width: 1024,
                height: 1024
            };
            if (args.negativePrompt) body.negative_prompt = args.negativePrompt;
            if (args.seed) body.seed = parseInt(args.seed);

            const response = await fetch("https://api.deapi.ai/v1/image/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${deApiKey}`,
              },
              body: JSON.stringify(body),
            });
            if (response.ok) {
              const res = await response.json();
              imageUrl = res.image_url || res.url || res.data?.url;
            }
          } catch (e) {
            console.error("deAPI Image Gen failed, falling back", e);
          }
        }

        if (!imageUrl) {
          const seed = args.seed ? parseInt(args.seed) : Math.floor(Math.random() * 1000000);
          imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
        }
        
        await ctx.runMutation(api.videos.saveImage, {
            userId: args.userId,
            url: imageUrl,
        });
        return imageUrl;
    },
});

export const generateNovelAction = action({
  args: { prompt: v.string(), genre: v.string(), tone: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Write chapter 1 of a novel. Genre: ${args.genre}. Tone: ${args.tone}. Premise: "${args.prompt}". 
      Return ONLY a JSON object: {"title": "string", "content": "markdown string"}. No backticks.`;

      const result = await gemini.generateContent(prompt);
      let text = result.response.text();
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      return JSON.parse(text.substring(start, end + 1));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const updateShotStatus = mutation({
  args: {
    seriesId: v.id("series"),
    shotId: v.number(),
    status: v.union(v.literal("idle"), v.literal("generating"), v.literal("completed"), v.literal("failed")),
    videoUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const series = await ctx.db.get(args.seriesId);
    if (!series) return;
    const newShots = series.shots.map(s => s.id === args.shotId ? { ...s, renderStatus: args.status, videoUrl: args.videoUrl || s.videoUrl } : s);
    await ctx.db.patch(args.seriesId, { shots: newShots });
  }
});


export const generateShotVideo = action({
  args: { seriesId: v.id("series"), shotId: v.number(), prompt: v.string() },
  handler: async (ctx, args) => {
    try {
      await ctx.runMutation(api.videos.updateShotStatus, { seriesId: args.seriesId, shotId: args.shotId, status: "generating" });
      const deApiKey = process.env.DEAPI_API_KEY;
      if (!deApiKey) throw new Error("DEAPI_API_KEY not configured");
      
      const response = await fetch("https://api.deapi.ai/v1/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${deApiKey}` },
        body: JSON.stringify({ prompt: args.prompt, model: "luma-dream-machine-v1", aspect_ratio: "16:9" }),
      });
      
      if (!response.ok) throw new Error("deAPI call failed");
      const result = await response.json();
      const finalUrl = result.video_url || result.url || result.data?.url;
      if (!finalUrl) throw new Error("No URL returned");

      await ctx.runMutation(api.videos.updateShotStatus, { seriesId: args.seriesId, shotId: args.shotId, status: "completed", videoUrl: finalUrl });
      return finalUrl;
    } catch (error: any) {
      console.error(error);
      await ctx.runMutation(api.videos.updateShotStatus, { seriesId: args.seriesId, shotId: args.shotId, status: "failed" });
      throw error;
    }
  },
});

export const bulkGenerateSeries = action({
  args: { seriesId: v.id("series") },
  handler: async (ctx, args) => {
      const series = await ctx.runQuery(api.users.getSeriesById, { seriesId: args.seriesId });
      if (!series) throw new Error("Series not found");

      const promises = series.shots.map(async (shot) => {
          if (shot.renderStatus !== 'completed' && shot.renderStatus !== 'generating') {
              // Just call the action, it handles its own status updates!
              await ctx.runAction(api.videos.generateShotVideo, { 
                  seriesId: args.seriesId, 
                  shotId: shot.id, 
                  prompt: `${series.masterPrompt} - ${shot.prompt}` 
              });
          }
      });
      await Promise.all(promises);
  }
});

export const analyzeChapterAction = action({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze this chapter and extract 3 visual beats for a storyboard. Return ONLY a JSON array: [{"t": "Shot Type", "d": "Description"}]. Content: "${args.content.substring(0, 3000)}"`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      return JSON.parse(text.substring(start, end + 1));
    } catch (error) {
      console.error(error);
      return [{ t: 'ES', d: 'Opening scene' }, { t: 'CU', d: 'Close up' }, { t: 'MS', d: 'Middle shot' }];
    }
  }
});

export const generateScriptAction = action({
  args: { prompt: v.string(), context: v.string() },
  handler: async (ctx, args) => {
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a shot-by-shot breakdown for: "${args.prompt}". ${args.context}. 
      Return ONLY a JSON array: [{"prompt": "string", "duration": number, "transition": "string", "motion": "string", "audio": "string"}].`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      return JSON.parse(text.substring(start, end + 1));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const joinChallenge = mutation({
  args: { challengeId: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    let challengeId = args.challengeId;
    if (challengeId.length > 10) {
      challengeId = ctx.db.normalizeId("challenges", challengeId) as string || challengeId;
    }
    
    const existing = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
      
    const match = existing.find(e => e.challengeId === challengeId);
      
    if (match) {
      await ctx.db.delete(match._id);
      return false; 
    } else {
      await ctx.db.insert("challengeParticipants", {
        challengeId: challengeId,
        userId: args.userId,
        createdAt: Date.now(),
      });
      return true;
    }
  }
});

export const getParticipatingChallenges = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const participations = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .collect();
    return participations.map(p => p.challengeId);
  }
});

export const remixMediaAction = action({
  args: { prompt: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
      const seed = Math.floor(Math.random() * 1000);
      const outputUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(args.prompt)}?width=1024&height=768&nologo=true&seed=${seed}`;
      await ctx.runMutation(api.videos.saveImage, {
        userId: args.userId,
        url: outputUrl,
      });
      return outputUrl;
  }
});

export const trainElementAction = action({
  args: {
    userId: v.id("users"),
    name: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, this might start a fine-tuning job on a service like Replicate or deAPI (if they support it).
    // For now, we simulate the "result" by generating a representative image for the "trained" element.
    const seed = Math.floor(Math.random() * 1000000);
    const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(args.name + " " + args.type + " 3d model cinematic game asset style white background isolated")}?width=512&height=512&nologo=true&seed=${seed}`;
    
    await ctx.runMutation(api.users.createElement, {
      userId: args.userId,
      name: args.name,
      type: args.type,
      img: imgUrl,
    });
    
    return imgUrl;
  }
});


