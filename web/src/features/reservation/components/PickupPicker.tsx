"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getPickupSlots, type PickupSlots } from "../api/reservation";
import { PickupTimeDropdown } from "./PickupTimeDropdown";
import { formatDate, formatTime } from "@/src/lib/format";

export type PickupRange = { start: string; end: string } | null;

const clock = (iso: string) => formatTime(iso, { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" });
const manilaDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
const dayLabel = (date: string, index: number) =>
  `${index === 0 ? "Today" : "Tomorrow"} · ${formatDate(`${date}T00:00:00+08:00`, { month: "short", day: "numeric", timeZone: "Asia/Manila" })}`;
const periodOf = (iso: string) => {
  const hour = Number(new Date(iso).toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Manila" })) % 24;
  return hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
};
const PERIODS = ["Morning", "Afternoon", "Evening"];

function Step({ n, title, done, children }: { n: number; title: string; done: boolean; children: ReactNode }) {
  return (
    <section className="flex gap-3">
      <span aria-hidden className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-agrivive-primary text-white" : "border border-agrivive-border text-neutral-600"}`}>
        {done ? <Check className="size-3.5" /> : n}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <h4 className="text-sm font-bold">{title}</h4>
        {children}
      </div>
    </section>
  );
}

/**
 * Two steps: pick a day (today or tomorrow), pick a time. Times come from the stall's own
 * pickup hours, so only free 15-minute times are offered. The server re-checks every rule when the order is confirmed.
 */
export function PickupPicker({ sellerId, value, onChange, blocked = [] }: {
  sellerId: string; value: PickupRange; onChange: (range: PickupRange) => void; blocked?: { start: string; end: string }[];
}) {
  const [slots, setSlots] = useState<PickupSlots | null>(null);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setSlots(null); setError("");
    getPickupSlots(sellerId, controller.signal).then(setSlots).catch((reason: unknown) => {
      if (isAbortError(reason)) return;
      setError(reason instanceof ApiError ? reason.message : "We could not load pickup times.");
    });
    return () => controller.abort();
  }, [sellerId]);

  const taken = useMemo(() => blocked.map((range) => ({ s: new Date(range.start).getTime(), e: new Date(range.end).getTime() })), [blocked]);
  if (error) return <p role="alert" className="text-sm text-destructive">{error}</p>;
  if (!slots) return <div className="h-32 animate-pulse rounded-xl bg-[#F3F2EA]" aria-label="Loading pickup times" />;

  // A saved choice decides the day, so coming back from the review step shows the right tab.
  const savedDay = value ? slots.days.findIndex((item) => item.date === manilaDate(value.start)) : -1;
  const dayIndex = picked ?? (savedDay >= 0 ? savedDay : 0);
  const day = slots.days[dayIndex];
  if (!day) return null;
  const cells = day.cells;
  const free = (i: number) => {
    const cell = cells[i];
    if (!cell) return false;
    const s = new Date(cell.start).getTime();
    return cell.available && s >= now && !taken.some((range) => s < range.e && range.s < new Date(cell.end).getTime());
  };
  const startIndex = value ? cells.findIndex((cell) => cell.start === value.start) : -1;
  const fromGroups = PERIODS.map((label) => ({ label, items: cells.flatMap((cell, i) => (free(i) && periodOf(cell.start) === label ? [cell] : [])) })).filter((group) => group.items.length);
  const hours = cells.length ? `${clock(cells[0]!.start)} to ${clock(cells[cells.length - 1]!.end)}` : "";

  // One time = one 15-minute pickup window, which is what the server stores as start and end.
  function chooseStart(start: string) {
    const cell = cells.find((item) => item.start === start);
    onChange(cell ? { start: cell.start, end: cell.end } : null);
  }

  return (
    <div className="space-y-5">
      <Step n={1} title="Pick a day" done>
        <div role="tablist" className="grid grid-cols-2 gap-2">
          {slots.days.map((item, index) => (
            <button key={item.date} type="button" role="tab" aria-selected={index === dayIndex}
              onClick={() => { if (index !== dayIndex) { setPicked(index); onChange(null); } }}
              className={`min-h-12 rounded-xl border px-3 text-sm font-semibold transition active:translate-y-px ${index === dayIndex ? "border-agrivive-primary bg-agrivive-mist text-agrivive-forest" : "border-agrivive-border bg-white text-neutral-700"}`}>
              {dayLabel(item.date, index)}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-600">You can only book today or tomorrow, so vegetables are not held for too long.</p>
      </Step>
      {!day.open ? (
        <p className="rounded-xl border border-agrivive-border bg-[#FAFAF8] p-3 text-sm text-neutral-600">{day.reason || "This stall has no pickup times on this day."} Try the other day.</p>
      ) : fromGroups.length === 0 ? (
        <p className="rounded-xl border border-agrivive-border bg-[#FAFAF8] p-3 text-sm text-neutral-600">No free times left on this day. Try the other day.</p>
      ) : (
        <>
          <Step n={2} title="Pick a time" done={startIndex >= 0}>
            <PickupTimeDropdown value={startIndex >= 0 ? value!.start : ""} onChange={chooseStart}
              groups={fromGroups.map((group) => ({ label: group.label, items: group.items.map((cell) => ({ value: cell.start, text: clock(cell.start) })) }))} />
            <p className="text-xs text-neutral-600">
              {value ? `Come to the stall any time from ${clock(value.start)} to ${clock(value.end)}. ` : "Pick when you plan to come. "}
              This stall is open for pickup {hours}. The last 30 minutes before closing cannot be booked.
            </p>
          </Step>
        </>
      )}
    </div>
  );
}

export { clock as formatPickupClock };
