"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Carrot, HandHeart, QrCode, Sprout } from "lucide-react";
import { gsap } from "@/src/lib/gsap";
import { prefersReducedMotion } from "@/src/lib/motion";

const steps = [
  { title: "Rescue Vegetables", text: "Fresh vegetables find a buyer instead of going to waste.", Icon: Sprout, bg: "#EEF9C8", ink: "#3D6B00" },
  { title: "Surplus Produce", text: "Reserve extra harvest from verified local stalls in Davao City.", Icon: Carrot, bg: "#FDE8DC", ink: "#9A3B14" },
  { title: "24-hour QR code", text: "Reserve now, then show your QR code at pickup.", Icon: QrCode, bg: "#D8F2DF", ink: "#1F5A3A" },
  { title: "Help Local Sellers", text: "Every pickup supports a local stall and helps cut food waste.", Icon: HandHeart, bg: "#FFF1C6", ink: "#7A5A00" },
];

// Each card sticks a little lower than the one before, so earlier cards peek out above the newest one.
const PEEK = 14;

export function HomeHowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);

  // As the next card slides over a card, that card shrinks and tilts back a little (scrubbed to scroll).
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      cards.slice(0, -1).forEach((card, i) => {
        gsap.to(card.firstElementChild, {
          scale: 0.94,
          rotate: i % 2 ? 1.2 : -1.2,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 35%", scrub: true },
        });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="relative bg-neutral-900 px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-[4vw]">
      {/* Market photo stays put while the cards scroll over it (no overflow-hidden here: it would stop the sticky) */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="sticky top-0 h-dvh w-full">
          <Image src="/how-it-works/market-background.webp" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header: eyebrow, title with the Agrivive accent, one supporting line */}
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <span className="type-eyebrow text-[#E2FD56]">The Process</span>
          <h2 className="type-section mt-3 font-heading text-white">
            How{" "}
            <span className="relative inline-block text-[#E2FD56]">
              Agrivive
              <svg
                viewBox="0 0 120 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 left-0 w-full h-3 sm:h-3.5 text-[#FEA938] overflow-visible pointer-events-none"
                preserveAspectRatio="none"
              >
                <path d="M3 13 C 35 3, 85 3, 117 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Works
          </h2>
          <p className="type-lede mx-auto mt-4 max-w-2xl text-white/85">
            Three simple steps to rescue wholesome harvest, save money, and empower Davao local growers.
          </p>
        </div>

        <ol ref={listRef} className="mt-12 flex flex-col gap-[14vh] [--steps-top:96px] sm:mt-16 sm:[--steps-top:150px]">
          {steps.map(({ title, text, Icon, bg, ink }, i) => (
            <li key={title} className="sticky" style={{ top: `calc(var(--steps-top) + ${i * PEEK}px)` }}>
              <article
                className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[2rem] px-6 py-12 text-center will-change-transform sm:min-h-[min(70dvh,520px)] sm:px-12"
                style={{ backgroundColor: bg, color: ink }}
              >
                {/* Big step number behind the text */}
                <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-10 select-none font-brand text-[22rem] font-bold leading-none opacity-[0.12] sm:text-[30rem]">
                  {i + 1}
                </span>
                <p className="relative text-sm font-bold uppercase tracking-widest opacity-80">Step {i + 1} of {steps.length}</p>
                <span className="relative mt-5 flex size-14 items-center justify-center rounded-full bg-white/70">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 font-brand text-4xl font-bold tracking-tight sm:text-6xl">{title}</h3>
                <p className="relative mt-4 max-w-md font-body text-lg leading-relaxed sm:text-xl">{text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
