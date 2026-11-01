"use client";

import { Calendar, Download, Info, Printer, Sparkles } from "lucide-react";
import type { MarketplaceOverviewRange } from "../api/overview";

interface Props {
  range: MarketplaceOverviewRange;
  onRangeChange: (newRange: MarketplaceOverviewRange) => void;
  generatedAt: string;
  isSampleData: boolean;
  onPrintReport: () => void;
}

export const MarketplaceOverviewHeaderComponent = ({
  range,
  onRangeChange,
  generatedAt,
  isSampleData,
  onPrintReport,
}: Props) => {
  const formattedDate = new Date(generatedAt).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Title Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>Open Agricultural Data & Community Food Rescue</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
            Public Marketplace Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
            Aggregated marketplace metrics, food surplus rescue volume, and buying trends across participating Davao City market stalls to monitor supply flow and assist farm planning.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Filter Tabs */}
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/80 shadow-sm">
            {(
              [
                { id: "week", label: "This Week" },
                { id: "month", label: "This Month" },
                { id: "year", label: "This Year" },
              ] as const
            ).map((tab) => {
              const active = range === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onRangeChange(tab.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-white text-[#457D00] shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Print / Save Report Button */}
          <button
            type="button"
            onClick={onPrintReport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-95 print:hidden"
          >
            <Printer className="size-3.5 text-[#457D00]" />
            <span>Save Plan Report</span>
          </button>
        </div>
      </div>

      {/* Meta status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-neutral-200/80 py-2 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 text-neutral-400" />
          <span>Last synchronized: <strong className="font-semibold text-neutral-700">{formattedDate}</strong></span>
        </div>
        {isSampleData && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-0.5 text-amber-800 border border-amber-200">
            <Info className="size-3 text-amber-600" />
            <span className="text-xs font-medium">Sample data: Representative figures shown while new live orders accumulate.</span>
          </div>
        )}
      </div>
    </div>
  );
};
