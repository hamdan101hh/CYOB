import { after, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoRunCreate } from "@/lib/demo-run-store";
import { executeRunPipeline } from "@/lib/orchestrator/run-pipeline";
import { createRunSchema } from "@/lib/schemas/intake";
import type { IntakePayload } from "@/lib/schemas/intake";

export async function POST(req: Request) {
  const json: unknown = await req.json();
  const parsed = createRunSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { demo, ...rest } = parsed.data;
  const intake: IntakePayload = { ...rest, otp: "" };

  const allowDemo =
    process.env.NODE_ENV === "development" && demo === true;

  if (allowDemo) {
    const runId = crypto.randomUUID();
    demoRunCreate({
      runId,
      userId: "demo-user",
      intake,
      status: "queued",
      current_agent: 0,
      agent_status: null,
      outputs: {},
      error_message: null,
      started_at: null,
      completed_at: null,
    });
    after(() => {
      void executeRunPipeline(runId);
    });
    return NextResponse.json({ runId, demo: true });
  }

  const sb = await createSupabaseServerClient();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase is not configured for authenticated runs." },
      { status: 503 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await sb.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: intakeRow, error: intakeError } = await sb
    .from("intakes")
    .insert({
      user_id: user.id,
      company: rest.company,
      industry: rest.industry,
      geography: rest.geography,
      city: rest.city || null,
      size: rest.size,
      vibe: rest.vibe,
      audience: rest.audience,
      audience_type: rest.audience_type,
      budget: rest.budget,
      notes: rest.notes || null,
    })
    .select("id")
    .single();

  if (intakeError || !intakeRow) {
    return NextResponse.json(
      { error: intakeError?.message ?? "Could not create intake." },
      { status: 400 },
    );
  }

  const { data: runRow, error: runError } = await sb
    .from("runs")
    .insert({
      intake_id: intakeRow.id,
      user_id: user.id,
      status: "queued",
    })
    .select("id")
    .single();

  if (runError || !runRow) {
    return NextResponse.json(
      { error: runError?.message ?? "Could not create run." },
      { status: 400 },
    );
  }

  const runId = runRow.id as string;

  after(() => {
    void executeRunPipeline(runId);
  });

  return NextResponse.json({ runId, demo: false });
}
