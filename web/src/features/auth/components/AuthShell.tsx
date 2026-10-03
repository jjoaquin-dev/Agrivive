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
    <main className="min-h-screen bg-agrivive-background px-4 py-6 text-agrivive-text sm:px-8 sm:py-10">
      <Card className="mx-auto grid min-h-[720px] w-full max-w-[1180px] gap-0 overflow-hidden rounded-[28px] border-agrivive-border/80 bg-white p-2 shadow-auth sm:p-3 lg:grid-cols-[0.88fr_1.12fr] lg:p-4">
        {/* Left Form Panel */}
        <section className="flex items-center px-5 py-8 sm:px-12 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-[420px]">
            <Link
              href="/"
              className="mb-8 flex w-fit items-center gap-3 rounded-xl focus-visible:ring-inset"
              aria-label="Agrivive home"
            >
              <Image
                src="/brand/agrivive-logo-icon.png"
                alt=""
                width={42}
                height={42}
                className="h-10 w-10 rounded-xl"
                priority
              />
              <div>
                <p className="font-heading text-lg font-bold tracking-[0.12em] text-agrivive-primary">
                  AGRIVIVE
                </p>
                <p className="text-[10px] tracking-[0.13em] text-agrivive-muted">
                  DAVAO LOCAL MARKETS
                </p>
              </div>
            </Link>

            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold leading-[1.08] tracking-tight sm:text-[36px]">
                {title}
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-agrivive-muted">
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

        {/* Right Visual Panel with Trust Badges */}
        <aside className="relative hidden min-h-[680px] overflow-hidden rounded-[22px] bg-agrivive-primary lg:block">
          <Image
            src="/brand/buyer-market-auth.png"
            alt="A local market seller preparing fresh vegetables"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 1px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

          {/* Top Location Trust Pill */}
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <MapPin className="size-3.5 text-emerald-400" />
            <span>Bankerohan & Agdao Public Markets</span>
          </div>

          {/* Bottom Overlay Card with Value Pillars */}
          <div className="absolute inset-x-6 bottom-6 rounded-[22px] border border-white/15 bg-agrivive-primary/85 p-6 text-white shadow-xl backdrop-blur-md">
            <p className="font-heading text-xl font-bold">
              Fresh surplus from nearby sellers.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              Find marketable vegetables, secure what you need with 24-hr hold, and pickup directly at market stalls.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/15 pt-3 text-xs text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                <Clock className="size-3 text-emerald-300" /> 24h Hold
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                <Sparkles className="size-3 text-amber-300" /> Verified Stalls
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 backdrop-blur-sm">
                <Sprout className="size-3 text-emerald-300" /> Zero Waste
              </span>
            </div>
          </div>
        </aside>
      </Card>
    </main>
  );
}
