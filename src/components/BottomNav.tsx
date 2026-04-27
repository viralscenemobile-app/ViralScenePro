import React from 'react';

interface BottomNavProps {
  activeTab: string;
  tabs: any[];
  onChange: (id: string) => void;
}

export default function BottomNav({ activeTab, tabs, onChange }: BottomNavProps) {
  return (
    <div className="h-20 pb-4 bg-black/60 backdrop-blur-3xl border-t border-border flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isCreate = tab.id === 'create';
        const isActive = activeTab === tab.id && !isCreate;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all ${
              isCreate 
                ? 'text-accent' 
                : isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {isCreate ? (
              <div className="bg-white text-black p-1.5 rounded-xl">
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <Icon className={`w-6 h-6 ${isActive ? 'mb-1' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
