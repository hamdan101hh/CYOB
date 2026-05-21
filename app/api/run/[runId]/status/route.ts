import { NextResponse } from "next/server";

import { demoRunGet } from "@/lib/demo-run-store";
import { getRunStatusFromDb } from "@/lib/data/get-run";

export async function GET(
  _req: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;

  const demo = demoRunGet(runId);
  if (demo) {
    return NextResponse.json({
      runId,
      demo: true,
      status: demo.status,
      current_agent: demo.current_agent,
      agent_status: demo.agent_status,
      error_message: demo.error_message,
    });
  }

  const live = await getRunStatusFromDb(runId);
  if (!live) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(live);
}
