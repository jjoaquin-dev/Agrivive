"use client";

import { Bar } from "react-chartjs-2";
import type { Chart as ChartJS } from "chart.js";
import type { CategoryDemandItem } from "../api/overview";
import { CHART_COLORS, barOptions } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  categories: CategoryDemandItem[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

export const OverviewDemandChart = ({ categories, explanation, chartRef }: Props) => (
  <OverviewChartCard
    title="Bought vs Listed, by Kind of Vegetable"
    description="For each kind: its share of all pickups in the chosen dates, next to its share of all listings open right now."
    height={categories.length > 4 ? "h-[28rem]" : "h-80"}
    explanation={explanation}
    guide={[
      { term: "Across the bottom (x)", text: "Share of the total, in percent, from 0 to 100." },
      { term: "Down the left side (y)", text: "One kind of vegetable per row, such as Leafy Greens or Fruit Vegetables." },
      { term: "Green bar", text: "Of all orders picked up, the share that included this kind." },
      { term: "Orange bar", text: "Of all listings open right now, the share that are this kind." },
    ]}
    chart={
      <Bar
        ref={(instance) => chartRef?.(instance as ChartJS | null)}
        data={{
          labels: categories.map((c) => c.category),
          datasets: [
            { label: "Share of pickups (bought)", data: categories.map((c) => c.orderShare), backgroundColor: CHART_COLORS.green, borderRadius: 4, maxBarThickness: 18 },
            { label: "Share of open listings (listed now)", data: categories.map((c) => c.listingShare), backgroundColor: CHART_COLORS.amber, borderRadius: 4, maxBarThickness: 18 },
          ],
        }}
        options={{
          ...barOptions({ horizontal: true, legend: true, unit: "%", value: { title: "Share of the total (%)", max: 100 }, category: { title: "Kind of vegetable" } }),
          plugins: {
            ...barOptions({ horizontal: true, legend: true, unit: "%", value: { title: "" }, category: { title: "" } }).plugins,
            tooltip: {
              callbacks: {
                label: (item) => {
                  const row = categories[item.dataIndex]!;
                  return item.datasetIndex === 0 ? `${row.orderShare}% of pickups (${row.orderCount} orders)` : `${row.listingShare}% of listings (${row.activeListings} listings)`;
                },
              },
            },
          },
        }}
      />
    }
    breakdown={
      <table className="w-full border-collapse">
        <thead><tr><th className={th}>Kind of vegetable</th><th className={`${th} text-right`}>Orders picked up</th><th className={`${th} text-right`}>Share of pickups</th><th className={`${th} text-right`}>Listings open now</th><th className={`${th} text-right`}>Share of listings</th></tr></thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.category}><td className={`${td} font-semibold`}>{c.category}</td><td className={`${td} text-right`}>{c.orderCount}</td><td className={`${td} text-right`}>{c.orderShare}%</td><td className={`${td} text-right`}>{c.activeListings}</td><td className={`${td} text-right`}>{c.listingShare}%</td></tr>
          ))}
        </tbody>
      </table>
    }
  />
);
