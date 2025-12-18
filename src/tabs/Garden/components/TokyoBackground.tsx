const TokyoBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
      {/* Wall (Dark Modern) */}
      <div className="absolute inset-0 bg-[#171717]" />

      {/* Scene Layer (Bustling Night City) */}
      <div className="absolute inset-0 z-0 bg-[#0f172a]">
            {/* Deep Night Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#4c1d95]" />
            
            {/* Stars */}
            <div className="absolute inset-0 opacity-40 animate-twinkle" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Background Skyline (Silhouette) */}
            <div className="absolute bottom-1/4 left-0 w-full h-1/2 bg-[#0f172a] opacity-80" 
                style={{ clipPath: 'polygon(0% 100%, 5% 40%, 15% 60%, 25% 30%, 35% 55%, 45% 20%, 55% 50%, 65% 35%, 75% 60%, 85% 45%, 95% 70%, 100% 100%)' }} 
            />

            {/* Midground Skyline with Lit Windows */}
            <div className="absolute bottom-0 w-full h-[45%] flex items-end justify-center px-4">
                {/* Skyscraper 1 */}
                <div className="w-16 h-64 bg-[#1e293b] mx-1 relative flex flex-col justify-end border-t border-r border-l border-white/10">
                    {/* Windows */}
                    <div className="absolute inset-0 opacity-60" 
                        style={{ 
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 2px, transparent 2px), linear-gradient(90deg, transparent 4px, #0f172a 4px)', 
                            backgroundSize: '8px 8px' 
                        }} 
                    />
                    {/* Roof Light */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-red-500 animate-pulse" />
                </div>

                {/* Skyscraper 2 */}
                <div className="w-12 h-40 bg-[#1e293b] mx-0.5 relative flex flex-col justify-end">
                    <div className="absolute top-2 w-full h-full opacity-40" 
                        style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '4px 8px' }} 
                    />
                </div>

                {/* Tokyo Tower (More Vibrant) */}
                <div className="w-28 h-80 relative z-10 mx-[-10px] flex flex-col items-center justify-end -mb-4">
                    <div className="w-1 h-12 bg-red-600 animate-pulse" />
                    <div className="w-20 h-60 bg-gradient-to-t from-red-600 via-orange-500 to-red-500 opacity-90" 
                          style={{ clipPath: 'polygon(50% 0, 10% 100%, 90% 100%)' }} 
                    />
                    <div className="absolute bottom-20 w-32 h-32 bg-orange-500/40 blur-2xl rounded-full pointer-events-none animate-pulse-slow" />
                </div>

                {/* Skyscraper 3 */}
                <div className="w-20 h-56 bg-[#1e293b] mx-1 relative border-t border-white/10">
                    {/* Neon Strip */}
                    <div className="absolute top-4 left-2 right-2 h-0.5 bg-cyan-400 shadow-[0_0_8px_cyan]" />
                    <div className="absolute top-0 right-0 w-full h-full opacity-50"
                        style={{ backgroundImage: 'linear-gradient(transparent 5px, rgba(56, 189, 248, 0.3) 6px)', backgroundSize: '100% 10px' }}
                    />
                </div>
            </div>

            {/* Bustling City Layer (Bottom) - Open Businesses & Traffic */}
            <div className="absolute bottom-0 w-full h-24 z-10">
                {/* Neon Signs / Businesses */}
                <div className="absolute bottom-0 w-full h-12 flex items-end justify-between px-2 opacity-90">
                    <div className="w-10 h-6 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] rounded-t-sm" /> {/* Shop 1 */}
                    <div className="w-14 h-10 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] rounded-t-sm" /> {/* Shop 2 */}
                    <div className="w-12 h-5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] rounded-t-sm mx-10" /> {/* Shop 3 */}
                    <div className="w-16 h-8 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] rounded-t-sm" /> {/* Shop 4 */}
                </div>
                
                {/* Traffic Lines (Moving) */}
                <div className="absolute bottom-2 w-[150%] h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-[1px] animate-drift" />
                <div className="absolute bottom-4 w-[150%] h-2 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] animate-drift" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            </div>
      </div>

      {/* Window Frame (Large Pane Glass) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[92%] h-[78%] border-x-[16px] border-t-[16px] border-[#262626] bg-transparent z-10 shadow-2xl overflow-hidden">
          {/* Glass Reflection */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
      </div>

      {/* Floor (Modern Concrete/Wood) */}
      <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#404040] border-t-[4px] border-[#262626] z-20">
            {/* Floor Reflection of City */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent opacity-50" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 98%, #171717 100%)', backgroundSize: '100px 100%' }} />
      </div>

      {/* Furniture: Modern Side Table with Lamp */}
      <div className="absolute bottom-[8%] left-[8%] z-30">
            <div className="w-16 h-12 bg-[#262626] shadow-2xl relative rounded-sm flex items-center justify-center">
                {/* Minimalist Lamp */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#525252]"></div>
                <div className="absolute bottom-[calc(100%+24px)] left-1/2 -translate-x-1/2 w-10 h-6 bg-white rounded-t-full shadow-[0_0_25px_rgba(255,255,255,0.6)]" />
            </div>
      </div>
    </div>
  );
}

export default TokyoBackground;