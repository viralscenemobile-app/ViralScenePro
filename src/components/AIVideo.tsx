import React from 'react';
import { Video as VideoIcon, Image as ImageIcon, Sparkles, SlidersHorizontal, Ratio, ChevronDown, Plus, Music, X } from 'lucide-react';
import AudioLibrary from './AudioLibrary';

export default function AIVideo() {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedVideo, setGeneratedVideo] = React.useState<string | null>(null);
  const [audioTrack, setAudioTrack] = React.useState<string | null>(null);
  const [showAudioLibrary, setShowAudioLibrary] = React.useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedVideo(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedVideo('https://cdn.pixabay.com/video/2021/08/04/83897-584742461_large.mp4');
    }, 4000); // simulate longer generation time for video
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div className="text-center md:text-left">
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">AI Video</h2>
              <p className="text-gray-400 text-xs font-medium">Generate 15s HD videos. Add an image reference to guide the generation.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Generation Area */}
            {(isGenerating || generatedVideo) && (
              <div className="w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center relative transition-all duration-500 border border-white/5">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
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
            <div className="flex flex-col gap-1.5">
               <div className="relative bg-white/5 border border-white/10 rounded-xl p-3.5 transition-all focus-within:border-accent/40 focus-within:bg-white/10 shadow-inner">
                 <textarea
                   placeholder="Describe what you want to see..."
                   className="w-full bg-transparent text-sm focus:outline-none min-h-[100px] resize-none text-white placeholder-gray-600 transition-colors font-sans"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/5">
                    <button className="text-gray-500 hover:text-accent flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors">
                      <Sparkles className="w-3.5 h-3.5" /> Enhance
                    </button>
                    <span className="text-[10px] text-gray-600 font-bold">{prompt.length} / 500</span>
                 </div>
               </div>
            </div>

            {/* Structured Configuration Panel */}
            <div className="flex flex-col gap-5 relative">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <SlidersHorizontal className="w-4 h-4 text-accent" /> 
                  <h3 className="font-bold text-gray-200 text-xs uppercase tracking-widest">Configuration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Aspect Ratio</label>
                    <div className="relative">
                      <select className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs font-bold text-white appearance-none focus:outline-none focus:border-accent transition-colors hover:bg-white/10 cursor-pointer shadow-inner">
                        <option>16:9 Widescreen</option>
                        <option>9:16 Vertical</option>
                        <option>1:1 Square</option>
                        <option>21:9 Cinematic</option>
                      </select>
                      <Ratio className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                      <style>{`select { padding-left: 2.5rem; }`}</style>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Resolution</label>
                    <div className="relative">
                      <select className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pl-5 text-xs font-bold text-white appearance-none focus:outline-none focus:border-accent transition-colors hover:bg-white/10 cursor-pointer shadow-inner">
                        <option>1080p Full HD</option>
                        <option>720p HD</option>
                        <option>4K Ultra (Pro)</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                   <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase pl-1">Reference Images</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer group shadow-inner">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 group-hover:bg-accent/20 transition-all">
                            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-accent" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-xs text-gray-200">Start Image</h3>
                            <p className="text-[9px] text-gray-500 font-medium tracking-tight">1st frame guide</p>
                          </div>
                      </button>
                      
                      <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer group shadow-inner">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 group-hover:bg-accent/20 transition-all">
                            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-accent" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-xs text-gray-200">End Image</h3>
                            <p className="text-[9px] text-gray-500 font-medium tracking-tight">Morph target</p>
                          </div>
                      </button>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Elements</label>
                   <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      {[
                        { name: 'Cyberpunk Protag', img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=100' },
                        { name: 'Neon Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100' }
                      ].map((el, i) => (
                        <button key={i} className="flex-shrink-0 flex items-center gap-2 p-2 pr-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                          <img src={el.img} className="w-8 h-8 rounded-xl object-cover" alt="" />
                          <span className="text-xs font-bold text-gray-300 group-hover:text-white truncate">{el.name}</span>
                        </button>
                      ))}
                      <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all text-gray-500">
                        <Plus className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Global Audio Track</label>
                   <div 
                      onClick={() => setShowAudioLibrary(true)}
                      className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 group-hover:scale-105 transition-transform">
                            <Music className="w-5 h-5 text-orange-400" />
                         </div>
                         <div>
                            <p className="font-bold text-white text-sm">{audioTrack ? audioTrack : 'Draft with Music'}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{audioTrack ? 'Track selected' : 'AI Sound Library'}</p>
                         </div>
                      </div>
                      {audioTrack && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAudioTrack(null); }}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-white" />
                        </button>
                      )}
                   </div>
                </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Bottom Bar (Frameless & Blended) */}
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-4 md:p-5 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1 opacity-70">Cost</span>
              <span className="text-sm font-bold font-sans text-accent leading-none">10 Credits / Sec</span>
           </div>
           
           <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="bg-accent hover:bg-accent-hover active:scale-95 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             <VideoIcon className="w-4 h-4 fill-white" /> {isGenerating ? 'Generating...' : 'Generate'}
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
