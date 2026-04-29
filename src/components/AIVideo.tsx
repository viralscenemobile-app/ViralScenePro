import React, { useContext } from 'react';
import { Video as VideoIcon, Image as ImageIcon, Sparkles, SlidersHorizontal, Ratio, ChevronDown, Plus, Music, X } from 'lucide-react';
import AudioLibrary from './AudioLibrary';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function AIVideo() {
  const [prompt, setPrompt] = React.useState('');
  const [aspectRatio, setAspectRatio] = React.useState('16:9 Widescreen');
  const [resolution, setResolution] = React.useState('1080p Full HD');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedVideo, setGeneratedVideo] = React.useState<string | null>(null);
  const [audioTrack, setAudioTrack] = React.useState<string | null>(null);
  const [showAudioLibrary, setShowAudioLibrary] = React.useState(false);
  const { user, convexUserId } = useContext(AuthContext);

  const userElements = useQuery(
    api.users.getElements,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const createVideoTask = useMutation(api.videos.createVideoTask);
  const generateVideo = useAction(api.videos.generateVideo);
  const [generatingVideoId, setGeneratingVideoId] = React.useState<string | null>(null);

  const currentVideo = useQuery(
    api.videos.getVideo,
    generatingVideoId ? { videoId: generatingVideoId as any } : "skip"
  );

  React.useEffect(() => {
    if (currentVideo?.status === 'completed' && currentVideo.url) {
      setGeneratedVideo(currentVideo.url);
      setIsGenerating(false);
      setGeneratingVideoId(null);
    }
  }, [currentVideo]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user || !convexUserId) return;
    setIsGenerating(true);
    setGeneratedVideo(null);
    try {
      const videoId = await createVideoTask({
        userId: user.uid,
        authorId: convexUserId as any,
        prompt: prompt,
        desc: prompt,
        music: audioTrack || "Original Audio",
        aspectRatio,
        resolution
      });
      setGeneratingVideoId(videoId as string);
      await generateVideo({ videoId: videoId as any, prompt });
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div className="text-center md:text-left">
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">AI Video</h2>
              <p className="text-gray-400 text-xs">Generate 15s HD videos. Add an image reference to guide the generation.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Generation Area */}
            {(isGenerating || generatedVideo) && (
              <div className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center relative transition-all duration-500">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-black border-t-accent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-gray-300 animate-pulse uppercase tracking-widest">Rendering...</p>
                  </div>
                ) : (
                  generatedVideo && (
                    <video src={generatedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  )
                )}
              </div>
            )}

            {/* Prompt */}
            <div className="flex flex-col gap-2">
               <div className="relative bg-[#1a1a1a] rounded-[1.5rem] p-5 shadow-lg">
                 <textarea
                   placeholder="Describe what you want to see..."
                   className="w-full bg-transparent text-[16px] focus:outline-none min-h-[120px] resize-none text-white placeholder-gray-600 transition-colors"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="flex justify-between items-center mt-3 pt-3">
                    <button className="text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors">
                      <Sparkles className="w-4 h-4" /> Enhance Prompt
                    </button>
                    <span className="text-[10px] text-gray-500 font-bold">{prompt.length} / 500</span>
                 </div>
               </div>
            </div>

            {/* Structured Configuration Panel */}
            <div className="flex flex-col gap-6 relative">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" /> 
                  <h3 className="font-bold text-gray-200 text-xs uppercase tracking-widest">Configuration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Aspect Ratio</label>
                    <div className="relative">
                      <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full bg-[#1a1a1a] rounded-full px-5 py-3 text-xs font-bold text-white appearance-none focus:outline-none transition-all hover:bg-[#2a2a2a] cursor-pointer shadow-lg">
                        <option>16:9 Widescreen</option>
                        <option>9:16 Vertical</option>
                        <option>1:1 Square</option>
                        <option>21:9 Cinematic</option>
                      </select>
                      <Ratio className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <style>{`select { padding-left: 2.75rem; }`}</style>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Resolution</label>
                    <div className="relative">
                      <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full bg-[#1a1a1a] rounded-full px-5 py-3 text-xs font-bold text-white appearance-none focus:outline-none transition-all hover:bg-[#2a2a2a] cursor-pointer shadow-lg">
                        <option>1080p Full HD</option>
                        <option>720p HD</option>
                        <option>4K Ultra (Pro)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Reference Images</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-2xl hover:bg-[#2a2a2a] transition-all cursor-pointer group shadow-lg">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black group-hover:scale-105 transition-all">
                            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-xs text-gray-200 leading-tight">Start Image</h3>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Initial frame</p>
                          </div>
                      </button>
                      
                      <button className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-2xl hover:bg-[#2a2a2a] transition-all cursor-pointer group shadow-lg">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black group-hover:scale-105 transition-all">
                            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-xs text-gray-200 leading-tight">End Image</h3>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Morph target</p>
                          </div>
                      </button>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Elements</label>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {userElements.map((el) => (
                        <button key={el._id} className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 bg-[#1a1a1a] rounded-xl hover:bg-[#2a2a2a] transition-all group shadow-md">
                          {el.img ? (
                             <img src={el.img} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          ) : (
                             <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                               <Sparkles className="w-3 h-3 text-gray-500" />
                             </div>
                          )}
                          <span className="text-[11px] font-bold text-gray-300 group-hover:text-white truncate">{el.name}</span>
                        </button>
                      ))}
                      <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-xl hover:bg-[#2a1a1a] transition-all text-gray-500">
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Global Audio Track</label>
                   <div 
                      onClick={() => setShowAudioLibrary(true)}
                      className="bg-[#1a1a1a] rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-[#222] transition-colors cursor-pointer group shadow-lg"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                            <Music className="w-5 h-5 text-orange-400" />
                         </div>
                         <div>
                            <p className="font-bold text-white text-sm">{audioTrack ? audioTrack : 'Background Music'}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{audioTrack ? 'Track selected' : 'AI Sound Library'}</p>
                         </div>
                      </div>
                      {audioTrack && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAudioTrack(null); }}
                          className="bg-black/40 p-2 rounded-full hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      )}
                   </div>
                </div>
            </div>

          </div>

        </div>
      </div>

      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-black border-t border-[#2a2a2a] p-3 md:p-4 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
            <div className="flex flex-col">
               <span className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">Cost</span>
               <span className="text-xs font-bold font-sans text-white leading-none">10 Credits / Sec</span>
            </div>
            
            <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02] active:scale-95 text-white shadow-lg px-7 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <VideoIcon className="w-3.5 h-3.5 fill-white" /> {isGenerating ? 'Generating...' : 'Generate'}
            </button>
        </div>
      </div>

      {showAudioLibrary && (
        <AudioLibrary 
          onClose={() => setShowAudioLibrary(false)} 
          onSelect={(track) => {
            setAudioTrack(track.name);
            setShowAudioLibrary(false);
          }} 
        />
      )}
    </div>
  );
}
