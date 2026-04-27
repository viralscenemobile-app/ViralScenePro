import React from 'react';
import { Search as SearchIcon, Filter, TrendingUp, Hash } from 'lucide-react';

const mockChallenges = [
  { id: 1, title: 'Neon Nights', desc: 'Cyberpunk aesthetics', participants: '12K', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80' },
  { id: 2, title: 'Anime Magic', desc: 'Studio Ghibli style', participants: '8.5K', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80' },
];

const mockTrending = [
  { id: 1, tag: 'KlingOmni3', count: '1.2M views' },
  { id: 2, tag: 'SciFiShort', count: '800K views' },
  { id: 3, tag: 'AIVoiceClone', count: '450K views' },
  { id: 4, tag: 'MyElement', count: '320K views' },
];

export default function Explore() {
  return (
    <div className="w-full h-full bg-black overflow-y-auto no-scrollbar md:pb-0">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 px-4 py-4 md:py-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search content, creators, or elements..." 
              className="w-full bg-white/5 border border-border text-white rounded-2xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all font-sans"
            />
          </div>
          <button className="w-11 h-11 bg-white/5 border border-border rounded-2xl flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
            <Filter className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-20 md:pb-6">
        {/* Daily Challenges */}
        <div className="mb-8 mt-2">
          <div className="flex items-center gap-2 mb-4">
             <TrendingUp className="w-6 h-6 text-accent" />
             <h2 className="text-xl font-bold">Daily Challenges</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {mockChallenges.map(challenge => (
              <div key={challenge.id} className="min-w-[280px] h-[160px] relative rounded-3xl overflow-hidden group cursor-pointer border border-border hover:border-accent/50 transition-colors">
                <img src={challenge.img} alt={challenge.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                   <h3 className="text-xl font-bold text-white mb-1 shadow-sm">{challenge.title}</h3>
                   <div className="flex justify-between items-center text-xs text-gray-300 font-medium">
                     <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg">{challenge.desc}</span>
                     <span>{challenge.participants} joins</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 font-sans">Trending Now</h2>
          <div className="grid grid-cols-2 gap-3">
              {mockTrending.map(tag => (
               <div key={tag.id} className="bg-white/5 border border-border rounded-2xl p-4 flex flex-col hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-1 text-white">
                    <Hash className="w-4 h-4 text-accent" />
                    <span className="font-bold">{tag.tag}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{tag.count}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Explore Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4 font-sans">Featured Content</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-[3/4] bg-panel rounded-2xl overflow-hidden relative cursor-pointer group border border-border">
                <img src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80&sig=${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] uppercase font-bold text-gray-200">Video</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
