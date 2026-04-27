import React from 'react';
import { Settings, Award, Flame, Zap, Star } from 'lucide-react';

export default function Profile() {
  return (
    <div className="w-full h-full bg-black overflow-y-auto no-scrollbar md:pb-0">
      {/* Header Area */}
      <div className="px-4 py-8 bg-panel border-b border-border">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-[3px] border-accent overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.4)]">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full bg-white object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-sans">Felix</h1>
              <p className="text-gray-400 font-medium">@felix_creates</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent" /> Rising
                </span>
              </div>
            </div>
          </div>
          <button className="p-2 border border-border bg-white/5 rounded-full hover:bg-white/10 transition-colors">
             <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around bg-black/40 rounded-2xl py-4 border border-border mb-6 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white">12.5K</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Followers</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white">45</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Posts</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white">1.2M</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Likes</span>
          </div>
        </div>

        {/* Gamification Snippets */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-border flex items-center gap-3 backdrop-blur-sm">
            <div className="bg-orange-500/10 border border-orange-500/20 p-2 text-orange-500 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none mb-1 shadow-sm">12 Days</div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Streak</div>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-border flex items-center gap-3 backdrop-blur-sm">
            <div className="bg-accent/10 border border-accent/20 p-2 text-accent rounded-xl shadow-[0_0_10px_rgba(124,58,237,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none mb-1 shadow-sm">4.5K XP</div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Next: 10K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-1 pb-20">
        <div className="flex border-b border-border mb-1">
          <button className="flex-1 py-3 text-center text-sm font-bold border-b-2 border-white">Posts</button>
          <button className="flex-1 py-3 text-center text-sm font-bold text-gray-500 border-b-2 border-transparent">Liked</button>
          <button className="flex-1 py-3 text-center text-sm font-bold text-gray-500 border-b-2 border-transparent">Series</button>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
             <div key={i} className="aspect-[3/4] bg-panel relative group cursor-pointer overflow-hidden rounded-md">
               <img src={`https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&q=80&sig=${i+10}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
               <div className="absolute bottom-1 left-2 flex items-center gap-1 opacity-90">
                 <Zap className="w-3 h-3 text-white fill-white shadow-sm" />
                 <span className="text-[11px] text-white font-bold shadow-sm">{Math.floor(Math.random() * 900) + 10}K</span>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
