import { NextResponse } from "next/server";
import { z } from "zod";

import { runAgent } from "@/lib/agents/run-agent";
import type { AgentContext } from "@/lib/agents/context";
import { getRunBundle } from "@/lib/data/get-run";
import { isMonthlyCapExceeded, recordPipelineAgentCost } from "@/lib/services/cap";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({ run_id: z.string().uuid() });

export async function POST(req: Request) {
  if (await isMonthlyCapExceeded()) {
    return NextResponse.json(
      { error: "Monthly API cap reached", code: "cap_hit" },
      { status: 429 },
    );
  }

  const json: unknown = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid run_id" }, { status: 400 });
  }

  const sb = await createSupabaseServerClient();
  if (!sb) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bundle = await getRunBundle(parsed.data.run_id);
  if (!bundle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prior: AgentContext["priorOutputs"] = {};
  for (const [n, o] of Object.entries(bundle.outputs)) {
    prior[Number(n)] = {
      output_json: o.output_json,
      output_text: o.output_text,
    };
  }

  const ctx: AgentContext = {
    intake: {
      company: bundle.intake.company,
      industry: bundle.intake.industry,
      geography: bundle.intake.geography,
      city: bundle.intake.city,
      size: bundle.intake.size,
      vibe: bundle.intake.vibe,
      audience: bundle.intake.audience,
      budget: bundle.intake.budget,
    },
    priorOutputs: prior,
    tier: bundle.tier,
  };

  const piece = await runAgent(2, ctx);

  await sb.from("trend_refreshes").insert({
    run_id: parsed.data.run_id,
    triggered_by: "manual",
    cost_cents: piece.costCents,
  });

  await sb
    .from("agent_outputs")
    .delete()
    .eq("run_id", parsed.data.run_id)
    .eq("agent_number", 2);

  await sb.from("agent_outputs").insert({
    run_id: parsed.data.run_id,
    agent_number: 2,
    agent_name: piece.agent_name,
    status: "complete",
    output_text: piece.output_text,
    output_json: piece.output_json,
    input_tokens: piece.inputTokens,
    output_tokens: piece.outputTokens,
    cost_cents: piece.costCents,
  });

  await recordPipelineAgentCost({
    userId: user.id,
    runId: parsed.data.run_id,
    agentNumber: 2,
    costCents: piece.costCents,
  });

  const trendMeta = piece.output_json as {
    live_trends?: boolean;
    platforms_scanned?: string[];
  };

  return NextResponse.json({
    ok: true,
    live: piece.live || Boolean(trendMeta.live_trends),
    platforms: trendMeta.platforms_scanned ?? [],
    message:
      trendMeta.live_trends
        ? `Live trends refreshed from web (${(trendMeta.platforms_scanned ?? []).join(", ") || "search"}).`
        : piece.live
          ? "Trend analyst refreshed with live model."
          : "Add SERPER_API_KEY for live Instagram/TikTok/Facebook/YouTube trend scans.",
  });
}
