"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMyTrust, type MyTrust, type TrustLevelKey } from "../api/standing";
import { TrustEventList } from "./TrustEventList";
import { formatDateTime } from "@/src/lib/format";

const card = "rounded-2xl border border-agrivive-border bg-white p-5 shadow-[0_4px_20px_rgba(20,35,26,0.05)] sm:p-6";
const tone: Record<TrustLevelKey, string> = {
  good: "bg-emerald-50 text-emerald-800 border-emerald-200", notice: "bg-sky-50 text-sky-800 border-sky-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200", pause_24h: "bg-orange-50 text-orange-800 border-orange-200",
  pause_3d: "bg-orange-50 text-orange-800 border-orange-200", block: "bg-rose-50 text-rose-800 border-rose-200",
};

/** The buyer's level, score, what to do now, the whole ladder, and the events that can still be disputed. */
export function TrustStandingCard() {
  const [data, setData] = useState<MyTrust | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => { getMyTrust().then(setData).catch((err: any) => setError(err?.message || "We could not load your standing.")); }, []);
  useEffect(() => { load(); }, [load]);

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  if (!data) return <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" aria-label="Loading your standing" />;
  const Icon = data.level === "good" || data.level === "notice" ? ShieldCheck : ShieldAlert;
  return (
    <div className="flex flex-col gap-6">
      <section className={card} aria-labelledby="standing-title">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${tone[data.level]}`}><Icon className="size-4" aria-hidden="true" />{data.levelLabel}</span>
          <h2 id="standing-title" className="font-heading text-lg font-bold text-neutral-900">Your standing</h2>
        </div>
        <p className="mt-3 text-sm text-neutral-700">Trust points for the last {data.windowDays} days: <strong>{data.score}</strong>
          {data.nextLevel ? <> · {data.nextLevel.pointsToGo} more to reach {data.nextLevel.label} ({data.nextLevel.atPoints})</> : null}</p>
        {data.pausedUntil ? <p className="mt-1 text-sm text-neutral-700">Your pause ends {formatDateTime(data.pausedUntil)}.</p> : null}
        <div className="mt-4 rounded-2xl bg-agrivive-background p-4">
          <h3 className="text-sm font-semibold text-neutral-900">What to do now</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">{data.guidance}</p>
        </div>
      </section>

      <section className={card} aria-labelledby="ladder-title">
        <h2 id="ladder-title" className="font-heading text-lg font-bold text-neutral-900">Levels</h2>
        <ol className="mt-3 divide-y divide-neutral-100">
          {data.ladder.map((row) => (
            <li key={row.level} className={`flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4 ${row.level === data.level ? "font-semibold" : ""}`}>
              <span className="w-36 shrink-0 text-sm text-neutral-900">{row.label}{row.level === data.level ? " (you)" : ""}</span>
              <span className="w-24 shrink-0 text-xs text-neutral-500">from {row.fromPoints} points</span>
              <span className="text-sm font-normal text-neutral-700">{row.summary}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-neutral-500">{data.serious} Points fade 90 days after each event.</p>
      </section>

      <section className={card} aria-labelledby="events-title">
        <h2 id="events-title" className="font-heading text-lg font-bold text-neutral-900">What counted</h2>
        <p className="mb-3 mt-1 text-xs text-neutral-500">You can dispute an event for 7 days after it happens. The system checks your records and answers right away.</p>
        <TrustEventList events={data.events} onChanged={load} />
      </section>
    </div>
  );
}
