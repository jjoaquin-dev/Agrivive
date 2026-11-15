"use client";

import { Radar } from "react-chartjs-2";
import type { Chart as ChartJS } from "chart.js";
import type { WeekdayDemandItem } from "../api/overview";
import { CHART_COLORS } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  days: WeekdayDemandItem[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

export const OverviewWeekdayChart = ({ days, explanation, chartRef }: Props) => (
  <OverviewChartCard
    title="Pickups by Day of the Week"
    description="How many orders were picked up on each weekday, added up over the chosen dates."
    height="h-80"
    explanation={explanation}
    guide={[
      { term: "Each corner", text: "One day of the week, Monday to Sunday." },
      { term: "Distance from the centre", text: "The number of orders picked up on that day. The farther a point is from the centre, the more pickups." },
      { term: "Rings and numbers", text: "The rings count orders (0 in the centre, the highest at the edge). The shaded shape joins the seven days." },
    ]}
    chart={
      <Radar
        ref={(instance) => chartRef?.(instance as ChartJS | null)}
        data={{ labels: days.map((d) => d.label), datasets: [{ label: "Orders picked up", data: days.map((d) => d.orderCount), backgroundColor: "rgba(14,165,233,0.25)", borderColor: CHART_COLORS.sky, pointBackgroundColor: CHART_COLORS.sky, pointRadius: 5 }] }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { beginAtZero: true, ticks: { precision: 0, backdropColor: "transparent", color: "#4B5563" }, pointLabels: { font: { size: 13, weight: "bold" }, color: "#111827" } } },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `${item.parsed.r} ${item.parsed.r === 1 ? "order" : "orders"} picked up` } } },
        }}
      />
    }
    breakdown={
      <table className="w-full border-collapse">
        <thead><tr><th className={th}>Day of the week</th><th className={`${th} text-right`}>Orders picked up</th></tr></thead>
        <tbody>{days.map((d) => <tr key={d.label}><td className={td}>{d.label}</td><td className={`${td} text-right font-semibold`}>{d.orderCount}</td></tr>)}</tbody>
      </table>
    }
  />
);
