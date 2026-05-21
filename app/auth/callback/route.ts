import { NextResponse } from "next/server";

import { bootstrapAdminIfListed } from "@/lib/auth/bootstrap-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") ? requestedNext : "/";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const origin = appUrl || requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin),
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/login?error=supabase_not_configured", origin),
    );
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", origin),
    );
  }

  if (data.user.email) {
    await bootstrapAdminIfListed(data.user.id, data.user.email);
  }

  return NextResponse.redirect(new URL(next, origin));
}
