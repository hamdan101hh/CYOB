import { NextResponse } from "next/server";

import { bootstrapAdminIfListed } from "@/lib/auth/bootstrap-admin";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

/** Promote ADMIN_EMAILS users after sign-in. Server-only — do not import from client. */
export async function POST(req: Request) {
  const route = await createSupabaseRouteHandlerClient(req);
  if (!route) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
    error,
  } = await route.supabase.auth.getUser();
  if (error || !user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await bootstrapAdminIfListed(user.id, user.email);
  return NextResponse.json({ ok: true });
}
