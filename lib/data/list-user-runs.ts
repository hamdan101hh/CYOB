import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listUserRuns(limit = 20) {
  const sb = await createSupabaseServerClient();
  if (!sb) return { user: null, runs: [] };

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { user: null, runs: [] };

  const { data: runs } = await sb
    .from("runs")
    .select("id,status,created_at,agent_status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { user, runs: runs ?? [] };
}
