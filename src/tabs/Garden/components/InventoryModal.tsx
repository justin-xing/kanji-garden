import React from 'react';
import { Package, X, Lock } from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  unlockAt: number;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: number;
  items: InventoryItem[];
  onAddItem: (itemId: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, currentStage, items, onAddItem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative z-10 animate-fade-in flex flex-col max-h-[70vh]">
          <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-paper">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Package size={18} className="text-wasabi" />
                  Garden Decor
              </h3>
              <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                  <X size={18} />
              </button>
          </div>
          
          <div className="p-4 overflow-y-auto bg-stone-50 flex-grow grid grid-cols-3 gap-3">
              {items.map(item => {
                  const isUnlocked = currentStage >= item.unlockAt;
                  return (
                      <button
                          key={item.id}
                          disabled={!isUnlocked}
                          onClick={() => onAddItem(item.id)}
                          className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 relative transition-all ${
                              isUnlocked 
                              ? 'bg-white border-stone-200 hover:border-wasabi hover:shadow-md active:scale-95' 
                              : 'bg-stone-100 border-stone-100 opacity-60 cursor-not-allowed'
                          }`}
                      >
                          <div className="text-2xl filter drop-shadow-sm">{item.icon}</div>
                          <span className="text-[9px] font-bold text-stone-500">{item.name}</span>
                          
                          {!isUnlocked && (
                              <div className="absolute inset-0 bg-stone-200/50 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl">
                                  <Lock size={14} className="text-stone-500 mb-1" />
                                  <span className="text-[8px] font-bold text-stone-500 bg-white/80 px-1.5 py-0.5 rounded-full">
                                      Stage {item.unlockAt}
                                  </span>
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
