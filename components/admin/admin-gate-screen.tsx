"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminGateScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setErr("Wrong password. Try again.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setErr("Could not connect. Try again.");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/cyob-logo.png"
            alt="cyob"
            width={200}
            height={160}
            className="h-16 w-auto brightness-0 invert"
            priority
          />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--text)]">
            Admin
          </h1>
          <p className="mt-2 text-sm text-[var(--text-3)]">
            Enter your admin password to continue.
          </p>
        </div>

        <form onSubmit={(e) => void submit(e)} className="mt-10 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] px-4 text-center text-lg tracking-[0.35em] text-[var(--text)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_55%,transparent)]"
          />
          {err ? (
            <p className="text-center text-sm text-[var(--red)]" role="alert">
              {err}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || password.length < 4}
            className="btn btn-primary h-12 w-full text-base"
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
