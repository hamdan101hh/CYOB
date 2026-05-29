import { buildAgentPrompt } from "@/lib/agents/build-prompt";
import type { AgentContext } from "@/lib/agents/context";
import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";
import {
  buildMockOutputs,
  type AgentOutputPiece,
} from "@/lib/orchestrator/mock-outputs";
import { runCompetitorResearch } from "@/lib/services/competitor-research";
import { runTrendResearch } from "@/lib/services/trend-research";
import { completeAgentText, isLlmConfigured } from "@/lib/services/llm";

export type RunAgentResult = AgentOutputPiece & {
  costCents: number;
  inputTokens: number;
  outputTokens: number;
  live: boolean;
};

export async function runAgent(
  agentNumber: number,
  ctx: AgentContext,
): Promise<RunAgentResult> {
  const prompt = buildAgentPrompt(agentNumber, ctx);
  const mock = buildMockOutputs({
    company: ctx.intake.company,
    industry: ctx.intake.industry,
    geography: ctx.intake.geography,
    vibe: ctx.intake.vibe,
  });

  const base = mock[agentNumber];
  if (!base) {
    const def = AGENT_DEFINITIONS.find((a) => a.number === agentNumber);
    return {
      agent_name: def?.name ?? `agent-${agentNumber}`,
      output_text: "Unknown agent.",
      output_json: { version: 1 },
      costCents: 0,
      inputTokens: 0,
      outputTokens: 0,
      live: false,
    };
  }

  let output_text = base.output_text;
  let costCents = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let live = false;
  let researchNote: string | undefined;
  let researchSource: string | undefined;
  let liveTrends: Awaited<ReturnType<typeof runTrendResearch>> | null = null;

  if (agentNumber === 2) {
    liveTrends = await runTrendResearch({
      company: ctx.intake.company,
      industry: ctx.intake.industry,
      geography: ctx.intake.geography,
      city: ctx.intake.city,
      vibe: ctx.intake.vibe,
    });
    if (liveTrends) {
      costCents += liveTrends.costCents;
      researchNote = liveTrends.digest;
      researchSource = `Live web · ${liveTrends.platforms.join(", ")}`;
    }
  }

  if (agentNumber === 4) {
    const research = await runCompetitorResearch({
      company: ctx.intake.company,
      industry: ctx.intake.industry,
      geography: ctx.intake.geography,
      tier: ctx.tier,
    });
    if (research) {
      researchNote = research.summary;
      researchSource = research.source;
      costCents += research.costCents;
    }
  }

  if (isLlmConfigured()) {
    const trendBlock =
      liveTrends && liveTrends.trends.length > 0
        ? `\n\n## Live trend scan (web — use these, do not invent new URLs)\nPlatforms: ${liveTrends.platforms.join(", ")}\n${liveTrends.digest}\n\nStructured trends JSON is pre-filled from real search results.`
        : "";

    const llm = await completeAgentText({
      system: prompt.system,
      user: `${prompt.user}${trendBlock}\n\nWrite a detailed strategic report in markdown. Use headings and bullets. Reference the live trend evidence URLs when provided.`,
    });
    if (llm?.text) {
      output_text = llm.text;
      costCents += llm.costCents;
      inputTokens = llm.inputTokens;
      outputTokens = llm.outputTokens;
      live = true;
    }
  }

  const output_json: Record<string, unknown> = {
    ...base.output_json,
    prompt_version: prompt.version,
    prompt_agent: prompt.agent,
    live: live || Boolean(liveTrends?.live),
    model: live ? "llm" : liveTrends?.live ? "live-trends" : "mock",
    input_tokens: inputTokens,
    output_tokens: outputTokens,
  };

  if (liveTrends && liveTrends.trends.length > 0) {
    output_json.trends = liveTrends.trends;
    output_json.trend_source = liveTrends.source;
    output_json.platforms_scanned = liveTrends.platforms;
    output_json.trend_queried_at = liveTrends.queried_at;
    output_json.live_trends = true;
    if (!live) {
      output_text = `${output_text}\n\n## Live trends (${liveTrends.platforms.join(", ")})\n${liveTrends.digest.slice(0, 1200)}`;
    }
  }

  if (researchNote && agentNumber === 4) {
    const label = researchSource
      ? researchSource.charAt(0).toUpperCase() + researchSource.slice(1)
      : "Web";
    output_json.competitor_research = researchNote;
    output_json.research_source = label;
    if (!live) {
      output_text = `${output_text}\n\n## Competitor signals (${label})\n${researchNote}`;
    }
  }

  return {
    ...base,
    output_text,
    output_json,
    costCents,
    inputTokens,
    outputTokens,
    live: live || Boolean(liveTrends?.live),
  };
}
