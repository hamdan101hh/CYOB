import type { RunBundle } from "@/lib/data/get-run";

export type TrendItem = {
  name: string;
  heat: number;
  direction: string;
  channel?: string;
  evidence_url?: string;
};

export type GapItem = {
  name: string;
  severity: string;
  category?: string;
};

export type CompetitorItem = {
  name: string;
  positioning: string;
  threat: string;
};

export type PriorityItem = {
  title: string;
  logic?: string;
  horizon?: string;
};

export type HorizonItem = {
  years: number;
  prediction: string;
  confidence?: number;
};

export type CampaignItem = {
  name: string;
  type?: string;
  big_idea?: string;
};

export function parseRunDisplay(bundle: RunBundle) {
  const t2 = bundle.outputs[2]?.output_json as {
    trends?: TrendItem[];
  } | null;
  const t5 = bundle.outputs[5]?.output_json as {
    gaps?: GapItem[];
    top_critical?: string[];
  } | null;
  const t4 = bundle.outputs[4]?.output_json as {
    competitors?: CompetitorItem[];
  } | null;
  const t6 = bundle.outputs[6]?.output_json as {
    north_star?: string;
    priorities?: PriorityItem[];
  } | null;
  const t8 = bundle.outputs[8]?.output_json as {
    horizons?: HorizonItem[];
  } | null;
  const t7 = bundle.outputs[7]?.output_json as {
    campaigns?: CampaignItem[];
  } | null;
  const t9 = bundle.outputs[9]?.output_json as {
    one_page?: string;
    insights?: string[];
  } | null;

  return {
    trends: (t2?.trends ?? []).slice(0, 6),
    gaps: (t5?.gaps ?? []).slice(0, 6),
    competitors: (t4?.competitors ?? []).slice(0, 5),
    priorities: (t6?.priorities ?? []).slice(0, 5),
    northStar: t6?.north_star ?? null,
    horizons: (t8?.horizons ?? []).slice(0, 3),
    campaigns: (t7?.campaigns ?? []).slice(0, 4),
    memo: t9?.one_page ?? bundle.outputs[9]?.output_text ?? null,
    insights: t9?.insights ?? [],
  };
}
