import { useState } from "react";
import { ChevronRight, CheckCircle2, RotateCcw, Volume2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContextLearningProps {
  onComplete: (score: number) => void;
  onLearnChar?: (char: string) => void;
}

interface TaskItem {
  id: number;
  scene: string;
  instruction: string;
  target: string;
  choices: string[];
  hint: string;
  correct: string;
  successMsg: string;
}

interface SceneConfig {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  bgGrad: string;
  cardBg: string;
  sceneEmoji: string;
  objects: string[];
  difficulty: 1 | 2 | 3;
  diffLabel: string;
  tasks: TaskItem[];
}

const SCENES: SceneConfig[] = [
  // ── 场景一：森林探索（入门）──────────────────────────────────────────────
  {
    id: "forest",
    name: "森林识字探索",
    subtitle: "跟着小熊穿越森林，从山、水、日的形状里认识汉字",
    emoji: "🐻",
    bgGrad: "linear-gradient(160deg, hsl(150 60% 28%), hsl(150 50% 18%))",
    cardBg: "linear-gradient(135deg, hsl(150 55% 28%), hsl(200 55% 25%))",
    sceneEmoji: "🌲",
    objects: ["🏔️", "🌿", "🍄", "🌸"],
    difficulty: 1,
    diffLabel: "入门",
    tasks: [
      {
        id: 1,
        // 场景名直接就是"山"本身
        scene: "巍峨的三座山峰",
        instruction:
          "小熊站在山脚下，仰起头——眼前是三座高耸的山峰，左右两座较低，中间一座最高，直插云霄。这片连绵的山峦，用一个汉字怎么写？",
        target: "山",
        choices: ["山", "日", "月", "水"],
        // 提示直接把字形和实物对应
        hint: "看看三座山峰：左右低、中间高，写出来就是这个字的形状！",
        correct: "山",
        successMsg: "太棒了！【山】的字形就像三座并排的山峰，中间最高！",
      },
      {
        id: 2,
        // 场景名直接呈现"水"的视觉
        scene: "潺潺流动的溪水",
        instruction:
          "走进树林，耳边传来潺潺的水声。小熊看见一条小溪正在流淌——中间一道主流，两侧各有弯弯的支流向外散开，就像在舞蹈。这流动的溪水，用汉字怎么写？",
        target: "水",
        choices: ["火", "水", "木", "土"],
        hint: "中间一道竖流，两边各有弯曲的波纹，像水在流动！",
        correct: "水",
        successMsg: "答对了！【水】的字形就像从上往下流的水流，两边有波纹！",
      },
      {
        id: 3,
        // 场景名直接呈现"日"的视觉
        scene: "圆圆发光的大太阳",
        instruction:
          "走出树林，小熊抬头仰望天空——一个又圆又亮的大圆盘悬挂天际，里面有一道光芒横穿，把整片草地照得金灿灿的。天空中这个发光的圆，用汉字怎么写？",
        target: "日",
        choices: ["月", "日", "火", "山"],
        hint: "一个四方的圆，里面有一横——就像太阳里面的光芒！",
        correct: "日",
        successMsg: "非常好！【日】就是太阳，方形外框加中间一横，象征光芒！",
      },
    ],
  },

  // ── 场景二：雪地冒险（基础）──────────────────────────────────────────────
  {
    id: "snow",
    name: "小熊雪地冒险",
    subtitle: "在冬日雪地里，从树木、火焰、月亮的形状认识汉字",
    emoji: "🐼",
    bgGrad: "linear-gradient(160deg, hsl(210 55% 35%), hsl(230 50% 25%))",
    cardBg: "linear-gradient(135deg, hsl(210 55% 35%), hsl(220 50% 28%))",
    sceneEmoji: "❄️",
    objects: ["⛄", "🌨️", "🦊", "🏔️"],
    difficulty: 2,
    diffLabel: "基础",
    tasks: [
      {
        id: 1,
        // 场景名直接呈现"木"的视觉
        scene: "笔直挺立的大树干",
        instruction:
          "小熊走到一棵高大的树木旁，用爪子摸了摸树干——竖直的树干像一竖，横向伸展的树枝像一横，下面两条树根向两侧斜伸入土。这棵树的整体形状，就像一个汉字！是什么字？",
        target: "木",
        choices: ["木", "火", "土", "口"],
        hint: "树干是一竖，树枝是一横，两条树根向下斜伸——合起来就是这个字！",
        correct: "木",
        successMsg: "很棒！【木】的字形就是一棵树：横是枝，竖是干，撇捺是根！",
      },
      {
        id: 2,
        // 场景名直接呈现"火"的视觉
        scene: "跳动的篝火火焰",
        instruction:
          "夜晚好冷！小熊点燃了一堆篝火。火焰向上跳动，中间一团主火苗最高，两侧各有一点小火星迸溅而出。这熊熊燃烧的火焰，长得像一个汉字，是什么字？",
        target: "火",
        choices: ["水", "火", "山", "日"],
        hint: "中间火苗最高，两边各有一个迸出的小火点——这就是这个字的样子！",
        correct: "火",
        successMsg: "正确！【火】的字形像燃烧的火苗，两侧各有一点就是迸溅的火星！",
      },
      {
        id: 3,
        // 场景名直接呈现"月"的视觉
        scene: "弯弯挂天的月牙",
        instruction:
          "夜深了，小熊抬起头，看见天空中挂着一弯银色的月牙——不是圆形，而是左边直、右边弯的半圆形，里面还有两道横纹。这弯弯的月亮，用汉字怎么写？",
        target: "月",
        choices: ["日", "月", "木", "人"],
        hint: "左边一竖直、右边一弯弧，里面两道横——像月牙的形状，跟圆圆的太阳不一样！",
        correct: "月",
        successMsg: "太好了！【月】像月牙：左直右弧，里面两横，和圆形的【日】不同！",
      },
    ],
  },

  // ── 场景三：海边探险（进阶）──────────────────────────────────────────────
  {
    id: "beach",
    name: "海边识字探险",
    subtitle: "在海浪与沙滩之间，从土地、双手、人影里认识汉字",
    emoji: "🦀",
    bgGrad: "linear-gradient(160deg, hsl(190 70% 30%), hsl(200 60% 20%))",
    cardBg: "linear-gradient(135deg, hsl(190 70% 30%), hsl(200 60% 22%))",
    sceneEmoji: "🌊",
    objects: ["🐚", "🦀", "⛵", "🐠"],
    difficulty: 3,
    diffLabel: "进阶",
    tasks: [
      {
        id: 1,
        // 场景名直接呈现"土"的意象
        scene: "松软的沙土大地",
        instruction:
          "海浪退去，螃蟹踩在松软的沙土上。小螃蟹说：'你看，大地的形状是——上面一根短横，下面一根长横，中间用一竖连接起来，代表土层堆积在地面上。'这是什么汉字？",
        target: "土",
        choices: ["土", "山", "水", "手"],
        hint: "上短下长，中间一竖——想象土层：短横是土堆顶部，长横是宽广的地面！",
        correct: "土",
        successMsg: "答对了！【土】上短横是土堆，下长横是大地，一竖连通上下！",
      },
      {
        id: 2,
        // 场景名直接呈现"手"的视觉
        scene: "张开捡贝壳的双手",
        instruction:
          "小朋友伸出自己的手，五根手指张开，向下弯腰去捡贝壳。看看自己的手掌——三根横线代表手指的纹路，一竖是手臂，下面一钩是手腕。这是什么汉字？",
        target: "手",
        choices: ["口", "手", "人", "火"],
        hint: "伸开你的手掌看看：三横是手指纹，一竖是手臂，连起来就是这个字！",
        correct: "手",
        successMsg: "真棒！【手】三横代表手指，一竖是手臂——就是你自己的手的样子！",
      },
      {
        id: 3,
        // 场景名直接呈现"人"的视觉
        scene: "夕阳下站立的人影",
        instruction:
          "夕阳西下，沙滩上一个人直立站着——左脚向前迈出一步，右腿撑地，在沙滩上拉出长长的影子。这个两腿撑起的站立身影，就是一个汉字的形状，是什么字？",
        target: "人",
        choices: ["人", "口", "土", "月"],
        hint: "一撇是左腿向前迈出，一捺是右腿向后支撑——两腿撑起就是一个站立的人！",
        correct: "人",
        successMsg: "非常好！【人】一撇一捺就像两条腿，代表站立行走的我们每个人！",
      },
    ],
  },
];

const DIFF_COLORS: Record<number, string> = {
  1: "hsl(var(--mint))",
  2: "hsl(var(--sky))",
  3: "hsl(var(--coral))",
};

type AppPhase = "sceneSelect" | "intro" | "task" | "success" | "complete";

function SceneBackground({ bg, emoji, objects }: { bg: string; emoji: string; objects: string[] }) {
  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ background: bg, minHeight: 180 }}>
      <div className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 30% 30%, white, transparent 70%)" }} />
      <div className="absolute inset-0 flex items-end justify-around pb-3 px-4">
        {objects.map((obj, i) => (
          <span key={i} className="text-3xl select-none"
            style={{ animationName: "float", animationDuration: `${2.5 + i * 0.4}s`, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: `${i * 0.3}s` }}>
            {obj}
          </span>
        ))}
      </div>
      <div className="flex justify-center pt-6 pb-14">
        <span className="text-7xl drop-shadow-lg animate-float">{emoji}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12"
        style={{ background: "linear-gradient(to top, hsl(var(--background) / 0.6), transparent)" }} />
    </div>
  );
}

