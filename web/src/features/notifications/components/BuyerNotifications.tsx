"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ShoppingBasket, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/src/components/PageContainer";
import { useBuyerNotifications, type NoticeFilterTab } from "../hooks/useBuyerNotifications";
import { NotificationCardComponent } from "./NotificationCardComponent";
import { NotificationEmptyStateComponent } from "./NotificationEmptyStateComponent";

export function BuyerNotifications() {
  const {
    notices,
    allNoticesCount,
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
    { key: "all", label: "All Updates", count: counts.all },
    { key: "reservations", label: "Reservations", count: counts.reservations },
    { key: "produce", label: "Produce Drops", count: counts.produce },
    { key: "updates", label: "System Alerts", count: counts.updates },
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#FDFDFD] py-8 text-foreground lg:py-10">
      <PageContainer className="max-w-4xl">
        {/* Header Section: Left Metadata + Right Floating Toasts */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <Breadcrumbs items={[{ label: "Notifications" }]} />

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EA] px-3 py-1 text-xs font-semibold text-[#1B4D36]">
                <Triangle className="size-3 fill-[#1B4D36]" />
                Notifications Hub
              </span>
              <h1 className="mt-2.5 font-heading text-3xl font-bold tracking-tight text-[#14231A] sm:text-4xl">
                Your Notifications
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
                Real-time produce drop alerts, reservation hold updates, and stall pickup reminders.
              </p>
            </div>
          </div>

        </div>

        {/* Filter Pills Matching Photo: Independent Pill Capsules */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1B4D36] text-white shadow-sm"
                      : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && tab.count > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold leading-none text-white">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void markAllRead()}
              disabled={saving}
              className="text-xs font-semibold text-[#1B4D36] hover:bg-[#EAF5EA]"
            >
              <CheckCheck className="size-3.5 mr-1" />
              {saving ? "Saving…" : "Mark all as read"}
            </Button>
          )}
        </div>

        {/* Feed Content */}
        <div className="mt-6 space-y-3.5" aria-live="polite">
          {loading && !notices.length ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl border border-neutral-200/60 bg-white" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <NotificationEmptyStateComponent
              filterActive={activeTab !== "all" && allNoticesCount > 0}
              onClearFilter={() => setActiveTab("all")}
            />
          ) : (
            notices.map((notice) => (
              <NotificationCardComponent
                key={notice.id}
                notice={notice}
                onRead={(n) => void markAsRead(n)}
              />
            ))
          )}
        </div>

        {/* Bottom Feature Cards Matching Photo */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3.5 rounded-2xl border border-[#F0F2F5] bg-[#F9FAFB] p-4.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-white text-[#16A34A] shadow-sm">
              <ShoppingBasket className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Morning Drops</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                Follow stalls to get alerted when fresh crates are listed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-[#F0F2F5] bg-[#F9FAFB] p-4.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-white text-[#EA580C] shadow-sm">
              <Clock className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Hold Expirations</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                Timely reminders before your 24h pickup window closes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-[#F0F2F5] bg-[#F9FAFB] p-4.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-white text-[#2563EB] shadow-sm">
              <Bell className="size-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Stall Alerts</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                Instant confirmations when market sellers verify your digital pass.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
