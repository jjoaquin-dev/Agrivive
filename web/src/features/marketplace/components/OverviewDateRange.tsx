"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays } from "lucide-react";

interface Props {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}

const toDate = (day: string) => new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)));
const toDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const label = (day: string) => toDate(day).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
const daysAgo = (count: number) => { const date = new Date(); date.setDate(date.getDate() - count); return date; };

const PRESETS = [
  { name: "Last 7 days", days: 6 },
  { name: "Last 4 weeks", days: 27 },
  { name: "Last 3 months", days: 91 },
  { name: "Last 12 months", days: 364 },
] as const;

/** A calendar for picking the first and last day. The chosen days are filled in green and the days between them are shaded. */
export const OverviewDateRange = ({ from, to, onApply }: Props) => {
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>({ from: toDate(from), to: toDate(to) });
  const panel = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !panel.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setMonths(query.matches ? 2 : 1);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const openPanel = () => { setRange({ from: toDate(from), to: toDate(to) }); setOpen(true); };
  const apply = (start: Date, end: Date) => { onApply(toDay(start), toDay(end)); setOpen(false); };
  const ready = Boolean(range?.from && range?.to);
  const note = !range?.from ? "Pick the first day." : !range.to ? "Now pick the last day." : `${label(toDay(range.from))} to ${label(toDay(range.to))}`;

  return (
    <div className="relative" ref={panel}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-agrivive-border bg-white px-3.5 text-sm font-semibold text-agrivive-text transition hover:bg-neutral-50 sm:w-auto"
      >
        <CalendarDays className="size-4 text-agrivive-primary" />
        <span>{label(from)} – {label(to)}</span>
      </button>

      {open ? (
        <div role="dialog" aria-label="Choose dates" className="fixed inset-x-3 bottom-3 z-50 max-h-[85vh] overflow-y-auto rounded-2xl border border-agrivive-border bg-white p-4 shadow-xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:mt-2 sm:w-[44rem]">
          <div className="mb-3 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button key={preset.name} type="button" onClick={() => apply(daysAgo(preset.days), new Date())} className="min-h-9 rounded-full border border-agrivive-border px-3 text-xs font-semibold text-agrivive-text transition hover:bg-lime-50">
                {preset.name}
              </button>
            ))}
          </div>

          <div
            className="overflow-x-auto"
            style={{ "--rdp-accent-color": "#457D00", "--rdp-accent-background-color": "#E3F0CC", "--rdp-range_middle-background-color": "#E3F0CC", "--rdp-today-color": "#2F5A00", "--rdp-day-width": "40px", "--rdp-day-height": "40px" } as React.CSSProperties}
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={toDate(from)}
              numberOfMonths={months}
              pagedNavigation
              max={365}
              disabled={{ after: today }}
              startMonth={new Date(today.getFullYear() - 2, 0)}
              endMonth={today}
              captionLayout="dropdown"
            />
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold text-agrivive-muted" aria-live="polite">{note}</span>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl border border-agrivive-border px-4 text-xs font-bold text-agrivive-text hover:bg-neutral-50">Cancel</button>
              <button type="button" disabled={!ready} onClick={() => range?.from && range.to && apply(range.from, range.to)} className="min-h-11 rounded-xl bg-agrivive-primary px-4 text-xs font-bold text-white transition hover:bg-agrivive-primary/90 disabled:opacity-40">
                Show these dates
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
