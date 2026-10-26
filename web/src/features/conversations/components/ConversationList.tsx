"use client";

import { useMemo, useState } from "react";
import { ChevronRight, MessageSquare, Search, Store } from "lucide-react";
import type { Conversation } from "../api";

function formatDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function displayName(item: Conversation) {
  return item.sellerShopName || item.sellerName || "Seller";
}

type TabType = "all" | "unread" | "important" | "closed";

export function ConversationList({
  items,
  selectedId,
  loading,
  onSelect,
  className = "",
}: {
  items: Conversation[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    let list = items;
    if (activeTab === "unread") list = list.filter((i) => i.unreadCount > 0);
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((item) =>
      [item.sellerShopName, item.sellerName, item.productName, item.lastMessageBody].some((v) =>
        v?.toLowerCase().includes(query)
      )
    );
  }, [items, search, activeTab]);

  return (
    <aside
      className={`flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E9EBE2] bg-white p-4 shadow-xs ${className}`}
      aria-label="Messages list"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#EEF5E3] text-[#365E24] shadow-2xs">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold leading-tight text-[#25431D]">Messages</h1>
            <p className="text-xs text-[#8A9685]">All communications</p>
          </div>
        </div>
        <button type="button" aria-label="Messages settings" className="text-[#A6B0A2] hover:text-[#25431D] transition">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Pill Filter Tabs */}
      <div className="mt-2 flex items-center justify-between rounded-full bg-[#F5F6EE] p-1">
        {(["all", "unread", "important", "closed"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                isActive
                  ? "bg-white text-[#202E1B] shadow-2xs"
                  : "text-[#7A8875] hover:text-[#202E1B]"
              }`}
            >
              <span>{tab}</span>
              {tab === "all" && (
                <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#D2E794] text-[10px] font-bold leading-none text-[#244218]">
                  {items.length || 2}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative mt-3.5">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9EA899]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="w-full rounded-full border border-[#E8EAE0] bg-[#FAF9F5] py-2 pl-9 pr-4 text-xs text-[#202E1B] placeholder:text-[#9EA899] outline-none transition focus:border-[#457D00] focus:ring-2 focus:ring-[#457D00]/15"
        />
      </div>

      {/* Conversations List */}
      <div className="mt-3.5 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-2 p-1">
            <div className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
          </div>
        ) : null}

        {!loading && filteredItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8A9685]">
            {search ? "No matching conversations" : "No messages found"}
          </div>
        ) : null}

        {!loading &&
          filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            const title = displayName(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all ${
                  isSelected
                    ? "border border-[#E3EBCE] bg-[#F6F8ED] shadow-2xs"
                    : "hover:bg-[#FAF9F5]"
                }`}
              >
                {/* Avatar with status capsule */}
                <div className="relative shrink-0">
                  <div
                    className={`size-10 overflow-hidden rounded-full ring-2 ${
                      isSelected ? "ring-[#386600]/30" : "ring-neutral-200"
                    }`}
                  >
                    {item.sellerImage ? (
                      <img src={item.sellerImage} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-[#EEF5E3] text-[#386600]">
                        <Store className="size-4" />
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#457D00]" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-bold text-[#202E1B]">{title}</span>
                    <span className="shrink-0 text-[10px] text-[#9EA899]">
                      {formatDate(item.lastMessageAt)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-1">
                    <p className="truncate text-[11px] text-[#7A8875]">
                      {item.lastMessageBody || "New conversation"}
                    </p>
                    {item.unreadCount > 0 ? (
                      <span className="size-2 rounded-full bg-[#F59E0B] shrink-0" />
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}
