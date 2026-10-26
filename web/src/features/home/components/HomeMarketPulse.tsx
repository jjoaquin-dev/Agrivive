import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Info } from "lucide-react";

export function HomeMarketPulse() {
  return (
    <section id="market-pulse" className="bg-agrivive-primary py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20 lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2DFAF]">Public market data</span>
          <h2 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-5xl">
            A clearer view of what local buyers are looking for.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/75">
            Agrivive turns completed purchase activity into aggregated insights that help farmers, vendors, and city planners notice demand patterns without exposing any buyer’s private details.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/stakeholder/summary"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F2DFAF] px-6 font-semibold text-agrivive-primary transition-[background-color,transform] hover:-translate-y-px hover:bg-white active:translate-y-px"
            >
              View Public Market Report <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-emerald-50/75">
              <Info aria-hidden="true" size={16} />Aggregated data only
            </span>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                <BarChart3 aria-hidden="true" size={19} />
              </span>
              <div>
                <p className="font-heading font-bold">Market Pulse</p>
                <p className="text-xs text-emerald-50/65">Public summary</p>
              </div>
            </div>
            <span className="rounded-full bg-[#F2DFAF]/15 px-3 py-1 text-xs font-semibold text-[#F2DFAF]">
              Uses real activity
            </span>
          </div>
          <div className="mt-5 rounded-2xl bg-[#F8F6F1] p-3">
            <Image
              src="/brand/agrivive-market-pulse.png"
              alt="Illustration of aggregated local market trends"
              width={1024}
              height={1024}
              className="h-auto w-full"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-emerald-50/75">
            This public view displays verified demand and surplus distribution across Davao markets without exposing individual identities.
          </p>
        </div>
      </div>
    </section>
  );
}
