"use client";

import Image from "next/image";

/** Measured from public/cyob-logo.png (653×519) — right eye on screen-right. */
const RIGHT_EYE = {
  left: "68.6%",
  top: "19.27%",
  width: "4.13%",
  height: "4.82%",
} as const;

type CyobLogoMarkProps = {
  className?: string;
  wink?: boolean;
};

export function CyobLogoMark({ className, wink }: CyobLogoMarkProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src="/cyob-logo.png"
        alt=""
        width={653}
        height={519}
        priority
        className="h-auto w-full object-contain brightness-0 invert"
      />
      {/* Covers the right eye arc on wink (flat blink on black splash). */}
      <span
        aria-hidden
        className={`pointer-events-none absolute rounded-full bg-black ${
          wink ? "animate-cyob-eye-blink" : "scale-y-0 opacity-0"
        }`}
        style={{
          left: RIGHT_EYE.left,
          top: RIGHT_EYE.top,
          width: RIGHT_EYE.width,
          height: RIGHT_EYE.height,
          transformOrigin: "50% 55%",
        }}
      />
    </div>
  );
}
