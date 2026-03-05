import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

interface SaccadeTrainingProps {
  onComplete: (score: number) => void;
}

const EMOJIS = ["🌟", "🦋", "🐠", "🌈", "🍭", "🎈", "🦄", "🌻", "🐸", "🎯"];
const GRID_COLS = 4;
const GRID_ROWS = 3;
const ROUNDS = 10;
const SHOW_MS = 1200;
const DELAY_MS = 600;

interface Target {
  col: number;
  row: number;
  emoji: string;
  id: number;
}

export default function SaccadeTraining({ onComplete }: SaccadeTrainingProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<Target | null>(null);
  const [lastTarget, setLastTarget] = useState<Target | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [clickFeedback, setClickFeedback] = useState<{ id: number; correct: boolean } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const roundRef = useRef(0);
  const scoreRef = useRef(0);

  const generateTarget = useCallback((): Target => {
    const col = Math.floor(Math.random() * GRID_COLS);
    const row = Math.floor(Math.random() * GRID_ROWS);
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    return { col, row, emoji, id: Date.now() };
  }, []);

  const nextRound = useCallback(() => {
    if (roundRef.current >= ROUNDS) {
      setIsRunning(false);
      setFinished(true);
      setCurrentTarget(null);
      onComplete(Math.round((scoreRef.current / ROUNDS) * 100));
      return;
    }
    const target = generateTarget();
    setCurrentTarget(target);
    setRound(roundRef.current + 1);
    roundRef.current += 1;

    timeoutRef.current = setTimeout(() => {
      setLastTarget(target);
      setCurrentTarget(null);
      timeoutRef.current = setTimeout(nextRound, DELAY_MS);
    }, SHOW_MS);
  }, [generateTarget, onComplete]);

  const start = () => {
    roundRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setRound(0);
    setFinished(false);
    setCurrentTarget(null);
    setLastTarget(null);
    setClickFeedback(null);
    setIsRunning(true);
    setTimeout(nextRound, 500);
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setFinished(false);
    setCurrentTarget(null);
    setLastTarget(null);
    setRound(0);
    setScore(0);
    setClickFeedback(null);
    roundRef.current = 0;
    scoreRef.current = 0;
  };

  const handleCellClick = (col: number, row: number) => {
    if (!isRunning || !currentTarget) return;
    const correct = col === currentTarget.col && row === currentTarget.row;
    setClickFeedback({ id: currentTarget.id, correct });
    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
    clearTimeout(timeoutRef.current);
    setLastTarget(currentTarget);
    setCurrentTarget(null);
    timeoutRef.current = setTimeout(nextRound, DELAY_MS);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const cells = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => ({
    col: i % GRID_COLS,
    row: Math.floor(i / GRID_COLS),
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "当前轮次", value: `${round}/${ROUNDS}`, color: "from-sky to-secondary" },
          { label: "正确次数", value: score, color: "from-mint to-mint" },
          { label: "准确率", value: round > 0 ? `${Math.round((score / round) * 100)}%` : "--", color: "from-sun to-primary" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{ background: `linear-gradient(135deg, hsl(var(--${s.color.split("-")[1]}-light ?? --muted)), hsl(var(--muted)))` }}
          >
            <div className="text-2xl font-display font-black text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid arena */}
      <div className="relative rounded-3xl border-4 border-secondary/30 bg-gradient-to-br from-sky-light to-lavender-light p-4 overflow-hidden">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
        >
          {cells.map(({ col, row }) => {
            const isTarget = currentTarget?.col === col && currentTarget?.row === row;
            const wasTarget = lastTarget?.col === col && lastTarget?.row === row;
            return (
              <button
                key={`${col}-${row}`}
                onClick={() => handleCellClick(col, row)}
                className={`
                  aspect-square rounded-2xl border-2 transition-all duration-150 flex items-center justify-center text-3xl sm:text-4xl
                  ${isTarget
                    ? "border-coral bg-coral-light scale-110 shadow-xl animate-track-bounce cursor-pointer"
                    : wasTarget && clickFeedback
                      ? clickFeedback.correct
                        ? "border-mint bg-mint-light scale-105"
                        : "border-destructive bg-destructive/10"
                      : "border-border bg-card/70 hover:bg-card cursor-pointer"
                  }
                `}
              >
                {isTarget ? currentTarget?.emoji : ""}
              </button>
            );
          })}
        </div>

        {/* Overlays */}
        {!isRunning && !finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl">
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <p className="font-display font-bold text-xl">看到目标就快速点击！</p>
              <p className="text-muted-foreground text-sm mt-1">训练眼球快速跳动能力</p>
            </div>
          </div>
        )}

        {finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-3xl animate-star-pop">
            <div className="text-center">
              <div className="text-6xl mb-2">🏆</div>
              <p className="font-display font-black text-2xl">训练完成！</p>
              <p className="font-bold text-lg mt-1">
                {ROUNDS} 轮中答对 <span style={{ color: "hsl(var(--mint))" }}>{score}</span> 次
              </p>
              <p className="text-muted-foreground">
                准确率：{Math.round((score / ROUNDS) * 100)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isRunning && currentTarget && (
        <div className="text-center bg-coral-light rounded-2xl py-3 px-4 border-2 border-coral/30">
          <p className="font-display font-bold text-foreground">快速点击出现的 {currentTarget.emoji}！</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={start}
          disabled={isRunning}
          className="flex-1 h-12 text-lg font-display font-bold rounded-2xl"
          style={{ background: "var(--gradient-card-coral)", color: "white" }}
        >
          <Play className="mr-2 w-5 h-5" />
          {finished ? "再玩一次" : "开始训练"}
        </Button>
        <Button variant="outline" onClick={reset} className="h-12 px-6 rounded-2xl border-2 font-display font-bold">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
