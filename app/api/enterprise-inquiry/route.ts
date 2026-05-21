import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, rateLimit } from "@/lib/api/rate-limit";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

const schema = z.object({
  email: z.string().email(),
  company: z.string().min(1).max(200),
  message: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`enterprise:${ip}`, 3, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inquiry" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClientOrNull();
  if (supabase) {
    await supabase.from("waitlist").insert({
      email: parsed.data.email,
      reason: "enterprise",
      metadata: {
        company: parsed.data.company,
        message: parsed.data.message ?? "",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Enterprise inquiry received.",
  });
}
