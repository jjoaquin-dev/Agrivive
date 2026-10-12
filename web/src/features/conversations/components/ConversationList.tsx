"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Package, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
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

function SellerAvatar({ item, small = false }: { item: Conversation; small?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const name = displayName(item);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const size = small ? "size-10 rounded-full text-xs" : "size-12 rounded-full text-sm";

  if (item.sellerImage && !imageFailed) {
    return (
      <img
        src={item.sellerImage}
        alt={`${name} profile`}
        className={`${size} shrink-0 object-cover ring-2 ring-primary/10`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center bg-agrivive-background font-heading font-bold text-primary ring-2 ring-primary/10`}
    >
      <Store className="size-4" />
      {initials}
    </span>
  );
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
        v?.toLowerCase().includes(query),
      ),
    );
  }, [items, search, activeTab]);

  return (
    <aside className={`flex min-h-[680px] flex-col border-b border-border/80 bg-white lg:border-b-0 lg:border-r ${className}`}>
      {/* Top Filter Tabs matching reference */}
      <div className="flex border-b border-border/70 px-4 pt-3">
        {(["all", "unread", "important", "closed"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 px-3 text-xs font-bold capitalize transition-colors ${
                isActive ? "text-agrivive-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-agrivive-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border/70">
        <label className="relative block">
          <span className="sr-only">Search by name</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="h-10 rounded-xl pl-9 text-xs"
          />
        </label>
      </div>

      {/* Conversations List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
            <div className="h-14 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : null}

        {!loading && filteredItems.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <MessageCircle className="mx-auto size-7 text-agrivive-sage" />
            <p className="mt-2 text-xs font-semibold">
              {search ? "No matching conversations" : "No messages found"}
            </p>
          </div>
        ) : null}

        {!loading
          ? filteredItems.map((item) => {
              const title = displayName(item);
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                    isSelected
                      ? "bg-amber-50/70 ring-1 ring-amber-200"
                      : "hover:bg-agrivive-background/60"
                  }`}
                >
                  <div className="relative">
                    <SellerAvatar item={item} small />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs font-bold text-foreground">{title}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(item.lastMessageAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {item.lastMessageBody || "New conversation"}
                    </span>
                  </span>
                  {item.unreadCount > 0 ? (
                    <span className="size-2 rounded-full bg-agrivive-terracotta shrink-0" />
                  ) : null}
                </button>
              );
            })
          : null}
      </div>
    </aside>
  );
}
