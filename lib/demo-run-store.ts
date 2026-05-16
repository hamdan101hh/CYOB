import type { IntakePayload } from "@/lib/schemas/intake";

export type DemoRunRecord = {
  runId: string;
  userId: string;
  intake: IntakePayload;
  status: "queued" | "running" | "complete" | "failed";
  current_agent: number;
  agent_status: string | null;
  outputs: Record<
    number,
    { agent_name: string; output_text: string; output_json: unknown }
  >;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
};

const globalStore = globalThis as unknown as {
  __cyobDemoRuns?: Map<string, DemoRunRecord>;
};

function store() {
  if (!globalStore.__cyobDemoRuns) {
    globalStore.__cyobDemoRuns = new Map();
  }
  return globalStore.__cyobDemoRuns;
}

export function demoRunCreate(record: DemoRunRecord) {
  store().set(record.runId, record);
}

export function demoRunGet(runId: string): DemoRunRecord | undefined {
  return store().get(runId);
}

export function demoRunUpdate(
  runId: string,
  patch: Partial<DemoRunRecord>,
): DemoRunRecord | undefined {
  const cur = store().get(runId);
  if (!cur) return undefined;
  const next = { ...cur, ...patch };
  store().set(runId, next);
  return next;
}
