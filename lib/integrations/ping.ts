import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

import { env } from "@/lib/env";

export type PingResult = {
  ok: boolean;
  latencyMs: number;
  message: string;
};

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const start = Date.now();
  const value = await fn();
  return { ms: Date.now() - start, value };
}

export async function pingAnthropic(): Promise<PingResult> {
  if (!env.ANTHROPIC_API_KEY) {
    return { ok: false, latencyMs: 0, message: "ANTHROPIC_API_KEY not set" };
  }
  try {
    const { ms } = await timed(async () => {
      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
      await client.messages.create({
        model: env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest",
        max_tokens: 8,
        messages: [{ role: "user", content: "Reply with OK only." }],
      });
    });
    return { ok: true, latencyMs: ms, message: "Claude responded" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Anthropic ping failed",
    };
  }
}

export async function pingOpenAI(): Promise<PingResult> {
  if (!env.OPENAI_API_KEY) {
    return { ok: false, latencyMs: 0, message: "OPENAI_API_KEY not set" };
  }
  try {
    const { ms } = await timed(async () => {
      const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 5,
        messages: [{ role: "user", content: "OK" }],
      });
    });
    return { ok: true, latencyMs: ms, message: "OpenAI responded" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "OpenAI ping failed",
    };
  }
}

export async function pingGemini(): Promise<PingResult> {
  if (!env.GEMINI_API_KEY) {
    return { ok: false, latencyMs: 0, message: "GEMINI_API_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY!)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "OK" }] }],
            generationConfig: { maxOutputTokens: 4 },
          }),
        },
      ),
    );
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, latencyMs: ms, message: `HTTP ${res.status}: ${t.slice(0, 120)}` };
    }
    return { ok: true, latencyMs: ms, message: "Gemini responded" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Gemini ping failed",
    };
  }
}

export async function pingSerper(): Promise<PingResult> {
  if (!env.SERPER_API_KEY) {
    return { ok: false, latencyMs: 0, message: "SERPER_API_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: "cyob connectivity test", num: 1 }),
      }),
    );
    if (!res.ok) {
      return { ok: false, latencyMs: ms, message: `HTTP ${res.status}` };
    }
    return { ok: true, latencyMs: ms, message: "Serper search OK" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Serper ping failed",
    };
  }
}

export async function pingTavily(): Promise<PingResult> {
  if (!env.TAVILY_API_KEY) {
    return { ok: false, latencyMs: 0, message: "TAVILY_API_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: env.TAVILY_API_KEY,
          query: "test",
          max_results: 1,
        }),
      }),
    );
    if (!res.ok) {
      return { ok: false, latencyMs: ms, message: `HTTP ${res.status}` };
    }
    return { ok: true, latencyMs: ms, message: "Tavily search OK" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Tavily ping failed",
    };
  }
}

export async function pingFal(): Promise<PingResult> {
  if (!env.FAL_KEY) {
    return { ok: false, latencyMs: 0, message: "FAL_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          Authorization: `Key ${env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "solid black square minimal test",
          image_size: "square",
          num_images: 1,
        }),
      }),
    );
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, latencyMs: ms, message: `HTTP ${res.status}: ${t.slice(0, 100)}` };
    }
    return { ok: true, latencyMs: ms, message: "FAL image OK (billed)" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "FAL ping failed",
    };
  }
}

/** Cheaper FAL check — validates key without full generation when possible. */
export async function pingFalLight(): Promise<PingResult> {
  if (!env.FAL_KEY) {
    return { ok: false, latencyMs: 0, message: "FAL_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch("https://rest.alpha.fal.ai/keys/current", {
        headers: { Authorization: `Key ${env.FAL_KEY}` },
      }),
    );
    if (res.status === 404 || res.status === 401) {
      return {
        ok: res.status !== 401,
        latencyMs: ms,
        message:
          res.status === 401
            ? "Invalid FAL_KEY"
            : "Key present (use Test image for full check)",
      };
    }
    if (res.ok) {
      return { ok: true, latencyMs: ms, message: "FAL key accepted" };
    }
    return { ok: true, latencyMs: ms, message: "FAL_KEY set — run image test to confirm" };
  } catch {
    return { ok: true, latencyMs: 0, message: "FAL_KEY set (light check only)" };
  }
}

export async function pingResend(): Promise<PingResult> {
  if (!env.RESEND_API_KEY) {
    return { ok: false, latencyMs: 0, message: "RESEND_API_KEY not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
      }),
    );
    if (res.status === 401) {
      return { ok: false, latencyMs: ms, message: "Invalid RESEND_API_KEY" };
    }
    return { ok: true, latencyMs: ms, message: "Resend API reachable" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Resend ping failed",
    };
  }
}

async function pingApify(): Promise<PingResult> {
  if (!env.APIFY_TOKEN) {
    return { ok: false, latencyMs: 0, message: "APIFY_TOKEN not set" };
  }
  try {
    const { ms, value: res } = await timed(() =>
      fetch(`https://api.apify.com/v2/users/me?token=${env.APIFY_TOKEN}`),
    );
    if (!res.ok) {
      return { ok: false, latencyMs: ms, message: `HTTP ${res.status}` };
    }
    return { ok: true, latencyMs: ms, message: "Apify token valid" };
  } catch (e) {
    return {
      ok: false,
      latencyMs: 0,
      message: e instanceof Error ? e.message : "Apify ping failed",
    };
  }
}

const PINGERS: Record<string, (full?: boolean) => Promise<PingResult>> = {
  anthropic: () => pingAnthropic(),
  openai: () => pingOpenAI(),
  gemini: () => pingGemini(),
  serper: () => pingSerper(),
  tavily: () => pingTavily(),
  fal: (full) => (full ? pingFal() : pingFalLight()),
  seedance: () => pingFalLight(),
  resend: () => pingResend(),
  apify: () => pingApify(),
};

export async function pingProvider(
  id: string,
  options?: { full?: boolean },
): Promise<PingResult> {
  const fn = PINGERS[id];
  if (!fn) return { ok: false, latencyMs: 0, message: "Unknown provider" };
  return fn(options?.full);
}
