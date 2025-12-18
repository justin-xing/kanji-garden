import React from 'react';
import { Sprout, BookOpen, Plus, Lightbulb, Users } from 'lucide-react';
import type { AppTabType } from '../types';
import { AppTab } from '../types';

interface NavigationProps {
  currentTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  // Navigation matches the mockup: Garden, Library, + (Learn), Quiz (Review), Community (Profile)
  const navItems = [
    { id: AppTab.GARDEN, label: 'Garden', icon: Sprout },
    { id: AppTab.LIBRARY, label: 'Library', icon: BookOpen },
    { id: AppTab.LEARN, label: '', icon: Plus, isAction: true }, // Central Action Button
    { id: AppTab.REVIEW, label: 'Quiz', icon: Lightbulb },
    { id: AppTab.COMMUNITY, label: 'Community', icon: Users },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-end max-w-md mx-auto h-16 pb-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          
          if (item.isAction) {
             return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative -top-1 flex flex-col items-center justify-center group"
                >
                  <div className="w-20 h-20 relative flex items-center justify-center hover:scale-110 transition-transform active:scale-95 filter drop-shadow-lg">
                     {/* Japanese Lantern SVG */}
                     <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        <defs>
                          <filter id="lantern-glow" x="-50%" y="-50%" width="200%" height="200%">
                             <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                             <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                             </feMerge>
                          </filter>
                          <linearGradient id="lantern-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f87171" /> {/* Red-400 */}
                            <stop offset="50%" stopColor="#ef4444" /> {/* Red-500 */}
                            <stop offset="100%" stopColor="#dc2626" /> {/* Red-600 */}
                          </linearGradient>
                        </defs>
                        
                        <g filter="url(#lantern-glow)">
                           {/* Hanging String */}
                           <line x1="50" y1="0" x2="50" y2="10" stroke="#44403c" strokeWidth="2" />
                           
                           {/* Lantern Body - slightly elongated */}
                           <ellipse cx="50" cy="45" rx="30" ry="38" fill="url(#lantern-grad)" />
                           
                           {/* Ribs (Curved Lines) */}
                           <path d="M24,32 Q50,38 76,32" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                           <path d="M20,45 Q50,50 80,45" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                           <path d="M24,58 Q50,64 76,58" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />

                           {/* Top Cap */}
                           <ellipse cx="50" cy="11" rx="16" ry="4" fill="#292524" />
                           
                           {/* Bottom Cap */}
                           <ellipse cx="50" cy="81" rx="16" ry="4" fill="#292524" />
                        </g>

                        {/* Kanji Character */}
                        <text 
                          x="50" 
                          y="48" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          className="font-serif font-black fill-white text-3xl"
                          style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          学
                        </text>
                     </svg>
                  </div>
                  <span className="text-xs font-bold text-[#ef4444] mt-[-18px] relative z-10 bg-white/90 px-3 py-0.5 rounded-full shadow-sm backdrop-blur-sm border border-[#ef4444]/20">
                    Learn
                  </span>
                </button>
             );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-12 transition-all duration-300 ${
                isActive ? 'text-[#7c9a60]' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                fill={isActive ? "currentColor" : "none"}
                className={isActive ? "opacity-100" : "opacity-70"}
              />
              <span className="text-[10px] mt-1 font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;