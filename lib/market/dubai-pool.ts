import type {
  MarketCompanyCard,
  MarketComparePair,
  MarketTrendSignal,
} from "@/lib/market/types";

/** Curated UAE / Dubai examples — no paid API required. */
export const DUBAI_COMPANY_POOL: MarketCompanyCard[] = [
  {
    id: "careem",
    name: "Careem",
    sector: "Mobility · super-app",
    signalIndex: 78,
    signalLabel: "Brand momentum",
    series: [
      { label: "Jan", value: 62 },
      { label: "Feb", value: 66 },
      { label: "Mar", value: 71 },
      { label: "Apr", value: 74 },
      { label: "May", value: 78 },
    ],
    highlightTrend: "Founder POV on LinkedIn",
  },
  {
    id: "noon",
    name: "noon",
    sector: "E-commerce · marketplace",
    signalIndex: 72,
    signalLabel: "Search pull",
    series: [
      { label: "Jan", value: 58 },
      { label: "Feb", value: 61 },
      { label: "Mar", value: 65 },
      { label: "Apr", value: 69 },
      { label: "May", value: 72 },
    ],
    highlightTrend: "Mega-sale live streams",
  },
  {
    id: "talabat",
    name: "talabat",
    sector: "Food delivery",
    signalIndex: 81,
    signalLabel: "App engagement",
    series: [
      { label: "Jan", value: 70 },
      { label: "Feb", value: 73 },
      { label: "Mar", value: 76 },
      { label: "Apr", value: 79 },
      { label: "May", value: 81 },
    ],
    highlightTrend: "Creator meal drops",
  },
  {
    id: "property-finder",
    name: "Property Finder",
    sector: "Proptech",
    signalIndex: 65,
    signalLabel: "Lead quality index",
    series: [
      { label: "Jan", value: 52 },
      { label: "Feb", value: 55 },
      { label: "Mar", value: 58 },
      { label: "Apr", value: 62 },
      { label: "May", value: 65 },
    ],
    highlightTrend: "AI listing tours",
  },
  {
    id: "kitopi",
    name: "Kitopi",
    sector: "Cloud kitchen",
    signalIndex: 58,
    signalLabel: "Partner velocity",
    series: [
      { label: "Jan", value: 44 },
      { label: "Feb", value: 47 },
      { label: "Mar", value: 50 },
      { label: "Apr", value: 54 },
      { label: "May", value: 58 },
    ],
    highlightTrend: "B2B kitchen stories",
  },
  {
    id: "emaar",
    name: "Emaar",
    sector: "Real estate · lifestyle",
    signalIndex: 69,
    signalLabel: "Experience index",
    series: [
      { label: "Jan", value: 60 },
      { label: "Feb", value: 62 },
      { label: "Mar", value: 64 },
      { label: "Apr", value: 67 },
      { label: "May", value: 69 },
    ],
    highlightTrend: "Destination Reels",
  },
];

export const DUBAI_TREND_POOL: MarketTrendSignal[] = [
  {
    name: "Arabic-first Reels",
    channel: "Instagram",
    heat: 84,
    direction: "up",
    videoUrl: "https://www.youtube.com/results?search_query=UAE+arabic+instagram+reels+marketing",
  },
  {
    name: "Mall-to-mobile retargeting",
    channel: "Paid social",
    heat: 71,
    direction: "up",
    videoUrl: "https://www.youtube.com/results?search_query=Dubai+mall+marketing+digital",
  },
  {
    name: "Founder credibility loops",
    channel: "LinkedIn",
    heat: 76,
    direction: "up",
    videoUrl: "https://www.youtube.com/results?search_query=UAE+founder+personal+brand",
  },
  {
    name: "WhatsApp commerce flows",
    channel: "Messaging",
    heat: 68,
    direction: "flat",
    videoUrl: "https://www.youtube.com/results?search_query=WhatsApp+business+UAE",
  },
  {
    name: "Luxury quiet palettes",
    channel: "Brand film",
    heat: 62,
    direction: "up",
    videoUrl: "https://www.youtube.com/results?search_query=quiet+luxury+brand+UAE",
  },
  {
    name: "Sports sponsorship spikes",
    channel: "OOH + TV",
    heat: 55,
    direction: "flat",
    videoUrl: "https://www.youtube.com/results?search_query=Dubai+sports+sponsorship+marketing",
  },
];

export const DUBAI_COMPARE_POOL: MarketComparePair[] = [
  { left: "Careem", right: "talabat", slogan: "Mobility story · meal frequency" },
  { left: "noon", right: "Amazon.ae", slogan: "Merch depth · delivery trust" },
  { left: "Property Finder", right: "Bayut", slogan: "Lead UX · agent tools" },
  { left: "Emaar", right: "Damac", slogan: "Experience · conversion craft" },
];

export function rotatePool<T>(pool: T[], count: number, seed: number): T[] {
  const out: T[] = [];
  const n = pool.length;
  for (let i = 0; i < count; i++) {
    out.push(pool[(seed + i) % n]!);
  }
  return out;
}
