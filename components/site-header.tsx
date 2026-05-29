import Image from "next/image";
import Link from "next/link";

import { SiteAuthActions } from "@/components/site-auth-actions";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] shadow-[0_4px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.25rem] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap md:gap-6 md:px-10">
        <Link
          href="/"
          className="group flex shrink-0 items-center transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-px"
          aria-label="cyob home"
        >
          <Image
            src="/cyob-logo.png"
            alt="cyob"
            width={654}
            height={521}
            className="h-12 w-auto object-contain brightness-0 invert drop-shadow-[0_0_28px_color-mix(in_oklab,var(--accent)_40%,transparent)] sm:h-[3.25rem]"
            priority
          />
        </Link>
        <SiteNav />
        <div className="flex items-center gap-2">
          <SiteAuthActions />
        </div>
      </div>
    </header>
  );
}
