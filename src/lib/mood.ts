export interface MoodRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-10
  note: string;
  createdAt: string;
  updatedAt?: string;
}

export const STORAGE_KEY = "mood-calendar-records";

export const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Monday as the first day of the week. */
export function startOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function moodLabel(mood: number): string {
  if (mood <= 2) return "很低落";
  if (mood <= 4) return "有点低落";
  if (mood <= 6) return "平稳";
  if (mood <= 8) return "不错";
  return "很开心";
}

export function moodEmoji(mood: number): string {
  if (mood <= 2) return "😞";
  if (mood <= 4) return "🙁";
  if (mood <= 6) return "😐";
  if (mood <= 8) return "🙂";
  return "😄";
}

/** 1-5 tier used by the mood color tokens (cool → warm). */
export function moodTier(mood: number): 1 | 2 | 3 | 4 | 5 {
  if (mood <= 2) return 1;
  if (mood <= 4) return 2;
  if (mood <= 6) return 3;
  if (mood <= 8) return 4;
  return 5;
}

const TIER_BG = {
  1: "bg-mood-1",
  2: "bg-mood-2",
  3: "bg-mood-3",
  4: "bg-mood-4",
  5: "bg-mood-5",
} as const;

export function moodBgClass(mood: number): string {
  return TIER_BG[moodTier(mood)];
}

export function moodVar(mood: number): string {
  return `var(--mood-${moodTier(mood)})`;
}

export function formatCnDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function weekdayCn(d: Date): string {
  return `周${WEEKDAY_LABELS[(d.getDay() + 6) % 7]}`;
}

// ---------- storage ----------

function read(): MoodRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is MoodRecord =>
        !!r && typeof r === "object" && typeof (r as MoodRecord).date === "string",
    );
  } catch {
    return [];
  }
}

function write(records: MoodRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getMoodRecords(): MoodRecord[] {
  return read().sort((a, b) => a.date.localeCompare(b.date));
}

export function saveMoodRecord(input: { date: string; mood: number; note: string }): MoodRecord[] {
  const records = read();
  const now = new Date().toISOString();
  const existing = records.find((r) => r.date === input.date);
  if (existing) {
    existing.mood = input.mood;
    existing.note = input.note;
    existing.updatedAt = now;
  } else {
    records.push({
      id: input.date.replaceAll("-", ""),
      date: input.date,
      mood: input.mood,
      note: input.note,
      createdAt: now,
    });
  }
  write(records);
  return getMoodRecords();
}

export function updateMoodRecord(
  date: string,
  patch: Partial<Pick<MoodRecord, "mood" | "note">>,
): MoodRecord[] {
  const records = read();
  const target = records.find((r) => r.date === date);
  if (target) {
    Object.assign(target, patch, { updatedAt: new Date().toISOString() });
    write(records);
  }
  return getMoodRecords();
}

export function deleteMoodRecord(date: string): MoodRecord[] {
  write(read().filter((r) => r.date !== date));
  return getMoodRecords();
}

export function clearAllMoodRecords(): MoodRecord[] {
  write([]);
  return [];
}

// ---------- stats ----------

export interface WeekStats {
  average: number | null;
  highest: MoodRecord | null;
  lowest: MoodRecord | null;
  recordedDays: number;
  spread: number | null;
}

export function computeWeekStats(records: MoodRecord[]): WeekStats {
  if (records.length === 0) {
    return { average: null, highest: null, lowest: null, recordedDays: 0, spread: null };
  }
  const sorted = [...records].sort((a, b) => a.mood - b.mood);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const average = records.reduce((sum, r) => sum + r.mood, 0) / records.length;
  return {
    average: Math.round(average * 10) / 10,
    highest,
    lowest,
    recordedDays: records.length,
    spread: highest.mood - lowest.mood,
  };
}
