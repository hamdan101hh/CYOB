import { env } from "@/lib/env";

export type LlmProviderId = "anthropic" | "openai" | "gemini";

/** Which LLM cyob uses first. Set LLM_PROVIDER=openai to prefer ChatGPT. */
export function resolveLlmOrder(): LlmProviderId[] {
  const forced = process.env.LLM_PROVIDER?.trim().toLowerCase();

  if (forced === "openai" && env.OPENAI_API_KEY) {
    return ["openai", "anthropic", "gemini"];
  }
  if (forced === "gemini" && env.GEMINI_API_KEY) {
    return ["gemini", "anthropic", "openai"];
  }
  if (forced === "anthropic" && env.ANTHROPIC_API_KEY) {
    return ["anthropic", "openai", "gemini"];
  }

  const order: LlmProviderId[] = [];
  if (env.ANTHROPIC_API_KEY) order.push("anthropic");
  if (env.OPENAI_API_KEY) order.push("openai");
  if (env.GEMINI_API_KEY) order.push("gemini");
  return order;
}

export function primaryLlmLabel(): string {
  const [first] = resolveLlmOrder();
  if (!first) return "Mock (no LLM keys)";
  if (first === "openai") {
    return `OpenAI (${env.OPENAI_MODEL ?? "gpt-4o-mini"})`;
  }
  if (first === "gemini") return "Gemini (gemini-2.0-flash)";
  return `Claude (${env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest"})`;
}
