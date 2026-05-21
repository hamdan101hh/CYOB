import { redirect } from "next/navigation";

import { RunsHub } from "@/components/runs/runs-hub";
import { listUserRuns } from "@/lib/data/list-user-runs";

export default async function LibraryPage() {
  const { user, runs } = await listUserRuns();
  if (!user) redirect("/login?next=/library");

  return (
    <RunsHub
      title="Library"
      description="Pick a run to browse campaigns, prompts, and content assets."
      runs={runs}
      linkPrefix="library"
    />
  );
}
