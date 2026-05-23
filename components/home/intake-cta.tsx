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
        className="btn btn-primary h-12 px-6 text-base"
      >
        Start the intake
      </button>
      <IntakeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
