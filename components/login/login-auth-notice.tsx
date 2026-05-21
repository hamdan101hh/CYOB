"use client";

import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, string> = {
  auth_failed: "Sign-in failed. Request a new code or magic link.",
  missing_code: "Sign-in link was incomplete. Try again from /login.",
  supabase_not_configured: "Auth is not configured on this deployment yet.",
};

export function LoginAuthNotice() {
  const params = useSearchParams();
  const code = params.get("error");
  if (!code) return null;

  return (
    <p className="mb-4 text-sm text-[var(--red)]" role="alert">
      {MESSAGES[code] ?? "Sign-in failed. Please try again."}
    </p>
  );
}
