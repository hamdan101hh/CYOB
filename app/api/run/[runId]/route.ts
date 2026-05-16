import { after, NextResponse } from "next/server";

import { executeRunPipeline } from "@/lib/orchestrator/run-pipeline";

export async function POST(
  _req: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  after(() => {
    void executeRunPipeline(runId);
  });
  return NextResponse.json({ runId, started: true });
}
