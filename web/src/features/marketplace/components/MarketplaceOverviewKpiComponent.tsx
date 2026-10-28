import { CheckCircle2, PackageCheck, Store, TrendingUp, Users } from "lucide-react";
import type { MarketplaceOverviewResponse } from "../api/overview";

interface Props {
  kpis: MarketplaceOverviewResponse["kpis"];
  range: string;
}

export const MarketplaceOverviewKpiComponent = ({ kpis, range }: Props) => {
  const rangeLabel = range === "year" ? "past year" : range === "week" ? "past 7 days" : "past 30 days";

  const cards = [
    {
      title: "Total Food Rescued",
      value: `${kpis.totalRescuedQty.toLocaleString()} kg`,
      description: `Surplus agricultural produce rescued in the ${rangeLabel}`,
      icon: PackageCheck,
      badge: "Verified Pickups",
      highlightColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Active Surplus Listings",
      value: kpis.activeListings.toLocaleString(),
      description: "Direct-from-stall surplus batches currently live",
      icon: Store,
      badge: "Available Now",
      highlightColor: "text-[#457D00] bg-lime-50 border-lime-200",
    },
    {
      title: "Pickup Fulfillment Rate",
      value: `${kpis.fulfillmentRate}%`,
      description: `${kpis.totalOrders} total completed market pickups verified`,
      icon: CheckCircle2,
      badge: "Reliable Stalls",
      highlightColor: "text-teal-700 bg-teal-50 border-teal-200",
    },
    {
      title: "Community Stalls & Shoppers",
      value: `${kpis.activeSellers + kpis.activeBuyers}`,
      description: `${kpis.activeSellers} verified stall owners · ${kpis.activeBuyers} community buyers`,
      icon: Users,
      badge: "Davao Network",
      highlightColor: "text-amber-800 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">{card.title}</span>
                <div className={`rounded-xl border p-2 ${card.highlightColor}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-neutral-900 lg:text-3xl">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-700">{card.badge}</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <TrendingUp className="size-3" /> Live Database
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
