import React from 'react';
import { Home, Compass, PlusCircle, Library, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  tabs: any[];
  onChange: (id: string) => void;
}

export default function Sidebar({ activeTab, tabs, onChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-panel p-4 pt-8">
      <div className="font-sans font-bold text-2xl text-accent mb-12 px-4 tracking-tighter">
        VIRAL SCENE
      </div>
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-sans ${
                isActive ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-lg font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto">
        {/* Credits or profile snippet */}
        <div className="p-4 bg-black/40 rounded-2xl flex items-center justify-between border border-border backdrop-blur-sm">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Credits</span>
            <span className="text-xl font-sans font-bold text-accent shadow-sm">500</span>
          </div>
          <button className="bg-accent text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] text-sm font-bold px-4 py-1.5 rounded-full hover:bg-accent-hover active:scale-95 transition-all">
            Get
          </button>
        </div>
      </div>
    </div>
  );
}
