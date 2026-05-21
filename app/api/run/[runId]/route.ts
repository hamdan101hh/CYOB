import { after, NextResponse } from "next/server";

import { requireUser, verifyRunOwnership } from "@/lib/auth/session";
import { demoRunGet } from "@/lib/demo-run-store";
import { isMonthlyCapExceeded } from "@/lib/services/cap";
import { executeRunPipeline } from "@/lib/orchestrator/run-pipeline";

export async function POST(
  _req: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;

  if (process.env.NODE_ENV === "development" && demoRunGet(runId)) {
    after(() => {
      void executeRunPipeline(runId);
    });
    return NextResponse.json({ runId, started: true, demo: true });
  }

  const auth = await requireUser();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const access = await verifyRunOwnership(runId, auth.user.id);
  if (!access.ok) {
    return NextResponse.json({ error: "Not found" }, { status: access.status });
  }

  if (await isMonthlyCapExceeded()) {
    return NextResponse.json(
      { error: "Monthly API cap reached", code: "cap_hit" },
      { status: 429 },
    );
  }

  after(() => {
    void executeRunPipeline(runId);
  });
  return NextResponse.json({ runId, started: true });
}
