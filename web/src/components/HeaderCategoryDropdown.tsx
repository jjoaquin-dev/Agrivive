"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface HeaderCategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function HeaderCategoryDropdown({
  categories,
  selectedCategory,
  onSelectCategory,
  className = "",
}: HeaderCategoryDropdownProps) {
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

  function handleSelect(category: string) {
    onSelectCategory(category);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className={`relative shrink-0 border-l border-neutral-200 pl-2.5 pr-1 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap bg-transparent text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-900 cursor-pointer select-none outline-none focus:outline-none"
      >
        <span className="whitespace-nowrap">{selectedCategory}</span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#457D00]" : ""
          }`}
        />
      </button>

      {/* Floating Rounded Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 top-full mt-2.5 w-52 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-md z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => {
              const isSelected = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] transition-colors duration-150 cursor-pointer outline-none ${
                    isSelected
                      ? "bg-[#457D00]/10 text-[#457D00] font-bold"
                      : "text-neutral-700 font-medium hover:bg-[#457D00]/10 hover:text-[#457D00] active:bg-[#457D00]/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
