import React, { useContext } from 'react';
import { BookOpen, Settings2, SpellCheck, Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ArrowRight, Film } from 'lucide-react';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';
import Markdown from 'react-markdown';

export default function AINovel({ novelId, onOpenTool }: { novelId?: string, onOpenTool?: (toolId: string) => void }) {
  const { convexUserId } = useContext(AuthContext);
  const createNovelMutation = useMutation(api.users.createNovel);
  const generateNovelAction = useAction(api.videos.generateNovelAction);
  
  const userElements = useQuery(
    api.users.getElements,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const novels = useQuery(
    api.users.getNovels,
    convexUserId ? { userId: convexUserId as any } : "skip"
  ) || [];

  const existingNovel = novels.find(n => n._id === novelId);

  const [title, setTitle] = React.useState('');
  const [genre, setGenre] = React.useState('sci-fi');
  const [tone, setTone] = React.useState('Cinematic & Dark');
  const [premise, setPremise] = React.useState('');
  const [isGenerated, setIsGenerated] = React.useState(!!novelId);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisComplete, setAnalysisComplete] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (existingNovel) {
      setTitle(existingNovel.title);
      setIsGenerated(true);
    }
  }, [existingNovel]);

  const analyzeChapterAction = useAction(api.videos.analyzeChapterAction);
  const [visualBeats, setVisualBeats] = React.useState<{t: string, d: string}[]>([]);

  const handleStartAnalysis = async () => {
    if (!existingNovel?.content) return;
    setIsAnalyzing(true);
    try {
      const beats = await analyzeChapterAction({ content: existingNovel.content });
      setVisualBeats(beats);
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Analysis failed", error);
      setVisualBeats([]);
      setAnalysisComplete(false);
      alert("Visual analysis failed. Please try again or check your content.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraft = async () => {
    if (!premise.trim() || !convexUserId) return;
    setIsSaving(true);
    try {
      // 1. Generate content via Gemini
      const result = await generateNovelAction({
        prompt: premise,
        genre: genre,
        tone: tone
      });

      // 2. Generate cover image
      const seed = Math.floor(Math.random() * 1000);
      const coverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.title || title || premise + " cinematic book cover artistic") }?width=1280&height=720&nologo=true&seed=${seed}`;

      // 3. Save to database
      await createNovelMutation({
        userId: convexUserId as any,
        title: result.title || title || 'Untitled Novel',
        content: result.content,
        imageUrl: coverUrl
      });

      if (result.title) setTitle(result.title);
      setIsGenerated(true);
    } catch (error) {
      console.error("Failed to create novel:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerated && existingNovel) {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
        {/* Reader Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5">
           <button onClick={() => { setIsGenerated(false); setAnalysisComplete(false); }} className="p-2 bg-black rounded-full hover:bg-[#1a1a1a] transition-colors text-white">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <h3 className="font-bold font-sans text-lg truncate px-4">{existingNovel.title}</h3>
           <div className="w-9" />
        </div>

        <div className="p-6 md:p-12 lg:p-16 flex-1 max-w-4xl mx-auto w-full pb-40">
           <div className="mb-12">
             <div className="flex flex-col items-center mb-10">
               <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-3 block">Chapter One</span>
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-white text-center leading-tight">{existingNovel.title}</h1>
               <div className="w-12 h-1 bg-white/30 rounded-full mt-6" />
             </div>
             
             <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-12 shadow-lg relative group">
               <img src={existingNovel.imageUrl || "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=2000"} alt="Chapter Art" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
             </div>
 
             <div className="markdown-body space-y-8 text-gray-200 font-serif text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
                <Markdown>{existingNovel.content || "No content generated yet."}</Markdown>
             </div>
           </div>

           {/* Conversion CTA / Analysis Area */}
           <div className="max-w-3xl mx-auto">
              {isAnalyzing ? (
                <div className="bg-black rounded-[3rem] p-16 flex flex-col items-center text-center gap-8 shadow-lg">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-black border-t-white rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Deconstructing Narrative</h4>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">AI is extracting visual beats and cinematic shots for your storyboard...</p>
                  </div>
                </div>
             ) : analysisComplete ? (
                <div className="bg-black rounded-[3rem] p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#2e1065] rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white">Storyboard Ready</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">3 Cinematic Shots Generated</p>
                      </div>
                    </div>
                    <button className="p-3 bg-black rounded-full hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"><Settings2 className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {visualBeats.map((s, i) => (
                       <div key={i} className="flex flex-col gap-3 p-5 bg-black rounded-3xl hover:bg-[#1a1a1a] transition-colors group">
                         <span className="text-[10px] font-bold text-white px-3 py-1 bg-[#2e1065] rounded-lg w-max uppercase tracking-widest group-hover:bg-[#1a1a1a] transition-colors">{s.t}</span>
                         <p className="text-xs text-gray-400 font-medium leading-relaxed">{s.d}</p>
                       </div>
                     ))}
                  </div>

                  <button onClick={() => onOpenTool?.('series')} className="w-full bg-[#2e1065] hover:bg-[#5b21b6] text-white font-bold py-4.5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-2">
                     < Film className="w-5 h-5" />
                     Launch in Series Studio 
                     <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
             ) : (
                <div className="bg-black rounded-[3rem] p-12 mt-20 flex flex-col items-center text-center shadow-lg group hover:bg-[#1a1a1a] transition-all">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Film className="w-7 h-7 text-blue-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">Visualize this Chapter</h4>
                  <p className="text-sm text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">Transform your manuscript into a living production. Our AI will analyze your prose and instantly prepare a storyboard with character-locked elements.</p>
                  <button onClick={handleStartAnalysis} className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-full flex items-center gap-3 transition-all active:scale-95 group">
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
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
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
                 className="w-full bg-black rounded-[1.25rem] px-5 py-3.5 text-lg font-bold focus:outline-none text-white placeholder-gray-700 transition-all shadow-lg"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 relative">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Genre</label>
                 <div className="relative">
                   <select 
                     className="w-full bg-[#1a1a1a] rounded-full px-5 py-3 text-xs font-bold focus:outline-none appearance-none text-white cursor-pointer transition-all hover:bg-[#2a2a2a] shadow-lg"
                     value={genre}
                     onChange={e => setGenre(e.target.value)}
                   >
                     <option value="" className="bg-black">Select Genre...</option>
                     <option value="sci-fi" className="bg-black">Sci-Fi</option>
                     <option value="fantasy" className="bg-black">Fantasy</option>
                     <option value="romance" className="bg-black">Romance</option>
                     <option value="thriller" className="bg-black">Thriller</option>
                   </select>
                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                 <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Tone</label>
                 <div className="relative">
                   <select 
                      className="w-full bg-[#1a1a1a] rounded-full px-5 py-3 text-xs font-bold focus:outline-none appearance-none text-white cursor-pointer transition-all hover:bg-[#2a2a2a] shadow-lg"
                      value={tone}
                      onChange={e => setTone(e.target.value)}
                    >
                     <option className="bg-black">Cinematic & Dark</option>
                     <option className="bg-black">Whimsical & Light</option>
                     <option className="bg-black">Gritty Realism</option>
                   </select>
                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-gray-500 font-bold text-[10px] uppercase tracking-widest pl-1">Core Premise & Characters</label>
               <textarea
                 placeholder="Describe the main character and the inciting incident..."
                 className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-[1.25rem] px-5 py-3.5 text-xs focus:outline-none focus:border-accent min-h-[100px] text-white placeholder-gray-700 transition-all resize-none font-sans shadow-lg"
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

      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-black border-t border-[#2a2a2a] p-3 md:p-4 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
            <div className="flex flex-col">
               <span className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">Est. Cost</span>
               <span className="text-xs font-bold font-sans text-white leading-none">50 Credits</span>
            </div>
            
            <button onClick={handleDraft} className="bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02] active:scale-95 text-white shadow-lg px-7 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
              <Sparkles className="w-3.5 h-3.5 fill-white" /> Draft Chapter 1
            </button>
        </div>
      </div>
    </div>
  );
}
