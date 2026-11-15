"use client";

import { Bar } from "react-chartjs-2";
import type { Chart as ChartJS } from "chart.js";
import { unitWord, type TopProduceItem } from "../api/overview";
import { formatNumber } from "@/src/lib/format";
import { formatPeso } from "@/src/lib/money";
import { CHART_COLORS, barOptions } from "../lib/chartSetup";
import { OverviewChartCard, td, th, type Explanation } from "./OverviewChartCard";

interface Props {
  items: TopProduceItem[];
  explanation: Explanation;
  chartRef?: (chart: ChartJS | null) => void;
}

export const OverviewProduceChart = ({ items, explanation, chartRef }: Props) => (
  <OverviewChartCard
    title="Most Bought Produce"
    description="The produce picked up most often in the chosen dates, ranked by number of orders. The unit is in brackets."
    height={items.length > 6 ? "h-[28rem]" : "h-80"}
    explanation={explanation}
    guide={[
      { term: "Across the bottom (x)", text: "How many orders were picked up. A longer bar means the produce was bought in more orders." },
      { term: "Down the left side (y)", text: "The produce name. The unit it is sold by is in brackets: kg, sack or pile. Hover or tap a bar for the amount and average price." },
    ]}
    chart={
      <Bar
        ref={(instance) => chartRef?.(instance as ChartJS | null)}
        data={{ labels: items.map((item) => `${item.name} (${item.unit})`), datasets: [{ label: "Orders", data: items.map((item) => item.orderCount), backgroundColor: CHART_COLORS.green, borderRadius: 4, maxBarThickness: 28 }] }}
        options={{
          ...barOptions({ horizontal: true, value: { title: "Orders that were picked up", whole: true }, category: { title: "Produce (unit)" } }),
          plugins: {
            ...barOptions({ value: { title: "" }, category: { title: "" } }).plugins,
            tooltip: {
              callbacks: {
                label: (item) => {
                  const row = items[item.dataIndex]!;
                  return [`${row.orderCount} ${row.orderCount === 1 ? "order" : "orders"}`, `${formatNumber(row.quantity)} ${unitWord(row.unit, row.quantity)} picked up`, `Average ${formatPeso(row.averagePrice)} per ${row.unit}`];
                },
              },
            },
          },
        }}
      />
    }
    breakdown={
      <table className="w-full border-collapse">
        <thead><tr><th className={th}>#</th><th className={th}>Produce</th><th className={th}>Kind</th><th className={`${th} text-right`}>Orders</th><th className={`${th} text-right`}>Amount picked up</th><th className={`${th} text-right`}>Average price per unit</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.name}-${item.unit}`}>
              <td className={td}>{item.id}</td><td className={`${td} font-semibold`}>{item.name}</td><td className={td}>{item.category}</td>
              <td className={`${td} text-right`}>{item.orderCount}</td>
              <td className={`${td} text-right`}>{formatNumber(item.quantity)} {unitWord(item.unit, item.quantity)}</td>
              <td className={`${td} text-right`}>{formatPeso(item.averagePrice)} per {item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    }
  />
);
