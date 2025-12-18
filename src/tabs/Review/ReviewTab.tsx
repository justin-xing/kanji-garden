import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Layout from '../../components/Layout';
import { genkiKanjiData } from '../../data/kanji';
import type { KanjiEntry } from '../../data/kanji';
import { RefreshCcw, Check, X, Eye, Award, Calendar, Layers, ChevronLeft, ChevronRight as ChevronRightIcon, Square, CheckSquare, Info } from 'lucide-react';

// --- Types ---

interface ReviewStats {
  history: { date: number; correct: boolean }[];
}

type ReviewDataMap = Record<string, ReviewStats>;

const ReviewPhase = {
  MENU: 'MENU',
  DAILY_START: 'DAILY_START',
  FLASHCARDS_SELECT: 'FLASHCARDS_SELECT',
  FLASHCARDS_PLAY: 'FLASHCARDS_PLAY',
  FLASHCARDS_COMPLETE: 'FLASHCARDS_COMPLETE',
  QUIZ: 'QUIZ',
  SUMMARY: 'SUMMARY'
}

type ReviewPhaseType = (typeof ReviewPhase)[keyof typeof ReviewPhase];

const QuestionType = {
  MEANING: 'MEANING',
  DRAW: 'DRAW'
}

type QuestionTypeType = (typeof QuestionType)[keyof typeof QuestionType];

interface QuizItem {
  kanji: KanjiEntry;
  type: QuestionTypeType;
  options?: string[]; // For meaning quiz
}

// --- Helper Functions ---

const getCompletedKanji = (): KanjiEntry[] => {
  const saved = localStorage.getItem('kanji_garden_progress');
  if (!saved) return [];

  try {
    const { lessonIndex, kanjiIndex } = JSON.parse(saved);
    const completed: KanjiEntry[] = [];

    // All kanji from previous fully completed lessons
    for (let i = 0; i < lessonIndex; i++) {
      if (genkiKanjiData[i]) {
        completed.push(...genkiKanjiData[i].kanji);
      }
    }

    // Completed kanji from current lesson
    if (genkiKanjiData[lessonIndex]) {
      const currentLessonKanji = genkiKanjiData[lessonIndex].kanji;
      for (let j = 0; j < kanjiIndex; j++) {
        if (currentLessonKanji[j]) {
          completed.push(currentLessonKanji[j]);
        }
      }
    }

    return completed;
  } catch (e) {
    console.error("Error parsing progress for review", e);
    return [];
  }
};

const getReviewStats = (): ReviewDataMap => {
  const saved = localStorage.getItem('kanji_garden_review_stats');
  return saved ? JSON.parse(saved) : {};
};

const saveReviewResult = (char: string, isCorrect: boolean) => {
  const stats = getReviewStats();
  if (!stats[char]) {
    stats[char] = { history: [] };
  }
  stats[char].history.push({ date: Date.now(), correct: isCorrect });
  localStorage.setItem('kanji_garden_review_stats', JSON.stringify(stats));
};

// --- Component ---

