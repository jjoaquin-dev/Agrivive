"use client";

const steps = [
  {
    step: "01",
    title: "SOURCE",
    description:
      "Discover surplus produce from local growers and market sellers across Davao. Good vegetables deserve a second chance.",
    image: "/how-it-works/step-1-source.jpg",
    alt: "Local farmer holding a wooden harvest crate full of fresh carrots, tomatoes, and greens",
  },
  {
    step: "02",
    title: "DISCOVER",
    description:
      "Browse available surplus produce, check stock, and find options that fit your needs.",
    image: "/how-it-works/step-2-discover.png",
    alt: "Agrivive digital marketplace browsing interface with seasonal produce categories",
  },
  {
    step: "03",
    title: "COLLECT",
    description:
      "Present your reservation QR code to the seller and collect your produce with ease.",
    image: "/how-it-works/step-3-collect.jpg",
    alt: "Customer and seller scanning reservation QR code at public market produce stall",
  },
];

export function HomeHowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAF9F5] py-16 sm:py-24 border-b border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with One-Line Subheader & Styled Agrivive Word */}
        <div className="mx-auto max-w-3xl lg:max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#457D00]">
            The Process
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            How{" "}
            <span className="relative inline-block text-[#457D00]">
              Agrivive
              <svg
                viewBox="0 0 120 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 left-0 w-full h-3 sm:h-3.5 text-[#FEA938] overflow-visible pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 13 C 35 3, 85 3, 117 13"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            Works
          </h2>
          <p className="mt-4 text-sm text-neutral-600 sm:text-base md:text-[17px] sm:whitespace-nowrap">
            Three simple steps to rescue wholesome harvest, save money, and empower Davao local growers.
          </p>
        </div>

        {/* 3 Modern Sequential Cards with Edge-to-Edge Image Headers */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-neutral-200/70 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-6px_rgba(20,50,30,0.1)]"
            >
              {/* Full-Bleed Image Header (Flush horizontally and at the top) */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-100">
                {/* 01, 02, 03 Frosted Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center rounded-xl bg-white/95 px-3 py-1 font-heading text-xs sm:text-sm font-bold text-[#FEA938] shadow-xs backdrop-blur-md border border-neutral-200/60">
                    {item.step}
                  </span>
                </div>

                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Text Content Stage with Dedicated Padding */}
              <div className="flex flex-col p-6 sm:p-7">
                <span className="font-heading text-xs font-bold tracking-widest text-[#FEA938] mb-1">
                  {item.step}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-neutral-900 group-hover:text-[#457D00] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
