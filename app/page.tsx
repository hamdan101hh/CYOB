import { AgentPipeline } from "@/components/home/agent-pipeline";
import { DubaiMarketExample } from "@/components/home/dubai-market-example";
import { HeroVisual } from "@/components/home/hero-visual";
import { HomeHeroActions } from "@/components/home/home-hero-actions";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProductClarityStrip } from "@/components/home/product-clarity-strip";
import { RevealOnScroll } from "@/components/home/reveal-on-scroll";
import { VisualIntelligenceSection } from "@/components/home/visual-intelligence-section";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.07),transparent_68%)]"
        aria-hidden
      />

      <RevealOnScroll />

      {/* Hero */}
      <section className="page-wrap relative max-w-6xl pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12 xl:gap-14">
          <div className="cyob-reveal cyob-reveal-visible lg:pt-4">
            <div className="chip chip-live w-fit">
              <span className="cyob-pulse-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)] align-middle" />
              Private war room
            </div>
            <h1 className="mt-7 text-balance text-4xl font-semibold leading-[1.03] tracking-tight md:text-5xl lg:text-[3.35rem]">
              <span className="gradient-text">Ten agents.</span>
              <br />
              One visual command center.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-3)]">
              CYOB researches your market, compares rivals, surfaces trends, and
              turns intelligence into charts, visuals, and strategy — not text walls.
            </p>
            <HomeHeroActions />
          </div>
          <div className="cyob-reveal cyob-reveal-visible">
            <HeroVisual />
          </div>
        </div>
      </section>

      <ProductClarityStrip />

      <div className="page-wrap max-w-6xl space-y-20 pb-28 md:space-y-24 md:pb-32">
        <VisualIntelligenceSection />
        <DubaiMarketExample />
        <AgentPipeline />
        <HowItWorks />

        <section className="cyob-reveal">
          <div className="stealth-card rounded-[var(--radius-xl)] px-8 py-12 text-center md:px-14 md:py-14">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
              Open your command center
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-3)]">
              Start the intake — ten agents build your visual war room in one pass.
            </p>
            <div className="mt-8 flex justify-center">
              <HomeHeroActions compact />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
