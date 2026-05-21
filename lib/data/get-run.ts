import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoRunGet } from "@/lib/demo-run-store";
import { buildMockOutputs } from "@/lib/orchestrator/mock-outputs";
import type { IntakePayload } from "@/lib/schemas/intake";

export type RunBundle = {
  runId: string;
  demo: boolean;
  status: string;
  current_agent: number;
  agent_status: string | null;
  tier: "free" | "spark" | "studio" | "enterprise";
  intake: Pick<
    IntakePayload,
    | "company"
    | "industry"
    | "geography"
    | "city"
    | "size"
    | "vibe"
    | "audience"
    | "audience_type"
    | "budget"
    | "notes"
    | "email"
  >;
  outputs: Record<
    number,
    { agent_name: string; output_text: string; output_json: unknown }
  >;
};

function mapDemoToBundle(runId: string, demo: NonNullable<ReturnType<typeof demoRunGet>>): RunBundle {
  const { intake } = demo;
  const outputs =
    Object.keys(demo.outputs).length >= 10
      ? demo.outputs
      : buildMockOutputs({
          company: intake.company,
          industry: intake.industry,
          geography: intake.geography,
          vibe: intake.vibe,
        });

  return {
    runId,
    demo: true,
    status: demo.status,
    current_agent: demo.current_agent,
    agent_status: demo.agent_status,
    tier: "free",
    intake: {
      company: intake.company,
      industry: intake.industry,
      geography: intake.geography,
      city: intake.city ?? "",
      size: intake.size,
      vibe: intake.vibe,
      audience: intake.audience,
      audience_type: intake.audience_type,
      budget: intake.budget,
      notes: intake.notes ?? "",
      email: intake.email,
    },
    outputs,
  };
}

export async function getRunBundle(runId: string): Promise<RunBundle | null> {
  const demo = demoRunGet(runId);
  if (demo) {
    return mapDemoToBundle(runId, demo);
  }

  const sb = await createSupabaseServerClient();
  if (!sb) return null;

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: run, error: runErr } = await sb
    .from("runs")
    .select(
      "id,status,current_agent,agent_status,user_id,intake_id",
    )
    .eq("id", runId)
    .maybeSingle();

  if (runErr || !run) return null;
  if (run.user_id !== user.id) return null;

  const { data: intakeRow, error: intakeErr } = await sb
    .from("intakes")
    .select(
      "company,industry,geography,city,size,vibe,audience,audience_type,budget,notes",
    )
    .eq("id", run.intake_id as string)
    .maybeSingle();

  if (intakeErr || !intakeRow) return null;

  const { data: userRow } = await sb
    .from("users")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();

  const tier = (userRow?.tier as RunBundle["tier"] | undefined) ?? "free";

  const { data: outputRows } = await sb
    .from("agent_outputs")
    .select("agent_number,agent_name,output_text,output_json")
    .eq("run_id", runId);

  const outputs: RunBundle["outputs"] = {};
  for (const row of outputRows ?? []) {
    outputs[row.agent_number as number] = {
      agent_name: row.agent_name as string,
      output_text: (row.output_text as string) ?? "",
      output_json: row.output_json,
    };
  }

  return {
    runId,
    demo: false,
    status: run.status as string,
    current_agent: run.current_agent as number,
    agent_status: run.agent_status as string | null,
    tier,
    intake: {
      ...(intakeRow as Omit<RunBundle["intake"], "email">),
      email: user.email ?? "",
    },
    outputs,
  };
}

export async function getRunStatusFromDb(runId: string) {
  const sb = await createSupabaseServerClient();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data: run } = await sb
    .from("runs")
    .select("id,status,current_agent,agent_status,error_message,user_id")
    .eq("id", runId)
    .maybeSingle();
  if (!run || run.user_id !== user.id) return null;
  return {
    runId,
    demo: false,
    status: run.status as string,
    current_agent: run.current_agent as number,
    agent_status: run.agent_status as string | null,
    error_message: run.error_message as string | null,
  };
}
