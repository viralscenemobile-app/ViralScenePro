import React from 'react';
import { Video as VideoIcon, Image as ImageIcon, Sparkles, SlidersHorizontal, Ratio } from 'lucide-react';

export default function AIVideo() {
  const [prompt, setPrompt] = React.useState('');
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="font-sans font-bold text-3xl">AI Video</h2>
            <p className="text-gray-400 text-sm">Generate stunning 15s HD videos using state of the art models. Add an image reference to guide the generation.</p>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Prompt */}
            <div className="flex flex-col gap-2">
               <div className="relative">
                 <textarea
                   placeholder="Describe what you want to see... e.g., 'A bioluminescent jellyfish swimming through a neon cyberpunk city street'"
                   className="w-full bg-white/5 border border-border rounded-2xl p-4 pb-12 text-md focus:outline-none focus:border-accent min-h-[160px] resize-none"
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                 />
                 <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <button className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-border transition-colors">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </button>
                    <span className="text-xs text-gray-500 font-bold">{prompt.length} / 500</span>
                 </div>
               </div>
            </div>

            {/* Inputs / Settings */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-dashed border-border rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-all">
                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-accent" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-sm text-gray-200">Start Image</h3>
                    <p className="text-xs text-gray-500">Optional reference</p>
                  </div>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-dashed border-border rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-all">
                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-accent" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-sm text-gray-200">End Image</h3>
                    <p className="text-xs text-gray-500">Morph target (opt)</p>
                  </div>
              </button>
            </div>

             {/* Toggles */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white/5 border border-border p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-2">
                   <Ratio className="w-4 h-4 text-gray-400" />
                   <span className="text-sm font-bold text-gray-200">9:16 Vertical</span>
                 </div>
              </div>
              <div className="flex-1 bg-white/5 border border-border p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-2">
                   <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                   <span className="text-sm font-bold text-gray-200">1080p HD</span>
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
              <span className="text-xl font-bold font-sans text-accent">10 Credits / Sec</span>
           </div>
           
           <button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
             <VideoIcon className="w-5 h-5 fill-white divide-white" /> Generate Video
           </button>
        </div>
      </div>
    </div>
  );
}
