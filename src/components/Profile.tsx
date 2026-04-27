import React from 'react';
import { Settings, Award, Flame, Zap, Star, Diamond, CreditCard, ChevronRight, Grid, Bookmark, Heart, TrendingUp, Check, Sparkles } from 'lucide-react';

export default function Profile() {
  const [activeTab, setActiveTab] = React.useState('gamification');
  
  return (
    <div className="w-full h-full bg-black flex flex-col md:pb-0 overflow-y-auto no-scrollbar relative">
      
      {/* Cinematic Banner */}
      <div className="h-48 w-full relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      {/* Header Info */}
      <div className="px-6 -mt-12 relative flex flex-col items-center pb-6 border-b border-white/5">
        <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden mb-3 relative shadow-2xl group cursor-pointer">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=creator" alt="Avatar" className="w-full h-full object-cover bg-black transition-transform group-hover:scale-110" />
          <div className="absolute bottom-0 w-full bg-accent text-[9px] text-center font-bold font-sans py-1 uppercase tracking-widest bg-opacity-90">Lv. 12</div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-sans tracking-tight text-white mb-0.5">@cyber_dreamer</h1>
          <p className="text-gray-400 text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Crafting digital dreams. AI Filmmaker.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 w-full max-w-sm mb-6 bg-white/[0.03] border border-white/5 p-4 rounded-3xl backdrop-blur-sm shadow-inner">
          <div className="flex flex-col items-center border-r border-white/10">
            <span className="font-bold text-lg font-sans text-white">14.2K</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Followers</span>
          </div>
          <div className="flex flex-col items-center border-r border-white/10">
            <span className="font-bold text-lg font-sans text-white">12</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Series</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg font-sans text-white">1.2M</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Likes</span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full max-w-sm">
           <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full transition-all text-xs border border-white/10 shadow-lg active:scale-95 uppercase tracking-widest">Edit Profile</button>
           <button className="flex-none bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all border border-white/10 shadow-lg active:scale-95 group">
              <Settings className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center p-4 sticky top-0 z-10 bg-black/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
        <div className="flex w-full max-w-[220px] bg-white/[0.03] p-1 rounded-full border border-white/10 shadow-inner">
          <button onClick={() => setActiveTab('gamification')} className={`flex-1 py-1.5 flex justify-center rounded-full transition-all ${activeTab === 'gamification' ? 'text-accent' : 'text-gray-600 hover:text-gray-300'}`}>
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex-1 py-1.5 flex justify-center rounded-full transition-all ${activeTab === 'wallet' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-300'}`}>
            <Diamond className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-1.5 flex justify-center rounded-full transition-all ${activeTab === 'posts' ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 pb-20 md:pb-6 p-4">
        {activeTab === 'gamification' && (
           <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
              {/* Gamification Subtabs */}
              <div className="flex gap-2 items-center justify-center bg-white/5 p-1.5 rounded-full border border-white/5 w-max mx-auto px-2">
                 <button className="px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white bg-accent rounded-full shadow-lg">Missions</button>
                 <button className="px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Badges</button>
                 <button className="px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                   Quests <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded-full text-[6px] border border-accent/30">New</span>
                 </button>
              </div>

              {/* Level Progress */}
              <div className="flex flex-col gap-6 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                 <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full" />
                 
                 <div className="flex justify-between items-end relative z-10">
                    <div>
                      <h2 className="font-bold font-sans text-2xl text-white">Creator Level 12</h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Next Tier: Elite Director</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-accent">80%</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-3 relative z-10">
                   <div className="w-full bg-black/40 h-4 rounded-full overflow-hidden border border-white/10 shadow-inner p-1">
                     <div className="bg-gradient-to-r from-accent via-purple-500 to-blue-500 h-full rounded-full w-[80%] shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
                   </div>
                   <div className="flex justify-between text-[11px] font-bold">
                     <span className="text-gray-400 italic">12,400 XP</span>
                     <span className="text-gray-500">15,000 XP Goal</span>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
                    <div className="bg-black/40 p-5 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5 group hover:bg-black/60 transition-colors cursor-default">
                       <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-3 group-hover:scale-110 transition-transform shadow-lg">
                         <Flame className="w-7 h-7 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                       </div>
                       <span className="font-bold text-sm text-white">7 Day Streak</span>
                       <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">+50 XP Per Day</span>
                    </div>
                    <div className="bg-black/40 p-5 rounded-3xl flex flex-col items-center justify-center text-center border border-accent/20 group hover:bg-black/60 transition-colors cursor-default shadow-[inset_0_0_20px_rgba(124,58,237,0.05)]">
                       <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent/10 border border-accent/30 mb-3 group-hover:scale-110 transition-transform shadow-lg">
                         <Star className="w-7 h-7 text-accent drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                       </div>
                       <span className="font-bold text-sm text-accent">Top 1% Creator</span>
                       <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">Global Influence</span>
                    </div>
                 </div>
              </div>

              {/* Daily Missions */}
              <div className="flex flex-col gap-5">
                 <div className="flex justify-between items-center ml-1">
                   <h3 className="font-bold text-sm text-gray-400 uppercase tracking-[0.15em]">Daily Missions</h3>
                   <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Resets in 14:22:10</span>
                 </div>
                 {[
                   { title: 'Create a Series', reward: '100', progress: 1, total: 1, type: 'Credits', icon: Zap },
                   { title: 'Like 5 Videos', reward: '10', progress: 3, total: 5, type: 'Credits', icon: Heart },
                   { title: 'Recreate a prompt', reward: '50', progress: 0, total: 1, type: 'Credits', icon: Sparkles },
                 ].map((mission, i) => {
                   const isDone = mission.progress >= mission.total;
                   return (
                     <div key={i} className={`group relative flex flex-col gap-4 p-6 rounded-[2rem] border transition-all duration-300 ${isDone ? 'bg-white/[0.02] border-white/5 opacity-50 grayscale' : 'bg-white/[0.04] border-white/10 hover:border-accent/40 shadow-2xl overflow-hidden'}`}>
                        {!isDone && <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />}
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl border transition-colors ${isDone ? 'bg-white/5 border-white/10 text-gray-600' : 'bg-accent/10 border-accent/20 text-accent group-hover:bg-accent group-hover:text-white'}`}>
                                <mission.icon className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-bold text-base tracking-tight ${isDone ? 'text-gray-500' : 'text-white'}`}>{mission.title}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Diamond className="w-3 h-3 text-blue-500" />
                                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.1em]">+{mission.reward} {mission.type}</span>
                                </div>
                              </div>
                           </div>
                           {isDone ? (
                             <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                               <Check className="w-3.5 h-3.5" /> Claimed
                             </div>
                           ) : (
                             <button className="bg-accent text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95 transition-all">Start</button>
                           )}
                        </div>
                        <div className="flex flex-col gap-2">
                           <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest px-0.5">
                              <span>Overall Progress</span>
                              <span className={isDone ? 'text-green-500' : 'text-accent'}>{mission.progress}/{mission.total}</span>
                           </div>
                           <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 p-0.5">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-accent shadow-[0_0_8px_rgba(124,58,237,0.4)]'}`} 
                                style={{ width: `${(mission.progress / mission.total) * 100}%` }} 
                              />
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        )}

        {activeTab === 'wallet' && (
           <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
              
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-500/50 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-blue-900/40">
                 <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm">
                   <Diamond className="w-48 h-48 text-blue-100" />
                 </div>
                 <h3 className="text-[10px] font-bold text-blue-100/70 uppercase tracking-[0.25em] mb-2 shadow-sm">Available Balance</h3>
                 <div className="flex items-end gap-3 mb-8 drop-shadow-2xl">
                    <span className="text-6xl font-sans font-extrabold text-white tracking-tighter">4,050</span>
                    <span className="text-xl font-bold text-blue-100 mb-2">Credits</span>
                 </div>
                 <div className="flex gap-4 relative z-10">
                    <button className="flex-1 bg-white hover:bg-white/90 text-blue-900 font-bold py-4 rounded-2xl shadow-xl transition-all text-xs uppercase tracking-widest active:scale-95">
                      Buy Credits
                    </button>
                    <button className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/20 text-white font-bold py-4 rounded-2xl transition-all text-xs uppercase tracking-widest active:scale-95">
                      Earn Free
                    </button>
                 </div>
              </div>

              {/* Subscriptions */}
              <div className="flex flex-col gap-4">
                 <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em] ml-2">Subscriptions</h3>
                 <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-all group shadow-xl">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-accent/20 rounded-2xl border border-accent/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                         <Star className="w-7 h-7 text-accent" />
                       </div>
                       <div>
                         <p className="font-bold text-lg text-white">Pro Creator Plan</p>
                         <p className="text-xs text-accent font-bold tracking-wider mt-0.5 uppercase">Premium Features Active</p>
                       </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                 </div>
              </div>

              {/* Usage History */}
              <div className="flex flex-col gap-4 mt-4">
                 <div className="flex justify-between items-center mb-1 px-2">
                   <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em]">Recent Transactions</h3>
                   <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors">See Details</button>
                 </div>
                 
                 <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-2">
                   {[
                     { desc: 'Series Generator (15s)', date: 'Today, 2:30 PM', amount: '-150', icon: Zap, color: 'text-gray-400' },
                     { desc: 'Daily Login Reward', date: 'Today, 9:00 AM', amount: '+50', positive: true, icon: Diamond, color: 'text-green-400' },
                     { desc: 'Omni Shot Generation', date: 'Yesterday', amount: '-45', icon: Sparkles, color: 'text-gray-400' },
                   ].map((tx, i) => (
                     <div key={i} className="flex justify-between items-center p-5 hover:bg-white/[0.03] rounded-[2rem] transition-all cursor-default">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10`}>
                            <tx.icon className="w-5 h-5 opacity-50" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{tx.desc}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold font-mono px-4 py-1.5 rounded-full text-xs border ${tx.positive ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-gray-400 bg-white/5 border-white/10'}`}>
                          {tx.amount}
                        </span>
                     </div>
                   ))}
                 </div>
              </div>

           </div>
        )}

        {activeTab === 'posts' && (
           <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-4 break-words">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="aspect-[3/4] relative group cursor-pointer overflow-hidden md:rounded-[2rem] border border-white/5">
                   <img src={`https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&q=80&sig=${i+10}`} alt="post" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="flex items-center gap-1 font-bold shadow-md">
                       <Heart className="w-5 h-5 fill-white" /> 12K
                     </div>
                   </div>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}
