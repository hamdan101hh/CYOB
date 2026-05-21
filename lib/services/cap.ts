import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

export async function isMonthlyCapExceeded(): Promise<boolean> {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return false;

  const monthYear = new Date().toISOString().slice(0, 7);
  const { data } = await admin
    .from("monthly_cap")
    .select("cap_cents,spent_cents")
    .eq("month_year", monthYear)
    .maybeSingle();

  if (!data) return false;
  return (data.spent_cents as number) >= (data.cap_cents as number);
}

export async function logSpending(params: {
  userId: string;
  runId?: string;
  service: string;
  costCents: number;
  notes?: string;
}) {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return;

  await admin.from("spending_log").insert({
    user_id: params.userId,
    run_id: params.runId ?? null,
    service: params.service,
    cost_cents: params.costCents,
    notes: params.notes ?? null,
  });

  if (params.costCents > 0) {
    await bumpMonthlySpent(params.costCents);
  }
}

export async function bumpMonthlySpent(costCents: number) {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin || costCents <= 0) return;

  const monthYear = new Date().toISOString().slice(0, 7);
  const { data } = await admin
    .from("monthly_cap")
    .select("month_year,spent_cents")
    .eq("month_year", monthYear)
    .maybeSingle();

  if (data) {
    await admin
      .from("monthly_cap")
      .update({
        spent_cents: (data.spent_cents as number) + costCents,
      })
      .eq("month_year", monthYear);
    return;
  }

  await admin.from("monthly_cap").insert({
    month_year: monthYear,
    cap_cents: 20000,
    spent_cents: costCents,
  });
}

/** Track mock/zero-cost pipeline work for cap accounting hooks. */
export async function recordPipelineAgentCost(params: {
  userId: string;
  runId: string;
  agentNumber: number;
  costCents?: number;
}) {
  const cost = params.costCents ?? 0;
  await logSpending({
    userId: params.userId,
    runId: params.runId,
    service: `agent_${params.agentNumber}`,
    costCents: cost,
    notes: cost === 0 ? "mock pipeline" : undefined,
  });
}
