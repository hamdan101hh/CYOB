import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";
import {
  buildMockOutputs,
  type AgentOutputPiece,
} from "@/lib/orchestrator/mock-outputs";
import type { AgentContext } from "@/lib/agents/context";

export async function runAgent(
  agentNumber: number,
  ctx: AgentContext,
): Promise<AgentOutputPiece> {
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
    };
  }

  if (process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY) {
    return {
      ...base,
      output_json: {
        ...base.output_json,
        live_models_pending: true,
        note: "API keys detected — wire model calls in lib/services next.",
      },
    };
  }

  return base;
}
