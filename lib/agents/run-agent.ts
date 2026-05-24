import { buildAgentPrompt } from "@/lib/agents/build-prompt";
import type { AgentContext } from "@/lib/agents/context";
import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";
import {
  buildMockOutputs,
  type AgentOutputPiece,
} from "@/lib/orchestrator/mock-outputs";
import { runCompetitorResearch } from "@/lib/services/competitor-research";
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
    const llm = await completeAgentText({
      system: prompt.system,
      user: `${prompt.user}\n\nWrite a detailed strategic report in markdown. Use headings and bullets.`,
    });
    if (llm?.text) {
      output_text = llm.text;
      costCents += llm.costCents;
      inputTokens = llm.inputTokens;
      outputTokens = llm.outputTokens;
      live = true;
    }
  }

  if (researchNote) {
    const label = researchSource
      ? researchSource.charAt(0).toUpperCase() + researchSource.slice(1)
      : "Web";
    output_text = `${output_text}\n\n## Competitor signals (${label})\n${researchNote}`;
  }

  const output_json = {
    ...base.output_json,
    prompt_version: prompt.version,
    prompt_agent: prompt.agent,
    live,
    model: live ? "llm" : "mock",
    input_tokens: inputTokens,
    output_tokens: outputTokens,
  };

  return {
    ...base,
    output_text,
    output_json,
    costCents,
    inputTokens,
    outputTokens,
    live,
  };
}
