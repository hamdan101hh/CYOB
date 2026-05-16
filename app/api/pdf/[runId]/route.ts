import { NextResponse } from "next/server";

import { getRunBundle } from "@/lib/data/get-run";

export async function GET(
  _req: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const { runId } = await context.params;
  const bundle = await getRunBundle(runId);
  if (!bundle) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  return NextResponse.json({
    run_id: runId,
    company: bundle.intake.company,
    pdf_ready: false,
    message: "Puppeteer PDF rendering is scaffolded for provider setup; use /plan for print preview meanwhile.",
  });
}
