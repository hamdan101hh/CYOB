import { redirect } from "next/navigation";

import { RunsHub } from "@/components/runs/runs-hub";
import { listUserRuns } from "@/lib/data/list-user-runs";

export default async function PlanPage() {
  const { user, runs } = await listUserRuns();
  if (!user) redirect("/login?next=/plan");

  return (
    <RunsHub
      title="Plan"
      description="Pick a run to open the six-month execution roadmap."
      runs={runs}
      linkPrefix="plan"
    />
  );
}
