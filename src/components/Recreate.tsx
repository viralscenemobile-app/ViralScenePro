import React from 'react';
import { Upload, RefreshCw, Layers, Sparkles, SlidersHorizontal, Wand2 } from 'lucide-react';

export default function Recreate() {
  const [fileSelected, setFileSelected] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImg, setGeneratedImg] = React.useState<string | null>(null);
  const [fidelity, setFidelity] = React.useState(60);
  const [styleStretch, setStyleStretch] = React.useState(80);

  const handleRemix = () => {
    setIsGenerating(true);
    setGeneratedImg(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImg('https://images.unsplash.com/photo-[SIG]?auto=format&fit=crop&q=80&w=2564'.replace('[SIG]', '1558981806195-0814fdcd260a') + Date.now());
    }, 3000);
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">Recreate</h2>
              <p className="text-gray-400 text-xs font-medium">Upload media to extract style and composition for remixing.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Upload Area */}
            {!fileSelected ? (
              <button onClick={() => setFileSelected(true)} className="w-full aspect-[4/3] max-h-[240px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all group shadow-inner">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all bg-black/20">
                   <Upload className="w-6 h-6 text-gray-500 group-hover:text-accent" />
                 </div>
                 <div className="text-center">
                    <p className="font-bold text-base mb-0.5 text-gray-200">Select Media file</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Image or Video</p>
                 </div>
              </button>
            ) : (
               <div className="flex flex-col gap-6">
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] cursor-pointer" alt="Reference" />
                    <button onClick={() => setFileSelected(false)} className="absolute top-3 right-3 bg-black/60 backdrop-blur-xl p-2 rounded-full border border-white/20 hover:bg-black/90 hover:scale-105 transition-all shadow-md">
                       <RefreshCw className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  {/* Extraction Results */}
                  <div className="flex flex-col gap-2">
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1">Extracted Style</p>
                     <div className="flex flex-wrap gap-1.5">
                       <span className="bg-accent/10 border border-accent/20 text-accent font-bold px-3 py-1 rounded-full text-xs">Cyberpunk</span>
                       <span className="bg-white/5 border border-white/5 text-gray-300 font-bold px-3 py-1 rounded-full text-xs">Neon Lighting</span>
                       <span className="bg-white/5 border border-white/5 text-gray-300 font-bold px-3 py-1 rounded-full text-xs">High Contrast</span>
                       <span className="bg-white/5 border border-white/5 text-gray-300 font-bold px-3 py-1 rounded-full text-xs">Wide Angle</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Fidelity</label>
                          <span className="text-xs font-bold text-accent">{fidelity}%</span>
                       </div>
                       <div className="bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
                          <input 
                            type="range" 
                            className="w-full accent-accent" 
                            min="0" 
                            max="100" 
                            value={fidelity} 
                            onChange={(e) => setFidelity(parseInt(e.target.value))} 
                          />
                          <div className="flex justify-between mt-1 opacity-40 text-[9px] font-bold uppercase tracking-tighter">
                             <span>Creative</span>
                             <span>Exact</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Style</label>
                          <span className="text-xs font-bold text-orange-400">{styleStretch}%</span>
                       </div>
                       <div className="bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
                          <input 
                            type="range" 
                            className="w-full accent-orange-500" 
                            min="0" 
                            max="100" 
                            value={styleStretch} 
                            onChange={(e) => setStyleStretch(parseInt(e.target.value))} 
                          />
                          <div className="flex justify-between mt-1 opacity-40 text-[9px] font-bold uppercase tracking-tighter">
                             <span>Subtle</span>
                             <span>Dominant</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1 mb-1.5">Prompt Overlay</p>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent min-h-[90px] resize-none text-white placeholder-gray-700 transition-all font-sans shadow-inner"
                      placeholder="e.g. Keep the neon but add futuristic Tokyo vibe..."
                    ></textarea>
                    <button className="absolute bottom-3 right-3 text-gray-500 hover:text-accent transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                       <Sparkles className="w-3.5 h-3.5" /> Suggest
                    </button>
                  </div>
                  
                  <button className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl group border border-white/5 bg-white/2">
                     <div className="flex items-center gap-3">
                       <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 group-hover:scale-105 transition-transform">
                         <Layers className="w-4 h-4 text-blue-500" />
                       </div>
                       <div className="text-left">
                          <p className="font-bold text-gray-200 text-xs">Inject @Elements</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Replace characters</p>
                       </div>
                     </div>
                     <span className="text-blue-500 font-bold text-[10px] bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">+ Add</span>
                  </button>

                  {/* Generation Area */}
                  {(isGenerating || generatedImg) && (
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden flex items-center justify-center relative transition-all duration-500 mt-4">
                      {isGenerating ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                          <p className="text-sm font-bold text-gray-300 animate-pulse">Remixing with new attributes...</p>
                        </div>
                      ) : (
                        generatedImg && <img src={generatedImg} alt="Remixed" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
               </div>
            )}

          </div>

        </div>
      </div>

      {/* Floating Bottom Bar (Frameless & Blended) */}
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-2.5 md:p-3.5 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[7px] font-bold uppercase tracking-[0.2em] leading-none mb-0.5 opacity-60">Output Type</span>
              <div className="flex items-center gap-1.5 cursor-pointer">
                 <span className="font-bold text-white text-[10px]">Full Recreate</span>
                 <SlidersHorizontal className="w-2.5 h-2.5 text-gray-500" />
              </div>
           </div>
           
           <button onClick={handleRemix} className="bg-accent hover:bg-accent-hover active:scale-95 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] px-6 py-2 rounded-full font-bold text-[8px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={!fileSelected || isGenerating}>
             <Wand2 className="w-3.5 h-3.5 fill-white" /> {isGenerating ? 'Remixing...' : 'Remix'}
           </button>
        </div>
      </div>
    </div>
  );
}
