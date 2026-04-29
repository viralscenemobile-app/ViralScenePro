import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Layers, BookOpen, Wand2, Film } from 'lucide-react';

interface CreateOverlayProps {
  onClose: () => void;
  onSelectTool: (id: string) => void;
}

export default function CreateOverlay({ onClose, onSelectTool }: CreateOverlayProps) {
  const tools = [
    { id: 'series', title: 'Series Studio', desc: 'Storyboard & stitch multiple shots', icon: Film, gradient: 'bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-blue-200' },
    { id: 'video', title: 'AI Video', desc: 'Text/Image to 15s HD video', icon: Video, gradient: 'bg-gradient-to-br from-[#7e22ce] to-[#581c87]', border: 'border-[#7e22ce]', text: 'text-purple-200' },
    { id: 'image', title: 'AI Image', desc: 'FLUX-powered text to image', icon: ImageIcon, gradient: 'bg-gradient-to-br from-[#be185d] to-[#831843]', border: 'border-[#be185d]', text: 'text-pink-200' },
    { id: 'novel', title: 'AI Novel', desc: 'Chapter-by-chapter story gen', icon: BookOpen, gradient: 'bg-gradient-to-br from-[#047857] to-[#064e3b]', border: 'border-[#047857]', text: 'text-emerald-200' },
    { id: 'recreate', title: 'Recreate', desc: 'Extract style & remix', icon: Wand2, gradient: 'bg-gradient-to-br from-[#c2410c] to-[#7c2d12]', border: 'border-[#c2410c]', text: 'text-orange-200' },
    { id: 'element', title: 'Element Creator', desc: 'Train characters & props', icon: Layers, gradient: 'bg-gradient-to-br from-[#b45309] to-[#78350f]', border: 'border-[#b45309]', text: 'text-amber-200' },
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
          className="absolute inset-0 bg-black"
        />

        {/* Modal */}
          <motion.div 
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full md:w-[600px] lg:w-[800px] bg-[#1a1a1a] rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden pb-8 shadow-2xl md:mb-10 lg:mb-20"
        >
          <div className="flex justify-between items-center px-8 py-7 bg-[#1a1a1a]">
            <div>
              <h2 className="text-2xl font-bold font-sans tracking-tight">Create Station</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Select your creative engine</p>
            </div>
            <button onClick={onClose} className="p-3 bg-[#2a2a2a] rounded-full hover:bg-[#333] active:scale-95 transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="px-6 py-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => onSelectTool(tool.id)} className={`flex flex-col gap-2.5 p-3.5 rounded-[1.75rem] ${tool.gradient} hover:scale-[1.02] active:scale-95 transition-all text-center items-center group shadow-lg`}>
                <div className={`group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-8 h-8 ${tool.text}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] mb-0.5 group-hover:text-white transition-colors leading-tight tracking-tight text-white/90">{tool.title}</h3>
                  <p className="text-[8px] text-white/50 font-medium uppercase tracking-widest leading-tight px-1">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
