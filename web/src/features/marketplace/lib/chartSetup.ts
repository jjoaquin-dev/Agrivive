import { Chart as ChartJS, registerables, type ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registered once. Everything drawn on the overview page is a Chart.js chart.
ChartJS.register(...registerables, ChartDataLabels);
// Value labels are off unless a chart turns them on.
ChartJS.defaults.set("plugins.datalabels", { display: false });
ChartJS.defaults.font.family = "inherit";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#374151";

export const CHART_COLORS = { green: "#457D00", amber: "#F59E0B", sky: "#0EA5E9", rose: "#E11D48" } as const;

// One colour per kind of vegetable, so the bought and listed charts match.
export const KIND_COLORS = ["#457D00", "#F59E0B", "#0EA5E9", "#E11D48", "#8B5CF6", "#14B8A6", "#F97316", "#64748B", "#A3A800"];

type Axis = { title: string; whole?: boolean; max?: number };

/** Shared look: titled axes, whole-number ticks for counts, and the value written at the end of each bar. */
export function barOptions(input: { horizontal?: boolean; value: Axis; category: Axis; legend?: boolean; unit?: string }): ChartOptions<"bar"> {
  const valueAxis = {
    beginAtZero: true,
    max: input.value.max,
    ticks: { precision: input.value.whole ? 0 : undefined, color: "#4B5563" },
    title: { display: true, text: input.value.title, font: { weight: "bold" as const, size: 13 }, color: "#111827" },
    grid: { color: "#E5E7EB" },
  };
  const categoryAxis = {
    ticks: { color: "#374151", autoSkip: false, maxRotation: 45 },
    title: { display: true, text: input.category.title, font: { weight: "bold" as const, size: 13 }, color: "#111827" },
    grid: { display: false },
  };
  return {
    indexAxis: input.horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 18, right: 28 } },
    scales: input.horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
    plugins: {
      legend: { display: Boolean(input.legend), position: "top", labels: { usePointStyle: true, boxWidth: 10, font: { size: 12 } } },
      tooltip: { padding: 10, titleFont: { size: 13, weight: "bold" } },
      datalabels: {
        anchor: "end",
        align: input.horizontal ? "right" : "top",
        color: "#111827",
        font: { weight: "bold", size: 12 },
        formatter: (value: number) => (value > 0 ? `${value}${input.unit ?? ""}` : ""),
        clamp: true,
      },
    },
  };
}
