import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UserRunRow = {
  id: string;
  status: string;
  created_at: string;
  agent_status: string | null;
  company: string | null;
};

export async function listUserRuns(limit = 20) {
  const sb = await createSupabaseServerClient();
  if (!sb) return { user: null, runs: [] as UserRunRow[] };

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { user: null, runs: [] as UserRunRow[] };

  const { data: runs } = await sb
    .from("runs")
    .select(
      "id,status,created_at,agent_status,intakes(company)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  const mapped: UserRunRow[] = (runs ?? []).map((r) => {
    const intake = r.intakes as { company?: string } | { company?: string }[] | null;
    const company = Array.isArray(intake)
      ? intake[0]?.company
      : intake?.company;
    return {
      id: r.id as string,
      status: r.status as string,
      created_at: (r.created_at as string) ?? new Date().toISOString(),
      agent_status: r.agent_status as string | null,
      company: company ?? null,
    };
  });

  return { user, runs: mapped };
}
