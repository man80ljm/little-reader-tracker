import { useState } from "react";
import { Star, BookOpen, Mic, Pen, Eye, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionRecord {
  type: string;
  score: number;
  date: string;
  emoji: string;
}

interface LearningResultProps {
  sessions: SessionRecord[];
  learnedChars?: string[];
  onRestart?: () => void;
}

interface BadgeDef {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  condition: (s: SessionRecord[]) => boolean;
}

const BADGES_DEF: BadgeDef[] = [
  { id: "reader", emoji: "📖", label: "小小读者", desc: "完成阅读训练", condition: (s) => s.some((r) => r.type === "reading") },
  { id: "explorer", emoji: "🗺️", label: "汉字探险家", desc: "完成情境探索", condition: (s) => s.some((r) => r.type === "context") },
  { id: "calligrapher", emoji: "✍️", label: "描红小达人", desc: "完成汉字描红", condition: (s) => s.some((r) => r.type === "character") },
  { id: "tracker", emoji: "👁️", label: "追踪之星", desc: "完成视觉追踪", condition: (s) => s.some((r) => ["smooth", "saccade"].includes(r.type)) },
  { id: "persistent", emoji: "🔥", label: "坚持不懈", desc: "累计5次训练", condition: (s) => s.length >= 5 },
  { id: "allround", emoji: "🏆", label: "全能小学者", desc: "完成4种以上训练", condition: (s) => new Set(s.map((r) => r.type)).size >= 4 },
];

const CHAR_EXAMPLES = ["山", "水", "日", "月", "木", "火", "土"];

const NEXT_LESSONS = [
  { char: "水", desc: "认识【水】字，学习水的笔顺", emoji: "💧", type: "character" },
  { char: "木", desc: "在树林中认识【木】字", emoji: "🌳", type: "context" },
  { char: "日", desc: "认识【日】字，太阳的样子", emoji: "☀️", type: "character" },
];

export default function LearningResult({ sessions, learnedChars: learnedCharsProp = [], onRestart }: LearningResultProps) {
  const [showAll, setShowAll] = useState(false);

  const charSessions = sessions.filter((s) => s.type === "character" || s.type === "context");
  const voiceSessions = sessions.filter((s) => s.type === "reading" || s.type === "character");
  const strokeSessions = sessions.filter((s) => s.type === "character");
  const trainSessions = sessions.filter((s) => ["smooth", "saccade", "exercise"].includes(s.type));

  const earnedBadges = BADGES_DEF.filter((b) => b.condition(sessions));
  const stars = Math.min(earnedBadges.length + Math.floor(sessions.length / 2), 5);

  // Use localStorage-backed learnedChars if available, fallback to session-based
  const learnedChars = learnedCharsProp.length > 0
    ? learnedCharsProp
    : CHAR_EXAMPLES.slice(0, Math.max(0, Math.min(charSessions.length, CHAR_EXAMPLES.length)));
  const nextLesson = NEXT_LESSONS[sessions.length % NEXT_LESSONS.length];

  return (
    <div className="flex flex-col gap-5">
      {/* Hero result card */}
      <div
        className="rounded-3xl overflow-hidden text-center p-6"
        style={{ background: "linear-gradient(135deg, hsl(42 96% 70%), hsl(14 90% 70%))" }}
      >
        <div className="text-5xl mb-2 animate-float">🌟</div>
        <h2 className="font-display font-black text-2xl text-white">今日学习总结</h2>
        <p className="text-white/80 font-bold text-sm mt-1">
          {sessions.length > 0 ? "你今天表现非常棒！" : "还没有完成训练，加油哦！"}
        </p>
        {/* Stars */}
        <div className="flex justify-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="text-2xl transition-all"
              style={{ opacity: i <= stars ? 1 : 0.3, filter: i <= stars ? "none" : "grayscale(1)" }}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: <BookOpen className="w-5 h-5" />,
            label: "今日已学汉字",
            value: learnedChars.length,
            unit: "个",
            color: "hsl(var(--sky))",
            bg: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(200 60% 85%))",
          },
          {
            icon: <Mic className="w-5 h-5" />,
            label: "发音练习次数",
            value: voiceSessions.length,
            unit: "次",
            color: "hsl(var(--coral))",
            bg: "linear-gradient(135deg, hsl(var(--coral-light)), hsl(340 60% 88%))",
          },
          {
            icon: <Pen className="w-5 h-5" />,
            label: "笔顺完成情况",
            value: strokeSessions.length > 0 ? "已完成" : "未练习",
            unit: "",
            color: "hsl(var(--mint))",
            bg: "linear-gradient(135deg, hsl(var(--mint-light)), hsl(150 50% 88%))",
          },
          {
            icon: <Eye className="w-5 h-5" />,
            label: "视觉训练完成",
            value: trainSessions.length,
            unit: "项",
            color: "hsl(var(--lavender))",
            bg: "linear-gradient(135deg, hsl(var(--lavender-light)), hsl(270 50% 90%))",
          },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 border border-border" style={{ background: s.bg }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
              {s.icon}
              <span className="text-xs font-bold text-foreground opacity-70">{s.label}</span>
            </div>
            <div className="font-display font-black text-2xl" style={{ color: s.color }}>
              {s.value}
              <span className="text-sm font-bold ml-1 opacity-80">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Learned characters */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <span>✍️</span> 今日已学汉字
        </h3>
        <div className="flex flex-wrap gap-2">
          {learnedChars.map((char, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-serif text-2xl font-bold transition-all hover:scale-105"
              style={{
                borderColor: "hsl(var(--sky) / 0.5)",
                background: "linear-gradient(135deg, hsl(var(--sky-light)), hsl(var(--lavender-light)))",
                color: "hsl(var(--sky))",
              }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          获得的徽章
        </h3>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(showAll ? earnedBadges : earnedBadges.slice(0, 4)).map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-primary/5 px-3 py-2 animate-star-pop"
              >
                <span className="text-xl">{b.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-foreground">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            ))}
            {earnedBadges.length > 4 && (
              <button className="text-xs font-bold text-primary underline" onClick={() => setShowAll(!showAll)}>
                {showAll ? "收起" : `+${earnedBadges.length - 4} 个`}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-bold text-center py-2">
            完成更多训练来解锁徽章吧！✨
          </p>
        )}
      </div>

      {/* Next lesson recommendation */}
      <div className="rounded-2xl border-2 border-dashed border-primary/40 p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <span>🗺️</span> 推荐下一课
        </h3>
        <div className="flex items-center gap-4 rounded-xl p-3"
          style={{ background: "hsl(var(--muted))" }}>
          <div className="text-4xl font-serif font-bold w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "hsl(var(--sky-light))", color: "hsl(var(--sky))" }}>
            {nextLesson.char}
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm text-foreground">{nextLesson.desc}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{nextLesson.emoji} 汉字学习</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {onRestart && (
        <Button variant="outline" className="rounded-2xl font-bold gap-2 h-12" onClick={onRestart}>
          <RotateCcw className="w-4 h-4" /> 继续今日练习
        </Button>
      )}
    </div>
  );
}
