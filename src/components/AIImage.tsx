import React, { useContext } from 'react';
import { Image as ImageIcon, Sparkles, Wand2, Ratio, ChevronDown, Plus } from 'lucide-react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function AIImage() {
  const [prompt, setPrompt] = React.useState('');
  const [style, setStyle] = React.useState('Cinematic');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImg, setGeneratedImg] = React.useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [seed, setSeed] = React.useState('');
  const [negativePrompt, setNegativePrompt] = React.useState('');
  const { convexUserId } = useContext(AuthContext);

  const userElements = useQuery(
    api.users.getElements,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const generateImage = useAction(api.videos.generateImageAction);

  const handleGenerate = async () => {
    if (!prompt.trim() || !convexUserId) return;
    setIsGenerating(true);
    setGeneratedImg(null);
    try {
      const url = await generateImage({
        userId: convexUserId as any,
        prompt: prompt,
        negativePrompt: negativePrompt,
        seed: seed,
        style: style
      });
      setGeneratedImg(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">AI Image</h2>
              <p className="text-gray-400 text-xs">Generate beautiful, highly detailed images powered by FLUX. Use @ to summon elements from your studio.</p>
                <div className="flex flex-col gap-2 mt-4">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Elements</label>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {userElements.map((el) => (
                        <button key={el._id} className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 bg-[#1a1a1a] rounded-xl hover:bg-[#2a2a2a] transition-all group">
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
                      <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-xl hover:bg-[#2a2a2a] transition-all text-gray-500">
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Generation Area */}
            {(isGenerating || generatedImg) && (
              <div className="w-full aspect-square md:aspect-video rounded-2xl overflow-hidden flex items-center justify-center relative transition-all duration-500 group">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-black border-t-accent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-300 animate-pulse">Synthesizing visual...</p>
                  </div>
                ) : (
                  generatedImg && (
                    <>
                      <img src={generatedImg} alt="Generated" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <div className="bg-accent px-4 py-2 font-bold text-xs uppercase tracking-widest text-white rounded-xl shadow-xl">
                            Saved to Library
                          </div>
                      </div>
                    </>
                  )
                )}
              </div>
            )}

            {/* Prompt */}
            <div className="flex flex-col gap-2">
               <div className="relative bg-[#1a1a1a] rounded-[1.5rem] p-5 shadow-lg">
                 <textarea
                   placeholder="Describe clearly what you want to see..."
                   className="w-full bg-transparent text-[16px] focus:outline-none min-h-[120px] resize-none text-white placeholder-gray-600 transition-colors"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="flex justify-between items-center mt-3 pt-3">
                    <button className="text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors">
                      <Sparkles className="w-4 h-4" /> Enhance Prompt
                    </button>
                    <span className="text-[10px] text-gray-500 font-bold">{prompt.length} / 1000</span>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Style Preset</label>
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 px-1 -mx-1">
                    {['Cinematic', 'Anime', 'Photographic', '3D Model', 'Pixel Art', 'Cyberpunk'].map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => setStyle(s)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-xs transition-all ${style === s ? 'bg-[#2e1065] text-white' : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'}`}>
                        {s}
                      </button>
                    ))}
                 </div>
            </div>

             {/* Frameless Toggles */}
            <div className="flex flex-wrap gap-3 pt-1">
             <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-4 py-2.5 rounded-full text-xs font-bold transition-all text-white">
                 <Ratio className="w-3.5 h-3.5 text-gray-400" />
                 1:1 Square <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
               </button>
               <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-4 py-2.5 rounded-full text-xs font-bold transition-all text-white">
                 <Wand2 className="w-3.5 h-3.5 text-gray-400" />
                 I2I Null <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
               </button>
               <button 
                 onClick={() => setShowAdvanced(!showAdvanced)}
                 className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${showAdvanced ? 'bg-[#2e1065] text-white' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'}`}
               >
                 <Plus className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
                 Advanced
               </button>
            </div>

            {showAdvanced && (
              <div className="flex flex-col gap-6 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl animate-in zoom-in-95 duration-300">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Negative Prompt</label>
                    <textarea 
                      placeholder="What you DON'T want in the image (e.g., blurry, distorted, extra limbs)"
                      className="w-full bg-black border border-[#2a2a2a] rounded-2xl p-4 text-sm focus:outline-none focus:border-white text-white placeholder-gray-600 resize-none min-h-[80px]"
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
                         className="w-full bg-black border border-[#2a2a2a] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white placeholder-gray-600"
                         value={seed}
                         onChange={e => setSeed(e.target.value)}
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">CFG Scale</label>
                       <div className="flex items-center gap-3 bg-black border border-[#2a2a2a] rounded-2xl px-4 py-3">
                          <input type="range" className="flex-1 accent-white" min="1" max="20" defaultValue="7.5" />
                          <span className="text-xs font-bold text-white w-4 text-center">7.5</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>

        </div>
      </div>

      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-black border-t border-[#2a2a2a] p-3 md:p-4 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
            <div className="flex flex-col">
               <span className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">Cost</span>
               <span className="text-xs font-bold font-sans text-white leading-none">5 Credits</span>
            </div>
            
            <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02] active:scale-95 text-white shadow-lg px-7 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <ImageIcon className="w-3.5 h-3.5 fill-white" /> {isGenerating ? 'Generating...' : 'Generate'}
            </button>
        </div>
      </div>
    </div>
  );
}
