import React from 'react';
import { Layers, Image as ImageIcon, Video as VideoIcon, Mic, Plus, Play, Sparkles } from 'lucide-react';

export default function OmniStudio() {
  const [shots, setShots] = React.useState([
    { id: 1, duration: '5s', prompt: '', elements: [] }
  ]);

  const addShot = () => {
    setShots([...shots, { id: Date.now(), duration: '5s', prompt: '', elements: [] }]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
          
          {/* Header Info */}
          <div className="bg-panel border border-border p-5 rounded-3xl">
             <div className="flex justify-between items-start mb-2">
               <div>
                  <h2 className="font-sans font-bold text-xl">Kling 3.0 Omni</h2>
                  <p className="text-gray-400 text-sm">Storyboard your sequence. Use @ to summon elements.</p>
               </div>
               <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                 <Sparkles className="w-3 h-3" /> AUDIO ON
               </div>
             </div>
          </div>

          {/* Timeline / Shots */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-300">Timeline</h3>
            {shots.map((shot, index) => (
              <div key={shot.id} className="bg-white/5 border border-border rounded-3xl p-4 flex gap-4">
                <div className="flex flex-col items-center">
                   <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                     {index + 1}
                   </div>
                   <div className="flex-1 w-px bg-white/10 my-2"></div>
                   <div className="text-[10px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-md">{shot.duration}</div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                   {/* Inputs */}
                   <textarea
                     className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 text-sm focus:outline-none focus:border-accent min-h-[80px]"
                     placeholder="Describe the shot..."
                     value={shot.prompt}
                     onChange={(e) => {
                       const newShots = [...shots];
                       newShots[index].prompt = e.target.value;
                       setShots(newShots);
                     }}
                   />
                   
                   <div className="flex items-center gap-2">
                     <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
                       <ImageIcon className="w-4 h-4 text-gray-400" /> Reference
                     </button>
                     <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
                       <Mic className="w-4 h-4 text-gray-400" /> Dialogue
                     </button>
                   </div>
                </div>
              </div>
            ))}

            <button 
              onClick={addShot}
              className="flex items-center gap-2 text-gray-400 hover:text-white font-bold p-4 bg-white/5 border border-dashed border-white/20 rounded-3xl justify-center transition-all group"
            >
              <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              Add Shot (max 15s total)
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-panel p-4 pb-8 md:pb-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Estimated Cost</span>
              <span className="text-xl font-bold font-sans text-accent">90 Credits</span>
           </div>
           
           <button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
             <Play className="w-5 h-5 fill-white" /> Generate Omni Video
           </button>
        </div>
      </div>
    </div>
  );
}
