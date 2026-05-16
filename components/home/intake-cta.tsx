"use client";

import { useState } from "react";

import { IntakeModal } from "@/components/intake/intake-modal";

export function IntakeCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] px-6 text-sm font-medium text-[var(--text)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
      >
        Start the intake
      </button>
      <IntakeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
