import { NextResponse } from "next/server";

import { requireAdminGate } from "@/lib/auth/require-admin-gate";
import { pingProvider } from "@/lib/integrations/ping";
import { getIntegrationsStatus } from "@/lib/integrations/status";

export async function GET() {
  const gate = await requireAdminGate();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const status = await getIntegrationsStatus();
  return NextResponse.json(status);
}

export async function POST(req: Request) {
  const gate = await requireAdminGate();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    providerId?: string;
    full?: boolean;
  };

  if (body.action === "ping" && body.providerId) {
    const result = await pingProvider(body.providerId, { full: body.full });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
