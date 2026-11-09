"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getPickupSlots, type PickupSlots } from "../api/reservation";

export type PickupRange = { start: string; end: string } | null;

const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" });
const dayLabel = (date: string, index: number) =>
  `${index === 0 ? "Today" : "Tomorrow"} · ${new Date(`${date}T00:00:00+08:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric", timeZone: "Asia/Manila" })}`;

/**
 * Today/Tomorrow calendar with the seller's free 15-minute times. Tap a start time, then an end time.
 * The server checks every rule again when the order is confirmed.
 */
export function PickupPicker({ sellerId, value, onChange, blocked = [] }: {
  sellerId: string; value: PickupRange; onChange: (range: PickupRange) => void; blocked?: { start: string; end: string }[];
}) {
  const [slots, setSlots] = useState<PickupSlots | null>(null);
  const [error, setError] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [first, setFirst] = useState<string | null>(null);
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

  const day = slots?.days[dayIndex];
  const maxCells = slots ? Math.floor(slots.maxRangeMinutes / slots.stepMinutes) : 0;
  const taken = useMemo(() => blocked.map((range) => ({ s: new Date(range.start).getTime(), e: new Date(range.end).getTime() })), [blocked]);
  if (error) return <p role="alert" className="text-sm text-destructive">{error}</p>;
  if (!slots || !day) return <div className="h-32 animate-pulse rounded-xl bg-[#F3F2EA]" aria-label="Loading pickup times" />;

  function pick(index: number) {
    const cells = day!.cells;
    const cell = cells[index]!;
    if (new Date(cell.start).getTime() < Date.now()) return;
    if (first === null) { setFirst(cell.start); onChange({ start: cell.start, end: cell.end }); return; }
    const firstIndex = cells.findIndex((item) => item.start === first);
    const [from, to] = index >= firstIndex ? [firstIndex, index] : [index, firstIndex];
    const run = cells.slice(from, to + 1);
    if (run.length > maxCells || run.some((item) => !item.available || new Date(item.start).getTime() < Date.now())) { setFirst(cell.start); onChange({ start: cell.start, end: cell.end }); return; }
    onChange({ start: run[0]!.start, end: run[run.length - 1]!.end });
    setFirst(null);
  }

  return (
    <div className="space-y-3">
      <div role="tablist" className="grid grid-cols-2 gap-2">
        {slots.days.map((item, index) => (
          <button key={item.date} type="button" role="tab" aria-selected={index === dayIndex}
            onClick={() => { setDayIndex(index); setFirst(null); onChange(null); }}
            className={`min-h-12 rounded-xl border px-3 text-sm font-semibold transition active:translate-y-px ${index === dayIndex ? "border-[#457D00] bg-[#F0F7EB] text-[#244218]" : "border-[#E5E2DA] bg-white text-neutral-700"}`}>
            {dayLabel(item.date, index)}
          </button>
        ))}
      </div>
      {!day.open ? (
        <p className="rounded-xl border border-[#E5E2DA] bg-[#FAFAF8] p-3 text-sm text-neutral-600">{day.reason || "No pickup times on this day."} Try the other day.</p>
      ) : (
        <>
          <p className="text-xs text-neutral-600">
            Tap a start time, then an end time. You can pick up to {slots.maxRangeMinutes} minutes. The last 30 minutes before closing cannot be booked.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Pickup times">
            {day.cells.map((cell, index) => {
              const mine = taken.some((range) => new Date(cell.start).getTime() < range.e && range.s < new Date(cell.end).getTime());
              const past = new Date(cell.start).getTime() < now;
              const disabled = !cell.available || mine || past;
              const selected = !!value && cell.start >= value.start && cell.end <= value.end;
              return (
                <button key={cell.start} type="button" disabled={disabled} onClick={() => pick(index)} aria-pressed={selected}
                  className={`min-h-11 rounded-lg border px-1 text-xs font-semibold transition active:translate-y-px ${selected ? "border-[#457D00] bg-[#457D00] text-white" : disabled ? "cursor-not-allowed border-[#EEE] bg-[#F5F5F2] text-neutral-400 line-through" : "border-[#E5E2DA] bg-white text-neutral-800 hover:border-[#457D00]/50"}`}>
                  {clock(cell.start)}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500">Crossed-out times are past, full, already yours, or you already have a pickup then.</p>
        </>
      )}
    </div>
  );
}

export { clock as formatPickupClock };
