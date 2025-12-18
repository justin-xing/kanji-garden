import React from 'react';
import { Image as ImageIcon, X, Lock } from 'lucide-react';

export interface BackgroundTheme {
  id: string;
  name: string;
  icon: string;
  unlockAt: number;
  description: string;
}

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: number;
  currentBg: string;
  backgrounds: BackgroundTheme[];
  onSetBackground: (id: string) => void;
}

export const BackgroundModal: React.FC<BackgroundModalProps> = ({ 
  isOpen, onClose, currentStage, currentBg, backgrounds, onSetBackground 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative z-10 animate-fade-in flex flex-col max-h-[70vh]">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-paper">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <ImageIcon size={18} className="text-wasabi" />
                    Scenery
                </h3>
                <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                    <X size={18} />
                </button>
            </div>
            
            <div className="p-4 overflow-y-auto bg-stone-50 flex-grow space-y-3">
                {backgrounds.map(bg => {
                    const isUnlocked = currentStage >= bg.unlockAt;
                    const isSelected = currentBg === bg.id;
                    return (
                        <button
                            key={bg.id}
                            disabled={!isUnlocked}
                            onClick={() => onSetBackground(bg.id)}
                            className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 relative transition-all text-left ${
                                isSelected 
                                ? 'bg-wasabi/10 border-wasabi shadow-sm' 
                                : isUnlocked 
                                  ? 'bg-white border-stone-200 hover:border-wasabi/50' 
                                  : 'bg-stone-100 border-stone-100 opacity-60 cursor-not-allowed'
                            }`}
                        >
                            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xl shadow-inner shrink-0">
                                {bg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-xs ${isSelected ? 'text-wasabi' : 'text-stone-700'}`}>
                                    {bg.name}
                                </h4>
                                <p className="text-[10px] text-stone-500 leading-tight mt-0.5 truncate">{bg.description}</p>
                            </div>
                            
                            {!isUnlocked && (
                                <div className="flex items-center gap-1 bg-stone-200 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-stone-500 shrink-0">
                                    <Lock size={10} />
                                    Stage {bg.unlockAt}
                                </div>
                            )}
                            
                            {isSelected && (
                                <div className="w-5 h-5 bg-wasabi rounded-full flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
