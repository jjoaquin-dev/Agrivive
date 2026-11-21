"use client";

import { FileDown } from "lucide-react";
import { formatDateTime } from "@/src/lib/format";
import { OverviewDateRange } from "./OverviewDateRange";

interface Props {
  from: string;
  to: string;
  onDatesChange: (from: string, to: string) => void;
  generatedAt: string;
  isSampleData: boolean;
  saving: boolean;
  onSavePdf: () => void;
}

export const MarketplaceOverviewHeaderComponent = ({ from, to, onDatesChange, generatedAt, isSampleData, saving, onSavePdf }: Props) => {
  const formattedDate = formatDateTime(generatedAt, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-agrivive-ink sm:text-3xl">Public Marketplace Overview</h1>
          <p className="mt-1 max-w-2xl text-sm text-agrivive-muted">
            Totals of the produce bought and listed on Agrivive. The figures describe what has already happened, and no seller or buyer is identified.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center print:hidden">
          <OverviewDateRange key={`${from}-${to}`} from={from} to={to} onApply={onDatesChange} />
          <button
            type="button"
            onClick={onSavePdf}
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-4 text-sm font-bold sm:w-auto text-white shadow-sm transition hover:bg-agrivive-primary/90 active:scale-95 disabled:opacity-60"
          >
            <FileDown className="size-4" />
            <span>{saving ? "Getting ready…" : "Save as PDF"}</span>
          </button>
        </div>
      </div>

      <p className="border-y border-agrivive-border py-2 text-xs text-agrivive-muted">
        Data as of <span className="font-semibold text-agrivive-text">{formattedDate}</span>
        {isSampleData ? <span className="ml-2 font-semibold text-amber-800">Sample data</span> : null}
      </p>
    </div>
  );
};
