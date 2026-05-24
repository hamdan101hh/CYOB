import { NextResponse } from "next/server";
import { z } from "zod";

import { normalizeOtpInput } from "@/lib/auth/verify-email-otp";
import {
  createSupabaseRouteHandlerClient,
  jsonWithSupabaseCookies,
} from "@/lib/supabase/route-handler";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(6).max(10),
});

const OTP_TYPES = ["email", "signup", "recovery", "magiclink"] as const;

export async function POST(req: Request) {
  const route = await createSupabaseRouteHandlerClient(req);
  if (!route) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }
  const { supabase, cookieCarrier } = route;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const token = normalizeOtpInput(parsed.data.token);
  if (token.length < 6 || token.length > 8) {
    return NextResponse.json(
      { error: "Enter the full code from your latest email." },
      { status: 400 },
    );
  }

  let lastError = "Code expired or invalid. Tap Send new code and use the newest email.";

  for (const type of OTP_TYPES) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    if (!error && data.session) {
      return jsonWithSupabaseCookies(cookieCarrier, { ok: true });
    }
    if (error?.message) lastError = error.message;
  }

  return jsonWithSupabaseCookies(
    cookieCarrier,
    { error: lastError },
    { status: 401 },
  );
}
