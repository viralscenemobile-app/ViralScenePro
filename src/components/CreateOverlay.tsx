import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Layers, BookOpen, Wand2, Film } from 'lucide-react';

interface CreateOverlayProps {
  onClose: () => void;
  onSelectTool: (id: string) => void;
}

export default function CreateOverlay({ onClose, onSelectTool }: CreateOverlayProps) {
  const tools = [
    { id: 'series', title: 'Series Studio', desc: 'Storyboard & stitch multiple shots', icon: Film, gradient: 'bg-gradient-to-br from-blue-600/20 to-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400' },
    { id: 'video', title: 'AI Video', desc: 'Text/Image to 15s HD video', icon: Video, gradient: 'bg-gradient-to-br from-purple-600/20 to-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400' },
    { id: 'image', title: 'AI Image', desc: 'FLUX-powered text to image', icon: ImageIcon, gradient: 'bg-gradient-to-br from-pink-600/20 to-pink-500/5', border: 'border-pink-500/20', text: 'text-pink-400' },
    { id: 'novel', title: 'AI Novel', desc: 'Chapter-by-chapter story gen', icon: BookOpen, gradient: 'bg-gradient-to-br from-emerald-600/20 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { id: 'recreate', title: 'Recreate', desc: 'Extract style & remix', icon: Wand2, gradient: 'bg-gradient-to-br from-orange-600/20 to-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400' },
    { id: 'element', title: 'Element Creator', desc: 'Train characters & props', icon: Layers, gradient: 'bg-gradient-to-br from-amber-600/20 to-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full md:w-[600px] lg:w-[800px] bg-panel border-t md:border border-border rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:mb-10 lg:mb-20"
        >
          <div className="flex justify-between items-center px-8 py-7 border-b border-white/5 bg-white/[0.01]">
            <div>
              <h2 className="text-2xl font-bold font-sans tracking-tight">Create Station</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Select your creative engine</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all border border-white/5">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="px-6 py-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => onSelectTool(tool.id)} className={`flex flex-col gap-3 p-4 rounded-[2rem] border ${tool.border} ${tool.gradient} hover:scale-[1.02] active:scale-95 transition-all text-center items-center group shadow-sm`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.gradient} border ${tool.border} group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-6 h-6 ${tool.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5 group-hover:text-white transition-colors leading-tight tracking-tight">{tool.title}</h3>
                  <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider leading-tight px-2">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
