"use client";

import { useEffect, useState } from "react";

import { CyobLogoMark } from "@/components/splash/cyob-logo-mark";

const STORAGE_KEY = "cyob-splash-seen";

const ENTER_MS = 900;
const HOLD_MS = 2000;
const WINK_MS = 450;
const EXIT_MS = 900;

type Phase = "enter" | "hold" | "wink" | "exit" | "done";

type SplashIntroProps = {
  onComplete: () => void;
};

export function SplashIntro({ onComplete }: SplashIntroProps) {
  const [phase, setPhase] = useState<Phase>("enter");
  const [wink, setWink] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => setPhase("hold"), ENTER_MS),
      setTimeout(() => {
        setPhase("wink");
        setWink(true);
      }, ENTER_MS + HOLD_MS),
      setTimeout(() => setPhase("exit"), ENTER_MS + HOLD_MS + WINK_MS),
      setTimeout(() => {
        setPhase("done");
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
        onComplete();
      }, ENTER_MS + HOLD_MS + WINK_MS + EXIT_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === "done") return null;

  const motionClass =
    phase === "enter"
      ? "animate-cyob-splash-in"
      : phase === "exit"
        ? "animate-cyob-splash-out"
        : "translate-x-0 opacity-100";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      role="presentation"
      aria-hidden
    >
      <div
        className={`flex w-[min(90vw,18rem)] flex-col items-center will-change-transform sm:w-[min(80vw,20rem)] ${motionClass}`}
      >
        <CyobLogoMark wink={wink} className="h-auto w-full drop-shadow-[0_0_40px_rgba(126,182,255,0.25)]" />
      </div>
    </div>
  );
}

export function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
