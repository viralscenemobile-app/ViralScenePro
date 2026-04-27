import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, PlusCircle, Zap, BookOpen, Bell, Music, UserPlus, Wand2 } from 'lucide-react';
import CommentsOverlay from './CommentsOverlay';

const mockVideos = [
  { 
    id: 1, 
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800', 
    author: 'cyber_artist', 
    desc: 'The final sunset on Neo-Tokyo. Generated with Flux v1.1 #cyberpunk #ai',
    likes: '124K',
    comments: '1.2K',
    music: 'Neon Dreams - SynthWave Original'
  },
  { 
    id: 2, 
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 
    author: 'future_vision', 
    desc: 'Neural link established. Witness the evolution. #neuralink #future',
    likes: '89K',
    comments: '840',
    music: 'Deep Signal - Void Records'
  },
];

const mockStories = [
  { id: 's1', title: 'Neon Gods', author: 'cyber_writer', genre: 'Sci-Fi', likes: '1.2M', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800' },
  { id: 's2', title: 'The Silent Sea', author: 'ocean_drifter', genre: 'Fantasy', likes: '450K', image: 'https://images.unsplash.com/photo-1518837691465-385208f02901?w=800' },
  { id: 's3', title: 'Crimson Sky', author: 'mars_colonist', genre: 'Thriller', likes: '230K', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800' },
  { id: 's4', title: 'Cosmic Drift', author: 'stardust_writer', genre: 'Sci-Fi', likes: '89K', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800' },
];

interface FeedProps {
  onShowNotifications: () => void;
}

export default function Feed({ onShowNotifications }: FeedProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [feedTab, setFeedTab] = React.useState<'following' | 'foryou' | 'stories'>('foryou');
  const [showComments, setShowComments] = React.useState<{show: boolean, count: string}>({show: false, count: '0'});

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const newIndex = Math.round(scrollPos / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="w-full h-full bg-base overflow-hidden flex flex-col">
      <div className="w-full h-full relative bg-base snap-y snap-mandatory overflow-y-scroll no-scrollbar" onScroll={feedTab !== 'stories' ? handleScroll : undefined}>
        
        {/* Top overlay nav */}
        <div className="absolute top-0 w-full z-10 flex items-center justify-between py-6 px-6 pointer-events-none">
          {/* Left spacer to help center the middle pill */}
          <div className="flex-1 hidden md:block"></div>

          <div className="flex gap-4 pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-lg">
            <button onClick={() => setFeedTab('following')} className={`font-bold text-sm transition-colors ${feedTab === 'following' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Following</button>
            <button onClick={() => setFeedTab('foryou')} className={`font-bold text-sm transition-colors ${feedTab === 'foryou' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>For You</button>
            <button onClick={() => setFeedTab('stories')} className={`font-bold text-sm transition-colors ${feedTab === 'stories' ? 'text-accent' : 'text-gray-400 hover:text-white'}`}>Stories</button>
          </div>
          
          <div className="flex-1 flex justify-end pointer-events-auto">
            <button 
              onClick={onShowNotifications}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg active:scale-95 group relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-black" />
            </button>
          </div>
        </div>

        {feedTab !== 'stories' ? (
          mockVideos.map((video, idx) => (
            <div key={video.id} className="w-full h-full snap-start relative group flex justify-center bg-black">
              <div className="h-full w-full max-w-[500px] relative">
                <img src={video.url} className="w-full h-full object-cover opacity-90 shadow-2xl" alt="Video Content" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Sidebar Actions */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
                   {/* ... action buttons ... */}
                </div>
              </div>
              
              {/* Actions & Info pinned to the centered container container */}
              <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="h-full w-full max-w-[500px] relative pointer-events-auto">
                    {/* Sidebar Actions */}
                    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
                        <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full border-2 border-white mb-2 overflow-hidden bg-white/10 relative">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt="Avatar" />
                            <button className="absolute -bottom-0.5 -right-0.5 bg-accent rounded-full p-0.5 border-2 border-black">
                            <PlusCircle className="w-3 h-3 text-white" />
                            </button>
                        </div>
                        </div>

                        <button className="flex flex-col items-center gap-0.5 group/btn drop-shadow-md">
                        <div className="p-2 transition-all active:scale-90">
                            <Heart className="w-7 h-7 text-white group-hover/btn:text-red-500 fill-transparent group-hover/btn:fill-red-500 drop-shadow-lg" />
                        </div>
                        <span className="text-[10px] font-bold text-white shadow-sm drop-shadow-md">{video.likes}</span>
                        </button>

                        <button onClick={() => setShowComments({show: true, count: video.comments})} className="flex flex-col items-center gap-0.5 group/btn drop-shadow-md">
                        <div className="p-2 transition-all active:scale-90">
                            <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
                        </div>
                        <span className="text-[10px] font-bold text-white shadow-sm drop-shadow-md">{video.comments}</span>
                        </button>

                        <button className="p-2 transition-all group/btn drop-shadow-md">
                        <Share2 className="w-7 h-7 text-white drop-shadow-lg" />
                        </button>

                        <button className="p-2 transition-all group/remix relative overflow-hidden drop-shadow-md">
                        <Wand2 className="w-7 h-7 text-accent group-hover/remix:text-white drop-shadow-lg" />
                        <div className="absolute inset-0 bg-white/20 scale-0 group-hover/remix:scale-100 transition-transform duration-500 rounded-full" />
                        </button>

                        <div className="w-10 h-10 rounded-full border-4 border-white/20 overflow-hidden">
                        <div className="w-full h-full bg-accent flex items-center justify-center p-1.5 animate-spin-slow">
                            <Music className="text-white w-full h-full" />
                        </div>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-6 left-6 right-20 z-10 space-y-4">
                        <div className="flex flex-col gap-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg">@{video.author}</h3>
                            <button className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/20 transition-all flex items-center gap-1">
                                <UserPlus className="w-3 h-3" /> Follow
                            </button>
                        </div>
                        <p className="text-sm line-clamp-2 max-w-md leading-relaxed">{video.desc}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                        <div className="bg-accent/20 backdrop-blur-md text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 border border-accent/30 font-bold text-white shadow-2xl">
                            <Zap className="w-4 h-4" /> Series Studio
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white font-bold bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                            <Music className="w-3 h-3 text-accent" />
                            <span className="truncate max-w-[120px]">{video.music}</span>
                        </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full p-6 pt-28 md:pt-32 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8 max-w-7xl mx-auto content-start">
             {mockStories.map((story) => (
               <div key={story.id} className="flex flex-col gap-3 group animate-in fade-in zoom-in duration-500">
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl transition-all group-hover:scale-[1.02] active:scale-95">
                    <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-accent border border-accent/20">
                      {story.genre}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-bold text-white text-lg leading-tight mb-1">{story.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white/20 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">@{story.author}</span>
                      </div>
                    </div>
                  </div>
               </div>
             ))}
             <button className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all">
                <BookOpen className="w-10 h-10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Create Story</span>
             </button>
          </div>
        )}
      </div>

      <CommentsOverlay 
        isOpen={showComments.show} 
        onClose={() => setShowComments({show: false, count: '0'})} 
        commentsCount={showComments.count} 
      />
    </div>
  );
}
