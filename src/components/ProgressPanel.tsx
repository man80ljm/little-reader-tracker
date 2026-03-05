import { useEffect, useState } from "react";
import { Trophy, Star, TrendingUp, BookOpen, Eye, Target } from "lucide-react";

interface SessionRecord {
  type: string;
  score: number;
  date: string;
  emoji: string;
}

interface ProgressPanelProps {
  sessions: SessionRecord[];
}

const BADGES = [
  { id: "first", label: "初学者", emoji: "🌱", desc: "完成第1次训练", condition: (s: SessionRecord[]) => s.length >= 1 },
  { id: "five", label: "坚持者", emoji: "🔥", desc: "完成5次训练", condition: (s: SessionRecord[]) => s.length >= 5 },
  { id: "ten", label: "小达人", emoji: "⭐", desc: "完成10次训练", condition: (s: SessionRecord[]) => s.length >= 10 },
  { id: "perfect", label: "完美追踪", emoji: "🎯", desc: "获得100分", condition: (s: SessionRecord[]) => s.some(r => r.score === 100) },
  { id: "reader", label: "小书虫", emoji: "📚", desc: "完成阅读训练", condition: (s: SessionRecord[]) => s.some(r => r.type === "reading") },
  { id: "saccade", label: "快眼侠", emoji: "⚡", desc: "扫视训练≥80分", condition: (s: SessionRecord[]) => s.some(r => r.type === "saccade" && r.score >= 80) },
];

const TYPE_ICONS: Record<string, string> = {
  smooth: "🔄",
  saccade: "⚡",
  reading: "📖",
  exercise: "💆",
};

const TYPE_LABELS: Record<string, string> = {
  smooth: "平滑追踪",
  saccade: "快速扫视",
  reading: "阅读引导",
  exercise: "眼保健操",
};

export default function ProgressPanel({ sessions }: ProgressPanelProps) {
  const totalSessions = sessions.length;
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length)
    : 0;

  const byType: Record<string, number[]> = {};
  sessions.forEach((s) => {
    byType[s.type] = byType[s.type] || [];
    byType[s.type].push(s.score);
  });

  const earnedBadges = BADGES.filter((b) => b.condition(sessions));
  const unearnedBadges = BADGES.filter((b) => !b.condition(sessions));

  return (
    <div className="flex flex-col gap-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Target className="w-5 h-5" />, label: "训练次数", value: totalSessions, bg: "var(--gradient-card-sky)" },
          { icon: <Star className="w-5 h-5" />, label: "平均得分", value: `${avgScore}%`, bg: "var(--gradient-card-sun)" },
          { icon: <Trophy className="w-5 h-5" />, label: "获得徽章", value: earnedBadges.length, bg: "var(--gradient-card-coral)" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 text-center text-white"
            style={{ background: s.bg }}
          >
            <div className="flex justify-center mb-1">{s.icon}</div>
            <div className="text-2xl font-display font-black">{s.value}</div>
            <div className="text-xs font-bold opacity-80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Training breakdown */}
      {Object.keys(byType).length > 0 && (
        <div className="bg-card rounded-2xl border-2 border-border p-4">
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            各项训练进度
          </h3>
          <div className="flex flex-col gap-3">
            {Object.entries(byType).map(([type, scores]) => {
              const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>{TYPE_ICONS[type]} {TYPE_LABELS[type] || type}</span>
                    <span className="text-muted-foreground">{scores.length}次 · 均分{avg}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${avg}%`,
                        background: type === "smooth"
                          ? "var(--gradient-card-sky)"
                          : type === "saccade"
                            ? "var(--gradient-card-coral)"
                            : "var(--gradient-card-sun)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      <div>
        <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          成就徽章
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const earned = earnedBadges.find((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-3 text-center border-2 transition-all
                  ${earned
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-muted/50 opacity-50 grayscale"
                  }`}
              >
                <div className={`text-3xl mb-1 ${earned ? "animate-float" : ""}`}>
                  {badge.emoji}
                </div>
                <div className="font-display font-bold text-xs text-foreground">{badge.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{badge.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mint" />
            最近训练记录
          </h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {[...sessions].reverse().slice(0, 10).map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-2">
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{TYPE_LABELS[s.type] || s.type}</div>
                  <div className="text-xs text-muted-foreground">{s.date}</div>
                </div>
                <div
                  className="font-display font-black text-lg"
                  style={{ color: s.score >= 80 ? "hsl(var(--mint))" : s.score >= 60 ? "hsl(var(--secondary))" : "hsl(var(--coral))" }}
                >
                  {s.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div className="text-center py-10">
          <div className="text-5xl mb-3 animate-float">🌟</div>
          <p className="font-display font-bold text-lg text-muted-foreground">开始第一次训练</p>
          <p className="text-sm text-muted-foreground">完成训练后在这里查看你的进步！</p>
        </div>
      )}
    </div>
  );
}
