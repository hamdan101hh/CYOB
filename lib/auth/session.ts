import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUser() {
  const sb = await createSupabaseServerClient();
  if (!sb) {
    return { ok: false as const, status: 503, user: null, supabase: null };
  }

  const {
    data: { user },
    error,
  } = await sb.auth.getUser();

  if (error || !user) {
    return { ok: false as const, status: 401, user: null, supabase: sb };
  }

  return { ok: true as const, status: 200, user, supabase: sb };
}

export async function verifyRunOwnership(runId: string, userId: string) {
  const sb = await createSupabaseServerClient();
  if (!sb) return { ok: false as const, status: 503 };

  const { data: run } = await sb
    .from("runs")
    .select("id,user_id")
    .eq("id", runId)
    .maybeSingle();

  if (!run || run.user_id !== userId) {
    return { ok: false as const, status: 404 };
  }

  return { ok: true as const, status: 200, run };
}
