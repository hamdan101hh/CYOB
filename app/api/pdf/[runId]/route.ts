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

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  return NextResponse.json({
    run_id: runId,
    company: bundle.intake.company,
    pdf_ready: false,
    print_url: appUrl ? `${appUrl}/plan/${runId}?print=1` : `/plan/${runId}?print=1`,
    message: "Use print_url for browser print-to-PDF until Puppeteer is wired.",
  });
}
