import { useState, useRef, useEffect } from "react";
import { Volume2, RotateCcw, ChevronRight, CheckCircle2, Pencil, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HANZI_LIST, DIFFICULTY_LABELS, DIFFICULTY_COLORS, type HanziData } from "@/data/hanziData";
import CharEvolutionStrip from "@/components/CharEvolutionStrip";

interface CharacterLearningProps {
  onComplete: (score: number) => void;
  onLearnChar?: (char: string) => void;
}

type Phase = "select" | "learn" | "stroke" | "trace" | "done";

// ── Stroke animation ─────────────────────────────────────────────────────────
function StrokeAnimation({ char, currentStroke }: { char: HanziData; currentStroke: number }) {
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

  const stroke = char.strokes[currentStroke];

  return (
    <svg viewBox="0 0 200 180" className="w-full max-w-[200px]">
      <line x1="100" y1="10" x2="100" y2="170" stroke="hsl(var(--border))" strokeWidth="0.8" strokeDasharray="3,3" />
      <line x1="10" y1="90" x2="190" y2="90" stroke="hsl(var(--border))" strokeWidth="0.8" strokeDasharray="3,3" />
      <rect x="10" y="10" width="180" height="160" fill="none" stroke="hsl(var(--border))" strokeWidth="1" rx="4" />

      {/* Completed strokes */}
      {char.strokes.slice(0, currentStroke).map((s) => (
        <path key={s.id} d={s.path} stroke="hsl(var(--foreground))" strokeWidth="10"
          strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
      ))}

      {/* Animated current stroke */}
      {stroke && (
        <path d={stroke.path} stroke={stroke.color} strokeWidth="10"
          strokeLinecap="round" strokeLinejoin="round" fill="none"
          strokeDasharray="400" strokeDashoffset={`${400 * (1 - animProgress)}`} />
      )}

      {/* Step number badge */}
      {stroke && (
        <>
          <circle cx={parseInt(stroke.path.split(" ")[1])} cy={parseInt(stroke.path.split(" ")[2])}
            r="11" fill={stroke.color} />
          <text x={parseInt(stroke.path.split(" ")[1])} y={parseInt(stroke.path.split(" ")[2]) + 4}
            textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            {currentStroke + 1}
          </text>
        </>
      )}
    </svg>
  );
}

