"use client";

import Link from "next/link";
import { ArrowRight, Bell, Sparkles, Store, Ticket } from "lucide-react";

interface NotificationEmptyStateComponentProps {
  filterActive?: boolean;
  onClearFilter?: () => void;
}

export const NotificationEmptyStateComponent = ({
  filterActive,
  onClearFilter,
}: NotificationEmptyStateComponentProps) => {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#E5E2DA] bg-white p-8 sm:p-12 text-center shadow-[0_16px_40px_-12px_rgba(31,77,58,0.08)]">
      {/* Ambient warm background glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[#457D00]/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Center Icon Badge */}
      <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#457D00]/10 text-[#457D00] ring-8 ring-[#457D00]/5 shadow-2xs">
        <Bell className="size-8 stroke-[1.8]" />
        <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#457D00] text-white shadow-2xs">
          <Sparkles className="size-3" />
        </span>
      </div>

      {/* Copywriting */}
      <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
        {filterActive ? "No updates match this filter" : "You're all caught up!"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
        {filterActive
          ? "There are no notifications in this category. Switch to 'All Updates' or explore current produce listings."
          : "You have no unread notifications right now. When sellers at Bankerohan or Agdao drop fresh morning surplus or update your reservation passes, they will arrive here in real time."}
      </p>

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {filterActive && onClearFilter ? (
          <button
            type="button"
            onClick={onClearFilter}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 active:scale-95"
          >
            Show All Updates
          </button>
        ) : null}

        <Link
          href="/marketplace"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#457D00] px-5 text-xs font-semibold tracking-wide text-white shadow-2xs transition-all hover:bg-[#386600] active:scale-95"
        >
          Explore Surplus Produce
          <ArrowRight className="size-4" />
        </Link>

        <Link
          href="/orders"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 active:scale-95"
        >
          <Ticket className="size-4 text-neutral-500" />
          Check Active Passes
        </Link>
      </div>

      {/* Feature Highlights Ribbon */}
      <div className="mt-10 grid grid-cols-1 gap-3 border-t border-neutral-100 pt-8 sm:grid-cols-3 text-left">
        <div className="flex items-start gap-3 rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-100">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#457D00]/10 text-[#457D00]">
            <Store className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-neutral-900">Morning Produce Drops</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Follow stalls to get alerted when fresh crates are listed at discounted rates.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-100">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FEA938]/15 text-[#b2690a]">
            <Ticket className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-neutral-900">Hold Expirations</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Timely reminders before your 24-hour reservation pickup pass window closes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-100">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#457D00]/10 text-[#457D00]">
            <Bell className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-neutral-900">Stall Pickup Alerts</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Instant confirmations when market sellers verify your digital QR pickup pass.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
