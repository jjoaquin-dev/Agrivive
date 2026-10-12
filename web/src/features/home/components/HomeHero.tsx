import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, MapPin } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-agrivive-border bg-agrivive-background">
      <div className="absolute -left-24 top-20 size-64 rounded-full bg-agrivive-sage/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 top-10 size-72 rounded-full bg-agrivive-terracotta/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-4 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-agrivive-border bg-white px-3 py-2 text-sm font-semibold text-agrivive-primary shadow-[0_8px_24px_rgba(31,77,58,0.06)]">
            <span className="flex size-7 items-center justify-center rounded-full bg-agrivive-sage/30"><Leaf aria-hidden="true" size={15} /></span>
            Local produce, ready nearby
          </div>
          <h1 className="mt-6 max-w-2xl font-heading text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] text-agrivive-primary sm:text-6xl lg:text-7xl">
            Good produce still has a place at your table.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-agrivive-muted sm:text-lg">
            Find fresh surplus from local sellers, reserve what you need, and pick it up when it works for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-6 font-semibold text-white shadow-[0_12px_24px_rgba(31,77,58,0.16)] transition-[background-color,transform] hover:-translate-y-px hover:bg-agrivive-primaryPressed active:translate-y-px">
              Browse marketplace <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link href="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-agrivive-border bg-white px-6 font-semibold text-agrivive-primary transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-agrivive-primary hover:bg-agrivive-sage/10 active:translate-y-px">
              Join Agrivive
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-agrivive-muted">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white text-agrivive-primary shadow-[0_6px_16px_rgba(31,77,58,0.08)]"><MapPin aria-hidden="true" size={17} /></span>
            <span>Made for everyday buying in local markets.</span>
          </div>
        </div>
        <div className="relative min-h-[330px] sm:min-h-[430px] lg:min-h-[540px]">
          <Image src="/brand/agrivive-market-day-hero.png" alt="Friendly vegetable characters gathered around a local produce stall" fill priority className="object-contain object-center lg:object-right" sizes="(min-width: 1024px) 60vw, 100vw" />
          <div className="absolute bottom-4 left-4 max-w-[220px] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_34px_rgba(31,77,58,0.13)] backdrop-blur-sm sm:bottom-8 sm:left-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-agrivive-terracotta">A shorter trip</p>
            <p className="mt-1 font-heading text-lg font-bold leading-tight text-agrivive-primary">From a nearby stall to your kitchen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
