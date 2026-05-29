"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import {
  AUDIENCE_TYPE_CHIPS,
  BUDGET_OPTIONS,
  GEOGRAPHY_CHIPS,
  INDUSTRY_CHIPS,
  SIZE_OPTIONS,
  VIBE_OPTIONS,
} from "@/lib/constants/intake-options";
import { intakeSchema, type IntakePayload } from "@/lib/schemas/intake";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";

async function bootstrapAdminSession() {
  await fetch("/api/auth/bootstrap-admin", { method: "POST", credentials: "include" });
}

const STEP_FIELDS: (keyof IntakePayload)[][] = [
  ["company"],
  ["industry"],
  ["geography", "city"],
  ["size"],
  ["vibe"],
  ["audience", "audience_type"],
  ["budget", "notes"],
  ["email"],
  ["otp"],
];

const DRAFT_KEY = "cyob-intake-draft";

const STEP_LABELS = [
  "Company",
  "Industry",
  "Geography",
  "Size",
  "Brand vibe",
  "Audience",
  "Budget",
  "Email",
  "Verify",
];

type IntakeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function IntakeModal({ open, onClose }: IntakeModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      company: "",
      industry: "",
      geography: "",
      city: "",
      size: "",
      vibe: "",
      audience: "",
      audience_type: "",
      budget: "",
      notes: "",
      email: "",
      otp: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setStep(0);
      setFormError(null);
      form.reset();
      return;
    }
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<IntakePayload>;
        form.reset({ ...form.getValues(), ...parsed, otp: "" });
      }
    } catch {
      /* ignore corrupt draft */
    }
  }, [open, form]);

  useEffect(() => {
    if (!open) return;
    const sub = form.watch((values) => {
      const { otp: _discardOtp, ...draft } = values;
      void _discardOtp;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* storage full */
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

  const next = async () => {
    setFormError(null);
    const fields = STEP_FIELDS[step];
    const ok = await form.trigger(fields, { shouldFocus: true });
    if (!ok) return;
    setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
  };

  const back = () => {
    setFormError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const sendOtp = async () => {
    setFormError(null);
    const ok = await form.trigger(["email"]);
    if (!ok) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setFormError("Supabase is not configured in this environment.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: form.getValues("email"),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setStep(8);
  };

  const submitDemo = async () => {
    setBusy(true);
    setFormError(null);
    const v = await form.trigger(
      ["company", "industry", "geography", "city", "size", "vibe", "audience", "audience_type", "budget", "notes", "email"],
      { shouldFocus: true },
    );
    if (!v) {
      setBusy(false);
      return;
    }
    const body = { ...form.getValues(), demo: true };
    const res = await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(j?.error ?? "Could not start demo run.");
      return;
    }
    const data = (await res.json()) as { runId: string };
    onClose();
    router.push(`/preparing/${data.runId}`);
  };

  const submitLive = async () => {
    setBusy(true);
    setFormError(null);
    const otpToken = (form.getValues("otp") ?? "").replace(/\D/g, "").trim();
    if (otpToken.length < 6 || otpToken.length > 8) {
      setFormError("Enter the full code from your email.");
      setBusy(false);
      return;
    }
    const ok = await form.trigger(["otp"]);
    if (!ok) {
      setBusy(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setFormError("Supabase client unavailable.");
      setBusy(false);
      return;
    }
    const email = form.getValues("email");
    const { verifyEmailOtp } = await import("@/lib/auth/verify-email-otp");
    const verified = await verifyEmailOtp(supabase, email, otpToken);
    if (!verified.ok) {
      setFormError(verified.message);
      setBusy(false);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await bootstrapAdminSession();
    }
    const res = await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form.getValues(), demo: false }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(j?.error ?? "Could not create run.");
      return;
    }
    const data = (await res.json()) as { runId: string };
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    onClose();
    router.push(`/preparing/${data.runId}`);
  };

  const progressPct = Math.round(((step + 1) / STEP_FIELDS.length) * 100);

  const ChipRow = (
    field: keyof IntakePayload,
    options: readonly string[],
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`rounded-[var(--radius-md)] border px-3 py-2 text-sm transition-colors duration-150 ease-[var(--ease-out-expo)] ${
            form.watch(field) === opt
              ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-[var(--text)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:border-[var(--border-2)]"
          }`}
          onClick={() => form.setValue(field, opt, { shouldValidate: true })}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-3)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Step {step + 1} / {STEP_FIELDS.length}
            </p>
            <h2
              id="intake-title"
              className="mt-1 text-xl font-medium tracking-tight text-[var(--text)]"
            >
              {STEP_LABELS[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] border border-[var(--border)] p-2 text-[var(--text-2)] hover:bg-[var(--surface)]"
            aria-label="Close intake"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--bg-2)]"
          aria-hidden
        >
          <div
            className="h-full bg-[var(--gold)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mt-6 space-y-4">
          {step === 0 && (
            <label className="block space-y-2">
              <span className="text-sm text-[var(--text-2)]">Company name</span>
              <input
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--border-2)]"
                {...form.register("company")}
              />
            </label>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {ChipRow("industry", INDUSTRY_CHIPS)}
              <input
                placeholder="Custom industry"
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                {...form.register("industry")}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {ChipRow("geography", GEOGRAPHY_CHIPS)}
              <input
                placeholder="Region / market detail"
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                {...form.register("geography")}
              />
              <input
                placeholder="City (optional)"
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                {...form.register("city")}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">{ChipRow("size", SIZE_OPTIONS)}</div>
          )}

          {step === 4 && (
            <div className="space-y-2">{ChipRow("vibe", VIBE_OPTIONS)}</div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <label className="block space-y-2">
                <span className="text-sm text-[var(--text-2)]">Audience</span>
                <textarea
                  rows={4}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                  {...form.register("audience")}
                />
              </label>
              {ChipRow("audience_type", AUDIENCE_TYPE_CHIPS)}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              {ChipRow("budget", BUDGET_OPTIONS)}
              <label className="block space-y-2">
                <span className="text-sm text-[var(--text-2)]">Notes (optional)</span>
                <textarea
                  rows={3}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                  {...form.register("notes")}
                />
              </label>
            </div>
          )}

          {step === 7 && (
            <label className="block space-y-2">
              <span className="text-sm text-[var(--text-2)]">Work email</span>
              <input
                type="email"
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]"
                {...form.register("email")}
              />
            </label>
          )}

          {step === 8 && (
            <div className="space-y-3">
              {isSupabaseBrowserConfigured() ? (
                <>
                  <p className="text-sm text-[var(--text-2)]">
                    Enter the 6-digit code sent to {form.watch("email")}.
                  </p>
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm tracking-[0.4em] text-[var(--text)]"
                    {...form.register("otp")}
                  />
                </>
              ) : (
                <p className="text-sm text-[var(--text-2)]">
                  Supabase URL/anon key are missing, so email OTP is disabled in
                  this build.
                </p>
              )}
            </div>
          )}
        </div>

        {formError && (
          <p className="mt-4 text-sm text-[var(--red)]" role="alert">
            {formError}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || busy}
            className="rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--surface)] disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex flex-wrap gap-2">
            {step < 7 && (
              <button
                type="button"
                onClick={() => void next()}
                disabled={busy}
                className="rounded-[var(--radius-md)] border border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-40"
              >
                Continue
              </button>
            )}
            {step === 7 && (
              <>
                {isSupabaseBrowserConfigured() ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void sendOtp()}
                    className="rounded-[var(--radius-md)] border border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-40"
                  >
                    Send code
                  </button>
                ) : null}
                {process.env.NODE_ENV === "development" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void submitDemo()}
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] disabled:opacity-40"
                  >
                    Skip login (local demo)
                  </button>
                ) : null}
              </>
            )}
            {step === 8 && isSupabaseBrowserConfigured() && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void submitLive()}
                className="rounded-[var(--radius-md)] border border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:opacity-40"
              >
                Verify & start
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
