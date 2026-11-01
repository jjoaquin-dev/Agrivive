import { Coins, MapPin } from "lucide-react";
import { HomeWhySurplusBenefitCard } from "./HomeWhySurplusCard";

export function HomeWhySurplus() {
  return (
    <section id="why-agrivive" className="bg-[#14231A] py-16 sm:py-24 border-b border-neutral-800 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: eyebrow, title with the Agrivive accent, one supporting line */}
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <span className="type-eyebrow text-[#E2FD56]">Why Choose Agrivive</span>
          <h2 className="type-section mt-3 font-heading text-white">
            Why Choose{" "}
            <span className="relative inline-block text-[#E2FD56]">
              Agrivive
              <svg
                viewBox="0 0 120 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 left-0 w-full h-3 sm:h-3.5 text-[#E2FD56] overflow-visible pointer-events-none"
                preserveAspectRatio="none"
              >
                <path d="M3 13 C 35 3, 85 3, 117 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            ?
          </h2>
          <p className="type-lede mx-auto mt-4 max-w-2xl text-neutral-300">
            Agrivive helps Davao City sellers and buyers find extra vegetables before they go to waste.
          </p>
        </div>

        {/* Headline proof: the two buyer-trust figures in one calm panel */}
        <div data-reveal className="mt-12 flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:mt-16 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <span className="type-eyebrow text-[#E2FD56]">Visual &amp; Verified Transparency</span>
            <h3 className="type-card mt-3 font-heading text-white">Real-Time Photos and Verified Sellers</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
              See recent product photos and seller verification before you travel or buy.
            </p>
          </div>
        </div>

        {/* Benefits: four equal cards, two per row on tablets, one per row on phones */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div data-reveal>
            <HomeWhySurplusBenefitCard
              tag="Fight Food Waste"
              headline="Environmental Impact"
              description="Good vegetables get a second chance to be eaten, not thrown away."
              imageSrc="/benefits/fight-food-waste.jpg"
            />
          </div>
          <div data-reveal>
            <HomeWhySurplusBenefitCard
              tag="Maximize Your Budget"
              headline="Affordable Surplus Pricing"
              description="Purchase edible surplus produce at or near wholesale and buying prices, allowing you to access quality vegetables while keeping your costs low."
              icon={<Coins className="size-6" />}
            />
          </div>
          <div data-reveal>
            <HomeWhySurplusBenefitCard
              tag="Empower Local Communities"
              headline="Support Local Vendors"
              description="Your money stays in Davao and goes straight to local sellers."
              imageSrc="/benefits/empower-communities.jpg"
            />
          </div>
          <div data-reveal>
            <HomeWhySurplusBenefitCard
              tag="Convenient Local Pickup"
              headline="Clear Logistics"
              description="Locate nearby surplus items quickly and pick them up at designated market stalls with minimal friction or confusion."
              icon={<MapPin className="size-6" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
