"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { listAgentTiles } from "@/lib/orchestrator/agent-metadata";

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

  const tiles = status
    ? listAgentTiles(status.current_agent, status.status)
    : listAgentTiles(0, "queued");

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

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <div
            key={t.number}
            className={`rounded-[var(--radius-lg)] border px-4 py-3 text-sm transition-transform duration-300 ease-[var(--ease-out-expo)] ${
              t.state === "done"
                ? "border-[var(--green)]/35 bg-[color-mix(in_oklab,var(--green)_12%,transparent)] text-[var(--text)]"
                : t.state === "active"
                  ? "border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)]"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Agent {String(t.number).padStart(2, "0")}
            </p>
            <p className="mt-1 font-medium text-[var(--text)]">{t.label}</p>
            <p className="mt-1 text-xs text-[var(--text-3)]">
              {t.state === "done"
                ? "Complete"
                : t.state === "active"
                  ? "In motion"
                  : "Waiting"}
            </p>
          </div>
        ))}
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
