import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RunAsset = {
  id: string;
  asset_type: string;
  campaign_index: number | null;
  public_url: string | null;
  prompt: string | null;
};

export async function listRunAssets(runId: string): Promise<RunAsset[]> {
  const sb = await createSupabaseServerClient();
  if (!sb) return [];

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];

  const { data: run } = await sb
    .from("runs")
    .select("id")
    .eq("id", runId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!run) return [];

  const { data: rows } = await sb
    .from("generated_assets")
    .select("id,asset_type,campaign_index,public_url,prompt")
    .eq("run_id", runId)
    .order("created_at", { ascending: true });

  return (rows ?? []) as RunAsset[];
}
