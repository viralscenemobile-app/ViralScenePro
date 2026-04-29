import React, { useContext } from 'react';
import { Layers, Bookmark, History, LayoutGrid, Clock, Play, BookOpen, Image as ImageIcon, Sparkles, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function UserLibrary({ onOpenTool }: { onOpenTool?: (toolId: string) => void }) {
  const [activeTab, setActiveTab] = React.useState('elements');
  const { user: firebaseUser, convexUserId } = useContext(AuthContext);

  const convexUser = useQuery(
    api.users.getUser,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const tabs = [
    { id: 'elements', label: 'Elements', icon: Layers },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'series', label: 'Series', icon: LayoutGrid },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'novels', label: 'Novels', icon: BookOpen },
  ];

  const userVideos = useQuery(
    api.videos.getVideos,
    convexUserId ? { authorId: convexUserId as any } : "skip"
  );

  const elements = useQuery(
    api.users.getElements,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const images = useQuery(
    api.users.getImages,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const novels = useQuery(
    api.users.getNovels,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const series = useQuery(
    api.users.getSeries,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  if (userVideos === undefined || elements === undefined || images === undefined || novels === undefined || series === undefined) {
    return <div className="p-10 text-center text-gray-500">Loading library...</div>;
  }

  const deleteElement = useMutation(api.users.deleteElement);
  const deleteVideo = useMutation(api.videos.deleteVideo);
  const deleteImage = useMutation(api.videos.deleteImage);
  const deleteNovel = useMutation(api.users.deleteNovel);
  const deleteSeries = useMutation(api.users.deleteSeries);
  
  const handleDelete = async (id: string, type: 'element' | 'video' | 'image' | 'novel' | 'series', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'element') await deleteElement({ elementId: id as any });
      if (type === 'video') await deleteVideo({ videoId: id as any });
      if (type === 'image') await deleteImage({ imageId: id as any });
      if (type === 'novel') await deleteNovel({ novelId: id as any });
      if (type === 'series') await deleteSeries({ seriesId: id as any });
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full bg-black flex flex-col md:pb-0">
      {/* Premium Header */}
      <div className="px-6 pt-10 pb-8 bg-black">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 max-w-7xl mx-auto w-full">
           <div>
              <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white leading-none mb-1.5">Library</h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Manage models & creations.</p>
           </div>
           <div className="hidden lg:flex gap-1.5 items-center p-1 bg-[#1a1a1a] rounded-[1.5rem] shadow-xl">
              <div className="px-6 py-3 bg-black rounded-[1.25rem] shadow-inner text-center min-w-[90px]">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Models</p>
                 <p className="text-sm font-bold text-white">{elements.length}</p>
              </div>
              <div className="px-6 py-3 bg-black rounded-[1.25rem] shadow-inner text-center min-w-[90px]">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Credits</p>
                 <p className="text-sm font-bold text-white">{convexUser?.credits ?? 0}</p>
              </div>
              <div className="px-6 py-3 bg-black rounded-[1.25rem] shadow-inner text-center min-w-[90px]">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Storage</p>
                 <p className="text-sm font-bold text-white">{Math.min(100, Math.floor((userVideos.length + images.length) * 0.5))}%</p>
              </div>
           </div>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-black rounded-full self-start w-max overflow-x-auto no-scrollbar max-w-7xl mx-auto border border-white/5">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-6 py-2.5 text-[9px] font-bold rounded-full transition-all uppercase tracking-[0.25em] whitespace-nowrap ${
                 activeTab === tab.id ? 'bg-[#2e1065] text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-500 hover:text-gray-300 hover:bg-[#222]'
               }`}
             >
               <tab.icon className="w-3.5 h-3.5" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24 max-w-7xl mx-auto w-full">
        {activeTab === 'elements' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-8 px-2">
              <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1">AI Models</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Custom visual tokens</p>
              </div>
              <button 
                onClick={() => onOpenTool?.('element')} 
                className="bg-[#2e1065] hover:bg-[#3b1580] text-white text-[10px] font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> New Model
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {elements.map((el, i) => (
                 <div key={el._id} className="group cursor-pointer">
                   <div className="aspect-square bg-[#1a1a1a] rounded-[2.5rem] relative overflow-hidden transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] shadow-xl mb-4">
                     {el.img ? (
                       <img src={el.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={el.name} />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-800 bg-black shadow-inner">
                         <Sparkles className="w-14 h-14" />
                       </div>
                     )}
                     <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase font-bold text-gray-300 shadow-sm">
                          {el.type}
                        </span>
                     </div>
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={(e) => handleDelete(el._id, 'element', e)} className="p-2 bg-black/40 hover:bg-black/80 rounded-full transition-colors text-gray-400 hover:text-red-500 shadow-sm">
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                     </div>
                     <div className="absolute bottom-4 right-4">
                        <button className="w-10 h-10 bg-[#2e1065] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                           <Sparkles className="w-5 h-5 text-white" />
                        </button>
                     </div>
                   </div>
                   <div className="px-4">
                     <h3 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors tracking-tight leading-none mb-1.5">{el.name}</h3>
                     <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${el.status.includes('Training') ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`}>{el.status}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-10 px-2">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1">AI Shorts</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Cinematic motion generations</p>
              </div>
              <button onClick={() => onOpenTool?.('video')} className="bg-[#1a1a1a] hover:bg-[#222] text-white text-[10px] font-bold px-6 py-3 rounded-full transition-all flex items-center gap-2 uppercase tracking-widest shadow-xl">
                <Plus className="w-4 h-4" /> Create New
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {userVideos.map((v) => (
                 <div key={v._id} className="group cursor-pointer">
                    <div className="aspect-[9/16] rounded-[3rem] overflow-hidden relative shadow-2xl transition-all group-hover:scale-[1.02] active:scale-95 bg-[#1a1a1a]">
                      <img src={v.thumbnailUrl || v.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt={v.prompt || "Video"} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={(e) => handleDelete(v._id, 'video', e)} className="p-2 bg-black/40 hover:bg-black/80 rounded-full transition-colors text-gray-400 hover:text-red-500 shadow-sm backdrop-blur-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg">
                        {v.status === 'completed' ? '15s' : v.status}
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-3.5 h-3.5 text-white fill-current" />
                           </div>
                           <p className="font-bold text-sm text-white tracking-tight truncate">{v.prompt || "Generated Video"}</p>
                        </div>
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                           <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.host); }} className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-white transition-colors z-10">Share</button>
                        </div>
                      </div>
                    </div>
                  </div>
               ))}
               <button 
                 onClick={() => onOpenTool?.('video')}
                 className="aspect-[9/16] rounded-[3rem] bg-[#1a1a1a] flex flex-col items-center justify-center gap-5 hover:bg-[#222] transition-all group shadow-xl"
               >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <Plus className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Start Project</span>
               </button>
            </div>
          </div>
        )}

        {activeTab === 'series' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-10 px-2">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1">Cinematic Series</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Drafts and published productions</p>
              </div>
              <button onClick={() => onOpenTool?.('series')} className="bg-[#2e1065] text-white text-[10px] font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest transition-all">
                <Plus className="w-4 h-4" /> New Series
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((s) => (
                <div key={s._id} onClick={() => onOpenTool?.(`series:${s._id}`)} className="group cursor-pointer bg-[#1a1a1a] rounded-[2.5rem] p-6 hover:bg-[#222] transition-all shadow-xl flex flex-col gap-6">
                   <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-black/40 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                           </div>
                         ))}
                      </div>
                      <div className="flex gap-2 items-center">
                         <span className={`text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-inner ${s.status === 'draft' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                           {s.status}
                         </span>
                         <button onClick={(e) => handleDelete(s._id, 'series', e)} className="p-1.5 rounded-full hover:bg-red-500/80 transition-colors text-gray-500 hover:text-white">
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                   </div>
                   
                   <div>
                      <h3 className="font-bold text-xl text-white tracking-tight leading-none mb-2 group-hover:text-accent transition-colors">{s.title}</h3>
                      <div className="flex items-center gap-4 text-gray-500">
                         <span className="text-[10px] font-bold uppercase tracking-widest">{s.shots.length} Shots</span>
                         <span className="w-1 h-1 bg-gray-800 rounded-full" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{s.model}</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-gray-600" />
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{new Date(s.lastEditedAt).toLocaleDateString()}</span>
                      </div>
                      <button className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         Continue <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              ))}
              {series.length === 0 && (
                <div 
                  onClick={() => onOpenTool?.('series')}
                  className="bg-[#1a1a1a] border-2 border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-white/10 transition-all opacity-40 hover:opacity-100"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Draft a Series</span>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'images' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex justify-between items-center mb-10 px-2">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1">Gallery</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">High-res generations</p>
              </div>
              <div className="flex gap-4">
                 <button className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-gray-500 hover:text-white shadow-xl"><LayoutGrid className="w-5 h-5" /></button>
                 <button onClick={() => onOpenTool?.('image')} className="bg-[#2e1065] text-white text-[10px] font-bold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest active:scale-95 transition-all">
                    <Sparkles className="w-4 h-4" /> Generate
                 </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
               {images.map((img) => (
                 <div key={img._id} className="aspect-square rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-xl bg-[#1a1a1a]">
                    <img src={img.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" alt="Generation" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => handleDelete(img._id, 'image', e)} className="p-1.5 bg-black/40 hover:bg-black/80 rounded-full transition-colors text-gray-300 hover:text-red-500 shadow-sm backdrop-blur-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 shadow-2xl">
                          <Plus className="w-6 h-6 text-white" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'novels' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-10 px-2">
               <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mb-1">Manuscripts</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Multi-chapter stories</p>
              </div>
              <button 
                onClick={() => onOpenTool?.('novel')} 
                className="bg-[#2e1065] hover:bg-[#3b1580] text-white text-[10px] font-bold px-8 py-3.5 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-widest transition-all"
              >
                <BookOpen className="w-4 h-4" /> Start Novel
              </button>
            </div>
            <div className="flex flex-col gap-6">
               {novels.map((n) => (
                 <div key={n._id} onClick={() => onOpenTool?.(`novel:${n._id}`)} className="cursor-pointer p-8 bg-[#1a1a1a] rounded-[3rem] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:bg-[#222] transition-all shadow-xl">
                    <div className="flex items-center gap-8">
                       <div className={`w-20 h-20 ${n.color || 'bg-purple-600'} bg-opacity-20 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-inner`}>
                          <div className={`absolute top-0 left-0 w-full h-full ${n.color || 'bg-purple-600'} opacity-40`} />
                          <Bookmark className={`w-10 h-10 ${(n.color || 'bg-purple-600').replace('bg-', 'text-')} opacity-90`} />
                       </div>
                       <div>
                          <h3 className="font-bold text-2xl text-white tracking-tight mb-2 leading-none">{n.title}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-white bg-black/40 px-4 py-1.5 rounded-full shadow-inner">{n.chapters} Chapters</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                               <Clock className="w-3.5 h-3.5" />
                               <span>{new Date(n.lastEditedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[240px]">
                       <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] px-1">
                          <span>Progress</span>
                          <span>{n.progress}%</span>
                       </div>
                       <div className="w-full bg-black h-2 rounded-full overflow-hidden shadow-inner p-0.5">
                          <div className={`h-full ${n.color || 'bg-purple-600'} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: `${n.progress}%` }} />
                       </div>
                    </div>

                     <div className="flex items-center gap-4">
                        <button onClick={(e) => handleDelete(n._id, 'novel', e)} className="w-14 h-14 bg-black rounded-2xl hover:bg-red-500/80 hover:text-white transition-all text-gray-600 shadow-inner flex items-center justify-center">
                           <Trash2 className="w-6 h-6" />
                        </button>
                        <button className="w-14 h-14 bg-black rounded-2xl group-hover:bg-[#2e1065] group-hover:text-white transition-all text-gray-600 shadow-inner flex items-center justify-center">
                           <ChevronRight className="w-7 h-7" />
                        </button>
                     </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
