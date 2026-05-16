import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

const schema = z.object({
  email: z.string().email(),
  reason: z.string().max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClientOrNull();
  if (!supabase) {
    return NextResponse.json({ ok: true, queued: false });
  }

  await supabase.from("waitlist").insert({
    email: parsed.data.email,
    reason: parsed.data.reason ?? "general",
    metadata: parsed.data.metadata ?? {},
  });

  return NextResponse.json({ ok: true });
}
