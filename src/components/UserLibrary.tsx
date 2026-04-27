import React from 'react';
import { Layers, Bookmark, History, LayoutGrid, Clock, Play, BookOpen, Image as ImageIcon, Sparkles, ChevronRight, Plus } from 'lucide-react';

export default function UserLibrary({ onOpenTool }: { onOpenTool?: (toolId: string) => void }) {
  const [activeTab, setActiveTab] = React.useState('elements');

  const tabs = [
    { id: 'elements', label: 'Elements', icon: Layers },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'novels', label: 'Novels', icon: BookOpen },
  ];

  return (
    <div className="w-full h-full bg-base flex flex-col md:pb-0">
      {/* Premium Header */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-6">
           <div>
              <h1 className="text-3xl font-bold font-sans tracking-tight mb-1">Library</h1>
              <p className="text-gray-500 text-xs font-medium">Manage your trained models and generations.</p>
           </div>
           <div className="hidden lg:flex gap-4 items-center px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="text-center border-r border-white/10 pr-5">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Models</p>
                 <p className="text-md font-bold text-white">12</p>
              </div>
              <div className="text-center border-r border-white/10 pr-5 pl-2">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Credits</p>
                 <p className="text-md font-bold text-accent">1.2K</p>
              </div>
              <div className="text-center pl-2">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Storage</p>
                 <p className="text-md font-bold text-white">84%</p>
              </div>
           </div>
        </div>
        
        <div className="flex gap-1.5 p-1 bg-black/40 rounded-full border border-white/5 self-start w-max overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-1.5 px-5 py-2 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest whitespace-nowrap ${
                 activeTab === tab.id ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-gray-500 hover:text-gray-300'
               }`}
             >
               <tab.icon className="w-3.5 h-3.5" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
        {activeTab === 'elements' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-bold font-sans tracking-tight">AI Models</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Custom visual tokens</p>
              </div>
              <button onClick={() => onOpenTool?.('element')} className="bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-bold px-4 py-2 rounded-full border border-accent/20 transition-all flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> NEW
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
               {[
                 {name: 'Cyberpunk Protag', type: 'Character', img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200', status: 'Ready'},
                 {name: 'Neon Bike', type: 'Prop', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200', status: 'Ready'},
                 {name: 'Grim Reaper', type: 'Character', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=200', status: 'Training (80%)'},
                 {name: 'Dark Narrator', type: 'Voice', img: null, status: 'Ready'},
                 {name: 'Synth Runner', type: 'Character', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=200', status: 'Ready'},
               ].map((el, i) => (
                 <div key={i} className="group cursor-pointer">
                   <div className="aspect-square bg-white/[0.03] border border-white/5 rounded-[2.5rem] relative overflow-hidden transition-all group-hover:border-accent/40 mb-4">
                     {el.img ? (
                       <img src={el.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={el.name} />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/[0.01]">
                         <Sparkles className="w-12 h-12" />
                       </div>
                     )}
                     <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-gray-300">
                          {el.type}
                        </span>
                     </div>
                     <div className="absolute bottom-4 right-4">
                        <button className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 hover:bg-accent transition-all group">
                           <Sparkles className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                        </button>
                     </div>
                   </div>
                   <div className="px-2">
                     <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{el.name}</h3>
                     <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${el.status.includes('Training') ? 'text-orange-400 animate-pulse' : 'text-gray-500'}`}>{el.status}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-8">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight">AI Shorts</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Cinematic motion generations</p>
              </div>
              <button onClick={() => onOpenTool?.('video')} className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-5 py-2.5 rounded-full border border-white/10 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create New
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[
                 {title: 'Neon Drift Shot', duration: '4s', img: 'https://images.unsplash.com/photo-1549416558-7c858b975871?w=300'},
                 {title: 'Cyberpunk Run', duration: '15s', img: 'https://images.unsplash.com/photo-1515281239448-2abe3297f5f9?w=300'},
                 {title: 'Rainy Night', duration: '8s', img: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=300'},
                 {title: 'Void Gaze', duration: '5s', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300'},
               ].map((v, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="aspect-[9/16] rounded-[2.5rem] overflow-hidden relative shadow-2xl transition-all group-hover:scale-[1.02] active:scale-95 border border-white/5">
                      <img src={v.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={v.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-300 border border-white/10">
                        {v.duration}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-current" />
                           </div>
                           <p className="font-bold text-xs text-white truncate">{v.title}</p>
                        </div>
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-white tracking-widest">Edit</button>
                           <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-white tracking-widest">Share</button>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
               <button 
                 onClick={() => onOpenTool?.('video')}
                 className="aspect-[9/16] rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-white/20 transition-all text-gray-600 hover:text-gray-400"
               >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                     <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Start Project</span>
               </button>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex justify-between items-center mb-8">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight">Image Galley</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Your high-res generations</p>
              </div>
              <div className="flex gap-3">
                 <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white"><LayoutGrid className="w-5 h-5" /></button>
                 <button onClick={() => onOpenTool?.('image')} className="bg-accent text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-lg shadow-accent/20 flex items-center gap-2 transition-all active:scale-95">
                    <Sparkles className="w-4 h-4" /> Generate
                 </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
               {[...Array(16)].map((_, i) => (
                 <div key={i} className="aspect-square rounded-[2rem] overflow-hidden relative group cursor-pointer border border-white/5">
                    <img src={`https://images.unsplash.com/photo-[SIG]?w=400&q=80&sig=${i+40}`.replace('[SIG]', '1578632767115-351597cf2477')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generation" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 mb-2">
                          <Plus className="w-5 h-5 text-white" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'novels' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-8">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight">Manuscripts</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Multi-chapter stories</p>
              </div>
              <button onClick={() => onOpenTool?.('novel')} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Start Novel
              </button>
            </div>
            <div className="flex flex-col gap-4">
               {[
                 {title: 'The Awakening', chapters: 12, lastEdited: '2 days ago', progress: 85, color: 'bg-purple-500'},
                 {title: 'Neon Gods', chapters: 4, lastEdited: 'Last week', progress: 30, color: 'bg-blue-500'},
                 {title: 'Copper Sky', chapters: 1, lastEdited: 'Today', progress: 5, color: 'bg-orange-500'},
               ].map((n, i) => (
                 <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-xl">
                    <div className="flex items-center gap-6">
                       <div className={`w-16 h-16 ${n.color} bg-opacity-20 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden`}>
                          <div className={`absolute top-0 left-0 w-full h-full ${n.color} opacity-20`} />
                          <Bookmark className={`w-8 h-8 ${n.color.replace('bg-', 'text-')} opacity-80`} />
                       </div>
                       <div>
                          <h3 className="font-bold text-xl text-gray-200 group-hover:text-white transition-colors mb-2">{n.title}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">{n.chapters} Chapters</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                               <Clock className="w-3 h-3" />
                               <span>Edited {n.lastEdited}</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                       <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{n.progress}%</span>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${n.color} transition-all duration-1000`} style={{ width: `${n.progress}%` }} />
                       </div>
                    </div>

                    <button className="p-4 bg-white/5 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all text-gray-500">
                       <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
