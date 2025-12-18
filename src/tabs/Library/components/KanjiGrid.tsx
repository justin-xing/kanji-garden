import React from 'react';
import type { KanjiEntry } from '../../../data/kanji';

interface KanjiGridProps {
    kanjiList: KanjiEntry[];
    onSelect: (kanji: KanjiEntry) => void;
}

export const KanjiGrid: React.FC<KanjiGridProps> = ({ kanjiList, onSelect }) => {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {kanjiList.map((kanji) => (
                <button 
                    key={kanji.character} 
                    onClick={() => onSelect(kanji)}
                    className="group bg-white rounded-lg shadow-sm border border-stone-100 hover:shadow-md hover:border-wasabi/30 active:scale-95 transition-all duration-200 aspect-square flex items-center justify-center relative overflow-hidden"
                >
                    <span className="text-2xl text-indigo-jp font-medium group-hover:scale-110 transition-transform duration-300">
                        {kanji.character}
                    </span>
                </button>
            ))}
        </div>
    );
};
