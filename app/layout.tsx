import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "cyob — strategic intelligence",
    template: "%s — cyob",
  },
  description:
    "A private AI war room for industry intelligence and company strategy.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://cyob.site",
  ),
  openGraph: {
    title: "cyob — strategic intelligence",
    description:
      "Ten specialist agents. One war room for industry intelligence and company strategy.",
    siteName: "cyob",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cyob — strategic intelligence",
    description:
      "Ten specialist agents. One war room for industry intelligence and company strategy.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "cyob",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05060a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[var(--bg-3)] focus:px-3 focus:py-2 focus:text-sm focus:text-[var(--text)]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
