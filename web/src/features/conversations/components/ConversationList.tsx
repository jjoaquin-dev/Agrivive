"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronRight, MessageSquare, Search, Store } from "lucide-react";
import type { Conversation } from "../api";
import { ConversationRowMenu } from "./ConversationRowMenu";

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

type TabType = "all" | "unread" | "important" | "closed" | "archived";

export function ConversationList({
  items,
  selectedId,
  loading,
  onSelect,
  onChanged,
  className = "",
}: {
  items: Conversation[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (conversation: Conversation) => void;
  onChanged: () => void;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    // Archived chats live only under the Archived tab.
    let list = items.filter((i) => Boolean(i.archivedAt) === (activeTab === "archived"));
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
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#E9EBE2] bg-white p-4 shadow-sm ${className}`}
      aria-label="Messages list"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#EEF5E3] text-[#365E24] shadow-sm">
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
        {(["all", "unread", "important", "closed", "archived"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                isActive
                  ? "bg-white text-[#202E1B] shadow-sm"
                  : "text-[#7A8875] hover:text-[#202E1B]"
              }`}
            >
              <span>{tab}</span>
              {tab === "all" && (
                <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#D2E794] text-xs font-bold leading-none text-[#244218]">
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
          className="w-full rounded-full border border-[#E8EAE0] bg-[#FAF9F5] py-2 pl-9 pr-4 text-xs text-[#202E1B] placeholder:text-[#6B736B] outline-none transition focus:border-[#457D00] focus:ring-2 focus:ring-[#457D00]/15"
        />
      </div>

      {/* Conversations List */}
      <div data-lenis-prevent className="mt-3.5 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-2 p-1">
            <div className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
          </div>
        ) : null}

        {!loading && filteredItems.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center text-xs text-[#8A9685]">
            <Image src="/brand/empty-chat.webp" alt="" width={360} height={243} sizes="112px" className="mb-3 h-auto w-28" />
            {search ? "No matching conversations" : "No messages yet. Chat with a seller from a product page."}
          </div>
        ) : null}

        {!loading &&
          filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            const title = displayName(item);

            return (
              <div key={item.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-2.5 text-left transition-all ${
                  isSelected
                    ? "border border-[#E3EBCE] bg-[#F6F8ED] shadow-sm"
                    : "hover:bg-[#FAF9F5]"
                }`}
              >
                {/* Avatar with status capsule */}
                <div className="relative shrink-0">
                  <div
                    className={`size-10 overflow-hidden rounded-full ring-2 ${
                      isSelected ? "ring-[#457D00]/30" : "ring-neutral-200"
                    }`}
                  >
                    {item.sellerImage ? (
                      <img src={item.sellerImage} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-[#EEF5E3] text-[#457D00]">
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
                    <span className="shrink-0 text-xs text-[#9EA899]">
                      {formatDate(item.lastMessageAt)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-1">
                    <p className="truncate text-xs text-[#7A8875]">
                      {item.lastMessageBody || "New conversation"}
                    </p>
                    {item.unreadCount > 0 ? (
                      <span className="size-2 rounded-full bg-[#F59E0B] shrink-0" />
                    ) : null}
                  </div>
                </div>
              </button>
              <ConversationRowMenu item={item} onChanged={onChanged} />
              </div>
            );
          })}
      </div>
    </aside>
  );
}
