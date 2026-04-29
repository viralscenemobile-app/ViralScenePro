import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Send } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

interface CommentsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commentsCount: string;
  videoId?: string;
}

export default function CommentsOverlay({ isOpen, onClose, commentsCount, videoId }: CommentsOverlayProps) {
  const [commentText, setCommentText] = useState("");
  const { convexUserId } = useContext(AuthContext);

  const comments = useQuery(
    api.videos.getComments,
    videoId ? { videoId: videoId as any } : "skip"
  );
  
  const addComment = useMutation(api.videos.addComment);

  const handleSend = async () => {
    if (!commentText.trim() || !videoId || !convexUserId) return;
    try {
      await addComment({
        videoId: videoId as any,
        authorId: convexUserId as any,
        text: commentText,
      });
      setCommentText('');
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

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
            className="relative w-full max-w-md h-[70vh] bg-[#1a1a1a] border-t border-[#2a2a2a] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl z-10"
          >
            <div className="flex justify-between items-center px-8 py-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold font-sans tracking-tight">{comments?.length || commentsCount} Comments</h2>
              <button 
                onClick={onClose} 
                className="p-2 bg-[#2a2a2a] rounded-full hover:bg-[#333] active:scale-95 transition-all"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
            {comments && comments.length > 0 ? (
               comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                   <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 bg-black">
                      <img src={comment.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorId}`} className="w-full h-full object-cover" alt="user" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-200">{comment.author?.username || comment.author?.displayName || 'User'}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                         <button className="text-xs text-gray-500 font-bold hover:text-white transition-colors">Reply</button>
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-1 shrink-0 pt-2">
                     <button className="hover:scale-110 active:scale-95 transition-transform group">
                        <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                     </button>
                     <span className="text-xs text-gray-500 font-medium">{comment.likes}</span>
                   </div>
                </div>
              ))
            ) : (
               <div className="h-40 flex items-center justify-center text-gray-500 uppercase font-bold tracking-widest text-[10px]">
                 Be the first to comment
               </div>
            )}
          </div>

          {/* Sticky Input Bar */}
          <div className="absolute bottom-0 w-full p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
             <div className="relative">
               <input 
                 type="text" 
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Add a comment..." 
                 className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-full py-3 px-5 pr-14 text-sm text-white focus:outline-none focus:border-accent transition-colors"
               />
               <button 
                 onClick={handleSend}
                 disabled={!commentText.trim() || !convexUserId}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
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
