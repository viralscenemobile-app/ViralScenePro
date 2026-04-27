import React from 'react';
import { Image as ImageIcon, Sparkles, Wand2, Ratio, ChevronDown, Plus } from 'lucide-react';

export default function AIImage() {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImg, setGeneratedImg] = React.useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [seed, setSeed] = React.useState('');
  const [negativePrompt, setNegativePrompt] = React.useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImg(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImg('https://images.unsplash.com/photo-[SIG]?w=1200&q=80&sig='.replace('[SIG]', '1578632767115-351597cf2477') + Date.now());
    }, 3000);
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">AI Image</h2>
              <p className="text-gray-400 text-xs">Generate beautiful, highly detailed images powered by FLUX. Use @ to summon elements from your studio.</p>
                <div className="flex flex-col gap-2 mt-4">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Elements</label>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {[
                        { name: 'Cyberpunk Protag', img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=100' },
                        { name: 'Neon Bike', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100' }
                      ].map((el, i) => (
                        <button key={i} className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                          <img src={el.img} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          <span className="text-[11px] font-bold text-gray-300 group-hover:text-white truncate">{el.name}</span>
                        </button>
                      ))}
                      <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 transition-all text-gray-500">
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Generation Area */}
            {(isGenerating || generatedImg) && (
              <div className="w-full aspect-square md:aspect-video rounded-2xl overflow-hidden flex items-center justify-center relative transition-all duration-500">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-300 animate-pulse">Synthesizing visual...</p>
                  </div>
                ) : (
                  generatedImg && <img src={generatedImg} alt="Generated" className="w-full h-full object-cover" />
                )}
              </div>
            )}

            {/* Prompt */}
            <div className="flex flex-col gap-2">
               <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-6 transition-all focus-within:border-accent/40 focus-within:bg-white/10 shadow-inner">
                 <textarea
                   placeholder="Describe clearly what you want to see..."
                   className="w-full bg-transparent text-lg focus:outline-none min-h-[140px] resize-none text-white placeholder-gray-600 transition-colors"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-3">
                    <button className="text-gray-400 hover:text-accent flex items-center gap-2 text-xs font-bold transition-colors">
                      <Sparkles className="w-4 h-4" /> Enhance Prompt
                    </button>
                    <span className="text-[10px] text-gray-500 font-bold">{prompt.length} / 1000</span>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Style Preset</label>
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 px-1 -mx-1">
                    {['Cinematic', 'Anime', 'Photographic', '3D Model', 'Pixel Art', 'Cyberpunk'].map((style, i) => (
                      <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-xs transition-all ${i === 0 ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-white/5 border border-transparent text-gray-300 hover:bg-white/10 hover:border-white/10'}`}>
                        {style}
                      </button>
                    ))}
                 </div>
            </div>

             {/* Frameless Toggles */}
            <div className="flex flex-wrap gap-3 pt-1">
               <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full text-xs font-bold transition-all text-white">
                 <Ratio className="w-3.5 h-3.5 text-gray-400" />
                 1:1 Square <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
               </button>
               <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full text-xs font-bold transition-all text-white">
                 <Wand2 className="w-3.5 h-3.5 text-gray-400" />
                 I2I Null <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
               </button>
               <button 
                 onClick={() => setShowAdvanced(!showAdvanced)}
                 className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${showAdvanced ? 'bg-accent/10 text-accent' : 'bg-white/5 hover:bg-white/10 text-white'}`}
               >
                 <Plus className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
                 Advanced
               </button>
            </div>

            {showAdvanced && (
              <div className="flex flex-col gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl animate-in zoom-in-95 duration-300">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Negative Prompt</label>
                    <textarea 
                      placeholder="What you DON'T want in the image (e.g., blurry, distorted, extra limbs)"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent text-white placeholder-gray-600 resize-none min-h-[80px]"
                      value={negativePrompt}
                      onChange={e => setNegativePrompt(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Seed</label>
                       <input 
                         type="text" 
                         placeholder="Random"
                         className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder-gray-600"
                         value={seed}
                         onChange={e => setSeed(e.target.value)}
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">CFG Scale</label>
                       <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
                          <input type="range" className="flex-1 accent-accent" min="1" max="20" defaultValue="7.5" />
                          <span className="text-xs font-bold text-white w-4 text-center">7.5</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Floating Bottom Bar (Frameless & Blended) */}
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-4 md:p-5 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1 opacity-70">Cost</span>
              <span className="text-sm font-bold font-sans text-accent leading-none">5 Credits</span>
           </div>
           
           <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="bg-accent hover:bg-accent-hover active:scale-95 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
             <ImageIcon className="w-4 h-4 fill-white" /> {isGenerating ? 'Generating...' : 'Generate'}
           </button>
        </div>
      </div>
    </div>
  );
}
