import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Link, Mail, Shield, UserX, Check } from 'lucide-react';

interface CollaborationOverlayProps {
  onClose: () => void;
  collaborators: any[];
}

export default function CollaborationOverlay({ onClose, collaborators }: CollaborationOverlayProps) {
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-panel border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight">Collaboration</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage project access</p>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Invite */}
            <div className="space-y-3">
               <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase pl-1">Invite Collaborators</label>
               <div className="flex gap-2">
                 <div className="relative flex-1">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input 
                     type="email" 
                     placeholder="Enter email address..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium text-white"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                   />
                 </div>
                 <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 rounded-2xl transition-all active:scale-95">
                   Invite
                 </button>
               </div>
               <button 
                 onClick={handleCopyLink}
                 className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 text-sm font-bold text-gray-300"
               >
                 {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
                 {copied ? 'Link Copied!' : 'Copy Invite Link'}
               </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase pl-1">Project Members</label>
              <div className="space-y-1">
                {collaborators.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-3">
                       <img src={c.avatar} alt="" className="w-10 h-10 rounded-full border border-white/10 shadow-sm" />
                       <div>
                         <p className="font-bold text-sm text-white">{c.name}</p>
                         <div className="flex items-center gap-1.5 mt-0.5">
                           <Shield className="w-3 h-3 text-blue-500/70" />
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{c.role}</span>
                         </div>
                       </div>
                    </div>
                    {c.role !== 'Owner' && (
                      <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all group/btn">
                        <UserX className="w-4 h-4 text-gray-500 group-hover/btn:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2rem] p-5 flex items-start gap-4">
               <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex-shrink-0 flex items-center justify-center">
                 <Shield className="w-5 h-5 text-blue-400" />
               </div>
               <div>
                 <p className="text-xs font-bold text-white mb-1">Collaboration Perks</p>
                 <p className="text-[11px] text-blue-300/70 leading-relaxed font-medium">Shared credit pools and real-time editing. Invite up to 5 collaborators on the Starter plan.</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
