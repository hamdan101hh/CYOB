export const AGENT_DEFINITIONS = [
  { number: 1, name: "industry-historian", label: "Industry Historian" },
  { number: 2, name: "trend-analyst", label: "Trend Analyst" },
  { number: 3, name: "company-research", label: "Company Research" },
  { number: 4, name: "competitor-scout", label: "Competitor Scout" },
  { number: 5, name: "gap-detection", label: "Gap Detection" },
  { number: 6, name: "strategic-planner", label: "Strategic Planner" },
  { number: 7, name: "content-creator", label: "Content Creator" },
  { number: 8, name: "future-engine", label: "Future Engine" },
  { number: 9, name: "master-synthesis", label: "Master Synthesis" },
  { number: 10, name: "document-generator", label: "Document Generator" },
] as const;

export function agentLabel(n: number): string {
  return AGENT_DEFINITIONS.find((a) => a.number === n)?.label ?? `Agent ${n}`;
}

export function listAgentTiles(currentAgent: number, status: string) {
  return AGENT_DEFINITIONS.map((a) => {
    let state: "done" | "active" | "idle";
    if (status === "complete") {
      state = "done";
    } else if (a.number < currentAgent) {
      state = "done";
    } else if (status === "running" && a.number === currentAgent) {
      state = "active";
    } else {
      state = "idle";
    }
    return { ...a, state };
  });
}
