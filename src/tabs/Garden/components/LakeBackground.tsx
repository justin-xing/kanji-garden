const LakeBackground = () => {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        {/* Wall (Deep Indigo) */}
        <div className="absolute inset-0 bg-[#0f172a]" />
        
        {/* Scene Layer (Behind Window) */}
        <div className="absolute inset-0 z-0">
              {/* Sky Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#312e81]" />
              
              {/* Moon & Glow */}
              <div className="absolute top-[20%] right-[30%] w-24 h-24 rounded-full bg-yellow-100/90 shadow-[0_0_60px_rgba(253,224,71,0.5)]" />
              <div className="absolute top-[22%] right-[32%] w-20 h-20 rounded-full bg-[#fefce8] blur-sm opacity-80" />

              {/* Torii Silhouette (Distant) */}
              <div className="absolute bottom-[40%] right-[35%] opacity-60 pointer-events-none">
                  <svg width="60" height="50" viewBox="0 0 60 50" fill="#000">
                      <path d="M10,0 L50,0 L50,5 L60,5 L60,10 L50,10 L50,40 L55,50 L45,50 L45,10 L15,10 L15,50 L5,50 L10,40 L10,10 L0,10 L0,5 L10,5 Z" />
                      <rect x="15" y="15" width="30" height="3" />
                  </svg>
              </div>
              
              {/* Water Surface */}
              <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-b from-[#1e3a8a] to-[#0f172a]">
                  {/* Moon Reflection (Blurry) */}
                  <div className="absolute top-2 right-[32%] w-16 h-40 bg-yellow-100/10 blur-xl transform skew-x-12" />
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)' }} />
              </div>

              {/* Floating Lanterns (Whimsical) */}
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="absolute w-4 h-5 rounded-sm bg-orange-400 blur-[1px] shadow-[0_0_10px_rgba(251,146,60,0.8)] animate-float"
                      style={{
                          bottom: `${15 + Math.random() * 20}%`,
                          left: `${10 + Math.random() * 80}%`,
                          animationDelay: `${i * 1.5}s`,
                          opacity: 0.8
                      }}
                  />
              ))}

              {/* Fireflies */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={`firefly-${i}`} className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" 
                      style={{
                          top: `${30 + Math.random() * 40}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`
                      }}
                />
              ))}
        </div>

        {/* Window Frame (Enso Style - Dark Wood) */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-72 h-72 rounded-full border-[8px] border-[#3e2723] shadow-[inset_0_10px_30px_rgba(0,0,0,0.5),0_0_0_1000px_#1e1b4b] z-10 pointer-events-none" />

        {/* Floor (Dark Deck) */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-[#251815] border-t-[4px] border-[#3e2723] z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, #000 100%)', backgroundSize: '40px 100%' }} />
        </div>

        {/* Furniture: Andon Lamp (Floor) */}
        <div className="absolute bottom-[8%] left-[8%] w-12 h-24 z-20">
              <div className="w-full h-full bg-[#ffedd5] border-2 border-[#3e2723] shadow-[0_0_30px_rgba(253,186,116,0.4)] flex flex-col relative">
                  {/* Frame lines */}
                  <div className="absolute inset-x-0 top-1/3 h-0.5 bg-[#3e2723]" />
                  <div className="absolute inset-x-0 top-2/3 h-0.5 bg-[#3e2723]" />
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-[#3e2723]" />
                  {/* Glow center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-300 blur-md rounded-full opacity-60 animate-pulse-slow" />
                  {/* Legs */}
                  <div className="absolute -bottom-2 left-0 w-1 h-2 bg-[#3e2723]" />
                  <div className="absolute -bottom-2 right-0 w-1 h-2 bg-[#3e2723]" />
              </div>
        </div>
    </div>
    );
}

export default LakeBackground;