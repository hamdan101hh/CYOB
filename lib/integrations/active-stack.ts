import { env } from "@/lib/env";
import { primaryLlmLabel } from "@/lib/services/llm-router";

export type StackLayer = {
  capability: string;
  provider: string;
  detail: string;
  quality: "live" | "fallback" | "mock";
};

export function resolveActiveStack(): {
  layers: StackLayer[];
  llmPrimary: string;
  readyScore: number;
  readyTotal: number;
} {
  const layers: StackLayer[] = [];

  const llmPrimary = primaryLlmLabel();
  const llmQuality: StackLayer["quality"] =
    env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY
      ? "live"
      : "mock";

  layers.push({
    capability: "10 agents + refresh",
    provider: llmPrimary,
    detail: "Priority: Anthropic → OpenAI → Gemini",
    quality: llmQuality,
  });

  if (env.SERPER_API_KEY) {
    layers.push({
      capability: "Competitor research",
      provider: "Serper",
      detail: "Agent 4 live Google results",
      quality: "live",
    });
  } else if (env.TAVILY_API_KEY) {
    layers.push({
      capability: "Competitor research",
      provider: "Tavily",
      detail: "Serper not set — using Tavily",
      quality: "live",
    });
  } else {
    layers.push({
      capability: "Competitor research",
      provider: "Mock JSON",
      detail: "Add SERPER_API_KEY for live data",
      quality: "mock",
    });
  }

  if (env.FAL_KEY) {
    layers.push({
      capability: "Campaign images",
      provider: "fal.ai Flux schnell",
      detail: "Library hero frames",
      quality: "live",
    });
    const seedanceOn = process.env.ENABLE_SEEDANCE_VIDEO !== "false";
    layers.push({
      capability: "Concept video",
      provider: seedanceOn ? "Seedance (fal)" : "Off",
      detail: seedanceOn
        ? "5s clips for Concept B · ~$0.18/clip"
        : "Set ENABLE_SEEDANCE_VIDEO=true",
      quality: seedanceOn ? "live" : "mock",
    });
  } else {
    layers.push({
      capability: "Campaign images",
      provider: "Pollinations",
      detail: "Free URLs · add FAL_KEY for premium",
      quality: "fallback",
    });
  }

  if (env.RESEND_API_KEY) {
    layers.push({
      capability: "Email",
      provider: "Resend",
      detail: "Boss digest + SMTP with Supabase",
      quality: "live",
    });
  } else {
    layers.push({
      capability: "Email",
      provider: "Supabase default",
      detail: "Rate limits · add Resend SMTP",
      quality: "fallback",
    });
  }

  layers.push({
    capability: "Dubai / market charts",
    provider: "Curated lens",
    detail: "Rotate examples — no API cost",
    quality: "live",
  });

  const essentials = [
    Boolean(env.ANTHROPIC_API_KEY || env.GEMINI_API_KEY),
    Boolean(env.SERPER_API_KEY),
    Boolean(env.RESEND_API_KEY),
    Boolean(env.FAL_KEY),
  ];
  const readyScore = essentials.filter(Boolean).length;
  const readyTotal = essentials.length;

  return { layers, llmPrimary, readyScore, readyTotal };
}
