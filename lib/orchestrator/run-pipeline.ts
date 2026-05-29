import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { runAgent } from "@/lib/agents/run-agent";
import type { AgentContext } from "@/lib/agents/context";
import { demoRunGet, demoRunUpdate } from "@/lib/demo-run-store";
import { AGENT_DEFINITIONS } from "@/lib/orchestrator/agent-metadata";
import { effectivePipelineTier } from "@/lib/features/content-access";
import { ensureCampaignAssets } from "@/lib/services/campaign-assets";
import {
  isMonthlyCapExceeded,
  recordPipelineAgentCost,
} from "@/lib/services/cap";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildCtx(
  intake: AgentContext["intake"],
  prior: AgentContext["priorOutputs"],
  tier: AgentContext["tier"],
): AgentContext {
  return { intake, priorOutputs: prior, tier };
}

async function markRunFailed(
  runId: string,
  message: string,
  userId?: string | null,
) {
  const demo = demoRunGet(runId);
  if (demo) {
    demoRunUpdate(runId, {
      status: "failed",
      agent_status: "Pipeline failed",
      error_message: message,
    });
    return;
  }

  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return;

  await admin
    .from("runs")
    .update({
      status: "failed",
      agent_status: "Pipeline failed",
      error_message: message.slice(0, 500),
    })
    .eq("id", runId);

  if (userId) {
    await recordPipelineAgentCost({
      userId,
      runId,
      agentNumber: 0,
      costCents: 0,
    });
  }
}

export async function executeRunPipeline(runId: string) {
  try {
    if (await isMonthlyCapExceeded()) {
      await markRunFailed(runId, "Monthly API cap reached");
      return;
    }

    const demo = demoRunGet(runId);
    if (demo) {
      demoRunUpdate(runId, {
        status: "running",
        started_at: new Date().toISOString(),
        current_agent: 0,
        agent_status: "Starting war room…",
        error_message: null,
      });

      const prior: AgentContext["priorOutputs"] = {};
      let outputs = demo.outputs;
      for (const agent of AGENT_DEFINITIONS) {
        await sleep(320);
        const ctx = buildCtx(
          {
            company: demo.intake.company,
            industry: demo.intake.industry,
            geography: demo.intake.geography,
            city: demo.intake.city,
            size: demo.intake.size,
            vibe: demo.intake.vibe,
            audience: demo.intake.audience,
            budget: demo.intake.budget,
          },
          prior,
          "free",
        );
        const piece = await runAgent(agent.number, ctx);
        prior[agent.number] = {
          output_json: piece.output_json,
          output_text: piece.output_text,
        };
        outputs = { ...outputs, [agent.number]: piece };
        demoRunUpdate(runId, {
          current_agent: agent.number,
          agent_status: `${agent.label} complete`,
          outputs,
        });
      }

      demoRunUpdate(runId, {
        status: "complete",
        current_agent: 10,
        agent_status: "All agents complete",
        completed_at: new Date().toISOString(),
      });
      return;
    }

    const admin = createSupabaseAdminClientOrNull();
    if (!admin) return;

    const { data: runRow } = await admin
      .from("runs")
      .select("intake_id,user_id")
      .eq("id", runId)
      .single();

  const { data: intakeRow } = runRow?.intake_id
    ? await admin
        .from("intakes")
        .select(
          "company,industry,geography,city,size,vibe,audience,audience_type,budget",
        )
        .eq("id", runRow.intake_id as string)
        .maybeSingle()
    : { data: null };

  const { data: userRow } = runRow?.user_id
    ? await admin
        .from("users")
        .select("tier")
        .eq("id", runRow.user_id as string)
        .maybeSingle()
    : { data: null };

  const tier = effectivePipelineTier(
    (userRow?.tier as AgentContext["tier"] | undefined) ?? "free",
  );

  const now = new Date().toISOString();
  await admin
    .from("runs")
    .update({
      status: "running",
      started_at: now,
      current_agent: 0,
      agent_status: "Starting war room…",
    })
    .eq("id", runId);

  const prior: AgentContext["priorOutputs"] = {};
  const intake = {
    company: (intakeRow?.company as string) ?? "Company",
    industry: (intakeRow?.industry as string) ?? "Industry",
    geography: (intakeRow?.geography as string) ?? "Global",
    city: (intakeRow?.city as string) ?? "",
    size: (intakeRow?.size as string) ?? "",
    vibe: (intakeRow?.vibe as string) ?? "Premium",
    audience: (intakeRow?.audience as string) ?? "",
    budget: (intakeRow?.budget as string) ?? "",
  };

    const userId = runRow?.user_id as string | undefined;

    for (const agent of AGENT_DEFINITIONS) {
      if (await isMonthlyCapExceeded()) {
        await markRunFailed(runId, "Monthly API cap reached", userId);
        return;
      }

      await sleep(320);
      await admin
        .from("runs")
        .update({
          current_agent: agent.number,
          agent_status: `${agent.label}…`,
          status: "running",
        })
        .eq("id", runId);

      const piece = await runAgent(
        agent.number,
        buildCtx(intake, prior, tier),
      );

      prior[agent.number] = {
        output_json: piece.output_json,
        output_text: piece.output_text,
      };

      await admin
        .from("agent_outputs")
        .delete()
        .eq("run_id", runId)
        .eq("agent_number", agent.number);

      await admin.from("agent_outputs").insert({
        run_id: runId,
        agent_number: agent.number,
        agent_name: piece.agent_name,
        status: "complete",
        output_text: piece.output_text,
        output_json: piece.output_json,
        input_tokens: piece.inputTokens,
        output_tokens: piece.outputTokens,
        cost_cents: piece.costCents,
      });

      if (userId) {
        await recordPipelineAgentCost({
          userId,
          runId,
          agentNumber: agent.number,
          costCents: piece.costCents,
        });
      }
    }

    const agent7Json = prior[7]?.output_json as {
      campaigns?: Array<{
        name: string;
        type?: string;
        big_idea?: string;
      }>;
    };

    await admin
      .from("runs")
      .update({
        status: "complete",
        current_agent: 10,
        agent_status: "Generating campaign visuals…",
        error_message: null,
      })
      .eq("id", runId);

    await ensureCampaignAssets({
      runId,
      userId,
      company: intake.company,
      industry: intake.industry,
      vibe: intake.vibe,
      campaigns: agent7Json?.campaigns ?? [],
    });

    await admin
      .from("runs")
      .update({
        status: "complete",
        agent_status: "All agents complete",
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Pipeline failed unexpectedly";
    await markRunFailed(runId, message);
  }
}
