import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Play, Pause, Music, Volume2, Mic, Sparkles, Plus } from 'lucide-react';

interface AudioLibraryProps {
  onClose: () => void;
  onSelect: (track: { name: string, type: string }) => void;
}

const mockTracks = [
  { id: 1, name: 'Cyberpunk Drift', category: 'Music', mood: 'Aggressive', author: 'AI Maestro', duration: '1:30' },
  { id: 2, name: 'Neon Rain', category: 'Music', mood: 'Melancholic', author: 'Synth Wave', duration: '2:15' },
  { id: 3, name: 'Epic Space Battle', category: 'Music', mood: 'Grand', author: 'Orchestra AI', duration: '3:00' },
  { id: 4, name: 'Street Ambience', category: 'SFX', mood: 'Realistic', author: 'City Records', duration: '0:45' },
  { id: 5, name: 'Deep Space Drone', category: 'Music', mood: 'Dark', author: 'Void SFX', duration: '4:00' },
  { id: 6, name: 'Futuristic Glide', category: 'Music', mood: 'Upbeat', author: 'Glide Labs', duration: '1:45' },
];

export default function AudioLibrary({ onClose, onSelect }: AudioLibraryProps) {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('music');
  const [playingId, setPlayingId] = React.useState<number | null>(null);

  const filteredTracks = mockTracks.filter(track => 
    track.name.toLowerCase().includes(search.toLowerCase()) && 
    (activeTab === 'all' || track.category.toLowerCase() === activeTab)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-panel border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
        >
          <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight">Audio Library</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Enhance your scene</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 pb-0 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tracks, moods, or genres..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
               {['all', 'music', 'sfx'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-widest ${
                     activeTab === tab ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
             <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-orange-600/15 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-white">AI Voice Clone</p>
                     <p className="text-xs text-orange-400/70 font-medium">Generate custom dialogue</p>
                   </div>
                </div>
                <button className="bg-orange-500 text-white p-2 rounded-full shadow-lg">
                   <Plus className="w-4 h-4" />
                </button>
             </div>

             <div className="h-4" />

             {filteredTracks.map((track) => (
               <div key={track.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                       className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-orange-500/10 transition-colors"
                     >
                       {playingId === track.id ? (
                         <div className="flex gap-0.5 items-end h-3">
                           <div className="w-1 bg-orange-500 h-full animate-[bounce_0.6s_ease-in-out_infinite]" />
                           <div className="w-1 bg-orange-500 h-2 animate-[bounce_0.8s_ease-in-out_infinite]" />
                           <div className="w-1 bg-orange-500 h-3 animate-[bounce_0.5s_ease-in-out_infinite]" />
                         </div>
                       ) : (
                         <Play className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors fill-current" />
                       )}
                     </button>
                     <div>
                       <p className="font-bold text-sm text-gray-200">{track.name}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{track.mood}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-700" />
                         <span className="text-[10px] font-bold text-gray-600">{track.author}</span>
                       </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono text-gray-600 font-bold">{track.duration}</span>
                     <button 
                       onClick={() => onSelect({ name: track.name, type: track.category })}
                       className="bg-white/5 hover:bg-white/10 text-white font-bold p-2.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                     >
                       <Plus className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             ))}
          </div>

          {/* Player Bar if playing */}
          {playingId && (
            <div className="bg-orange-600/20 backdrop-blur-xl border-t border-orange-500/20 p-4 px-8 flex items-center justify-between animate-in slide-in-from-bottom-5 duration-300">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-orange-500 flex items-center justify-center rounded-lg">
                    <Music className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white leading-none mb-1">{mockTracks.find(t => t.id === playingId)?.name}</p>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-1/2 h-full bg-orange-500" />
                    </div>
                 </div>
               </div>
               <button onClick={() => setPlayingId(null)} className="p-2 text-white">
                 <Pause className="w-4 h-4 fill-white" />
               </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
