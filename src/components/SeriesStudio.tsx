import React from 'react';
import { Image as ImageIcon, Plus, Play, Trash2, Settings2, ChevronDown, Wand2, Film, ArrowUp, ArrowDown, Music, Scissors, Sparkles, Move, Timer, Mic, TextSelect, X, Users, UserPlus } from 'lucide-react';
import AudioLibrary from './AudioLibrary';
import CollaborationOverlay from './CollaborationOverlay';

export default function SeriesStudio() {
  const [shots, setShots] = React.useState([
    { id: 1, prompt: '', image: null, duration: 4, transition: 'Cut', motion: 'Static', audio: '' }
  ]);
  const [model, setModel] = React.useState('Runway Gen-3');
  const [aspectRatio, setAspectRatio] = React.useState('16:9');
  const [audioTrack, setAudioTrack] = React.useState<string | null>(null);
  const [showAutoScript, setShowAutoScript] = React.useState(false);
  const [showAudioLibrary, setShowAudioLibrary] = React.useState(false);
  const [showCollab, setShowCollab] = React.useState(false);
  const [collaborators, setCollaborators] = React.useState([
    { id: 1, name: 'You', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: 2, name: 'AI Director', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Director' }
  ]);
  const [masterPrompt, setMasterPrompt] = React.useState('');
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishSuccess, setPublishSuccess] = React.useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
    }, 2500);
  };

  const addShot = () => {
    setShots([...shots, { id: Date.now(), prompt: '', image: null, duration: 4, transition: 'Crossfade', motion: 'Static', audio: '' }]);
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
    newShots[index].audio = newShots[index].audio ? '' : 'Dialogue: "Let\'s go!"';
    setShots(newShots);
  };

  const generateScript = () => {
    // Generate different scripts based on the master prompt using simple keyword matching for demonstration
    const prompt = masterPrompt.toLowerCase();
    let newShots = [];

    if (prompt.includes('fantasy') || prompt.includes('dragon') || prompt.includes('magic')) {
       newShots = [
         { id: Date.now(), prompt: 'A massive medieval city floating in the clouds, bathed in golden sunlight. Wide establishing shot.', image: null, duration: 5, transition: 'Wipe', motion: 'Pan Right', audio: 'Epic orchestral buildup' },
         { id: Date.now() + 1, prompt: 'A young wizard with glowing hands standing on the city wall, looking down at the earth.', image: null, duration: 4, transition: 'Cut', motion: 'Zoom In', audio: 'Dialogue: "The time has come."' },
         { id: Date.now() + 2, prompt: 'A giant red dragon breaches the clouds directly behind the wizard.', image: null, duration: 3, transition: 'Crossfade', motion: 'Tilt Up', audio: 'Dragon roar SFX' }
       ];
    } else if (prompt.includes('horror') || prompt.includes('scary')) {
       newShots = [
         { id: Date.now(), prompt: 'An abandoned hospital hallway lit by a single flickering fluorescent light. Static shot.', image: null, duration: 4, transition: 'Cut', motion: 'Static', audio: 'Low hum, water dripping' },
         { id: Date.now() + 1, prompt: 'A dark silhouette rapidly crawling along the ceiling towards the camera.', image: null, duration: 3, transition: 'Cut', motion: 'Zoom In', audio: 'Rapid scuttering sounds' },
       ];
    } else {
       // Default Cyberpunk
       newShots = [
         { id: Date.now(), prompt: 'A neon-lit cyberpunk city street, rain pouring down. Establishing shot.', image: null, duration: 4, transition: 'Cut', motion: 'Pan Right', audio: 'Synthwave bassline starts' },
         { id: Date.now() + 1, prompt: 'Close up of a rogue android looking over their shoulder, eyes glowing blue.', image: null, duration: 3, transition: 'Crossfade', motion: 'Zoom In', audio: 'Dialogue: "They found us."' },
         { id: Date.now() + 2, prompt: 'A sleek flying car speeds past overhead, splashing neon water.', image: null, duration: 5, transition: 'Wipe', motion: 'Tilt Up', audio: 'Engine roar SFX' }
       ];
    }
    
    setShots(newShots);
    setShowAutoScript(false);
  };

  const calculateCost = () => {
    const shotTotal = shots.reduce((acc, shot) => acc + (shot.duration * 4), 0);
    return shotTotal + (audioTrack ? 10 : 0); 
  };

  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          
          {/* Header & Settings */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-sans font-bold text-3xl md:text-5xl mb-1 tracking-tight">Series Studio</h2>
                  <p className="text-gray-400 text-xs font-medium">Create cinematic series by stitching multiple shots.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex -space-x-1.5 mr-1">
                     {collaborators.map(c => (
                       <div 
                         key={c.id} 
                         className="w-7 h-7 rounded-full border-2 border-base overflow-hidden bg-white/10 cursor-pointer hover:translate-y-[-1px] transition-transform" 
                         title={`${c.name} (${c.role})`}
                         onClick={() => setShowCollab(true)}
                       >
                         <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                       </div>
                     ))}
                     <button 
                       onClick={() => setShowCollab(true)}
                       className="w-7 h-7 rounded-full border-2 border-base bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group"
                     >
                        <UserPlus className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                     </button>
                  </div>
                  <button onClick={() => setShowAutoScript(!showAutoScript)} className={`shrink-0 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border shadow-md text-xs ${showAutoScript ? 'bg-white/10 text-white border-white/20' : 'bg-accent/20 text-accent border-accent/40 hover:bg-accent/30'} active:scale-95`}>
                    <Sparkles className="w-3.5 h-3.5" /> <span className="hidden md:inline">Auto-Script</span>
                  </button>
                </div>
             </div>
             <div className="flex flex-wrap gap-2">
               <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-white/5">
                 <Wand2 className="w-3.5 h-3.5 text-gray-400" />
                 {model} <ChevronDown className="w-3 h-3 text-gray-500" />
               </button>
               <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-white/5">
                 <Film className="w-3.5 h-3.5 text-gray-400" />
                 {aspectRatio} <ChevronDown className="w-3 h-3 text-gray-500" />
               </button>
             </div>
          </div>

          {/* Auto-Script Config */}
          {showAutoScript && (
             <div className="border border-accent/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-accent">
                    <TextSelect className="w-5 h-5" />
                    <h3 className="font-bold font-sans text-white">Generate Sequence from Prompt</h3>
                  </div>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent text-white placeholder-gray-500 resize-none min-h-[100px] transition-all"
                    placeholder="E.g. A fantasy sequence about a wizard discovering a dragon in a floating city..."
                    value={masterPrompt}
                    onChange={(e) => setMasterPrompt(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                     <button onClick={() => setShowAutoScript(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                     <button onClick={generateScript} className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                        <Wand2 className="w-4 h-4" /> Generate Shots
                     </button>
                  </div>
                </div>
             </div>
          )}

          {/* Global Audio Track */}
          <div 
            onClick={() => setShowAudioLibrary(true)}
            className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group"
          >
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:scale-105 transition-transform">
                   <Music className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-md mb-0.5">Global Audio Track</p>
                  <p className="text-xs text-gray-400">{audioTrack ? audioTrack : 'Add background music or voiceover'}</p>
                </div>
             </div>
             {audioTrack ? (
               <button 
                 onClick={(e) => { e.stopPropagation(); setAudioTrack(null); }}
                 className="text-orange-400 text-sm font-bold bg-orange-500/10 px-4 py-2 rounded-full hover:bg-orange-500/20 transition-colors"
               >
                 Remove
               </button>
             ) : (
               <div className="text-orange-400 text-sm font-bold bg-orange-500/10 px-4 py-2 rounded-full">
                 + Add
               </div>
             )}
          </div>

          {/* Summon Elements (Cast & Props) */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-300">Elements</h3>
                <button className="text-accent text-xs font-bold">+ New</button>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {[
                  { name: 'Kael (Hero)', type: 'Character', img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=100' },
                  { name: 'Monolith Prop', type: 'Prop', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100' },
                  { name: 'Cyber Bike', type: 'Prop', img: 'https://images.unsplash.com/photo-1605152276897-4f499899316d?w=100' }
                ].map((el, i) => (
                  <button key={i} className="flex-shrink-0 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                    <div className="relative">
                      <img src={el.img} className="w-10 h-10 rounded-2xl object-cover" alt="" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{el.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{el.type}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          {/* Timeline Sequence */}
          <div className="flex flex-col relative pt-4 mt-2">
            <div className="absolute left-[1.15rem] top-8 bottom-12 w-px bg-white/10 border-l border-dashed border-white/20"></div>

            {shots.map((shot, index) => (
              <div key={shot.id} className="relative flex flex-col gap-2 pb-8 group">
                
                {/* Transition Indicator (Not on first shot) */}
                {index > 0 && (
                  <div className="flex gap-6 items-center absolute -top-8 left-0 w-full z-20">
                     <div className="w-10 flex justify-center">
                       <button 
                         onClick={() => cycleTransition(index)}
                         className="bg-base border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white hover:border-white transition-colors shadow-lg"
                       >
                         <Scissors className="w-3 h-3" /> {shot.transition}
                       </button>
                     </div>
                  </div>
                )}

                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2 z-10 w-10 mt-1.5">
                     <div className="bg-base border-2 border-blue-500 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                       {index + 1}
                     </div>
                     <div className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">{shot.duration}s</div>
                  </div>

                  <div className="flex-1 flex flex-col mt-1 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden focus-within:border-blue-500/50 transition-colors">
                     {/* Move controls */}
                     <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => moveShot(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => moveShot(index, 'down')} disabled={index === shots.length - 1} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                     </div>

                     <div className="p-4 pb-2">
                       <textarea
                         className="w-full bg-transparent text-lg focus:outline-none min-h-[60px] resize-none text-white placeholder-gray-600 transition-colors pr-8"
                         placeholder={`Describe Shot ${index + 1}...`}
                         value={shot.prompt}
                         onChange={(e) => {
                           const newShots = [...shots];
                           newShots[index].prompt = e.target.value;
                           setShots(newShots);
                         }}
                       />
                       
                       {/* Contextual audio input if enabled */}
                       {shot.audio !== '' && (
                         <div className="flex items-start gap-2 mt-2 pt-3 border-t border-white/5">
                            <Mic className="w-4 h-4 text-orange-400 mt-1 shrink-0" />
                            <input 
                              type="text" 
                              className="bg-transparent border-none text-sm text-gray-300 w-full focus:outline-none focus:text-white placeholder-gray-600"
                              placeholder="Add dialogue, SFX, or describe shot audio..."
                              value={shot.audio}
                              onChange={(e) => {
                                const newShots = [...shots];
                                newShots[index].audio = e.target.value;
                                setShots(newShots);
                              }}
                              autoFocus={shot.audio === 'Dialogue: "Let\'s go!"'}
                            />
                         </div>
                       )}
                     </div>
                     
                     <div className="bg-black/20 p-3 px-4 border-t border-white/5 flex items-center justify-between overflow-x-auto no-scrollbar">
                       <div className="flex items-center gap-3 shrink-0">
                          <button onClick={() => cycleMotion(index)} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors border border-white/5 text-gray-300">
                             <Move className="w-3.5 h-3.5" /> {shot.motion}
                          </button>
                          
                          <div className="flex items-center bg-white/5 px-2 py-1.5 rounded-2xl border border-white/5">
                             <Timer className="w-3.5 h-3.5 text-gray-400 mr-2 ml-1" />
                             <button onClick={() => adjustDuration(index, -1)} className="text-gray-400 hover:text-white px-1 font-bold">-</button>
                             <span className="text-xs font-bold w-4 text-center text-gray-300">{shot.duration}s</span>
                             <button onClick={() => adjustDuration(index, 1)} className="text-gray-400 hover:text-white px-1 font-bold">+</button>
                          </div>

                          <button onClick={() => toggleShotAudio(index)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors border ${shot.audio !== '' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'}`}>
                             <Mic className="w-3.5 h-3.5" /> Audio
                          </button>
                       </div>
                       
                       <div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-2">
                           <button className="flex items-center justify-center bg-white/5 hover:bg-white/10 p-2 rounded-2xl text-xs font-bold transition-colors border border-white/5 shrink-0" title="Reference Image">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                           </button>
                           {shots.length > 1 && (
                             <button onClick={() => removeShot(shot.id)} className="text-red-500/50 hover:text-red-400 transition-colors p-2 bg-red-500/5 rounded-2xl hover:bg-red-500/10 text-xs font-bold shrink-0" title="Delete Shot">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="relative flex gap-6 mt-4">
              <div className="w-10 flex justify-center z-10">
                <button 
                  onClick={addShot}
                  className="bg-base border-2 border-dashed border-white/30 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-white hover:bg-white/5 transition-all shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 pt-1.5 flex items-center">
                 <button onClick={addShot} className="text-gray-500 text-sm font-bold hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                   + Add Shot to Sequence
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-4 md:p-5 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1 opacity-70">Total Cost</span>
              <span className="text-sm font-bold font-sans text-blue-500 leading-none">{calculateCost()} Crd</span>
           </div>
           
           <button 
             onClick={handlePublish}
             disabled={isPublishing || publishSuccess}
             className={`${publishSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'} active:scale-95 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center`}
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
        />
      )}
    </div>
  );
}
