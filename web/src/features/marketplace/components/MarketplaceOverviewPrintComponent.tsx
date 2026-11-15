import type { ExplanationKey, MarketplaceOverviewExplanations, MarketplaceOverviewResponse } from "../api/overview";
import { unitWord } from "../api/overview";
import { formatDateTime, formatNumber } from "@/src/lib/format";
import { formatPeso } from "@/src/lib/money";

interface Props {
  data: MarketplaceOverviewResponse;
  explanations: MarketplaceOverviewExplanations | null;
  images: Partial<Record<ExplanationKey, string>>;
}

const cell = "border border-agrivive-border px-1.5 py-0.5";
const day = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });

const Table = ({ head, rows }: { head: string[]; rows: (string | number)[][] }) => (
  <table className="mt-2 w-full border-collapse text-left text-xs leading-snug">
    <thead className="bg-agrivive-background text-agrivive-ink"><tr>{head.map((h, i) => <th key={h} className={`${cell} font-semibold ${i > 1 ? "text-right" : ""}`}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((row, r) => <tr key={r} className="break-inside-avoid">{row.map((value, i) => <td key={i} className={`${cell} ${i > 1 ? "text-right" : ""}`}>{value}</td>)}</tr>)}</tbody>
  </table>
);

/** The page that is printed or saved as a PDF: every chart as a picture, its explanation, and the table behind it. */
export const MarketplaceOverviewPrintComponent = ({ data, explanations, images }: Props) => {
  const amounts = data.kpis.quantityByUnit.map((item) => `${formatNumber(item.quantity)} ${unitWord(item.unit, item.quantity)}`).join(" · ") || "None yet";
  const bucket = data.bucket === "day" ? "Day" : data.bucket === "week" ? "Week" : "Month";

  const produce = data.topProduce;
  const byPrice = [...produce].sort((a, b) => b.averagePrice - a.averagePrice);
  const bought = data.categoryDemand.filter((c) => c.orderCount > 0);
  const listed = data.categoryDemand.filter((c) => c.activeListings > 0);
  let running = 0;
  const sections: { key: ExplanationKey; title: string; table: ReturnType<typeof Table> }[] = [
    { key: "trend", title: "Pickups Over Time", table: <Table head={[bucket, "Dates", "Orders picked up", "Total so far"]} rows={data.activityTrends.map((p) => [p.label, p.detail, p.orderCount, (running += p.orderCount)])} /> },
    { key: "weekday", title: "Pickups by Day of the Week", table: <Table head={["Day", "Orders picked up"]} rows={data.weekdayDemand.map((d) => [d.label, d.orderCount])} /> },
    { key: "produce", title: "Most Bought Produce", table: <Table head={["#", "Produce", "Orders", "Amount picked up", "Average price per unit"]} rows={produce.map((i) => [i.id, `${i.name} (${i.category})`, i.orderCount, `${formatNumber(i.quantity)} ${unitWord(i.unit, i.quantity)}`, `${formatPeso(i.averagePrice)} per ${i.unit}`])} /> },
    { key: "price", title: "Average Price Paid", table: <Table head={["Produce", "Unit", "Average price per unit"]} rows={byPrice.map((i) => [i.name, i.unit, formatPeso(i.averagePrice)])} /> },
    { key: "compare", title: "Orders Compared With Price", table: <Table head={["Produce", "Unit", "Orders (x)", "Average price per unit (y)"]} rows={produce.map((i) => [i.name, i.unit, i.orderCount, formatPeso(i.averagePrice)])} /> },
    { key: "bought", title: "Share of Pickups, by Kind", table: <Table head={["Kind of vegetable", "Orders picked up", "Share"]} rows={bought.map((c) => [c.category, c.orderCount, `${c.orderShare}%`])} /> },
    { key: "listed", title: "Share of Open Listings, by Kind", table: <Table head={["Kind of vegetable", "Listings open now", "Share"]} rows={listed.map((c) => [c.category, c.activeListings, `${c.listingShare}%`])} /> },
    { key: "demand", title: "Bought vs Listed, by Kind of Vegetable", table: <Table head={["Kind", "Orders picked up", "Share of pickups", "Listings open now", "Share of listings"]} rows={data.categoryDemand.map((c) => [c.category, c.orderCount, `${c.orderShare}%`, c.activeListings, `${c.listingShare}%`])} /> },
  ];

  return (
    <div className="hidden bg-white font-body text-agrivive-text print:block">
      <style>{"@media print { @page { size: A4; margin: 12mm; } }"}</style>
      <div className="mb-3 border-b-2 border-agrivive-ink pb-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-agrivive-ink">Agrivive Public Marketplace Overview</h1>
        <p className="mt-1 text-sm text-agrivive-muted">Totals of produce bought and listed. Descriptive only: no predictions, no seller or buyer details.</p>
        <p className="mt-1 text-sm font-semibold text-agrivive-text">Dates: {day(data.from)} to {day(data.to)} · Generated: {formatDateTime(data.generatedAt, { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          ["Completed pickups", formatNumber(data.kpis.completedPickups)],
          ["Amount picked up", amounts],
          ["Pickup rate", data.kpis.pickupRate === null ? "No data yet" : `${data.kpis.pickupRate}%`],
          ["Listed right now", formatNumber(data.kpis.activeListings)],
        ].map(([label, value]) => (
          <div key={label} className="rounded border border-agrivive-border p-2">
            <p className="text-xs text-agrivive-muted">{label}</p>
            <p className="mt-0.5 font-heading text-lg font-bold text-agrivive-ink">{value}</p>
          </div>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.key} className="mb-4">
          <div className="break-inside-avoid">
            <h2 className="break-after-avoid border-b border-agrivive-border pb-1 font-heading text-lg font-bold text-agrivive-ink">{section.title}</h2>
            {images[section.key] ? <img src={images[section.key]} alt={section.title} className="mx-auto mt-1.5 max-h-[7.5cm] w-auto max-w-full object-contain" /> : null}
            <p className="mt-1.5 text-sm leading-relaxed text-agrivive-text">{explanations?.[section.key] ?? ""}</p>
          </div>
          {section.table}
        </section>
      ))}

      <div className="flex justify-between border-t border-agrivive-border pt-2 text-xs text-agrivive-muted">
        <span>Agrivive · Davao City</span>
        <span>Public marketplace overview</span>
      </div>
    </div>
  );
};
