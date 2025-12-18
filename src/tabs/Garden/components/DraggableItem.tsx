import React, { useState } from 'react';

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  x: number;
  y: number;
}

interface DraggableItemProps {
  item: PlacedItem;
  icon: string;
  containerRef: React.RefObject<HTMLDivElement> | null;
  onUpdate: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ item, icon, containerRef, onUpdate, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.stopPropagation();

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    const clampedX = Math.max(0, Math.min(90, x));
    const clampedY = Math.max(0, Math.min(90, y));

    onUpdate(item.instanceId, clampedX, clampedY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => onRemove(item.instanceId)}
      className="absolute cursor-move select-none text-4xl hover:scale-110 active:scale-125 transition-transform touch-none z-30 filter drop-shadow-md"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: 'translate(-50%, -50%)' 
      }}
      title="Double click to remove"
    >
      {icon}
    </div>
  );
};
