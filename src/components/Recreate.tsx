import React, { useContext } from 'react';
import { Upload, RefreshCw, Layers, Sparkles, SlidersHorizontal, Wand2, X } from 'lucide-react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function Recreate() {
  const { convexUserId } = useContext(AuthContext);
  const userElements = useQuery(
    api.users.getElements,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const [fileSelected, setFileSelected] = React.useState(false);
  const [showElements, setShowElements] = React.useState(false);
  const [selectedElements, setSelectedElements] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImg, setGeneratedImg] = React.useState<string | null>(null);
  const [fidelity, setFidelity] = React.useState(60);
  const [styleStretch, setStyleStretch] = React.useState(80);
  const [promptOverlay, setPromptOverlay] = React.useState('');

  const remixMedia = useAction(api.videos.remixMediaAction);

  const handleRemix = async () => {
    setIsGenerating(true);
    setGeneratedImg(null);
    try {
       const url = await remixMedia({ prompt: promptOverlay || 'cyberpunk neon city elements', userId: convexUserId as any });
       setGeneratedImg(url as string);
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
                <h2 className="font-sans font-bold text-3xl md:text-5xl mb-1 tracking-tight">Recreate</h2>
                <p className="text-gray-400 text-xs font-medium">Upload media to extract style and composition for remixing.</p>
              </div>
            </div>

          <div className="flex flex-col gap-6">
            
            {/* Upload Area */}
            {!fileSelected ? (
              <button 
                onClick={() => setFileSelected(true)} 
                className="w-full aspect-[4/3] max-h-[240px] rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#222] transition-all group shadow-lg"
              >
                 <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-all bg-black shadow-inner">
                   <Upload className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                 </div>
                 <div className="text-center">
                    <p className="font-bold text-base mb-0.5 text-gray-200">Select Media file</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Image or Video</p>
                 </div>
              </button>
            ) : (
                <div className="flex flex-col gap-6">
                  <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden group shadow-xl bg-[#111] flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                       <Upload className="w-10 h-10 mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Reference Media Loaded</span>
                    </div>
                    <button onClick={() => setFileSelected(false)} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full hover:bg-black transition-all shadow-lg z-10">
                       <RefreshCw className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Extraction Results */}
                  <div className="flex flex-col gap-3">
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1">Extracted Style</p>
                     <div className="flex flex-wrap gap-2">
                       <span className="bg-[#1a1a1a] text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md">Cyberpunk</span>
                       <span className="bg-[#1a1a1a] text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md">Neon Lighting</span>
                       <span className="bg-[#1a1a1a] text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md">High Contrast</span>
                       <span className="bg-[#1a1a1a] text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-md">Wide Angle</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Fidelity</label>
                          <span className="text-xs font-bold text-white">{fidelity}%</span>
                       </div>
                       <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-lg">
                          <input 
                            type="range" 
                            className="w-full accent-white cursor-pointer" 
                            min="0" 
                            max="100" 
                            value={fidelity} 
                            onChange={(e) => setFidelity(parseInt(e.target.value))} 
                          />
                          <div className="flex justify-between mt-1.5 opacity-40 text-[9px] font-bold uppercase tracking-tighter">
                             <span>Creative</span>
                             <span>Exact</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Style</label>
                          <span className="text-xs font-bold text-white">{styleStretch}%</span>
                       </div>
                       <div className="bg-[#1a1a1a] rounded-2xl p-4 shadow-lg">
                          <input 
                            type="range" 
                            className="w-full accent-white cursor-pointer" 
                            min="0" 
                            max="100" 
                            value={styleStretch} 
                            onChange={(e) => setStyleStretch(parseInt(e.target.value))} 
                          />
                          <div className="flex justify-between mt-1.5 opacity-40 text-[9px] font-bold uppercase tracking-tighter">
                             <span>Subtle</span>
                             <span>Dominant</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1 mb-2">Prompt Overlay</p>
                    <textarea 
                      className="w-full bg-[#1a1a1a] rounded-[1.5rem] px-5 py-4 text-sm focus:outline-none min-h-[100px] resize-none text-white placeholder-gray-600 transition-all font-sans shadow-lg"
                      placeholder="e.g. Keep the neon but add futuristic Tokyo vibe..."
                      value={promptOverlay}
                      onChange={(e) => setPromptOverlay(e.target.value)}
                    ></textarea>
                    <button className="absolute bottom-4 right-4 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                       <Sparkles className="w-3.5 h-3.5" /> Suggest
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowElements(!showElements)}
                    className="w-full p-4 flex flex-col gap-4 bg-[#1a1a1a] rounded-2xl shadow-lg hover:bg-[#222] transition-colors"
                  >
                    <div className="w-full flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                         <div className="bg-black p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                            <Layers className="w-4.5 h-4.5 text-blue-500" />
                         </div>
                         <div className="text-left">
                            <p className="font-bold text-gray-200 text-sm leading-tight">Inject @Elements</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Replace characters</p>
                         </div>
                       </div>
                       <span className={`text-[10px] bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest font-bold transition-all ${selectedElements.length > 0 ? 'text-white bg-blue-600' : 'text-blue-500'}`}>
                         {selectedElements.length > 0 ? `${selectedElements.length} Selected` : '+ Add'}
                       </span>
                    </div>

                    {showElements && (
                      <div className="w-full flex gap-2 overflow-x-auto no-scrollbar pb-1 animate-in fade-in slide-in-from-top-2">
                        {userElements.map((el) => {
                          const isSelected = selectedElements.includes(el._id);
                          return (
                            <div 
                              key={el._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedElements(prev => 
                                  isSelected ? prev.filter(id => id !== el._id) : [...prev, el._id]
                                );
                              }}
                              className={`flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 bg-black rounded-xl transition-all border ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
                            >
                               {el.img ? (
                                  <img src={el.img} className="w-6 h-6 rounded-lg object-cover" alt="" />
                               ) : (
                                  <div className="w-6 h-6 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-gray-500" />
                                  </div>
                               )}
                               <span className="text-[10px] font-bold text-gray-300 truncate max-w-[80px]">{el.name}</span>
                            </div>
                          );
                        })}
                        {userElements.length === 0 && (
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest py-2">No elements in your library</div>
                        )}
                      </div>
                    )}
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
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-black border-t border-[#2a2a2a] p-3 md:p-4 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[7px] font-bold uppercase tracking-[0.2em] leading-none mb-1 opacity-60">Output Type</span>
              <div className="flex items-center gap-1.5 cursor-pointer">
                 <span className="font-bold text-white text-[11px]">Full Recreate</span>
                 <SlidersHorizontal className="w-3 h-3 text-gray-500" />
              </div>
           </div>
           
           <button onClick={handleRemix} className="bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02] active:scale-95 text-white shadow-lg px-8 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={!fileSelected || isGenerating}>
             <Wand2 className="w-3.5 h-3.5 fill-white" /> {isGenerating ? 'Remixing...' : 'Remix'}
           </button>
        </div>
      </div>
    </div>
  );
}
