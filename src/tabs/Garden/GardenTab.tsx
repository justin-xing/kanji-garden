import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout";
import { genkiKanjiData } from "../../data/kanji";
import { AppTab } from "../../types";
import type { AppTabType } from "../../types";
import {
  ArrowRight,
  HelpCircle,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { Bonsai } from "./components/Bonsai.tsx";
import { DraggableItem } from "./components/DraggableItem.tsx";
import type { PlacedItem } from "./components/DraggableItem.tsx";
import { InventoryModal } from "./components/InventoryModal.tsx";
import type { InventoryItem } from "./components/InventoryModal.tsx";
import { BackgroundModal } from "./components/BackgroundModal.tsx";
import type { BackgroundTheme } from "./components/BackgroundModal.tsx";
import CatEmoji from "./components/CatEmoji.tsx";
import LakeBackground from "./components/LakeBackground.tsx";
import RuralMorningBackground from "./components/RuralMorningBackground.tsx";
import TokyoBackground from "./components/TokyoBackground.tsx";
import SakuraBackground from "./components/SakuraBackground.tsx";
import MountainBackground from "./components/MountainBackground.tsx";

interface ProgressStats {
  completed: number;
  total: number;
  percent: number;
  reviewing: number;
  mastered: number;
}

interface GardenTabProps {
  onNavigate: (tab: AppTabType) => void;
}

const INVENTORY_ITEMS: InventoryItem[] = [
  { id: "lantern", name: "Lantern", icon: "🏮", unlockAt: 0 },
  { id: "cat", name: "Lucky Cat", icon: "🐱", unlockAt: 0 },
  { id: "tea", name: "Matcha", icon: "🍵", unlockAt: 0 },
  { id: "dango", name: "Dango", icon: "🍡", unlockAt: 1 },
  { id: "daruma", name: "Daruma", icon: "👺", unlockAt: 2 },
  { id: "torii", name: "Mini Torii", icon: "⛩️", unlockAt: 3 },
  { id: "carp", name: "Koinobori", icon: "🎏", unlockAt: 4 },
  { id: "windchime", name: "Wind Chime", icon: "🎐", unlockAt: 5 },
  { id: "fan", name: "Fan", icon: "🪭", unlockAt: 6 },
  { id: "mask", name: "Kitsune", icon: "🦊", unlockAt: 7 },
  { id: "sake", name: "Sake", icon: "🍶", unlockAt: 8 },
  { id: "bento", name: "Bento", icon: "🍱", unlockAt: 9 },
  { id: "shrine", name: "Shrine", icon: "🕍", unlockAt: 10 },
];

const BACKGROUNDS: BackgroundTheme[] = [
  {
    id: "rural",
    name: "Rural Morning",
    icon: "🍵",
    unlockAt: 0,
    description: "A serene room overlooking rice paddies.",
  },
  {
    id: "lake",
    name: "Lantern Lake",
    icon: "🏮",
    unlockAt: 3,
    description: "Night time at a serene lake with glowing lanterns.",
  },
  {
    id: "tokyo",
    name: "Tokyo View",
    icon: "🌃",
    unlockAt: 6,
    description: "Bustling cityscape from a high-rise window.",
  },
  {
    id: "mountain",
    name: "Fuji View",
    icon: "🗻",
    unlockAt: 9,
    description: "A clear view of the sacred mountain.",
  },
  {
    id: "sakura",
    name: "Sakura Park",
    icon: "🌸",
    unlockAt: 12,
    description: "Surrounded by falling cherry blossoms.",
  },
];

const GardenTab: React.FC<GardenTabProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<ProgressStats>({
    completed: 0,
    total: 0,
    percent: 0,
    reviewing: 0,
    mastered: 0,
  });

  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState("rural");
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = genkiKanjiData.reduce(
      (acc, lesson) => acc + lesson.kanji.length,
      0
    );
    let completed = 0;
    const saved = localStorage.getItem("kanji_garden_progress");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { lessonIndex, kanjiIndex } = parsed;
        for (let i = 0; i < lessonIndex; i++) {
          if (genkiKanjiData[i]) completed += genkiKanjiData[i].kanji.length;
        }
        completed += kanjiIndex;
        if (lessonIndex >= genkiKanjiData.length) completed = total;
      } catch (e) {
        console.error(e);
      }
    }
    const reviewing = Math.max(0, Math.floor(completed * 0.6));
    const mastered = Math.max(0, Math.floor(completed * 0.2));
    const percent = total > 0 ? (completed / total) * 100 : 0;
    setStats({ completed, total, percent, reviewing, mastered });
  }, []);

  useEffect(() => {
    const savedItems = localStorage.getItem("kanji_garden_decorations");
    if (savedItems) setPlacedItems(JSON.parse(savedItems));
    const savedBg = localStorage.getItem("kanji_garden_bg");
    if (savedBg) setCurrentBg(savedBg);
  }, []);

  const savePlacedItems = (items: PlacedItem[]) => {
    setPlacedItems(items);
    localStorage.setItem("kanji_garden_decorations", JSON.stringify(items));
  };

  const handleSetBackground = (id: string) => {
    setCurrentBg(id);
    localStorage.setItem("kanji_garden_bg", id);
    setBgModalOpen(false);
  };

  const addItemToRoom = (itemId: string) => {
    const newItem: PlacedItem = {
      instanceId: Date.now().toString(),
      itemId,
      x: 50,
      y: 75,
    };
    savePlacedItems([...placedItems, newItem]);
    setInventoryOpen(false);
  };

  const updateItemPosition = (id: string, x: number, y: number) => {
    const updated = placedItems.map((item) =>
      item.instanceId === id ? { ...item, x, y } : item
    );
    savePlacedItems(updated);
  };

  const removeItem = (id: string) => {
    const updated = placedItems.filter((item) => item.instanceId !== id);
    savePlacedItems(updated);
  };

  const getStageInfo = (p: number) => {
    const thresholds = [0, 0.001, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let currentStage = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (p >= thresholds[i]) currentStage = i;
      else break;
    }
    return { currentStage };
  };

  const { currentStage } = getStageInfo(stats.percent);
  const totalStages = 12;

  const renderBackground = () => {
    if (currentBg === "rural") {
      return <RuralMorningBackground />;
    } else if (currentBg === "lake") {
      return <LakeBackground />;
    } else if (currentBg === "tokyo") {
      return <TokyoBackground />;
    } else if (currentBg === "mountain") {
      return <MountainBackground />;
    } else if (currentBg === "sakura") {
      return <SakuraBackground />;
    } else {
      return (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl bg-stone-200">
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-bold opacity-20 text-4xl uppercase tracking-widest">
            {currentBg}
          </div>
        </div>
      );
    }
  };

  return (
    <Layout
      headerTitle="Kanji Garden"
      action={
        <button className="text-stone-400">
          <HelpCircle size={20} />
        </button>
      }
      isScreenFit
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center shrink-0 px-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#7c9a60]">
              {stats.completed}
            </span>
            <span className="text-sm font-medium text-stone-400">
              Kanji Collected
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              Stage {currentStage}/{totalStages}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => {
                const active = (currentStage / totalStages) * 5 >= i - 0.5;
                return (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      active ? "bg-[#7c9a60]" : "bg-stone-200"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex-1 relative w-full rounded-3xl overflow-hidden shadow-sm border border-stone-200 bg-[#f0eee9]"
          ref={roomRef}
        >
          {renderBackground()}

          <div className="absolute inset-0 z-10 flex items-end justify-center pb-2 pointer-events-none">
            <div className="w-56 h-56 transform origin-bottom pointer-events-auto group cursor-pointer transition-transform">
              <Bonsai percent={stats.percent} />
            </div>
          </div>

          {placedItems.map((item) => {
            const def = INVENTORY_ITEMS.find((d) => d.id === item.itemId);
            if (!def) return null;
            return (
              <DraggableItem
                key={item.instanceId}
                item={item}
                icon={def.icon}
                containerRef={roomRef}
                onUpdate={updateItemPosition}
                onRemove={removeItem}
              />
            );
          })}

          <button
            onClick={() => setBgModalOpen(true)}
            className="absolute top-4 right-4 z-40 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm border border-stone-200 text-stone-600 hover:text-wasabi hover:scale-110 transition-all"
          >
            <ImageIcon size={18} />
          </button>
          <button
            onClick={() => setInventoryOpen(true)}
            className="absolute top-16 right-4 z-40 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm border border-stone-200 text-stone-600 hover:text-wasabi hover:scale-110 transition-all"
          >
            <Package size={18} />
          </button>
        </div>

        <div className="shrink-0 space-y-3 mt-1">
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7c9a60] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, stats.percent)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-stone-400 w-8 text-right whitespace-nowrap">
              {Math.floor(stats.percent)}%
            </span>
          </div>

          <button
            onClick={() => onNavigate(AppTab.LEARN)}
            className="w-full bg-gradient-to-br from-[#749f76] to-[#5d8d62] rounded-3xl p-6 shadow-xl shadow-[#5d8d62]/30 border border-white/20 flex items-center justify-between group active:scale-[0.98] hover:shadow-2xl hover:scale-[1.01] transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20 shadow-inner group">
                <CatEmoji />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white text-xl leading-none drop-shadow-md">
                  Continue Learning
                </h4>
                <p className="text-sm text-white/90 mt-1.5 font-medium drop-shadow-sm opacity-90">
                  Keep growing your garden
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#5d8d62] transition-colors backdrop-blur-md border border-white/20 shadow-sm relative z-10">
              <ArrowRight size={24} strokeWidth={3} />
            </div>
          </button>
        </div>
      </div>

      <InventoryModal
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        currentStage={currentStage}
        items={INVENTORY_ITEMS}
        onAddItem={addItemToRoom}
      />

      <BackgroundModal
        isOpen={bgModalOpen}
        onClose={() => setBgModalOpen(false)}
        currentStage={currentStage}
        currentBg={currentBg}
        backgrounds={BACKGROUNDS}
        onSetBackground={handleSetBackground}
      />
    </Layout>
  );
};

export default GardenTab;
