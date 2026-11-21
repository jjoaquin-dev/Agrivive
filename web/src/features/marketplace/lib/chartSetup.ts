import { Chart as ChartJS, registerables, type ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registered once. Everything drawn on the overview page is a Chart.js chart.
ChartJS.register(...registerables, ChartDataLabels);
// Value labels are off unless a chart turns them on.
ChartJS.defaults.set("plugins.datalabels", { display: false });
// Canvas text cannot inherit, so it reads the page's body font once.
ChartJS.defaults.font.family = typeof document === "undefined" ? "sans-serif" : getComputedStyle(document.body).fontFamily;
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#202622";

export const CHART_COLORS = { green: "#457D00", amber: "#F59E0B", sky: "#0EA5E9", rose: "#E11D48" } as const;

// One colour per kind of vegetable, so the bought and listed charts match.
export const KIND_COLORS = ["#457D00", "#F59E0B", "#0EA5E9", "#E11D48", "#8B5CF6", "#14B8A6", "#F97316", "#64748B", "#A3A800"];

type Axis = { title: string; whole?: boolean; max?: number };

/** Shared look: titled axes, whole-number ticks for counts, and the value written at the end of each bar. */
export function barOptions(input: { horizontal?: boolean; value: Axis; category: Axis; legend?: boolean; unit?: string; compact?: boolean }): ChartOptions<"bar"> {
  const small = Boolean(input.compact);
  const titleFont = { weight: "bold" as const, size: small ? 11 : 13 };
  const shorten = (label: string) => (small && label.length > 15 ? `${label.slice(0, 14)}…` : label);
  const valueAxis = {
    beginAtZero: true,
    max: input.value.max,
    ticks: { precision: input.value.whole ? 0 : undefined, color: "#636B63", font: { size: small ? 11 : 12 } },
    title: { display: true, text: input.value.title, font: titleFont, color: "#14231A" },
    grid: { color: "#E5E7EB" },
  };
  const categoryAxis = {
    ticks: {
      color: "#202622",
      autoSkip: false,
      maxRotation: 45,
      font: { size: small ? 11 : 12 },
      callback(this: { getLabelForValue(value: number): string }, value: string | number) { return shorten(this.getLabelForValue(Number(value))); },
    },
    // On a phone the side title of a horizontal chart would take a fifth of the width; the "Reading this chart" box says the same.
    title: { display: !(small && input.horizontal), text: input.category.title, font: titleFont, color: "#14231A" },
    grid: { display: false },
  };
  return {
    indexAxis: input.horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 18, right: small ? 22 : 28 } },
    scales: input.horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
    plugins: {
      legend: { display: Boolean(input.legend), position: "top", labels: { usePointStyle: true, boxWidth: 10, font: { size: 12 } } },
      tooltip: { padding: 10, titleFont: { size: 13, weight: "bold" } },
      datalabels: {
        anchor: "end",
        align: input.horizontal ? "right" : "top",
        color: "#14231A",
        font: { weight: "bold", size: small ? 11 : 12 },
        formatter: (value: number) => (value > 0 ? `${value}${input.unit ?? ""}` : ""),
        clamp: true,
      },
    },
  };
}
