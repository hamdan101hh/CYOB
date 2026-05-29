import "server-only";

import { env } from "@/lib/env";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

function adminEmails(): Set<string> {
  const raw = env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** Promote ADMIN_EMAILS users to is_admin on first sign-in. */
export async function bootstrapAdminIfListed(userId: string, email: string) {
  const allowed = adminEmails();
  if (!allowed.has(email.trim().toLowerCase())) return;

  const admin = createSupabaseAdminClientOrNull();
  if (!admin) return;

  await admin.from("users").upsert(
    {
      id: userId,
      email,
      is_admin: true,
    },
    { onConflict: "id" },
  );
}
