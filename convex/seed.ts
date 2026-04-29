import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // 1. Seed Trending Tags if empty
    const tags = await ctx.db.query("trendingTags").collect();
    if (tags.length === 0) {
      const initialTags = [
        { tag: "Cyberpunk2077", count: "1.2M Posts" },
        { tag: "NeuralDreams", count: "850K Posts" },
        { tag: "ArtisanDirector", count: "420K Posts" },
        { tag: "SpaceOpera", count: "310K Posts" },
        { tag: "RetroVibe", count: "215K Posts" },
      ];
      for (const tag of initialTags) {
        await ctx.db.insert("trendingTags", tag);
      }
    }

    // 2. Seed Challenges if empty
    const challenges = await ctx.db.query("challenges").collect();
    if (challenges.length === 0) {
      const initialChallenges = [
        {
          title: "Neon City Nights",
          desc: "Create a 15s cinematic city crawl",
          participants: "2.4k",
          img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800",
          status: "Live",
          createdAt: Date.now(),
        },
        {
          title: "The Silent Forest",
          desc: "Ethereal nature and bioluminescence",
          participants: "1.8k",
          img: "https://images.unsplash.com/photo-1518173950427-652151146311?w=800",
          status: "Live",
          createdAt: Date.now() - 10000,
        },
        {
          title: "Android Revolution",
          desc: "Portrait study of robotic emotions",
          participants: "940",
          img: "https://images.unsplash.com/photo-1546333142-2e4627efcf85?w=800",
          status: "Upcoming",
          createdAt: Date.now() - 20000,
        },
      ];
      for (const ch of initialChallenges) {
        await ctx.db.insert("challenges", ch);
      }
    }

    // 3. Seed Audio Tracks if empty
    const tracks = await ctx.db.query("audiotracks").collect();
    if (tracks.length === 0) {
      const initialTracks = [
        { name: "Synthwave Pulse", category: "music", mood: "Energetic", author: "NeoBeats", duration: "2:45", createdAt: Date.now() },
        { name: "Ambient Rain", category: "sfx", mood: "Atmospheric", author: "NatureEcho", duration: "1:20", createdAt: Date.now() },
        { name: "Cyberpunk Action", category: "music", mood: "Tense", author: "NightCity", duration: "3:10", createdAt: Date.now() },
        { name: "Dreamy Piano", category: "music", mood: "Relaxing", author: "Ethereal", duration: "2:15", createdAt: Date.now() },
        { name: "Deep Space Hum", category: "sfx", mood: "Eerie", author: "Galactic", duration: "0:45", createdAt: Date.now() },
      ];
      for (const track of initialTracks) {
        await ctx.db.insert("audiotracks", track);
      }
    }

    // 4. Seed some users and content if empty
    const users = await ctx.db.query("users").collect();
    if (users.length === 0) {
      const creatorId = await ctx.db.insert("users", {
        uid: "system_creator",
        username: "ARTISAN",
        displayName: "Artisan Director",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan",
        followersCount: 12500,
        followingCount: 42,
        credits: 5000,
        level: 42,
        xp: 4200,
        streak: 15,
      });

      const directorId = await ctx.db.insert("users", {
        uid: "system_director",
        username: "CYBER_GHOST",
        displayName: "Cyber Ghost",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber",
        followersCount: 8400,
        followingCount: 120,
        credits: 3000,
        level: 28,
        xp: 2800,
        streak: 7,
      });

      // Seed videos
      await ctx.db.insert("videos", {
        authorId: creatorId,
        url: "https://cdn.pixabay.com/vimeo/328940142/cyberpunk-22634.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800",
        prompt: "Cinematic flythrough of a neon cyberpunk city",
        desc: "The future is now. #cyberpunk #ai",
        music: "Synthwave Pulse",
        likes: 1240,
        comments: 42,
        shares: 156,
        status: "completed",
        createdAt: Date.now(),
      });

      await ctx.db.insert("videos", {
        authorId: directorId,
        url: "https://cdn.pixabay.com/vimeo/349405626/urban-32076.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1546333142-2e4627efcf85?w=800",
        prompt: "Urban dystopia character study",
        desc: "Life in the machine. #dystopia #future",
        music: "Deep Space Hum",
        likes: 890,
        comments: 12,
        shares: 45,
        status: "completed",
        createdAt: Date.now() - 3600000,
      });

      // Seed stories
      await ctx.db.insert("stories", {
        authorId: creatorId,
        title: "Echoes of the Void",
        genre: "Sci-Fi",
        likes: 850,
        imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800",
        createdAt: Date.now(),
      });

      // Seed some global AI Elements
      const elements = [
        { name: "Neon Hero", type: "Character", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400", status: "Ready", userId: creatorId, createdAt: Date.now() },
        { name: "Plasma Blade", type: "Prop", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", status: "Ready", userId: creatorId, createdAt: Date.now() },
        { name: "Cyber Bike", type: "Prop", img: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400", status: "Ready", userId: directorId, createdAt: Date.now() },
      ];
      for (const el of elements) {
        await ctx.db.insert("aielements", el);
      }
    }

    // 5. Seed missions for current users if empty
    const allUsers = await ctx.db.query("users").collect();
    for (const user of allUsers) {
        const userMissions = await ctx.db.query("missions").withIndex("by_userId", q => q.eq("userId", user._id)).collect();
        if (userMissions.length === 0) {
            const initialMissions = [
                { title: "First Creation", total: 1, progress: 0, reward: 100, type: "Credits", userId: user._id },
                { title: "Daily Login", total: 1, progress: 0, reward: 50, type: "Credits", userId: user._id },
                { title: "Social Butterfly", total: 5, progress: 0, reward: 200, type: "Credits", userId: user._id }
            ];
            for(const m of initialMissions) await ctx.db.insert("missions", m);
        }
    }
  }
});
