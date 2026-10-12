import { SiteHeader } from "@/src/components/SiteHeader";
import { HomeBenefits } from "@/src/features/home/components/HomeBenefits";
import { HomeFinalCta } from "@/src/features/home/components/HomeFinalCta";
import { HomeHero } from "@/src/features/home/components/HomeHero";
import { HomeHowItWorks } from "@/src/features/home/components/HomeHowItWorks";
import { HomeMarketPulse } from "@/src/features/home/components/HomeMarketPulse";
import { HomeSellerSection } from "@/src/features/home/components/HomeSellerSection";
import { HomeWhyAgrivive } from "@/src/features/home/components/HomeWhyAgrivive";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-agrivive-background text-agrivive-text">
        <HomeHero />
        <HomeBenefits />
        <div className="overflow-hidden border-b border-agrivive-border bg-agrivive-primary px-4 py-4 text-center font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-[#F2DFAF] sm:text-sm" aria-hidden="true">
          Local produce <span className="mx-3 text-white/45">✦</span> Clear pickup plans <span className="mx-3 text-white/45">✦</span> Better market days <span className="mx-3 text-white/45">✦</span> Local produce
        </div>
        <HomeWhyAgrivive />
        <HomeHowItWorks />
        <HomeMarketPulse />
        <HomeSellerSection />
        <HomeFinalCta />
      </main>
    </>
  );
}
