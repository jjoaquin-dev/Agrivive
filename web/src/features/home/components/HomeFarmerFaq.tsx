"use client";

import { useState } from "react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { HomeContactSocialModal } from "./HomeContactSocialModal";

const faqItems = [
  {
    q: "What is Agrivive?",
    a: "Agrivive is a platform designed for vegetable suppliers, vendors, and buyers in Davao City to help connect supply with local demand, making it easier to list, find, and manage surplus produce to reduce food waste.",
  },
  {
    q: "How do buyers reserve surplus produce?",
    a: "Buyers can browse available surplus listings, review quantities and item conditions, and place reservations for local pickup using a straightforward QR-based system supported by map directions.",
  },
  {
    q: "How can sellers list surplus items?",
    a: "Suppliers and retail vendors can quickly post remaining surplus stock near or at buying prices to help recover capital, prevent spoilage, and connect directly with interested local buyers.",
  },
  {
    q: "How do buyers verify product condition and seller details?",
    a: "Listings include recent photographs of the produce and seller information, allowing buyers to check item quality and details before traveling to the pickup location.",
  },
  {
    q: "Why use Agrivive instead of social media or general e-commerce apps?",
    a: "Unlike generic platforms or social media groups, Agrivive is tailored specifically for Davao City public market vendors and buyers, offering dedicated surplus tracking, clear stock visibility, and simple pickup coordination in one place.",
  },
];

export function HomeFarmerFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-16 sm:py-24 border-b border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Side Header & Contact Action */}
          <div data-reveal className="lg:col-span-5 flex flex-col justify-between lg:sticky lg:top-32 lg:self-start">
            <div>
              <span className="type-eyebrow text-[#457D00]">
                Frequently Asked Questions
              </span>
              <h2 className="type-section mt-3 font-heading text-neutral-900">
                FAQ about{" "}
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
                </span>
              </h2>
              <p className="type-lede mt-4 max-w-md text-neutral-600">
                Everything you need to know about using Agrivive. Can&apos;t find what you&apos;re looking for?
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 font-heading text-xs sm:text-sm font-bold text-neutral-800 shadow-xs hover:border-[#457D00] hover:text-[#457D00] hover:bg-neutral-50/80 transition-all duration-200 cursor-pointer"
                >
                  Contact us <ArrowUpRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Enlarged Accordion List */}
          <div data-reveal className="lg:col-span-7 divide-y divide-neutral-200/80 border-y border-neutral-200/80">
            {faqItems.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.q} className="py-5 sm:py-6">
                  <button
                    type="button"
                    id={`faq-q-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="group flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${idx}`}
                  >
                    <span
                      className={`font-heading text-[17px] sm:text-xl font-bold leading-snug transition-colors ${
                        isOpen
                          ? "text-[#457D00]"
                          : "text-neutral-900 group-hover:text-[#457D00]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-500 group-hover:text-neutral-900 transition-colors">
                      {isOpen ? (
                        <Minus className="size-5 stroke-[2.5]" />
                      ) : (
                        <Plus className="size-5 stroke-[2.5]" />
                      )}
                    </span>
                  </button>

                  <div
                    id={`faq-a-${idx}`}
                    role="region"
                    aria-labelledby={`faq-q-${idx}`}
                    data-open={isOpen}
                    className="faq-panel"
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="type-lede mt-3 max-w-2xl pr-6 text-neutral-600 sm:pr-10">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Media Contact Modal */}
      <HomeContactSocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />
    </section>
  );
}
