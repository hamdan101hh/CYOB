# Live trend research (CYOB)

CYOB scans **real web results** for trends on:

- Instagram (Reels / social)
- TikTok
- Facebook
- YouTube (Shorts / video)

## How it works

1. **Agent 2 (Trend Analyst)** runs when you start a war room or hit **Refresh trends**.
2. With `SERPER_API_KEY` set, cyob runs **4 platform-focused Google searches** (Serper API).
3. Top results become structured trends: title, channel, heat, direction, **real evidence URL**.
4. **Anthropic/OpenAI** writes the strategy report using that evidence (not random demo numbers).
5. **Tavily** fills gaps if Serper returns thin results.

## Required keys

| Key | Role |
|-----|------|
| `SERPER_API_KEY` | **Required** for live multi-platform trend scan |
| `ANTHROPIC_API_KEY` (or other LLM) | Narrative + synthesis |
| `TAVILY_API_KEY` | Optional backup digest |

## What this is NOT (yet)

- Not the official Instagram/TikTok/Facebook/YouTube **trending APIs** (those need separate Meta/TikTok/Google partnerships).
- Homepage **demo charts** (talabat vs Deliveroo) are still curated examples for design.
- **Your run dashboard** trends come from Agent 2 output when Serper is configured.

## Upgrade path (best-in-class)

1. **Today:** Serper + LLM (you have this after deploy)
2. **Next:** Apify actors for Instagram/TikTok post scrapers (`APIFY_TOKEN`, studio tier)
3. **Later:** Official platform APIs where available

## Test

1. Set `SERPER_API_KEY` in `.env.local`
2. Start a new war room
3. Open dashboard → trends should show real links (instagram.com, tiktok.com, youtube.com, etc.)
4. Or use **Refresh trends** on an existing run
