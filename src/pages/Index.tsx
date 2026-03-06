import { useState } from "react";
import { Eye, BookOpen, Target, Trophy, Home, ChevronLeft, Sparkles, GraduationCap, Map, BarChart2, Users } from "lucide-react";
import SmoothPursuitTraining from "@/components/SmoothPursuitTraining";
import SaccadeTraining from "@/components/SaccadeTraining";
import ReadingTrainer from "@/components/ReadingTrainer";
import EyeExercise from "@/components/EyeExercise";
import ProgressPanel from "@/components/ProgressPanel";
import CharacterLearning from "@/components/CharacterLearning";
import ContextLearning from "@/components/ContextLearning";
import LearningResult from "@/components/LearningResult";
import ParentDashboard from "@/components/ParentDashboard";
import owlCharacter from "@/assets/owl-character.png";

type Screen =
  | "home"
  | "smooth"
  | "saccade"
  | "reading"
  | "exercise"
  | "progress"
  | "character"
  | "context"
  | "result"
  | "parent";

interface SessionRecord {
  type: string;
  score: number;
  date: string;
  emoji: string;
}

const NAV_ITEMS = [
  { id: "smooth" as Screen, label: "平滑追踪", desc: "训练眼球平滑移动", emoji: "🔄", bg: "var(--gradient-card-sky)", border: "hsl(var(--sky))" },
  { id: "saccade" as Screen, label: "快速扫视", desc: "训练眼球跳跃速度", emoji: "⚡", bg: "var(--gradient-card-coral)", border: "hsl(var(--coral))" },
  { id: "reading" as Screen, label: "阅读引导", desc: "跟随高亮词语阅读", emoji: "📖", bg: "var(--gradient-card-sun)", border: "hsl(var(--sun))" },
  { id: "exercise" as Screen, label: "眼保健操", desc: "8节标准眼部体操", emoji: "💆", bg: "linear-gradient(135deg, hsl(var(--lavender)), hsl(var(--mint)))", border: "hsl(var(--lavender))" },
];

const HANZI_ITEMS = [
  { id: "character" as Screen, label: "单字学习", desc: "认识汉字、学写笔顺", emoji: "✍️", bg: "linear-gradient(135deg, hsl(200 70% 55%), hsl(220 60% 60%))", border: "hsl(var(--sky))" },
  { id: "context" as Screen, label: "情境探索", desc: "在故事场景中识字", emoji: "🗺️", bg: "linear-gradient(135deg, hsl(150 55% 40%), hsl(200 55% 38%))", border: "hsl(var(--mint))" },
  { id: "result" as Screen, label: "学习成果", desc: "查看今日学习情况", emoji: "🌟", bg: "linear-gradient(135deg, hsl(42 90% 55%), hsl(14 85% 60%))", border: "hsl(var(--sun))" },
  { id: "parent" as Screen, label: "家长报告", desc: "训练数据与学习建议", emoji: "👨‍👩‍👧", bg: "linear-gradient(135deg, hsl(270 50% 58%), hsl(300 45% 55%))", border: "hsl(var(--lavender))" },
];

