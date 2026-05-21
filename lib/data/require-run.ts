import { notFound, redirect } from "next/navigation";

import { getRunBundle, type RunBundle } from "@/lib/data/get-run";
import { demoRunGet } from "@/lib/demo-run-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireRunBundle(
  runId: string,
  nextPath: string,
): Promise<RunBundle> {
  const bundle = await getRunBundle(runId);
  if (bundle) return bundle;

  if (demoRunGet(runId)) notFound();

  const sb = await createSupabaseServerClient();
  if (sb) {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }

  notFound();
}
