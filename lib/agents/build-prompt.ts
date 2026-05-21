import type { AgentContext } from "@/lib/agents/context";
import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";
import { agent01SystemPreamble, PROMPT_VERSION as v01 } from "@/lib/prompts/agent-01";
import { agent02SystemPreamble, PROMPT_VERSION as v02 } from "@/lib/prompts/agent-02";
import { agent03SystemPreamble, PROMPT_VERSION as v03 } from "@/lib/prompts/agent-03";
import { agent04SystemPreamble, PROMPT_VERSION as v04 } from "@/lib/prompts/agent-04";
import { agent05SystemPreamble, PROMPT_VERSION as v05 } from "@/lib/prompts/agent-05";
import { agent06SystemPreamble, PROMPT_VERSION as v06 } from "@/lib/prompts/agent-06";
import { agent07SystemPreamble, PROMPT_VERSION as v07 } from "@/lib/prompts/agent-07";
import { agent08SystemPreamble, PROMPT_VERSION as v08 } from "@/lib/prompts/agent-08";
import { agent09SystemPreamble, PROMPT_VERSION as v09 } from "@/lib/prompts/agent-09";
import { agent10SystemPreamble, PROMPT_VERSION as v10 } from "@/lib/prompts/agent-10";

const PREAMBLES: Record<number, { text: string; version: number }> = {
  1: { text: agent01SystemPreamble, version: v01 },
  2: { text: agent02SystemPreamble, version: v02 },
  3: { text: agent03SystemPreamble, version: v03 },
  4: { text: agent04SystemPreamble, version: v04 },
  5: { text: agent05SystemPreamble, version: v05 },
  6: { text: agent06SystemPreamble, version: v06 },
  7: { text: agent07SystemPreamble, version: v07 },
  8: { text: agent08SystemPreamble, version: v08 },
  9: { text: agent09SystemPreamble, version: v09 },
  10: { text: agent10SystemPreamble, version: v10 },
};

export function buildAgentPrompt(agentNumber: number, ctx: AgentContext) {
  const def = AGENT_DEFINITIONS.find((a) => a.number === agentNumber);
  const preamble = PREAMBLES[agentNumber]?.text ?? "You are a cyob specialist agent.";
  const version = PREAMBLES[agentNumber]?.version ?? 1;

  const priorSummary = Object.entries(ctx.priorOutputs)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([n, o]) => `Agent ${n}: ${o.output_text.slice(0, 280)}`)
    .join("\n");

  return {
    version,
    agent: def?.name ?? `agent-${agentNumber}`,
    system: preamble,
    user: [
      `Company: ${ctx.intake.company}`,
      `Industry: ${ctx.intake.industry}`,
      `Geography: ${ctx.intake.geography}${ctx.intake.city ? ` (${ctx.intake.city})` : ""}`,
      `Size: ${ctx.intake.size}`,
      `Vibe: ${ctx.intake.vibe}`,
      `Audience: ${ctx.intake.audience}`,
      `Budget: ${ctx.intake.budget}`,
      `Tier: ${ctx.tier}`,
      priorSummary ? `Prior agents:\n${priorSummary}` : "No prior agent outputs yet.",
    ].join("\n"),
  };
}
