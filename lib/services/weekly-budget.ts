import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

/** ~100 AED/week default — tune via WEEKLY_BUDGET_AED on Vercel. */
const AED_TO_FILS = 100;
const DEFAULT_WEEKLY_AED = 100;

export function weeklyBudgetFils(): number {
  const aed = Number(process.env.WEEKLY_BUDGET_AED ?? DEFAULT_WEEKLY_AED);
  if (!Number.isFinite(aed) || aed <= 0) return DEFAULT_WEEKLY_AED * AED_TO_FILS;
  return Math.round(aed * AED_TO_FILS);
}

function weekKey(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86_400_000 + onejan.getDay() + 1) / 7,
  );
  return `${d.getFullYear()}-W${week}`;
}

/** Rough Serper cost per query (~$0.001) logged as 4 fils. */
export const SERPER_COST_FILS = 4;

export async function getWeeklySpendFils(): Promise<number> {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return 0;

  const start = new Date();
  start.setDate(start.getDate() - 7);

  const { data } = await admin
    .from("spending_log")
    .select("cost_cents")
    .gte("created_at", start.toISOString());

  if (!data?.length) return 0;
  return data.reduce((sum, row) => sum + (row.cost_cents as number), 0);
}

export async function canSpendFils(costFils: number): Promise<boolean> {
  const spent = await getWeeklySpendFils();
  return spent + costFils <= weeklyBudgetFils();
}

export async function logWeeklySpend(params: {
  userId?: string;
  runId?: string;
  service: string;
  costFils: number;
  notes?: string;
}) {
  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return;

  await admin.from("spending_log").insert({
    user_id: params.userId ?? null,
    run_id: params.runId ?? null,
    service: params.service,
    cost_cents: params.costFils,
    notes: params.notes ?? weekKey(),
  });
}
