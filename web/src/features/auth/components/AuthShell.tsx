"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Carousel slide definitions — brand scenes + vegetable images
// ---------------------------------------------------------------------------
const CAROUSEL_SLIDES = [
  {
    src: "/produce/market-vegetable-spread.jpg",
    alt: "Colorful fresh vegetables spread at a local market stall",
  },
  {
    src: "/produce/market-stall-fresh.avif",
    alt: "Fresh produce at a Davao City market stall",
  },
  {
    src: "/produce/green-ampalaya.jpg",
    alt: "Fresh green ampalaya from local farms",
  },
  {
    src: "/produce/highland-carrots.jpg",
    alt: "Highland carrots freshly harvested",
  },
  {
    src: "/produce/native-tomatoes.jpg",
    alt: "Fresh native tomatoes from Davao farms",
  },
  {
    src: "/produce/purple-eggplant.jpg",
    alt: "Fresh purple eggplant",
  },
];

// ---------------------------------------------------------------------------
// Carousel panel (auto-scrolling with dot indicators)
// ---------------------------------------------------------------------------
function AuthCarouselPanel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-[#F2F3F0]">
      {/* Slide track */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {CAROUSEL_SLIDES.map((slide, i) => (
            <div key={i} className="relative h-full w-full flex-shrink-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="50vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex flex-shrink-0 items-center justify-center gap-2 py-4">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/40",
              i === current
                ? "w-6 bg-[#457D00]"
                : "w-2 bg-gray-300 hover:bg-gray-400",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AuthShell
// ---------------------------------------------------------------------------
type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  formMaxWidth?: string;
  /** @deprecated kept for backwards compat — all layouts now use two-column */
  centered?: boolean;
  /** Which side the carousel appears on. Defaults to "right". */
  imagePosition?: "left" | "right";
};

export function AuthShell({
  title,
  description,
  children,
  footer,
  formMaxWidth = "max-w-[440px]",
  imagePosition = "left",
}: AuthShellProps) {
  // Form column ---------------------------------------------------------------
  const formColumn = (
    <section className="flex min-h-screen w-full flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
      <div className={cn("mx-auto w-full", formMaxWidth)}>
        {/* Logo */}
        <Link
          href="/"
          className="group mb-8 flex w-fit items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
          aria-label="Agrivive home"
        >
          <Image
            src="/brand/agrivive-logo-full-new.png"
            alt="Agrivive"
            width={120}
            height={36}
            className="h-[36px] w-auto object-contain transition-transform duration-150 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Title & description */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#14231A] sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#5F7367]">
            {description}
          </p>
        </div>

        {/* Page-specific content */}
        {children}

        <Separator className="my-6 bg-agrivive-border/70" />
        <div className="text-center text-sm text-[#5F7367]">{footer}</div>
      </div>
    </section>
  );

  // Carousel column -----------------------------------------------------------
  const carouselColumn = (
    <div className="hidden p-5 lg:flex lg:flex-col">
      <AuthCarouselPanel />
    </div>
  );

  return (
    <main className="relative grid min-h-screen w-full grid-cols-1 bg-white text-[#14231A] lg:grid-cols-2">

      {imagePosition === "left" ? (
        <>
          {carouselColumn}
          {formColumn}
        </>
      ) : (
        <>
          {formColumn}
          {carouselColumn}
        </>
      )}
    </main>
  );
}
