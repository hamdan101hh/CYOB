export type MarketMetricPoint = {
  label: string;
  value: number;
};

export type MarketTrendSignal = {
  name: string;
  channel: string;
  heat: number;
  direction: "up" | "flat" | "down";
  videoUrl: string;
};

export type MarketCompanyCard = {
  id: string;
  name: string;
  sector: string;
  /** Index 0–100 — not pricing. */
  signalIndex: number;
  signalLabel: string;
  series: MarketMetricPoint[];
  highlightTrend: string;
};

export type MarketComparePair = {
  left: string;
  right: string;
  slogan: string;
};

export type MarketLens = {
  regionLabel: string;
  companies: MarketCompanyCard[];
  trends: MarketTrendSignal[];
  comparisons: MarketComparePair[];
  rotatedAt: string;
  source: "curated" | "live";
};
