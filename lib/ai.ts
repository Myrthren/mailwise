import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SummaryInput {
  userName: string;
  alerts: Array<{ type: string; message: string }>;
  watcherRuns: Array<{ status: string; result: string; watchers?: { name: string; type: string } }>;
  emailSummary: string[];
}

export async function generateSummary(input: SummaryInput): Promise<string> {
  const { alerts, watcherRuns, emailSummary } = input;

  const context = [
    alerts.length > 0 ? `Alerts triggered today: ${alerts.map((a) => a.message).join("; ")}` : null,
    emailSummary.length > 0 ? `Recent emails: ${emailSummary.slice(0, 10).join("; ")}` : null,
    watcherRuns.length > 0
      ? `Watcher activity: ${watcherRuns.map((r) => `${r.watchers?.name ?? "Unknown"} — ${r.result}`).join("; ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (!context) return "";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that writes concise, friendly daily summary paragraphs for a monitoring service. Write 2-3 sentences. Be specific, mention key facts. No fluff.",
      },
      {
        role: "user",
        content: `Summarise today's activity:\n${context}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? "";
}
