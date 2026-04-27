import React from 'react';

interface BottomNavProps {
  activeTab: string;
  tabs: any[];
  onChange: (id: string) => void;
}

export default function BottomNav({ activeTab, tabs, onChange }: BottomNavProps) {
  return (
    <div className="h-16 pb-1 bg-black/80 backdrop-blur-3xl border-t border-border flex items-center justify-around px-1 z-50 rounded-t-[2rem]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isCreate = tab.id === 'create';
        const isActive = activeTab === tab.id && !isCreate;
        
        return (
            <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[50px] flex-1 h-full transition-all ${
              isCreate 
                ? 'text-accent' 
                : isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {isCreate ? (
              <div className="bg-white text-black p-2.5 rounded-full shadow-lg scale-110">
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'mb-0.5' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[8px] uppercase tracking-tighter font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
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
