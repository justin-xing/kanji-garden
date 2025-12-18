import {Cloud } from "lucide-react";

const MountainBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
      {/* Wall (Traditional Plaster) */}
      <div className="absolute inset-0 bg-[#fefce8]" />

      {/* Scene Layer (Fuji Detailed) */}
      <div className="absolute inset-0 z-0 bg-[#bae6fd]">
            {/* Sky Gradient (Morning Clean Air) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0ea5e9] via-[#7dd3fc] to-[#e0f2fe]" />
            
            {/* Sun Glare */}
            <div className="absolute top-8 right-16 w-12 h-12 bg-white rounded-full blur-2xl opacity-60" />

            {/* Clouds (Drifting) */}
            <div className="absolute top-12 left-10 opacity-70 animate-drift-slow">
                <Cloud size={64} fill="white" className="text-white drop-shadow-md" />
            </div>
            <div className="absolute top-32 left-[60%] opacity-40 animate-drift" style={{ animationDuration: '50s' }}>
                <Cloud size={40} fill="white" className="text-white" />
            </div>

            {/* Distant Mountains (Layered) */}
            <div className="absolute bottom-[35%] w-full h-32">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-40">
                    <path d="M0,100 L20,60 L40,80 L60,50 L80,90 L100,70 L100,100 Z" fill="#1e3a8a" />
                </svg>
            </div>

            {/* Mt Fuji (Detailed SVG) */}
            <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] flex justify-center items-end">
                <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-lg" preserveAspectRatio="none">
                      {/* Mountain Base */}
                      <path d="M150,20 C200,80 260,150 290,150 L10,150 C40,150 100,80 150,20 Z" fill="#334155" />
                      {/* Shading Side */}
                      <path d="M150,20 C180,60 220,150 290,150 L150,150 L150,20 Z" fill="#1e293b" opacity="0.4" />
                      
                      {/* Snow Cap (Refined - no side hangoff) */}
                      <path d="M150,20 
                              L170,40 L160,50 L155,42 
                              L145,48 L140,38 L130,45 
                              L150,20 Z" 
                            fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
            </div>
            
            {/* Lake Kawaguchi (Reflective) */}
            <div className="absolute bottom-0 w-full h-[35%] bg-gradient-to-b from-[#3b82f6] to-[#2563eb] overflow-hidden">
                {/* Reflection of Fuji */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[150%] opacity-20 transform scale-y-[-1] blur-sm">
                      <svg viewBox="0 0 300 150" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M150,20 C200,80 260,150 290,150 L10,150 C40,150 100,80 150,20 Z" fill="#fff" />
                      </svg>
                </div>
                {/* Water Ripples */}
                <div className="absolute inset-0 opacity-30" 
                      style={{ 
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.2) 5px)',
                          backgroundSize: '100% 10px'
                      }} 
                />
            </div>

            {/* Foreground Cherry Branches (Framing) */}
            <div className="absolute top-[-20px] left-[-20px] w-64 h-64 pointer-events-none opacity-90">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0,20 Q40,40 60,10" stroke="#5d4037" strokeWidth="2" fill="none" />
                    <path d="M20,30 Q50,50 40,80" stroke="#5d4037" strokeWidth="1.5" fill="none" />
                    <circle cx="50" cy="20" r="3" fill="#fbcfe8" />
                    <circle cx="60" cy="10" r="4" fill="#f472b6" />
                    <circle cx="40" cy="80" r="3" fill="#fbcfe8" />
                    <circle cx="30" cy="50" r="2" fill="#f472b6" />
                </svg>
            </div>
      </div>

      {/* Window Frame (Shoji Open - Architectural) */}
      <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top Rail */}
          <div className="absolute top-[10%] left-0 right-0 h-4 bg-[#8b5a2b] shadow-md z-20" />
          {/* Bottom Rail (Tatami edge) */}
          <div className="absolute bottom-[35%] left-0 right-0 h-6 bg-[#8b5a2b] shadow-md flex items-center justify-around z-20">
              <div className="w-[95%] h-[1px] bg-[#5d4037]/30" />
          </div>
          {/* Side Shoji Screens (Half Open) */}
          <div className="absolute top-[10%] bottom-[35%] left-0 w-16 bg-white border-r-8 border-[#8b5a2b] shadow-xl flex flex-col z-10">
                <div className="absolute inset-0 bg-[#fefce8] opacity-50" />
                {/* Grid */}
                <div className="flex-1 border-b-2 border-[#8b5a2b]/20" />
                <div className="flex-1 border-b-2 border-[#8b5a2b]/20" />
                <div className="flex-1" />
          </div>
          <div className="absolute top-[10%] bottom-[35%] right-0 w-16 bg-white border-l-8 border-[#8b5a2b] shadow-xl flex flex-col z-10">
                <div className="absolute inset-0 bg-[#fefce8] opacity-50" />
                <div className="flex-1 border-b-2 border-[#8b5a2b]/20" />
                <div className="flex-1 border-b-2 border-[#8b5a2b]/20" />
                <div className="flex-1" />
          </div>
      </div>

      {/* Floor (Tatami detailed) */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#f3e9d2] border-t-[8px] border-[#5d4037] z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
            {/* Tatami Texture */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, #d4c5a3 4px)', backgroundSize: '4px 100%' }} />
            {/* Tatami Borders */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49%, #2e2825 50%, transparent 51%)', backgroundSize: '50% 100%' }} />
            {/* Sunlight Cast */}
            <div className="absolute top-0 right-[20%] w-[40%] h-full bg-yellow-100/20 skew-x-12 blur-xl" />
      </div>

      {/* Furniture: Cushion (Zabuton) */}
      <div className="absolute bottom-[10%] left-[10%] z-30 transform -skew-x-12 hover:scale-105 transition-transform">
          <div className="w-24 h-4 bg-[#7e22ce] rounded-sm shadow-lg relative">
                {/* Pattern */}
                <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full" /> {/* Tassel */}
          </div>
      </div>
      
      {/* Furniture: Small Vase with Branch */}
      <div className="absolute bottom-[35%] right-[5%] z-20 transform translate-y-4">
          <div className="w-10 h-14 bg-white border border-stone-200 rounded-b-xl rounded-t-sm shadow-xl relative flex justify-center overflow-visible">
                {/* Blue Willow pattern */}
                <div className="absolute bottom-2 w-full h-8 opacity-50 bg-blue-100 rounded-b-xl" />
                {/* Branch */}
                <div className="absolute bottom-10 w-0.5 h-20 bg-stone-700 transform rotate-12 origin-bottom">
                    <div className="absolute top-0 w-2 h-2 bg-red-400 rounded-full" />
                    <div className="absolute top-6 left-2 w-2 h-2 bg-red-400 rounded-full" />
                </div>
          </div>
      </div>
  </div>
  )
}

export default MountainBackground;