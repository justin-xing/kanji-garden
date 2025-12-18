
import React, { useState } from 'react';
import { Zap, Pencil, Trophy, Flame, Sprout } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSkip = () => onStart();

  // Step 0: Welcome Landing (Existing)
  if (step === 0) {
     return (
        <div className="min-h-screen bg-[#f9f8f4] flex flex-col items-center justify-between py-12 px-8 relative overflow-hidden font-sans">
             
             {/* Spacer for top centering */}
             <div className="flex-grow flex flex-col items-center justify-center space-y-12 w-full max-w-sm mx-auto z-10">
               
               {/* Icon Container */}
               <div className="w-40 h-40 bg-[#749f76] rounded-[2.5rem] shadow-xl flex items-center justify-center relative overflow-hidden mb-4">
                    {/* Visual representation of the sprout icon */}
                    <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
                       <path d="M25,80 Q50,65 75,80" fill="#6d4c41" />
                       <path d="M25,80 L75,80 L75,85 Q50,95 25,85 Z" fill="#5d4037" />
                       <path d="M50,80 Q50,60 50,50" stroke="#a5d6a7" strokeWidth="6" strokeLinecap="round" />
                       <g transform="translate(50, 50)">
                          <path d="M0,0 Q-15,-20 -30,-10 Q-15,-5 0,0" fill="#81c784" />
                          <path d="M0,0 Q15,-20 30,-10 Q15,-5 0,0" fill="#aed581" />
                       </g>
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent pointer-events-none" />
               </div>

               {/* Text Content */}
               <div className="text-center space-y-4">
                 <h1 className="text-4xl font-normal text-[#3d5a40] leading-tight tracking-tight">
                   Welcome to <br />
                   <span className="font-medium">Kanji Garden</span>
                 </h1>
                 <p className="text-[#5c5c5c] text-lg font-light leading-relaxed max-w-[260px] mx-auto">
                   Grow your skills, one Kanji at a time.
                 </p>
               </div>

             </div>

             {/* Button Section */}
             <div className="w-full max-w-sm mx-auto z-10 pb-8">
               <button 
                 onClick={handleNext}
                 className="w-full bg-[#85a675] hover:bg-[#749666] text-white text-lg font-medium py-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98] active:bg-[#68885b]"
               >
                 Get Started
               </button>
             </div>

             {/* Background decoration elements */}
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#f0eee9] rounded-full blur-3xl opacity-50 pointer-events-none" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-[#e3e6e1] rounded-full blur-3xl opacity-50 pointer-events-none" />

        </div>
     );
  }

  // Steps 1-3: Onboarding Slides
  return (
    <div className="min-h-screen bg-[#f9f8f4] flex flex-col relative font-sans text-[#333333]">
       {/* Top Navigation */}
       <div className="px-6 py-6 flex items-center justify-between pt-8 sm:pt-10">
          <button onClick={handleSkip} className="text-[#8c8c8c] text-sm font-medium hover:text-[#5c5c5c]">Skip</button>
          
          <div className="flex items-center gap-2">
             {[1, 2, 3].map(i => (
                 <div 
                   key={i} 
                   className={`h-2 rounded-full transition-all duration-300 ${
                     step === i ? 'w-8 bg-[#85a675]' : 'w-2 bg-[#d1d5db]'
                   }`} 
                 />
             ))}
          </div>
          
          <div className="w-8 opacity-0">Skip</div> {/* Spacer for alignment */}
       </div>

       {/* Content Area */}
       <div className="flex-grow flex flex-col items-center justify-center px-6 pb-4 w-full max-w-md mx-auto">
           
           {/* SLIDE 1: Learn Kanji Easily */}
           {step === 1 && (
               <div className="flex flex-col items-center w-full animate-fade-in">
                   <div className="bg-white w-full aspect-[4/3] rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center mb-10 relative">
                        {/* Kanji Card Visual */}
                        <div className="text-[100px] leading-none text-[#557c56] font-serif mb-4">火</div>
                        <div className="text-[#557c56] text-xl font-medium mb-2">Fire</div>
                        <div className="text-[#333333] text-sm">カ, ひ</div>
                   </div>
                   
                   <h2 className="text-2xl text-[#3d5a40] font-normal mb-3 text-center">Learn Kanji Easily</h2>
                   <p className="text-[#5c5c5c] text-center leading-relaxed px-4">
                       Study meanings, readings, and stroke order.
                   </p>
               </div>
           )}

           {/* SLIDE 2: Practice Your Way */}
           {step === 2 && (
               <div className="flex flex-col items-center w-full animate-fade-in">
                   <div className="flex gap-4 mb-12">
                        {/* Icon 1 */}
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#fca5a5] to-[#f87171] shadow-lg flex items-center justify-center text-white">
                                 <Zap size={32} fill="white" />
                             </div>
                             <span className="text-xs font-medium text-[#5c5c5c]">Quick Review</span>
                        </div>
                        {/* Icon 2 */}
                        <div className="flex flex-col items-center gap-2 mt-8">
                             <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#fcd34d] to-[#fbbf24] shadow-lg flex items-center justify-center text-white">
                                 <Pencil size={32} fill="white" />
                             </div>
                             <span className="text-xs font-medium text-[#5c5c5c]">Writing</span>
                        </div>
                        {/* Icon 3 */}
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#86efac] to-[#4ade80] shadow-lg flex items-center justify-center text-white">
                                 <Trophy size={32} fill="white" />
                             </div>
                             <span className="text-xs font-medium text-[#5c5c5c]">Quiz</span>
                        </div>
                   </div>
                   
                   <h2 className="text-2xl text-[#3d5a40] font-normal mb-3 text-center">Practice Your Way</h2>
                   <p className="text-[#5c5c5c] text-center leading-relaxed px-8">
                       Choose the type of practice that fits your pace.
                   </p>
               </div>
           )}

           {/* SLIDE 3: Grow Your Progress */}
           {step === 3 && (
               <div className="flex flex-col items-center w-full animate-fade-in">
                   <div className="bg-[#749f76] w-full aspect-square max-h-[320px] rounded-[2rem] shadow-xl mb-10 p-6 flex flex-col items-center justify-center relative overflow-hidden text-white">
                        {/* Sprout Icon Large */}
                        <Sprout size={80} strokeWidth={1.5} className="mb-6 opacity-90" />
                        
                        {/* Stats Rows */}
                        <div className="w-full space-y-3">
                             <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center">
                                 <span className="text-sm font-medium">Kanji Learned</span>
                                 <span className="text-lg font-bold">12</span>
                             </div>
                             <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center">
                                 <span className="text-sm font-medium">Day Streak</span>
                                 <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold">7</span>
                                    <Flame size={16} className="fill-orange-400 text-orange-400" />
                                 </div>
                             </div>
                             <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center">
                                 <span className="text-sm font-medium">Garden Level</span>
                                 <span className="text-lg font-bold">Seedling</span>
                             </div>
                        </div>
                   </div>
                   
                   <h2 className="text-2xl text-[#3d5a40] font-normal mb-3 text-center">Grow Your Progress</h2>
                   <p className="text-[#5c5c5c] text-center leading-relaxed px-4">
                       Watch your skills flourish over time.
                   </p>
               </div>
           )}

       </div>

       {/* Footer Buttons */}
       <div className="px-6 pb-10 w-full max-w-md mx-auto">
           {step === 1 ? (
               <button 
                 onClick={handleNext}
                 className="w-full bg-[#85a675] hover:bg-[#749666] text-white text-lg font-medium py-3.5 rounded-full shadow-md transition-all active:scale-[0.98]"
               >
                 Next
               </button>
           ) : (
               <div className="flex gap-4">
                   <button 
                     onClick={handleBack}
                     className="flex-1 bg-white border border-[#d1d5db] text-[#5c5c5c] hover:bg-stone-50 text-lg font-medium py-3.5 rounded-full transition-all active:scale-[0.98]"
                   >
                     Previous
                   </button>
                   <button 
                     onClick={step === 3 ? onStart : handleNext}
                     className="flex-1 bg-[#85a675] hover:bg-[#749666] text-white text-lg font-medium py-3.5 rounded-full shadow-md transition-all active:scale-[0.98]"
                   >
                     {step === 3 ? 'Start Learning' : 'Next'}
                   </button>
               </div>
           )}
       </div>
    </div>
  );
};

export default WelcomeScreen;
