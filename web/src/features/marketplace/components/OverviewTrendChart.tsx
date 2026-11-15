"use client";

import { Chart } from "react-chartjs-2";
import type { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import type { ActivityTrendPoint, OverviewBucket } from "../api/overview";
import { CHART_COLORS } from "../lib/chartSetup";
import { useCompactChart } from "../lib/useCompactChart";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  points: ActivityTrendPoint[];
  bucket: OverviewBucket;
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

const WORD = { day: "day", week: "week", month: "month" } as const;

export const OverviewTrendChart = ({ points, bucket, explanation, chartRef }: Props) => {
  const compact = useCompactChart();
  let running = 0;
  const totals = points.map((p) => (running += p.orderCount));
  const data = {
    labels: points.map((p) => p.label),
    datasets: [
      { type: "bar", label: `Pickups in each ${WORD[bucket]} (bars)`, data: points.map((p) => p.orderCount), backgroundColor: CHART_COLORS.green, borderRadius: 4, maxBarThickness: 44, yAxisID: "y", datalabels: { display: (c: { dataset: { data: number[] }; dataIndex: number }) => c.dataset.data[c.dataIndex]! > 0, anchor: "end", align: "top", font: { weight: "bold" } } },
      { type: "line", label: "Total picked up so far (line)", data: totals, borderColor: CHART_COLORS.amber, backgroundColor: CHART_COLORS.amber, pointRadius: 4, tension: 0.25, yAxisID: "y1" },
    ],
  } as unknown as ChartData;
  const axisBold = { weight: "bold" as const, size: compact ? 11 : 13 };
  const tick = { font: { size: compact ? 11 : 12 } };
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 18 } },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { title: { display: true, text: compact ? WORD[bucket][0]!.toUpperCase() + WORD[bucket].slice(1) : `${WORD[bucket][0]!.toUpperCase()}${WORD[bucket].slice(1)} (each bar is one ${WORD[bucket]}${bucket === "week" ? ", 7 days from the first date" : ""})`, font: axisBold, color: "#14231A" }, grid: { display: false }, ticks: { autoSkip: true, maxRotation: 60, ...tick } },
      y: { beginAtZero: true, position: "left", ticks: { precision: 0, ...tick }, title: { display: true, text: compact ? "Orders (bars)" : `Orders picked up in that ${WORD[bucket]} (bars)`, font: axisBold, color: "#14231A" } },
      y1: { beginAtZero: true, position: "right", ticks: { precision: 0, ...tick }, grid: { drawOnChartArea: false }, title: { display: true, text: compact ? "Total (line)" : "Total orders picked up so far (line)", font: axisBold, color: "#92400E" } },
    },
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, boxWidth: 8, font: { size: compact ? 11 : 12 } } },
      tooltip: { callbacks: { title: (items) => points[items[0]!.dataIndex]?.detail ?? "" } },
    },
  };

  return (
    <OverviewChartCard
      title="Pickups Over Time"
      description={`How many orders were picked up in each ${WORD[bucket]} of the chosen dates, and the running total.`}
      explanation={explanation}
      guide={[
        { term: "Across the bottom (x)", text: `Time. Each bar is one ${WORD[bucket]}, named by its date${bucket === "month" ? "s" : ""}.` },
        { term: "Up the left side (y)", text: `The number of orders picked up in that ${WORD[bucket]}. A taller green bar means more pickups.` },
        { term: "Orange line and right side", text: "Adds the bars together as time goes on, so you can see the total picked up so far." },
      ]}
      chart={<Chart ref={(instance) => chartRef?.(instance as ChartJS | null)} type="bar" data={data} options={options} />}
      breakdown={
        <table className="w-full border-collapse">
          <thead><tr><th className={th}>{WORD[bucket][0]!.toUpperCase() + WORD[bucket].slice(1)}</th><th className={th}>Dates</th><th className={`${th} text-right`}>Orders picked up</th><th className={`${th} text-right`}>Total so far</th></tr></thead>
          <tbody>{points.map((p, i) => <tr key={`${p.label}-${i}`}><td className={td}>{p.label}</td><td className={td}>{p.detail}</td><td className={`${td} text-right font-semibold`}>{p.orderCount}</td><td className={`${td} text-right`}>{totals[i]}</td></tr>)}</tbody>
        </table>
      }
    />
  );
};
