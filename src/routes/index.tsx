import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { AiSummaryCard } from "@/components/mood/AiSummaryCard";
import { DayDetailDialog } from "@/components/mood/DayDetailDialog";
import { MoodCalendar } from "@/components/mood/MoodCalendar";
import { TodayCard } from "@/components/mood/TodayCard";
import { WeekChart } from "@/components/mood/WeekChart";
import { WeekStatsCard } from "@/components/mood/WeekStatsCard";
import {
  computeWeekStats,
  deleteMoodRecord,
  formatCnDate,
  getMoodRecords,
  moodBgClass,
  parseDateKey,
  saveMoodRecord,
  toDateKey,
  weekDays,
  weekdayCn,
  type MoodRecord,
} from "@/lib/mood";
import {
  generateWeeklySummary,
  type WeeklySummary,
} from "@/lib/weekly-summary.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "一周情绪日历 · 记录每天的心情" },
      {
        name: "description",
        content:
          "每天一句话加一个心情值，生成属于你的一周情绪地图与温和的 AI 周总结。数据保存在本地，私密无需注册。",
      },
      { property: "og:title", content: "一周情绪日历 · 记录每天的心情" },
      {
        property: "og:description",
        content: "每天 30 秒记录心情，看见这一周的情绪起伏。本地保存，私密无需注册。",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date());
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runSummary = useServerFn(generateWeeklySummary);

  useEffect(() => {
    setRecords(getMoodRecords());
  }, []);

  const today = toDateKey(new Date());
  const byDate = useMemo(() => new Map(records.map((r) => [r.date, r])), [records]);
  const days = useMemo(() => weekDays(new Date()), []);
  const weekRecords = useMemo(
    () => days.map((d) => byDate.get(toDateKey(d))).filter((r): r is MoodRecord => !!r),
    [days, byDate],
  );
  const stats = useMemo(() => computeWeekStats(weekRecords), [weekRecords]);
  const todayRecord = byDate.get(today) ?? null;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await runSummary({
        data: {
          week: `${days[0] ? toDateKey(days[0]) : today} ~ ${days[6] ? toDateKey(days[6]) : today}`,
          records: weekRecords.map((r) => ({
            date: weekdayCn(parseDateKey(r.date)),
            mood: r.mood,
            note: r.note,
          })),
        },
      });
      setSummary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成总结失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <header className="mx-auto max-w-screen-md px-6 pt-16 pb-12">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              {now.getFullYear()}年 · {formatCnDate(now)} · {weekdayCn(now)}
            </p>
            <h1 className="font-serif text-4xl leading-tight font-semibold text-balance">
              今天过得怎么样？
            </h1>
          </div>
          <div
            className={`size-10 rounded-full ring-1 ring-hairline ${
              todayRecord ? moodBgClass(todayRecord.mood) : "bg-mood-empty"
            }`}
          />
        </div>
      </header>

      <main className="mx-auto max-w-screen-md space-y-10 px-6">
        <TodayCard
          today={today}
          existing={todayRecord}
          onSave={(mood, note) => setRecords(saveMoodRecord({ date: today, mood, note }))}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WeekChart days={days} recordsByDate={byDate} onSelectDay={setSelected} />
          <WeekStatsCard stats={stats} />
        </div>

        <MoodCalendar
          month={month}
          recordsByDate={byDate}
          today={today}
          onSelectDay={setSelected}
          onPrevMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          onNextMonth={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        />

        <AiSummaryCard
          summary={summary}
          loading={loading}
          error={error}
          recordedDays={stats.recordedDays}
          onGenerate={handleGenerate}
        />

        <p className="text-center text-xs text-muted-foreground">
          所有记录只保存在这台设备的浏览器中。
        </p>
      </main>

      {selected && (
        <DayDetailDialog
          dateKey={selected}
          record={byDate.get(selected) ?? null}
          onClose={() => setSelected(null)}
          onSave={(dateKey, mood, note) => setRecords(saveMoodRecord({ date: dateKey, mood, note }))}
          onDelete={(dateKey) => {
            setRecords(deleteMoodRecord(dateKey));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
