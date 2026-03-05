import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, ChevronDown } from "lucide-react";

interface ReadingTrainerProps {
  onComplete: (score: number) => void;
}

const PASSAGES = [
  {
    title: "小熊的大冒险",
    emoji: "🐻",
    words: "在 一 个 阳 光 明 媚 的 早 晨 ， 小 熊 醒 来 发 现 外 面 下 了 一 夜 的 大 雪 。 他 穿 上 厚 厚 的 冬 衣 ， 戴 上 红 色 的 围 巾 ， 迫 不 及 待 地 跑 出 了 小 屋 。 雪 地 上 留 下 了 他 一 串 串 小 脚 印 。 他 在 雪 地 里 打 滚 ， 堆 雪 人 ， 玩 得 不 亦 乐 乎 。".split(" ").filter(Boolean),
  },
  {
    title: "彩虹的秘密",
    emoji: "🌈",
    words: "小 雨 滴 从 天 上 落 下 来 ， 太 阳 公 公 探 出 了 头 。 当 阳 光 穿 过 雨 滴 的 时 候 ， 神 奇 的 事 情 发 生 了 。 天 空 中 出 现 了 一 道 美 丽 的 彩 虹 ， 红 橙 黄 绿 蓝 靛 紫 ， 七 种 颜 色 像 一 座 桥 一 样 挂 在 天 边 。 小 朋 友 们 都 跑 出 来 欣 赏 这 美 丽 的 景 色 。".split(" ").filter(Boolean),
  },
  {
    title: "海底世界",
    emoji: "🐠",
    words: "深 深 的 大 海 里 住 着 许 多 神 奇 的 小 动 物 。 五 彩 缤 纷 的 鱼 儿 在 珊 瑚 丛 中 穿 梭 嬉 戏 。 章 鱼 伸 展 着 它 的 八 条 触 手 ， 慢 悠 悠 地 游 来 游 去 。 海 星 静 静 地 趴 在 海 底 的 石 头 上 。 一 条 小 海 马 骑 着 水 流 ， 像 在 跳 舞 一 样 。".split(" ").filter(Boolean),
  },
];

const SPEEDS = [
  { label: "慢速", wpm: 60, color: "hsl(var(--mint))" },
  { label: "中速", wpm: 90, color: "hsl(var(--secondary))" },
  { label: "快速", wpm: 140, color: "hsl(var(--coral))" },
];

export default function ReadingTrainer({ onComplete }: ReadingTrainerProps) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const passage = PASSAGES[passageIdx];
  const speed = SPEEDS[speedIdx];
  const intervalMs = Math.round((60 / speed.wpm) * 1000);

  const start = () => {
    setCurrentWordIdx(0);
    setFinished(false);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setFinished(false);
    setCurrentWordIdx(-1);
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setCurrentWordIdx((prev) => {
        const next = prev + 1;
        if (next >= passage.words.length) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setFinished(true);
          onComplete(100);
          return prev;
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, intervalMs, passage.words.length, onComplete]);

  // Auto-scroll to highlighted word
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (currentWordIdx >= 0 && wordRefs.current[currentWordIdx]) {
      wordRefs.current[currentWordIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentWordIdx]);

  return (
    <div className="flex flex-col gap-6">
      {/* Passage selection */}
      <div className="grid grid-cols-3 gap-3">
        {PASSAGES.map((p, i) => (
          <button
            key={i}
            onClick={() => { if (!isRunning) { setPassageIdx(i); reset(); } }}
            className={`rounded-2xl p-3 border-2 text-center transition-all font-display font-bold text-sm
              ${passageIdx === i ? "border-primary bg-primary/20 scale-105 shadow-md" : "border-border bg-card hover:border-primary/50"}`}
          >
            <div className="text-2xl">{p.emoji}</div>
            <div className="text-xs mt-1 leading-tight">{p.title}</div>
          </button>
        ))}
      </div>

      {/* Speed selector */}
      <div className="flex gap-2">
        <span className="font-display font-bold text-sm text-muted-foreground self-center mr-1">速度：</span>
        {SPEEDS.map((s, i) => (
          <button
            key={i}
            onClick={() => { if (!isRunning) { setSpeedIdx(i); reset(); } }}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-bold text-sm transition-all
              ${speedIdx === i ? "scale-105 shadow-md text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"}`}
            style={speedIdx === i ? { borderColor: s.color, background: s.color + "22" } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Reading area */}
      <div className="relative rounded-3xl border-4 border-primary/30 bg-card overflow-hidden" style={{ minHeight: "200px" }}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3" style={{ background: "var(--gradient-card-sun)", opacity: 0.9 }}>
          <span className="text-2xl">{passage.emoji}</span>
          <span className="font-display font-bold text-foreground text-lg">{passage.title}</span>
        </div>

        {/* Text */}
        <div className="p-6 flex flex-wrap gap-2 max-h-64 overflow-y-auto">
          {passage.words.map((word, i) => (
            <span
              key={i}
              ref={(el) => (wordRefs.current[i] = el)}
              className={`font-body text-2xl font-bold px-2 py-1 rounded-lg transition-all duration-200
                ${i === currentWordIdx
                  ? "text-foreground scale-125 shadow-lg"
                  : i < currentWordIdx
                    ? "text-muted-foreground"
                    : "text-foreground"
                }`}
              style={i === currentWordIdx ? {
                background: speed.color,
                color: "white",
                transform: "scale(1.25)",
              } : {}}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Overlay when finished */}
        {finished && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-star-pop">
            <div className="text-center">
              <div className="text-5xl mb-2">📖</div>
              <p className="font-display font-black text-2xl">阅读完成！</p>
              <p className="text-muted-foreground">阅读速度：{speed.wpm} 字/分钟</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: currentWordIdx >= 0 ? `${((currentWordIdx + 1) / passage.words.length) * 100}%` : "0%",
            background: `linear-gradient(to right, ${speed.color}, hsl(var(--lavender)))`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <Button
            onClick={start}
            className="flex-1 h-12 text-lg font-display font-bold rounded-2xl"
            style={{ background: "var(--gradient-card-sun)", color: "hsl(var(--foreground))" }}
            disabled={finished}
          >
            <Play className="mr-2 w-5 h-5" />
            {finished ? "已完成" : currentWordIdx >= 0 ? "继续" : "开始阅读"}
          </Button>
        ) : (
          <Button
            onClick={pause}
            className="flex-1 h-12 text-lg font-display font-bold rounded-2xl"
            variant="outline"
          >
            <Pause className="mr-2 w-5 h-5" />
            暂停
          </Button>
        )}
        <Button variant="outline" onClick={reset} className="h-12 px-6 rounded-2xl border-2 font-display font-bold">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
