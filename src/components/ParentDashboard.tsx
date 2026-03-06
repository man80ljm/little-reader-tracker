import { useState } from "react";
import { Clock, BookOpen, CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionRecord {
  type: string;
  score: number;
  date: string;
  emoji: string;
}

interface ParentDashboardProps {
  sessions: SessionRecord[];
  learnedChars?: string[];
  onClearData?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  smooth: "平滑追踪",
  saccade: "快速扫视",
  reading: "阅读引导",
  exercise: "眼保健操",
  character: "汉字学习",
  context: "情境探索",
};

const COMMON_ERRORS = [
  { icon: "🔄", title: "笔顺混淆", desc: "在【山】字的竖折练习中，方向出现偏差", freq: "出现 2 次" },
  { icon: "👁️", title: "追踪速度偏快", desc: "扫视训练中点击反应略有滞后", freq: "出现 1 次" },
  { icon: "📖", title: "阅读节奏不稳", desc: "WPM 较低时注意力更集中，建议保持低速", freq: "观察到" },
];

const SUGGESTIONS = [
  "建议每天安排 10~15 分钟进行视觉追踪训练，早晨效果更佳。",
  "汉字描红练习可以与实物联系起来，例如看到山时复习【山】字。",
  "情境探索模块适合睡前学习，帮助儿童以轻松状态巩固记忆。",
  "若孩子连续出现同类错误，可暂停该练习，2天后再尝试。",
];

const MODULE_STATUS = [
  { id: "smooth", label: "平滑追踪", icon: "🔄", category: "视觉训练" },
  { id: "saccade", label: "快速扫视", icon: "⚡", category: "视觉训练" },
  { id: "reading", label: "阅读引导", icon: "📖", category: "阅读训练" },
  { id: "exercise", label: "眼保健操", icon: "💆", category: "眼部健康" },
  { id: "character", label: "汉字学习", icon: "✍️", category: "汉字学习" },
  { id: "context", label: "情境探索", icon: "🗺️", category: "汉字学习" },
];

export default function ParentDashboard({ sessions, learnedChars = [], onClearData }: ParentDashboardProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const completedTypes = new Set(sessions.map((s) => s.type));
  const totalMinutes = Math.round(sessions.length * 3.5); // ~3.5 min per session
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length)
    : 0;

  // Group by type
  const byType: Record<string, { scores: number[]; count: number }> = {};
  sessions.forEach((s) => {
    if (!byType[s.type]) byType[s.type] = { scores: [], count: 0 };
    byType[s.type].scores.push(s.score);
    byType[s.type].count++;
  });

  // learnedChars comes from props (localStorage-backed)

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-2xl p-4 border-2 border-border bg-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">👨‍👩‍👧</div>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">家长 / 教师观察报告</h2>
            <p className="text-xs text-muted-foreground font-bold">本周学习数据概览</p>
          </div>
        </div>
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Clock className="w-4 h-4" />, label: "训练时长", value: `${totalMinutes} 分钟` },
            { icon: <TrendingUp className="w-4 h-4" />, label: "平均得分", value: `${avgScore}%` },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: "完成模块", value: `${completedTypes.size} 项` },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-muted px-3 py-2 text-center">
              <div className="flex justify-center mb-1 text-muted-foreground">{s.icon}</div>
              <div className="font-display font-black text-base text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Module completion table */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "hsl(var(--sky))" }} />
          已完成训练模块
        </h3>
        <div className="flex flex-col gap-2">
          {MODULE_STATUS.map((mod) => {
            const done = completedTypes.has(mod.id);
            const data = byType[mod.id];
            const avg = data ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0;
            return (
              <div
                key={mod.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2 border transition-all"
                style={{
                  borderColor: done ? "hsl(var(--mint) / 0.4)" : "hsl(var(--border))",
                  background: done ? "hsl(var(--mint-light) / 0.4)" : "hsl(var(--muted) / 0.4)",
                }}
              >
                <span className="text-xl w-6 text-center">{mod.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{mod.label}</div>
                  <div className="text-xs text-muted-foreground">{mod.category}</div>
                </div>
                {done ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: "hsl(var(--mint))" }}>
                      均分 {avg}%
                    </span>
                    <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(var(--mint))" }} />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">未练习</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learned characters */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <span>✍️</span> 已学汉字
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {learnedChars.map((char, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl border flex items-center justify-center font-serif text-2xl font-bold"
              style={{
                borderColor: "hsl(var(--sky) / 0.4)",
                background: "hsl(var(--sky-light))",
                color: "hsl(var(--sky))",
              }}
            >
              {char}
            </div>
          ))}
          {learnedChars.length === 0 && (
            <p className="text-sm text-muted-foreground font-bold">尚未开始汉字学习</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-bold">
          累计学习 {learnedChars.length} 个汉字，建议下一步学习：水、木、火
        </p>
      </div>

      {/* Common errors */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" style={{ color: "hsl(var(--coral))" }} />
          常见错误记录
        </h3>
        <div className="flex flex-col gap-2">
          {COMMON_ERRORS.map((err, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border px-3 py-2 bg-background">
              <span className="text-xl mt-0.5">{err.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">{err.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{err.desc}</div>
              </div>
              <span className="text-xs font-bold text-muted-foreground flex-shrink-0 mt-0.5">{err.freq}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl bg-card border-2 border-border p-4">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          学习建议
        </h3>
        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 text-white"
                style={{ background: "hsl(var(--primary))" }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-xl bg-muted/60 border border-border px-4 py-3">
        <p className="text-xs text-muted-foreground font-bold leading-relaxed text-center">
          📌 本报告数据已通过本地存储保存，换人使用前请点击下方按钮清除数据
        </p>
      </div>

      {/* Clear data */}
      {onClearData && (
        <div className="rounded-2xl border-2 border-dashed border-border p-4">
          <h3 className="font-display font-bold text-sm mb-2 flex items-center gap-2 text-muted-foreground">
            <Trash2 className="w-4 h-4" style={{ color: "hsl(var(--coral))" }} />
            清除本地数据（换人使用前）
          </h3>
          {!confirmClear ? (
            <Button variant="outline" size="sm"
              className="rounded-xl font-bold border-dashed gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setConfirmClear(true)}>
              <Trash2 className="w-3.5 h-3.5" /> 清除所有训练记录
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-foreground">确定要清除全部记录吗？此操作不可撤销。</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl font-bold flex-1"
                  onClick={() => setConfirmClear(false)}>
                  取消
                </Button>
                <Button size="sm" className="rounded-xl font-bold flex-1 gap-1"
                  style={{ background: "hsl(var(--coral))", color: "white", border: "none" }}
                  onClick={() => { onClearData(); setConfirmClear(false); }}>
                  <Trash2 className="w-3.5 h-3.5" /> 确认清除
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
