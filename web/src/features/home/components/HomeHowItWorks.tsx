import Image from "next/image";
import { ArrowRight } from "lucide-react";

const steps = [
  { number: "01", title: "Sellers list", detail: "Sellers share what fresh produce is ready and when it can be picked up.", image: "/brand/agrivive-seller-listing.png", alt: "Seller arranging vegetables at a market stall" },
  { number: "02", title: "Buyers reserve", detail: "Browse a listing, choose an amount, and keep the pickup details close at hand.", image: "/brand/agrivive-buyer-reserve.png", alt: "Buyer reserving a produce listing" },
  { number: "03", title: "Pick up nearby", detail: "Meet the seller, show the pickup pass, and bring good produce home.", image: "/brand/agrivive-pickup.png", alt: "Buyer and seller meeting for produce pickup" },
];

export function HomeHowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center"><span className="text-xs font-bold uppercase tracking-[0.2em] text-agrivive-terracotta">How it works</span><h2 className="mt-4 font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-agrivive-primary sm:text-5xl">Three easy steps to a better market trip.</h2><p className="mt-5 text-base leading-7 text-agrivive-muted">Agrivive keeps the important parts visible, from the first listing to the final pickup.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.number} className="group overflow-hidden rounded-[26px] border border-agrivive-border bg-agrivive-background transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,77,58,0.10)]">
              <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden border-b border-agrivive-border bg-[#F2DFAF]/50 p-5"><Image src={step.image} alt={step.alt} width={1024} height={1024} className="h-auto w-full max-w-[300px] object-contain transition-transform duration-300 group-hover:scale-[1.03]" /></div>
              <div className="p-6"><div className="flex items-center justify-between"><span className="font-heading text-sm font-extrabold tracking-[0.18em] text-agrivive-terracotta">{step.number}</span>{index < steps.length - 1 ? <ArrowRight aria-hidden="true" className="text-agrivive-sage" size={19} /> : null}</div><h3 className="mt-5 font-heading text-2xl font-bold text-agrivive-primary">{step.title}</h3><p className="mt-3 text-sm leading-6 text-agrivive-muted">{step.detail}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
