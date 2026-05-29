import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import { env } from "@/lib/env";
import { completeGeminiText } from "@/lib/services/gemini";
import { resolveLlmOrder, type LlmProviderId } from "@/lib/services/llm-router";

export type LlmResult = {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
};

const ANTHROPIC_MODEL = env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest";
const OPENAI_MODEL = env.OPENAI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function estimateAnthropicCostCents(input: number, output: number): number {
  return Math.ceil((input * 0.25 + output * 1.25) / 10_000);
}

function estimateOpenAiCostCents(input: number, output: number): number {
  return Math.ceil((input * 0.15 + output * 0.6) / 10_000);
}

export function isLlmConfigured(): boolean {
  return Boolean(
    env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY,
  );
}

async function completeWithProvider(
  provider: LlmProviderId,
  params: { system: string; user: string; maxTokens: number },
): Promise<LlmResult | null> {
  if (provider === "anthropic" && env.ANTHROPIC_API_KEY) {
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: params.maxTokens,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
    const inputTokens = msg.usage.input_tokens;
    const outputTokens = msg.usage.output_tokens;
    return {
      text,
      model: ANTHROPIC_MODEL,
      inputTokens,
      outputTokens,
      costCents: estimateAnthropicCostCents(inputTokens, outputTokens),
    };
  }

  if (provider === "openai" && env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      max_tokens: params.maxTokens,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    return {
      text,
      model: OPENAI_MODEL,
      inputTokens,
      outputTokens,
      costCents: estimateOpenAiCostCents(inputTokens, outputTokens),
    };
  }

  if (provider === "gemini" && env.GEMINI_API_KEY) {
    return completeGeminiText(params);
  }

  return null;
}

export async function completeAgentText(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<LlmResult | null> {
  const maxTokens = params.maxTokens ?? 4096;
  const order = resolveLlmOrder();

  for (const provider of order) {
    const result = await completeWithProvider(provider, {
      system: params.system,
      user: params.user,
      maxTokens,
    });
    if (result?.text) return result;
  }

  return null;
}
