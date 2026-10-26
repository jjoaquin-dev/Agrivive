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
  formMaxWidth = "max-w-[420px]",
  centered = false,
}: AuthShellProps) {
  if (centered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-agrivive-background px-4 py-8 text-[#14231A] sm:px-6 sm:py-12">
        <Card className="mx-auto w-full max-w-[480px] overflow-hidden rounded-[28px] border border-agrivive-border/80 bg-white p-6 shadow-auth sm:p-10">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-1 transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
              aria-label="Agrivive home"
            >
              <Image
                src="/brand/agrivive-logo-crate.png"
                alt="Agrivive"
                width={40}
                height={40}
                className="size-10 object-contain"
                priority
              />
              <span className="font-heading text-[32px] font-bold leading-none tracking-tight text-[#457D00]">
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
    <main className="flex min-h-screen items-center justify-center bg-agrivive-background px-4 py-6 text-[#14231A] sm:px-8 sm:py-10 lg:px-12">
      <Card className="mx-auto grid min-h-[840px] w-full max-w-[1440px] gap-0 overflow-hidden rounded-[28px] border-agrivive-border/80 bg-white p-2 shadow-auth sm:p-3 lg:min-h-[860px] lg:grid-cols-[1fr_1fr] lg:p-4">
        {/* Left Visual Showcase (3D Cute Vegetables Theme) */}
        <aside className="relative hidden min-h-[800px] overflow-hidden rounded-[22px] border border-agrivive-border/60 bg-gradient-to-br from-emerald-50 via-amber-50/40 to-emerald-100/60 lg:flex lg:min-h-[820px]">
          <Image
            src="/brand/cute-veggies-auth.jpg"
            alt="7 cute 3D vegetable characters having fun with 2 burlap sacks in a busy Davao market"
            fill
            className="object-cover"
            style={{ objectPosition: "center 75%" }}
            sizes="(min-width: 1024px) 50vw, 1px"
            priority
          />
        </aside>

        {/* Right Form Panel */}
        <section className="flex items-center px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className={cn("mx-auto w-full", formMaxWidth)}>
            <Link
              href="/"
              className="group mb-6 flex w-fit items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
              aria-label="Agrivive home"
            >
              <Image
                src="/brand/agrivive-logo-crate.png"
                alt="Agrivive"
                width={40}
                height={40}
                className="size-10 object-contain transition-transform duration-150 group-hover:scale-105"
                priority
              />
              <span className="font-heading text-[32px] font-bold leading-none tracking-tight text-[#457D00]">
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
      </Card>
    </main>
  );
}
