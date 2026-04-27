import React from 'react';
import { Search as SearchIcon, Filter, TrendingUp, Hash, Plus, Sparkles, UserCheck, Flame, ChevronRight } from 'lucide-react';

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

const mockCreators = [
  { id: 1, name: 'AI.Maestro', subs: '450K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maestro' },
  { id: 2, name: 'Synth.Queen', subs: '890K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen' },
  { id: 3, name: 'Void.Director', subs: '120K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Void' },
];

export default function Explore() {
  return (
    <div className="w-full h-full bg-base overflow-y-auto no-scrollbar md:pb-0">
      <div className="sticky top-0 bg-base/80 backdrop-blur-xl z-10 px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
           <div>
             <h1 className="text-3xl font-bold font-sans tracking-tight">Explore</h1>
             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Discover the next frontier of AI cinema.</p>
           </div>
           <div className="hidden lg:flex items-center gap-2 text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
              <Sparkles className="w-3.5 h-3.5" /> 142 New Projects Today
           </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search content, creators, or elements..." 
              className="w-full bg-white/5 border border-white/10 text-white rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all font-sans text-xs placeholder-gray-600 shadow-inner"
            />
          </div>
          <button className="w-[48px] h-[48px] bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-gray-400 hover:text-white shrink-0">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 pb-24 pt-2">
        {/* Daily Challenges */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                   <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                   <h2 className="text-xl font-bold font-sans tracking-tight">Active Challenges</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Win up to 500 Credits</p>
                </div>
             </div>
             <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-all group">
               See all <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockChallenges.map(challenge => (
              <div key={challenge.id} className="h-[200px] relative rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-accent/40 shadow-2xl transition-all">
                <img src={challenge.img} alt={challenge.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-7 right-7 flex justify-between items-end">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">LIVE</span>
                        <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.1em]">{challenge.participants} Joined</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{challenge.title}</h3>
                      <p className="text-[11px] text-gray-400 font-medium tracking-wide mt-1">{challenge.desc}</p>
                   </div>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button className="bg-white text-black font-bold text-[10px] px-6 py-2.5 rounded-full shadow-2xl uppercase tracking-widest active:scale-95 transition-all">
                    Enter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-12 lg:gap-16">
            {/* Trending Tags */}
            <div>
              <h2 className="text-xl font-bold mb-6 font-sans tracking-tight">Trending Tags</h2>
              <div className="grid grid-cols-1 gap-3">
                  {mockTrending.map(tag => (
                   <div key={tag.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 flex items-center justify-between hover:bg-white/[0.06] hover:border-white/10 active:scale-[0.98] transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                          <Hash className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                           <p className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">#{tag.tag}</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{tag.count}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                   </div>
                 ))}
              </div>
            </div>

            {/* Trending Creators */}
            <div>
              <h2 className="text-xl font-bold mb-6 font-sans tracking-tight">Top Creators</h2>
              <div className="grid grid-cols-1 gap-3">
                  {mockCreators.map(creator => (
                   <div key={creator.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-4 flex items-center justify-between hover:bg-white/[0.06] transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <img src={creator.avatar} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-accent transition-colors" alt="" />
                        <div>
                           <p className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{creator.name}</p>
                           <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-0.5">{creator.subs} Subscribers</p>
                        </div>
                      </div>
                      <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] px-5 py-2 rounded-full border border-white/10 transition-all active:scale-95 uppercase tracking-widest">
                         Follow
                      </button>
                   </div>
                 ))}
              </div>
            </div>
        </div>

        {/* Viral Elements */}
        <div className="mt-20 mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold font-sans tracking-tight">Viral Elements</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Community trained assets</p>
            </div>
            <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest border-b border-white/10 pb-1">Marketplace &rarr;</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {[
                { name: 'Mecha Samurai', creator: '@shadow_ops', clones: '2.3k', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300' },
                { name: 'Crystal Orb', creator: '@vfx_pro', clones: '1.5k', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300' },
                { name: 'Cyber Cat', creator: '@future_paws', clones: '4.8k', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300' },
                { name: 'Plasma Blade', creator: '@weapon_master', clones: '900', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300' },
                { name: 'Void Walker', creator: '@dark_ai', clones: '1.2k', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=300' }
              ].map((el, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square rounded-[2rem] overflow-hidden relative border border-white/5 bg-white/5 mb-4 transition-all group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                      <img src={el.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="" />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-accent text-white">
                        <Plus className="w-5 h-5" />
                      </div>
                  </div>
                  <div className="px-2">
                      <h4 className="font-bold text-sm text-gray-200 group-hover:text-white tracking-tight">{el.name}</h4>
                      <div className="flex items-center justify-between mt-1.5 opacity-60">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{el.creator}</span>
                        <div className="flex items-center gap-1">
                           <UserCheck className="w-3 h-3 text-accent" />
                           <span className="text-[10px] text-accent font-bold uppercase">{el.clones}</span>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Featured Content Area */}
        <div className="mt-20 mb-12">
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                <Sparkles className="w-7 h-7 text-accent" />
             </div>
             <div>
                <h2 className="text-2xl font-bold font-sans tracking-tight">Hall of Fame</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Legendary AI Masterpieces</p>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="aspect-[3/4] rounded-[2.5rem] overflow-hidden relative cursor-pointer group shadow-2xl border border-white/5">
                <img src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80&sig=${i + 200}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                <div className="absolute inset-x-0 bottom-0 p-6 pt-12 bg-gradient-to-t from-black via-black/20 to-transparent">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white shadow-sm">Featured</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
