import React, { useContext } from 'react';
import { Upload, Layers, Users, Mic, Sparkles, User, AudioLines, Package, Check } from 'lucide-react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthContext } from '../AuthProvider';

export default function ElementCreator() {
  const [elementType, setElementType] = React.useState('character');
  const [elementName, setElementName] = React.useState('');
  const [trainingStep, setTrainingStep] = React.useState(0);
  const [isTraining, setIsTraining] = React.useState(false);
  const [trainingComplete, setTrainingComplete] = React.useState(false);
  const { convexUserId } = useContext(AuthContext);
  const trainElementAction = useAction(api.videos.trainElementAction);
  
  const steps = [
    'Analyzing reference images...',
    'Extracting visual tokens...',
    'Fine-tuning diffusion base...',
    'Calibrating weight offsets...',
    'Testing generation fidelity...',
    'Finalizing element package...'
  ];

  const handleTrain = async () => {
    if (!elementName.trim() || !convexUserId) return;
    setIsTraining(true);
    setTrainingComplete(false);
    setTrainingStep(0);
    
    // Start backend training
    const trainingPromise = trainElementAction({
      userId: convexUserId as any,
      name: elementName,
      type: elementType === 'character' ? 'Character' : elementType === 'prop' ? 'Prop' : 'Voice'
    });

    let currentStep = 0;
    const interval = setInterval(async () => {
      currentStep++;
      if (currentStep >= steps.length - 1) {
        // Wait for backend to finish before showing last step
        try {
          await trainingPromise;
          setTrainingStep(steps.length - 1);
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            setTrainingComplete(true);
          }, 1000);
        } catch (e) {
          console.error("Training failed", e);
          clearInterval(interval);
          setIsTraining(false);
          alert("Training failed. Please try again.");
        }
      } else {
        setTrainingStep(currentStep);
      }
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-y-auto no-scrollbar relative">
      <div className="p-4 md:p-10 lg:p-16 flex-1 pb-40">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans font-bold text-3xl md:text-5xl mb-1 tracking-tight">Elements Studio</h2>
              <p className="text-gray-400 text-xs font-medium">Create characters, props, or voices to summon across your content.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
             {isTraining ? (
                 <div className="bg-[#1a1a1a] rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                      <div 
                        className="h-full bg-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                        style={{ width: `${(trainingStep / steps.length) * 100}%` }}
                      />
                   </div>
                   
                   <div className="w-12 h-12 relative">
                      <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                      <div 
                        className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin" 
                        style={{ animationDuration: '0.8s' }}
                      />
                      <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center shadow-inner">
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
                           <div className={`w-3 h-3 rounded-full flex items-center justify-center ${i < trainingStep ? 'bg-green-500/20 text-green-500' : 'bg-white/5'}`}>
                             {i < trainingStep ? <Check className="w-1.5 h-1.5" /> : <div className="w-0.5 h-0.5 rounded-full bg-gray-600" />}
                           </div>
                           <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${i === trainingStep ? 'text-accent' : 'text-gray-500'}`}>{step}</span>
                        </div>
                      ))}
                   </div>
                </div>
             ) : trainingComplete ? (
               <div className="bg-[#1a1a1a] rounded-3xl p-8 flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center shadow-lg">
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
                   <div className="grid grid-cols-3 gap-3">
                     <button 
                       onClick={() => setElementType('character')}
                       className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all shadow-lg ${elementType === 'character' ? 'bg-accent/10 text-accent ring-1 ring-accent/30' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#222]'}`}
                     >
                       <User className="w-6 h-6" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Character</span>
                     </button>
                     <button 
                       onClick={() => setElementType('prop')}
                       className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all shadow-lg ${elementType === 'prop' ? 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/30' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#222]'}`}
                     >
                       <Package className="w-6 h-6" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Prop</span>
                     </button>
                     <button 
                       onClick={() => setElementType('voice')}
                       className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all shadow-lg ${elementType === 'voice' ? 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/30' : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#222]'}`}
                     >
                       <AudioLines className="w-6 h-6" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Voice</span>
                     </button>
                   </div>

                   <div className="flex flex-col gap-2.5">
                     <label className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">Name</label>
                     <input
                       type="text"
                       placeholder="e.g. Cyber Punk Hero"
                       className="w-full bg-[#1a1a1a] rounded-[1.5rem] px-6 py-4 text-xl font-bold focus:outline-none text-white placeholder-gray-800 transition-all shadow-lg"
                       value={elementName}
                       onChange={e => setElementName(e.target.value)}
                     />
                   </div>

                   {elementType === 'character' && (
                      <div className="flex flex-col gap-4">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">Reference (1-4 images)</p>
                        <div className="grid grid-cols-4 gap-4">
                           <button className="aspect-square bg-[#1a1a1a] rounded-2xl flex items-center justify-center hover:bg-[#222] transition-all text-gray-600 hover:text-white shadow-lg group">
                              <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                           </button>
                           <div className="aspect-square bg-[#1a1a1a] rounded-2xl opacity-20 shadow-inner"></div>
                           <div className="aspect-square bg-[#1a1a1a] rounded-2xl opacity-20 shadow-inner"></div>
                           <div className="aspect-square bg-[#1a1a1a] rounded-2xl opacity-20 shadow-inner"></div>
                        </div>
                      </div>
                   )}

                   {elementType === 'prop' && (
                      <div className="flex flex-col gap-4">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">Reference Object</p>
                        <button className="w-full aspect-[2/1] bg-[#1a1a1a] rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-[#222] transition-all text-gray-500 group shadow-lg">
                           <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                             <Upload className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                           </div>
                           <span className="text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Upload Photos</span>
                        </button>
                      </div>
                   )}

                   {elementType === 'voice' && (
                      <div className="flex flex-col gap-4">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">Audio Source</p>
                        <button className="w-full aspect-[2/1] bg-[#1a1a1a] rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-[#222] transition-all text-gray-500 group shadow-lg">
                           <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                             <Mic className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
                           </div>
                           <span className="text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Sample Audio</span>
                        </button>
                      </div>
                   )}

                   <div className="flex flex-col gap-2.5">
                     <label className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">Behavior Tags</label>
                     <textarea
                       placeholder="Describe traits..."
                       className="w-full bg-[#1a1a1a] rounded-[1.5rem] px-6 py-4 text-sm focus:outline-none min-h-[100px] resize-none text-white placeholder-gray-800 transition-all font-sans shadow-lg"
                     />
                   </div>
                </div>
             )}
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 sm:absolute left-0 right-0 bg-black border-t border-[#2a2a2a] p-3 md:p-4 z-50">
         <div className="max-w-4xl mx-auto flex justify-between items-center px-6 md:px-10">
            <div className="flex flex-col">
               <span className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em] leading-none mb-1">Training Cost</span>
               <span className="text-xs font-bold font-sans text-white leading-none">50 Credits</span>
            </div>
            
            <button 
             onClick={handleTrain}
             disabled={!elementName.trim() || isTraining || trainingComplete}
             className="bg-[#2e1065] border border-[#2a2a2a] hover:scale-[1.02] active:scale-95 text-white shadow-lg px-7 py-2.5 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" /> {isTraining ? 'Training...' : 'Train'}
            </button>
        </div>
      </div>
    </div>
  );
}
