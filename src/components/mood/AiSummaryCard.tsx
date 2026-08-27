import type { WeeklySummary } from "@/lib/weekly-summary.functions";

interface Props {
  summary: WeeklySummary | null;
  loading: boolean;
  error: string | null;
  recordedDays: number;
  onGenerate: () => void;
}

export function AiSummaryCard({ summary, loading, error, recordedDays, onGenerate }: Props) {
  return (
    <section className="animate-journal-in space-y-6 rounded-[20px] bg-night p-8 text-night-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="size-2 animate-pulse rounded-full bg-mood-4" />
          <h2 className="text-sm font-medium tracking-widest text-night-muted">AI 周总结</h2>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading || recordedDays === 0}
          className="rounded-full bg-mood-4 px-5 py-2 text-sm font-medium text-ink transition-opacity disabled:opacity-40"
        >
          {loading ? "正在回顾这一周…" : "✨ AI 总结这一周"}
        </button>
      </div>

      {recordedDays === 0 && !summary && (
        <p className="text-sm text-night-muted">先记录几天心情，就可以生成这一周的总结啦。</p>
      )}

      {error && <p className="text-sm text-mood-5">{error}</p>}

      {summary && (
        <div className="space-y-6">
          <p className="max-w-prose font-serif text-lg leading-relaxed">{summary.summary}</p>

          <div className="grid gap-4 border-t border-night-muted/30 pt-4 md:grid-cols-2">
            {summary.happiest_day && (
              <div className="space-y-1">
                <p className="text-[10px] text-night-muted">🌟 这周最开心的事</p>
                <p className="text-sm">
                  {summary.happiest_day.date} · {summary.happiest_day.reason}
                </p>
              </div>
            )}
            {summary.lowest_day && (
              <div className="space-y-1">
                <p className="text-[10px] text-night-muted">这周比较低落的时候</p>
                <p className="text-sm">
                  {summary.lowest_day.date} · {summary.lowest_day.reason}
                </p>
              </div>
            )}
            {summary.pattern && (
              <div className="space-y-1">
                <p className="text-[10px] text-night-muted">观察到的节奏</p>
                <p className="text-sm">{summary.pattern}</p>
              </div>
            )}
            {summary.gentle_suggestion && (
              <div className="space-y-1">
                <p className="text-[10px] text-night-muted">温和建议</p>
                <p className="text-sm">{summary.gentle_suggestion}</p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-night-muted">
            以上内容由 AI 根据你的记录生成，仅供回顾参考，不构成任何心理健康建议或诊断。
          </p>
        </div>
      )}
    </section>
  );
}
