import React, { useContext } from 'react';
import { Settings, Award, Flame, Zap, Star, Diamond, CreditCard, ChevronRight, Grid, Bookmark, Heart, TrendingUp, Check, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';
import { auth } from '../lib/firebase';

export default function Profile() {
  const [activeTab, setActiveTab] = React.useState('gamification');
  const { user, convexUserId } = useContext(AuthContext);

  const convexUser = useQuery(
    api.users.getUser, 
    convexUserId ? { userId: convexUserId as any } : "skip"
  );
  
  const userVideos = useQuery(
    api.videos.getVideos,
    convexUserId ? { authorId: convexUserId as any } : "skip"
  );

  const missions = useQuery(
    api.users.getMissions,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  const transactions = useQuery(
    api.users.getTransactions,
    convexUserId ? { userId: convexUserId as any } : "skip"
  );

  if (convexUser === undefined || userVideos === undefined || missions === undefined || transactions === undefined) {
    return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  }

  const addCredits = useMutation(api.users.addCredits);
  const updateMission = useMutation(api.users.updateMissionProgress);
  const updateProfile = useMutation(api.users.updateProfile);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    displayName: '',
    username: '',
    bio: ''
  });

  React.useEffect(() => {
    if (convexUser) {
      setEditForm({
        displayName: convexUser.displayName || '',
        username: convexUser.username || '',
        bio: convexUser.bio || ''
      });
    }
  }, [convexUser]);

  const handleSaveProfile = async () => {
    if (!convexUserId) return;
    try {
      await updateProfile({
        userId: convexUserId as any,
        ...editForm
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuyCredits = async () => {
    if (!convexUserId) return;
    await addCredits({ userId: convexUserId as any, amount: 1000, description: "Purchased Credits" });
  };

  const handleEarnCredits = async () => {
    if (!convexUserId) return;
    await addCredits({ userId: convexUserId as any, amount: 50, description: "Watched Ad" });
  };

  return (
    <div className="w-full h-full bg-black flex flex-col md:pb-0 overflow-y-auto no-scrollbar relative">
      
      {/* Cinematic Banner */}
      <div className="h-48 md:h-64 w-full relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover transition-all duration-700" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Header Info */}
      <div className="px-6 -mt-16 md:-mt-20 relative flex flex-col items-center pb-8 max-w-4xl mx-auto w-full">
        <div className="w-32 h-32 rounded-full border-[6px] border-black overflow-hidden mb-5 relative shadow-2xl group cursor-pointer bg-black">
          <img src={convexUser?.avatarUrl || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" className="w-full h-full object-cover bg-black transition-transform group-hover:scale-110" />
          <div className="absolute bottom-0 w-full bg-[#2e1065] text-[9px] text-center font-bold font-sans py-1.5 uppercase tracking-[0.2em] shadow-lg">Lv. {convexUser?.level || 1}</div>
        </div>

        <div className="text-center mb-10 px-4 w-full max-w-md">
          {isEditing ? (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
               <input 
                 className="bg-[#1a1a1a] text-white text-2xl font-bold text-center rounded-2xl px-4 py-2 border border-accent/30 focus:outline-none"
                 value={editForm.displayName}
                 onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                 placeholder="Display Name"
               />
               <input 
                 className="bg-[#1a1a1a] text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center rounded-xl px-4 py-1.5 border border-white/10 focus:outline-none"
                 value={editForm.username}
                 onChange={e => setEditForm({...editForm, username: e.target.value})}
                 placeholder="username"
               />
               <textarea 
                 className="bg-[#1a1a1a] text-gray-300 text-xs text-center rounded-2xl px-4 py-3 border border-white/10 focus:outline-none resize-none"
                 value={editForm.bio}
                 onChange={e => setEditForm({...editForm, bio: e.target.value})}
                 placeholder="Write a short bio..."
                 rows={2}
               />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold font-sans tracking-tight text-white mb-2">{convexUser?.displayName || user?.displayName || 'Creator'}</h1>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                @{convexUser?.username || 'user'}
              </p>
              {convexUser?.bio && <p className="mt-4 text-gray-500 text-xs max-w-xs mx-auto line-clamp-2 italic">"{convexUser.bio}"</p>}
            </>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-0.5 w-full max-w-md mb-8 bg-[#1a1a1a] p-1.5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center py-4 bg-black rounded-[1.5rem] shadow-inner">
            <span className="font-bold text-xl font-sans text-white tracking-tight">{convexUser?.followersCount ?? 0}</span>
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">Followers</span>
          </div>
          <div className="flex flex-col items-center py-4 bg-black rounded-[1.5rem] shadow-inner">
            <span className="font-bold text-xl font-sans text-white tracking-tight">{userVideos.length}</span>
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">Posts</span>
          </div>
          <div className="flex flex-col items-center py-4 bg-black rounded-[1.5rem] shadow-inner">
            <span className="font-bold text-xl font-sans text-accent tracking-tight">{convexUser?.credits ?? 0}</span>
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">Credits</span>
          </div>
        </div>
        
        <div className="flex gap-3 w-full max-w-md">
           {isEditing ? (
             <>
               <button onClick={handleSaveProfile} className="flex-1 bg-accent text-white font-bold py-3.5 px-8 rounded-full transition-all text-[11px] shadow-2xl active:scale-95 uppercase tracking-[0.2em]">Save Changes</button>
               <button onClick={() => setIsEditing(false)} className="flex-1 bg-[#1a1a1a] text-white font-bold py-3.5 px-8 rounded-full transition-all text-[11px] shadow-2xl active:scale-95 uppercase tracking-[0.2em]">Cancel</button>
             </>
           ) : (
             <>
               <button onClick={() => setIsEditing(true)} className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3.5 px-8 rounded-full transition-all text-[11px] shadow-2xl active:scale-95 uppercase tracking-[0.2em]">Edit Profile</button>
               <button onClick={() => auth.signOut()} className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 group hover:bg-[#222]">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all" />
               </button>
             </>
           )}
        </div>
      </div>

      <div className="flex justify-center p-4 sticky top-0 z-20 bg-black/80 backdrop-blur-xl">
        <div className="flex w-full max-w-[240px] bg-[#1a1a1a] p-1.5 rounded-full shadow-2xl overflow-hidden">
          <button onClick={() => setActiveTab('gamification')} className={`flex-1 py-2.5 flex justify-center rounded-full transition-all ${activeTab === 'gamification' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex-1 py-2.5 flex justify-center rounded-full transition-all ${activeTab === 'wallet' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
            <Diamond className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveTab('posts')} className={`flex-1 py-2.5 flex justify-center rounded-full transition-all ${activeTab === 'posts' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 pb-32 p-6">
        {activeTab === 'gamification' && (
           <div className="flex flex-col gap-10 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Gamification Subtabs */}
              <div className="flex gap-2 items-center justify-center bg-black p-1.5 rounded-full w-max mx-auto px-2">
                 <button className="px-6 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white bg-[#2e1065] rounded-full">Missions</button>
                 <button className="px-6 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-500 hover:text-gray-300 bg-[#1a1a1a] rounded-full hover:bg-[#222] transition-all">Badges</button>
                 <button className="px-6 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-500 hover:text-gray-300 bg-[#1a1a1a] rounded-full hover:bg-[#222] transition-all flex items-center gap-2">
                   Quests <span className="bg-[#2e1065] text-white px-2 py-0.5 rounded-full text-[7px] font-sans shadow-lg">NEW</span>
                 </button>
              </div>

              {/* Level Progress */}
              <div className="flex flex-col gap-6 bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
                 <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2e1065]/20 blur-[100px] rounded-full" />
                 
                 <div className="flex justify-between items-end relative z-10">
                    <div>
                      <h2 className="font-bold font-sans text-2xl text-white tracking-tight leading-none mb-1">Creator Level {convexUser?.level || 1}</h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Next Tier: Elite Director</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold font-sans text-accent">{Math.floor(((convexUser?.xp || 0) % 100))}%</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-3 relative z-10">
                    <div className="w-full bg-black h-4 rounded-full overflow-hidden shadow-inner p-1 border border-white/5">
                      <div className="bg-gradient-to-r from-[#2e1065] via-purple-600 to-blue-600 h-full rounded-full shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all duration-1000" style={{ width: `${Math.floor(((convexUser?.xp || 0) % 100))}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em]">
                      <span className="text-gray-600">{convexUser?.xp || 0} XP Earned</span>
                      <span className="text-gray-600">{(Math.floor((convexUser?.xp || 0) / 100) + 1) * 100} XP Goal</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-black/60 p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-black transition-colors cursor-default shadow-inner border border-white/5">
                       <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-orange-600/5 mb-3 group-hover:scale-110 transition-transform shadow-lg border border-orange-500/10">
                         <Flame className="w-7 h-7 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                       </div>
                       <span className="font-bold text-sm text-white tracking-tight">{convexUser?.streak || 0} Day Streak</span>
                       <span className="text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase mt-1.5 opacity-60">+50 XP / DAY</span>
                    </div>
                    <div className="bg-black/60 p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-black transition-colors cursor-default shadow-inner border border-white/5">
                       <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#2e1065]/5 mb-3 group-hover:scale-110 transition-transform shadow-lg border border-[#2e1065]/20">
                         <Star className="w-7 h-7 text-accent drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]" />
                       </div>
                       <span className="font-bold text-sm text-accent tracking-tight">Top 1% Creator</span>
                       <span className="text-[9px] text-gray-600 font-bold tracking-[0.2em] uppercase mt-1.5 opacity-60">Global Ranking</span>
                    </div>
                 </div>
              </div>

              {/* Daily Missions */}
              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-center px-4">
                   <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.3em]">Daily Missions</h3>
                   <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest bg-[#1a1a1a] px-3 py-1 rounded-full">Resets in 14h 22m</span>
                 </div>
                 {missions.map((mission, i) => {
                   const isDone = mission.progress >= mission.total;
                   return (
                     <div key={mission._id} className={`group relative flex flex-col gap-4 p-6 rounded-[2rem] border border-white/5 transition-all duration-500 ${isDone ? 'bg-[#1a1a1a] opacity-50' : 'bg-[#1a1a1a] hover:bg-[#222] shadow-xl overflow-hidden'}`}>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-inner ${isDone ? 'bg-black text-gray-700' : 'bg-black text-accent group-hover:bg-[#2e1065] group-hover:text-white'}`}>
                                <Zap className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-bold text-base tracking-tight leading-none mb-1 ${isDone ? 'text-gray-500' : 'text-white'}`}>{mission.title}</span>
                                <div className="flex items-center gap-1.5">
                                  <Diamond className="w-3 h-3 text-blue-500" />
                                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em]">+{mission.reward} {mission.type}</span>
                                </div>
                              </div>
                           </div>
                           {isDone ? (
                             <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-inner">
                               <Check className="w-3.5 h-3.5" /> Claimed
                             </div>
                           ) : (
                             <button onClick={() => updateMission({ missionId: mission._id })} className="bg-black hover:bg-gray-900 border border-white/5 text-white px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Start</button>
                           )}
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em] px-0.5">
                              <span>Progress</span>
                              <span className={isDone ? 'text-green-500 opacity-60' : 'text-accent'}>{mission.progress} / {mission.total}</span>
                           </div>
                           <div className="w-full bg-black h-2 rounded-full overflow-hidden shadow-inner p-0.5">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-[#2e1065] shadow-[0_0_8px_rgba(124,58,237,0.3)]'}`} 
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
           <div className="flex flex-col gap-10 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              
                  <div className="bg-gradient-to-br from-[#2e1065] to-[#1e3a8a] rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-12 -right-12 p-4 opacity-5">
                      <Diamond className="w-72 h-72 text-white" />
                    </div>
                    <label className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.3em] mb-4 block">Available Balance</label>
                    <div className="flex items-end gap-3 mb-12">
                       <span className="text-6xl font-sans font-extrabold text-white tracking-tighter drop-shadow-2xl">{convexUser?.credits ?? 0}</span>
                       <span className="text-xl font-bold text-blue-200 mb-2 uppercase tracking-[0.3em]">Crd</span>
                    </div>
                    <div className="flex gap-5 relative z-10">
                       <button onClick={handleBuyCredits} className="flex-1 bg-white hover:bg-gray-100 text-[#1e3a8a] font-extrabold py-4 rounded-[1.5rem] shadow-2xl transition-all text-xs uppercase tracking-[0.25em] active:scale-95">
                         Buy Credits
                       </button>
                       <button onClick={handleEarnCredits} className="flex-1 bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/10 text-white font-bold py-4 rounded-[1.5rem] transition-all text-xs uppercase tracking-[0.25em] active:scale-95">
                         Earn Free
                       </button>
                    </div>
                  </div>

              {/* Subscriptions */}
              <div className="flex flex-col gap-6">
                 <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.3em] ml-4">Current Subscription</h3>
                 <div className="bg-[#1a1a1a] rounded-[3rem] p-8 flex items-center justify-between cursor-pointer hover:bg-[#222] transition-all group shadow-2xl">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-[#2e1065]/20 rounded-[2rem] flex items-center justify-center group-hover:scale-105 transition-all shadow-inner">
                         <Star className="w-10 h-10 text-accent drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]" />
                       </div>
                       <div>
                         <p className="font-bold text-2xl text-white tracking-tight leading-none mb-1.5">Pro Creator Plan</p>
                         <p className="text-[10px] text-accent font-bold tracking-[0.25em] uppercase">Premium Features Active</p>
                       </div>
                    </div>
                    <div className="w-14 h-14 bg-black rounded-2xl group-hover:bg-[#2e1065] group-hover:text-white transition-all text-gray-600 shadow-inner flex items-center justify-center">
                      <ChevronRight className="w-8 h-8" />
                    </div>
                 </div>
              </div>

              {/* Usage History */}
              <div className="flex flex-col gap-6">
                 <div className="flex justify-between items-center px-4">
                   <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.3em]">Transaction History</h3>
                   <button className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors">View All</button>
                 </div>
                 
                 <div className="bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl">
                    {transactions.map((tx) => (
                      <div key={tx._id} className="flex justify-between items-center p-6 hover:bg-black/40 rounded-[2rem] transition-all cursor-default">
                         <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-inner">
                             <Zap className="w-6 h-6 text-gray-700" />
                           </div>
                           <div>
                             <p className="font-bold text-base text-gray-200 tracking-tight leading-none mb-1.5">{tx.description}</p>
                             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()}</p>
                           </div>
                         </div>
                         <div className={`font-mono px-5 py-2 rounded-full text-xs font-bold border ${tx.amount > 0 ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-gray-400 bg-black/40 border-white/5 shadow-inner'}`}>
                           {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                         </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
                        No transactions found.
                      </div>
                    )}
                 </div>
              </div>

           </div>
        )}

        {activeTab === 'posts' && (
           <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-6 break-words animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto w-full">
              {userVideos.map((video) => (
                <div key={video._id} className="aspect-[3/4] relative group cursor-pointer overflow-hidden md:rounded-[2.5rem] shadow-2xl bg-[#1a1a1a]">
                   <img src={video.thumbnailUrl || video.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"} alt="post" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="flex items-center gap-2 font-bold text-white shadow-2xl bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                       <Heart className="w-5 h-5 fill-white" /> {video.likes}
                     </div>
                   </div>
                </div>
              ))}
              {userVideos.length === 0 && (
                 <div className="col-span-full h-40 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    No videos found
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}
