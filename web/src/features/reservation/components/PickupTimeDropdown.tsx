"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type PickupTimeGroup = { label: string; items: { value: string; text: string }[] };

/** Custom list (same look as ProfileDistrictDropdown) because a native select popup cannot be styled. */
export function PickupTimeDropdown({ groups, value, onChange }: {
  groups: PickupTimeGroup[]; value: string; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = groups.flatMap((group) => group.items).find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button type="button" aria-label="Pickup time" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-agrivive-border bg-white px-3 text-sm font-semibold shadow-sm transition-colors hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-agrivive-primary/15">
        <span className={selected ? "text-neutral-900" : "text-neutral-500"}>{selected?.text ?? "Choose a time…"}</span>
        <ChevronDown className={`size-4 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180 text-agrivive-primary" : ""}`} />
      </button>
      {open && (
        <div role="listbox" className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-2 shadow-md animate-in fade-in-0 zoom-in-95 duration-150">
          {groups.map((group) => (
            <div key={group.label} role="group" aria-label={group.label} className="flex flex-col gap-0.5">
              <p className="px-3.5 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-neutral-500">{group.label}</p>
              {group.items.map((item) => {
                const isSelected = item.value === value;
                return (
                  <button key={item.value} type="button" role="option" aria-selected={isSelected}
                    onClick={() => { onChange(item.value); setOpen(false); }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-agrivive-primary/40 transition-colors duration-150 ${isSelected ? "bg-agrivive-primary/10 font-bold text-agrivive-primary" : "font-medium text-neutral-700 hover:bg-agrivive-primary/10 hover:text-agrivive-primary"}`}>
                    {item.text}
                    {isSelected && <Check className="size-3.5 shrink-0 text-agrivive-primary" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
