import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Eraser,
  Type,
  Save,
  Pencil,
  Image as ImageIcon,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { KanjiEntry } from "../data/kanji";
import {
  generateMnemonic,
  generateKanjiVisualization,
} from "../services/geminiService";

interface KanjiDetailModalProps {
  kanji: KanjiEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DrawnShape {
  path: { x: number; y: number }[];
  label: string;
}

// Helper for rendering bold text
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

const KanjiDetailModal: React.FC<KanjiDetailModalProps> = ({
  kanji,
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [shapes, setShapes] = useState<DrawnShape[]>([]);

  // Label input state
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [tempLabel, setTempLabel] = useState("");

  // AI state
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Visualization State
  const [visualizationImage, setVisualizationImage] = useState<string | null>(
    null
  );
  const [generatingImage, setGeneratingImage] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && kanji) {
      // Reset state on open
      setShapes([]);
      setCurrentPath([]);
      setTempLabel("");
      setShowLabelInput(false);
      setIsEditing(false);

      // Load saved mnemonic from local storage
      const saved = localStorage.getItem(`kanji_mnemonic_${kanji.character}`);
      setMnemonic(saved);

      // Load saved image
      const savedImage = localStorage.getItem(`kanji_image_${kanji.character}`);
      setVisualizationImage(savedImage);
      setShowImage(false);

      // Initialize canvas after a brief delay to ensure DOM is ready
      setTimeout(drawCanvas, 100);
    }
  }, [isOpen, kanji]);

  // Redraw canvas whenever drawing state changes or visualization state changes
  useEffect(() => {
    drawCanvas();
  }, [currentPath, shapes, kanji, visualizationImage, showImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !kanji) return;

    // Handle high DPI displays and resizing
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    // Check if canvas needs resizing (with a small epsilon to avoid float jitter)
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

    // 1. Draw Kanji Background (Gray Underlay)
    // Only draw reference kanji if image is NOT showing, so the generated image is fully visible
    if (!visualizationImage || !showImage) {
      const size = Math.min(rect.width, rect.height);
      ctx.font = `${size * 0.7}px "Noto Sans JP"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#e7e5e4"; // stone-200
      // Move up slightly for optical centering (-5% of size)
      ctx.fillText(
        kanji.character,
        rect.width / 2,
        rect.height / 2 - size * 0.05
      );
    }

    // 2. Draw Saved Shapes
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    shapes.forEach((shape) => {
      ctx.strokeStyle = "rgba(124, 154, 96, 0.6)"; // Wasabi with opacity
      ctx.lineWidth = 4;
      ctx.beginPath();
      shape.path.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Draw label text
      if (shape.path.length > 0) {
        const start = shape.path[0];
        ctx.font = 'bold 14px "Noto Sans JP"';
        ctx.fillStyle = "#2b4f7b"; // indigo-jp
        ctx.fillText(shape.label, start.x, start.y - 10);
      }
    });

    // 3. Draw Current Path
    if (currentPath.length > 0) {
      ctx.strokeStyle = "#2b4f7b"; // Indigo-jp
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
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (showLabelInput) return; // Prevent drawing while input is open
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

    // If the path is significant enough, prompt for label
    if (currentPath.length > 5) {
      setShowLabelInput(true);
    } else {
      setCurrentPath([]); // Discard accidental dots
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
      handleCancelLabel();
    }
  };

  const handleCancelLabel = () => {
    setCurrentPath([]);
    setShowLabelInput(false);
    setTempLabel("");
  };

  const handleGenerateMnemonic = async () => {
    if (!kanji) return;
    setLoading(true);
    const labels = shapes.map((s) => s.label);
    const result = await generateMnemonic(
      kanji.character,
      kanji.meaning,
      labels,
      kanji.mnemonic
    );
    setMnemonic(result);
    localStorage.setItem(`kanji_mnemonic_${kanji.character}`, result);
    setIsEditing(false);
    setLoading(false);
  };

  const handleGenerateImage = async () => {
    if (!kanji || !mnemonic) return;
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
          kanji.character,
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
      // Capture the canvas as a reference image
      let referenceImageUrl = undefined;
      if (canvasRef.current) {
        referenceImageUrl = canvasRef.current.toDataURL("image/png");
      }

      const base64Image = await generateKanjiVisualization(
        kanji.character,
        mnemonic,
        referenceImageUrl
      );

      if (base64Image) {
        const dataUrl = `data:image/png;base64,${base64Image}`;
        setVisualizationImage(dataUrl);
        try {
          localStorage.setItem(`kanji_image_${kanji.character}`, dataUrl);
        } catch (e) {
          console.warn(
            "Could not save image to localStorage (likely quota exceeded)",
            e
          );
        }
        setShowImage(true);
      }
    } catch (e) {
      console.error("Failed to generate image", e);
    }
    setGeneratingImage(false);
  };

  const handleClearImage = () => {
    setVisualizationImage(null);
    if (kanji) localStorage.removeItem(`kanji_image_${kanji.character}`);
  };

  const handleSaveEdit = () => {
    if (kanji && mnemonic) {
      localStorage.setItem(`kanji_mnemonic_${kanji.character}`, mnemonic);
      setIsEditing(false);
    }
  };

  if (!isOpen || !kanji) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-paper w-full max-w-md rounded-2xl shadow-xl overflow-y-auto flex flex-col pointer-events-auto max-h-[90vh] animate-fade-in relative">
        {/* Header */}
        <div className="sticky top-0 z-50 px-6 py-4 border-b border-stone-200 flex justify-between items-start bg-white/95 backdrop-blur shrink-0">
          <div>
            <h2 className="text-3xl font-serif text-ink mb-1">
              {kanji.character}
            </h2>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-stone-800">
                {kanji.meaning}
              </span>
              <span className="text-sm text-stone-500 font-mono">
                {kanji.hiragana} • {kanji.romaji}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="relative w-full aspect-square bg-stone-50 overflow-hidden shrink-0 border-b border-stone-100 group">
          {/* Background Visualization Image */}
          {visualizationImage && showImage && (
            <div className="absolute inset-0 z-0 pointer-events-none animate-fade-in">
              <img
                src={visualizationImage}
                alt="Mnemonic visualization"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-stone-500 shadow-sm border border-stone-100 pointer-events-none flex items-center gap-1">
            <Type size={12} /> Draw to label parts
          </div>

          <div className="w-full h-full relative z-10" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="touch-none cursor-crosshair w-full h-full"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />

            {/* Label Input Popup Overlay */}
            {showLabelInput && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/10 backdrop-blur-[1px]">
                <div className="bg-white p-4 rounded-xl shadow-lg w-3/4 border border-stone-200 animate-fade-in">
                  <h4 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                    <Type size={14} /> Label this part
                  </h4>
                  <input
                    autoFocus
                    type="text"
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveLabel()}
                    placeholder="e.g. roof, tree, person..."
                    className="w-full border-b-2 border-wasabi/50 focus:border-wasabi outline-none py-1 text-base text-ink mb-3 bg-transparent"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelLabel}
                      className="text-xs text-stone-400 font-medium px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveLabel}
                      className="bg-wasabi text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-wasabi/90"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Toolbar */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button
              onClick={() => {
                setShapes([]);
                setCurrentPath([]);
              }}
              className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-500 hover:text-red-500 transition-colors"
              title="Clear Canvas"
            >
              <Eraser size={18} />
            </button>

            {visualizationImage && (
              <>
                <button
                  onClick={() => setShowImage(!showImage)}
                  className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-500 hover:text-indigo-jp transition-colors"
                  title={showImage ? "Hide Image" : "Show Image"}
                >
                  {showImage ? <EyeOff size={18} /> : <Eye size={18} />}
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

          {generatingImage && (
            <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
              <div className="w-10 h-10 border-4 border-wasabi/30 border-t-wasabi rounded-full animate-spin" />
              <p className="text-sm font-bold text-wasabi animate-pulse">
                Painting...
              </p>
            </div>
          )}
        </div>

        {/* Footer / AI Section */}
        <div className="p-6 bg-white shrink-0 pb-10 sm:pb-6">
          {!mnemonic ? (
            <button
              onClick={handleGenerateMnemonic}
              disabled={loading}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                loading
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : "bg-indigo-jp text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Mnemonic
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-sakura/30 rounded-xl p-4 border border-sakura relative group transition-colors focus-within:border-pink-400 focus-within:bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-pink-500 shrink-0" size={16} />
                    <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                      Mnemonic Story
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    {isEditing ? (
                      <button
                        onClick={handleSaveEdit}
                        className="p-1.5 bg-white/50 hover:bg-white rounded-full text-wasabi transition-colors"
                        title="Save changes"
                      >
                        <Save size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 hover:bg-white/50 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                        title="Edit text"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    className="w-full bg-white/80 border border-pink-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-300/50 min-h-[80px]"
                    placeholder="Write your mnemonic..."
                  />
                ) : (
                  <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {mnemonic && renderStyledText(mnemonic)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {shapes.length > 0 && !loading && (
                  <button
                    onClick={handleGenerateMnemonic}
                    className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Sparkles size={14} /> Refine Story
                  </button>
                )}

                <button
                  onClick={handleGenerateImage}
                  disabled={generatingImage}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm ${
                    generatingImage
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                      : "bg-white border border-stone-200 text-indigo-jp hover:border-indigo-jp hover:bg-indigo-50"
                  }`}
                >
                  <ImageIcon size={14} />
                  {visualizationImage ? "Regenerate Visual" : "Visualize Story"}
                </button>
              </div>

              {loading && (
                <div className="text-center text-xs text-stone-400 animate-pulse">
                  Updating mnemonic...
                </div>
              )}
            </div>
          )}

          {shapes.length === 0 && !mnemonic && (
            <p className="text-center text-[10px] text-stone-400 mt-3">
              Circle parts to customize, or just generate a standard story.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanjiDetailModal;
