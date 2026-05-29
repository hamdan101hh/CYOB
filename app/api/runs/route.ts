import { after, NextResponse } from "next/server";

import { clientIp, rateLimit } from "@/lib/api/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoRunCreate } from "@/lib/demo-run-store";
import { executeRunPipeline } from "@/lib/orchestrator/run-pipeline";
import {
  createRunSchema,
  normalizeIntakePayload,
} from "@/lib/schemas/intake";
import type { IntakePayload } from "@/lib/schemas/intake";

function getMissingColumnFromSchemaCacheError(message?: string): string | null {
  if (!message) return null;
  // Supabase/PostgREST example:
  // "Could not find the 'ai_tools_known' column of 'intakes' in the schema cache"
  const match = message.match(/'([^']+)' column of 'intakes'/i);
  return match?.[1] ?? null;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`runs:${ip}`, 8, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many run requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const json: unknown = await req.json();
  const parsed = createRunSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { demo, ...rest } = parsed.data;
  const intake: IntakePayload = normalizeIntakePayload(rest);

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

  const intakeInsert: Record<string, unknown> = {
    user_id: user.id,
    company: intake.company,
    industry: intake.industry,
    geography: intake.geography,
    city: intake.city || null,
    size: intake.size,
    vibe: intake.vibe,
    audience: intake.audience,
    audience_type: intake.audience_type,
    budget: intake.budget,
    notes: intake.notes || null,
    company_type: intake.company_type || null,
    website: intake.website || null,
    instagram: intake.instagram || null,
    social_links: intake.social_links || null,
    referral_source: intake.referral_source || null,
    ai_tools_known: intake.ai_tools_known || null,
  };

  let intakeRow: { id: string } | null = null;
  let intakeError: { message?: string } | null = null;

  // Backward-compatible retry for environments where latest intake columns
  // are not migrated yet. We progressively remove unknown columns and retry.
  for (let attempt = 0; attempt < 6; attempt++) {
    const result = await sb
      .from("intakes")
      .insert(intakeInsert)
      .select("id")
      .single();

    intakeRow = result.data as { id: string } | null;
    intakeError = result.error as { message?: string } | null;

    if (!intakeError && intakeRow) break;

    const missingColumn = getMissingColumnFromSchemaCacheError(
      intakeError?.message,
    );
    if (!missingColumn || !(missingColumn in intakeInsert)) break;
    delete intakeInsert[missingColumn];
  }

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
