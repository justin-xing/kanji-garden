import React from 'react';

export const Bonsai: React.FC<{ percent: number }> = ({ percent }) => {
  // Logic to determine stage based on percent (0-100)
  const getStage = (p: number) => {
    if (p >= 100) return 12;
    if (p >= 90) return 11;
    if (p >= 80) return 10;
    if (p >= 70) return 9;
    if (p >= 60) return 8;
    if (p >= 50) return 7;
    if (p >= 40) return 6;
    if (p >= 30) return 5;
    if (p >= 20) return 4;
    if (p >= 10) return 3;
    if (p >= 5) return 2;
    if (p > 0.001) return 1;
    return 0;
  };

  const stage = getStage(percent);

  // Colors
  const cPot = "#a1887f";
  const cPotDark = "#8d6e63";
  const cSoil = "#4e342e";
  const cTrunk = "#5d4037"; 
  const cLeaf = "#7c9a60"; 
  const cLeafDark = "#556b2f";
  const cSakura = "#fce9f1";

  return (
    <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full transition-all duration-700"
        style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))' }}
    >
         {stage === 0 && (
             <g transform="translate(100, 160)">
                  <circle cx="0" cy="-20" r="45" fill="#bef264" opacity="0.1" className="animate-pulse group-hover:animate-jiggle" style={{ animationDuration: '3s', transformOrigin: '0px 0px' }} />
             </g>
         )}

         {stage === 0 && (
             <g transform="translate(100, 160)">
                  <g className="group-hover:animate-jiggle" style={{ transformOrigin: '0px 0px' }}>
                      <ellipse cx="0" cy="0" rx="18" ry="5" fill="#5d4037" />
                      <ellipse cx="-8" cy="1" rx="4" ry="2" fill="#3e2723" />
                      <ellipse cx="6" cy="2" rx="5" ry="3" fill="#3e2723" />
                      <path d="M0,0 Q1,-15 0,-30" stroke="#8bc34a" strokeWidth="4" fill="none" strokeLinecap="round" />
                      <path d="M0,-30 Q-25,-50 -30,-25 Q-15,-15 0,-30" fill="#7cb342" stroke="#558b2f" strokeWidth="0.5"/>
                      <path d="M-2,-32 Q-20,-45 -25,-28" fill="none" stroke="#dcfce7" strokeWidth="1" opacity="0.4" />
                      <path d="M0,-30 Q25,-50 30,-25 Q15,-15 0,-30" fill="#7cb342" stroke="#558b2f" strokeWidth="0.5"/>
                      <path d="M2,-32 Q20,-45 25,-28" fill="none" stroke="#dcfce7" strokeWidth="1" opacity="0.4" />
                      <circle cx="0" cy="-32" r="3" fill="#bef264" />
                  </g>
             </g>
         )}

         {stage >= 1 && stage < 2 && (
             <g transform="translate(100, 160)">
                 <g className="group-hover:animate-jiggle" style={{ transformOrigin: '0px 0px' }}>
                    <path d="M0,0 Q0,-10 -5,-15" stroke="#7c9a60" strokeWidth="2" fill="none" />
                    <path d="M0,0 Q0,-10 5,-15" stroke="#7c9a60" strokeWidth="2" fill="none" />
                    <circle cx="-5" cy="-15" r="3" fill="#7c9a60" />
                    <circle cx="5" cy="-15" r="3" fill="#7c9a60" />
                 </g>
             </g>
         )}

         {stage >= 2 && stage < 3 && (
             <g transform="translate(100, 160)">
                 <g className="group-hover:animate-jiggle" style={{ transformOrigin: '0px 0px' }}>
                    <path d="M0,0 Q2,-20 0,-30" stroke="#7c9a60" strokeWidth="3" fill="none" />
                    <ellipse cx="0" cy="-30" rx="6" ry="3" fill="#7c9a60" />
                    <ellipse cx="-5" cy="-25" rx="4" ry="2" fill="#7c9a60" transform="rotate(-30 -5 -25)" />
                    <ellipse cx="5" cy="-25" rx="4" ry="2" fill="#7c9a60" transform="rotate(30 5 -25)" />
                 </g>
             </g>
         )}

         {stage >= 3 && (
            <g className="animate-fade-in">
                <g className="group-hover:animate-jiggle" style={{ transformOrigin: '100px 160px' }}>
                    <path d="M100,160 C100,140 90,130 95,110 C100,90 110,100 110,80" fill="none" stroke={cTrunk} strokeWidth={stage >= 6 ? "8" : "5"} strokeLinecap="round"/>
                    {stage >= 4 && <path d="M95,120 Q80,110 70,100" fill="none" stroke={cTrunk} strokeWidth="4" strokeLinecap="round" />}
                    {stage >= 5 && <path d="M105,100 Q120,90 130,80" fill="none" stroke={cTrunk} strokeWidth="3" strokeLinecap="round" />}
                    {stage >= 6 && <path d="M110,80 Q100,60 90,50" fill="none" stroke={cTrunk} strokeWidth="3" strokeLinecap="round" />}
                    <path d="M98,160 Q90,165 85,170" fill="none" stroke={cTrunk} strokeWidth="3" />
                    <path d="M102,160 Q110,165 115,170" fill="none" stroke={cTrunk} strokeWidth="3" />

                    <circle cx="110" cy="80" r={stage >= 4 ? "15" : "10"} fill={cLeaf} opacity="0.9" />
                    {stage >= 4 && <circle cx="70" cy="100" r={stage >= 7 ? "18" : "12"} fill={cLeafDark} opacity="0.9" />}
                    {stage >= 5 && <circle cx="130" cy="80" r={stage >= 7 ? "20" : "14"} fill={cLeaf} opacity="0.9" />}
                    {stage >= 6 && <circle cx="90" cy="50" r={stage >= 8 ? "25" : "15"} fill={cLeafDark} opacity="0.9" />}
                    
                    {stage >= 7 && (
                        <>
                            <circle cx="100" cy="90" r="20" fill={cLeaf} opacity="0.7" />
                            <circle cx="80" cy="70" r="15" fill={cLeafDark} opacity="0.8" />
                        </>
                    )}

                    {stage >= 8 && (
                        <>
                            <circle cx="120" cy="60" r="18" fill={cLeaf} opacity="0.8" />
                            <circle cx="60" cy="90" r="12" fill={cLeaf} opacity="0.8" />
                        </>
                    )}

                    {stage >= 9 && (
                        <>
                            <circle cx="100" cy="40" r="22" fill={cLeaf} opacity="0.9" />
                            <circle cx="140" cy="70" r="15" fill={cLeafDark} opacity="0.85" />
                        </>
                    )}

                    {stage >= 10 && (
                        <g>
                            <circle cx="90" cy="45" r="3" fill={cSakura} />
                            <circle cx="130" cy="75" r="3" fill={cSakura} />
                            <circle cx="70" cy="95" r="2" fill={cSakura} />
                            <circle cx="110" cy="85" r="4" fill={cSakura} />
                        </g>
                    )}

                    {stage >= 11 && (
                        <g>
                            <circle cx="100" cy="30" r="3" fill={cSakura} />
                            <circle cx="120" cy="55" r="4" fill={cSakura} />
                            <circle cx="80" cy="65" r="3" fill={cSakura} />
                        </g>
                    )}
                </g>
            </g>
         )}

         <g transform="translate(60, 160)">
            <path d="M5,0 Q0,15 10,35 L70,35 Q80,15 75,0 Z" fill={cPot} />
            <path d="M5,0 L75,0 L73,4 L7,4 Z" fill={cPotDark} opacity="0.5" />
            <path d="M10,35 L70,35 Q75,20 72,5 L8,5 Q5,20 10,35" fill="black" opacity="0.1" />
            <path d="M15,35 L15,38 L25,38 L25,35 Z" fill={cPotDark} />
            <path d="M55,35 L55,38 L65,38 L65,35 Z" fill={cPotDark} />
            <ellipse cx="40" cy="2" rx="33" ry="4" fill={cSoil} />
         </g>

    </svg>
  );
};
