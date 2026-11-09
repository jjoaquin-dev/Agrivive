"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { QUANTITY_STEP, clampQuantity, formatQuantity, roundQuantity } from "@/src/lib/quantity";

type QuantityStepperProps = {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
  /** Called instead of going lower when the amount is already at the smallest step. */
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
};

// Plus and minus move by half. The middle box takes any amount, for example 0.25 or 2.75.
export function QuantityStepper({ value, max, label, onChange, onRemove, disabled, className = "", buttonClassName = "" }: QuantityStepperProps) {
  const [draft, setDraft] = useState(formatQuantity(value));

  useEffect(() => setDraft(formatQuantity(value)), [value]);

  // A typed amount is saved a moment after the buyer stops typing. Before, it was saved only when the box lost focus,
  // so tapping Reserve right after typing could send the old amount while the box still showed the new one.
  useEffect(() => {
    const typed = Number(draft.replace(",", "."));
    if (!Number.isFinite(typed) || typed <= 0 || draft.endsWith(".") || draft.endsWith(",")) return;
    const next = clampQuantity(typed, max);
    if (next === value) return;
    const timer = setTimeout(() => onChange(next), 350);
    return () => clearTimeout(timer);
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  const atMax = Number.isFinite(max) && value >= max;
  const atMin = value <= QUANTITY_STEP && !onRemove;

  function commit() {
    const typed = Number(draft.replace(",", "."));
    if (!Number.isFinite(typed) || typed <= 0) {
      setDraft(formatQuantity(value));
      return;
    }
    const next = clampQuantity(typed, max);
    setDraft(formatQuantity(next));
    if (next !== value) onChange(next);
  }

  function stepDown() {
    if (value <= QUANTITY_STEP) return onRemove?.();
    onChange(clampQuantity(roundQuantity(value - QUANTITY_STEP), max));
  }

  const button = `flex shrink-0 items-center justify-center rounded-full text-neutral-700 transition active:scale-90 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-30 cursor-pointer ${buttonClassName}`;

  return (
    <div role="group" aria-label={label} className={`inline-flex items-center justify-between ${className}`}>
      <button type="button" disabled={disabled || atMin} onClick={stepDown} aria-label={`Decrease ${label}`} className={button}>
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="decimal"
        value={draft}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9.,]/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        onClick={(e) => e.stopPropagation()}
        className="w-11 min-w-0 bg-transparent text-center text-base font-semibold tabular-nums text-neutral-900 outline-none focus:underline"
      />
      <button type="button" disabled={disabled || atMax} onClick={() => onChange(clampQuantity(roundQuantity(value + QUANTITY_STEP), max))} aria-label={`Increase ${label}`} className={button}>
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
