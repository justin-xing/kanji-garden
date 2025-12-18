import {Cloud } from "lucide-react";

const RuralMorningBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
      {/* Wall/Shoji Background - Creamier, more texture */}
      <div className="absolute inset-0 bg-[#fdfbf7]" 
            style={{ 
                backgroundImage: `
                  linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px), 
                  linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
                `,
                backgroundSize: '30px 100%'
            }}
      />
      
      {/* Enso Window looking outside - Rice Paddies & Mountains */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-72 h-72 rounded-full border-[8px] border-[#8b5a2b] shadow-[inset_0_5px_20px_rgba(0,0,0,0.2),0_15px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-sky-100 relative z-0">
            
            {/* Sky Gradient - Morning Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#60a5fa] via-[#bae6fd] to-[#ffedd5] h-[60%]" />
            
            {/* Sun */}
            <div className="absolute top-[35%] right-[25%] w-16 h-16 rounded-full bg-gradient-to-b from-[#fcd34d] to-[#fb923c] blur-lg opacity-60" />
            <div className="absolute top-[38%] right-[28%] w-10 h-10 rounded-full bg-[#fff7ed] blur-md opacity-80" />

            {/* Clouds */}
            <div className="absolute top-8 left-10 opacity-90 animate-pulse" style={{ animationDuration: '6s' }}><Cloud fill="white" className="text-white drop-shadow-sm" size={32} /></div>
            <div className="absolute top-16 right-8 opacity-70"><Cloud fill="white" className="text-white drop-shadow-sm" size={22} /></div>
            <div className="absolute top-24 left-1/3 opacity-40"><Cloud fill="white" className="text-white drop-shadow-sm" size={16} /></div>

            {/* Layer 1: Distant Mountains (Faded Blue) - Scale & Depth */}
            <div className="absolute top-[30%] left-0 right-0 h-[30%] opacity-60">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#93c5fd]">
                  <path d="M0,100 L0,50 C20,45 35,20 50,40 C65,60 80,35 100,55 L100,100 Z" />
              </svg>
            </div>

            {/* Layer 2: Mid Mountains (Blue-Green) */}
            <div className="absolute top-[38%] left-0 right-0 h-[22%] opacity-80">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#60a5fa]">
                  <path d="M0,100 L0,40 C15,30 30,60 55,50 C75,40 90,20 100,45 L100,100 Z" />
              </svg>
            </div>
            
            {/* Layer 3: Horizon Hills (Green) - Sitting on horizon line (60%) */}
            <div className="absolute top-[45%] left-0 right-0 h-[15%]">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-[#15803d] opacity-90">
                    <path d="M0,100 L0,30 C10,20 25,10 40,35 C60,60 80,20 100,50 L100,100 Z" />
                </svg>
            </div>

            {/* Rice Paddies Landscape (Ground) - Starts at 60% */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#4ade80] overflow-hidden">
                {/* Perspective Plane */}
                <div className="absolute inset-0 origin-bottom" style={{ transform: 'perspective(300px) rotateX(25deg) scale(1.4)' }}>
                    {/* Water/Field Mix */}
                    <div className="absolute inset-0 bg-[#86efac]" style={{
                        backgroundImage: `
                          linear-gradient(0deg, transparent 95%, rgba(20, 83, 45, 0.15) 100%),
                          linear-gradient(90deg, transparent 95%, rgba(20, 83, 45, 0.15) 100%)
                        `,
                        backgroundSize: '24px 24px'
                    }} />
                    {/* Water Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#bfdbfe]/50 to-transparent" />
                    {/* Texture */}
                    <div className="absolute inset-0 opacity-40" style={{
                        backgroundImage: 'radial-gradient(#14532d 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                    }} />
                </div>
            </div>
            
            {/* Birds */}
            <div className="absolute top-[35%] left-[40%] opacity-50">
              <svg width="24" height="12" viewBox="0 0 24 12" className="fill-none stroke-stone-700 stroke-[1.5]">
                  <path d="M0,8 Q6,0 12,8 Q18,0 24,8" />
              </svg>
            </div>
      </div>

      {/* --- Furniture & Decor Layer (Behind Bonsai) --- */}
      
      {/* Hanging Scroll (Kakejiku) - Replaces coat hook for more rural vibe */}
      <div className="absolute top-[25%] left-[4%] opacity-90 z-0 drop-shadow-sm">
            {/* String */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-stone-400"></div>
            {/* Main Scroll Body */}
            <div className="w-12 h-28 bg-[#d7ccc8] flex flex-col items-center pt-1 pb-1 relative shadow-md">
                <div className="w-10 h-16 bg-white opacity-90 flex flex-col items-center justify-center gap-1">
                    {/* Abstract calligraphy */}
                    <div className="w-0.5 h-3 bg-black/60 rounded-full transform -rotate-12"></div>
                    <div className="w-4 h-0.5 bg-black/60 rounded-full"></div>
                    <div className="w-3 h-0.5 bg-black/60 rounded-full transform rotate-12"></div>
                </div>
                {/* Bottom Dowel */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-[#5d4037] rounded-full shadow-sm"></div>
            </div>
      </div>

      {/* Tansu Chest (Right Side) - Lower, wider, more grounded */}
      <div className="absolute bottom-[3%] right-[5%] w-24 h-20 z-20">
            <div className="w-full h-full bg-[#6d4c41] border border-[#3e2723] shadow-lg flex flex-col relative rounded-sm">
                {/* Drawers */}
                <div className="flex-1 border-b border-[#3e2723] relative flex items-center justify-center">
                    <div className="w-8 h-1 bg-[#3e2723] rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 flex border-b border-[#3e2723]">
                    <div className="flex-1 border-r border-[#3e2723] flex items-center justify-center">
                        <div className="w-1 h-3 bg-[#3e2723] rounded-full"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-1 h-3 bg-[#3e2723] rounded-full"></div>
                    </div>
                </div>
                <div className="flex-1 relative flex items-center justify-center">
                    <div className="w-8 h-1 bg-[#3e2723] rounded-full shadow-sm"></div>
                </div>
            </div>
      </div>

      {/* Round Low Table (Chabudai) & Cushion (Left Side) */}
      <div className="absolute bottom-[6%] left-[6%] z-20">
          {/* Cushion (Zabuton) - Flat on floor */}
          <div className="absolute bottom-1 -right-4 w-12 h-2 bg-[#3f51b5] rounded-sm transform skew-x-12 opacity-90 shadow-sm" />

          {/* Table */}
          <div className="w-24 h-10 relative">
              {/* Legs - Short and curved inward */}
              <div className="absolute bottom-0 left-4 w-1.5 h-4 bg-[#4e342e] rounded-b-sm"></div>
              <div className="absolute bottom-0 right-4 w-1.5 h-4 bg-[#4e342e] rounded-b-sm"></div>
              
              {/* Table Top - Round, perspective ellipse */}
              <div className="absolute top-1 w-full h-6 bg-[#795548] rounded-[50%] border-b-2 border-[#5d4037] shadow-lg z-10 flex items-center justify-center">
                    {/* Wood Grain hint */}
                    <div className="w-[80%] h-[60%] border border-[#5d4037]/10 rounded-[50%]"></div>
              </div>
          </div>
      </div>

      {/* Tatami Floor area */}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-[#eaddcf] border-t-[6px] border-[#5d4037] z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="absolute inset-0 opacity-15" 
                style={{ 
                  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 59px, #8b5a2b 60px)`,
                  backgroundSize: '60px 100%'
                }}
            />
            {/* Sunlight Reflection on floor */}
            <div className="absolute top-0 right-[30%] w-32 h-full bg-gradient-to-b from-white/30 to-transparent -skew-x-12 blur-xl" />
      </div>
  </div>
  );
}

export default RuralMorningBackground;