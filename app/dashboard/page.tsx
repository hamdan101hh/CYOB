import { redirect } from "next/navigation";

import { RunsHub } from "@/components/runs/runs-hub";
import { listUserRuns } from "@/lib/data/list-user-runs";

export default async function DashboardPage() {
  const { user, runs } = await listUserRuns();
  if (!user) redirect("/login?next=/dashboard");

  return (
    <RunsHub
      title="Dashboard"
      description="Open a completed run to view trends, gaps, and strategic priorities."
      runs={runs}
      linkPrefix="dashboard"
    />
  );
}
