import { ArrowUpRight, CircleCheck, Store } from "lucide-react";

const reasons = [
  "See what is actually available before you make the trip.",
  "Reserve a listing while the seller prepares it for pickup.",
  "Support local sellers while helping good produce move sooner.",
];

export function HomeWhyAgrivive() {
  return (
    <section id="why-agrivive" className="bg-agrivive-background py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20 lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-agrivive-terracotta">Why Agrivive</span>
          <h2 className="mt-4 max-w-xl font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-agrivive-primary sm:text-5xl">A calmer way to shop what your market has today.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-agrivive-muted">Local produce can be great and still be hard to find at the right moment. Agrivive brings the stall, the seller, and the pickup plan into one clear place.</p>
          <a href="#how-it-works" className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-agrivive-primary underline decoration-agrivive-sage decoration-2 underline-offset-4 hover:text-agrivive-primaryPressed">See how it works <ArrowUpRight aria-hidden="true" size={17} /></a>
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-agrivive-border bg-white p-6 shadow-[0_18px_50px_rgba(31,77,58,0.08)] sm:p-8">
          <div className="absolute -right-12 -top-12 size-36 rounded-full bg-agrivive-sage/20" aria-hidden="true" />
          <div className="relative flex items-center gap-3 border-b border-agrivive-border pb-5"><span className="flex size-11 items-center justify-center rounded-2xl bg-agrivive-primary text-white"><Store aria-hidden="true" size={21} /></span><div><p className="font-heading font-bold text-agrivive-primary">From the market to your table</p><p className="text-sm text-agrivive-muted">One small plan makes pickup easier.</p></div></div>
          <ul className="relative mt-5 space-y-4">
            {reasons.map((reason) => <li key={reason} className="flex gap-3 text-sm leading-6 text-agrivive-text"><CircleCheck aria-hidden="true" className="mt-0.5 shrink-0 text-agrivive-success" size={19} />{reason}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
