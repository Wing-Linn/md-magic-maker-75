import { parseDateKey, weekdayCn, type WeekStats } from "@/lib/mood";

export function WeekStatsCard({ stats }: { stats: WeekStats }) {
  const items = [
    {
      label: "本周平均心情",
      value: stats.average === null ? "未记录" : `${stats.average.toFixed(1)} / 10`,
    },
    {
      label: "最高点",
      value: stats.highest
        ? `${weekdayCn(parseDateKey(stats.highest.date))} · ${stats.highest.mood}/10`
        : "未指定",
    },
    {
      label: "最低点",
      value: stats.lowest
        ? `${weekdayCn(parseDateKey(stats.lowest.date))} · ${stats.lowest.mood}/10`
        : "未指定",
    },
    { label: "记录天数", value: `${stats.recordedDays} / 7 天` },
    { label: "本周情绪跨度", value: stats.spread === null ? "未指定" : `${stats.spread}` },
  ];

  return (
    <section className="animate-journal-in grid grid-cols-2 gap-4 rounded-[20px] bg-surface p-6 ring-1 ring-hairline">
      {items.map((item) => (
        <div key={item.label} className="space-y-1 rounded-xl bg-surface-sunken p-4">
          <p className="text-[10px] tracking-wider text-muted-foreground">{item.label}</p>
          <p className="font-serif text-xl font-medium">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
