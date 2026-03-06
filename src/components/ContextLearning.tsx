import { useState } from "react";
import { ChevronRight, CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContextLearningProps {
  onComplete: (score: number) => void;
}

// Scene tasks for "Forest Character Exploration"
interface TaskItem {
  id: number;
  scene: string;
  instruction: string;
  target: string;
  choices: string[];
  hint: string;
  correct: string;
  sceneBg: string;
  sceneEmoji: string;
  objects: string[];
  successMsg: string;
}

const TASKS: TaskItem[] = [
  {
    id: 1,
    scene: "林间小屋",
    instruction: "森林深处，小熊看到了一块木牌。木牌上写着什么字？",
    target: "山",
    choices: ["山", "日", "月", "水"],
    hint: "三条竖线，中间最高",
    correct: "山",
    sceneBg: "linear-gradient(160deg, hsl(150 60% 30%), hsl(150 50% 20%))",
    sceneEmoji: "🌲",
    objects: ["🏔️", "🌿", "🍄", "🌸"],
    successMsg: "太棒了！你认出了【山】字！",
  },
  {
    id: 2,
    scene: "清澈的小溪",
    instruction: "小熊来到小溪旁，看到水面上漂着一片叶子，叶子上有一个汉字，那是哪个字？",
    target: "水",
    choices: ["火", "水", "木", "土"],
    hint: "像河流，有波浪的感觉",
    correct: "水",
    sceneBg: "linear-gradient(160deg, hsl(200 70% 35%), hsl(210 60% 25%))",
    sceneEmoji: "🌊",
    objects: ["🐟", "🍃", "💧", "🌊"],
    successMsg: "答对了！【水】字像流动的河流！",
  },
  {
    id: 3,
    scene: "阳光草地",
    instruction: "走出树林，小熊看见天空中挂着一个大大的圆，草地上的石头写着这是什么？",
    target: "日",
    choices: ["月", "日", "火", "山"],
    hint: "圆圆的，像太阳的形状",
    correct: "日",
    sceneBg: "linear-gradient(160deg, hsl(42 80% 45%), hsl(35 70% 35%))",
    sceneEmoji: "☀️",
    objects: ["🌻", "🌼", "🦋", "🐝"],
    successMsg: "非常好！【日】就是太阳哦！",
  },
];

type TaskPhase = "intro" | "task" | "success" | "complete";

function SceneBackground({ bg, emoji, objects }: { bg: string; emoji: string; objects: string[] }) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: bg, minHeight: 180 }}
    >
      {/* Sky/atmosphere layer */}
      <div className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 30% 30%, white, transparent 70%)" }} />

      {/* Floating scene objects */}
      <div className="absolute inset-0 flex items-end justify-around pb-3 px-4">
        {objects.map((obj, i) => (
          <span
            key={i}
            className="text-3xl select-none"
            style={{
              animationName: "float",
              animationDuration: `${2.5 + i * 0.4}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {obj}
          </span>
        ))}
      </div>

      {/* Central scene emoji */}
      <div className="flex justify-center pt-6 pb-14">
        <span className="text-7xl drop-shadow-lg animate-float">{emoji}</span>
      </div>

      {/* Vignette bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12"
        style={{ background: "linear-gradient(to top, hsl(var(--background) / 0.6), transparent)" }} />
    </div>
  );
}

export default function ContextLearning({ onComplete }: ContextLearningProps) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [phase, setPhase] = useState<TaskPhase>("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const task = TASKS[taskIdx];

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === task.correct) {
      const pts = wrongCount === 0 ? 33 : wrongCount === 1 ? 22 : 11;
      setScore((s) => s + pts);
      setTimeout(() => setPhase("success"), 400);
    } else {
      setWrongCount((c) => c + 1);
      setTimeout(() => setSelected(null), 700);
    }
  };

  const handleNext = () => {
    const next = taskIdx + 1;
    if (next >= TASKS.length) {
      setPhase("complete");
    } else {
      setTaskIdx(next);
      setPhase("task");
      setSelected(null);
      setWrongCount(0);
      setShowHint(false);
    }
  };

  if (phase === "complete") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-7xl animate-float">🏆</div>
        <h2 className="font-display font-black text-2xl text-foreground">森林探索完成！</h2>
        <p className="text-muted-foreground font-bold">
          小熊完成了森林识字冒险<br />你认识了 {TASKS.length} 个汉字！
        </p>
        <div className="flex gap-3">
          {TASKS.map((t) => (
            <div key={t.id} className="flex flex-col items-center gap-1 rounded-2xl p-3 border-2 border-primary/30 bg-primary/5 w-16">
              <span className="text-3xl font-serif font-bold" style={{ color: "hsl(var(--sky))" }}>{t.target}</span>
              <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--mint))" }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl font-bold gap-2" onClick={() => {
            setTaskIdx(0); setPhase("intro"); setScore(0); setWrongCount(0); setSelected(null);
          }}>
            <RotateCcw className="w-4 h-4" /> 再探索一次
          </Button>
          <Button className="rounded-2xl font-bold" onClick={() => onComplete(Math.min(score, 100))}>
            完成学习
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col gap-5">
        {/* Immersive intro banner */}
        <div
          className="rounded-3xl overflow-hidden relative p-6 text-center"
          style={{ background: "linear-gradient(160deg, hsl(150 55% 28%), hsl(200 55% 25%))", minHeight: 220 }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(ellipse at center, white, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="text-6xl mb-3 animate-float">🐻</div>
            <h2 className="font-display font-black text-2xl text-white">森林识字探索</h2>
            <p className="text-white/80 font-bold mt-2 text-sm leading-relaxed">
              小熊要穿越森林，需要你帮助他<br />
              认出路途中出现的汉字
            </p>
            <div className="flex justify-center gap-3 mt-4">
              {TASKS.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    {t.sceneEmoji}
                  </div>
                  <span className="text-xs text-white/60 font-bold">{t.scene}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border-2 border-border p-4">
          <h3 className="font-display font-bold text-base mb-2 flex items-center gap-2">
            <span>📋</span> 学习目标
          </h3>
          <div className="flex flex-col gap-2">
            {[
              "在情境中认识 3 个汉字",
              "根据形状和联想判断汉字",
              "遇到不懂的字可以看提示",
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-center text-sm font-bold text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary">
                  {i + 1}
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <Button
          className="h-14 text-lg font-display font-black rounded-2xl gap-2"
          style={{ background: "linear-gradient(135deg, hsl(150 60% 45%), hsl(200 60% 50%))", border: "none", color: "white" }}
          onClick={() => setPhase("task")}
        >
          <span>🐻</span> 开始探索！
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {TASKS.map((t, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full transition-all"
            style={{
              background: i < taskIdx ? "hsl(var(--mint))" : i === taskIdx ? "hsl(var(--sky))" : "hsl(var(--muted))",
            }}
          />
        ))}
        <span className="text-xs font-bold text-muted-foreground ml-1">{taskIdx + 1}/{TASKS.length}</span>
      </div>

      {/* Scene */}
      <SceneBackground bg={task.sceneBg} emoji={task.sceneEmoji} objects={task.objects} />

      {/* Task card */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-base">🐻</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground leading-relaxed">{task.instruction}</p>
            <button
              onClick={() => handleSpeak(task.instruction)}
              className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" /> 朗读题目
            </button>
          </div>
        </div>
      </div>

      {/* Answer choices */}
      {phase === "task" && (
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-2 ml-1">点击你认为正确的汉字：</p>
          <div className="grid grid-cols-4 gap-2">
            {task.choices.map((choice) => {
              const isSelected = selected === choice;
              const isCorrect = isSelected && choice === task.correct;
              const isWrong = isSelected && choice !== task.correct;
              return (
                <button
                  key={choice}
                  onClick={() => handleSelect(choice)}
                  className="rounded-2xl border-2 py-4 text-3xl font-serif font-bold transition-all active:scale-95"
                  style={{
                    borderColor: isCorrect
                      ? "hsl(var(--mint))"
                      : isWrong
                        ? "hsl(var(--coral))"
                        : "hsl(var(--border))",
                    background: isCorrect
                      ? "hsl(var(--mint-light))"
                      : isWrong
                        ? "hsl(var(--coral-light))"
                        : "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    transform: isSelected ? "scale(0.96)" : undefined,
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {wrongCount > 0 && !showHint && (
            <button
              className="mt-3 text-sm font-bold text-primary underline-offset-2 underline"
              onClick={() => setShowHint(true)}
            >
              💡 查看提示
            </button>
          )}
          {showHint && (
            <div className="mt-3 rounded-xl bg-primary/8 border border-primary/20 px-3 py-2 text-sm font-bold text-foreground animate-star-pop"
              style={{ background: "hsl(var(--primary) / 0.08)" }}>
              提示：{task.hint}
            </div>
          )}
        </div>
      )}

      {/* Success state */}
      {phase === "success" && (
        <div className="rounded-2xl p-4 text-center animate-star-pop"
          style={{ background: "linear-gradient(135deg, hsl(var(--mint-light)), hsl(var(--sky-light)))" }}>
          <div className="text-4xl mb-2">🌟</div>
          <p className="font-display font-bold text-base text-foreground">{task.successMsg}</p>
          <div className="flex justify-center mt-3">
            <div className="text-6xl font-serif font-bold" style={{ color: "hsl(var(--sky))" }}>
              {task.target}
            </div>
          </div>
          <Button
            className="mt-4 rounded-2xl font-bold gap-2"
            onClick={handleNext}
          >
            {taskIdx < TASKS.length - 1 ? "继续探索" : "完成探索"} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
