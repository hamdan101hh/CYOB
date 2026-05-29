"use client";

import { useEffect, useState } from "react";

import { SplashIntro, shouldSkipSplash } from "@/components/splash/splash-intro";

type SplashGateProps = {
  children: React.ReactNode;
};

type Mode = "pending" | "splash" | "app";

export function SplashGate({ children }: SplashGateProps) {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    setMode(shouldSkipSplash() ? "app" : "splash");
  }, []);

  return (
    <>
      {mode === "pending" ? (
        <div className="fixed inset-0 z-[200] bg-black" aria-hidden />
      ) : null}
      {mode === "splash" ? (
        <SplashIntro onComplete={() => setMode("app")} />
      ) : null}
      <div
        className={
          mode === "app"
            ? "opacity-100 transition-opacity duration-500 ease-[var(--ease-out-expo)]"
            : "pointer-events-none invisible opacity-0"
        }
        aria-hidden={mode !== "app"}
      >
        {children}
      </div>
    </>
  );
}
