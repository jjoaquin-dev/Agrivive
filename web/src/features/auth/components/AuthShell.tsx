import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Sparkles, Sprout } from "lucide-react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-agrivive-background px-4 py-6 text-agrivive-text sm:px-8 sm:py-10">
      <Card className="mx-auto grid min-h-[720px] w-full max-w-[1180px] gap-0 overflow-hidden rounded-[28px] border-agrivive-border/80 bg-white p-2 shadow-auth sm:p-3 lg:grid-cols-[1.08fr_0.92fr] lg:p-4">
        {/* Left Visual Showcase (3D Cute Vegetables Theme) */}
        <aside className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden rounded-[22px] border border-agrivive-border/60 bg-gradient-to-br from-emerald-50 via-amber-50/40 to-emerald-100/60 p-8 lg:flex">
          <Image
            src="/brand/cute-veggies-auth.jpg"
            alt="Cute 3D vegetable characters with market stats"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 55vw, 1px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Location Trust Pill */}
          <div className="relative z-10 flex items-center gap-2 self-start rounded-full border border-white/40 bg-white/70 px-4 py-1.5 text-xs font-semibold text-agrivive-text shadow-xs backdrop-blur-md">
            <MapPin className="size-3.5 text-agrivive-primary" />
            <span>Bankerohan & Agdao Public Markets</span>
          </div>

          {/* Bottom Floating Stats Pillar */}
          <div className="relative z-10 rounded-[22px] border border-white/30 bg-white/85 p-5 text-agrivive-text shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-agrivive-primary">
              <Sprout className="size-4" />
              <span>Davao City Surplus Rescue</span>
            </div>
            <p className="mt-1 font-heading text-lg font-bold leading-tight text-agrivive-text">
              Fresh surplus vegetables, ready for stall pickup.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                <Clock className="size-3 text-emerald-600" /> 24h Hold
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-amber-800">
                <Sparkles className="size-3 text-amber-600" /> Verified Stalls
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                <Sprout className="size-3 text-emerald-600" /> Zero Waste
              </span>
            </div>
          </div>
        </aside>

        {/* Right Form Panel */}
        <section className="flex items-center px-5 py-8 sm:px-12 lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-[420px]">
            <Link
              href="/"
              className="mb-6 flex w-fit items-center rounded-xl focus-visible:ring-inset"
              aria-label="Agrivive home"
            >
              <Image
                src="/brand/agrivive-logo-icon.png"
                alt="Agrivive"
                width={48}
                height={48}
                className="size-12 object-contain"
                priority
              />
            </Link>

            <div className="mb-6">
              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-agrivive-muted">
                {description}
              </p>
            </div>

            {children}

            <Separator className="my-5" />
            <div className="text-center text-sm text-agrivive-muted">
              {footer}
            </div>
          </div>
        </section>
      </Card>
    </main>
  );
}
