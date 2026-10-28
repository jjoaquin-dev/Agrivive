"use client";

import { useState } from "react";
import { Activity, LineChart, TrendingUp } from "lucide-react";
import type { ActivityTrendPoint } from "../api/overview";

interface Props {
  trends: ActivityTrendPoint[];
  range: string;
}

export const MarketplaceActivityTrendComponent = ({ trends, range }: Props) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const rangeTitle = range === "year" ? "Monthly Annual Trend" : range === "week" ? "Daily Weekly Trend" : "Weekly Monthly Trend";

  if (!trends || trends.length === 0) {
    return null;
  }

  const maxVal = Math.max(...trends.map((t) => t.quantity), 10);
  const width = 640;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = trends.map((item, idx) => {
    const x = paddingX + (idx / (trends.length - 1 || 1)) * chartW;
    const y = height - paddingY - (item.quantity / maxVal) * chartH;
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = activeIdx !== null ? points[activeIdx] : null;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-teal-50 p-1.5 text-teal-800">
              <TrendingUp className="size-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Market Activity & Rescue Flow
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {rangeTitle} showing continuous kilogram volume rescued across community stalls
          </p>
        </div>
        {activePoint ? (
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            <span>{activePoint.label}: {activePoint.quantity.toLocaleString()} kg</span>
            <span className="text-neutral-400">({activePoint.orderCount} orders)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
            <Activity className="size-3.5 text-[#457D00]" />
            <span>Hover points for breakdown</span>
          </div>
        )}
      </div>

      {/* Responsive SVG Line & Area Chart */}
      <div className="mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#457D00" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#457D00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = height - paddingY - pct * chartH;
            const labelVal = Math.round(pct * maxVal);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#9CA3AF"
                  fontWeight="600"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#457D00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* Hit area */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                {/* Outer ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? "#457D00" : "#FFFFFF"}
                  stroke="#457D00"
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all"
                />
                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isSelected ? "#1F4D3A" : "#6B7280"}
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
