import React, { useContext } from 'react';
import { Home, Compass, PlusCircle, Library, User } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

interface SidebarProps {
  activeTab: string;
  tabs: any[];
  onChange: (id: string) => void;
}

export default function Sidebar({ activeTab, tabs, onChange }: SidebarProps) {
  const { convexUserId } = useContext(AuthContext);
  const user = useQuery(
    api.users.getUser,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const credits = user?.credits ?? 0;

  return (
    <div className="flex flex-col h-full bg-black p-4 pt-6">
      <div className="font-sans font-bold text-xl text-accent mb-10 px-3 tracking-tighter">
        VIRAL SCENE
      </div>
      <nav className="flex flex-col gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all font-sans ${
                isActive ? 'bg-black text-white' : 'text-gray-400 hover:bg-black hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-md font-medium ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto">
        {/* Credits or profile snippet */}
        <div className="p-4 bg-black rounded-3xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col items-start px-1">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Credits</span>
            <span className="text-xl font-sans font-bold text-accent shadow-sm leading-none">{credits}</span>
          </div>
          <button onClick={() => onChange('profile')} className="bg-[#2e1065] text-white text-[10px] font-bold px-4 py-2 rounded-full hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border border-accent">
            Top up
          </button>
        </div>
      </div>
    </div>
  );
}
