import React from 'react';
import { Upload, RefreshCw, Layers, Sparkles, SlidersHorizontal, Wand2 } from 'lucide-react';

export default function Recreate() {
  const [fileSelected, setFileSelected] = React.useState(false);
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="font-sans font-bold text-3xl">Recreate Tool</h2>
            <p className="text-gray-400 text-sm">Upload an image or video to extract its style, composition, and elements. Then remix it into something entirely new, or just swap the characters.</p>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Upload Area */}
            {!fileSelected ? (
              <button onClick={() => setFileSelected(true)} className="w-full aspect-[4/3] max-h-[300px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all group">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                   <Upload className="w-8 h-8 text-gray-400 group-hover:text-accent" />
                 </div>
                 <div className="text-center">
                    <p className="font-bold text-lg mb-1">Select Media file</p>
                    <p className="text-sm text-gray-500">Image up to 10MB, Video up to 200MB</p>
                 </div>
              </button>
            ) : (
               <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-border">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover" alt="Reference" />
                    <button onClick={() => setFileSelected(false)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-black/70">
                       <RefreshCw className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Extraction Results */}
                  <div className="bg-white/5 border border-border p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3">Extracted Style</p>
                     <div className="flex flex-wrap gap-2">
                       <span className="bg-accent/20 border border-accent/30 text-accent font-bold px-3 py-1 rounded-lg text-sm">Cyberpunk</span>
                       <span className="bg-white/10 border border-white/10 text-gray-200 font-bold px-3 py-1 rounded-lg text-sm">Neon Lighting</span>
                       <span className="bg-white/10 border border-white/10 text-gray-200 font-bold px-3 py-1 rounded-lg text-sm">High Contrast</span>
                       <span className="bg-white/10 border border-white/10 text-gray-200 font-bold px-3 py-1 rounded-lg text-sm">Wide Angle</span>
                     </div>
                  </div>

                  <div className="relative">
                    <h3 className="font-bold mb-2">Prompt Overlay</h3>
                    <textarea 
                      className="w-full bg-white/5 border border-border rounded-2xl p-4 text-md focus:outline-none focus:border-accent min-h-[100px] resize-none"
                      placeholder="e.g. Keep the neon lighting but change the setting to a futuristic Tokyo diner..."
                    ></textarea>
                    <button className="absolute bottom-3 right-3 bg-white/10 p-2 rounded-lg hover:bg-white/20">
                       <Sparkles className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                  
                  <button className="w-full bg-white/5 border border-border p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="bg-blue-500/20 p-2 rounded-xl">
                         <Layers className="w-5 h-5 text-blue-500" />
                       </div>
                       <div className="text-left">
                          <p className="font-bold">Inject @Elements</p>
                          <p className="text-xs text-gray-400">Replace characters with your own</p>
                       </div>
                     </div>
                     <span className="text-blue-500 font-bold text-sm">+ Add</span>
                  </button>
               </div>
            )}

          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-panel p-4 pb-8 md:pb-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Output Type</span>
              <div className="flex items-center gap-2 mt-1 cursor-pointer">
                 <span className="font-bold text-white text-sm bg-white/10 px-2 py-1 rounded-md">Full Recreation</span>
                 <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </div>
           </div>
           
           <button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={!fileSelected}>
             <Wand2 className="w-5 h-5 fill-white" /> Remix Now
           </button>
        </div>
      </div>
    </div>
  );
}
