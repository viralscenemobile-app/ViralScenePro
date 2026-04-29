import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Info, AlertCircle, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function NotificationCenter({ onClose }: { onClose: () => void }) {
  const { convexUserId } = useContext(AuthContext);
  const notifications = useQuery(
    api.users.getNotifications,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];
  
  const markAllRead = useMutation(api.users.markAllNotificationsRead);

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
          className="relative w-full max-w-sm h-full md:h-auto md:max-h-[80vh] bg-[#1a1a1a] border-l md:border border-[#2a2a2a] md:rounded-[2.5rem] flex flex-col shadow-2xl pointer-events-auto mt-0 md:mt-2"
        >
          <div className="flex justify-between items-center px-8 py-6 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold font-sans tracking-tight">Notifications</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-[#2a2a2a] rounded-full hover:bg-[#333] active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
             {notifications.map((n) => (
               <div key={n._id} className="flex gap-4 p-4 rounded-3xl hover:bg-[#2a2a2a] transition-all group relative overflow-hidden border border-transparent hover:border-[#2a2a2a]">
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                    n.type === 'ai' ? 'bg-[#2e1065] text-white' :
                    n.type === 'like' ? 'bg-red-900 text-red-200' :
                    'bg-blue-900 text-blue-200'
                  }`}>
                    {n.type === 'ai' ? <Sparkles className="w-5 h-5" /> : 
                     n.type === 'like' ? <Check className="w-5 h-5" /> : 
                     <Info className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-gray-200 capitalize">{n.type}</p>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
               </div>
             ))}

             {notifications.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                      <Bell className="w-8 h-8 text-gray-700" />
                   </div>
                   <p className="text-gray-500 font-bold text-sm">No notifications yet</p>
                </div>
             )}
          </div>

          <div className="p-6 border-t border-[#2a2a2a]">
             <button onClick={() => markAllRead(convexUserId ? { userId: convexUserId as any } : {} as any).catch(console.error)} className="w-full py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
               Mark all as read
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
