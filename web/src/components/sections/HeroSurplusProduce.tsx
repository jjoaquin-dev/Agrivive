// Four small produce chips that tumble into the word "Surplus" before it lands. Decorative only: the word stays real text.
export function SurplusProduceChips() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[0.12em]" aria-hidden="true">
      <span className="surplus-chip inline-block size-[0.78em]">
        <svg viewBox="0 0 40 40" className="size-full" focusable="false">
          <circle cx="20" cy="22" r="16" fill="#E5484D" />
          <circle cx="14" cy="16" r="3.5" fill="#FFFFFF" opacity="0.35" />
          <path d="M20 9 L27 13 L20 15 L13 13 Z" fill="#2F7D32" />
        </svg>
      </span>
      <span className="surplus-chip inline-block size-[0.78em]">
        <svg viewBox="0 0 40 40" className="size-full" focusable="false">
          <ellipse cx="20" cy="21" rx="16" ry="12" fill="#C8A165" />
          <circle cx="14" cy="18" r="1.6" fill="#9C7645" />
          <circle cx="24" cy="24" r="1.6" fill="#9C7645" />
          <circle cx="19" cy="16" r="1.2" fill="#9C7645" />
        </svg>
      </span>
      <span className="surplus-chip inline-block size-[0.78em]">
        <svg viewBox="0 0 40 40" className="size-full" focusable="false">
          <path d="M20 9 C30 7 34 15 33 25 C32 34 26 36 20 34 C14 36 8 34 7 25 C6 15 10 7 20 9 Z" fill="#F5C518" />
          <path d="M20 9 L22 4" stroke="#2F7D32" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="surplus-chip inline-block size-[0.78em]">
        <svg viewBox="0 0 40 40" className="size-full" focusable="false">
          <circle cx="20" cy="20" r="16" fill="#8BC34A" />
          <path d="M20 20 C16 14 12 10 9 8 M20 20 C24 14 28 10 31 8 M20 20 L20 6 M20 20 C12 22 8 26 6 30 M20 20 C28 22 32 26 34 30" fill="none" stroke="#CFE8A0" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}
