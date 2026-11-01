"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { NotificationItemComponent } from "./NotificationItemComponent";
import { useBuyerNotifications, type NoticeFilterTab } from "../hooks/useBuyerNotifications";

interface NotificationDropdownComponentProps {
  onClose: () => void;
}

export const NotificationDropdownComponent = ({ onClose }: NotificationDropdownComponentProps) => {
  const {
    notices,
    unreadCount,
    counts,
    loading,
    saving,
    activeTab,
    setActiveTab,
    markAsRead,
    markAllRead,
  } = useBuyerNotifications();

  const tabs: { key: NoticeFilterTab; label: string; count: number }[] = [
    { key: "all", label: "View all", count: counts.all },
    { key: "reservations", label: "Orders", count: counts.reservations },
    { key: "produce", label: "Produce", count: counts.produce },
    { key: "updates", label: "Updates", count: counts.updates },
  ];

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-2.5 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E5E2DA] bg-white shadow-md z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="font-heading text-base font-semibold tracking-tight text-neutral-900">
          Your notifications
        </h2>
        <button
          type="button"
          onClick={() => void markAllRead()}
          disabled={!unreadCount || saving}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#457D00] hover:text-[#457D00]/80 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="size-3.5" />
          {saving ? "Saving…" : "Mark all as read"}
        </button>
      </div>

      {/* Segmented Filter Pills */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-[#F5F6EE] p-1 border border-[#EAECE0] no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-[#202E1B] shadow-sm"
                    : "text-[#7A8875] hover:text-[#202E1B]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`inline-flex size-[18px] shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                    isActive
                      ? "bg-[#D2E794] text-[#244218]"
                      : "bg-[#EAECE0] text-[#7A8875]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Notifications List */}
      <div data-lenis-prevent className="max-h-[380px] divide-y divide-neutral-100 overflow-y-auto px-2 pb-2">
        {loading && !notices.length ? (
          <div className="space-y-3 p-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Image src="/brand/notifications-empty-bell.png" alt="" width={96} height={65} className="h-auto w-24" />
            <p className="mt-3 font-heading text-sm font-bold text-neutral-900">No notifications</p>
            <p className="mt-1 max-w-[240px] text-xs text-neutral-500">
              Reservation alerts and updates from sellers you follow will appear here.
            </p>
          </div>
        ) : (
          notices.map((notice) => (
            <NotificationItemComponent
              key={notice.id}
              notice={notice}
              onSelect={(n) => {
                void markAsRead(n);
                onClose();
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-5 py-3">
        <Link
          href="/profile#notifications"
          onClick={onClose}
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Manage notifications
        </Link>
        <Link
          href="/notifications"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl bg-[#457D00] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm hover:bg-[#457D00]/90 active:scale-95 transition-all"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};
