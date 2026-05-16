import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

/**
 * Service-role client for API routes only. Never import from client components.
 */
export function createSupabaseAdminClient() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createSupabaseAdminClientOrNull() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}
