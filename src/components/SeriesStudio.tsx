import React, { useState, useEffect, useContext } from 'react';
import { 
  Plus, Sparkles, Wand2, Play, ChevronDown, Music, 
  Trash2, Move, Scissors, Timer, Image as ImageIcon, Save,
  ChevronRight, ArrowUp, ArrowDown, Settings2, Mic, Film, Library
} from 'lucide-react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import AudioLibrary from './AudioLibrary';
import CollaborationOverlay from './CollaborationOverlay';
import { AuthContext } from '../AuthProvider';
// Removed GoogleGenAI import and getAI function as they are now handled server-side

interface Shot {
  id: number;
  prompt: string;
  image?: string | null;
  videoUrl?: string | null;
  renderStatus?: 'idle' | 'generating' | 'completed' | 'failed';
  duration: number;
  transition?: string;
  motion?: string;
  audio?: string;
}

interface SeriesStudioProps {
  seriesId?: string;
}

export function SeriesStudio({ seriesId: initialSeriesId }: SeriesStudioProps) {
  const [currentSeriesId, setCurrentSeriesId] = useState<string | undefined>(initialSeriesId);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>(initialSeriesId ? 'editor' : 'list');
  
  const [shots, setShots] = useState<Shot[]>([]);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [masterPrompt, setMasterPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioTrack, setAudioTrack] = useState<string | null>(null);
  const [model, setModel] = useState("Cinematic-XL");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [showAutoScript, setShowAutoScript] = useState(false);
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [showCollab, setShowCollab] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const { user, convexUserId } = useContext(AuthContext);
  
  const userSeries = useQuery(api.users.getSeries, convexUserId ? { userId: convexUserId as any } : "skip") || [];
  const userElements = useQuery(api.users.getElements, convexUserId ? { userId: convexUserId as any } : "skip") || [];
  const initialSeriesData = useQuery(api.users.getSeriesById, currentSeriesId ? { seriesId: currentSeriesId as any } : "skip");
  
  const saveSeriesMutation = useMutation(api.users.saveSeries);
  const deleteSeriesMutation = useMutation(api.users.deleteSeries);
  const generateScriptAction = useAction(api.videos.generateScriptAction);
  const generateSeriesAction = useAction(api.videos.bulkGenerateSeries);
  const generateShotVideoAction = useAction(api.videos.generateShotVideo);

  // Progress calculation - Reactive
  const shotsData = initialSeriesData?.shots || [];
  const completedShots = shotsData.filter(s => s.renderStatus === 'completed').length;
  const progress = shotsData.length > 0 ? Math.round((completedShots / shotsData.length) * 100) : 0;


  const startNewSeries = () => {
    setCurrentSeriesId(undefined);
    setShots([{ id: Date.now(), prompt: '', image: null, duration: 4, transition: 'Crossfade', motion: 'Static', audio: '' }]);
    setMasterPrompt("");
    setAudioTrack(null);
    setViewMode('editor');
  };

  const openSeries = (id: string) => {
    setCurrentSeriesId(id);
    setViewMode('editor');
  };

  const backToList = () => {
    setViewMode('list');
    setCurrentSeriesId(undefined);
  };

  const handleDeleteSeries = async () => {
    if (!currentSeriesId || !confirm("Are you sure you want to delete this series?")) return;
    try {
        await deleteSeriesMutation({ seriesId: currentSeriesId as any });
        backToList();
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    if (viewMode === 'editor' && initialSeriesData) {
      // Merge only non-editable fields to prevent overwriting user input
      setShots(prev => prev.map(s => {
        const updatedShot = initialSeriesData.shots?.find((is: any) => is.id === s.id);
        if (updatedShot) {
          return { ...s, renderStatus: updatedShot.renderStatus, videoUrl: updatedShot.videoUrl };
        }
        return s;
      }));
      setSeriesTitle(initialSeriesData.title || "");
      setMasterPrompt(initialSeriesData.masterPrompt || "");
      setAudioTrack(initialSeriesData.audioTrack || null);
      if (initialSeriesData.model) setModel(initialSeriesData.model);
      if (initialSeriesData.aspectRatio) setAspectRatio(initialSeriesData.aspectRatio);
    } else if (viewMode === 'editor' && !currentSeriesId && shots.length === 0) {
      setShots([{ id: Date.now(), prompt: '', image: null, duration: 4, transition: 'Crossfade', motion: 'Static', audio: '' }]);
    }
  }, [initialSeriesData, currentSeriesId, viewMode]);

  const rawCollaborators = useQuery(api.users.getSeriesCollaborators, currentSeriesId ? { seriesId: currentSeriesId as any } : 'skip') || [];
  const collaborators = rawCollaborators.map((c: any) => ({
    id: c._id, 
    name: c.user?.displayName || c.user?.username || 'Unknown', 
    role: c.role, 
    avatar: c.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username || 'user'}`
  }));

  // if the series matches the current user it means they are owner, so add them as top collaborator if list doesn't have owner yet.
  if (currentSeriesId && collaborators.filter(c => c.role === 'Owner').length === 0) {
      if (initialSeriesData?.userId === convexUserId) {
        collaborators.unshift({
           id: convexUserId || 'owner',
           name: 'You',
           role: 'Owner',
           avatar: null
        });
      }
  } else if (!currentSeriesId) {
      collaborators.unshift({
         id: convexUserId || 'owner',
         name: 'You',
         role: 'Owner',
         avatar: null
      });
  }

  const generateScript = async (mode: 'new' | 'append') => {
    if (!masterPrompt) return;
    setIsGenerating(true);
    try {
      const newShotsData = await generateScriptAction({
        prompt: masterPrompt,
        context: mode === 'append' ? `Existing shots: ${JSON.stringify(shots)}` : 'Starting a new series.'
      });

      console.log("New shots data:", newShotsData);
      
      if (!Array.isArray(newShotsData)) {
          console.error("newShotsData is not an array:", newShotsData);
          throw new Error("Generated data is not a valid list of shots.");
      }

      const formattedNewShots = newShotsData.map((s: any, i: number) => ({
        ...s,
        id: Date.now() + i,
        image: s.image || null,
        audio: s.audio || '',
        transition: s.transition || 'Crossfade',
        motion: s.motion || 'Static',
      }));

      if (mode === 'new') {
        setShots(formattedNewShots);
      } else {
        setShots([...shots, ...formattedNewShots]);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI Generation failed: " + (error instanceof Error ? error.message : "An unexpected error occurred."));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!convexUserId) return;
    setIsSaving(true);
    try {
      await saveSeriesMutation({
        userId: convexUserId as any,
        seriesId: currentSeriesId as any,
        title: seriesTitle || "Untitled Series",
        masterPrompt: masterPrompt || undefined,
        shots: shots.map(s => ({
            id: s.id,
            prompt: s.prompt,
            image: s.image || undefined,
            videoUrl: s.videoUrl || undefined,
            renderStatus: s.renderStatus || 'idle',
            duration: s.duration,
            transition: s.transition || 'Cut',
            motion: s.motion || 'Static',
            audio: s.audio || ''
        })) as any,
        audioTrack: audioTrack || undefined,
        model,
        aspectRatio,
        status: "draft"
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!convexUserId) return;
    
    // Check if all shots are rendered
    const unrenderedCount = shots.filter(s => s.renderStatus !== 'completed').length;
    if (unrenderedCount > 0) {
      if (!confirm(`You have ${unrenderedCount} shots not yet rendered. Do you want to process and publish?`)) return;
    }

    setIsPublishing(true);
    try {
        await saveSeriesMutation({
          userId: convexUserId as any,
          seriesId: currentSeriesId as any,
          title: seriesTitle || `Untitled Series ${new Date().toLocaleDateString()}`,
          masterPrompt: masterPrompt || undefined,
          shots: shots.map(s => ({
            id: s.id,
            prompt: s.prompt,
            image: s.image || undefined,
            videoUrl: s.videoUrl || undefined,
            renderStatus: s.renderStatus || 'idle',
            duration: s.duration,
            transition: s.transition || 'Cut',
            motion: s.motion || 'Static',
            audio: s.audio || ''
          })) as any,
          audioTrack: audioTrack || undefined,
          model,
          aspectRatio,
          status: "published"
        });
        
        setTimeout(() => {
          setIsPublishing(false);
          setPublishSuccess(true);
        }, 2500);
    } catch (error) {
        setIsPublishing(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!currentSeriesId) {
        await handleSaveDraft();
    }
    if (!currentSeriesId) return;

    setIsGenerating(true);
    try {
      await generateSeriesAction({ seriesId: currentSeriesId as any });
      alert("Bulk generation initiated successfully.");
    } catch (error) {
      console.error("Bulk generation failed:", error);
      alert("Bulk generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateShot = async (index: number) => {
    if (!currentSeriesId) {
      // Must save first to get an ID
      await handleSaveDraft();
    }
    
    // Check again after save attempt
    if (!currentSeriesId) return;

    const shot = shots[index];
    if (!shot.prompt) return;

    try {
      await generateShotVideoAction({
        seriesId: currentSeriesId as any,
        shotId: shot.id,
        prompt: shot.prompt
      });
    } catch (error) {
      console.error("Shot generation failed:", error);
    }
  };

  const addShot = (index?: number) => {
    const newShot = { id: Date.now(), prompt: '', image: null, duration: 4, transition: 'Crossfade', motion: 'Static', audio: '', renderStatus: 'idle' as const };
    if (typeof index === 'number') {
      const newShots = [...shots];
      newShots.splice(index + 1, 0, newShot);
      setShots(newShots);
    } else {
      setShots([...shots, newShot]);
    }
  };

  const removeShot = (id: number) => {
    setShots(shots.filter(s => s.id !== id));
  };

  const moveShot = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === shots.length - 1)) return;
    const newShots = [...shots];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newShots[index];
    newShots[index] = newShots[targetIndex];
    newShots[targetIndex] = temp;
    setShots(newShots);
  };

  const cycleTransition = (index: number) => {
    const transitions = ['Cut', 'Crossfade', 'Wipe', 'Morph'];
    const currentIdx = transitions.indexOf(shots[index].transition || 'Cut');
    const nextIdx = (currentIdx + 1) % transitions.length;
    
    const newShots = [...shots];
    newShots[index].transition = transitions[nextIdx];
    setShots(newShots);
  };

  const cycleMotion = (index: number) => {
    const motions = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Tilt Up', 'Tilt Down'];
    const currentIdx = motions.indexOf(shots[index].motion || 'Static');
    const nextIdx = (currentIdx + 1) % motions.length;
    
    const newShots = [...shots];
    newShots[index].motion = motions[nextIdx];
    setShots(newShots);
  };

  const adjustDuration = (index: number, amount: number) => {
    const newShots = [...shots];
    const newDuration = Math.max(1, Math.min(10, (newShots[index].duration || 4) + amount));
    newShots[index].duration = newDuration;
    setShots(newShots);
  };

  const toggleShotAudio = (index: number) => {
    const newShots = [...shots];
    newShots[index].audio = newShots[index].audio ? '' : '';
    setShots(newShots);
  };

  const calculateCost = () => {
    const shotTotal = shots.reduce((acc, shot) => acc + (shot.duration * 4), 0);
    return shotTotal + (audioTrack ? 10 : 0); 
  };

  if (viewMode === 'list') {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative p-6 md:p-10 lg:p-16">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-sans font-bold text-3xl md:text-5xl mb-1 tracking-tight text-white">Series Library</h2>
            <p className="text-gray-400 text-xs font-medium">Continue editing an existing series or create a new one.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <button 
               onClick={startNewSeries}
               className="aspect-video bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-2xl hover:bg-[#2a2a2a] hover:border-white/30 transition-all flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white"
             >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                   <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-[10px] uppercase tracking-widest">Create New Series</span>
             </button>

             {userSeries.map((s) => (
               <div key={s._id} className="aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg" onClick={() => openSeries(s._id)}>
                  {s.shots?.[0]?.image ? (
                    <img src={s.shots[0].image} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065]/50 to-black/50" />
                  )}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded border text-[8px] font-bold uppercase tracking-widest ${s.status === 'published' ? 'border-green-500/50 text-green-400 bg-green-900/40' : 'border-gray-500/50 text-gray-400 bg-gray-900/40'}`}>
                        {s.status}
                      </span>
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                         {s.shots?.length || 0} Shots
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg line-clamp-1">{s.title || 'Untitled Series'}</h3>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 flex-1 pb-40 max-w-7xl mx-auto w-full">
        
        {/* Header Section: Production Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-4 bg-[#0a0a0a]/50 p-4 md:p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
           <div className="flex items-center gap-6 flex-1 w-full">
              <button 
                onClick={backToList}
                className="group flex flex-col items-center justify-center w-14 h-14 bg-[#111] hover:bg-accent rounded-xl transition-all duration-500 border border-white/5 shadow-xl shrink-0"
                title="Back to Library"
              >
                <Library className="w-6 h-6 text-gray-500 group-hover:text-white group-hover:scale-110 transition-all" />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input 
                    type="text"
                    value={seriesTitle}
                    onChange={(e) => setSeriesTitle(e.target.value)}
                    placeholder="Series Title"
                    className="w-full bg-transparent border-none focus:outline-none placeholder-gray-800 font-sans font-black text-3xl md:text-4xl lg:text-5xl tracking-tighter text-white truncate pr-4"
                  />
                  <div className="absolute -bottom-1 left-0 w-12 h-1 bg-accent/30 rounded-full group-focus-within:w-full transition-all duration-700" />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-accent font-black uppercase tracking-[0.2em] bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                     <Film className="w-3 h-3" /> {progress}% RENDERED
                  </span>
                  <div className="h-1 bg-white/10 w-24 rounded-full overflow-hidden">
                     <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="h-1 w-1 bg-gray-800 rounded-full" />
                  <p className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em] hidden sm:block">Cinematic Production Studio</p>
                </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
              <div className="flex items-center gap-3">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest hidden md:block">Team</p>
                <button 
                  onClick={() => setShowCollab(true)}
                  className="flex items-center gap-3 pl-3 pr-4 py-2 bg-[#111] hover:bg-[#1a1a1a] rounded-xl border border-white/5 transition-all group"
                >
                  <div className="flex -space-x-3 group-hover:-space-x-1.5 transition-all">
                    {collaborators.length > 0 ? (
                      collaborators.slice(0, 3).map((collab) => (
                        <div key={collab.id} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-black ring-1 ring-white/5" title={collab.name}>
                           <img src={collab.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-black">
                        <Plus className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                       {collaborators.length > 0 ? "Collaborators" : "Add Team"}
                    </p>
                    {collaborators.length > 3 && (
                      <p className="text-[8px] text-gray-500 font-bold">+{collaborators.length - 3} others</p>
                    )}
                  </div>
                </button>
              </div>

              <div className="h-8 w-px bg-white/5 hidden lg:block mx-2" />

              <button 
                onClick={handleDeleteSeries} 
                className="group flex items-center gap-2 px-5 py-4 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 border border-red-500/10 shadow-lg font-black text-[10px] uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span className="hidden xl:inline">Discard</span>
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Vision & Setup */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Phase 1: The Vision (AI Master Script) */}
            <div className="bg-[#111] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                       <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Generation AI</h3>
                      <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Auto-Script Generation</p>
                    </div>
                  </div>
               </div>

               <div className="relative">
                  <textarea 
                    className="w-full bg-transparent p-6 text-sm focus:outline-none text-white placeholder-gray-800 resize-none min-h-[160px] transition-all leading-relaxed font-sans"
                    placeholder="Describe the overarching narrative or scene sequence... e.g., 'A high-speed chase through a neon cyberpunk city ending in a rooftop confrontation'"
                    value={masterPrompt}
                    onChange={(e) => setMasterPrompt(e.target.value)}
                  />
                  
                  <div className="p-4 pt-0 flex gap-2">
                    <button 
                      onClick={() => generateScript('new')} 
                      disabled={isGenerating || !masterPrompt}
                      className="flex-1 px-4 py-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-gray-500 hover:text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-white/5 shadow-inner active:scale-95"
                    >
                       <Wand2 className="w-3 h-3" /> Auto Script
                    </button>
                    <button 
                      onClick={() => generateScript('append')} 
                      disabled={isGenerating || !masterPrompt}
                      className="group relative flex-1 px-4 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-2 overflow-hidden border-none active:scale-95"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-accent via-indigo-600 to-accent opacity-90" />
                       <div className="relative flex items-center gap-2 text-white">
                          {isGenerating ? (
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          <span className="drop-shadow-sm">Continue</span>
                       </div>
                    </button>
                  </div>
               </div>
            </div>

            {/* Global Context (Bento Grid Style) */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-[#111] p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-0.5">
                    <Film className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Aspect</span>
                  </div>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="16:9">Wide (16:9)</option>
                    <option value="9:16">Vertical (9:16)</option>
                    <option value="1:1">Square (1:1)</option>
                    <option value="21:9">Ultra-Wide</option>
                  </select>
               </div>
               <div className="bg-[#111] p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-500 mb-0.5">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Engine</span>
                  </div>
                  <select 
                    value={model} 
                    onChange={(e) => setModel(e.target.value)}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Cinematic-XL">Cinematic XL</option>
                    <option value="HyperReal-V2">HyperReal V2</option>
                    <option value="Anime-Flux">Anime Flux</option>
                  </select>
               </div>
            </div>

            {/* Assets Management */}
            <div className="bg-[#111] rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                   <Library className="w-3.5 h-3.5 text-gray-500" />
                   <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Asset Library</h4>
                </div>
                <button className="text-accent text-[9px] font-black uppercase tracking-widest">+ New</button>
              </div>

              <div className="flex flex-col gap-2">
                 {/* Audio Asset */}
                 <button 
                   onClick={() => setShowAudioLibrary(true)}
                   className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl hover:bg-black transition-colors group border border-white/5"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Music className="w-3.5 h-3.5 text-orange-500" />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-bold text-gray-200 leading-tight">Global Audio</p>
                          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest truncate max-w-[120px]">
                             {audioTrack || "Add audio track"}
                          </p>
                       </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-white transition-colors" />
                 </button>

                 {/* Cast Members */}
                 <div className="mt-1">
                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-1">Project Elements</p>
                    <div className="flex flex-wrap gap-2">
                       {userElements.map((el) => (
                         <div key={el._id} className="group relative">
                            <div className="w-10 h-10 rounded-lg bg-black border border-white/5 overflow-hidden hover:border-accent/50 transition-all cursor-help" title={el.name}>
                               {el.img ? (
                                 <img src={el.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-gray-800" />
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                       <button className="w-10 h-10 rounded-lg border border-dashed border-white/10 flex items-center justify-center hover:bg-[#1a1a1a] transition-all text-gray-700 hover:text-white">
                          <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Production Floor (Timeline) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 px-2">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shadow-lg border border-accent/20">
                     <Film className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold font-sans tracking-tight text-white">Timeline Sequence</h2>
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Edit shot order and sequence</p>
                  </div>
               </div>
               <button 
                 onClick={() => addShot()}
                 className="flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-accent/10 hover:text-accent text-white rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95 shadow-lg group"
               >
                 <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" /> Add Shot
               </button>
               <button
                 onClick={handleBulkGenerate}
                 disabled={isGenerating}
                 className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all border border-accent/20 active:scale-95 shadow-lg group"
               >
                 <Wand2 className="w-3 h-3 group-hover:rotate-12 transition-transform" /> {isGenerating ? 'Generating...' : 'Generate All'}
               </button>
            </div>

            <div className="flex flex-col relative pt-2">
               {/* Decorative Timeline Line */}
               <div className="absolute left-[1.15rem] top-10 bottom-12 w-px bg-gradient-to-b from-accent/50 via-gray-800/20 to-transparent opacity-50"></div>

               <div className="space-y-6">
                  {shots.map((shot, index) => (
                    <div key={shot.id} className="relative group">
                      
                      {/* Shot Connection / Transition */}
                      {index > 0 && (
                        <div className="absolute -top-6 left-0 w-full flex items-center justify-start z-20 pointer-events-none">
                           <div className="ml-1 px-4 pointer-events-auto">
                             <button 
                               onClick={() => cycleTransition(index)}
                               className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-[8px] uppercase font-black tracking-[0.15em] text-gray-500 hover:text-white hover:bg-accent transition-all border border-white/10 shadow-2xl"
                             >
                               <Scissors className="w-2.5 h-2.5" /> {shot.transition}
                             </button>
                           </div>
                        </div>
                      )}

                      <div className="flex gap-8 relative">
                        {/* Shot Indicator */}
                        <div className="w-10 flex flex-col items-center shrink-0 pt-4 relative z-10">
                           <div className="w-6 h-6 rounded-full border-2 border-accent bg-black shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center justify-center text-[8px] font-black text-accent">
                              {index + 1}
                           </div>
                           <div className="text-[9px] text-gray-600 font-black tracking-widest mt-2">{shot.duration}s</div>
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                           {/* Shot Card */}
                           <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-accent/30 shadow-2xl group flex flex-col md:flex-row">
                           
                           {/* Visual Preview / Upload */}
                           <div className="md:w-56 aspect-[16/9] md:aspect-auto bg-black relative group/img cursor-pointer">
                              {shot.videoUrl ? (
                                <video src={shot.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                              ) : shot.image ? (
                                <img src={shot.image} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity duration-700" alt="" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-800 group-hover/img:text-gray-500 transition-colors">
                                   <ImageIcon className="w-6 h-6" />
                                   <span className="text-[7px] font-black uppercase tracking-widest text-center px-4">AI Preview</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover/img:from-black/40 transition-all" />
                              
                              {shot.renderStatus === 'generating' && (
                                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                   <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                                   <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Rendering Shot...</span>
                                </div>
                              )}

                              <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[7px] font-black text-white uppercase tracking-widest border border-white/10">SHOT {index + 1}</span>
                              </div>
                           </div>

                           <div className="flex-1 flex flex-col min-w-0">
                              {/* Shot Controls Bar */}
                              <div className="p-2.5 px-5 bg-black/40 border-b border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => cycleMotion(index)} className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] px-2.5 py-1 rounded-lg text-[8px] uppercase tracking-[0.1em] font-black text-gray-500 transition-all">
                                       <Move className="w-2.5 h-2.5" /> {shot.motion}
                                    </button>
                                    <div className="flex items-center bg-[#1a1a1a] px-2.5 py-1 rounded-lg">
                                      <Timer className="w-2.5 h-2.5 text-gray-700 mr-2" />
                                      <button onClick={() => adjustDuration(index, -1)} className="text-gray-600 hover:text-white px-1 font-black">-</button>
                                      <span className="text-[9px] font-black w-5 text-center text-accent">{shot.duration}s</span>
                                      <button onClick={() => adjustDuration(index, 1)} className="text-gray-600 hover:text-white px-1 font-black">+</button>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => moveShot(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-700 hover:text-white disabled:opacity-5 transition-colors">
                                       <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => moveShot(index, 'down')} disabled={index === shots.length - 1} className="p-1.5 text-gray-700 hover:text-white disabled:opacity-5 transition-colors">
                                       <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                 </div>
                              </div>

                              <div className="p-5 flex flex-col flex-1">
                                 <textarea
                                   className="w-full bg-transparent text-sm focus:outline-none min-h-[80px] resize-none text-white placeholder-gray-800 transition-colors pr-2 leading-relaxed font-sans"
                                   placeholder={`Describe Shot ${index + 1}...`}
                                   value={shot.prompt}
                                   onChange={(e) => {
                                     const newShots = [...shots];
                                     newShots[index].prompt = e.target.value;
                                     setShots(newShots);
                                   }}
                                 />
                                 
                                 <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                       <button 
                                         onClick={() => toggleShotAudio(index)}
                                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-widest font-black transition-all ${shot.audio !== '' ? 'bg-orange-950/20 text-orange-500' : 'text-gray-700 hover:text-gray-500'}`}
                                       >
                                          <Mic className={`w-3 h-3 ${shot.audio !== '' ? 'animate-pulse' : ''}`} /> {shot.audio !== '' ? 'Dialogue' : 'Add Audio'}
                                       </button>
                                    </div>
                                    
                                    {shot.audio !== '' && (
                                       <div className="relative animate-in slide-in-from-top-1 duration-200">
                                          <input 
                                            type="text" 
                                            className="bg-black/50 rounded-lg px-3 py-2 border border-white/5 text-[11px] text-orange-400/80 w-full focus:outline-none focus:border-orange-500/30 placeholder-orange-900/40"
                                            placeholder="Dialogue or SFX..."
                                            value={shot.audio}
                                            onChange={(e) => {
                                              const newShots = [...shots];
                                              newShots[index].audio = e.target.value;
                                              setShots(newShots);
                                            }}
                                          />
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Per-Shot Action Bar - Matches Shot Frame Width */}
                        <div className="mt-3 flex justify-end items-center gap-2.5">
                           <div className="h-px bg-white/5 flex-1 mx-2" /> 
                           
                           <button 
                             onClick={() => addShot(index)}
                             className="flex items-center gap-2 px-4 py-2 bg-[#111] hover:bg-accent text-gray-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-xl hover:shadow-accent/20 whitespace-nowrap"
                           >
                              <Plus className="w-3 h-3" />
                              Insert Shot
                           </button>
                           
                           <button 
                             onClick={() => handleGenerateShot(index)} 
                             disabled={shot.renderStatus === 'generating' || !shot.prompt}
                             className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-20 shadow-2xl overflow-hidden active:scale-95 border-none"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-accent via-indigo-600 to-accent opacity-90" />
                              <div className="relative flex items-center gap-2 text-white">
                                <Wand2 className={`w-3.5 h-3.5 ${shot.renderStatus === 'generating' ? 'animate-spin' : ''}`} />
                                <span className="drop-shadow-md">
                                  {shot.renderStatus === 'completed' ? 'Regenerate' : 'Generate'}
                                </span>
                              </div>
                           </button>

                           <button 
                             onClick={() => removeShot(shot.id)}
                             className="flex items-center justify-center p-2.5 bg-[#111] hover:bg-red-600 text-white/40 hover:text-white rounded-xl transition-all border border-white/5 shadow-xl"
                             title="Delete"
                           >
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}
               </div>

               {/* Spacer for bottom scrolling */}
               <div className="h-20" />
          </div>
        </div>
      </div>
    </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#2a2a2a] p-2 md:p-3 z-50">
         <div className="max-w-5xl mx-auto flex flex-nowrap justify-between items-center px-4 py-2 md:px-10">
            <div className="flex flex-col">
               <span className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">Total Cost</span>
               <span className="text-xs font-bold font-sans text-white leading-none">{calculateCost()} Crd</span>
            </div>
            
            <div className="flex gap-2 md:gap-3 flex-nowrap justify-center shrink-0">
               <button 
                 onClick={handleBulkGenerate}
                 disabled={isGenerating}
                 className="shrink-0 font-bold px-3 md:px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md text-[9px] md:text-[10px] uppercase tracking-widest bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white active:scale-95"
               >
                 {isGenerating ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                 Render All
               </button>

               <button 
                 onClick={handleSaveDraft}
                 disabled={isSaving || saveSuccess}
                 className={`shrink-0 font-bold px-3 md:px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md text-[9px] md:text-[10px] uppercase tracking-widest ${saveSuccess ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'} active:scale-95`}
               >
                 {isSaving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : saveSuccess ? <Sparkles className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
                 {saveSuccess ? 'Saved' : 'Save Draft'}
               </button>

               <button 
                 onClick={handlePublish}
                 disabled={isPublishing || publishSuccess}
                 className={`${publishSuccess ? 'bg-green-600 border-green-600' : 'bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02]'} active:scale-95 text-white shadow-lg px-5 md:px-7 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] md:min-w-[130px] justify-center`}
               >
                 {isPublishing ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     <span>Rendering...</span>
                   </>
                 ) : publishSuccess ? (
                   <>
                     <Sparkles className="w-4 h-4 fill-white" />
                     <span>Published!</span>
                   </>
                 ) : (
                   <>
                     <Play className="w-4 h-4 fill-white" /> Render
                   </>
                 )}
               </button>
            </div>
         </div>
      </div>
      
      {showAudioLibrary && (
        <AudioLibrary 
          onClose={() => setShowAudioLibrary(false)} 
          onSelect={(track) => {
            setAudioTrack(track.name);
            setShowAudioLibrary(false);
          }} 
        />
      )}

      {showCollab && (
        <CollaborationOverlay 
          onClose={() => setShowCollab(false)} 
          collaborators={collaborators}
          seriesId={currentSeriesId || ''} 
        />
      )}
    </div>
  );
}
