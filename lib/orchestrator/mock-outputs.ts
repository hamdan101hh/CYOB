import type { IntakePayload } from "@/lib/schemas/intake";
import { isUaeMarket } from "@/lib/market/get-market-lens";

export type AgentOutputPiece = {
  agent_name: string;
  output_text: string;
  output_json: Record<string, unknown>;
};

export function buildMockOutputs(intake: Pick<
  IntakePayload,
  "company" | "industry" | "geography" | "vibe"
>): Record<number, AgentOutputPiece> {
  const { company, industry, geography, vibe } = intake;
  const uae = isUaeMarket(geography);

  return {
    1: {
      agent_name: "industry-historian",
      output_text: `${industry} in ${geography}: origin through luxury/mass split with named inflection points.`,
      output_json: {
        version: 1,
        sections: [
          {
            title: "Origin",
            body: `${industry} crystallized in the late 1990s in ${geography} as digital-first challengers displaced legacy distributors (e.g. regional incumbents by 2004).`,
          },
        ],
        inflection_points: [
          { year: 2016, event: "Mobile-first discovery became default" },
          { year: 2020, event: "DTC acceleration post-pandemic" },
        ],
      },
    },
    2: {
      agent_name: "trend-analyst",
      output_text: "Trend radar: 10 channels with heat scores and evidence URLs (demo data).",
      output_json: {
        version: 1,
        trends: uae
          ? [
              {
                channel: "Instagram",
                name: "Arabic-first Reels",
                heat: 84,
                direction: "up",
                evidence_url:
                  "https://www.youtube.com/results?search_query=UAE+arabic+instagram+reels+marketing",
                winner: "Regional champions localizing tone",
                implication: `${company} should test bilingual cuts for ${geography}.`,
              },
              {
                channel: "LinkedIn",
                name: "Founder credibility loops",
                heat: 76,
                direction: "up",
                evidence_url:
                  "https://www.youtube.com/results?search_query=UAE+founder+personal+brand",
                winner: "B2B brands with weekly POV",
                implication: `Match ${vibe} with executive-visible proof.`,
              },
              {
                channel: "Paid social",
                name: "Mall-to-mobile retargeting",
                heat: 71,
                direction: "up",
                evidence_url:
                  "https://www.youtube.com/results?search_query=Dubai+mall+marketing+digital",
                winner: "Retailers bridging footfall to app",
                implication: "Sync OOH with short video retargeting.",
              },
            ]
          : [
              {
                channel: "TikTok",
                name: "Founder-led POV",
                heat: 82,
                direction: "up",
                evidence_url:
                  "https://www.youtube.com/results?search_query=founder+led+marketing+trend",
                winner: "Category leaders posting 4x/week",
                implication: `${company} should pilot a ${vibe} founder series in ${geography}.`,
              },
              {
                channel: "Instagram Reels",
                name: "Quiet luxury edits",
                heat: 71,
                direction: "up",
                evidence_url:
                  "https://www.youtube.com/results?search_query=quiet+luxury+brand+film",
                winner: "Heritage brands with soft palettes",
                implication: "Match visual restraint to stated vibe.",
              },
              {
                channel: "Google Search",
                name: "Comparison shopping",
                heat: 64,
                direction: "flat",
                evidence_url:
                  "https://www.youtube.com/results?search_query=comparison+shopping+ads",
                winner: "Review aggregators",
                implication: "Own comparison keywords before Q3.",
              },
            ],
        white_space: [`AI-assisted sizing for ${industry}`],
        dying: ["Generic stock UGC without POV"],
      },
    },
    3: {
      agent_name: "company-research",
      output_text: `Forensic profile of ${company} with channel audit and tensions.`,
      output_json: {
        version: 1,
        identity: { archetype: vibe, tone: "Confident, precise" },
        tensions: [
          "Premium positioning vs mass-market ad creative",
          "Global story vs ${geography}-first relevance",
        ],
      },
    },
    4: {
      agent_name: "competitor-scout",
      output_text: "Five named competitors with threat levels (demo).",
      output_json: {
        version: 1,
        competitors: uae
          ? [
              {
                name: "Careem",
                positioning: "Super-app mobility",
                strength: "Daily frequency",
                weakness: "Promo noise",
                threat: "High",
              },
              {
                name: "talabat",
                positioning: "Food delivery leader",
                strength: "App habit",
                weakness: "Commodity offers",
                threat: "High",
              },
              {
                name: "noon",
                positioning: "Marketplace scale",
                strength: "Merch breadth",
                weakness: "Brand warmth",
                threat: "Medium",
              },
            ]
          : [
              {
                name: "Competitor Alpha",
                positioning: "Category incumbent",
                strength: "Distribution depth",
                weakness: "Slow creative refresh",
                threat: "High",
              },
              {
                name: "Competitor Beta",
                positioning: "Digital native",
                strength: "Social velocity",
                weakness: "Thin margin",
                threat: "Medium",
              },
            ],
      },
    },
    5: {
      agent_name: "gap-detection",
      output_text: "Ranked gaps across 14 categories; top 3 critical.",
      output_json: {
        version: 1,
        gaps: [
          {
            category: "Positioning",
            name: "Unclear premium proof",
            severity: "high",
            fix: "Launch proof-led hero campaign",
          },
          {
            category: "Channel coverage",
            name: "Under-indexed on short video",
            severity: "medium",
            fix: "6-week Reels sprint",
          },
        ],
        top_critical: ["Unclear premium proof", "Under-indexed on short video"],
      },
    },
    6: {
      agent_name: "strategic-planner",
      output_text: "North star, five priority moves, roadmaps.",
      output_json: {
        version: 1,
        north_star: `Become the ${vibe} reference brand for ${industry} in ${geography}.`,
        priorities: [
          {
            title: "Proof-first brand film",
            logic: "Close trust gap vs incumbents",
            horizon: "90d",
          },
          {
            title: "Creator coalition",
            logic: "Borrow credibility at lower CAC",
            horizon: "180d",
          },
        ],
      },
    },
    7: {
      agent_name: "content-creator",
      output_text: "Four hero campaigns with cutdowns and prompts (demo).",
      output_json: {
        version: 1,
        campaigns: [
          {
            name: "The Proof Room",
            type: "Brand film",
            big_idea: "Show the craft behind every claim",
          },
          {
            name: "Founder Frequency",
            type: "Short video series",
            big_idea: "Weekly POV that humanizes premium claims",
          },
          {
            name: "Quiet Compare",
            type: "Performance",
            big_idea: "Win consideration with side-by-side proof",
          },
          {
            name: "Regional Pulse",
            type: "Culture drop",
            big_idea: `${geography}-first stories that feel local`,
          },
        ],
      },
    },
    8: {
      agent_name: "future-engine",
      output_text: "Horizons +1/+3/+5 years with bets.",
      output_json: {
        version: 1,
        horizons: [
          {
            years: 1,
            prediction: "AI-assisted discovery becomes default entry",
            confidence: 0.72,
          },
          {
            years: 3,
            prediction: "Consolidation among mid-tier players",
            confidence: 0.58,
          },
          {
            years: 5,
            prediction: "Regional champions outpace global generics",
            confidence: 0.51,
          },
        ],
      },
    },
    9: {
      agent_name: "master-synthesis",
      output_text: `CEO memo: ${company} has a narrow window to own ${vibe} leadership in ${geography}.`,
      output_json: {
        version: 1,
        one_page:
          `Situation: ${company} competes in ${industry} where incumbents own distribution but under-invest in ${vibe} storytelling. Opportunity: own proof-led short video before category noise rises. Threat: digital natives compressing consideration cycles. Recommendation: launch proof-first film + weekly founder POV within 90 days.`,
        insights: [
          "Trust gap is creative, not product",
          "Short video is under-weighted vs category",
          "Regional relevance beats global gloss",
        ],
      },
    },
    10: {
      agent_name: "document-generator",
      output_text: "PDF layout package ready when Puppeteer is wired.",
      output_json: {
        version: 1,
        pdf_ready: false,
        filename: `cyob-${company.toLowerCase().replace(/\s+/g, "-")}-demo.pdf`,
      },
    },
  };
}
