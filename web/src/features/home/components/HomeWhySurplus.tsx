import { Coins, ShieldCheck, MapPin, QrCode, SlidersHorizontal, Store } from "lucide-react";
import { HomeWhySurplusBenefitCard } from "./HomeWhySurplusCard";

// TODO(owner): name the survey and year behind the 95.1% and 97.6% figures. The caption shows once this is set.
const STAT_SOURCE: string = "";

export function HomeWhySurplus() {
  return (
    <section id="why-agrivive" className="bg-[#14231A] py-16 sm:py-24 border-b border-neutral-800 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Styled Agrivive Word */}
        <div data-reveal className="relative mx-auto max-w-3xl text-center">
          <span className="type-eyebrow text-[#B8EB5E]">
            Why Choose Agrivive
          </span>
          <h2 className="type-section mt-3 font-heading text-white">
            Why Choose{" "}
            <span className="relative inline-block text-[#B8EB5E]">
              Agrivive
              <svg
                viewBox="0 0 120 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 left-0 w-full h-3 sm:h-3.5 text-[#EBA635] overflow-visible pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 13 C 35 3, 85 3, 117 13"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            ?
          </h2>
          <p className="type-lede mx-auto mt-4 max-w-2xl text-neutral-300">
            Agrivive helps Davao City sellers and buyers find extra vegetables before they go to waste.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-12">
          {/* Row 1 - Horizontal Card 1: Visual & Verified Transparency */}
          <div data-reveal className="relative lg:col-span-7">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] bg-[#FEA938] p-6 sm:p-8 text-neutral-950 shadow-lg transition-[transform,box-shadow] duration-200 ease-settle hover:-translate-y-1 hover:shadow-2xl h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-xl bg-black/10 px-3.5 py-1.5 font-heading text-xs font-bold text-neutral-900 backdrop-blur-md border border-black/15">
                    Visual &amp; Verified Transparency
                  </span>
                </div>
                <h3 className="type-card mt-6 font-heading text-neutral-950 sm:text-[1.75rem]">
                  Real-Time Photos and Verified Sellers
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-neutral-900/90 max-w-xl">
                  See recent product photos (wanted by 95.1% of buyers) and seller verification (wanted by 97.6%) before you travel or buy.
                </p>
              </div>

              {/* Stat Callouts */}
              <div className="mt-8 pt-6 border-t border-black/15 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-heading text-3xl sm:text-4xl font-bold text-neutral-950">95.1%</p>
                  <p className="mt-0.5 text-xs font-semibold text-neutral-900/80">Require Live Produce Photos</p>
                </div>
                <div>
                  <p className="font-heading text-3xl sm:text-4xl font-bold text-neutral-950">97.6%</p>
                  <p className="mt-0.5 text-xs font-semibold text-neutral-900/80">Rely on Seller Verification</p>
                </div>
              </div>
              {STAT_SOURCE ? (
                <p className="mt-4 text-xs font-semibold text-neutral-900/80">Source: {STAT_SOURCE}</p>
              ) : null}
            </div>
          </div>

          {/* Row 1 - Small Card 1: Fight Food Waste */}
          <div data-reveal className="relative lg:col-span-5">
            <HomeWhySurplusBenefitCard
              tag="Fight Food Waste"
              headline="Environmental Impact"
              description="Good vegetables get a second chance to be eaten, not thrown away."
              bgType="image"
              imageSrc="/benefits/fight-food-waste.jpg"
              className="relative z-10 h-full"
            />
          </div>

          {/* Row 2 - Small Card 2: Maximize Your Budget */}
          <HomeWhySurplusBenefitCard
            tag="Maximize Your Budget"
            headline="Affordable Surplus Pricing"
            description="Purchase edible surplus produce at or near wholesale and buying prices, allowing you to access quality vegetables while keeping your costs low."
            bgType="cream"
            icon={<Coins className="size-6 text-[#B45309]" />}
            revealed className="lg:col-span-4"
          />

          {/* Row 2 - Small Card 3: Empower Local Communities */}
          <HomeWhySurplusBenefitCard
            tag="Empower Local Communities"
            headline="Support Local Vendors"
            description="Your money stays in Davao and goes straight to local sellers."
            bgType="image"
            imageSrc="/benefits/empower-communities.jpg"
            revealed className="lg:col-span-4"
          />

          {/* Row 2 - Small Card 4: Convenient Local Pickup */}
          <HomeWhySurplusBenefitCard
            tag="Convenient Local Pickup"
            headline="Clear Logistics"
            description="Locate nearby surplus items quickly and pick them up at designated market stalls with minimal friction or confusion."
            bgType="sage"
            icon={<MapPin className="size-6 text-[#457D00]" />}
            revealed className="lg:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}
