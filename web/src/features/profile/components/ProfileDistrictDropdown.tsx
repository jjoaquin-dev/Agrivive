"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";

interface ProfileDistrictDropdownProps {
  districts: string[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  className?: string;
}

export function ProfileDistrictDropdown({
  districts,
  selectedDistrict,
  onSelectDistrict,
  className = "",
}: ProfileDistrictDropdownProps) {
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
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(district: string) {
    onSelectDistrict(district);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="relative flex h-11 w-full items-center justify-between rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-xs font-semibold text-neutral-900 shadow-2xs transition-colors hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#386600]/15 cursor-pointer"
      >
        <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <span className="truncate">{selectedDistrict}</span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#386600]" : ""
          }`}
        />
      </button>

      {/* Floating Rounded Menu Popover (Mirroring All Category Dropdown) */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] z-50 animate-in fade-in-0 zoom-in-95 duration-150 max-h-60 overflow-y-auto"
        >
          <div className="flex flex-col gap-0.5">
            {districts.map((d) => {
              const isSelected = d === selectedDistrict;
              return (
                <button
                  key={d}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(d)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-colors duration-150 cursor-pointer outline-none flex items-center justify-between ${
                    isSelected
                      ? "bg-[#457D00]/10 text-[#457D00] font-bold"
                      : "text-neutral-700 font-medium hover:bg-[#457D00]/10 hover:text-[#457D00] active:bg-[#457D00]/10"
                  }`}
                >
                  <span className="truncate">{d}</span>
                  {isSelected && <Check className="size-3.5 shrink-0 text-[#457D00]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
