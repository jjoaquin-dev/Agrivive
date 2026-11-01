"use client";

import { useState } from "react";
import { Award, BarChart3, ShoppingBag, Sparkles } from "lucide-react";
import type { TopProduceItem } from "../api/overview";

interface Props {
  items: TopProduceItem[];
  range: string;
}

export const MarketplaceTopProduceChartComponent = ({ items, range }: Props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const maxQty = items.length > 0 ? Math.max(...items.map((i) => i.totalQuantity)) : 100;
  const rangeTitle = range === "year" ? "This Year" : range === "week" ? "This Week" : "This Month";

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-950 ring-2 ring-amber-300";
    if (rank === 2) return "bg-slate-300 text-slate-800 ring-2 ring-slate-200";
    if (rank === 3) return "bg-amber-700 text-amber-100 ring-2 ring-amber-600";
    return "bg-neutral-100 text-neutral-700";
  };

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-800">
              <BarChart3 className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Top 10 Most Purchased Produce
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Market trends ranking vegetables by volume (kg) bought across Davao stalls ({rangeTitle})
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          <Award className="size-3.5 text-[#457D00]" />
          <span>Top Volume Leaders</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center text-sm text-neutral-500">
          No produce purchases recorded for this timeframe.
        </div>
      ) : (
        <div className="mt-6 space-y-3.5">
          {items.map((item, idx) => {
            const rank = idx + 1;
            const percentage = Math.max(8, Math.round((item.totalQuantity / maxQty) * 100));
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative rounded-xl border p-3 transition-all ${
                  isHovered
                    ? "border-[#457D00] bg-lime-50/30 shadow-sm"
                    : "border-neutral-100 bg-neutral-50/40 hover:bg-white hover:border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${getRankBadgeStyle(
                        rank
                      )}`}
                    >
                      {rank}
                    </span>
                    <span className="truncate font-bold text-neutral-900 group-hover:text-[#457D00] transition-colors">
                      {item.name}
                    </span>
                    <span className="hidden sm:inline-block rounded-lg bg-neutral-200/60 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-heading text-sm font-black text-neutral-900">
                        {item.totalQuantity.toLocaleString()} {item.unit}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {item.orderCount} orders · ₱{item.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG Visual Horizontal Bar */}
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/80">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      background: rank <= 3
                        ? "linear-gradient(90deg, #457D00 0%, #76B800 100%)"
                        : "linear-gradient(90deg, #457D00 0%, #457D00 100%)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
