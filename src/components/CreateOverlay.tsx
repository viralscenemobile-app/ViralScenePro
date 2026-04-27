import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Layers, BookOpen, Wand2 } from 'lucide-react';

interface CreateOverlayProps {
  onClose: () => void;
  onSelectTool: (id: string) => void;
}

export default function CreateOverlay({ onClose, onSelectTool }: CreateOverlayProps) {
  const tools = [
    { id: 'omni', title: 'Omni Studio', desc: 'Multi-shot storyboard with voice', icon: Layers, color: 'bg-accent/20 border border-accent/30', text: 'text-accent' },
    { id: 'video', title: 'AI Video', desc: 'Text/Image to 15s HD video', icon: Video, color: 'bg-white/5 border border-white/10', text: 'text-white' },
    { id: 'image', title: 'AI Image', desc: 'FLUX-powered text to image', icon: ImageIcon, color: 'bg-white/5 border border-white/10', text: 'text-white' },
    { id: 'novel', title: 'AI Novel', desc: 'Chapter-by-chapter story gen', icon: BookOpen, color: 'bg-white/5 border border-white/10', text: 'text-white' },
    { id: 'recreate', title: 'Recreate', desc: 'Extract style & remix', icon: Wand2, color: 'bg-white/5 border border-white/10', text: 'text-white' },
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
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-panel border-t border-border rounded-t-[2.5rem] overflow-hidden pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-between items-center px-6 py-6 border-b border-border">
            <h2 className="text-xl font-bold font-sans tracking-tight">Create</h2>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="px-6 py-6 grid gap-3">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => onSelectTool(tool.id)} className="flex gap-4 p-4 rounded-3xl border border-white/[0.04] bg-white/[0.02] hover:border-white/10 hover:bg-white/5 active:scale-95 transition-all text-left items-center group shadow-sm">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color}`}>
                  <tool.icon className={`w-6 h-6 ${tool.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-0.5 group-hover:text-accent transition-colors">{tool.title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
