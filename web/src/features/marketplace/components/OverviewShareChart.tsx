"use client";

import { Doughnut, Pie } from "react-chartjs-2";
import type { Chart as ChartJS, ChartOptions } from "chart.js";
import type { CategoryDemandItem } from "../api/overview";
import { KIND_COLORS } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  /** "bought" is a doughnut of pickups; "listed" is a pie of the listings open now. */
  mode: "bought" | "listed";
  categories: CategoryDemandItem[];
  allKinds: string[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

export const OverviewShareChart = ({ mode, categories, allKinds, explanation, chartRef }: Props) => {
  const bought = mode === "bought";
  const rows = categories.filter((c) => (bought ? c.orderCount : c.activeListings) > 0);
  const count = (c: CategoryDemandItem) => (bought ? c.orderCount : c.activeListings);
  const share = (c: CategoryDemandItem) => (bought ? c.orderShare : c.listingShare);
  const noun = bought ? "order" : "listing";
  const data = {
    labels: rows.map((c) => c.category),
    datasets: [{ label: bought ? "Orders picked up" : "Listings open now", data: rows.map(count), backgroundColor: rows.map((c) => KIND_COLORS[allKinds.indexOf(c.category) % KIND_COLORS.length]), borderColor: "#fff", borderWidth: 2 }],
  };
  const total = rows.reduce((sum, c) => sum + count(c), 0);
  const options: ChartOptions<"doughnut"> & ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 10, font: { size: 12 } } },
      datalabels: { display: (ctx) => (ctx.dataset.data[ctx.dataIndex] as number) / total >= 0.06, color: "#fff", font: { weight: "bold", size: 12 }, formatter: (value: number) => `${Math.round((value / total) * 100)}%` },
      tooltip: { callbacks: { label: (item) => `${item.label}: ${item.parsed} ${item.parsed === 1 ? noun : `${noun}s`} (${Math.round((Number(item.parsed) / total) * 100)}%)` } },
    },
  };

  return (
    <OverviewChartCard
      title={bought ? "Share of Pickups, by Kind" : "Share of Open Listings, by Kind"}
      description={bought ? "Of all orders picked up in the chosen dates, how many were each kind of vegetable." : "Of all listings open right now, how many are each kind of vegetable."}
      height="h-96"
      explanation={explanation}
      guide={[
        { term: "Each slice", text: `One kind of vegetable. A bigger slice means more ${noun}s of that kind.` },
        { term: "Percent on a slice", text: `That kind's share of all ${noun}s. All slices add up to 100%. Small slices show their number when you hover or tap.` },
        { term: "Colours", text: "The same kind has the same colour in every chart on this page. The names are listed under the chart." },
      ]}
      chart={rows.length === 0
        ? <div className="flex h-full items-center justify-center text-sm text-neutral-500">{bought ? "No orders were picked up in these dates." : "No listings are open right now."}</div>
        : bought
          ? <Doughnut ref={(instance) => chartRef?.(instance as ChartJS | null)} data={data} options={options} />
          : <Pie ref={(instance) => chartRef?.(instance as ChartJS | null)} data={data} options={options} />}
      breakdown={
        <table className="w-full border-collapse">
          <thead><tr><th className={th}>Kind of vegetable</th><th className={`${th} text-right`}>{bought ? "Orders picked up" : "Listings open now"}</th><th className={`${th} text-right`}>Share</th></tr></thead>
          <tbody>{rows.map((c) => <tr key={c.category}><td className={`${td} font-semibold`}>{c.category}</td><td className={`${td} text-right`}>{count(c)}</td><td className={`${td} text-right`}>{share(c)}%</td></tr>)}</tbody>
        </table>
      }
    />
  );
};
