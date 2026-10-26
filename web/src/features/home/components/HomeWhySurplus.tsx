import { Coins, ShieldCheck, MapPin, QrCode, SlidersHorizontal, Store } from "lucide-react";
import { HomeWhySurplusBenefitCard } from "./HomeWhySurplusCard";

export function HomeWhySurplus() {
  return (
    <section id="why-agrivive" className="bg-[#14231A] py-16 sm:py-24 border-b border-neutral-800 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Styled Agrivive Word */}
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8EB5E]">
            Why Choose Agrivive
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
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
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300 max-w-2xl mx-auto">
            The platform assists local vendors and buyers in Davao City by making surplus vegetable listings easier to track, helping reduce postharvest losses and connect supply with local demand.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-12">
          {/* Row 1 - Horizontal Card 1: Visual & Verified Transparency */}
          <div className="relative lg:col-span-7">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] bg-[#FEA938] p-6 sm:p-8 text-neutral-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-xl bg-black/10 px-3.5 py-1.5 font-heading text-xs font-bold text-neutral-900 backdrop-blur-md border border-black/15">
                    Visual &amp; Verified Transparency
                  </span>
                  <span className="rounded-full bg-black/20 px-3 py-1 font-heading text-xs font-bold text-neutral-950">
                    Buyer Guarantee
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
                  Real-Time Photos and Verified Sellers
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-900/90 max-w-xl">
                  Address common buying concerns by viewing recent product photographs (desired by 95.1% of buyers) and verified seller legitimacy details (preferred by 97.6%) upfront, giving you complete confidence before traveling or purchasing.
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
            </div>
          </div>

          {/* Row 1 - Small Card 1: Fight Food Waste */}
          <div className="relative lg:col-span-5">
            <HomeWhySurplusBenefitCard
              tag="Fight Food Waste"
              headline="Environmental Impact"
              description="Directly combat local postharvest losses—which exceed 20% for key crops like cabbage, eggplant, and tomato—by giving surplus produce a productive purpose before spoilage occurs."
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
            className="lg:col-span-4"
          />

          {/* Row 2 - Small Card 3: Empower Local Communities */}
          <HomeWhySurplusBenefitCard
            tag="Empower Local Communities"
            headline="Support Local Vendors"
            description="Keep your spending within the regional agricultural ecosystem by directly backing hardworking suppliers and vendors from major local markets."
            bgType="image"
            imageSrc="/benefits/empower-communities.jpg"
            className="lg:col-span-4"
          />

          {/* Row 2 - Small Card 4: Convenient Local Pickup */}
          <HomeWhySurplusBenefitCard
            tag="Convenient Local Pickup"
            headline="Clear Logistics"
            description="Locate nearby surplus items quickly and pick them up at designated market stalls with minimal friction or confusion."
            bgType="sage"
            icon={<MapPin className="size-6 text-[#457D00]" />}
            className="lg:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}
