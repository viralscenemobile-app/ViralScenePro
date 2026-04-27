import React from 'react';
import { BookOpen, Settings2, SpellCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function AINovel() {
  const [title, setTitle] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const [premise, setPremise] = React.useState('');
  
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
          
          <div className="flex flex-col gap-2">
            <h2 className="font-sans font-bold text-3xl">AI Novel</h2>
            <p className="text-gray-400 text-sm">Let Claude weave a multi-chapter story for you. Each chapter generated comes with an AI illustration.</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
               <label className="text-gray-400 font-bold text-sm ml-1">Working Title</label>
               <input
                 type="text"
                 placeholder="e.g. Echoes of the Neon Grid"
                 className="w-full bg-white/5 border border-border rounded-2xl p-4 text-lg font-bold focus:outline-none focus:border-accent"
                 value={title}
                 onChange={e => setTitle(e.target.value)}
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                 <label className="text-gray-400 font-bold text-sm ml-1">Genre</label>
                 <select 
                   className="w-full bg-white/5 border border-border rounded-2xl p-4 text-sm font-semibold focus:outline-none focus:border-accent appearance-none"
                   value={genre}
                   onChange={e => setGenre(e.target.value)}
                 >
                   <option value="">Select Genre...</option>
                   <option value="sci-fi">Sci-Fi</option>
                   <option value="fantasy">Fantasy</option>
                   <option value="romance">Romance</option>
                   <option value="thriller">Thriller</option>
                 </select>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-gray-400 font-bold text-sm ml-1">Tone</label>
                 <select className="w-full bg-white/5 border border-border rounded-2xl p-4 text-sm font-semibold focus:outline-none focus:border-accent appearance-none">
                   <option>Cinematic & Dark</option>
                   <option>Whimsical & Light</option>
                   <option>Gritty Realism</option>
                 </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-gray-400 font-bold text-sm ml-1">Core Premise & Characters</label>
               <textarea
                 placeholder="Describe the main character and the inciting incident..."
                 className="w-full bg-white/5 border border-border rounded-2xl p-4 text-md focus:outline-none focus:border-accent min-h-[120px]"
                 value={premise}
                 onChange={e => setPremise(e.target.value)}
               />
            </div>
            
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-xl">
                  <ImageIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                   <p className="font-bold text-sm">Auto-generate Scene Image</p>
                   <p className="text-xs text-gray-400">Creates 1 FLUX illustration per chapter</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-accent rounded-full relative shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-panel p-4 pb-8 md:pb-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Estimated Cost</span>
              <span className="text-xl font-bold font-sans text-accent">50 Credits / Ch.</span>
           </div>
           
           <button className="bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
             <Sparkles className="w-5 h-5 fill-white" /> Draft Chapter 1
           </button>
        </div>
      </div>
    </div>
  );
}
