import { env } from "@/lib/env";
import type { LlmResult } from "@/lib/services/llm";

const GEMINI_MODEL = "gemini-2.0-flash";

/** Free-tier Google AI — used when no Anthropic/OpenAI key is set. */
export async function completeGeminiText(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<LlmResult | null> {
  const key = env.GEMINI_API_KEY;
  if (!key) return null;

  const maxTokens = params.maxTokens ?? 4096;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: params.system }] },
      contents: [{ role: "user", parts: [{ text: params.user }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Gemini error ${res.status}:`, err.slice(0, 300));
    return null;
  }

  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  };

  const text =
    json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) return null;

  const inputTokens = json.usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = json.usageMetadata?.candidatesTokenCount ?? 0;

  return {
    text,
    model: GEMINI_MODEL,
    inputTokens,
    outputTokens,
    costCents: 0,
  };
}
