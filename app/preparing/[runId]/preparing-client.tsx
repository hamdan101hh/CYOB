"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AgentPipelineVisual } from "@/components/run/agent-pipeline-visual";

type StatusPayload = {
  runId: string;
  demo?: boolean;
  status: string;
  current_agent: number;
  agent_status: string | null;
  error_message?: string | null;
};

export function PreparingClient({ runId }: { runId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/run/${runId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (res.status === 404) {
            setError("Run not found.");
          } else {
            setError("Could not load status.");
          }
          return;
        }
        const body = (await res.json()) as StatusPayload;
        if (cancelled) return;
        setStatus(body);
        if (body.status === "complete") {
          router.replace(`/dashboard/${runId}`);
        } else if (body.status === "failed") {
          setError(
            body.error_message ??
              body.agent_status ??
              "This run failed. Try starting a new intake.",
          );
        }
      } catch {
        if (!cancelled) setError("Network error while polling.");
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 1200);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [runId, router]);

  const currentAgent = status?.current_agent ?? 0;
  const runStatus = status?.status ?? "queued";

  return (
    <div className="page-wrap max-w-4xl">
      <p className="eyebrow">Preparing your war room</p>
      <h1 className="page-title">Running specialist agents</h1>
      <p className="page-lead">
        {status?.agent_status ??
          "Queued — this page updates automatically while agents execute."}
      </p>

      {error && (
        <p className="mt-6 text-sm text-[var(--red)]" role="alert">
          {error}{" "}
          <Link href="/" className="link-accent">
            Back home
          </Link>
        </p>
      )}

      <div className="mt-10">
        <AgentPipelineVisual
          currentAgent={currentAgent}
          status={runStatus}
        />
      </div>

      <p className="mt-10 text-xs text-[var(--text-4)]">
        Run ID: <span className="text-[var(--text-3)]">{runId}</span>
        {status?.demo ? (
          <span className="ml-2 text-[var(--amber)]">(local demo)</span>
        ) : null}
      </p>
    </div>
  );
}
