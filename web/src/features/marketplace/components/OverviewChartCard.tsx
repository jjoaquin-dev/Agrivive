"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type Explanation = { state: "loading" | "ready" | "missing"; text?: string; source?: "ai" | "template" };

interface Props {
  title: string;
  description: string;
  chart: ReactNode;
  height?: string;
  explanation: Explanation;
  breakdown: ReactNode;
  /** What each axis, slice or mark means, in plain words. */
  guide: { term: string; text: string }[];
}

/** One chart, then its plain-word explanation, then a table with every number behind it. */
export const OverviewChartCard = ({ title, description, chart, height = "h-80", explanation, breakdown, guide }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-agrivive-border bg-white p-4 sm:p-6">
      <h2 className="font-heading text-lg font-bold text-agrivive-ink">{title}</h2>
      <p className="mt-1 text-sm text-agrivive-muted">{description}</p>

      <div className={`mt-4 w-full ${height}`}>{chart}</div>

      <div className="mt-5 space-y-5">
        <div>
          <h3 className="font-heading text-base font-semibold text-agrivive-ink">Summary</h3>
          {explanation.state === "loading" ? (
            <div className="mt-2 space-y-1.5"><div className="h-3 w-full animate-pulse rounded bg-neutral-100" /><div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" /></div>
          ) : (
            <p className="mt-1.5 text-sm leading-relaxed text-agrivive-text" aria-live="polite">{explanation.text ?? "The summary is not available right now. The breakdown below lists every number."}</p>
          )}
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold text-agrivive-ink">Reading this chart</h3>
          <dl className="mt-1.5 space-y-1.5 text-sm text-agrivive-text">
            {guide.map((item) => (
              <div key={item.term} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-semibold text-agrivive-ink sm:w-56">{item.term}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-agrivive-border px-3.5 text-xs font-bold text-agrivive-text transition hover:bg-neutral-50"
      >
        {open ? "Hide breakdown" : "View breakdown"}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="mt-3 overflow-x-auto rounded-lg border border-agrivive-border">{breakdown}</div> : null}
    </section>
  );
};

export const th = "border-b border-agrivive-border bg-neutral-50 px-3 py-2 text-left text-xs font-bold text-agrivive-text";
export const td = "border-b border-neutral-100 px-3 py-2 text-xs text-agrivive-text";