export default function ContextLearning({ onComplete, onLearnChar }: ContextLearningProps) {
  const [appPhase, setAppPhase] = useState<AppPhase>("sceneSelect");
  const [scene, setScene] = useState<SceneConfig | null>(null);
  const [taskIdx, setTaskIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const task = scene ? scene.tasks[taskIdx] : null;

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSelect = (choice: string) => {
    if (selected || !task) return;
    setSelected(choice);
    if (choice === task.correct) {
      const pts = wrongCount === 0 ? 34 : wrongCount === 1 ? 22 : 11;
      setScore((s) => s + pts);
      setCompletedTasks((prev) => [...prev, task.correct]);
      onLearnChar?.(task.correct);
      setTimeout(() => setAppPhase("success"), 400);
    } else {
      setWrongCount((c) => c + 1);
      setTimeout(() => setSelected(null), 700);
    }
  };

  const handleNext = () => {
    if (!scene) return;
    const next = taskIdx + 1;
    if (next >= scene.tasks.length) {
      setAppPhase("complete");
    } else {
      setTaskIdx(next);
      setAppPhase("task");
      setSelected(null);
      setWrongCount(0);
      setShowHint(false);
    }
  };

  const handleSelectScene = (s: SceneConfig) => {
    setScene(s);
    setTaskIdx(0);
    setSelected(null);
    setWrongCount(0);
    setShowHint(false);
    setScore(0);
    setCompletedTasks([]);
    setAppPhase("intro");
  };

  // ── Scene selection ──
  if (appPhase === "sceneSelect") {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl overflow-hidden p-5 text-center"
          style={{ background: "linear-gradient(135deg, hsl(150 50% 25%), hsl(200 55% 22%))" }}>
          <div className="text-4xl mb-2 animate-float">🗺️</div>
          <h2 className="font-display font-black text-xl text-white">选择探索场景</h2>
          <p className="text-sm text-white/70 font-bold mt-1">每个场景学习 3 个汉字，从简到难</p>
        </div>

        {SCENES.map((s) => (
          <button key={s.id} onClick={() => handleSelectScene(s)}
            className="rounded-3xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ boxShadow: "var(--shadow-playful)" }}>
            <div className="p-4 flex items-center gap-4 text-white" style={{ background: s.cardBg }}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0">
                {s.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-black text-lg">{s.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25">
                    {s.diffLabel}
                  </span>
                </div>
                <div className="text-sm text-white/80 font-bold">{s.subtitle}</div>
                <div className="flex gap-1 mt-2">
                  {s.tasks.map((t) => (
                    <span key={t.id} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      {t.target}
                    </span>
                  ))}
                </div>
              </div>
              <Map className="w-5 h-5 text-white/60 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (!scene || !task) return null;
  const diffColor = DIFF_COLORS[scene.difficulty];

  // ── Complete screen ──
  if (appPhase === "complete") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-7xl animate-float">🏆</div>
        <h2 className="font-display font-black text-2xl text-foreground">{scene.name}完成！</h2>
        <p className="text-muted-foreground font-bold">
          你认识了 {scene.tasks.length} 个汉字！
        </p>
        <div className="flex gap-3">
          {scene.tasks.map((t) => (
            <div key={t.id} className="flex flex-col items-center gap-1 rounded-2xl p-3 border-2 border-primary/30 bg-primary/5 w-16">
              <span className="text-3xl font-serif font-bold" style={{ color: diffColor }}>{t.target}</span>
              <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--mint))" }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl font-bold gap-2"
            onClick={() => { setAppPhase("sceneSelect"); setScene(null); }}>
            <RotateCcw className="w-4 h-4" /> 换个场景
          </Button>
          <Button className="rounded-2xl font-bold" onClick={() => onComplete(Math.min(score, 100))}>
            完成学习
          </Button>
        </div>
      </div>
    );
  }

  // ── Intro screen ──
  if (appPhase === "intro") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl overflow-hidden relative p-6 text-center"
          style={{ background: scene.cardBg, minHeight: 220 }}>
          <div className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(ellipse at center, white, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="text-6xl mb-3 animate-float">{scene.emoji}</div>
            <h2 className="font-display font-black text-2xl text-white">{scene.name}</h2>
            <p className="text-white/80 font-bold mt-2 text-sm leading-relaxed">{scene.subtitle}</p>
            <div className="flex justify-center gap-3 mt-4">
              {scene.tasks.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-serif font-bold text-white">
                    {t.target}
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
              `在情境中认识 ${scene.tasks.length} 个汉字`,
              "根据字形和故事线索判断汉字",
              "遇到不懂的字可以查看提示",
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-center text-sm font-bold text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary">{i + 1}</div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <Button className="h-14 text-lg font-display font-black rounded-2xl gap-2"
          style={{ background: scene.cardBg, border: "none", color: "white" }}
          onClick={() => setAppPhase("task")}>
          <span>{scene.emoji}</span> 开始探索！
        </Button>
      </div>
    );
  }

  // ── Task / Success screens ──
  return (
    <div className="flex flex-col gap-4">
      {/* Back + progress */}
      <div className="flex items-center gap-2">
        <button onClick={() => setAppPhase("sceneSelect")}
          className="text-xs font-bold text-muted-foreground underline underline-offset-2">
          ← 返回选场景
        </button>
        <div className="flex-1 flex items-center gap-1">
          {scene.tasks.map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full transition-all"
              style={{
                background: i < taskIdx ? "hsl(var(--mint))" : i === taskIdx ? diffColor : "hsl(var(--muted))",
              }} />
          ))}
          <span className="text-xs font-bold text-muted-foreground ml-1">{taskIdx + 1}/{scene.tasks.length}</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full border"
          style={{ borderColor: diffColor, color: diffColor, background: `${diffColor}18` }}>
          {scene.diffLabel}
        </span>
      </div>

      {/* Scene */}
      <SceneBackground bg={scene.bgGrad} emoji={scene.sceneEmoji} objects={scene.objects} />

      {/* Task card */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-base">{scene.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground mb-1">{task.scene}</p>
            <p className="text-sm font-bold text-foreground leading-relaxed">{task.instruction}</p>
            <button onClick={() => handleSpeak(task.instruction)}
              className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
              <Volume2 className="w-3.5 h-3.5" /> 朗读题目
            </button>
          </div>
        </div>
      </div>

      {/* Choices */}
      {appPhase === "task" && (
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-2 ml-1">点击你认为正确的汉字：</p>
          <div className="grid grid-cols-4 gap-2">
            {task.choices.map((choice) => {
              const isSelected = selected === choice;
              const isCorrect = isSelected && choice === task.correct;
              const isWrong = isSelected && choice !== task.correct;
              return (
                <button key={choice} onClick={() => handleSelect(choice)}
                  className="rounded-2xl border-2 py-4 text-3xl font-serif font-bold transition-all active:scale-95"
                  style={{
                    borderColor: isCorrect ? "hsl(var(--mint))" : isWrong ? "hsl(var(--coral))" : "hsl(var(--border))",
                    background: isCorrect ? "hsl(var(--mint-light))" : isWrong ? "hsl(var(--coral-light))" : "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    transform: isSelected ? "scale(0.96)" : undefined,
                  }}>
                  {choice}
                </button>
              );
            })}
          </div>

          {wrongCount > 0 && !showHint && (
            <button className="mt-3 text-sm font-bold text-primary underline-offset-2 underline"
              onClick={() => setShowHint(true)}>
              💡 查看提示
            </button>
          )}
          {showHint && (
            <div className="mt-3 rounded-xl border border-primary/20 px-3 py-2 text-sm font-bold text-foreground animate-star-pop"
              style={{ background: "hsl(var(--primary) / 0.08)" }}>
              提示：{task.hint}
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {appPhase === "success" && (
        <div className="rounded-2xl p-4 text-center animate-star-pop"
          style={{ background: "linear-gradient(135deg, hsl(var(--mint-light)), hsl(var(--sky-light)))" }}>
          <div className="text-4xl mb-2">🌟</div>
          <p className="font-display font-bold text-base text-foreground">{task.successMsg}</p>
          <div className="flex justify-center mt-3">
            <div className="text-6xl font-serif font-bold" style={{ color: diffColor }}>{task.target}</div>
          </div>
          <Button className="mt-4 rounded-2xl font-bold gap-2" onClick={handleNext}>
            {taskIdx < scene.tasks.length - 1 ? "继续探索" : "完成探索"} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
