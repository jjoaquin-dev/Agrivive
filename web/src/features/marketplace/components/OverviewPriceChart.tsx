"use client";

import { Bar } from "react-chartjs-2";
import type { Chart as ChartJS } from "chart.js";
import type { TopProduceItem } from "../api/overview";
import { formatPeso } from "@/src/lib/money";
import { CHART_COLORS, barOptions } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  items: TopProduceItem[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

export const OverviewPriceChart = ({ items, explanation, chartRef }: Props) => {
  const sorted = [...items].sort((a, b) => b.averagePrice - a.averagePrice);
  const base = barOptions({ horizontal: true, value: { title: "Average pesos paid for one unit (₱)" }, category: { title: "Produce (unit)" } });

  return (
    <OverviewChartCard
      title="Average Price Paid"
      description="What buyers paid on average for one unit of each produce in the chosen dates, highest first."
      height={sorted.length > 6 ? "h-[28rem]" : "h-80"}
      explanation={explanation}
      guide={[
        { term: "Across the bottom (x)", text: "Pesos (₱) paid for one unit. A longer bar means a higher average price." },
        { term: "Down the left side (y)", text: "The produce name, with its unit in brackets. One unit is one kg, one sack or one pile." },
        { term: "Note", text: "A kilo, a sack and a pile are different sizes, so compare prices of produce with the same unit." },
      ]}
      chart={
        <Bar
          ref={(instance) => chartRef?.(instance as ChartJS | null)}
          data={{ labels: sorted.map((i) => `${i.name} (${i.unit})`), datasets: [{ label: "Average price (₱)", data: sorted.map((i) => i.averagePrice), backgroundColor: CHART_COLORS.rose, borderRadius: 4, maxBarThickness: 28 }] }}
          options={{ ...base, plugins: { ...base.plugins, datalabels: { ...base.plugins!.datalabels, formatter: (v: number) => `₱${v}` }, tooltip: { callbacks: { label: (item) => `${formatPeso(Number(item.parsed.x))} per ${sorted[item.dataIndex]!.unit}` } } } }}
        />
      }
      breakdown={
        <table className="w-full border-collapse">
          <thead><tr><th className={th}>Produce</th><th className={th}>Unit</th><th className={`${th} text-right`}>Average price per unit</th></tr></thead>
          <tbody>{sorted.map((i) => <tr key={`${i.name}-${i.unit}`}><td className={`${td} font-semibold`}>{i.name}</td><td className={td}>{i.unit}</td><td className={`${td} text-right`}>{formatPeso(i.averagePrice)}</td></tr>)}</tbody>
        </table>
      }
    />
  );
};
