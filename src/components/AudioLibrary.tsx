import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Play, Pause, Music, Volume2, Mic, Sparkles, Plus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AudioLibraryProps {
  onClose: () => void;
  onSelect: (track: { name: string, type: string }) => void;
}

export default function AudioLibrary({ onClose, onSelect }: AudioLibraryProps) {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('music');
  const [playingId, setPlayingId] = React.useState<string | null>(null);

  const tracks = useQuery(api.videos.getAudioTracks) || [];

  const filteredTracks = tracks.filter(track => 
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
          className="absolute inset-0 bg-black"
        />

        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-black rounded-[2.5rem] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl border border-white/10"
        >
          <div className="flex justify-between items-center px-8 py-6">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight">Audio Library</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Enhance your scene</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-black rounded-full hover:bg-[#1a1a1a] active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 pb-0 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tracks, moods, or genres..."
                className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-all font-medium text-white shadow-inner"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 p-1 bg-black border border-white/5 rounded-2xl shadow-inner">
               {['all', 'music', 'sfx'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-widest ${
                     activeTab === tab ? 'bg-[#1a1a1a] text-white' : 'text-gray-500 hover:text-gray-300'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
             <div className="bg-black border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-[#1a1a1a] hover:border-white/10 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-black border border-white/5 rounded-full flex items-center justify-center shadow-inner">
                     <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-white">AI Voice Synth</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Generate custom dialogue from text</p>
                   </div>
                </div>
                <div className="bg-accent/10 text-accent text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-accent/20">
                   Featured
                </div>
             </div>

             <div className="h-4" />

             {filteredTracks.map((track) => (
               <div key={track._id} className="flex items-center justify-between p-3 border border-white/5 rounded-2xl hover:bg-[#1a1a1a] hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setPlayingId(playingId === track._id ? null : track._id)}
                       className="w-10 h-10 flex items-center justify-center bg-black rounded-xl group-hover:bg-[#333] transition-colors"
                     >
                       {playingId === track._id ? (
                         <div className="flex gap-0.5 items-end h-3">
                           <div className="w-1 bg-white h-full animate-[bounce_bounce_0.6s_ease-in-out_infinite]" />
                           <div className="w-1 bg-white h-2 animate-[_bounce_0.8s_ease-in-out_infinite]" />
                           <div className="w-1 bg-white h-3 animate-[_bounce_0.5s_ease-in-out_infinite]" />
                         </div>
                       ) : (
                         <Play className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors fill-current" />
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
                       className="bg-[#1a1a1a] hover:bg-[#333] text-white font-bold p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                     >
                       <Plus className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             ))}
          </div>

          {/* Player Bar if playing */}
          {playingId && (
            <div className="bg-black p-4 px-8 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[#2e1065] flex items-center justify-center rounded-lg">
                    <Music className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white leading-none mb-1">{tracks.find(t => t._id === playingId)?.name}</p>
                    <div className="w-24 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                       <div className="w-1/2 h-full bg-white" />
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
