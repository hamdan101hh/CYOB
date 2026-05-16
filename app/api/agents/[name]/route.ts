import { NextResponse } from "next/server";
import { z } from "zod";

import { runAgent } from "@/lib/agents/run-agent";
import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";

export async function GET(
  _req: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  const hit = AGENT_DEFINITIONS.find((a) => a.name === name);
  if (!hit) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }
  return NextResponse.json({ agent: hit.name, label: hit.label, status: "ready" });
}

const postSchema = z.object({
  intake: z.object({
    company: z.string(),
    industry: z.string(),
    geography: z.string(),
    vibe: z.string(),
  }),
  priorOutputs: z.record(z.string(), z.unknown()).optional(),
  tier: z
    .enum(["free", "spark", "studio", "enterprise"])
    .optional()
    .default("free"),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  const hit = AGENT_DEFINITIONS.find((a) => a.name === name);
  if (!hit) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const prior: Record<number, { output_json: unknown; output_text: string }> =
    {};
  for (const [k, v] of Object.entries(parsed.data.priorOutputs ?? {})) {
    if (v && typeof v === "object" && "output_text" in v) {
      prior[Number(k)] = v as { output_json: unknown; output_text: string };
    }
  }

  const output = await runAgent(hit.number, {
    intake: parsed.data.intake,
    priorOutputs: prior,
    tier: parsed.data.tier,
  });

  return NextResponse.json({ agent: name, output });
}
