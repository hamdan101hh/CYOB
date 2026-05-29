"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { StudioPlan } from "@/lib/schemas/asset-prompt";

const CHATGPT_URL = "https://chatgpt.com/";
const CLAUDE_URL = "https://claude.ai/new";

export function AssetPromptStudio({
  runId,
  company,
  industry,
  vibe,
  campaignName,
}: {
  runId: string;
  company: string;
  industry: string;
  vibe: string;
  campaignName?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"draft" | "review">("draft");
  const [rough, setRough] = useState("");
  const [plan, setPlan] = useState<StudioPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipVideo, setSkipVideo] = useState(false);

  const inputClass =
    "w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_50%,transparent)]";

  const enhance = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/prompt-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roughPrompt: rough,
          assetType: "both",
          company,
          industry,
          vibe,
          campaignName,
        }),
      });
      const j = (await res.json()) as {
        plan?: StudioPlan;
        error?: string;
      };
      if (!res.ok || !j.plan) {
        setError(j.error ?? "Could not build scene plan.");
        return;
      }
      setPlan(j.plan);
      setStep("review");
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const generate = async () => {
    if (!plan) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/runs/${runId}/generate-assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePrompt: plan.imagePrompt,
          videoPrompt: skipVideo ? undefined : plan.videoPrompt,
          skipVideo,
        }),
      });
      if (!res.ok) {
        setError("Generation failed. Check FAL_KEY and try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Generation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stealth-card space-y-4 p-5 md:p-6">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--accent-bright)]">
          Prompt studio
        </p>
        <h2 className="mt-1 text-lg font-medium text-[var(--text)]">
          Plan scenes before you spend credits
        </h2>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          Describe your idea → AI builds scene timing → you edit → then generate image
          {skipVideo ? "" : " & video"}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={CHATGPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text)]"
        >
          Open ChatGPT
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
        <a
          href={CLAUDE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text)]"
        >
          Open Claude
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
        <span className="text-[10px] text-[var(--text-4)] self-center">
          Craft a prompt there, paste it below
        </span>
      </div>

      {step === "draft" ? (
        <>
          <textarea
            rows={4}
            className={inputClass}
            placeholder="e.g. Dubai food delivery app, evening mood, driver picks up order, warm lights…"
            value={rough}
            onChange={(e) => setRough(e.target.value)}
          />
          <button
            type="button"
            disabled={busy || rough.trim().length < 3}
            onClick={() => void enhance()}
            className="btn btn-primary btn-glow inline-flex h-11 w-full items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {busy ? "Building scene plan…" : "Build scene plan with AI"}
          </button>
        </>
      ) : plan ? (
        <>
          <p className="text-xs text-[var(--text-3)]">{plan.summary}</p>

          <div className="space-y-2">
            <p className="text-[10px] uppercase text-[var(--text-4)]">Scenes (5s video)</p>
            {plan.scenes.map((scene) => (
              <div
                key={scene.id}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs"
              >
                <span className="font-medium text-[var(--accent-bright)]">
                  {scene.startSec}s–{scene.endSec}s
                </span>
                <p className="mt-1 text-[var(--text-2)]">{scene.visual}</p>
                {scene.camera ? (
                  <p className="mt-0.5 text-[var(--text-4)]">{scene.camera}</p>
                ) : null}
              </div>
            ))}
          </div>

          <label className="block text-[10px] uppercase text-[var(--text-4)]">
            Image prompt
          </label>
          <textarea
            rows={3}
            className={inputClass}
            value={plan.imagePrompt}
            onChange={(e) =>
              setPlan({ ...plan, imagePrompt: e.target.value })
            }
          />

          <label className="block text-[10px] uppercase text-[var(--text-4)]">
            Video prompt
          </label>
          <textarea
            rows={3}
            className={inputClass}
            value={plan.videoPrompt}
            onChange={(e) =>
              setPlan({ ...plan, videoPrompt: e.target.value })
            }
            disabled={skipVideo}
          />

          <label className="flex items-center gap-2 text-xs text-[var(--text-3)]">
            <input
              type="checkbox"
              checked={skipVideo}
              onChange={(e) => setSkipVideo(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            Image only (skip video — saves credits)
          </label>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className="btn btn-secondary h-10 px-4"
              onClick={() => setStep("draft")}
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void generate()}
              className="btn btn-primary btn-glow h-10 flex-1 px-6"
            >
              {busy ? "Generating…" : "Confirm & generate"}
            </button>
          </div>
        </>
      ) : null}

      {error ? (
        <p className="text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
