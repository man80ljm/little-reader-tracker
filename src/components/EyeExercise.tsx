import { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, CheckCircle2, Pause, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EyeExerciseProps {
  onComplete: (score: number) => void;
}

const STEP_DURATION = 32; // seconds per step (8 beats × 4 counts = 32 seconds)

interface ExerciseStep {
  id: number;
  name: string;
  acupoint: string;
  desc: string;
  longDesc: string;
  emoji: string;
  animation: "pulse-ring" | "left-right" | "up-down" | "circle-cw" | "blink" | "diagonal" | "squeeze" | "massage";
  color: string;
  gradient: string;
}

const STEPS: ExerciseStep[] = [
  {
    id: 1,
    name: "按揉耳垂眼穴",
    acupoint: "耳垂眼穴",
    desc: "用拇指和食指捏住耳垂，向后旋转按揉",
    longDesc: "双手拇指和食指轻捏耳垂，顺时针旋转按揉8次，再逆时针8次，同时脚趾配合做抓地动作",
    emoji: "👂",
    animation: "pulse-ring",
    color: "hsl(var(--primary))",
    gradient: "var(--gradient-card-sky)",
  },
  {
    id: 2,
    name: "按揉攒竹穴",
    acupoint: "攒竹穴",
    desc: "用双手大拇指按揉眉头内侧凹陷处",
    longDesc: "双手大拇指指腹轻压眉头内侧凹陷处（攒竹穴），做小圆圈按揉，力度适中，节拍均匀",
    emoji: "👁️",
    animation: "squeeze",
    color: "hsl(var(--sky))",
    gradient: "var(--gradient-card-sky)",
  },
  {
    id: 3,
    name: "按揉四白穴",
    acupoint: "四白穴",
    desc: "用双手食指按揉眼眶下方颧骨上的穴位",
    longDesc: "双手食指指腹按在眼眶下缘中点下方约1厘米处（四白穴），做小圆圈按揉，拇指固定在下颌处",
    emoji: "🔴",
    animation: "pulse-ring",
    color: "hsl(var(--coral))",
    gradient: "var(--gradient-card-coral)",
  },
  {
    id: 4,
    name: "按揉太阳穴刮上眼眶",
    acupoint: "太阳穴",
    desc: "拇指按太阳穴，食指屈曲刮上眼眶",
    longDesc: "双手大拇指按住太阳穴，食指第二节弯曲，由眉头沿上眼眶轮刮至眉梢，做到8个节拍",
    emoji: "☀️",
    animation: "left-right",
    color: "hsl(var(--sun))",
    gradient: "var(--gradient-card-sun)",
  },
  {
    id: 5,
    name: "按揉风池穴",
    acupoint: "风池穴",
    desc: "双手食指和中指按揉颈后枕骨下凹陷处",
    longDesc: "双手食指和中指并拢，按在后颈枕骨下两侧凹陷处（风池穴），做旋转按揉，可微微仰头",
    emoji: "💆",
    animation: "circle-cw",
    color: "hsl(var(--mint))",
    gradient: "var(--gradient-card-sky)",
  },
  {
    id: 6,
    name: "眼球运动·上下",
    acupoint: "眼外肌训练",
    desc: "头部不动，眼球缓慢向上看再向下看",
    longDesc: "头部保持正面不动，眼球慢慢向上方看到极限，停顿一秒，再向下方看到极限，节律均匀重复",
    emoji: "⬆️",
    animation: "up-down",
    color: "hsl(var(--lavender))",
    gradient: "var(--gradient-card-sky)",
  },
  {
    id: 7,
    name: "眼球运动·左右",
    acupoint: "眼外肌训练",
    desc: "头部不动，眼球缓慢向左看再向右看",
    longDesc: "头部保持正面不动，眼球慢慢向左侧看到极限，停顿一秒，再向右侧看到极限，节律均匀重复",
    emoji: "⬅️",
    animation: "left-right",
    color: "hsl(var(--sky))",
    gradient: "var(--gradient-card-sky)",
  },
  {
    id: 8,
    name: "眼球运动·顺时针",
    acupoint: "眼外肌综合训练",
    desc: "头部不动，眼球顺时针缓慢转动一圈",
    longDesc: "头部保持不动，眼球依次向上→右→下→左做缓慢的顺时针圆圈运动，感受眼部肌肉的拉伸，完成4圈",
    emoji: "🔄",
    animation: "circle-cw",
    color: "hsl(var(--coral))",
    gradient: "var(--gradient-card-coral)",
  },
];

// SVG eye animation components
function EyeAnimationDisplay({ animation, color, tick }: { animation: ExerciseStep["animation"]; color: string; tick: number }) {
  const t = tick % 100;
  const blink = animation === "blink";

  // Pupil position
  let px = 50, py = 50;
  if (animation === "left-right") {
    px = 30 + Math.sin(tick * 0.06) * 18;
    py = 50;
  } else if (animation === "up-down") {
    px = 50;
    py = 40 + Math.sin(tick * 0.06) * 14;
  } else if (animation === "circle-cw") {
    px = 50 + Math.cos(tick * 0.05) * 18;
    py = 50 + Math.sin(tick * 0.05) * 14;
  } else if (animation === "diagonal") {
    px = 50 + Math.sin(tick * 0.06) * 16;
    py = 50 + Math.sin(tick * 0.06) * 12;
  } else if (animation === "squeeze") {
    px = 50;
    py = 50;
  } else if (animation === "pulse-ring") {
    px = 50; py = 50;
  } else if (animation === "massage") {
    px = 50 + Math.sin(tick * 0.1) * 8;
    py = 50 + Math.cos(tick * 0.1) * 6;
  }

  const eyeOpen = blink ? (t < 70 ? 1 : Math.max(0, 1 - (t - 70) / 10)) : 1;
  const eyeHeight = 24 * eyeOpen;
  const squeezeScale = animation === "squeeze" ? (0.85 + Math.abs(Math.sin(tick * 0.08)) * 0.15) : 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="200" height="120" viewBox="0 0 200 120" className="drop-shadow-lg">
        {/* Left eye */}
        <g transform={`translate(60, 60) scale(${squeezeScale})`}>
          {/* Eye white */}
          <ellipse cx="0" cy="0" rx="30" ry={eyeHeight} fill="white" stroke={color} strokeWidth="2.5" />
          {/* Pupil */}
          <circle cx={px - 50} cy={py - 50} r="9" fill={color} />
          <circle cx={px - 46} cy={py - 54} r="3" fill="white" opacity="0.8" />
          {/* Eyelashes top */}
          {eyeOpen > 0.3 && [-18, -8, 0, 8, 18].map((x, i) => (
            <line key={i} x1={x} y1={-eyeHeight} x2={x} y2={-eyeHeight - 6} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </g>
        {/* Right eye */}
        <g transform={`translate(140, 60) scale(${squeezeScale})`}>
          <ellipse cx="0" cy="0" rx="30" ry={eyeHeight} fill="white" stroke={color} strokeWidth="2.5" />
          <circle cx={px - 50} cy={py - 50} r="9" fill={color} />
          <circle cx={px - 46} cy={py - 54} r="3" fill="white" opacity="0.8" />
          {eyeOpen > 0.3 && [-18, -8, 0, 8, 18].map((x, i) => (
            <line key={i} x1={x} y1={-eyeHeight} x2={x} y2={-eyeHeight - 6} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </g>
        {/* Pulse rings for acupoint animations */}
        {animation === "pulse-ring" && (
          <>
            <circle cx="60" cy="60" r={22 + (t % 30) * 0.5} fill="none" stroke={color} strokeWidth="1.5"
              opacity={Math.max(0, 1 - (t % 30) / 30)} />
            <circle cx="140" cy="60" r={22 + (t % 30) * 0.5} fill="none" stroke={color} strokeWidth="1.5"
              opacity={Math.max(0, 1 - (t % 30) / 30)} />
          </>
        )}
        {/* Massage dots */}
        {animation === "massage" && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx={60 + Math.cos((angle + tick * 3) * Math.PI / 180) * 28}
                cy={60 + Math.sin((angle + tick * 3) * Math.PI / 180) * 22}
                r="3" fill={color} opacity="0.6"
              />
            ))}
          </>
        )}
      </svg>
      {/* Direction arrows for eye movement */}
      {animation === "left-right" && (
        <div className="flex items-center gap-6 text-2xl" style={{ color }}>
          <span style={{ opacity: px < 50 ? 1 : 0.3 }}>◀</span>
          <div className="w-8 h-0.5 rounded-full" style={{ background: color }} />
          <span style={{ opacity: px > 50 ? 1 : 0.3 }}>▶</span>
        </div>
      )}
      {animation === "up-down" && (
        <div className="flex flex-col items-center gap-1 text-2xl" style={{ color }}>
          <span style={{ opacity: py < 50 ? 1 : 0.3 }}>▲</span>
          <div className="h-5 w-0.5 rounded-full" style={{ background: color }} />
          <span style={{ opacity: py > 50 ? 1 : 0.3 }}>▼</span>
        </div>
      )}
      {animation === "circle-cw" && (
        <div className="text-2xl animate-spin" style={{ color, animationDuration: "2s" }}>↻</div>
      )}
    </div>
  );
}

export default function EyeExercise({ onComplete }: EyeExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(STEP_DURATION);
  const [totalComplete, setTotalComplete] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animTick, setAnimTick] = useState(0);
  const intervalRef = useRef<number>();
  const animRef = useRef<number>();

  const step = STEPS[currentStep];
  const progress = ((STEP_DURATION - timeLeft) / STEP_DURATION) * 100;
  const overallProgress = ((currentStep + (1 - timeLeft / STEP_DURATION)) / STEPS.length) * 100;

  const animLoop = useCallback(() => {
    setAnimTick((t) => t + 1);
    animRef.current = requestAnimationFrame(animLoop);
  }, []);

  useEffect(() => {
    if (isRunning) {
      animRef.current = requestAnimationFrame(animLoop);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isRunning, animLoop]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Move to next step
          const next = currentStep + 1;
          if (next >= STEPS.length) {
            setIsRunning(false);
            setFinished(true);
            onComplete(100);
            clearInterval(intervalRef.current);
            return 0;
          } else {
            setCurrentStep(next);
            setTotalComplete(next);
            return STEP_DURATION;
          }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentStep, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setShowDetails(false);
  };
  const handlePause = () => setIsRunning((v) => !v);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(STEP_DURATION);
    setTotalComplete(0);
    setFinished(false);
    setAnimTick(0);
  };
  const handleSkip = () => {
    const next = currentStep + 1;
    if (next >= STEPS.length) {
      setIsRunning(false);
      setFinished(true);
      onComplete(Math.round((totalComplete / STEPS.length) * 100));
    } else {
      setCurrentStep(next);
      setTotalComplete((v) => Math.max(v, next));
      setTimeLeft(STEP_DURATION);
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
        <div className="text-7xl animate-float">🎉</div>
        <h2 className="font-display font-black text-2xl text-foreground">眼保健操完成！</h2>
        <p className="text-muted-foreground font-bold text-center">
          太棒了！你已经完成了全套8节眼保健操<br />
          眼睛感到放松了吗？
        </p>
        <div className="grid grid-cols-4 gap-2 w-full">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-1 rounded-2xl p-3 border-2 border-primary/30 bg-primary/5">
              <span className="text-xl">{s.emoji}</span>
              <span className="text-xs font-bold text-center leading-tight text-muted-foreground">{s.name.split("·")[0].split("穴")[0]}</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="gap-2 font-bold rounded-2xl">
            <RotateCcw className="w-4 h-4" /> 再做一次
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Overall progress bar */}
      <div>
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-muted-foreground">总进度</span>
          <span style={{ color: step.color }}>第 {currentStep + 1} / {STEPS.length} 节</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%`, background: step.gradient }}
          />
        </div>
      </div>

      {/* Step steps strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all
              ${i === currentStep ? "scale-110 ring-2 ring-offset-1" : i < totalComplete ? "opacity-80" : "opacity-40"}`}
            style={{
              background: i <= currentStep ? s.gradient : "hsl(var(--muted))",
              outline: i === currentStep ? `2px solid ${s.color}` : "none",
              outlineOffset: "2px",
            }}
          >
            {i < totalComplete ? "✓" : s.emoji}
          </div>
        ))}
      </div>

      {/* Main exercise card */}
      <div
        className="rounded-3xl overflow-hidden shadow-lg"
        style={{ background: step.gradient }}
      >
        {/* Step header */}
        <div className="px-5 pt-5 pb-3 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-white/70 text-xs font-bold uppercase tracking-wider">第 {step.id} 节</div>
              <h2 className="font-display font-black text-xl mt-0.5">{step.name}</h2>
              <div className="text-white/80 text-sm font-bold mt-1">📍 {step.acupoint}</div>
            </div>
            <div
              className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl"
            >
              {step.emoji}
            </div>
          </div>
        </div>

        {/* Animation display area */}
        <div className="bg-white/10 backdrop-blur-sm mx-4 rounded-2xl p-4 flex flex-col items-center gap-3">
          <EyeAnimationDisplay
            animation={step.animation}
            color={step.color}
            tick={animTick}
          />
          {/* Countdown ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="white"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-black text-xl text-white">{timeLeft}</span>
              </div>
            </div>
            <p className="text-white/90 font-bold text-sm flex-1">{step.desc}</p>
          </div>
        </div>

        {/* Beat indicator */}
        {isRunning && (
          <div className="flex justify-center gap-2 py-3">
            {[1, 2, 3, 4].map((beat) => (
              <div
                key={beat}
                className="w-3 h-3 rounded-full bg-white/40 transition-all duration-200"
                style={{
                  background: ((STEP_DURATION - timeLeft) * 1 % 4) + 1 === beat ? "white" : "rgba(255,255,255,0.3)",
                  transform: ((STEP_DURATION - timeLeft) * 1 % 4) + 1 === beat ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>

      {/* Detailed instructions toggle */}
      <button
        className="text-left bg-card rounded-2xl border-2 border-border p-4"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">📋 详细动作说明</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showDetails ? "rotate-90" : ""}`} />
        </div>
        {showDetails && (
          <p className="text-sm text-muted-foreground mt-2 font-bold leading-relaxed">{step.longDesc}</p>
        )}
      </button>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className="flex-1 h-14 text-lg font-display font-black rounded-2xl gap-2"
            style={{ background: step.gradient, border: "none", color: "white" }}
          >
            <Play className="w-5 h-5" />
            {totalComplete === 0 ? "开始眼保健操" : "继续"}
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            variant="outline"
            className="flex-1 h-14 text-lg font-display font-black rounded-2xl gap-2 border-2"
          >
            <Pause className="w-5 h-5" /> 暂停
          </Button>
        )}
        <Button onClick={handleSkip} variant="outline" className="h-14 px-4 rounded-2xl border-2 font-bold gap-1">
          跳过 <ChevronRight className="w-4 h-4" />
        </Button>
        <Button onClick={handleReset} variant="outline" className="h-14 px-4 rounded-2xl border-2">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Tip */}
      <div className="rounded-2xl bg-muted/60 p-3 flex gap-2 items-start">
        <span className="text-xl">💡</span>
        <p className="text-xs font-bold text-muted-foreground">保持头部不动，坐姿端正，用鼻子自然呼吸。每节动作跟随节拍做，力度轻柔舒适即可。</p>
      </div>
    </div>
  );
}
