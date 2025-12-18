import React from 'react';
import { Check, Lock, SkipForward } from 'lucide-react';
import { genkiKanjiData } from '../../../data/kanji';
import type { UserProgress } from '../types';

interface LessonListProps {
    progress: UserProgress;
    onStartLesson: (index: number) => void;
    onSkipToLesson: (index: number) => void;
}

export const LessonList: React.FC<LessonListProps> = ({ progress, onStartLesson, onSkipToLesson }) => {
    const [listTab, setListTab] = React.useState<'LEARNING' | 'LEARNED'>('LEARNING');

    return (
        <div className="space-y-6">
            <div className="flex bg-white rounded-full p-1 mb-6 border border-stone-200 shadow-sm">
                  <button 
                    onClick={() => setListTab('LEARNING')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                        listTab === 'LEARNING' ? 'bg-wasabi text-white shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                      Learning
                  </button>
                  <button 
                    onClick={() => setListTab('LEARNED')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                        listTab === 'LEARNED' ? 'bg-wasabi text-white shadow-sm' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                      Learned
                  </button>
              </div>

            {genkiKanjiData.map((lesson, index) => {
                const isCompleted = index < progress.lessonIndex;
                const isCurrent = index === progress.lessonIndex;
                const isLocked = index > progress.lessonIndex;

                if (listTab === 'LEARNED' && !isCompleted) return null;
                if (listTab === 'LEARNING' && isCompleted) return null;

                let kanjiDone = 0;
                if (isCompleted) kanjiDone = lesson.kanji.length;
                else if (isCurrent) kanjiDone = progress.kanjiIndex;
                
                const progressPct = (kanjiDone / lesson.kanji.length) * 100;

                return (
                    <div
                        key={lesson.lesson}
                        onClick={() => !isLocked && onStartLesson(index)}
                        className={`w-full bg-white p-5 rounded-2xl shadow-sm border border-stone-100 text-left transition-all relative overflow-hidden group ${isLocked ? 'bg-stone-50 cursor-default' : 'hover:shadow-md hover:border-stone-200 active:scale-[0.99] cursor-pointer'}`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-base text-ink">Lesson {lesson.lesson}: {lesson.title}</h3>
                                <span className={`text-xs font-mono ${isLocked ? 'text-stone-400' : 'text-stone-500'}`}>{isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked'}</span>
                            </div>
                            <div className="text-stone-300">
                                {isCompleted ? <Check className="text-wasabi" size={20} /> : isLocked ? <Lock size={18} className="text-stone-300" /> : <div className="w-5 h-5 rounded-full border-2 border-stone-200 group-hover:border-wasabi transition-colors" />}
                            </div>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-wasabi' : isLocked ? 'bg-stone-200' : 'bg-wasabi/80'}`} style={{ width: `${progressPct}%` }} />
                        </div>
                        {isCurrent && (
                            <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
                                <button onClick={(e) => { e.stopPropagation(); onSkipToLesson(index + 1); }} className="text-xs font-bold text-stone-400 hover:text-wasabi hover:bg-white border border-transparent hover:border-stone-200 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all">Skip Lesson <SkipForward size={14} /></button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
