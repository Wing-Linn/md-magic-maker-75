import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  week: z.string(),
  records: z
    .array(
      z.object({
        date: z.string(),
        mood: z.number().min(1).max(10),
        note: z.string(),
      }),
    )
    .max(7),
});

export interface WeeklySummary {
  summary: string;
  happiest_day?: { date: string; reason: string };
  lowest_day?: { date: string; reason: string };
  pattern?: string;
  highlight?: string;
  gentle_suggestion?: string;
}

const SYSTEM_PROMPT = `你是一位温和的情绪记录助手，帮助用户回顾自己一周的心情记录。

严格遵守：
- 只能基于用户提供的文字与心情分值，不得虚构任何用户没有写过的事件。
- 明确区分事实与推测；推测时使用「也许」「看起来」等措辞。
- 禁止任何心理诊断或医学结论，禁止「你患有」「你的心理状态是」这类表达。
- 不要把一周的数据解释为长期人格特征。
- 如果记录少于 3 天，summary 中要明确说明「这一周记录较少，暂时无法总结明显规律」。
- 如果某一天没有文字记录，只能说明「这一天的心情值最高/最低，但没有留下文字记录。」
- 语气温和、简短、中文。

只返回 JSON，字段：summary, happiest_day{date,reason}, lowest_day{date,reason}, pattern, highlight, gentle_suggestion。`;

export const generateWeeklySummary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<WeeklySummary> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI 服务暂时不可用");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(data) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "weekly_summary",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: [
                "summary",
                "happiest_day",
                "lowest_day",
                "pattern",
                "highlight",
                "gentle_suggestion",
              ],
              properties: {
                summary: { type: "string" },
                happiest_day: {
                  type: "object",
                  additionalProperties: false,
                  required: ["date", "reason"],
                  properties: { date: { type: "string" }, reason: { type: "string" } },
                },
                lowest_day: {
                  type: "object",
                  additionalProperties: false,
                  required: ["date", "reason"],
                  properties: { date: { type: "string" }, reason: { type: "string" } },
                },
                pattern: { type: "string" },
                highlight: { type: "string" },
                gentle_suggestion: { type: "string" },
              },
            },
          },
        },
      }),
    });

    if (response.status === 429) throw new Error("请求有点频繁，请稍后再试。");
    if (response.status === 402) throw new Error("AI 额度已用完，请稍后再试。");
    if (!response.ok) throw new Error("生成总结失败，请稍后再试。");

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(content) as WeeklySummary;
  });