const SCREEN_TITLES: Record<Screen, string> = {
  home: "首页",
  smooth: "平滑追踪训练",
  saccade: "快速扫视训练",
  reading: "阅读引导训练",
  exercise: "眼保健操",
  progress: "我的成就",
  character: "单字学习 — 山",
  context: "情境学习 — 森林探索",
  result: "今日学习成果",
  parent: "家长 / 教师报告",
};

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const handleComplete = (type: string, emoji: string) => (score: number) => {
    setSessions((prev) => [
      ...prev,
      {
        type,
        score,
        date: new Date().toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        emoji,
      },
    ]);
  };

  const isHanziScreen = ["character", "context", "result", "parent"].includes(screen);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gradient-hero)" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        {screen !== "home" && (
          <button
            onClick={() => setScreen("home")}
            className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="font-display font-black text-xl text-foreground leading-none">
            {screen === "home" ? "👁️ 视觉追踪训练" : SCREEN_TITLES[screen]}
          </h1>
          {screen === "home" && (
            <p className="text-xs text-muted-foreground font-bold mt-0.5">儿童阅读视觉辅助 · 汉字学习系统</p>
          )}
        </div>
        <button
          onClick={() => setScreen("progress")}
          className={`relative w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors
            ${screen === "progress" ? "border-primary bg-primary/20" : "border-border hover:bg-muted"}`}
        >
          <Trophy className="w-5 h-5" />
          {sessions.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white"
              style={{ background: "hsl(var(--coral))" }}>
              {sessions.length > 9 ? "9+" : sessions.length}
            </span>
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div className="flex flex-col gap-6">
            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden p-6 text-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(var(--lavender-light)))" }}>
              <div className="absolute top-4 right-4 text-4xl opacity-20 select-none">✨✨</div>
              <img src={owlCharacter} alt="Reading owl character"
                className="w-32 h-32 mx-auto object-contain animate-float drop-shadow-lg" />
              <h2 className="font-display font-black text-2xl text-foreground mt-2">你好，小朋友！</h2>
              <p className="text-muted-foreground font-bold mt-1">今天要练习哪种眼睛运动或汉字学习呢？</p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-foreground">{sessions.length}</div>
                  <div className="text-xs text-muted-foreground font-bold">已训练</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-foreground">
                    {sessions.length > 0 ? `${Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length)}%` : "--"}
                  </div>
                  <div className="text-xs text-muted-foreground font-bold">平均分</div>
                </div>
              </div>
            </div>

            {/* Section: Visual training */}
            <div>
              <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2 text-foreground">
                <Eye className="w-4 h-4" style={{ color: "hsl(var(--sky))" }} />
                视觉追踪训练
              </h3>
              <div className="grid gap-3">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className="group relative rounded-3xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ boxShadow: "var(--shadow-playful)" }}
                  >
                    <div className="p-4 flex items-center gap-4 text-white" style={{ background: item.bg }}>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-black text-lg">{item.label}</div>
                        <div className="opacity-80 text-sm font-bold mt-0.5">{item.desc}</div>
                        {sessions.filter(s => s.type === item.id).length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/30 overflow-hidden">
                              <div className="h-full rounded-full bg-white/80"
                                style={{ width: `${Math.min(sessions.filter(s => s.type === item.id).length * 20, 100)}%` }} />
                            </div>
                            <span className="text-xs opacity-80">{sessions.filter(s => s.type === item.id).length} 次</span>
                          </div>
                        )}
                      </div>
                      <div className="text-white/60 text-2xl">›</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Hanzi learning */}
            <div>
              <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2 text-foreground">
                <GraduationCap className="w-4 h-4" style={{ color: "hsl(var(--lavender))" }} />
                汉字学习核心模块
              </h3>
              <div className="grid gap-3">
                {HANZI_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScreen(item.id)}
                    className="group relative rounded-3xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ boxShadow: "var(--shadow-playful)" }}
                  >
                    <div className="p-4 flex items-center gap-4 text-white" style={{ background: item.bg }}>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-black text-lg">{item.label}</div>
                        <div className="opacity-80 text-sm font-bold mt-0.5">{item.desc}</div>
                      </div>
                      <div className="text-white/60 text-2xl">›</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl bg-card border-2 border-border p-4">
              <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <span>💡</span> 训练小贴士
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { emoji: "👀", tip: "训练时保持头部不动，只用眼睛追踪目标" },
                  { emoji: "✍️", tip: "描红时按笔顺来写，慢慢来不要急" },
                  { emoji: "📅", tip: "坚持每天练习，效果会越来越好哦！" },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-lg">{t.emoji}</span>
                    <p className="text-sm text-muted-foreground font-bold">{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISUAL TRAINING SCREENS */}
        {screen === "smooth" && <SmoothPursuitTraining onComplete={handleComplete("smooth", "🔄")} />}
        {screen === "saccade" && <SaccadeTraining onComplete={handleComplete("saccade", "⚡")} />}
        {screen === "reading" && <ReadingTrainer onComplete={handleComplete("reading", "📖")} />}
        {screen === "exercise" && <EyeExercise onComplete={handleComplete("exercise", "💆")} />}
        {screen === "progress" && <ProgressPanel sessions={sessions} />}

        {/* HANZI LEARNING SCREENS */}
        {screen === "character" && <CharacterLearning onComplete={handleComplete("character", "✍️")} />}
        {screen === "context" && <ContextLearning onComplete={handleComplete("context", "🗺️")} />}
        {screen === "result" && <LearningResult sessions={sessions} onRestart={() => setScreen("home")} />}
        {screen === "parent" && <ParentDashboard sessions={sessions} />}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-card/90 backdrop-blur-md border-t border-border px-2 py-2">
        <div className="max-w-2xl mx-auto grid grid-cols-6 gap-1">
          {[
            { id: "home" as Screen, icon: <Home className="w-5 h-5" />, label: "首页" },
            { id: "smooth" as Screen, icon: <Eye className="w-5 h-5" />, label: "追踪" },
            { id: "saccade" as Screen, icon: <Target className="w-5 h-5" />, label: "扫视" },
            { id: "reading" as Screen, icon: <BookOpen className="w-5 h-5" />, label: "阅读" },
            { id: "character" as Screen, icon: <GraduationCap className="w-5 h-5" />, label: "汉字" },
            { id: "parent" as Screen, icon: <Users className="w-5 h-5" />, label: "报告" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setScreen(nav.id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all
                ${screen === nav.id ? "bg-primary/15 scale-105" : "hover:bg-muted"}`}
            >
              <div style={{ color: screen === nav.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                {nav.icon}
              </div>
              <span className={`text-xs font-bold ${screen === nav.id ? "text-foreground" : "text-muted-foreground"}`}>
                {nav.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
