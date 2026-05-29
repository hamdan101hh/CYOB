import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { enhancePromptRequestSchema } from "@/lib/schemas/asset-prompt";
import { buildStudioPlan } from "@/lib/services/prompt-studio";

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const json: unknown = await req.json();
  const parsed = enhancePromptRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { plan, live, costCents } = await buildStudioPlan(parsed.data);

  return NextResponse.json({ ok: true, plan, live, costCents });
}
