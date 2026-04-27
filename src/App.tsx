import { Home, PlusSquare, Search, Library, User } from 'lucide-react';
import React from 'react';
import Feed from './components/Feed';
import Explore from './components/Explore';
import CreateOverlay from './components/CreateOverlay';
import Profile from './components/Profile';
import UserLibrary from './components/UserLibrary';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import OmniStudio from './components/OmniStudio';
import AINovel from './components/AINovel';
import AIVideo from './components/AIVideo';
import AIImage from './components/AIImage';
import Recreate from './components/Recreate';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('feed');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [currentTool, setCurrentTool] = React.useState<string | null>(null);

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
         <main className="flex-1 relative flex flex-col items-center overflow-hidden w-full max-w-[1280px] mx-auto bg-base sm:border-x border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between w-full bg-panel z-10 shadow-sm">
              <button onClick={() => setCurrentTool(null)} className="text-gray-400 hover:text-white font-bold transition-colors">&larr; Back</button>
              <h1 className="font-bold font-sans tracking-tight">{currentTool.toUpperCase()} LAUNCHER</h1>
              <div className="w-10"></div>
            </div>
            <div className="flex-1 w-full overflow-hidden bg-base">
               {currentTool === 'omni' && <OmniStudio />}
               {currentTool === 'video' && <AIVideo />}
               {currentTool === 'image' && <AIImage />}
               {currentTool === 'novel' && <AINovel />}
               {currentTool === 'recreate' && <Recreate />}
               {/* Fallback for others currently */}
               {currentTool !== 'omni' && currentTool !== 'video' && currentTool !== 'image' && currentTool !== 'novel' && currentTool !== 'recreate' && (
                 <div className="w-full h-full flex flex-col justify-center items-center text-gray-500">
                    <p className="mb-2 text-xl font-bold text-white">Coming Soon: {currentTool}</p>
                    <p className="text-sm">This module is under construction.</p>
                 </div>
               )}
            </div>
         </main>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-base text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col border-r border-border min-w-[240px]">
        <Sidebar activeTab={activeTab} tabs={tabs} onChange={handleTabChange} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1280px] h-full flex flex-col relative pb-16 md:pb-0">
          {activeTab === 'feed' && <Feed />}
          {activeTab === 'explore' && <Explore />}
          {activeTab === 'library' && <UserLibrary />}
          {activeTab === 'profile' && <Profile />}
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden absolute bottom-0 w-full z-50">
          <BottomNav activeTab={activeTab} tabs={tabs} onChange={handleTabChange} />
        </div>
      </main>

      {/* Create Overlay */}
      {isCreateOpen && <CreateOverlay onClose={() => setIsCreateOpen(false)} onSelectTool={handleOpenTool} />}
    </div>
  );
}
