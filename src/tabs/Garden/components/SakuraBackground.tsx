const SakuraBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                     {/* Wall (Soft Pink Plaster) */}
                    <div className="absolute inset-0 bg-[#fff1f2]" />

                    {/* Scene Layer (Orchard Detailed) */}
                    <div className="absolute inset-0 z-0 bg-[#ecfeff]">
                         {/* Sky */}
                         <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] to-[#fce7f3]" />
                         
                         {/* --- Distant Orchard Layer (Blurred Background Trees) --- */}
                         <div className="absolute top-[20%] w-full h-40 blur-[2px] opacity-70">
                            {[...Array(5)].map((_, i) => (
                                <div key={`bg-tree-${i}`} 
                                     className="absolute bottom-0 w-32 h-40" 
                                     style={{ left: `${i * 20 - 10}%` }}>
                                     {/* Canopy */}
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-24 bg-pink-300 rounded-full opacity-90" />
                                    <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-pink-200 rounded-full opacity-80" />
                                    <div className="absolute bottom-16 right-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-90" />
                                    {/* Trunk */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-[#8d6e63]" />
                                </div>
                            ))}
                         </div>

                         {/* --- Mid-ground Orchard Layer (Sharper Trees) --- */}
                         <div className="absolute top-[10%] w-full h-full">
                             {/* Tree Left */}
                             <div className="absolute top-[15%] left-[-5%] w-48 h-64 scale-75">
                                 <svg viewBox="0 0 100 100" className="w-full h-full">
                                     <path d="M50,100 L50,60 C40,50 60,40 50,20" stroke="#5d4037" strokeWidth="6" fill="none" />
                                     <circle cx="50" cy="30" r="35" fill="#fbcfe8" opacity="0.9" />
                                     <circle cx="30" cy="40" r="20" fill="#f9a8d4" opacity="0.8" />
                                     <circle cx="70" cy="35" r="25" fill="#f472b6" opacity="0.8" />
                                 </svg>
                             </div>
                             
                             {/* Tree Center-Right */}
                             <div className="absolute top-[10%] right-[15%] w-56 h-72 scale-50">
                                 <svg viewBox="0 0 100 100" className="w-full h-full">
                                     <path d="M50,100 L55,70 C45,60 60,50 55,20" stroke="#5d4037" strokeWidth="8" fill="none" />
                                     <circle cx="55" cy="30" r="40" fill="#fbcfe8" opacity="0.95" />
                                     <circle cx="25" cy="45" r="25" fill="#f9a8d4" opacity="0.85" />
                                     <circle cx="80" cy="40" r="30" fill="#f472b6" opacity="0.85" />
                                 </svg>
                             </div>
                         </div>

                         {/* --- Foreground Frame Trees (Detailed) --- */}
                         <div className="absolute top-0 w-full h-full">
                             {/* Tree Trunk Right (Foreground) */}
                             <svg className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] opacity-90" viewBox="0 0 100 100">
                                 <path d="M80,100 C70,60 90,40 60,0 L100,0 L100,100 Z" fill="#5d4037" />
                                 <path d="M80,60 Q60,50 40,40" stroke="#5d4037" strokeWidth="3" fill="none" />
                                 <circle cx="40" cy="40" r="15" fill="#fbcfe8" opacity="0.9" />
                                 <circle cx="30" cy="30" r="10" fill="#f9a8d4" opacity="0.8" />
                                 <circle cx="50" cy="35" r="12" fill="#f472b6" opacity="0.8" />
                             </svg>
                             {/* Tree Trunk Left (Foreground) */}
                             <svg className="absolute top-[10%] left-[-20%] w-[50%] h-[60%] opacity-80" viewBox="0 0 100 100">
                                 <path d="M20,100 C30,60 10,40 40,0 L0,0 L0,100 Z" fill="#5d4037" />
                                 <circle cx="60" cy="20" r="20" fill="#fbcfe8" />
                                 <circle cx="80" cy="30" r="15" fill="#f472b6" />
                             </svg>
                         </div>

                         {/* Falling Petals (Dense) */}
                         {[...Array(25)].map((_, i) => (
                             <div key={i} className="absolute w-2.5 h-2.5 bg-pink-300 rounded-tl-none rounded-br-none rounded-tr-full rounded-bl-full animate-fall"
                                  style={{
                                      left: `${Math.random() * 100}%`,
                                      animationDuration: `${4 + Math.random() * 5}s`,
                                      animationDelay: `${Math.random() * 5}s`,
                                      opacity: 0.7 + Math.random() * 0.3,
                                      transform: `rotate(${Math.random() * 360}deg)`
                                  }}
                             />
                         ))}

                         {/* Ground/Grass with path */}
                         <div className="absolute bottom-[20%] w-full h-[35%] bg-[#86efac] overflow-hidden">
                             {/* Grass texture */}
                             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#166534 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                             {/* Stone Path */}
                             <div className="absolute bottom-0 left-[20%] w-[30%] h-full bg-stone-300 transform -skew-x-12 border-l border-r border-stone-400 opacity-80" />
                         </div>

                         {/* Stone Lantern (Toro) in Garden */}
                         <div className="absolute bottom-[30%] left-[10%] w-12 h-24 flex flex-col items-center z-0">
                             <div className="w-8 h-4 bg-stone-400 rounded-t-lg" /> {/* Top */}
                             <div className="w-6 h-6 bg-stone-300 border border-stone-400 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-yellow-100 rounded-full animate-pulse opacity-50" />
                             </div> {/* Light box */}
                             <div className="w-8 h-2 bg-stone-400" /> {/* Base of light */}
                             <div className="w-4 h-10 bg-stone-300" /> {/* Post */}
                             <div className="w-6 h-2 bg-stone-400 rounded-sm" /> {/* Base */}
                         </div>
                    </div>

                    {/* Window Frame (Wide Open View) */}
                    <div className="absolute top-0 left-0 right-0 h-16 z-10 flex flex-col">
                        <div className="h-4 bg-[#5d4037] shadow-md" />
                        {/* Rolled Bamboo Blind (Sudare) */}
                        <div className="mx-6 h-10 bg-[#d6d3d1] rounded-b-lg shadow-lg border-b-4 border-[#5d4037] flex justify-center items-center relative">
                             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #000 3px)' }} />
                             <div className="w-[80%] h-1 bg-stone-500/30 rounded-full" />
                             {/* Tassels */}
                             <div className="absolute -bottom-4 left-1/3 w-1 h-4 bg-red-400" />
                             <div className="absolute -bottom-4 right-1/3 w-1 h-4 bg-red-400" />
                        </div>
                    </div>

                    {/* Floor (Engawa - Wooden Porch) */}
                    <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-[#d7ccc8] border-t-[4px] border-[#a1887f] z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
                         <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 19px, #8d6e63 20px)', backgroundSize: '20px 100%' }} />
                         
                         {/* Red Felt Bench (Mousen) */}
                         <div className="absolute bottom-[10%] right-[10%] w-40 h-8 bg-red-600 shadow-md transform skew-x-12 z-20 rounded-sm">
                              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" /> {/* Texture */}
                         </div>
                    </div>

                    {/* Furniture: Tea Set on the Red Bench */}
                    <div className="absolute bottom-[18%] right-[18%] z-30 flex items-end gap-2 transform skew-x-12">
                         {/* Teapot (Kyusu) */}
                         <div className="w-10 h-8 bg-stone-800 rounded-lg relative shadow-sm">
                             <div className="absolute -left-2 top-2 w-3 h-1 bg-stone-800 transform -rotate-12" /> {/* Spout */}
                             <div className="absolute -right-2 top-2 w-4 h-1 bg-stone-800" /> {/* Handle */}
                             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-stone-700 rounded-full" /> {/* Lid */}
                         </div>
                         {/* Cup */}
                         <div className="w-5 h-4 bg-white rounded-b-md border-t-2 border-green-200 flex items-center justify-center shadow-sm">
                              <div className="w-3 h-1 bg-green-400/50 rounded-full" />
                         </div>
                         {/* Dango Plate Detailed */}
                         <div className="ml-1 w-12 h-2 bg-wood rounded-full flex justify-center items-end relative shadow-sm">
                              <div className="absolute bottom-1 flex flex-col items-center transform -rotate-12 origin-bottom">
                                  <div className="w-3.5 h-3.5 bg-pink-400 rounded-full border border-pink-500/20" />
                                  <div className="w-3.5 h-3.5 bg-white rounded-full -mt-1 border border-stone-200" />
                                  <div className="w-3.5 h-3.5 bg-green-400 rounded-full -mt-1 border border-green-500/20" />
                                  <div className="w-0.5 h-10 bg-yellow-800 absolute bottom-0 z-[-1]" />
                              </div>
                         </div>
                    </div>
                </div>
  )
}

export default SakuraBackground;