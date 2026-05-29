"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LibraryGenerateClient({
  runId,
  needsAssets,
}: {
  runId: string;
  needsAssets: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    needsAssets ? "loading" : "idle",
  );

  const generate = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/runs/${runId}/generate-assets`, {
        method: "POST",
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("done");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (needsAssets) void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount when assets missing
  }, []);

  if (status === "loading") {
    return (
      <p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-2)]">
        Generating hero frames and concept previews…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-[var(--red)]">Could not generate visuals.</p>
        <button type="button" className="btn btn-secondary h-9 px-3" onClick={() => void generate()}>
          Retry
        </button>
      </div>
    );
  }

  if (!needsAssets) return null;

  return null;
}
