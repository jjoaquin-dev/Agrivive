"use client";

import { PieChart, Lightbulb, Layers } from "lucide-react";
import type { CategoryDistributionItem } from "../api/overview";

interface Props {
  categories: CategoryDistributionItem[];
}

const CATEGORY_COLORS = [
  "#457D00", // Forest Lime
  "#1F4D3A", // Deep Pine
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#EC4899", // Rose
];

export const MarketplaceCategoryBreakdownComponent = ({ categories }: Props) => {
  const total = categories.reduce((sum, c) => sum + c.activeCount, 0);

  // SVG Donut calculation
  const radius = 60;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-50 p-1.5 text-amber-800">
              <PieChart className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Surplus Crop Distribution
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Breakdown of active surplus inventory to assist farmers and stall managers with supply planning
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-12 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative size-44 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="size-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth={strokeWidth}
              />
              {/* Segments */}
              {categories.map((c, i) => {
                const pct = total > 0 ? c.activeCount / total : 0;
                const strokeDasharray = `${pct * circumference} ${circumference}`;
                const strokeDashoffset = -(accumulatedPercent * circumference);
                accumulatedPercent += pct;
                const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];

                return (
                  <circle
                    key={c.category}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="butt"
                    className="transition-all duration-500 hover:opacity-80"
                  />
                );
              })}
            </svg>
            <div className="absolute text-center">
              <span className="block font-heading text-2xl font-black text-neutral-900">
                {total}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Active Lots
              </span>
            </div>
          </div>
        </div>

        {/* Category Legend & Proportions */}
        <div className="md:col-span-7 space-y-3">
          {categories.map((c, i) => {
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            return (
              <div
                key={c.category}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-2.5 transition hover:bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-bold text-neutral-800">{c.category}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-neutral-600">{c.activeCount} listings</span>
                  <span className="min-w-10 text-right font-black text-neutral-900">{c.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agricultural Planning Box */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 text-xs text-emerald-950">
        <Lightbulb className="size-4 shrink-0 text-emerald-700 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Market Planning Advice:</strong> Perishable categories such as Leafy Greens and Fruit Vegetables have the fastest turnover requirement (24–48 hours). Market managers recommend coordinating staggered harvesting schedules with Davao farmers during peak season weeks.
        </p>
      </div>
    </div>
  );
};
