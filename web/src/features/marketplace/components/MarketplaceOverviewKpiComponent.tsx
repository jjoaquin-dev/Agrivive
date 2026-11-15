import type { MarketplaceOverviewResponse } from "../api/overview";
import { unitWord } from "../api/overview";
import { formatNumber } from "@/src/lib/format";

interface Props {
  kpis: MarketplaceOverviewResponse["kpis"];
}

export const MarketplaceOverviewKpiComponent = ({ kpis }: Props) => {
  const amounts = kpis.quantityByUnit.map((item) => `${formatNumber(item.quantity)} ${unitWord(item.unit, item.quantity)}`);
  const cards = [
    { title: "Orders picked up", value: formatNumber(kpis.completedPickups), note: "In the chosen dates" },
    { title: "Amount picked up", value: amounts.length ? amounts.join(" · ") : "None yet", note: `${kpis.produceTypesBought} kinds of produce. Kilos, sacks and piles are counted apart` },
    { title: "Pickup rate", value: kpis.pickupRate === null ? "No data yet" : `${kpis.pickupRate}%`, note: "Reservations picked up, out of all that ended in the chosen dates" },
    { title: "Listed right now", value: formatNumber(kpis.activeListings), note: "Listings buyers can reserve today" },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, note }) => (
        <div key={title} className="bg-white p-5">
          <dt className="text-xs font-semibold text-neutral-500">{title}</dt>
          <dd className="mt-2 text-2xl font-bold text-neutral-900">{value}</dd>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">{note}</p>
        </div>
      ))}
    </dl>
  );
};
