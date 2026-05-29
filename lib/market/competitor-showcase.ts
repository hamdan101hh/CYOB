/** Curated comparison narratives for homepage + dashboard demos (UAE delivery). */

export type ShowcaseComparison = {
  left: { name: string; color: string; spendPct: number };
  right: { name: string; color: string; spendPct: number };
  headline: string;
  trendSeries: { label: string; left: number; right: number }[];
  spendSplit: { label: string; value: number }[];
  contentShare: { label: string; left: number; right: number }[];
  insights: {
    title: string;
    body: string;
    tag: "customer" | "driver" | "positioning" | "content";
  }[];
};

export const TALABAT_VS_DELIVEROO: ShowcaseComparison = {
  left: { name: "talabat", color: "#ff5a00", spendPct: 42 },
  right: { name: "Deliveroo", color: "#00ccbc", spendPct: 38 },
  headline: "Meal frequency vs premium convenience",
  trendSeries: [
    { label: "Jan", left: 68, right: 62 },
    { label: "Feb", left: 71, right: 64 },
    { label: "Mar", left: 76, right: 67 },
    { label: "Apr", left: 79, right: 70 },
    { label: "May", left: 81, right: 72 },
  ],
  spendSplit: [
    { label: "Paid social", value: 34 },
    { label: "Creator", value: 28 },
    { label: "OOH", value: 18 },
    { label: "CRM", value: 20 },
  ],
  contentShare: [
    { label: "Reels", left: 44, right: 31 },
    { label: "Offers", left: 28, right: 22 },
    { label: "Founder POV", left: 12, right: 26 },
  ],
  insights: [
    {
      title: "Customer POV",
      body: "talabat wins on habit and deals; Deliveroo on speed perception and premium zones.",
      tag: "customer",
    },
    {
      title: "Driver POV",
      body: "Peak-hour incentives differ — talabat volume-led, Deliveroo route-density-led.",
      tag: "driver",
    },
    {
      title: "Content direction",
      body: "Creator meal drops vs chef collabs — different emotional hooks, same delivery window.",
      tag: "content",
    },
    {
      title: "Positioning",
      body: "Super-app adjacency (talabat) vs focused premium convenience (Deliveroo).",
      tag: "positioning",
    },
  ],
};
