import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, PlusCircle, Zap, BookOpen, Bell, Music, UserPlus, UserCheck, Wand2 } from 'lucide-react';
import CommentsOverlay from './CommentsOverlay';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

interface FeedProps {
  onShowNotifications: () => void;
  onOpenTool?: (toolId: string) => void;
}

export default function Feed({ onShowNotifications, onOpenTool }: FeedProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [feedTab, setFeedTab] = React.useState<'following' | 'foryou' | 'stories'>('foryou');
  const [showComments, setShowComments] = React.useState<{show: boolean, count: string, videoId?: string}>({show: false, count: '0'});

  const { convexUserId } = useContext(AuthContext);
  const forYouVideos = useQuery(api.videos.getFeed, { limit: 20 });
  const followingVideos = useQuery(api.users.getFollowingFeed, 
    convexUserId ? { userId: convexUserId as any, limit: 20 } : "skip"
  );
  
  const stories = useQuery(api.videos.getStories);
  
  if (forYouVideos === undefined || followingVideos === undefined || stories === undefined) {
    return <div className="p-10 text-center text-gray-500">Loading feed...</div>;
  }

  const videos = feedTab === 'following' ? followingVideos : forYouVideos;

  const toggleLike = useMutation(api.videos.toggleLike);
  const toggleFollow = useMutation(api.users.toggleFollow);
  
  const followsList = useQuery(api.users.getFollowsList, 
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const newIndex = Math.round(scrollPos / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!convexUserId) return;
    try {
      await toggleLike({ videoId: videoId as any, userId: convexUserId as any });
    } catch (e) {
      console.error("Like failed", e);
    }
  };

  const handleFollow = async (targetId: string) => {
    if (!convexUserId) return;
    try {
      await toggleFollow({ followerId: convexUserId as any, followedId: targetId as any });
    } catch (e) {
      console.error("Follow failed", e);
    }
  };

  return (
    <div className="w-full h-full bg-base overflow-hidden flex flex-col">
      <div className="w-full h-full relative bg-base snap-y snap-mandatory overflow-y-scroll no-scrollbar" onScroll={feedTab !== 'stories' ? handleScroll : undefined}>
        
        {/* Top overlay nav ... */}
        <div className="absolute top-0 w-full z-10 flex items-center justify-between py-6 px-6 pointer-events-none">
          {/* Left spacer to help center the middle pill */}
          <div className="flex-1 hidden md:block"></div>

          <div className="flex gap-6 pointer-events-auto items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2">
            <button 
              onClick={() => setFeedTab('following')} 
              className={`font-semibold text-[17px] transition-all relative ${feedTab === 'following' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
            >
              Following
              {feedTab === 'following' && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-white rounded-full" />}
            </button>
            <button 
              onClick={() => setFeedTab('foryou')} 
              className={`font-semibold text-[17px] transition-all relative ${feedTab === 'foryou' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
            >
              For You
              {feedTab === 'foryou' && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-white rounded-full" />}
            </button>
            <button 
              onClick={() => setFeedTab('stories')} 
              className={`font-semibold text-[17px] transition-all relative ${feedTab === 'stories' ? 'text-white' : 'text-white/70 hover:text-white/90'}`}
            >
              Stories
              {feedTab === 'stories' && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-white rounded-full" />}
            </button>
          </div>
          
          <div className="flex-1 flex justify-end pointer-events-auto">
            <button 
              onClick={onShowNotifications}
              className="p-3 bg-black rounded-full text-white hover:bg-[#2a2a2a] transition-all shadow-lg active:scale-95 group relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-black" />
            </button>
          </div>
        </div>

        {feedTab !== 'stories' ? (
          videos.length > 0 ? videos.map((video, idx) => (
            <div key={video._id} className="w-full h-full snap-start relative group flex justify-center bg-black">
              <div className="h-full w-full max-w-[500px] relative">
                {video.url ? (
                  <video src={video.url} className="w-full h-full object-cover shadow-2xl" autoPlay loop muted playsInline />
                ) : (
                  <img src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'} className="w-full h-full object-cover opacity-90 shadow-2xl" alt="Video Content" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                {/* Actions & Info pinned to the centered container container */}
                <div className="absolute inset-0 flex justify-center pointer-events-none">
                  <div className="h-full w-full max-w-[500px] relative pointer-events-auto">
                      {/* Sidebar Actions */}
                      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
                          <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border-2 border-white mb-2 overflow-hidden bg-white/10 relative">
                              <img src={video.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author?.username || 'user'}`} alt="Avatar" />
                              <button className="absolute -bottom-0.5 -right-0.5 bg-accent rounded-full p-0.5 border-2 border-black">
                              <PlusCircle className="w-3 h-3 text-white" />
                              </button>
                          </div>
                          </div>

                          <button onClick={() => handleLike(video._id)} className="flex flex-col items-center gap-0.5 group/btn drop-shadow-md">
                          <div className="p-2 transition-all active:scale-90">
                              <Heart className="w-7 h-7 text-white group-hover/btn:text-red-500 fill-transparent group-hover/btn:fill-red-500 drop-shadow-lg" />
                          </div>
                          <span className="text-[10px] font-bold text-white shadow-sm drop-shadow-md">{video.likes}</span>
                          </button>

                          <button onClick={() => setShowComments({show: true, count: video.comments.toString(), videoId: video._id})} className="flex flex-col items-center gap-0.5 group/btn drop-shadow-md">
                          <div className="p-2 transition-all active:scale-90">
                              <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
                          </div>
                          <span className="text-[10px] font-bold text-white shadow-sm drop-shadow-md">{video.comments}</span>
                          </button>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(window.location.origin);
                              alert("Link copied to clipboard!");
                            }} 
                            className="p-2 transition-all group/btn drop-shadow-md hover:scale-110 active:scale-95"
                          >
                          <Share2 className="w-7 h-7 text-white drop-shadow-lg" />
                          </button>

                          <button onClick={() => onOpenTool?.('recreate')} className="p-2 transition-all group/remix relative overflow-hidden drop-shadow-md">
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
                              <h3 className="font-bold text-lg">@{video.author?.username || 'unknown'}</h3>
                              {video.author?._id !== convexUserId && (
                                <button 
                                  onClick={() => handleFollow(video.author!._id)}
                                  className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 hover:bg-white/20 transition-all flex items-center gap-1"
                                >
                                    {followsList.includes(video.author!._id) ? <><UserCheck className="w-3 h-3" /> Following</> : <><UserPlus className="w-3 h-3" /> Follow</>}
                                </button>
                              )}
                          </div>
                          <p className="text-sm line-clamp-2 max-w-md leading-relaxed">{video.desc}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                          <div className="bg-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold text-white shadow-lg">
                              <Zap className="w-4 h-4" /> Series Studio
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white font-bold bg-black px-3 py-1.5 rounded-xl border border-[#1a1a1a]">
                              <Music className="w-3 h-3 text-accent" />
                              <span className="truncate max-w-[120px]">{video.music || 'Original Audio'}</span>
                          </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No videos found in feed.
            </div>
          )
        ) : (
          <div className="w-full h-full p-6 pt-28 md:pt-32 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8 max-w-7xl mx-auto content-start">
             {stories.map((story) => (
               <div key={story._id} className="flex flex-col gap-3 group animate-in fade-in zoom-in duration-500">
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl transition-all group-hover:scale-[1.02] active:scale-95 bg-[#1a1a1a]">
                    <img src={story.imageUrl || "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={story.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-[#2e1065] px-3 py-1 rounded-full text-[10px] font-bold text-white">
                      {story.genre}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-bold text-white text-lg leading-tight mb-1">{story.title}</p>
                      <div className="flex items-center gap-2">
                        <img src={story.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author?.username || 'user'}`} className="w-5 h-5 rounded-full bg-black" alt="" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">@{story.author?.username || 'Writer'}</span>
                      </div>
                    </div>
                  </div>
               </div>
             ))}
             <button onClick={() => onOpenTool?.('novel')} className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-white hover:bg-black hover:border-black transition-all">
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
        videoId={showComments.videoId}
      />
    </div>
  );
}
