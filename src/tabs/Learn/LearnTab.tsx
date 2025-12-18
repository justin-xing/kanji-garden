import React, { useState, useEffect, useRef, useCallback } from "react";
import Layout from "../../components/Layout";
import { genkiKanjiData } from "../../data/kanji";
import {
  generateMnemonic,
  generateKanjiVisualization,
} from "../../services/geminiService";
import {
  ChevronRight,
  Check,
  Type,
  Eraser,
  Sparkles,
  Eye,
  ArrowRight,
  Save,
  Pencil,
  SkipForward,
  ChevronLeft,
  Lock,
  Image as ImageIcon,
  Trash2,
  EyeOff,
} from "lucide-react";

// --- Types & Constants ---

const LearnView = {
  LIST: "LIST",
  SESSION: "SESSION",
};

type LearnViewType = (typeof LearnView)[keyof typeof LearnView];

const LearnStep = {
  SECTION_START: "SECTION_START",
  INTRO: "INTRO",
  TRACE: "TRACE",
  MNEMONIC: "MNEMONIC",
  QUIZ_MEANING: "QUIZ_MEANING",
  QUIZ_DRAW: "QUIZ_DRAW",
  COMPLETED: "COMPLETED",
};

type LearnStepType = (typeof LearnStep)[keyof typeof LearnStep];

interface UserProgress {
  lessonIndex: number;
  kanjiIndex: number;
  currentStep?: LearnStepType;
}

interface DrawnShape {
  path: { x: number; y: number }[];
  label: string;
}

