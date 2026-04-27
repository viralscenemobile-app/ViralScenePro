import React from 'react';
import { Image as ImageIcon, Sparkles, Wand2, Ratio } from 'lucide-react';

export default function AIImage() {
  const [prompt, setPrompt] = React.useState('');
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="font-sans font-bold text-3xl">AI Image</h2>
            <p className="text-gray-400 text-sm">Generate beautiful, highly detailed images powered by FLUX. Use @ to summon elements from your studio.</p>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Prompt */}
            <div className="flex flex-col gap-2">
               <div className="relative">
                 <textarea
                   placeholder="Describe clearly what you want to see..."
                   className="w-full bg-white/5 border border-border rounded-2xl p-4 pb-12 text-md focus:outline-none focus:border-accent min-h-[160px] resize-none"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <button className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-border transition-colors">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </button>
                    <span className="text-xs text-gray-500 font-bold">{prompt.length} / 1000</span>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
                 <label className="text-gray-400 font-bold text-sm ml-1">Style Preset</label>
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 px-1 -mx-1">
                    {['Cinematic', 'Anime', 'Photographic', '3D Model', 'Pixel Art', 'Cyberpunk'].map((style, i) => (
                      <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-sm border transition-all ${i === 0 ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-white/5 border-border text-gray-300 hover:bg-white/10'}`}>
                        {style}
                      </button>
                    ))}
                 </div>
            </div>

             {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-border p-4 rounded-2xl flex flex-col cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                     <Ratio className="w-4 h-4 text-gray-400" />
                     <span className="text-sm font-bold text-gray-200">Aspect Ratio</span>
                   </div>
                   <span className="text-accent text-xs font-bold">1:1</span>
                 </div>
              </div>
              <div className="bg-white/5 border border-border p-4 rounded-2xl flex flex-col cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                     <Wand2 className="w-4 h-4 text-gray-400" />
                     <span className="text-sm font-bold text-gray-200">I2I Reference</span>
                   </div>
                   <span className="text-gray-500 text-xs font-bold">None</span>
                 </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-panel p-4 pb-8 md:pb-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cost</span>
              <span className="text-xl font-bold font-sans text-accent">5 Credits</span>
           </div>
           
           <button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
             <ImageIcon className="w-5 h-5 fill-white" /> Generate Image
           </button>
        </div>
      </div>
    </div>
  );
}
