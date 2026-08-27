import { moodBgClass, toDateKey, WEEKDAY_LABELS, type MoodRecord } from "@/lib/mood";

interface Props {
  month: Date;
  recordsByDate: Map<string, MoodRecord>;
  today: string;
  onSelectDay: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MoodCalendar({
  month,
  recordsByDate,
  today,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  return (
    <section className="animate-journal-in space-y-6 rounded-[20px] bg-surface p-8 ring-1 ring-hairline">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="上个月"
            className="size-7 rounded-full text-muted-foreground transition-colors hover:bg-surface-sunken"
          >
            ‹
          </button>
          <h2 className="font-serif text-lg font-medium">
            {year}年{m + 1}月 情绪日历
          </h2>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="下个月"
            className="size-7 rounded-full text-muted-foreground transition-colors hover:bg-surface-sunken"
          >
            ›
          </button>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-mood-1" />
            低落
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-mood-5" />
            开心
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-muted-foreground">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: leading }, (_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(year, m, i + 1);
          const key = toDateKey(date);
          const record = recordsByDate.get(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              className={`flex aspect-square flex-col items-center justify-center rounded-sm text-xs ring-1 ring-hairline transition-transform hover:scale-105 ${
                record ? moodBgClass(record.mood) : "bg-surface-sunken text-muted-foreground"
              } ${key === today ? "ring-2 ring-ink" : ""}`}
            >
              <span className="font-medium">{i + 1}</span>
              {record && <span className="text-[9px] opacity-70">{record.mood}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
