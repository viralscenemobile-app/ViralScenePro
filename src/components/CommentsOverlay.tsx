import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';

interface CommentsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commentsCount: string;
}

export default function CommentsOverlay({ isOpen, onClose, commentsCount }: CommentsOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md h-[70vh] bg-panel border-t border-border rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-10"
          >
            <div className="flex justify-between items-center px-8 py-6 border-b border-white/5">
              <h2 className="text-xl font-bold font-sans tracking-tight">{commentsCount} Comments</h2>
              <button 
                onClick={onClose} 
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-3">
                 <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} className="w-full h-full object-cover bg-white/5" alt="user" />
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-200">user_{i}</span>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-300">This shot is absolutely incredible! Which elements did you use for the foreground?</p>
                    <div className="flex items-center gap-4 mt-2">
                       <button className="text-xs text-gray-500 font-bold hover:text-white">Reply</button>
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-1 shrink-0 pt-2">
                   <Heart className="w-4 h-4 text-gray-400" />
                   <span className="text-xs text-gray-500 font-medium">{Math.floor(Math.random() * 50)}</span>
                 </div>
              </div>
            ))}
          </div>

          {/* Sticky Input Bar */}
          <div className="absolute bottom-0 w-full p-4 bg-panel border-t border-border backdrop-blur-md">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Add a comment..." 
                 className="w-full bg-base border border-border rounded-full py-3 px-5 pr-14 text-sm text-white focus:outline-none focus:border-accent transition-colors"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors">
                  <Send className="w-4 h-4" />
               </button>
             </div>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
