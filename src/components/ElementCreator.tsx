import React from 'react';
import { Upload, Layers, Users, Mic, Sparkles, User, AudioLines, Package, Check } from 'lucide-react';

export default function ElementCreator() {
  const [elementType, setElementType] = React.useState('character');
  const [elementName, setElementName] = React.useState('');
  const [trainingStep, setTrainingStep] = React.useState(0);
  const [isTraining, setIsTraining] = React.useState(false);
  const [trainingComplete, setTrainingComplete] = React.useState(false);
  const steps = [
    'Analyzing reference images...',
    'Extracting visual tokens...',
    'Fine-tuning diffusion base...',
    'Calibrating weight offsets...',
    'Testing generation fidelity...',
    'Finalizing element package...'
  ];

  const handleTrain = () => {
    if (!elementName.trim()) return;
    setIsTraining(true);
    setTrainingComplete(false);
    setTrainingStep(0);
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingComplete(true);
      } else {
        setTrainingStep(currentStep);
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-base overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-2 tracking-tight">Elements Studio</h2>
              <p className="text-gray-400 text-xs font-medium">Create characters, props, or voices to summon across your content.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
             {isTraining ? (
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                      <div 
                        className="h-full bg-accent transition-all duration-500 ease-out" 
                        style={{ width: `${(trainingStep / steps.length) * 100}%` }}
                      />
                   </div>
                   
                   <div className="w-12 h-12 relative">
                      <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
                      <div 
                        className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin" 
                        style={{ animationDuration: '0.8s' }}
                      />
                      <div className="absolute inset-2 bg-accent/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <h3 className="text-lg font-bold font-sans tracking-tight text-white">Synthesizing Element</h3>
                      <p className="text-gray-500 max-w-xs mx-auto text-[9px] leading-relaxed uppercase tracking-[0.2em] font-bold">Custom {elementType} refinement</p>
                   </div>

                   <div className="w-full space-y-2 mt-2">
                      {steps.map((step, i) => (
                        <div key={i} className={`flex items-center gap-2.5 text-left transition-all duration-300 ${i === trainingStep ? 'opacity-100' : i < trainingStep ? 'opacity-40' : 'opacity-10 grayscale'}`}>
                           <div className={`w-3 h-3 rounded-full flex items-center justify-center ${i < trainingStep ? 'bg-green-500/20 text-green-500' : 'bg-white/5 border border-white/10'}`}>
                             {i < trainingStep ? <Check className="w-1.5 h-1.5" /> : <div className="w-0.5 h-0.5 rounded-full bg-gray-600" />}
                           </div>
                           <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${i === trainingStep ? 'text-accent' : 'text-gray-500'}`}>{step}</span>
                        </div>
                      ))}
                   </div>
                </div>
             ) : trainingComplete ? (
               <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30 shadow-lg">
                    <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 tracking-tight">Training Complete</h3>
                    <p className="text-[11px] text-gray-500 font-medium">"{elementName}" is ready for use in Element Studio.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setTrainingComplete(false);
                      setElementName('');
                    }}
                    className="bg-accent text-white px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-accent/20 active:scale-95"
                  >
                    Create New
                  </button>
               </div>
             ) : (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setElementType('character')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all shadow-inner ${elementType === 'character' ? 'bg-accent/10 border-accent/30 text-accent shadow-accent/5' : 'bg-white/2 border-white/5 text-gray-500 hover:bg-white/5'}`}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Character</span>
                    </button>
                    <button 
                      onClick={() => setElementType('prop')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all shadow-inner ${elementType === 'prop' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-blue-500/5' : 'bg-white/2 border-white/5 text-gray-500 hover:bg-white/5'}`}
                    >
                      <Package className="w-5 h-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Prop</span>
                    </button>
                    <button 
                      onClick={() => setElementType('voice')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all shadow-inner ${elementType === 'voice' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-orange-500/5' : 'bg-white/2 border-white/5 text-gray-500 hover:bg-white/5'}`}
                    >
                      <AudioLines className="w-5 h-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Voice</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.2em] pl-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Punk Hero"
                      className="w-full bg-white/2 border border-white/10 rounded-xl px-5 py-3 text-lg font-bold focus:outline-none focus:border-accent text-white placeholder-gray-800 transition-all shadow-inner"
                      value={elementName}
                      onChange={e => setElementName(e.target.value)}
                    />
                  </div>

                  {elementType === 'character' && (
                     <div className="flex flex-col gap-3">
                       <p className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.2em] pl-1">Reference (1-4 images)</p>
                       <div className="grid grid-cols-4 gap-3">
                          <button className="aspect-square bg-white/2 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all text-gray-600 hover:text-accent shadow-inner">
                             <Upload className="w-5 h-5" />
                          </button>
                          <div className="aspect-square bg-white/2 border border-white/5 rounded-xl border-dashed opacity-30 shadow-inner"></div>
                          <div className="aspect-square bg-white/2 border border-white/5 rounded-xl border-dashed opacity-30 shadow-inner"></div>
                          <div className="aspect-square bg-white/2 border border-white/5 rounded-xl border-dashed opacity-30 shadow-inner"></div>
                       </div>
                     </div>
                  )}

                  {elementType === 'prop' && (
                     <div className="flex flex-col gap-3">
                       <p className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.2em] pl-1">Reference Object</p>
                       <button className="w-full aspect-[4/2] bg-white/2 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all text-gray-600 hover:text-blue-500 shadow-inner">
                          <Upload className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Upload Photos</span>
                       </button>
                     </div>
                  )}

                  {elementType === 'voice' && (
                     <div className="flex flex-col gap-3">
                       <p className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.2em] pl-1">Audio Source</p>
                       <button className="w-full aspect-[4/2] bg-white/2 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 transition-all text-gray-600 hover:text-orange-500 shadow-inner">
                          <Mic className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Sample Audio</span>
                       </button>
                     </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-bold text-[9px] uppercase tracking-[0.2em] pl-1">Behavior Tags</label>
                    <textarea
                      placeholder="Describe traits..."
                      className="w-full bg-white/2 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-accent min-h-[80px] resize-none text-white placeholder-gray-800 transition-all font-sans shadow-inner"
                    />
                  </div>
                </div>
             )}
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-base/80 backdrop-blur-3xl border-t border-white/5 p-2.5 md:p-3.5 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
           <div className="flex flex-col">
              <span className="text-gray-500 text-[7px] font-bold uppercase tracking-[0.2em] leading-none mb-0.5 opacity-60">Training Cost</span>
              <span className="text-xs font-bold font-sans text-accent leading-none">50 Credits</span>
           </div>
           
           <button 
            onClick={handleTrain}
            disabled={!elementName.trim() || isTraining || trainingComplete}
            className="bg-accent hover:bg-accent-hover active:scale-95 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Sparkles className="w-4 h-4 fill-white" /> {isTraining ? 'Training...' : 'Train'}
           </button>
        </div>
      </div>
    </div>
  );
}
