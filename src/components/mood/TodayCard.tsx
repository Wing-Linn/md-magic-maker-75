import { useEffect, useState } from "react";
import { moodEmoji, moodLabel, moodVar, type MoodRecord } from "@/lib/mood";

interface Props {
  today: string;
  existing: MoodRecord | null;
  onSave: (mood: number, note: string) => void;
}

export function TodayCard({ today, existing, onSave }: Props) {
  const [mood, setMood] = useState(existing?.mood ?? 6);
  const [note, setNote] = useState(existing?.note ?? "");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setMood(existing?.mood ?? 6);
    setNote(existing?.note ?? "");
  }, [existing?.date, existing?.mood, existing?.note]);

  return (
    <section className="animate-journal-in rounded-[20px] bg-surface p-8 ring-1 ring-hairline">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <label htmlFor="mood-range" className="text-sm font-medium text-muted-foreground">
              我的心情
            </label>
            <span className="font-serif text-lg">
              {moodEmoji(mood)} {mood} / 10 · {moodLabel(mood)}
            </span>
          </div>
          <div className="relative py-4">
            <input
              id="mood-range"
              type="range"
              min={1}
              max={10}
              step={1}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="mood-slider"
              style={{ accentColor: moodVar(mood) }}
            />
            <div className="mt-4 flex justify-between text-[10px] font-medium tracking-widest text-muted-foreground">
              <span>😞 1</span>
              <span>平稳</span>
              <span>10 😄</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label htmlFor="mood-note" className="text-sm font-medium text-muted-foreground">
            今天发生了什么？
          </label>
          <textarea
            id="mood-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed outline-none placeholder:text-hairline"
            placeholder="一句话记录今天……"
          />
        </div>

        <div className="flex items-center justify-between border-t border-hairline pt-4">
          <span className="text-xs text-muted-foreground">
            {existing ? "今天已记录，可以随时修改" : `记录日期 · ${today}`}
          </span>
          <button
            type="button"
            onClick={() => {
              onSave(mood, note.trim());
              setJustSaved(true);
              window.setTimeout(() => setJustSaved(false), 1600);
            }}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-background transition-transform hover:bg-ink-soft active:scale-95"
          >
            {justSaved ? "已保存 ✓" : "保存今天"}
          </button>
        </div>
      </div>
    </section>
  );
}
