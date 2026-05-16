import { PreparingClient } from "./preparing-client";

export default async function PreparingPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <PreparingClient runId={runId} />;
}
