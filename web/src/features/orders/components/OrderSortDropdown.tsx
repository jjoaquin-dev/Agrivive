"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type OrderSortOption = "newest" | "oldest" | "highest" | "lowest";

const SORT_LABELS: Record<OrderSortOption, string> = {
  newest: "New Order",
  oldest: "Oldest Order",
  highest: "Highest Amount",
  lowest: "Lowest Amount",
};

interface OrderSortDropdownProps {
  value: OrderSortOption;
  onChange: (value: OrderSortOption) => void;
}

export function OrderSortDropdown({ value, onChange }: OrderSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent | PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const options: OrderSortOption[] = ["newest", "oldest", "highest", "lowest"];

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 min-h-[40px] items-center gap-2 rounded-full border border-[#E8E8E8] bg-white px-4 text-xs font-semibold text-[#14231A] shadow-xs transition hover:bg-neutral-50 cursor-pointer select-none outline-none"
      >
        <span className="text-[#5F7367] font-normal">Sort By:</span>
        <span className="font-semibold text-[#14231A]">{SORT_LABELS[value]}</span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-[#5F7367] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#457D00]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-colors duration-150 cursor-pointer outline-none ${
                    isSelected
                      ? "bg-[#457D00]/10 text-[#457D00] font-bold"
                      : "text-neutral-700 font-medium hover:bg-[#457D00]/10 hover:text-[#457D00] active:bg-[#457D00]/10"
                  }`}
                >
                  {SORT_LABELS[opt]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