// --- Helper for rendering bold text ---
const renderStyledText = (text: string) => {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-indigo-jp">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

// --- Component ---

const LearnTab: React.FC = () => {
  // --- Global State ---
  const [view, setView] = useState<LearnViewType>(LearnView.LIST);
  const [listTab, setListTab] = useState<"LEARNING" | "LEARNED">("LEARNING");

  // --- Session State ---
  const [progress, setProgress] = useState<UserProgress>({
    lessonIndex: 0,
    kanjiIndex: 0,
  });
  const [currentStep, setCurrentStep] = useState<LearnStepType>(
    LearnStep.SECTION_START
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Stored Progress (for List View) ---
  const [storedProgress, setStoredProgress] = useState<UserProgress>({
    lessonIndex: 0,
    kanjiIndex: 0,
  });

  // Mnemonic/Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [shapes, setShapes] = useState<DrawnShape[]>([]);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [tempLabel, setTempLabel] = useState("");
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Visualization State
  const [visualizationImage, setVisualizationImage] = useState<string | null>(
    null
  );
  const [generatingImage, setGeneratingImage] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // Quiz State
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);
  const [showDrawAnswer, setShowDrawAnswer] = useState(false);

  // --- Helpers ---

  const allKanjiFlat = React.useMemo(
    () => genkiKanjiData.flatMap((l) => l.kanji),
    []
  );
  const currentLesson = genkiKanjiData[progress.lessonIndex];
  const currentKanji = currentLesson?.kanji[progress.kanjiIndex];

  // Quiz Preparation
  const prepareQuizMeaning = useCallback(() => {
    if (!currentKanji) return;
    const distractors = allKanjiFlat
      .filter((k) => k.character !== currentKanji.character)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((k) => k.meaning);
    const options = [...distractors, currentKanji.meaning].sort(
      () => 0.5 - Math.random()
    );
    setQuizOptions(options);
  }, [currentKanji, allKanjiFlat]);

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem("kanji_garden_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStoredProgress(parsed);
        // We don't auto-start session anymore, user selects from list
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Restore Quiz Options
  useEffect(() => {
    if (
      view === LearnView.SESSION &&
      currentStep === LearnStep.QUIZ_MEANING &&
      quizOptions.length === 0 &&
      currentKanji
    ) {
      prepareQuizMeaning();
    }
  }, [view, currentStep, quizOptions.length, prepareQuizMeaning, currentKanji]);

  // Save progress
  const saveSession = (newProgress: UserProgress, newStep: LearnStepType) => {
    setProgress(newProgress);
    setCurrentStep(newStep);
    setStoredProgress({ ...newProgress, currentStep: newStep }); // Update local stored state for UI

    const dataToSave: UserProgress = {
      ...newProgress,
      currentStep: newStep,
    };
    localStorage.setItem("kanji_garden_progress", JSON.stringify(dataToSave));
  };

  // --- Lesson Selection ---

  const handleStartLesson = (lessonIndex: number) => {
    const isCurrent = lessonIndex === storedProgress.lessonIndex;

    if (isCurrent) {
      // Resume current lesson
      setProgress(storedProgress);
      setCurrentStep(storedProgress.currentStep || LearnStep.SECTION_START);
    } else {
      // Start/Review other lesson from beginning
      setProgress({ lessonIndex, kanjiIndex: 0 });
      setCurrentStep(LearnStep.SECTION_START);
    }

    // Reset session UI states
    setShapes([]);
    setCurrentPath([]);
    setMnemonic(null);
    setShowDrawAnswer(false);
    setSelectedOption(null);
    setIsQuizCorrect(null);
    setVisualizationImage(null);
    setGeneratingImage(false);
    setShowImage(false);

    setView(LearnView.SESSION);
  };

  const handleSkipToLesson = (lessonIndex: number) => {
    const newProgress = { lessonIndex, kanjiIndex: 0 };
    saveSession(newProgress, LearnStep.SECTION_START);
  };

  // --- Flow Control ---

  const advanceKanji = () => {
    // Reset states
    setShapes([]);
    setCurrentPath([]);
    setMnemonic(null);
    setShowDrawAnswer(false);
    setSelectedOption(null);
    setIsQuizCorrect(null);
    setIsEditing(false);
    setVisualizationImage(null);
    setGeneratingImage(false);
    setShowImage(false);

    if (!currentLesson) {
      saveSession(
        { lessonIndex: genkiKanjiData.length, kanjiIndex: 0 },
        LearnStep.COMPLETED
      );
      return;
    }

    const nextKanjiIndex = progress.kanjiIndex + 1;

    if (nextKanjiIndex < currentLesson.kanji.length) {
      // Next Kanji in same lesson
      const newProgress = { ...progress, kanjiIndex: nextKanjiIndex };
      saveSession(newProgress, LearnStep.INTRO);
    } else {
      // Finished Lesson -> Next Lesson (but stay in session or go to completion?)
      // Usually go to next lesson start
      const nextLessonIndex = progress.lessonIndex + 1;
      if (nextLessonIndex < genkiKanjiData.length) {
        const newProgress = { lessonIndex: nextLessonIndex, kanjiIndex: 0 };
        saveSession(newProgress, LearnStep.SECTION_START);
      } else {
        const newProgress = { ...progress, lessonIndex: nextLessonIndex };
        saveSession(newProgress, LearnStep.COMPLETED);
      }
    }
  };

  const handleNext = () => {
    let nextStep = currentStep;

    if (currentStep === LearnStep.MNEMONIC && currentKanji && mnemonic) {
      localStorage.setItem(
        `kanji_mnemonic_${currentKanji.character}`,
        mnemonic
      );
    }

    switch (currentStep) {
      case LearnStep.SECTION_START:
        nextStep = LearnStep.INTRO;
        break;
      case LearnStep.INTRO:
        nextStep = LearnStep.TRACE;
        break;
      case LearnStep.TRACE:
        nextStep = LearnStep.MNEMONIC;
        break;
      case LearnStep.MNEMONIC:
        prepareQuizMeaning();
        nextStep = LearnStep.QUIZ_MEANING;
        break;
      case LearnStep.QUIZ_MEANING:
        nextStep = LearnStep.QUIZ_DRAW;
        break;
      case LearnStep.QUIZ_DRAW:
        advanceKanji();
        return;
    }

    setShapes([]);
    setCurrentPath([]);
    setMnemonic(null);
    setShowDrawAnswer(false);
    setSelectedOption(null);
    setIsQuizCorrect(null);
    setIsEditing(false);
    setVisualizationImage(null);
    setGeneratingImage(false);
    setShowImage(false);

    saveSession(progress, nextStep);
  };

  // --- Canvas Logic ---
  useEffect(() => {
    if (
      view === LearnView.SESSION &&
      (currentStep === LearnStep.TRACE ||
        currentStep === LearnStep.MNEMONIC ||
        currentStep === LearnStep.QUIZ_DRAW)
    ) {
      setTimeout(drawCanvas, 50);
    }
  }, [
    view,
    currentStep,
    currentPath,
    shapes,
    showDrawAnswer,
    currentKanji,
    visualizationImage,
    showImage,
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !currentKanji) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    if (
      Math.abs(canvas.width - rect.width * dpr) > 1 ||
      Math.abs(canvas.height - rect.height * dpr) > 1
    ) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const size = Math.min(rect.width, rect.height);

    if (
      currentStep === LearnStep.TRACE ||
      currentStep === LearnStep.MNEMONIC ||
      (currentStep === LearnStep.QUIZ_DRAW && showDrawAnswer)
    ) {
      // Only draw character text if we aren't showing a visualization image
      const shouldDrawChar = !(
        currentStep === LearnStep.MNEMONIC &&
        visualizationImage &&
        showImage
      );

      if (shouldDrawChar) {
        ctx.font = `${size * 0.7}px "Noto Sans JP"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e7e5e4";
        // Move up slightly for optical centering (-5% of size)
        ctx.fillText(
          currentKanji.character,
          rect.width / 2,
          rect.height / 2 - size * 0.05
        );
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const isMnemonicMode = currentStep === LearnStep.MNEMONIC;
    shapes.forEach((shape) => {
      ctx.strokeStyle = isMnemonicMode ? "rgba(124, 154, 96, 0.6)" : "#2b4f7b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      shape.path.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      if (isMnemonicMode && shape.path.length > 0) {
        const start = shape.path[0];
        ctx.font = 'bold 14px "Noto Sans JP"';
        ctx.fillStyle = "#2b4f7b";
        ctx.fillText(shape.label, start.x, start.y - 10);
      }
    });

    if (currentPath.length > 0) {
      ctx.strokeStyle = "#2b4f7b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      currentPath.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  };

  const getPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (showLabelInput) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setCurrentPath([getPoint(e)]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setCurrentPath((prev) => [...prev, getPoint(e)]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
    if (currentStep === LearnStep.MNEMONIC) {
      if (currentPath.length > 5) setShowLabelInput(true);
      else setCurrentPath([]);
    } else {
      if (currentPath.length > 2)
        setShapes((prev) => [...prev, { path: currentPath, label: "" }]);
      setCurrentPath([]);
    }
  };

  const saveLabel = () => {
    if (tempLabel.trim()) {
      setShapes((prev) => [
        ...prev,
        { path: currentPath, label: tempLabel.trim() },
      ]);
      setCurrentPath([]);
      setTempLabel("");
      setShowLabelInput(false);
    } else {
      setCurrentPath([]);
      setShowLabelInput(false);
    }
  };

  const handleGenerateMnemonic = async () => {
    if (!currentKanji) return;
    setLoadingAI(true);
    const labels = shapes.map((s) => s.label);
    const result = await generateMnemonic(
      currentKanji.character,
      currentKanji.meaning,
      labels,
      currentKanji.mnemonic
    );
    setMnemonic(result);
    localStorage.setItem(`kanji_mnemonic_${currentKanji.character}`, result);
    setIsEditing(false);
    setLoadingAI(false);
  };

  const handleGenerateImage = async () => {
    if (!currentKanji || !mnemonic) return;
    setGeneratingImage(true);

    // Explicitly redraw the canvas with the Kanji character to ensure the AI gets the correct reference.
    if (canvasRef.current && containerRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw Kanji
        ctx.font = `${size * 0.7}px "Noto Sans JP"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e7e5e4";
        ctx.fillText(
          currentKanji.character,
          rect.width / 2,
          rect.height / 2 - size * 0.05
        );

        // Redraw shapes
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        shapes.forEach((shape) => {
          ctx.strokeStyle = "rgba(124, 154, 96, 0.6)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          shape.path.forEach((point, i) => {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          if (shape.path.length > 0) {
            const start = shape.path[0];
            ctx.font = 'bold 14px "Noto Sans JP"';
            ctx.fillStyle = "#2b4f7b";
            ctx.fillText(shape.label, start.x, start.y - 10);
          }
        });
      }
    }

    try {
      let referenceImageUrl = undefined;
      if (canvasRef.current) {
        referenceImageUrl = canvasRef.current.toDataURL("image/png");
      }

      const base64Image = await generateKanjiVisualization(
        mnemonic,
        referenceImageUrl
      );

      if (base64Image) {
        const dataUrl = `data:image/png;base64,${base64Image}`;
        setVisualizationImage(dataUrl);
        setShowImage(true);
        try {
          localStorage.setItem(
            `kanji_image_${currentKanji.character}`,
            dataUrl
          );
        } catch (e) {
          console.warn("Storage quota exceeded", e);
        }
      }
    } catch (e) {
      console.error("Failed image gen", e);
    }
    setGeneratingImage(false);
  };

  const handleClearImage = () => {
    setVisualizationImage(null);
    if (currentKanji)
      localStorage.removeItem(`kanji_image_${currentKanji.character}`);
  };

  const handleSaveEdit = () => {
    if (currentKanji && mnemonic) {
      localStorage.setItem(
        `kanji_mnemonic_${currentKanji.character}`,
        mnemonic
      );
      setIsEditing(false);
    }
  };

  const checkMeaning = (selected: string) => {
    if (!currentKanji) return;
    setSelectedOption(selected);
    setIsQuizCorrect(selected === currentKanji.meaning);
  };

  if (!isInitialized) return null;

  // --- LIST VIEW ---
  if (view === LearnView.LIST) {
    const currentLessonIdx = storedProgress.lessonIndex;

    return (
      <Layout headerTitle="Lessons">
        <div className="flex bg-white rounded-full p-1 mb-6 border border-stone-200 shadow-sm">
          <button
            onClick={() => setListTab("LEARNING")}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              listTab === "LEARNING"
                ? "bg-wasabi text-white shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Learning
          </button>
          <button
            onClick={() => setListTab("LEARNED")}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
              listTab === "LEARNED"
                ? "bg-wasabi text-white shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Learned
          </button>
        </div>

        <div className="space-y-6">
          {genkiKanjiData.map((lesson, index) => {
            const isCompleted = index < currentLessonIdx;
            const isCurrent = index === currentLessonIdx;
            const isLocked = index > currentLessonIdx;

            // Filter based on tab
            if (listTab === "LEARNED" && !isCompleted) return null;
            if (listTab === "LEARNING" && isCompleted) return null;

            // Calculate progress for card
            let kanjiDone = 0;
            if (isCompleted) kanjiDone = lesson.kanji.length;
            else if (isCurrent) kanjiDone = storedProgress.kanjiIndex;

            const progressPct = (kanjiDone / lesson.kanji.length) * 100;

            return (
              <div
                key={lesson.lesson}
                onClick={() => !isLocked && handleStartLesson(index)}
                className={`w-full bg-white p-5 rounded-2xl shadow-sm border border-stone-100 text-left transition-all relative overflow-hidden group ${
                  isLocked
                    ? "bg-stone-50 cursor-default"
                    : "hover:shadow-md hover:border-stone-200 active:scale-[0.99] cursor-pointer"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-base text-ink">
                      Lesson {lesson.lesson}: {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-mono ${
                          isLocked ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        {isCompleted
                          ? "Completed"
                          : isCurrent
                          ? "In Progress"
                          : "Locked"}
                      </span>
                    </div>
                  </div>
                  <div className="text-stone-300">
                    {isCompleted ? (
                      <Check className="text-wasabi" size={20} />
                    ) : isLocked ? (
                      <Lock size={18} className="text-stone-300" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-stone-200 group-hover:border-wasabi transition-colors" />
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between text-xs text-stone-400 font-mono mb-2`}
                >
                  <span>Progress</span>
                  <span>
                    {kanjiDone}/{lesson.kanji.length} kanji
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-wasabi"
                        : isLocked
                        ? "bg-stone-200"
                        : "bg-wasabi/80"
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {isCurrent && (
                  <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Skip this lesson means jumping to the next one
                        handleSkipToLesson(index + 1);
                      }}
                      className="text-xs font-bold text-stone-400 hover:text-wasabi hover:bg-white border border-transparent hover:border-stone-200 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
                    >
                      Skip Lesson <SkipForward size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {listTab === "LEARNED" && storedProgress.lessonIndex === 0 && (
            <div className="text-center py-10 text-stone-400 text-sm">
              <p>You haven't completed any lessons yet.</p>
              <button
                onClick={() => setListTab("LEARNING")}
                className="text-wasabi font-bold mt-2 underline"
              >
                Go to Learning
              </button>
            </div>
          )}

          {listTab === "LEARNING" &&
            storedProgress.lessonIndex >= genkiKanjiData.length && (
              <div className="text-center py-10 text-stone-400 text-sm">
                <p>You have completed all available lessons!</p>
                <button
                  onClick={() => setListTab("LEARNED")}
                  className="text-wasabi font-bold mt-2 underline"
                >
                  Review Learned
                </button>
              </div>
            )}
        </div>
      </Layout>
    );
  }

  // --- SESSION VIEW (Existing Logic) ---

  if (currentStep === LearnStep.COMPLETED) {
    return (
      <Layout headerTitle="Learn">
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
          <div className="w-24 h-24 rounded-full bg-wasabi/20 flex items-center justify-center mb-6">
            <Check size={48} className="text-wasabi" />
          </div>
          <h2 className="text-2xl font-serif text-ink mb-2">
            Garden Complete!
          </h2>
          <p className="text-stone-500 mb-8">You have finished this section.</p>
          <button
            onClick={() => setView(LearnView.LIST)}
            className="bg-ink text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-stone-800"
          >
            Back to Lessons
          </button>
        </div>
      </Layout>
    );
  }

  const progressPercent =
    ((progress.lessonIndex * 15 + progress.kanjiIndex) /
      (genkiKanjiData.length * 15)) *
    100;

  return (
    <Layout isScreenFit>
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-stone-200 z-50">
        <div
          className="h-full bg-wasabi transition-all duration-500"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      <div className="flex flex-col h-full pt-4 relative overflow-hidden">
        <button
          onClick={() => setView(LearnView.LIST)}
          className="absolute top-2 left-2 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-full text-stone-500 hover:text-ink flex items-center gap-1 text-xs font-bold transition-colors z-40 border border-stone-200/50 shadow-sm"
        >
          <ChevronLeft size={14} /> LESSONS
        </button>

        {/* SECTION START VIEW */}
        {currentStep === LearnStep.SECTION_START && currentLesson && (
          <div className="flex flex-col items-center justify-center flex-grow text-center animate-fade-in space-y-8 pt-10">
            <div className="space-y-2">
              <span className="text-wasabi font-bold uppercase tracking-widest text-xs">
                New Section
              </span>
              <h2 className="text-3xl font-serif text-ink">
                Lesson {currentLesson.lesson}
              </h2>
              <p className="text-xl text-stone-600">{currentLesson.title}</p>
            </div>
            <div className="w-16 h-1 bg-wasabi/30 rounded-full" />
            <p className="text-stone-400 max-w-xs text-sm">
              {currentLesson.kanji.length} characters to learn.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={handleNext}
                className="w-full bg-ink text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
              >
                Start Lesson <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* INTRO VIEW */}
        {currentStep === LearnStep.INTRO && currentKanji && (
          <div className="flex flex-col h-full animate-fade-in relative">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 pb-12">
              <div className="text-[120px] leading-none font-serif text-ink opacity-90 filter drop-shadow-sm">
                {currentKanji.character}
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-stone-800 capitalize">
                  {currentKanji.meaning}
                </h3>
                <p className="text-stone-500 font-mono text-xl">
                  {currentKanji.hiragana}
                </p>
                <p className="text-stone-400 text-sm tracking-widest uppercase">
                  {currentKanji.romaji}
                </p>
              </div>
            </div>

            <div className="shrink-0 pb-8 w-full max-w-sm mx-auto px-6">
              <button
                onClick={handleNext}
                className="w-full bg-wasabi text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-wasabi/90 transition-all text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98]"
              >
                Let's Write
              </button>
            </div>
          </div>
        )}

        {/* CANVAS BASED VIEWS */}
        {(currentStep === LearnStep.TRACE ||
          currentStep === LearnStep.MNEMONIC ||
          currentStep === LearnStep.QUIZ_DRAW) &&
          currentKanji && (
            <div className="flex flex-col h-full animate-fade-in px-1">
              {/* Centered Top Section */}
              <div className="flex-1 flex flex-col justify-center min-h-0 w-full max-w-md mx-auto pt-12 pb-2">
                <div className="flex justify-between items-end mb-4 px-2 shrink-0">
                  <div>
                    <h3 className="text-3xl font-serif leading-none text-ink">
                      {currentKanji.character}
                    </h3>
                    <span className="text-sm font-medium text-stone-500">
                      {currentKanji.meaning}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-wasabi uppercase tracking-wider bg-wasabi/10 px-2 py-1 rounded-lg">
                    {currentStep === LearnStep.TRACE && "Trace"}
                    {currentStep === LearnStep.MNEMONIC && "Creative"}
                    {currentStep === LearnStep.QUIZ_DRAW && "Recall"}
                  </div>
                </div>

                {/* Canvas Container */}
                <div className="relative w-full aspect-square max-h-[40vh] bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden shrink-0 mx-auto">
                  {/* Background Image */}
                  {currentStep === LearnStep.MNEMONIC &&
                    visualizationImage &&
                    showImage && (
                      <div className="absolute inset-0 z-0 pointer-events-none animate-fade-in">
                        <img
                          src={visualizationImage}
                          alt="Mnemonic visualization"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                  {/* Loading Overlay */}
                  {currentStep === LearnStep.MNEMONIC && generatingImage && (
                    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
                      <div className="w-10 h-10 border-4 border-wasabi/30 border-t-wasabi rounded-full animate-spin" />
                      <p className="text-sm font-bold text-wasabi animate-pulse">
                        Painting...
                      </p>
                    </div>
                  )}

                  {currentStep === LearnStep.MNEMONIC && (
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] text-stone-500 shadow-sm pointer-events-none flex items-center gap-1">
                      <Type size={10} /> Draw to label
                    </div>
                  )}
                  <div
                    className="w-full h-full relative z-10"
                    ref={containerRef}
                  >
                    <canvas
                      ref={canvasRef}
                      className="touch-none cursor-crosshair w-full h-full"
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                    />
                    {showLabelInput && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/10 backdrop-blur-[1px]">
                        <div className="bg-white p-4 rounded-xl shadow-lg w-3/4 animate-fade-in">
                          <h4 className="text-xs font-bold text-stone-700 mb-2">
                            Label this part
                          </h4>
                          <input
                            autoFocus
                            type="text"
                            value={tempLabel}
                            onChange={(e) => setTempLabel(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveLabel()}
                            className="w-full border-b border-wasabi outline-none py-1 text-ink mb-3 bg-transparent"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowLabelInput(false);
                                setCurrentPath([]);
                              }}
                              className="text-xs text-stone-400"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveLabel}
                              className="bg-wasabi text-white text-xs px-3 py-1.5 rounded-full"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toolbar */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button
                      onClick={() => {
                        setShapes([]);
                        setCurrentPath([]);
                      }}
                      className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-400 hover:text-red-500"
                      title="Clear drawings"
                    >
                      <Eraser size={18} />
                    </button>

                    {currentStep === LearnStep.MNEMONIC &&
                      visualizationImage && (
                        <>
                          <button
                            onClick={() => setShowImage(!showImage)}
                            className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-500 hover:text-indigo-jp transition-colors"
                            title={showImage ? "Hide Image" : "Show Image"}
                          >
                            {showImage ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                          <button
                            onClick={handleClearImage}
                            className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-500 hover:text-red-500 transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="shrink-0 py-4 w-full max-w-md mx-auto">
                {currentStep === LearnStep.TRACE && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-indigo-jp text-white py-4 rounded-2xl font-bold shadow-md hover:bg-indigo-jp/90 active:scale-[0.98] transition-all text-lg"
                  >
                    Done
                  </button>
                )}

                {currentStep === LearnStep.MNEMONIC && (
                  <div className="flex flex-col gap-3">
                    {!mnemonic ? (
                      <>
                        <div className="p-4 bg-stone-50 rounded-2xl text-center">
                          <p className="text-sm text-stone-500">
                            Draw on the kanji to identify parts, then generate a
                            story.
                          </p>
                        </div>
                        <button
                          onClick={handleGenerateMnemonic}
                          disabled={loadingAI}
                          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-md transition-all text-lg ${
                            loadingAI
                              ? "bg-stone-200 text-stone-400"
                              : "bg-wasabi text-white hover:bg-wasabi/90"
                          }`}
                        >
                          {loadingAI ? (
                            "Generating..."
                          ) : (
                            <>
                              <Sparkles size={20} /> Generate Story
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="animate-fade-in flex flex-col gap-3">
                        {/* Fixed height text area for mnemonic */}
                        <div className="bg-sakura/30 p-4 rounded-2xl border border-sakura relative group h-32 flex flex-col">
                          <div className="flex justify-between items-start mb-2 shrink-0">
                            <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                              Mnemonic
                            </h4>
                            <div className="flex gap-1">
                              {isEditing ? (
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1 bg-white/50 hover:bg-white rounded-full text-wasabi transition-colors"
                                  title="Save changes"
                                >
                                  {" "}
                                  <Save size={14} />{" "}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsEditing(true)}
                                  className="p-1 hover:bg-white/50 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                                  title="Edit text"
                                >
                                  {" "}
                                  <Pencil size={14} />{" "}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="overflow-y-auto flex-1 custom-scrollbar pr-1">
                            {isEditing ? (
                              <textarea
                                value={mnemonic}
                                onChange={(e) => setMnemonic(e.target.value)}
                                className="w-full h-full bg-white/80 border border-pink-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-300/50 resize-none"
                                placeholder="Write your mnemonic..."
                              />
                            ) : (
                              <p className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
                                {renderStyledText(mnemonic)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleGenerateImage}
                            disabled={generatingImage}
                            className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm border-2 ${
                              generatingImage
                                ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed"
                                : "bg-white border-stone-100 text-indigo-jp hover:border-indigo-jp hover:bg-indigo-50"
                            }`}
                          >
                            <ImageIcon size={18} />
                            {visualizationImage ? "Redraw" : "Visualize"}
                          </button>

                          <button
                            onClick={handleNext}
                            className="flex-[1.5] bg-ink text-white py-3.5 rounded-2xl font-bold shadow-md hover:bg-stone-800 text-sm flex items-center justify-center gap-2"
                          >
                            Save <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === LearnStep.QUIZ_DRAW && (
                  <div className="space-y-3">
                    {!showDrawAnswer ? (
                      <button
                        onClick={() => setShowDrawAnswer(true)}
                        className="w-full bg-white border-2 border-stone-200 text-stone-600 py-4 rounded-2xl font-bold hover:bg-stone-50 flex items-center justify-center gap-2 text-lg"
                      >
                        <Eye size={20} /> Reveal Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="w-full bg-wasabi text-white py-4 rounded-2xl font-bold shadow-md hover:bg-wasabi/90 transition-all animate-fade-in flex items-center justify-center gap-2 text-lg"
                      >
                        Continue <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* QUIZ MEANING VIEW */}
        {currentStep === LearnStep.QUIZ_MEANING && currentKanji && (
          <div className="flex flex-col flex-grow animate-fade-in">
            <div className="flex-grow flex flex-col items-center justify-center space-y-8">
              <span className="text-wasabi font-bold text-xs uppercase tracking-widest bg-wasabi/10 px-3 py-1 rounded-full">
                Quiz
              </span>
              <div className="text-8xl font-serif text-ink">
                {currentKanji.character}
              </div>
              <p className="text-stone-400">What does this Kanji mean?</p>
            </div>

            <div className="grid grid-cols-1 gap-3 pb-6">
              {quizOptions.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentKanji.meaning;
                let style =
                  "bg-white border-stone-200 text-stone-700 hover:border-stone-300";
                if (selectedOption) {
                  if (isCorrect)
                    style = "bg-green-100 border-green-300 text-green-800";
                  else if (isSelected && !isCorrect)
                    style = "bg-red-50 border-red-200 text-red-700";
                  else style = "opacity-50 bg-white border-stone-100";
                }
                return (
                  <button
                    key={idx}
                    disabled={!!selectedOption}
                    onClick={() => checkMeaning(option)}
                    className={`w-full py-4 rounded-xl border font-medium transition-all ${style}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <button
                onClick={handleNext}
                className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all animate-fade-in mb-4 ${
                  isQuizCorrect
                    ? "bg-wasabi text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {isQuizCorrect ? "Correct! Continue" : "Continue"}{" "}
                <ChevronRight className="inline ml-1" size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearnTab;
