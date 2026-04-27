import React from 'react';
import { BookOpen, Settings2, SpellCheck, Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ArrowRight, Film } from 'lucide-react';

export default function AINovel({ onOpenTool }: { onOpenTool?: (toolId: string) => void }) {
  const [title, setTitle] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const [premise, setPremise] = React.useState('');
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisComplete, setAnalysisComplete] = React.useState(false);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  if (isGenerated) {
    return (
      <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
        {/* Reader Header */}
        <div className="sticky top-0 z-10 bg-base/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
           <button onClick={() => { setIsGenerated(false); setAnalysisComplete(false); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <h3 className="font-bold font-sans text-lg">{title || 'Untitled Novel'}</h3>
           <div className="w-9" />
        </div>

        <div className="p-6 md:p-12 lg:p-16 flex-1 max-w-4xl mx-auto w-full pb-40">
           <div className="mb-12">
             <div className="flex flex-col items-center mb-10">
               <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-3 block">Chapter One</span>
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-white text-center leading-tight">The Awakening</h1>
               <div className="w-12 h-1 bg-accent/30 rounded-full mt-6" />
             </div>
             
             <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-12 border border-white/5 shadow-2xl relative group">
               <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2000" alt="Chapter Art" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
             </div>
 
             <div className="space-y-8 text-gray-200 font-serif text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left">The neon hum of the city leaked through the cracked blinds, painting lines of electric pink across Kael's face. He lay still, listening to the heavy synthetic rain drumming against the plexiglass window.</p>
                <p>It had been exactly three days since the rogue code was implanted in his neural port. Three days of fractured memories and voices whispering in dead languages.</p>
                <p>He sat up, wincing as a sharp pain lanced behind his left eye. The HUD that lived in his vision flickered, red warning runes cascading across his sightline.</p>
                <p className="italic text-gray-400 border-l-2 border-accent/30 pl-6 py-2 ml-4 italic">"They're coming," a voice hissed, not from outside, but from the metal embedded in his skull.</p>
             </div>
           </div>

           {/* Conversion CTA / Analysis Area */}
           <div className="max-w-3xl mx-auto">
             {isAnalyzing ? (
                <div className="bg-accent/5 border border-accent/10 rounded-[3rem] p-16 flex flex-col items-center text-center gap-8 shadow-2xl backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Deconstructing Narrative</h4>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">AI is extracting visual beats and cinematic shots for your storyboard...</p>
                  </div>
                </div>
             ) : analysisComplete ? (
                <div className="bg-accent/5 border border-accent/20 rounded-[3rem] p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30">
                        <Sparkles className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white">Storyboard Ready</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">3 Cinematic Shots Generated</p>
                      </div>
                    </div>
                    <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5"><Settings2 className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[
                       { t: 'ES', d: 'Neon city skyline through cracked blinds' },
                       { t: 'CU', d: 'Neural port with glowing red warnings' },
                       { t: 'POV', d: 'HUD HUD flickering with rogue runes' }
                     ].map((s, i) => (
                       <div key={i} className="flex flex-col gap-3 p-5 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group">
                         <span className="text-[10px] font-bold text-accent px-3 py-1 bg-accent/10 rounded-lg w-max uppercase tracking-widest group-hover:bg-accent group-hover:text-white transition-colors">{s.t}</span>
                         <p className="text-xs text-gray-400 font-medium leading-relaxed">{s.d}</p>
                       </div>
                     ))}
                  </div>

                  <button onClick={() => onOpenTool?.('series')} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4.5 rounded-full flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_rgba(124,58,237,0.3)] active:scale-[0.98] mt-2">
                     < Film className="w-5 h-5" />
                     Launch in Series Studio 
                     <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
             ) : (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-[3rem] p-12 mt-20 flex flex-col items-center text-center backdrop-blur-md shadow-2xl group hover:border-blue-500/20 transition-all">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                     <Film className="w-7 h-7 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">Visualize this Chapter</h4>
                  <p className="text-sm text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">Transform your manuscript into a living production. Our AI will analyze your prose and instantly prepare a storyboard with character-locked elements.</p>
                  <button onClick={handleStartAnalysis} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-full flex items-center gap-3 transition-all shadow-[0_15px_30px_rgba(37,99,235,0.3)] active:scale-95 group">
                     Analyze & Build Storyboard <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-6 flex-1 pb-32">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-2xl mb-0.5">AI Novel</h2>
              <p className="text-gray-400 text-xs font-medium">Let Claude weave a story for you. Each chapter comes with an AI illustration.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
               <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Working Title</label>
               <input
                 type="text"
                 placeholder="e.g. Echoes of the Neon Grid"
                 className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-xl font-bold focus:outline-none focus:border-accent text-white placeholder-gray-700 transition-all shadow-inner"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 relative">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Genre</label>
                 <div className="relative">
                   <select 
                     className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-accent appearance-none text-white cursor-pointer transition-all shadow-inner"
                     value={genre}
                     onChange={e => setGenre(e.target.value)}
                   >
                     <option value="" className="bg-base">Select Genre...</option>
                     <option value="sci-fi" className="bg-base">Sci-Fi</option>
                     <option value="fantasy" className="bg-base">Fantasy</option>
                     <option value="romance" className="bg-base">Romance</option>
                     <option value="thriller" className="bg-base">Thriller</option>
                   </select>
                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Tone</label>
                 <div className="relative">
                   <select className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-accent appearance-none text-white cursor-pointer transition-all shadow-inner">
                     <option className="bg-base">Cinematic & Dark</option>
                     <option className="bg-base">Whimsical & Light</option>
                     <option className="bg-base">Gritty Realism</option>
                   </select>
                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Core Premise & Characters</label>
               <textarea
                 placeholder="Describe the main character and the inciting incident..."
                 className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:border-accent min-h-[120px] text-white placeholder-gray-700 transition-all resize-none font-sans shadow-inner"
                 value={premise}
                 onChange={e => setPremise(e.target.value)}
               />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-accent/10 rounded-lg">
                  <ImageIcon className="w-4 h-4 text-accent" />
                </div>
                <div>
                   <p className="font-bold text-gray-200 text-xs">Auto-generate Scene Image</p>
                   <p className="text-[10px] text-gray-500 font-medium">Abstract illustration per chapter</p>
                </div>
              </div>
              <div className="w-10 h-5.5 bg-accent rounded-full relative shadow-sm cursor-pointer border border-white/5">
                <div className="w-4.5 h-4.5 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Bottom Bar (Frameless & Blended) */}
      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-4 md:p-5 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1 opacity-70">Est. Cost</span>
              <span className="text-sm font-bold font-sans text-accent leading-none">50 Credits</span>
           </div>
           
           <button onClick={() => setIsGenerated(true)} className="bg-accent hover:bg-accent-hover active:scale-95 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
             <Sparkles className="w-4 h-4 fill-white" /> Draft Chapter 1
           </button>
        </div>
      </div>
    </div>
  );
}
