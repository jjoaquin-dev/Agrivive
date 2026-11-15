"use client";

import { Scatter } from "react-chartjs-2";
import type { Chart as ChartJS } from "chart.js";
import type { TopProduceItem } from "../api/overview";
import { formatPeso } from "@/src/lib/money";
import { CHART_COLORS } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  items: TopProduceItem[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

const bold = { weight: "bold" as const, size: 13 };

export const OverviewCompareChart = ({ items, explanation, chartRef }: Props) => (
  <OverviewChartCard
    title="Orders Compared With Price"
    description="Each dot is one produce: how often it was bought, and what buyers paid for it on average."
    height="h-96"
    explanation={explanation}
    guide={[
      { term: "Across the bottom (x)", text: "How many orders were picked up. Dots farther right were bought in more orders." },
      { term: "Up the left side (y)", text: "The average pesos paid for one unit. Dots higher up cost more per unit." },
      { term: "Each dot", text: "One produce, named beside it. Hover or tap a dot for its numbers. Kilos, sacks and piles are different sizes." },
    ]}
    chart={
      <Scatter
        ref={(instance) => chartRef?.(instance as ChartJS | null)}
        data={{ datasets: [{ label: "Produce", data: items.map((i) => ({ x: i.orderCount, y: i.averagePrice })), backgroundColor: CHART_COLORS.green, pointRadius: 7, pointHoverRadius: 9 }] }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 24, right: 24 } },
          scales: {
            x: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: "Orders picked up (more to the right)", font: bold, color: "#111827" } },
            y: { beginAtZero: true, title: { display: true, text: "Average price per unit in pesos (₱, higher is up)", font: bold, color: "#111827" } },
          },
          plugins: {
            legend: { display: false },
            datalabels: { display: true, align: "top", anchor: "end", color: "#111827", font: { size: 11, weight: "bold" }, formatter: (_v: unknown, ctx: { dataIndex: number }) => items[ctx.dataIndex]?.name ?? "" },
            tooltip: { callbacks: { label: (item) => { const row = items[item.dataIndex]!; return [`${row.name} (${row.unit})`, `${row.orderCount} ${row.orderCount === 1 ? "order" : "orders"}`, `${formatPeso(row.averagePrice)} per ${row.unit}`]; } } },
          },
        }}
      />
    }
    breakdown={
      <table className="w-full border-collapse">
        <thead><tr><th className={th}>Produce</th><th className={th}>Unit</th><th className={`${th} text-right`}>Orders (x)</th><th className={`${th} text-right`}>Average price per unit (y)</th></tr></thead>
        <tbody>{items.map((i) => <tr key={`${i.name}-${i.unit}`}><td className={`${td} font-semibold`}>{i.name}</td><td className={td}>{i.unit}</td><td className={`${td} text-right`}>{i.orderCount}</td><td className={`${td} text-right`}>{formatPeso(i.averagePrice)}</td></tr>)}</tbody>
      </table>
    }
  />
);
