import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search } from 'lucide-react';
import { genkiKanjiData } from '../../data/kanji';
import type { LessonData, KanjiEntry } from '../../data/kanji';
import KanjiDetailModal from '../../components/KanjiDetailModal.tsx';
import { KanjiGrid } from './components/KanjiGrid.tsx';

const LibraryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry | null>(null);

  const filteredData = genkiKanjiData.map(lesson => ({
    ...lesson,
    kanji: lesson.kanji.filter(k => 
      k.character.includes(searchTerm) || 
      k.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.romaji.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(lesson => lesson.kanji.length > 0);

  return (
    <>
      <Layout headerTitle="Library">
        <div className="space-y-6 pb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meaning or romaji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-wasabi/50 focus:border-transparent placeholder-stone-400 shadow-sm"
            />
            <Search className="absolute left-3 top-3.5 text-stone-400" size={16} />
          </div>

          <div className="space-y-6">
            {filteredData.length > 0 ? (
              filteredData.map((lesson: LessonData) => (
                <div key={lesson.lesson} className="relative">
                  <div className="sticky top-0 bg-paper/95 backdrop-blur-sm py-2 z-10 flex items-center border-b border-stone-200/60 mb-3">
                     <span className="bg-stone-200 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded mr-2">
                       L{lesson.lesson}
                     </span>
                     <h3 className="text-sm font-semibold text-stone-700">{lesson.title}</h3>
                  </div>
                  
                  <KanjiGrid kanjiList={lesson.kanji} onSelect={setSelectedKanji} />
                </div>
              ))
            ) : (
               <div className="text-center py-20 text-stone-400">
                 <p>No kanji found matching "{searchTerm}"</p>
               </div>
            )}
          </div>
        </div>
      </Layout>

      <KanjiDetailModal 
        key={selectedKanji?.character ?? 'modal'}
        kanji={selectedKanji}
        isOpen={!!selectedKanji}
        onClose={() => setSelectedKanji(null)}
      />
    </>
  );
};

export default LibraryTab;