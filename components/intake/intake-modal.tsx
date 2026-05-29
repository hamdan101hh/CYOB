"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import {
  BUDGET_OPTIONS,
  GEOGRAPHY_CHIPS,
  INDUSTRY_CHIPS,
  VIBE_OPTIONS,
} from "@/lib/constants/intake-options";
import { intakeSchema, type IntakePayload } from "@/lib/schemas/intake";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";

const DRAFT_KEY = "cyob-intake-draft-v3";
const STEPS = ["Basics", "Brand", "Start"] as const;

export function IntakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const form = useForm<IntakePayload>({
    defaultValues: {
      company: "",
      industry: "Consumer",
      geography: "UAE",
      city: "",
      size: "",
      vibe: "",
      audience: "",
      audience_type: "",
      budget: "",
      notes: "",
      website: "",
      instagram: "",
      social_links: "",
      referral_source: "",
      ai_tools_known: "",
      email: "",
      otp: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setFormError(null);
      setOtpSent(false);
      setStep(0);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      void supabase.auth.getUser().then(({ data }) => {
        setAuthUser(data.user ?? null);
        if (data.user?.email) form.setValue("email", data.user.email);
      });
    }

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) form.reset({ ...form.getValues(), ...JSON.parse(raw), otp: "" });
    } catch {
      /* ignore */
    }
  }, [open, form]);

  useEffect(() => {
    if (!open) return;
    const sub = form.watch((values) => {
      const { otp: _o, ...draft } = values;
      void _o;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [open, form]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]";

  const selectClass = `${inputClass} appearance-none`;

  const startRun = async () => {
    setFormError(null);
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      let user = authUser;
      if (!user && supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user ?? null;
        setAuthUser(user);
      }

      if (!user) {
        const email = form.getValues("email")?.trim();
        if (!email) {
          setFormError("Enter email or sign in first.");
          setBusy(false);
          return;
        }
        if (!otpSent) {
          setFormError('Tap "Send code" then enter the 6-digit code.');
          setBusy(false);
          return;
        }
        const otpToken = (form.getValues("otp") ?? "").replace(/\D/g, "");
        if (otpToken.length < 6) {
          setFormError("Enter the full 6-digit code.");
          setBusy(false);
          return;
        }
        if (!supabase) {
          setFormError("Auth not configured.");
          setBusy(false);
          return;
        }
        const { verifyEmailOtp } = await import("@/lib/auth/verify-email-otp");
        const verified = await verifyEmailOtp(supabase, email, otpToken);
        if (!verified.ok) {
          setFormError(verified.message);
          setBusy(false);
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setFormError("Sign-in failed. Try again.");
          setBusy(false);
          return;
        }
        user = sessionData.session.user;
        setAuthUser(user);
      }

      const parsed = intakeSchema.safeParse(form.getValues());
      if (!parsed.success) {
        setFormError("Check your entries.");
        setBusy(false);
        return;
      }

      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, demo: false }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setFormError(j?.error ?? "Could not start run.");
        setBusy(false);
        return;
      }
      const data = (await res.json()) as { runId: string };
      localStorage.removeItem(DRAFT_KEY);
      onClose();
      router.push(`/preparing/${data.runId}`);
    } catch {
      setFormError("Something went wrong.");
      setBusy(false);
    }
  };

  const sendOtp = async () => {
    setFormError(null);
    const email = form.getValues("email")?.trim();
    if (!email) {
      setFormError("Enter your email.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (error) setFormError(error.message);
    else setOtpSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-2)] shadow-2xl sm:rounded-[var(--radius-xl)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-xs text-[var(--text-4)]">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
            <h2 className="text-lg font-semibold text-[var(--text)]">Start your war room</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border)] p-2 text-[var(--text-3)] hover:bg-[var(--graphite)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[var(--accent)]" : "bg-[var(--bg-3)]"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-3)]">
                Just the basics. Everything else is optional.
              </p>
              <div>
                <label className="mb-1.5 block text-xs text-[var(--text-4)]">
                  Company name
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Careem, your startup…"
                  {...form.register("company")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[var(--text-4)]">Industry</label>
                <select className={selectClass} {...form.register("industry")}>
                  {INDUSTRY_CHIPS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[var(--text-4)]">Market</label>
                <select className={selectClass} {...form.register("geography")}>
                  {GEOGRAPHY_CHIPS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className={inputClass}
                placeholder="City (optional)"
                {...form.register("city")}
              />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[var(--text-4)]">Brand vibe</label>
                <select className={selectClass} {...form.register("vibe")}>
                  <option value="">Pick one (optional)</option>
                  {VIBE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[var(--text-4)]">
                  Monthly budget (optional)
                </label>
                <select className={selectClass} {...form.register("budget")}>
                  <option value="">Skip</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Who is your audience? (optional)"
                {...form.register("audience")}
              />
              <button
                type="button"
                className="text-xs text-[var(--accent-bright)] hover:underline"
                onClick={() => setShowMore((v) => !v)}
              >
                {showMore ? "Hide" : "Show"} more options
              </button>
              {showMore ? (
                <div className="space-y-3 border-t border-[var(--border)] pt-3">
                  <input
                    className={inputClass}
                    placeholder="Website"
                    {...form.register("website")}
                  />
                  <input
                    className={inputClass}
                    placeholder="Instagram"
                    {...form.register("instagram")}
                  />
                  <textarea
                    rows={2}
                    className={inputClass}
                    placeholder="Notes"
                    {...form.register("notes")}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              {authUser ? (
                <p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)] px-4 py-3 text-sm text-[var(--text-2)]">
                  Signed in as{" "}
                  <span className="font-medium text-[var(--text)]">{authUser.email}</span>
                </p>
              ) : isSupabaseBrowserConfigured() ? (
                <div className="space-y-3">
                  <Link href="/login" className="link-accent text-sm">
                    Sign in first (recommended) →
                  </Link>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="Or use email code"
                    {...form.register("email")}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void sendOtp()}
                    className="btn btn-secondary h-10 w-full"
                  >
                    Send code
                  </button>
                  {otpSent ? (
                    <input
                      inputMode="numeric"
                      className={`${inputClass} tracking-[0.3em]`}
                      placeholder="6-digit code"
                      {...form.register("otp")}
                    />
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-3)]">Auth not configured.</p>
              )}
              <p className="text-xs text-[var(--text-4)]">
                Ten agents will research trends, compare rivals, and build your visual war
                room.
              </p>
            </div>
          ) : null}
        </div>

        {formError ? (
          <p className="px-5 text-sm text-[var(--red)]" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="flex gap-2 border-t border-[var(--border)] p-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn btn-secondary inline-flex h-11 items-center gap-1 px-4"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
          ) : (
            <button type="button" onClick={onClose} className="btn btn-secondary h-11 px-4">
              Cancel
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="btn btn-primary btn-glow inline-flex h-11 flex-1 items-center justify-center gap-1"
            >
              Continue
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void startRun()}
              className="btn btn-primary btn-glow h-11 flex-1"
            >
              {busy ? "Starting…" : "Start war room"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
