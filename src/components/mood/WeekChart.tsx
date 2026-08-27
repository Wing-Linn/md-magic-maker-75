import { moodVar, toDateKey, WEEKDAY_LABELS, type MoodRecord } from "@/lib/mood";

interface Props {
  days: Date[];
  recordsByDate: Map<string, MoodRecord>;
  onSelectDay: (dateKey: string) => void;
}

const W = 320;
const H = 160;
const PAD_X = 16;
const PAD_Y = 14;

export function WeekChart({ days, recordsByDate, onSelectDay }: Props) {
  const points = days.map((d, i) => {
    const key = toDateKey(d);
    const record = recordsByDate.get(key) ?? null;
    const x = PAD_X + (i * (W - PAD_X * 2)) / 6;
    const y = record ? PAD_Y + ((10 - record.mood) / 9) * (H - PAD_Y * 2) : null;
    return { key, record, x, y };
  });

  const segments: string[] = [];
  let current: string[] = [];
  for (const p of points) {
    if (p.y === null) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
    } else {
      current.push(`${p.x},${p.y}`);
    }
  }
  if (current.length > 1) segments.push(current.join(" "));

  return (
    <section className="animate-journal-in space-y-6 rounded-[20px] bg-surface p-6 ring-1 ring-hairline">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">一周情绪地图</h2>
        <span className="text-[10px] text-muted-foreground">点击圆点查看当天</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full overflow-visible" role="img" aria-label="一周情绪折线图">
        {[10, 7, 4, 1].map((v) => {
          const y = PAD_Y + ((10 - v) / 9) * (H - PAD_Y * 2);
          return (
            <g key={v}>
              <line x1={PAD_X} x2={W - PAD_X} y1={y} y2={y} stroke="var(--hairline)" strokeWidth={1} />
              <text x={0} y={y + 3} fontSize={8} fill="var(--muted-foreground)">
                {v}
              </text>
            </g>
          );
        })}

        {segments.map((seg) => (
          <polyline
            key={seg}
            points={seg}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
        ))}

        {points.map((p) =>
          p.y === null ? (
            <circle key={p.key} cx={p.x} cy={H - PAD_Y} r={3} fill="var(--mood-empty)" />
          ) : (
            <g key={p.key} className="cursor-pointer" onClick={() => onSelectDay(p.key)}>
              <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill={moodVar(p.record!.mood)}
                stroke="var(--ink)"
                strokeWidth={1}
              />
            </g>
          ),
        )}
      </svg>

      <div className="flex justify-between px-1 text-[10px] text-muted-foreground">
        {days.map((d, i) => (
          <span key={toDateKey(d)} className="flex-1 text-center">
            {WEEKDAY_LABELS[i]}
            {!recordsByDate.has(toDateKey(d)) && <span className="block text-[9px]">未记录</span>}
          </span>
        ))}
      </div>
    </section>
  );
}
