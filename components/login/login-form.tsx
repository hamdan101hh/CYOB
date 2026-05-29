"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  isValidOtpLength,
  normalizeOtpInput,
  verifyEmailOtp,
} from "@/lib/auth/verify-email-otp";

async function bootstrapAdminSession() {
  await fetch("/api/auth/bootstrap-admin", { method: "POST", credentials: "include" });
}
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("rate limit") ||
    lower.includes("over_email") ||
    lower.includes("429")
  ) {
    return "Too many login emails sent. Wait 30–60 minutes, then try once. Check your inbox — an earlier code may still work for 10 minutes.";
  }
  if (lower.includes("expired") || lower.includes("invalid")) {
    return "Code expired or wrong. Click “Send new code” and paste the latest email code (same tab).";
  }
  return message;
}

function loginRedirectPath(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSec, setResendSec] = useState(0);

  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setTimeout(() => setResendSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSec]);

  const sendCode = async () => {
    if (resendSec > 0) return;
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }
    setBusy(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err.message));
      return;
    }
    setOtp("");
    setStep("otp");
    setResendSec(60);
  };

  const verify = async () => {
    setError(null);
    if (!isSupabaseBrowserConfigured()) return;

    const token = normalizeOtpInput(otp);
    if (!isValidOtpLength(token)) {
      setError("Paste the full code from your email (6 digits).");
      return;
    }

    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Add keys to .env.local.");
      setBusy(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const verified = await verifyEmailOtp(supabase, normalizedEmail, token);
    setBusy(false);
    if (!verified.ok) {
      setError(friendlyAuthError(verified.message));
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await bootstrapAdminSession();
    }

    router.push(loginRedirectPath(searchParams.get("next")));
    router.refresh();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (step === "email" ? sendCode() : verify());
  };

  if (!isSupabaseBrowserConfigured()) {
    return (
      <p className="text-sm text-[var(--text-2)]">
        Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
        .env.local to enable login.
      </p>
    );
  }

  return (
    <form className="card card-pad space-y-5" onSubmit={onSubmit}>
      {step === "email" ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--text-2)]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </label>
      ) : (
        <>
          <p className="text-sm text-[var(--text-2)]">
            Code sent to{" "}
            <span className="font-medium text-[var(--text)]">{email}</span>
          </p>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--text-2)]">
              Sign-in code
            </span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
              }
              placeholder="6-digit code"
              className="input-field tracking-[0.35em]"
              required
            />
          </label>
        </>
      )}
      {error ? (
        <p className="text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {step === "email" ? "Send code" : "Verify & sign in"}
      </button>
      {step === "otp" ? (
        <>
          <p className="text-xs leading-relaxed text-[var(--text-4)]">
            Stay on this tab. Copy the code from your email and paste it here.
          </p>
          <button
            type="button"
            disabled={busy || resendSec > 0}
            className="link-accent text-sm disabled:opacity-50"
            onClick={() => void sendCode()}
          >
            {resendSec > 0 ? `Send new code (${resendSec}s)` : "Send new code"}
          </button>
          <button
            type="button"
            className="block text-sm text-[var(--text-4)] hover:text-[var(--text-2)]"
            onClick={() => {
              setStep("email");
              setOtp("");
              setError(null);
            }}
          >
            Use a different email
          </button>
        </>
      ) : null}
      <Link href="/" className="link-accent inline-flex text-sm">
        Back to home
      </Link>
    </form>
  );
}
