import { Home, PlusSquare, Search, Library, User } from 'lucide-react';
import React from 'react';
import Feed from './components/Feed';
import Explore from './components/Explore';
import CreateOverlay from './components/CreateOverlay';
import Profile from './components/Profile';
import UserLibrary from './components/UserLibrary';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SeriesStudio from './components/SeriesStudio';
import AINovel from './components/AINovel';
import AIVideo from './components/AIVideo';
import AIImage from './components/AIImage';
import Recreate from './components/Recreate';
import ElementCreator from './components/ElementCreator';
import NotificationCenter from './components/NotificationCenter';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('feed');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [currentTool, setCurrentTool] = React.useState<string | null>(null);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabChange = (id: string) => {
    if (id === 'create') {
      setIsCreateOpen(true);
    } else {
      setActiveTab(id);
      setCurrentTool(null);
    }
  };

  const handleOpenTool = (toolId: string) => {
    setIsCreateOpen(false);
    setCurrentTool(toolId);
  };

  // Render the active tool if selected
  if (currentTool) {
    return (
      <div className="flex h-full w-full bg-base text-white overflow-hidden">
         <main className="flex-1 relative flex flex-col items-center overflow-hidden w-full mx-auto bg-base">
            <div className="px-4 md:px-8 py-4 border-b border-border flex items-center justify-between w-full bg-base/90 backdrop-blur-xl z-20 shadow-sm sticky top-0">
              <button 
                onClick={() => setCurrentTool(null)} 
                className="text-gray-400 hover:text-white font-bold transition-all bg-white/5 px-4 py-2 rounded-full text-xs hover:bg-white/10 active:scale-95 flex items-center gap-2"
              >
                &larr; <span className="hidden sm:inline">Exit Studio</span>
              </button>
              <h1 className="font-bold font-sans tracking-widest text-[9px] md:text-xs text-accent uppercase">{currentTool} Master Station</h1>
              <div className="flex items-center gap-3">
                 <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Status</span>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Connected</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse hidden sm:block" />
              </div>
            </div>
            <div className="flex-1 w-full overflow-hidden bg-base relative">
               <div className="max-w-[1400px] mx-auto h-full flex flex-col relative">
               {currentTool === 'series' && <SeriesStudio />}
               {currentTool === 'video' && <AIVideo />}
               {currentTool === 'image' && <AIImage />}
               {currentTool === 'novel' && <AINovel onOpenTool={handleOpenTool} />}
               {currentTool === 'recreate' && <Recreate />}
               {currentTool === 'element' && <ElementCreator />}
               {/* Fallback for others currently */}
               {currentTool !== 'series' && currentTool !== 'video' && currentTool !== 'image' && currentTool !== 'novel' && currentTool !== 'recreate' && currentTool !== 'element' && (
                 <div className="w-full h-full flex flex-col justify-center items-center text-gray-500">
                    <p className="mb-2 text-xl font-bold text-white">Coming Soon: {currentTool}</p>
                    <p className="text-sm">This module is under construction.</p>
                 </div>
               )}
               </div>
            </div>
         </main>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-base text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col border-r border-border min-w-[240px] lg:min-w-[280px]">
        <Sidebar activeTab={activeTab} tabs={tabs} onChange={handleTabChange} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center overflow-hidden bg-black">
        <div className="w-full h-full max-w-[1400px] flex flex-col relative pb-16 md:pb-0 border-x border-white/[0.02]">
          {activeTab === 'feed' && <Feed onShowNotifications={() => setShowNotifications(true)} />}
          {activeTab === 'explore' && <Explore />}
          {activeTab === 'library' && <UserLibrary onOpenTool={handleOpenTool} />}
          {activeTab === 'profile' && <Profile />}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden absolute bottom-0 w-full z-50">
          <BottomNav activeTab={activeTab} tabs={tabs} onChange={handleTabChange} />
        </div>
      </main>

      {/* Create Overlay */}
      {isCreateOpen && <CreateOverlay onClose={() => setIsCreateOpen(false)} onSelectTool={handleOpenTool} />}

      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
