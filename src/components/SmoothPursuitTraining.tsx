import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle2 } from "lucide-react";

interface SmoothPursuitTrainingProps {
  onComplete: (score: number) => void;
}

type PathType = "horizontal" | "vertical" | "circle" | "figure8";

const PATHS: { type: PathType; label: string; emoji: string }[] = [
  { type: "horizontal", label: "水平追踪", emoji: "↔️" },
  { type: "vertical", label: "垂直追踪", emoji: "↕️" },
  { type: "circle", label: "圆形追踪", emoji: "🔄" },
  { type: "figure8", label: "8字追踪", emoji: "∞" },
];

const DURATION_MS = 8000; // 8 seconds per exercise

export default function SmoothPursuitTraining({ onComplete }: SmoothPursuitTrainingProps) {
  const [selectedPath, setSelectedPath] = useState<PathType>("horizontal");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [cycles, setCycles] = useState(0);
  const [finished, setFinished] = useState(false);
  const animRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const calcPos = useCallback((t: number, path: PathType) => {
    const p = (t % 1);
    switch (path) {
      case "horizontal":
        return { x: 10 + 80 * Math.abs(2 * p - 1), y: 50 };
      case "vertical":
        return { x: 50, y: 10 + 80 * Math.abs(2 * p - 1) };
      case "circle":
        return {
          x: 50 + 38 * Math.cos(2 * Math.PI * p - Math.PI / 2),
          y: 50 + 38 * Math.sin(2 * Math.PI * p - Math.PI / 2),
        };
      case "figure8":
        return {
          x: 50 + 38 * Math.sin(2 * Math.PI * p),
          y: 50 + 25 * Math.sin(4 * Math.PI * p),
        };
    }
  }, []);

  const tick = useCallback((now: number) => {
    const elapsed = now - startTimeRef.current;
    const totalCycles = 3;
    const cycleDuration = DURATION_MS / totalCycles;
    const t = elapsed / cycleDuration;
    const cyclesDone = Math.floor(t);
    const prog = Math.min(elapsed / DURATION_MS, 1);

    setProgress(prog * 100);
    setCycles(Math.min(cyclesDone, totalCycles));
    setDotPos(calcPos(t, selectedPath));

    if (prog >= 1) {
      setIsRunning(false);
      setFinished(true);
      onComplete(100);
    } else {
      animRef.current = requestAnimationFrame(tick);
    }
  }, [selectedPath, calcPos, onComplete]);

  const start = () => {
    setIsRunning(true);
    setFinished(false);
    setProgress(0);
    setCycles(0);
    startTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsRunning(false);
    setFinished(false);
    setProgress(0);
    setCycles(0);
    setDotPos({ x: 50, y: 50 });
  };

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Path selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PATHS.map((p) => (
          <button
            key={p.type}
            onClick={() => { if (!isRunning) setSelectedPath(p.type); reset(); }}
            className={`rounded-2xl p-3 border-2 font-display font-bold text-sm transition-all ${
              selectedPath === p.type
                ? "border-primary bg-primary/20 scale-105 shadow-md"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">{p.emoji}</div>
            {p.label}
          </button>
        ))}
      </div>

      {/* Tracking arena */}
      <div
        ref={containerRef}
        className="relative w-full rounded-3xl overflow-hidden border-4 border-secondary/40 bg-gradient-to-br from-sky-light to-lavender-light"
        style={{ paddingBottom: "56.25%" }}
      >
        {/* Path guide */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {selectedPath === "horizontal" && <line x1="10" y1="50" x2="90" y2="50" stroke="hsl(200 80% 60%)" strokeWidth="1" strokeDasharray="3 2" />}
          {selectedPath === "vertical" && <line x1="50" y1="10" x2="50" y2="90" stroke="hsl(200 80% 60%)" strokeWidth="1" strokeDasharray="3 2" />}
          {selectedPath === "circle" && <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(200 80% 60%)" strokeWidth="1" strokeDasharray="3 2" />}
          {selectedPath === "figure8" && (
            <path d="M 50 50 C 80 20 80 80 50 50 C 20 20 20 80 50 50" fill="none" stroke="hsl(200 80% 60%)" strokeWidth="1" strokeDasharray="3 2" />
          )}
        </svg>

        {/* Animated dot */}
        <div
          className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 transition-none"
          style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
        >
          {isRunning ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-coral animate-ping opacity-50" />
              <div className="absolute inset-0 rounded-full bg-coral shadow-lg flex items-center justify-center text-lg animate-track-bounce">
                👁️
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-muted border-2 border-border flex items-center justify-center text-lg opacity-60">
              👁️
            </div>
          )}
        </div>

        {/* Instructions overlay when not running */}
        {!isRunning && !finished && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-2">👁️</div>
              <p className="font-display font-bold text-lg text-foreground">用眼睛追踪移动的目标</p>
              <p className="text-muted-foreground text-sm mt-1">保持头不动，只移动眼睛</p>
            </div>
          </div>
        )}

        {finished && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl animate-star-pop">
              <div className="text-5xl mb-2">🌟</div>
              <p className="font-display font-bold text-2xl text-foreground">太棒了！</p>
              <p className="text-muted-foreground">完成了 3 轮追踪训练</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm font-bold text-muted-foreground">
          <span>进度</span>
          <span>已完成 {cycles}/3 轮</span>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-sky transition-all"
            style={{ width: `${progress}%`, background: "linear-gradient(to right, hsl(var(--secondary)), hsl(var(--lavender)))" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <Button
            onClick={start}
            className="flex-1 h-12 text-lg font-display font-bold rounded-2xl"
            style={{ background: "var(--gradient-card-sky)", color: "white" }}
            disabled={finished}
          >
            <Play className="mr-2 w-5 h-5" />
            {finished ? "已完成" : "开始训练"}
          </Button>
        ) : null}
        <Button
          variant="outline"
          onClick={reset}
          className="h-12 px-6 rounded-2xl border-2 font-display font-bold"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
