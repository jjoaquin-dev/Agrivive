"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StakeholderTrends } from "@/src/features/stakeholder/api/summary";

const W = 720;
const H = 220;
const PAD = { left: 36, right: 8, top: 12, bottom: 24 };
const label = (key: string) => new Date(`${key}T00:00:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric" });

/** Orders placed and orders picked up for each of the last 30 days. Hover or tap a day to read it. */
export const StakeholderTrendChartComponent = ({ daily }: { daily: StakeholderTrends["daily"] }) => {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(4, ...daily.map((d) => Math.max(d.placed, d.completed)));
  const step = (W - PAD.left - PAD.right) / daily.length;
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
  const x = (i: number) => PAD.left + step * i + step / 2;
  const line = (pick: (d: (typeof daily)[number]) => number) => daily.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(pick(d)).toFixed(1)}`).join(" ");
  const shown = active !== null ? daily[active] : null;
  const totals = daily.reduce((a, d) => ({ placed: a.placed + d.placed, completed: a.completed + d.completed }), { placed: 0, completed: 0 });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold"><Activity className="size-5 text-primary" />Orders, Last 30 Days</CardTitle>
        <CardDescription>
          {shown ? `${label(shown.date)}: ${shown.placed} placed, ${shown.completed} picked up` : `${totals.placed} orders placed and ${totals.completed} picked up in 30 days.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-full bg-sky-400" />Placed</span>
          <span className="flex items-center gap-1.5"><i className="inline-block size-2.5 rounded-full bg-primary" />Picked up</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Orders placed and picked up each day for 30 days" onMouseLeave={() => setActive(null)}>
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(max * t)} y2={y(max * t)} className="stroke-border" strokeDasharray="3 4" />
              <text x={PAD.left - 6} y={y(max * t) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">{Math.round(max * t)}</text>
            </g>
          ))}
          <path d={line((d) => d.placed)} fill="none" className="stroke-sky-400" strokeWidth={2} strokeLinejoin="round" />
          <path d={line((d) => d.completed)} fill="none" className="stroke-primary" strokeWidth={2.5} strokeLinejoin="round" />
          {daily.map((d, i) => (
            <g key={d.date}>
              <rect x={x(i) - step / 2} y={PAD.top} width={step} height={H - PAD.top - PAD.bottom} fill="transparent" onMouseEnter={() => setActive(i)} onClick={() => setActive(active === i ? null : i)} />
              {active === i ? <><line x1={x(i)} x2={x(i)} y1={PAD.top} y2={H - PAD.bottom} className="stroke-border" /><circle cx={x(i)} cy={y(d.completed)} r={4} className="fill-primary" /><circle cx={x(i)} cy={y(d.placed)} r={4} className="fill-sky-400" /></> : null}
            </g>
          ))}
          {[0, 14, 29].map((i) => <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === 29 ? "end" : "middle"} className="fill-muted-foreground text-[10px]">{label(daily[i].date)}</text>)}
        </svg>
      </CardContent>
    </Card>
  );
};
