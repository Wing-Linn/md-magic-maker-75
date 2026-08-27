import { useEffect, useState } from "react";
import {
  formatCnDate,
  moodEmoji,
  moodLabel,
  moodVar,
  parseDateKey,
  weekdayCn,
  type MoodRecord,
} from "@/lib/mood";

interface Props {
  dateKey: string;
  record: MoodRecord | null;
  onClose: () => void;
  onSave: (dateKey: string, mood: number, note: string) => void;
  onDelete: (dateKey: string) => void;
}

export function DayDetailDialog({ dateKey, record, onClose, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(!record);
  const [mood, setMood] = useState(record?.mood ?? 6);
  const [note, setNote] = useState(record?.note ?? "");
  const date = parseDateKey(dateKey);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
      />
      <div className="animate-journal-in relative w-full max-w-sm space-y-5 rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-hairline">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg font-medium">
            {weekdayCn(date)} · {formatCnDate(date)}
          </h3>
          <button type="button" onClick={onClose} className="text-muted-foreground">
            ✕
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">心情</span>
              <span>
                {moodEmoji(mood)} {mood}/10 · {moodLabel(mood)}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="mood-slider"
              style={{ accentColor: moodVar(mood) }}
              aria-label="心情值"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="一句话记录这一天……"
              className="min-h-[90px] w-full resize-none rounded-xl bg-surface-sunken p-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => (record ? setEditing(false) : onClose())}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(dateKey, mood, note.trim());
                  setEditing(false);
                }}
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-background"
              >
                保存
              </button>
            </div>
          </div>
        ) : record ? (
          <div className="space-y-4">
            <p className="text-sm">
              心情：{record.mood}/10 {moodEmoji(record.mood)} · {moodLabel(record.mood)}
            </p>
            <p className="rounded-xl bg-surface-sunken p-4 text-base leading-relaxed">
              {record.note ? `“${record.note}”` : "这一天没有留下文字记录。"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onDelete(dateKey)}
                className="rounded-full px-4 py-2 text-sm text-destructive"
              >
                删除
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-background"
              >
                编辑
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