const ReviewTab: React.FC = () => {
  // State
  const [phase, setPhase] = useState<ReviewPhaseType>(ReviewPhase.MENU);
  
  // Daily Review State
  const [queue, setQueue] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showDrawAnswer, setShowDrawAnswer] = useState(false);
  
  // Flashcard State
  const [selectedForFlashcards, setSelectedForFlashcards] = useState<Set<string>>(new Set());
  const [flashcardQueue, setFlashcardQueue] = useState<KanjiEntry[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [shapes, setShapes] = useState<{ path: { x: number; y: number }[] }[]>([]);

  // Computed
  const completedKanji = useMemo(() => getCompletedKanji(), [phase]); // Re-fetch when phase changes (e.g. entering menu)

  // Safe access for rendering
  const currentFlashcard = flashcardQueue[flashcardIndex];

  // --- Logic: Session Generation ---

  const startSession = useCallback(() => {
    if (completedKanji.length === 0) return;

    const stats = getReviewStats();
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    // Calculate priority scores
    const scored = completedKanji.map(k => {
      const stat = stats[k.character] || { history: [] };
      
      // 1. Mistakes in last 7 days
      const mistakesLastWeek = stat.history.filter(h => 
        !h.correct && (now - h.date) < 7 * ONE_DAY
      ).length;

      // 2. Times quizzed in last 30 days
      const timesQuizzed30Days = stat.history.filter(h => 
        (now - h.date) < 30 * ONE_DAY
      ).length;

      const score = (mistakesLastWeek * 100) - (timesQuizzed30Days * 1);
      
      return { kanji: k, score };
    });

    // Sort and take top 10
    scored.sort((a, b) => b.score - a.score);
    const sessionKanji = scored.slice(0, 10).map(s => s.kanji);

    // Generate Quiz Items
    const allMeanings = genkiKanjiData.flatMap(l => l.kanji).map(k => k.meaning);
    
    const newQueue: QuizItem[] = sessionKanji.map(k => {
      const type = Math.random() > 0.5 ? QuestionType.MEANING : QuestionType.DRAW;
      
      let options: string[] | undefined;
      if (type === QuestionType.MEANING) {
        const distractors = allMeanings
          .filter(m => m !== k.meaning)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        options = [...distractors, k.meaning].sort(() => 0.5 - Math.random());
      }

      return { kanji: k, type, options };
    });

    setQueue(newQueue);
    setCurrentIndex(0);
    setResults({ correct: 0, total: 0 });
    setPhase(ReviewPhase.QUIZ);
    resetInteraction();
  }, [completedKanji]);

  const resetInteraction = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowDrawAnswer(false);
    setShapes([]);
    setCurrentPath([]);
  };

  const handleNext = (wasCorrect: boolean) => {
    const currentItem = queue[currentIndex];
    saveReviewResult(currentItem.kanji.character, wasCorrect);

    setResults(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetInteraction();
    } else {
      setPhase(ReviewPhase.SUMMARY);
    }
  };

  // --- Flashcard Logic ---

  const toggleFlashcardSelection = (char: string) => {
    const newSet = new Set(selectedForFlashcards);
    if (newSet.has(char)) newSet.delete(char);
    else newSet.add(char);
    setSelectedForFlashcards(newSet);
  };

  const toggleLessonSelection = (lessonKanji: KanjiEntry[]) => {
    const allSelected = lessonKanji.every(k => selectedForFlashcards.has(k.character));
    const newSet = new Set(selectedForFlashcards);
    lessonKanji.forEach(k => {
        if (allSelected) newSet.delete(k.character);
        else newSet.add(k.character);
    });
    setSelectedForFlashcards(newSet);
  };

  const startFlashcards = () => {
    const selected = completedKanji.filter(k => selectedForFlashcards.has(k.character));
    if (selected.length === 0) return;
    
    // Shuffle
    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    
    setFlashcardQueue(shuffled);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setPhase(ReviewPhase.FLASHCARDS_PLAY);
  };

  const handleFlashcardLearned = () => {
      setIsFlipped(false);
      // Wait for flip animation to start resetting before changing content
      setTimeout(() => {
          if (flashcardIndex + 1 >= flashcardQueue.length) {
              setPhase(ReviewPhase.FLASHCARDS_COMPLETE);
          } else {
              setFlashcardIndex(prev => prev + 1);
          }
      }, 200); 
  };

  const handleFlashcardReview = () => {
      const currentCard = flashcardQueue[flashcardIndex];
      if (!currentCard) return;

      // Add copy to end of queue
      setFlashcardQueue(prev => [...prev, currentCard]);
      
      setIsFlipped(false);
      setTimeout(() => {
          setFlashcardIndex(prev => prev + 1);
      }, 200);
  };

  // --- Canvas Logic ---
  
  useEffect(() => {
    if (phase === ReviewPhase.QUIZ && queue[currentIndex]?.type === QuestionType.DRAW) {
        setTimeout(drawCanvas, 50);
    }
  }, [phase, currentIndex, currentPath, shapes, showDrawAnswer]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    if (Math.abs(canvas.width - rect.width * dpr) > 1 || Math.abs(canvas.height - rect.height * dpr) > 1) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const size = Math.min(rect.width, rect.height);

    if (showDrawAnswer) {
        const k = queue[currentIndex].kanji;
        ctx.font = `${size * 0.6}px "Noto Sans JP"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e7e5e4'; 
        // Move up slightly for optical centering (-5% of size)
        ctx.fillText(k.character, rect.width / 2, (rect.height / 2) - (size * 0.05));
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2b4f7b';
    ctx.lineWidth = 4;

    [...shapes, { path: currentPath }].forEach(shape => {
        if (shape.path.length > 0) {
            ctx.beginPath();
            shape.path.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    });
  };

  const getPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (showDrawAnswer) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentPath([getPoint(e)]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setCurrentPath(prev => [...prev, getPoint(e)]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
    if (currentPath.length > 0) {
        setShapes(prev => [...prev, { path: currentPath }]);
        setCurrentPath([]);
    }
  };

  // --- Render ---

  const completedCount = useMemo(() => getCompletedKanji().length, [phase]);

  return (
    <Layout headerTitle="Review">
       
       {/* MENU PHASE */}
       {phase === ReviewPhase.MENU && (
           <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in space-y-4">
               <button 
                 onClick={() => setPhase(ReviewPhase.DAILY_START)}
                 className="w-full max-w-xs bg-gradient-to-br from-[#749f76] to-[#5d8d62] p-6 rounded-2xl shadow-lg shadow-[#5d8d62]/20 border border-white/20 flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
               >
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white/30 transition-colors">
                        <Calendar size={24} className="text-white" />
                   </div>
                   <div className="text-left flex-grow relative z-10">
                       <h3 className="text-lg font-bold text-white drop-shadow-sm">Daily Review</h3>
                       <p className="text-xs text-white/90 font-medium">Spaced repetition</p>
                   </div>
                   <div className="text-white/60 group-hover:text-white transition-colors relative z-10">
                        <ChevronRightIcon size={20} />
                   </div>
               </button>

               <button 
                 onClick={() => {
                     const allCompleted = new Set(completedKanji.map(k => k.character));
                     setSelectedForFlashcards(allCompleted);
                     setPhase(ReviewPhase.FLASHCARDS_SELECT);
                 }}
                 className="w-full max-w-xs bg-gradient-to-br from-[#749f76] to-[#5d8d62] p-6 rounded-2xl shadow-lg shadow-[#5d8d62]/20 border border-white/20 flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
               >
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                   <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white/30 transition-colors">
                        <Layers size={24} className="text-white" />
                   </div>
                   <div className="text-left flex-grow relative z-10">
                       <h3 className="text-lg font-bold text-white drop-shadow-sm">Flashcards</h3>
                       <p className="text-xs text-white/90 font-medium">Free study mode</p>
                   </div>
                   <div className="text-white/60 group-hover:text-white transition-colors relative z-10">
                        <ChevronRightIcon size={20} />
                   </div>
               </button>
           </div>
       )}

       {/* FLASHCARDS SELECT MODAL */}
       {phase === ReviewPhase.FLASHCARDS_SELECT && (
           <div className="absolute inset-0 z-50 bg-stone-100 flex flex-col animate-fade-in">
               <div className="bg-white border-b border-stone-200 px-4 py-4 flex justify-between items-center shadow-sm">
                   <button onClick={() => setPhase(ReviewPhase.MENU)} className="text-stone-500 flex items-center gap-1 hover:text-ink transition-colors">
                       <ChevronLeft size={20} /> <span className="text-sm font-bold">Back</span>
                   </button>
                   <h2 className="text-lg font-bold">Select Flashcards</h2>
                   <button 
                        onClick={startFlashcards}
                        disabled={selectedForFlashcards.size === 0}
                        className={`text-sm font-bold px-4 py-2 rounded-full transition-all ${
                            selectedForFlashcards.size > 0 ? 'bg-indigo-jp text-white shadow-md' : 'bg-stone-200 text-stone-400'
                        }`}
                   >
                       Start ({selectedForFlashcards.size})
                   </button>
               </div>
               
               <div className="flex-grow overflow-y-auto p-4 pb-24 space-y-6">
                   {completedKanji.length === 0 && (
                       <p className="text-center text-stone-400 mt-20">No kanji learned yet.</p>
                   )}

                   {genkiKanjiData.map((lesson) => {
                       const lessonKanji = lesson.kanji.filter(k => 
                           completedKanji.some(ck => ck.character === k.character)
                       );

                       if (lessonKanji.length === 0) return null;

                       const isAllSelected = lessonKanji.every(k => selectedForFlashcards.has(k.character));

                       return (
                           <div key={lesson.lesson} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                               <div 
                                    onClick={() => toggleLessonSelection(lessonKanji)}
                                    className="bg-stone-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-stone-100 transition-colors"
                                >
                                   <span className="font-bold text-stone-600 text-sm">Lesson {lesson.lesson}: {lesson.title}</span>
                                   {isAllSelected ? <CheckSquare size={20} className="text-indigo-jp" /> : <Square size={20} className="text-stone-400" />}
                               </div>
                               <div className="p-4 grid grid-cols-5 sm:grid-cols-7 gap-2">
                                   {lessonKanji.map(k => {
                                       const isSelected = selectedForFlashcards.has(k.character);
                                       return (
                                           <button
                                               key={k.character}
                                               onClick={() => toggleFlashcardSelection(k.character)}
                                               className={`aspect-square rounded-lg border flex items-center justify-center text-xl font-serif transition-all ${
                                                   isSelected 
                                                   ? 'bg-indigo-50 border-indigo-jp text-indigo-jp shadow-inner' 
                                                   : 'bg-white border-stone-100 text-stone-300'
                                               }`}
                                           >
                                               {k.character}
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>
                       );
                   })}
               </div>
           </div>
       )}

       {/* FLASHCARDS PLAY UI */}
       {phase === ReviewPhase.FLASHCARDS_PLAY && flashcardQueue.length > 0 && currentFlashcard && (
           <div className="absolute inset-0 z-50 bg-paper flex flex-col animate-fade-in">
               {/* Header */}
               <div className="px-4 py-4 flex justify-between items-center relative shrink-0">
                   <button onClick={() => setPhase(ReviewPhase.FLASHCARDS_SELECT)} className="bg-white rounded-full shadow-sm text-stone-500 hover:bg-stone-50 transition-colors flex items-center gap-1 pl-2 pr-4 py-2">
                       <ChevronLeft size={16} /> <span className="text-xs font-bold">Back</span>
                   </button>
                   
                   <div className="text-center absolute left-1/2 -translate-x-1/2">
                       <h3 className="font-medium text-ink text-sm uppercase tracking-wide">Flashcards</h3>
                       <p className="text-stone-400 font-mono text-xs">
                           {flashcardIndex + 1} / {flashcardQueue.length}
                       </p>
                   </div>

                   <button className="p-2 bg-white rounded-full shadow-sm text-stone-400 hover:bg-stone-50 transition-colors">
                       <Info size={20} />
                   </button>
               </div>

               {/* Progress Bar */}
               <div className="px-6 mb-2 shrink-0">
                   <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                       <div 
                           className="h-full bg-wasabi transition-all duration-300"
                           style={{ width: `${((flashcardIndex + 1) / flashcardQueue.length) * 100}%` }}
                       />
                   </div>
               </div>

               {/* Combined Container for Card and Buttons to center them together */}
               <div className="flex-grow flex flex-col items-center justify-center pb-24 w-full">
                   {/* Card Container */}
                   <div className="px-6 w-full flex justify-center perspective-1000 mb-6">
                       <div 
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="relative w-full max-w-[18rem] aspect-square cursor-pointer transition-transform duration-500 transform-style-3d"
                            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', perspective: '1000px', transformStyle: 'preserve-3d' }}
                       >
                           {/* Front */}
                           <div 
                                className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-stone-100 flex flex-col items-center justify-center backface-hidden"
                                style={{ backfaceVisibility: 'hidden' }}
                           >
                               <span className="text-8xl font-serif text-indigo-jp leading-none">{currentFlashcard.character}</span>
                               <div className="mt-6 bg-sakura/30 text-pink-800 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                   Tap to reveal
                               </div>
                           </div>

                           {/* Back */}
                           <div 
                                className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-wasabi/30 flex flex-col items-center justify-center text-center p-6 backface-hidden"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                           >
                               <div className="mb-3 opacity-20">
                                   <span className="text-6xl font-serif text-stone-400">{currentFlashcard.character}</span>
                               </div>
                               <h3 className="text-xl font-bold text-ink mb-2 capitalize">{currentFlashcard.meaning}</h3>
                               <div className="w-10 h-1 bg-wasabi/30 rounded-full mb-3 mx-auto" />
                               <div className="space-y-0.5">
                                   <p className="text-lg text-stone-600 font-medium">{currentFlashcard.hiragana}</p>
                                   <p className="text-[10px] text-stone-400 uppercase tracking-wider">{currentFlashcard.romaji}</p>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Controls */}
                   <div className="px-6 w-full max-w-sm flex gap-4">
                       {/* Review Button */}
                       <button 
                            onClick={handleFlashcardReview}
                            className="flex-1 bg-white border-2 border-red-100 text-red-500 py-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-red-50 active:scale-95 transition-all shadow-sm"
                       >
                           <X size={20} />
                           <span className="text-[10px] uppercase tracking-wider">Review</span>
                       </button>
                       
                       {/* Mark Learned Button */}
                       <button 
                            onClick={handleFlashcardLearned}
                            className="flex-1 bg-gradient-to-br from-[#749f76] to-[#5d8d62] text-white py-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:shadow-lg hover:shadow-[#5d8d62]/30 active:scale-95 transition-all shadow-md"
                       >
                           <Check size={20} />
                           <span className="text-[10px] uppercase tracking-wider">Mark Learned</span>
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* FLASHCARDS COMPLETE */}
       {phase === ReviewPhase.FLASHCARDS_COMPLETE && (
           <div className="absolute inset-0 z-50 bg-paper flex flex-col items-center justify-center animate-fade-in px-6 text-center">
               <div className="w-24 h-24 rounded-full bg-wasabi/20 flex items-center justify-center mb-6">
                   <Layers size={48} className="text-wasabi" />
               </div>
               <h2 className="text-3xl font-bold text-ink mb-2">Deck Complete!</h2>
               <p className="text-stone-500 mb-8">
                   You have reviewed all {flashcardQueue.length} cards in this deck.
               </p>
               <button 
                   onClick={() => setPhase(ReviewPhase.FLASHCARDS_SELECT)}
                   className="bg-ink text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-stone-800 transition-all"
               >
                   Back to Selection
               </button>
           </div>
       )}
        
       {/* DAILY START PHASE */}
       {phase === ReviewPhase.DAILY_START && (
           <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fade-in relative">
             <button 
                onClick={() => setPhase(ReviewPhase.MENU)}
                className="absolute top-0 left-0 p-2 text-stone-400 hover:text-ink flex items-center gap-1 text-sm transition-colors"
             >
                 <ChevronLeft size={16} /> Back
             </button>

             <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6 border border-red-100">
               <RefreshCcw size={40} className="text-red-800 opacity-50" />
             </div>
             <h2 className="text-2xl font-bold text-ink mb-2">Daily Review</h2>
             <p className="text-stone-500 max-w-xs mb-8">
                {completedCount > 0 
                    ? `You have ${completedCount} kanji in your garden ready for review.` 
                    : "Complete lessons in the Learn tab to start reviewing."}
             </p>
             
             <button 
                onClick={startSession}
                disabled={completedCount === 0}
                className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${
                    completedCount > 0 
                    ? 'bg-ink text-white hover:bg-stone-800 hover:scale-105' 
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
             >
                Start Session
             </button>
          </div>
       )}

       {/* QUIZ PHASE */}
       {phase === ReviewPhase.QUIZ && queue[currentIndex] && (
           <div className="flex flex-col min-h-[75vh] animate-fade-in">
               {/* Progress Header */}
               <div className="flex justify-between items-center mb-6 text-xs font-bold text-stone-400 tracking-widest uppercase">
                   <span>Question {currentIndex + 1} / {queue.length}</span>
                   <span>{queue[currentIndex].type}</span>
               </div>

               {/* TYPE: MEANING */}
               {queue[currentIndex].type === QuestionType.MEANING && (
                   <div className="flex-grow flex flex-col">
                       <div className="flex-grow flex items-center justify-center py-10">
                           <div className="text-9xl leading-none font-serif text-ink">{queue[currentIndex].kanji.character}</div>
                       </div>
                       
                       <div className="space-y-3 pb-6">
                           {queue[currentIndex].options?.map((opt) => {
                               const isSelected = selectedOption === opt;
                               const isCorrect = opt === queue[currentIndex].kanji.meaning;
                               
                               let btnClass = "bg-white border-stone-200 text-stone-700 hover:border-stone-300";
                               
                               if (selectedOption) {
                                   if (isCorrect) btnClass = "bg-green-100 border-green-300 text-green-800";
                                   else if (isSelected) btnClass = "bg-red-50 border-red-200 text-red-700";
                                   else btnClass = "opacity-50 bg-white border-stone-100";
                               }

                               return (
                                   <button
                                       key={opt}
                                       disabled={!!selectedOption}
                                       onClick={() => {
                                           setSelectedOption(opt);
                                           setIsAnswerCorrect(isCorrect);
                                       }}
                                       className={`w-full py-4 rounded-xl border font-medium transition-all ${btnClass}`}
                                   >
                                       {opt}
                                   </button>
                               );
                           })}
                       </div>

                       {selectedOption && (
                           <button 
                               onClick={() => handleNext(!!isAnswerCorrect)}
                               className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all animate-fade-in mb-4 flex items-center justify-center gap-2 ${
                                   isAnswerCorrect ? 'bg-gradient-to-br from-[#749f76] to-[#5d8d62] text-white shadow-lg shadow-[#5d8d62]/30' : 'bg-red-500 text-white shadow-md'
                               }`}
                           >
                               {isAnswerCorrect ? 'Correct' : 'Incorrect'} <ChevronRightIcon size={18} />
                           </button>
                       )}
                   </div>
               )}

               {/* TYPE: DRAW */}
               {queue[currentIndex].type === QuestionType.DRAW && (
                   <div className="flex-grow flex flex-col">
                       <div className="text-center mb-4">
                           <span className="text-xs text-stone-400 uppercase font-bold">Draw</span>
                           <h3 className="text-2xl font-medium text-ink mt-1 capitalize">{queue[currentIndex].kanji.meaning}</h3>
                       </div>

                       <div className="relative w-full aspect-square bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden shrink-0 mb-6">
                           <div className="w-full h-full relative" ref={containerRef}>
                                <canvas
                                    ref={canvasRef}
                                    className="touch-none cursor-crosshair w-full h-full"
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                />
                           </div>
                           <button 
                                onClick={() => { setShapes([]); setCurrentPath([]); }}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-400 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                       </div>

                       <div className="mt-auto">
                           {!showDrawAnswer ? (
                               <button 
                                    onClick={() => setShowDrawAnswer(true)}
                                    className="w-full bg-white border border-stone-300 text-stone-600 py-3 rounded-xl font-medium hover:bg-stone-50 flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} /> Reveal Answer
                                </button>
                           ) : (
                               <div className="grid grid-cols-2 gap-3 animate-fade-in">
                                    <button 
                                        onClick={() => handleNext(false)}
                                        className="bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-medium"
                                    >
                                        I missed it
                                    </button>
                                    <button 
                                        onClick={() => handleNext(true)}
                                        className="bg-gradient-to-br from-[#749f76] to-[#5d8d62] text-white py-3 rounded-xl font-medium shadow-lg shadow-[#5d8d62]/30 border border-transparent"
                                    >
                                        I got it
                                    </button>
                                </div>
                           )}
                       </div>
                   </div>
               )}
           </div>
       )}

       {/* SUMMARY PHASE */}
       {phase === ReviewPhase.SUMMARY && (
           <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fade-in">
               <div className="w-24 h-24 rounded-full bg-wasabi/20 flex items-center justify-center mb-6">
                   <Award size={48} className="text-wasabi" />
               </div>
               <h2 className="text-3xl font-bold text-ink mb-2">Session Complete</h2>
               <p className="text-stone-500 mb-8">
                   You reviewed <span className="font-bold text-ink">{results.total}</span> kanji.
               </p>
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 w-full max-w-xs mb-8">
                   <div className="text-sm text-stone-400 font-bold uppercase tracking-widest mb-1">Accuracy</div>
                   <div className="text-4xl font-bold text-ink">
                       {Math.round((results.correct / results.total) * 100)}%
                   </div>
               </div>

               <button 
                   onClick={() => setPhase(ReviewPhase.MENU)}
                   className="bg-ink text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-stone-800 transition-all"
               >
                   Back to Menu
               </button>
           </div>
       )}

    </Layout>
  );
};

export default ReviewTab;