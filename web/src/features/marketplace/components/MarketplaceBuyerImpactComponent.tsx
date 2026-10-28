import { CheckCircle2, Clock, ShoppingBag, Users } from "lucide-react";
import type { BuyerCommunitySummary } from "../api/overview";

interface Props {
  summary: BuyerCommunitySummary;
}

export const MarketplaceBuyerImpactComponent = ({ summary }: Props) => {
  const metrics = [
    {
      label: "Registered Community Buyers",
      value: summary.registeredBuyers.toLocaleString(),
      sub: "Locals signed up for food rescue",
      icon: Users,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      label: "Shoppers With Pickups",
      value: summary.activeBuyersWithOrders.toLocaleString(),
      sub: "Distinct shoppers who placed orders",
      icon: ShoppingBag,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Completed Market Pickups",
      value: summary.completedPickups.toLocaleString(),
      sub: "Verified surplus pickups completed",
      icon: CheckCircle2,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      label: "Active Reservations",
      value: summary.pendingPickups.toLocaleString(),
      sub: "Current orders awaiting pickup",
      icon: Clock,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="text-lg font-bold text-neutral-900">
          Community Buyer Participation
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Direct community involvement in preventing food waste at neighborhood market stalls
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-xl border border-neutral-100 bg-neutral-50/40 p-4 transition hover:border-neutral-200 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">{m.label}</span>
                <div className={`rounded-lg border p-1.5 ${m.color}`}>
                  <Icon className="size-3.5" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-neutral-900">{m.value}</div>
              <p className="mt-0.5 text-[11px] text-neutral-500">{m.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
