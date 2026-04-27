import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Info, AlertCircle, Sparkles } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  desc: string;
  type: 'info' | 'success' | 'warning' | 'ai';
  time: string;
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Video Rendered', desc: 'Your series "Cyberpunk Dreams" is ready to view.', type: 'ai', time: '2m ago' },
  { id: 2, title: 'Achievement Unlocked', desc: 'You unlocked "Master Director" badge!', type: 'success', time: '10m ago' },
  { id: 3, title: 'System Update', desc: 'New FLUX model is now available in AI Image.', type: 'info', time: '1h ago' },
];

export default function NotificationCenter({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-start justify-end md:p-6 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 pointer-events-auto"
        />

        <motion.div 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="relative w-full max-w-sm h-full md:h-auto md:max-h-[80vh] bg-panel border-l md:border border-white/10 md:rounded-[2.5rem] flex flex-col shadow-2xl pointer-events-auto mt-0 md:mt-2"
        >
          <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold font-sans tracking-tight">Notifications</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
             {mockNotifications.map((n) => (
               <div key={n.id} className="flex gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all group relative overflow-hidden border border-transparent hover:border-white/5">
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                    n.type === 'ai' ? 'bg-accent/20 text-accent' :
                    n.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {n.type === 'ai' ? <Sparkles className="w-5 h-5" /> : 
                     n.type === 'success' ? <Check className="w-5 h-5" /> : 
                     <Info className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-gray-200">{n.title}</p>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
               </div>
             ))}

             {mockNotifications.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <Bell className="w-8 h-8 text-gray-700" />
                   </div>
                   <p className="text-gray-500 font-bold text-sm">No notifications yet</p>
                </div>
             )}
          </div>

          <div className="p-6 border-t border-white/5">
             <button className="w-full py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
               Mark all as read
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
