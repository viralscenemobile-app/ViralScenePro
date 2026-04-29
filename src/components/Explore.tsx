import React, { useContext } from 'react';
import { Search as SearchIcon, Filter, TrendingUp, Hash, Plus, Sparkles, UserCheck, Flame, ChevronRight, UserPlus, Check } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function Explore() {
  const { convexUserId } = useContext(AuthContext);
  const recentVideos = useQuery(api.videos.getTopVideos);
  const challenges = useQuery(api.videos.getChallenges);
  const trending = useQuery(api.videos.getTrendingTags);
  const creators = useQuery(api.videos.getTopCreators);
  
  const followsList = useQuery(api.users.getFollowsList, 
    convexUserId ? { userId: convexUserId as any } : "skip"
  );
  
  const participatingChallenges = useQuery(api.videos.getParticipatingChallenges,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const toggleFollow = useMutation(api.users.toggleFollow);
  const joinChallenge = useMutation(api.videos.joinChallenge);

  const handleFollow = async (targetId: string) => {
    if (!convexUserId) return;
    try {
      await toggleFollow({ followerId: convexUserId as any, followedId: targetId as any });
    } catch (e) {
      console.error("Follow failed", e);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!convexUserId) return;
    try {
      await joinChallenge({ challengeId: challengeId as any, userId: convexUserId as any });
    } catch (e) {
      console.error("Join challenge failed", e);
    }
  };

  const viralElements = useQuery(api.users.getViralElements);

  if (recentVideos === undefined || challenges === undefined || trending === undefined || creators === undefined || viralElements === undefined || followsList === undefined || participatingChallenges === undefined) {
    return <div className="p-10 text-center text-gray-500">Loading explore page...</div>;
  }

  return (
    <div className="w-full h-full bg-black overflow-y-auto no-scrollbar md:pb-0">
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-20 px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 px-1">
           <div>
             <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white leading-none mb-1">Explore</h1>
             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">The next frontier of AI cinema.</p>
           </div>
           <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest bg-[#2e1065] px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> Trending Community Elements
           </div>
        </div>
        
        <div className="relative group w-full">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search content, creators, or elements..." 
            className="w-full bg-[#1a1a1a] text-white rounded-full py-4.5 pl-14 pr-8 focus:outline-none focus:bg-[#222] transition-all font-sans text-sm placeholder-gray-600 shadow-xl border border-white/5 focus:border-white/10"
          />
        </div>
      </div>

      <div className="px-6 pb-32 pt-2 max-w-7xl mx-auto">
        {/* Daily Challenges */}
        <div className="mb-16">
          {challenges.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8 px-2">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-inner">
                       <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                       <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white">Active Challenges</h2>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Participate and Win Credits</p>
                    </div>
                 </div>
                 <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-all group">
                   See all <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                  <div key={challenge._id} className="h-[220px] relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl transition-all">
                    <img src={challenge.img || "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800"} alt={challenge.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-orange-600 text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">{challenge.status}</span>
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{challenge.participants} Joined</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{challenge.title}</h3>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">{challenge.desc}</p>
                       </div>
                    </div>
                    <div className="absolute top-8 right-8 transition-all transform group-hover:translate-y-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleJoinChallenge(challenge._id); }}
                        className={`font-bold text-[10px] px-8 py-3 rounded-full shadow-2xl uppercase tracking-[0.2em] active:scale-95 transition-all text-white border flex items-center gap-2
                          ${participatingChallenges.includes(challenge._id) ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-white hover:bg-gray-100 text-black'}`}
                      >
                        {participatingChallenges.includes(challenge._id) ? <><Check className="w-3.5 h-3.5" /> Entered</> : 'Enter Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Trending Tags */}
            <div className="px-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6 block">Trending Tags</label>
              <div className="grid grid-cols-1 gap-4">
                  {trending.map(tag => (
                   <div key={tag._id} className="bg-[#1a1a1a] rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-[#222] transition-all cursor-pointer group shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-inner">
                          <Hash className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                           <p className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">#{tag.tag}</p>
                           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">{tag.count}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 text-gray-600 group-hover:text-white group-hover:bg-accent transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Trending Creators */}
            <div className="px-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6 block">Top Creators</label>
              <div className="grid grid-cols-1 gap-4">
                  {creators.map(creator => (
                   <div key={creator._id} className="bg-[#1a1a1a] rounded-[1.5rem] p-4 flex items-center justify-between hover:bg-[#222] transition-all cursor-pointer group shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={creator.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + creator.username} className="w-14 h-14 rounded-full border-2 border-white/5 group-hover:border-accent transition-all object-cover bg-black" alt="" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#1a1a1a] shadow-sm" />
                        </div>
                        <div>
                           <p className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{creator.displayName || creator.username}</p>
                           <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-0.5">{creator.followersCount} Subscribers</p>
                        </div>
                      </div>
                      {creator._id !== convexUserId && (
                        <button 
                          onClick={() => handleFollow(creator._id)}
                          className="bg-black hover:bg-black/60 text-white font-bold text-[10px] px-6 py-2.5 rounded-full transition-all active:scale-95 uppercase tracking-widest leading-none shadow-inner border border-white/5 flex items-center gap-1"
                        >
                          {followsList.includes(creator._id) ? <><UserCheck className="w-3 h-3" /> Following</> : <><UserPlus className="w-3 h-3" /> Follow</>}
                        </button>
                      )}
                   </div>
                 ))}
              </div>
            </div>
        </div>

        {/* Viral Elements */}
        <div className="mt-24 mb-24 px-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mb-1">Viral Elements</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Community trained assets</p>
            </div>
            <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-2 group transition-colors">
              Marketplace <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
              {viralElements.map((el, i) => (
                <div key={el._id} className="group cursor-pointer">
                  <div className="aspect-square rounded-[2rem] overflow-hidden relative bg-[#1a1a1a] mb-5 transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] shadow-xl">
                      <img src={el.img || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[#2e1065] text-white shadow-lg">
                        <Plus className="w-5 h-5" />
                      </div>
                  </div>
                  <div className="px-3">
                      <h4 className="font-bold text-sm text-gray-200 group-hover:text-white tracking-tight leading-none mb-1.5 line-clamp-1">{el.name}</h4>
                      <div className="flex items-center justify-between opacity-60">
                         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest line-clamp-1 mr-2">{el.author?.displayName || el.author?.username || 'Creator'}</span>
                         <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <span className="text-[9px] text-accent font-bold uppercase">{el.type}</span>
                         </div>
                      </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Featured Content Area */}
        <div className="mt-20 px-1 border-t border-white/5 pt-20">
          <div className="flex items-center gap-5 mb-12">
             <div className="w-14 h-14 bg-black rounded-3xl flex items-center justify-center shadow-inner">
                <Sparkles className="w-7 h-7 text-accent" />
             </div>
             <div>
                <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mb-1">Hall of Fame</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Legendary AI Masterpieces</p>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recentVideos.length > 0 ? recentVideos.map(video => (
              <div key={video._id} className="aspect-[3/4] rounded-[2.5rem] overflow-hidden relative cursor-pointer group shadow-2xl bg-[#1a1a1a]">
                <img src={video.thumbnailUrl || video.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                <div className="absolute inset-x-0 bottom-0 p-8 pt-16 bg-gradient-to-t from-black via-black/20 to-transparent">
                  <div className="flex gap-2 items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2e1065] shadow-[0_0_10px_rgba(124,58,237,0.5)] animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white opacity-80">{video.author?.displayName || video.author?.username || 'Creator'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                No videos available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
