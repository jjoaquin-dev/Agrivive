import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  formMaxWidth?: string;
  centered?: boolean;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
  formMaxWidth = "max-w-[440px]",
  centered = false,
}: AuthShellProps) {
  if (centered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-agrivive-background px-4 py-8 text-[#14231A] sm:px-6 sm:py-12">
        <Card className="mx-auto w-full max-w-[480px] overflow-hidden rounded-[28px] border border-agrivive-border/80 bg-white p-6 shadow-auth sm:p-10">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
              aria-label="Agrivive home"
            >
              <Image
                src="/brand/agrivive-logo-bag.png"
                alt="Agrivive"
                width={26}
                height={26}
                className="h-[26px] w-auto object-contain"
                priority
              />
              <span className="font-brand text-[26px] font-black leading-none tracking-tight text-[#457D00]">
                Agrivive
              </span>
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#14231A] sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#5F7367]">
              {description}
            </p>
          </div>

          {children}

          <Separator className="my-6 bg-agrivive-border/70" />
          <div className="text-center text-sm text-[#5F7367]">
            {footer}
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-white text-[#14231A] lg:grid-cols-2">
      {/* Left Visual Hero Panel (Top-left text placement, bigger typography) */}
      <aside className="relative hidden h-full min-h-screen flex-col justify-start overflow-hidden lg:flex">
        <Image
          src="/brand/auth-market-produce.jpg"
          alt="Fresh market produce crates in Davao City"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />

        {/* Top gradient strictly for text contrast */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-neutral-950/90 via-neutral-950/50 to-transparent"
          aria-hidden="true"
        />

        {/* Top-Left Hero Text */}
        <div className="relative z-10 p-10 pt-12 lg:p-14 lg:pt-16 text-white text-left">
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[44px] leading-[1.15]">
            Rescue Surplus Vegetables in Davao City
          </h2>
          <p className="mt-4 max-w-lg font-body text-base text-white/95 leading-relaxed drop-shadow-sm sm:text-lg">
            Reserve fresh surplus produce directly from verified local market stalls. Save money and help vendors reduce food waste.
          </p>
        </div>
      </aside>

      {/* Right Form Panel (Design preserved exactly) */}
      <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
        <div className={cn("w-full", formMaxWidth)}>
          <Link
            href="/"
            className="group mb-6 flex w-fit items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
            aria-label="Agrivive home"
          >
            <Image
              src="/brand/agrivive-logo-bag.png"
              alt="Agrivive"
              width={26}
              height={26}
              className="h-[26px] w-auto object-contain transition-transform duration-150 group-hover:scale-105"
              priority
            />
            <span className="font-brand text-[26px] font-black leading-none tracking-tight text-[#457D00]">
              Agrivive
            </span>
          </Link>

          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#14231A] sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5F7367]">
              {description}
            </p>
          </div>

          {children}

          <Separator className="my-6 bg-agrivive-border/70" />
          <div className="text-center text-sm text-[#5F7367]">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
