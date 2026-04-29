import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Shield, UserX, Check, Search } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface CollaborationOverlayProps {
  onClose: () => void;
  collaborators: any[];
  seriesId: string;
}

export default function CollaborationOverlay({ onClose, collaborators, seriesId }: CollaborationOverlayProps) {
  const [copied, setCopied] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isInviting, setIsInviting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addCollaborator = useMutation(api.users.addSeriesCollaborator);

  const handleInvite = async () => {
    if (!search.trim()) return;
    setIsInviting(true);
    setError(null);
    try {
      await addCollaborator({ 
        seriesId: seriesId as any, 
        search: search.trim(), 
        role: 'Editor' 
      });
      setSearch('');
    } catch (e: any) {
      setError(e.message || "Failed to invite");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-black rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/5"
        >
          <div className="flex justify-between items-center px-8 py-6">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight">Collaboration</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage project access</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-black rounded-full hover:bg-[#1a1a1a] active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-8 pt-0 space-y-6">
            {/* Invite */}
            <div className="space-y-3">
               <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase pl-1">Invite Collaborators</label>
               <div className="flex gap-2">
                 <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input 
                     type="text" 
                     placeholder="Username or Member Name..."
                     className="w-full bg-[#1a1a1a] rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none transition-all font-medium text-white border border-transparent focus:border-white/10"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                   />
                 </div>
                 <button 
                  onClick={handleInvite}
                  disabled={isInviting || !search.trim()}
                  className="bg-white text-black font-bold px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                 >
                   {isInviting ? '...' : 'Invite'}
                 </button>
               </div>
               {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{error}</p>}
            </div>

            {/* List */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase pl-1">Project Members</label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {collaborators.map((c, index) => (
                  <div key={c?._id || index} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#1a1a1a] transition-all group">
                    <div className="flex items-center gap-3">
                       <img src={c.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.uid}`} alt="" className="w-10 h-10 rounded-full shadow-sm bg-black object-cover" />
                       <div>
                         <p className="font-bold text-sm text-white">{c.user?.displayName || c.user?.username}</p>
                         <div className="flex items-center gap-1.5 mt-0.5">
                           <Shield className="w-3 h-3 text-accent" />
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{c.role}</span>
                         </div>
                       </div>
                    </div>
                    {c.role !== 'Owner' && (
                      <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-black rounded-xl transition-all group/btn">
                        <UserX className="w-4 h-4 text-gray-500 group-hover/btn:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="bg-[#1a1a1a] rounded-[2rem] p-5 flex items-start gap-4 border border-white/5 shadow-inner">
               <div className="w-12 h-12 bg-black rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg">
                 <Shield className="w-6 h-6 text-accent" />
               </div>
               <div>
                 <p className="text-xs font-bold text-white mb-1">Collaboration Sync</p>
                 <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Shared reels and real-time editing. Invite up to 5 collaborators to sync director workflows.</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
