import { useState, useRef, useEffect } from "react";
import { Volume2, RotateCcw, ChevronRight, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CharacterLearningProps {
  onComplete: (score: number) => void;
}

// 笔顺路径数据（山字）
const STROKES = [
  {
    id: 1,
    label: "第一笔：竖",
    path: "M 100 40 L 100 140",
    arrowEnd: { x: 100, y: 140 },
    color: "hsl(var(--sky))",
  },
  {
    id: 2,
    label: "第二笔：竖折",
    path: "M 60 70 L 60 140 L 95 140",
    arrowEnd: { x: 95, y: 140 },
    color: "hsl(var(--coral))",
  },
  {
    id: 3,
    label: "第三笔：竖",
    path: "M 140 70 L 140 140",
    arrowEnd: { x: 140, y: 140 },
    color: "hsl(var(--mint))",
  },
];

const CHARACTER_DATA = {
  char: "山",
  pinyin: "shān",
  tone: "一声",
  meaning: "山峰、山脉，大地上高耸的自然地形",
  imageEmoji: "⛰️",
  imageDesc: "高高的山峰，像三座竖立的石柱",
  mnemonic: "三座山峰并排站，中间最高两边矮",
  encouragements: [
    "真棒！描得很好！",
    "你的手真稳！",
    "一笔一画，越来越好！",
    "加油，你能做到！",
  ],
};

type Phase = "learn" | "stroke" | "trace" | "done";

// 笔顺动画组件
function StrokeAnimation({ currentStroke }: { currentStroke: number }) {
  const [animProgress, setAnimProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    setAnimProgress(0);
    let start: number | null = null;
    const duration = 900;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setAnimProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [currentStroke]);

  return (
    <svg viewBox="0 0 200 180" className="w-full max-w-[200px]">
      {/* Grid lines */}
      <line x1="100" y1="10" x2="100" y2="170" stroke="hsl(var(--border))" strokeWidth="0.8" strokeDasharray="3,3" />
      <line x1="10" y1="90" x2="190" y2="90" stroke="hsl(var(--border))" strokeWidth="0.8" strokeDasharray="3,3" />
      <rect x="10" y="10" width="180" height="160" fill="none" stroke="hsl(var(--border))" strokeWidth="1" rx="4" />

      {/* Completed strokes */}
      {STROKES.slice(0, currentStroke).map((s) => (
        <path
          key={s.id}
          d={s.path}
          stroke="hsl(var(--foreground))"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />
      ))}

      {/* Current animated stroke */}
      {currentStroke < STROKES.length && (() => {
        const stroke = STROKES[currentStroke];
        return (
          <path
            d={stroke.path}
            stroke={stroke.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="300"
            strokeDashoffset={`${300 * (1 - animProgress)}`}
            style={{ transition: "none" }}
          />
        );
      })()}

      {/* Order number at start */}
      {currentStroke < STROKES.length && (
        <circle
          cx={currentStroke === 0 ? 100 : currentStroke === 1 ? 60 : 140}
          cy={currentStroke === 0 ? 40 : 70}
          r="10"
          fill={STROKES[currentStroke].color}
        />
      )}
      {currentStroke < STROKES.length && (
        <text
          x={currentStroke === 0 ? 100 : currentStroke === 1 ? 60 : 140}
          y={currentStroke === 0 ? 45 : 75}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {currentStroke + 1}
        </text>
      )}
    </svg>
  );
}

// 描红画布组件
function TraceCanvas({ onScoreChange }: { onScoreChange: (s: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [strokeCount, setStrokeCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    // Draw guide character (faint)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 140px serif";
    ctx.fillStyle = "hsl(200 80% 90% / 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("山", canvas.width / 2, canvas.height / 2 + 8);
  }, []);

  const getPos = (e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "hsl(var(--primary))";
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
    setStrokeCount((c) => {
      const next = c + 1;
      onScoreChange(Math.min(next * 33, 100));
      return next;
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 140px serif";
    ctx.fillStyle = "hsl(200 80% 90% / 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("山", canvas.width / 2, canvas.height / 2 + 8);
    setStrokeCount(0);
    onScoreChange(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-card"
        style={{ width: "100%", maxWidth: 240 }}>
        <canvas
          ref={canvasRef}
          width={240}
          height={200}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="absolute top-2 left-2 text-xs font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-lg">
          描红区
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-1.5 rounded-xl font-bold text-xs">
        <RotateCcw className="w-3 h-3" /> 清除重写
      </Button>
    </div>
  );
}

export default function CharacterLearning({ onComplete }: CharacterLearningProps) {
  const [phase, setPhase] = useState<Phase>("learn");
  const [currentStroke, setCurrentStroke] = useState(0);
  const [traceScore, setTraceScore] = useState(0);
  const [showPronounce, setShowPronounce] = useState(false);
  const [encourageIdx] = useState(() => Math.floor(Math.random() * CHARACTER_DATA.encouragements.length));

  const handleSpeak = () => {
    setShowPronounce(true);
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(CHARACTER_DATA.char);
      u.lang = "zh-CN";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => setShowPronounce(false), 1500);
  };

  const handleNextStroke = () => {
    if (currentStroke < STROKES.length - 1) {
      setCurrentStroke((s) => s + 1);
    } else {
      setPhase("trace");
    }
  };

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-7xl animate-float">🌟</div>
        <h2 className="font-display font-black text-2xl text-foreground">学完啦！</h2>
        <div className="rounded-3xl bg-card border-2 border-border p-6 w-full">
          <div className="text-8xl font-serif mb-2" style={{ color: "hsl(var(--sky))" }}>山</div>
          <div className="text-2xl font-bold text-muted-foreground">{CHARACTER_DATA.pinyin}</div>
          <p className="text-sm text-muted-foreground mt-2 font-bold">{CHARACTER_DATA.meaning}</p>
        </div>
        <p className="text-base font-bold text-foreground">{CHARACTER_DATA.encouragements[encourageIdx]}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl font-bold gap-2" onClick={() => {
            setPhase("learn"); setCurrentStroke(0); setTraceScore(0);
          }}>
            <RotateCcw className="w-4 h-4" /> 再学一次
          </Button>
          <Button className="rounded-2xl font-bold gap-2" onClick={() => onComplete(Math.max(traceScore, 70))}>
            下一个字 <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Phase tabs */}
      <div className="flex gap-2">
        {(["learn", "stroke", "trace"] as Phase[]).map((p, i) => (
          <div
            key={p}
            className={`flex-1 py-2 rounded-xl text-center text-xs font-bold border-2 transition-all
              ${phase === p ? "border-primary text-foreground" : "border-border text-muted-foreground opacity-60"}`}
            style={{ background: phase === p ? "hsl(var(--primary) / 0.1)" : "" }}
          >
            {["认识汉字", "笔顺学习", "描红临摹"][i]}
          </div>
        ))}
      </div>

      {/* PHASE: learn */}
      {phase === "learn" && (
        <div className="flex flex-col gap-4">
          {/* Large character display */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(var(--lavender-light)))" }}>
            <div className="p-6 text-center">
              <div
                className="text-[120px] leading-none font-serif mx-auto select-none"
                style={{ color: "hsl(var(--sky))", filter: "drop-shadow(0 4px 12px hsl(var(--sky) / 0.3))" }}
              >
                {CHARACTER_DATA.char}
              </div>
              {/* Pinyin */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-2xl font-bold text-foreground">{CHARACTER_DATA.pinyin}</span>
                <span className="text-sm text-muted-foreground font-bold">({CHARACTER_DATA.tone})</span>
                <button
                  onClick={handleSpeak}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all
                    ${showPronounce ? "border-primary bg-primary/20 scale-110" : "border-border bg-white/60"}`}
                >
                  <Volume2 className="w-5 h-5" style={{ color: showPronounce ? "hsl(var(--primary))" : "hsl(var(--foreground))" }} />
                </button>
              </div>
              {showPronounce && (
                <div className="mt-2 text-sm font-bold animate-star-pop" style={{ color: "hsl(var(--primary))" }}>
                  🔊 正在朗读…
                </div>
              )}
            </div>
          </div>

          {/* Image association */}
          <div className="rounded-2xl bg-card border-2 border-border p-4 flex gap-4 items-center">
            <div className="text-5xl">{CHARACTER_DATA.imageEmoji}</div>
            <div>
              <div className="font-display font-bold text-base text-foreground mb-1">图像联想</div>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">{CHARACTER_DATA.imageDesc}</p>
            </div>
          </div>

          {/* Meaning + mnemonic */}
          <div className="rounded-2xl bg-card border-2 border-border p-4">
            <div className="font-display font-bold text-base mb-2 flex items-center gap-2">
              <span>💡</span> 字义与记忆口诀
            </div>
            <p className="text-sm text-muted-foreground font-bold mb-2">{CHARACTER_DATA.meaning}</p>
            <div className="bg-primary/8 rounded-xl px-3 py-2 text-sm font-bold text-foreground" style={{ background: "hsl(var(--primary) / 0.08)" }}>
              📝 {CHARACTER_DATA.mnemonic}
            </div>
          </div>

          <Button
            className="h-14 text-lg font-display font-black rounded-2xl gap-2"
            onClick={() => setPhase("stroke")}
          >
            学写笔顺 <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* PHASE: stroke */}
      {phase === "stroke" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card border-2 border-border p-4 text-center">
            <div className="font-display font-bold text-base mb-1 text-foreground">
              笔顺演示 — 第 {currentStroke + 1} / {STROKES.length} 笔
            </div>
            <p className="text-sm font-bold mb-3" style={{ color: STROKES[currentStroke].color }}>
              {STROKES[currentStroke].label}
            </p>
            <div className="flex justify-center">
              <StrokeAnimation currentStroke={currentStroke} />
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-2">↑ 红色线条表示当前笔画方向</p>
          </div>

          {/* Stroke progress dots */}
          <div className="flex justify-center gap-3">
            {STROKES.map((s, i) => (
              <div
                key={s.id}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all"
                style={{
                  background: i < currentStroke ? "hsl(var(--mint))" : i === currentStroke ? s.color : "hsl(var(--muted))",
                  borderColor: i === currentStroke ? s.color : "transparent",
                  color: i <= currentStroke ? "white" : "hsl(var(--muted-foreground))",
                }}
              >
                {i < currentStroke ? "✓" : i + 1}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold gap-2"
              onClick={() => setCurrentStroke((s) => Math.max(0, s - 1))} disabled={currentStroke === 0}>
              ← 上一笔
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl font-bold gap-2"
              onClick={handleNextStroke}
            >
              {currentStroke < STROKES.length - 1 ? "下一笔 →" : "去描红 ✏️"}
            </Button>
          </div>
        </div>
      )}

      {/* PHASE: trace */}
      {phase === "trace" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card border-2 border-border p-4">
            <div className="font-display font-bold text-base mb-1 flex items-center gap-2">
              <Pencil className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
              描红临摹
            </div>
            <p className="text-sm text-muted-foreground font-bold mb-3">
              按照笔顺，用手指描出"山"字的形状
            </p>
            <TraceCanvas onScoreChange={setTraceScore} />
          </div>

          {/* Progress feedback */}
          {traceScore > 0 && (
            <div className="rounded-2xl p-3 flex items-center gap-3 animate-star-pop"
              style={{ background: "hsl(var(--mint-light))" }}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "hsl(var(--mint))" }} />
              <p className="text-sm font-bold text-foreground">
                {traceScore >= 66
                  ? "✨ 写得很好！可以继续了"
                  : "继续描，越写越棒！"}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold"
              onClick={() => { setPhase("stroke"); setCurrentStroke(0); }}>
              重看笔顺
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl font-bold gap-2"
              onClick={() => setPhase("done")}
            >
              完成 <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
