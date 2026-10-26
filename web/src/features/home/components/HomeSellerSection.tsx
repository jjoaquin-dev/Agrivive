import Link from "next/link";
import { ArrowRight, Sprout, Store } from "lucide-react";

export function HomeSellerSection() {
  return (
    <section id="sellers" className="bg-agrivive-background py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#F2DFAF] p-7 sm:p-10"><div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/35" aria-hidden="true" /><div className="absolute -bottom-16 -left-10 size-40 rounded-full bg-agrivive-terracotta/20" aria-hidden="true" /><div className="relative flex min-h-[230px] flex-col justify-between"><span className="flex size-12 items-center justify-center rounded-2xl bg-white text-agrivive-primary"><Sprout aria-hidden="true" size={23} /></span><p className="max-w-xs font-heading text-3xl font-bold leading-tight tracking-[-0.04em] text-agrivive-primary">Your harvest deserves a clear next step.</p></div></div>
        <div className="lg:pl-8"><span className="text-xs font-bold uppercase tracking-[0.2em] text-agrivive-terracotta">For local sellers</span><h2 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-agrivive-primary sm:text-5xl">Make availability easier to see and easier to act on.</h2><p className="mt-5 max-w-xl text-base leading-7 text-agrivive-muted">List what you have, keep pickup details in one place, and use your seller tools to understand how your listings are moving.</p><Link href="/signup" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-6 font-semibold text-white transition-[background-color,transform] hover:-translate-y-px hover:bg-agrivive-primaryPressed active:translate-y-px">Create a seller account <ArrowRight aria-hidden="true" size={18} /></Link><div className="mt-9 flex items-start gap-3 border-t border-agrivive-border pt-5 text-sm leading-6 text-agrivive-muted"><Store aria-hidden="true" className="mt-0.5 shrink-0 text-agrivive-primary" size={19} /><span>Buyers and sellers use the same Agrivive marketplace, with role-specific tools after sign-in.</span></div></div>
      </div>
    </section>
  );
}
