import React from 'react';
import { Layers, Bookmark, History, LayoutGrid } from 'lucide-react';

export default function UserLibrary() {
  const [activeTab, setActiveTab] = React.useState('elements');

  const tabs = [
    { id: 'elements', label: 'Elements' },
    { id: 'videos', label: 'Videos' },
    { id: 'images', label: 'Images' },
    { id: 'novels', label: 'Novels' },
  ];

  return (
    <div className="w-full h-full bg-black flex flex-col md:pb-0">
      <div className="px-4 py-6 border-b border-border bg-panel">
        <h1 className="text-2xl font-bold font-sans tracking-tight mb-6">Library</h1>
        
        <div className="flex gap-2 p-1.5 bg-black rounded-xl border border-border">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                 activeTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-20 lg:p-6">
        {activeTab === 'elements' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">My Elements Studio</h2>
              <button className="text-accent text-sm font-bold">+ New Element</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {[
                 {name: 'Cyberpunk Protag', type: 'Character', img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200'},
                 {name: 'Neon Bike', type: 'Prop', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200'},
                 {name: 'Voice: Dark Narrator', type: 'Audio', img: null},
               ].map((el, i) => (
                 <div key={i} className="bg-panel border border-border rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all shadow-sm">
                   <div className="aspect-square bg-black relative">
                     {el.img ? (
                       <img src={el.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700" alt={el.name} />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white/5 group-hover:bg-white/10 transition-colors">
                         <Layers className="w-8 h-8" />
                       </div>
                     )}
                     <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] uppercase font-bold text-gray-300">
                       {el.type}
                     </div>
                   </div>
                   <div className="p-3 bg-panel">
                     <h3 className="font-bold text-sm truncate">{el.name}</h3>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'elements' && (
           <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 min-h-[300px]">
              <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-semibold mb-1">Nothing here yet</p>
              <p className="text-sm">Create something new to see it here</p>
           </div>
        )}
      </div>
    </div>
  );
}
