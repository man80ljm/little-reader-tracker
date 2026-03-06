import { CHAR_EVOLUTION } from "@/data/hanziData";

interface Props {
  char: string;
}

export default function CharEvolutionStrip({ char }: Props) {
  const data = CHAR_EVOLUTION[char];
  if (!data) return null;

  const stages = [
    { label: data.oracle.label, desc: data.oracle.desc, svg: data.oracle.svg, isModern: false, colorIdx: 0 },
    { label: data.bronze.label, desc: data.bronze.desc, svg: data.bronze.svg, isModern: false, colorIdx: 1 },
    { label: "现代汉字", desc: "今天我们写的字", svg: undefined, isModern: true, colorIdx: 2 },
  ];

  return (
    <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
      <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
        <span>📜</span> 汉字的演化历程
      </p>
      <div className="flex items-center gap-1">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              {/* 图形区 */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: stage.isModern
                    ? "hsl(var(--primary) / 0.12)"
                    : i === 0
                    ? "hsl(35 60% 55% / 0.15)"
                    : "hsl(200 50% 50% / 0.12)",
                  border: stage.isModern
                    ? "1.5px solid hsl(var(--primary) / 0.35)"
                    : i === 0
                    ? "1.5px solid hsl(35 60% 55% / 0.4)"
                    : "1.5px solid hsl(200 50% 60% / 0.4)",
                }}
              >
                {stage.isModern ? (
                  <span
                    className="text-xl font-serif font-bold"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {char}
                  </span>
                ) : (
                  <svg
                    viewBox="0 0 40 40"
                    width="32"
                    height="32"
                    style={{ color: i === 0 ? "hsl(35 65% 45%)" : "hsl(200 55% 50%)" }}
                    dangerouslySetInnerHTML={{ __html: stage.svg! }}
                  />
                )}
              </div>
              {/* 标签 */}
              <span
                className="text-[10px] font-bold leading-tight text-center"
                style={{
                  color: stage.isModern
                    ? "hsl(var(--primary))"
                    : i === 0
                    ? "hsl(35 60% 45%)"
                    : "hsl(200 50% 50%)",
                }}
              >
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span className="text-muted-foreground text-xs flex-shrink-0 mb-4">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