// ── Trace canvas ─────────────────────────────────────────────────────────────
function TraceCanvas({ char, onScoreChange }: { char: string; onScoreChange: (s: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const drawGuide = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `bold 140px serif`;
    ctx.fillStyle = "hsl(200 80% 90% / 0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, w / 2, h / 2 + 8);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawGuide(ctx, canvas.width, canvas.height);
    setStrokeCount(0);
    onScoreChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char]);

  const getPos = (e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
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
    if (!isDrawing.current) return;
    isDrawing.current = false;
    setStrokeCount((c) => {
      const next = c + 1;
      onScoreChange(Math.min(next * 25, 100));
      return next;
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGuide(canvas.getContext("2d")!, canvas.width, canvas.height);
    setStrokeCount(0);
    onScoreChange(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-card"
        style={{ width: "100%", maxWidth: 240 }}>
        <canvas ref={canvasRef} width={240} height={200}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
        <div className="absolute top-2 left-2 text-xs font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-lg">
          描红区
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-bold text-muted-foreground">
          已写 {strokeCount} 笔
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-1.5 rounded-xl font-bold text-xs">
        <RotateCcw className="w-3 h-3" /> 清除重写
      </Button>
    </div>
  );
}

// ── Character selector ────────────────────────────────────────────────────────
function CharacterSelector({ onSelect }: { onSelect: (c: HanziData) => void }) {
  const difficulties = [1, 2, 3] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl overflow-hidden p-5 text-center"
        style={{ background: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(var(--lavender-light)))" }}>
        <div className="text-4xl mb-2">✍️</div>
        <h2 className="font-display font-black text-xl text-foreground">选择要学习的汉字</h2>
        <p className="text-sm text-muted-foreground font-bold mt-1">共 {HANZI_LIST.length} 个汉字，按难度分级</p>
      </div>

      {difficulties.map((d) => {
        const chars = HANZI_LIST.filter((c) => c.difficulty === d);
        return (
          <div key={d}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: DIFFICULTY_COLORS[d] }} />
              <span className="text-xs font-bold text-muted-foreground">
                {DIFFICULTY_LABELS[d]}（{chars[0].strokeCount}～{chars[chars.length - 1].strokeCount} 笔）
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {chars.map((c) => (
                <button key={c.char} onClick={() => onSelect(c)}
                  className="rounded-2xl border-2 py-3 flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: DIFFICULTY_COLORS[d], background: "hsl(var(--card))" }}>
                  <span className="text-2xl font-serif font-bold" style={{ color: DIFFICULTY_COLORS[d] }}>{c.char}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{c.pinyin}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CharacterLearning({ onComplete, onLearnChar }: CharacterLearningProps) {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedChar, setSelectedChar] = useState<HanziData | null>(null);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [traceScore, setTraceScore] = useState(0);
  const [showPronounce, setShowPronounce] = useState(false);

  const handleSelectChar = (c: HanziData) => {
    setSelectedChar(c);
    setCurrentStroke(0);
    setTraceScore(0);
    setPhase("learn");
  };

  const handleSpeak = () => {
    if (!selectedChar) return;
    setShowPronounce(true);
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(selectedChar.char);
      u.lang = "zh-CN"; u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => setShowPronounce(false), 1500);
  };

  const handleNextStroke = () => {
    if (!selectedChar) return;
    if (currentStroke < selectedChar.strokes.length - 1) {
      setCurrentStroke((s) => s + 1);
    } else {
      setPhase("trace");
    }
  };

  const handleFinish = () => {
    if (selectedChar) onLearnChar?.(selectedChar.char);
    onComplete(Math.max(traceScore, 70));
    // reset for next char
    setPhase("select");
    setSelectedChar(null);
  };

  // ── Select screen ──
  if (phase === "select") {
    return <CharacterSelector onSelect={handleSelectChar} />;
  }

  if (!selectedChar) return null;

  const diffColor = DIFFICULTY_COLORS[selectedChar.difficulty];

  // ── Done screen ──
  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-7xl animate-float">🌟</div>
        <h2 className="font-display font-black text-2xl text-foreground">学完啦！</h2>
        <div className="rounded-3xl bg-card border-2 border-border p-6 w-full">
          <div className="text-[100px] leading-none font-serif mx-auto select-none" style={{ color: diffColor }}>
            {selectedChar.char}
          </div>
          <div className="text-2xl font-bold text-muted-foreground">{selectedChar.pinyin}</div>
          <p className="text-sm text-muted-foreground mt-2 font-bold">{selectedChar.meaning}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl font-bold gap-2" onClick={() => {
            setPhase("select"); setSelectedChar(null); setCurrentStroke(0); setTraceScore(0);
          }}>
            <RotateCcw className="w-4 h-4" /> 换一个字
          </Button>
          <Button className="rounded-2xl font-bold gap-2" onClick={handleFinish}>
            完成学习 <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header with char info + back */}
      <div className="flex items-center gap-3">
        <button onClick={() => setPhase("select")}
          className="w-9 h-9 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-2xl font-serif font-bold" style={{ color: diffColor }}>{selectedChar.char}</span>
          <span className="text-base font-bold text-muted-foreground">{selectedChar.pinyin}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full border"
            style={{ borderColor: diffColor, color: diffColor, background: `${diffColor}18` }}>
            {DIFFICULTY_LABELS[selectedChar.difficulty]} · {selectedChar.strokeCount}笔
          </span>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2">
        {(["learn", "stroke", "trace"] as Phase[]).map((p, i) => (
          <div key={p}
            className={`flex-1 py-2 rounded-xl text-center text-xs font-bold border-2 transition-all
              ${phase === p ? "border-primary text-foreground" : "border-border text-muted-foreground opacity-60"}`}
            style={{ background: phase === p ? "hsl(var(--primary) / 0.1)" : "" }}>
            {["认识汉字", "笔顺学习", "描红临摹"][i]}
          </div>
        ))}
      </div>

      {/* PHASE: learn */}
      {phase === "learn" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(var(--lavender-light)))" }}>
            <div className="p-6 text-center">
              <div className="text-[120px] leading-none font-serif mx-auto select-none"
                style={{ color: diffColor, filter: `drop-shadow(0 4px 12px ${diffColor}55)` }}>
                {selectedChar.char}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-2xl font-bold text-foreground">{selectedChar.pinyin}</span>
                <span className="text-sm text-muted-foreground font-bold">({selectedChar.tone})</span>
                <button onClick={handleSpeak}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all
                    ${showPronounce ? "border-primary bg-primary/20 scale-110" : "border-border bg-white/60"}`}>
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

          <div className="rounded-2xl bg-card border-2 border-border p-4 flex gap-4 items-center">
            <div className="text-5xl">{selectedChar.imageEmoji}</div>
            <div>
              <div className="font-display font-bold text-base text-foreground mb-1">图像联想</div>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">{selectedChar.imageDesc}</p>
            </div>
          </div>

          {/* 象形演化条 */}
          <CharEvolutionStrip char={selectedChar.char} />

          <div className="rounded-2xl bg-card border-2 border-border p-4">
            <div className="font-display font-bold text-base mb-2 flex items-center gap-2">
              <span>💡</span> 字义与记忆口诀
            </div>
            <p className="text-sm text-muted-foreground font-bold mb-2">{selectedChar.meaning}</p>
            <div className="rounded-xl px-3 py-2 text-sm font-bold text-foreground"
              style={{ background: "hsl(var(--primary) / 0.08)" }}>
              📝 {selectedChar.mnemonic}
            </div>
          </div>

          <Button className="h-14 text-lg font-display font-black rounded-2xl gap-2" onClick={() => setPhase("stroke")}>
            学写笔顺 <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* PHASE: stroke */}
      {phase === "stroke" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card border-2 border-border p-4 text-center">
            <div className="font-display font-bold text-base mb-1 text-foreground">
              笔顺演示 — 第 {currentStroke + 1} / {selectedChar.strokes.length} 笔
            </div>
            <p className="text-sm font-bold mb-3" style={{ color: selectedChar.strokes[currentStroke]?.color }}>
              {selectedChar.strokes[currentStroke]?.label}
            </p>
            <div className="flex justify-center">
              <StrokeAnimation char={selectedChar} currentStroke={currentStroke} />
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-2">↑ 彩色线条表示当前笔画方向</p>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {selectedChar.strokes.map((s, i) => (
              <div key={s.id}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all"
                style={{
                  background: i < currentStroke ? "hsl(var(--mint))" : i === currentStroke ? s.color : "hsl(var(--muted))",
                  borderColor: i === currentStroke ? s.color : "transparent",
                  color: i <= currentStroke ? "white" : "hsl(var(--muted-foreground))",
                }}>
                {i < currentStroke ? "✓" : i + 1}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold gap-2"
              onClick={() => setCurrentStroke((s) => Math.max(0, s - 1))} disabled={currentStroke === 0}>
              ← 上一笔
            </Button>
            <Button className="flex-1 h-12 rounded-2xl font-bold gap-2" onClick={handleNextStroke}>
              {currentStroke < selectedChar.strokes.length - 1 ? "下一笔 →" : "去描红 ✏️"}
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
              按照笔顺，用手指描出「{selectedChar.char}」字的形状
            </p>
            <TraceCanvas char={selectedChar.char} onScoreChange={setTraceScore} />
          </div>

          {traceScore > 0 && (
            <div className="rounded-2xl p-3 flex items-center gap-3 animate-star-pop"
              style={{ background: "hsl(var(--mint-light))" }}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "hsl(var(--mint))" }} />
              <p className="text-sm font-bold text-foreground">
                {traceScore >= 75 ? "✨ 写得很好！可以继续了" : "继续描，越写越棒！"}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold"
              onClick={() => { setPhase("stroke"); setCurrentStroke(0); }}>
              重看笔顺
            </Button>
            <Button className="flex-1 h-12 rounded-2xl font-bold gap-2" onClick={() => setPhase("done")}>
              完成 <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
