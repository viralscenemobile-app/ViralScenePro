import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, PlusCircle, Zap } from 'lucide-react';

const mockVideos = [
  {
    id: 1,
    url: 'https://cdn.pixabay.com/video/2021/08/04/83897-584742461_large.mp4',
    author: '@cyber_dreamer',
    description: 'Neon rain in neo-tokyo. Generated with Kling 3.0 Omni 🌧️ #cyberpunk #neon',
    likes: '1.2M',
    comments: '4,032',
    shares: '12K'
  },
  {
    id: 2,
    url: 'https://cdn.pixabay.com/video/2020/05/25/40141-427021799_large.mp4',
    author: '@nature_ai',
    description: 'Bioluminescent forest scene. Text-to-video workflow. #nature #aiart',
    likes: '840K',
    comments: '1,200',
    shares: '5K'
  }
];

export default function Feed() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Simplified scroll handling for mock
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const index = Math.round(target.scrollTop / target.clientHeight);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="w-full h-full relative bg-black snap-y snap-mandatory overflow-y-scroll no-scrollbar" onScroll={handleScroll}>
      
      {/* Top overlay nav */}
      <div className="absolute top-0 w-full z-10 flex justify-center py-6 px-4 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button className="text-gray-400 font-semibold text-lg drop-shadow-md">Following</button>
          <button className="text-white font-bold text-lg drop-shadow-md border-b-2 border-white pb-1">For You</button>
        </div>
      </div>

      {mockVideos.map((video, index) => (
        <div key={video.id} className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-base">
          {/* Video Player Mock */}
          <video 
            src={video.url}
            className="w-full h-full object-cover"
            autoPlay={index === currentIndex}
            loop
            muted // muted for autoplay to work without interaction in many browsers
            playsInline
          />

          {/* Right Action Bar */}
          <div className="absolute right-4 bottom-24 md:bottom-32 flex flex-col items-center gap-6 z-20">
            <div className="relative">
              <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-white overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt="author" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-white rounded-full p-0.5">
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors active:scale-95">
                <Heart className="w-5 h-5 text-white group-hover:text-accent group-hover:fill-accent transition-all" />
              </div>
              <span className="text-xs font-semibold drop-shadow-md">{video.likes}</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors active:scale-95">
                 <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold drop-shadow-md">{video.comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors active:scale-95">
                 <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold drop-shadow-md">{video.shares}</span>
            </button>

             <button className="flex flex-col items-center gap-1 mt-2 group">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 transition-all">
                 <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-[10px] uppercase font-bold drop-shadow-md text-white mt-1">Recreate</span>
            </button>
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-4 left-4 right-20 md:bottom-12 z-20 pb-16 md:pb-0">
            <h3 className="text-lg font-bold mb-1 drop-shadow-md">{video.author}</h3>
            <p className="text-sm line-clamp-2 drop-shadow-md">{video.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-black/50 backdrop-blur-sm text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                <Zap className="w-3 h-3 text-accent" /> Kling 3.0
              </span>
              <span className="bg-black/50 backdrop-blur-sm text-xs px-2 py-1 rounded-md border border-white/10">
                AI Created
              </span>
            </div>
          </div>
          
          {/* Gradient overlay for readability */}
          <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
