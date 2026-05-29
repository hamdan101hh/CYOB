import type { SupabaseClient } from "@supabase/supabase-js";

/** Normalize pasted codes; Supabase may send 6–8 digits depending on project settings. */
export function normalizeOtpInput(raw: string): string {
  return raw.replace(/\D/g, "").trim();
}

export function isValidOtpLength(token: string): boolean {
  return token.length >= 6 && token.length <= 8;
}

export async function verifyEmailOtp(
  supabase: SupabaseClient,
  email: string,
  rawToken: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = normalizeOtpInput(rawToken);
  if (!isValidOtpLength(token)) {
    return {
      ok: false,
      message: "Enter the full code from your email (6–8 digits).",
    };
  }

  const types = ["email", "signup", "recovery", "magiclink"] as const;
  let lastMessage = "Code expired or invalid. Request a new code.";

  for (const type of types) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    if (!error && data.session) return { ok: true };
    if (error?.message) lastMessage = error.message;
  }

  return { ok: false, message: lastMessage };
}
