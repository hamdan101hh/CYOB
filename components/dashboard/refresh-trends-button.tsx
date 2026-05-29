"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshTrendsButton({ runId }: { runId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onClick = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/refresh-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: runId }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      setMsg(data.message ?? data.error ?? (res.ok ? "Updated" : "Failed"));
      if (res.ok) router.refresh();
    } catch {
      setMsg("Network error");
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => void onClick()}
        className="rounded-[var(--radius-md)] border border-[var(--border-2)] bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:-translate-y-px disabled:opacity-50"
      >
        Refresh trends
      </button>
      {msg ? <p className="text-xs text-[var(--text-3)]">{msg}</p> : null}
    </div>
  );
}
