import { CalendarClock, HeartHandshake, ShoppingBasket, Sprout } from "lucide-react";

const benefits = [
  { icon: Sprout, label: "Local produce", detail: "Discover what sellers have ready nearby." },
  { icon: CalendarClock, label: "Reserve ahead", detail: "Give yourself time to pick up with care." },
  { icon: ShoppingBasket, label: "Simple pickup", detail: "Bring your pass and collect your order." },
  { icon: HeartHandshake, label: "Better use", detail: "Help good produce find a home." },
];

export function HomeBenefits() {
  return (
    <section aria-label="Agrivive benefits" className="border-b border-agrivive-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefits.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex gap-3 border-b border-agrivive-border py-6 last:border-b-0 sm:border-b-0 sm:px-5 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-agrivive-background text-agrivive-primary"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></span>
            <div><p className="font-heading font-bold text-agrivive-primary">{label}</p><p className="mt-1 text-sm leading-5 text-agrivive-muted">{detail}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
