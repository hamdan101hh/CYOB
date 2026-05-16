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
}
