import React from 'react';
import { Home, Compass, PlusCircle, Library, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  tabs: any[];
  onChange: (id: string) => void;
}

export default function Sidebar({ activeTab, tabs, onChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-base p-4 pt-6">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all font-sans relative group ${
                isActive ? 'bg-accent/10 text-accent shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && <div className="absolute left-1.5 w-1 h-4 bg-accent rounded-full" />}
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
        <div className="p-4 bg-white/[0.03] rounded-3xl flex items-center justify-between border border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-start px-1">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Credits</span>
            <span className="text-xl font-sans font-bold text-accent shadow-sm leading-none">500</span>
          </div>
          <button className="bg-accent text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] text-[10px] font-bold px-4 py-2 rounded-full hover:bg-accent-hover active:scale-95 transition-all uppercase tracking-widest">
            Top up
          </button>
        </div>
      </div>
    </div>
  );
}
