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
  const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const size = small ? "size-10 rounded-xl text-xs" : "size-12 rounded-2xl text-sm";

  if (item.sellerImage && !imageFailed) {
    return <img src={item.sellerImage} alt={`${name} profile`} className={`${size} shrink-0 object-cover ring-1 ring-primary/15`} onError={() => setImageFailed(true)} />;
  }

  return <span aria-hidden="true" className={`${size} flex shrink-0 items-center justify-center bg-agrivive-background font-heading font-bold text-primary ring-1 ring-primary/15`}><Store className="size-4" />{initials}</span>;
}

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
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => [
      item.sellerShopName,
      item.sellerName,
      item.productName,
      item.lastMessageBody,
    ].some((value) => value?.toLowerCase().includes(query)));
  }, [items, search]);

  return (
    <aside className={`flex min-h-[680px] flex-col border-b border-border/80 bg-white lg:border-b-0 lg:border-r ${className}`}>
      <div className="border-b border-border/70 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Inbox</p>
            <h2 className="mt-1 font-heading text-xl font-bold">Messages</h2>
          </div>
          <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        </div>
        <label className="relative mt-4 block">
          <span className="sr-only">Search messages</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages" className="h-11 min-h-11 pl-9" />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
        {loading ? <div className="space-y-2 p-2"><div className="h-16 animate-pulse rounded-2xl bg-muted" /><div className="h-16 animate-pulse rounded-2xl bg-muted" /><div className="h-16 animate-pulse rounded-2xl bg-muted" /></div> : null}
        {!loading && filteredItems.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <MessageCircle className="mx-auto size-8 text-agrivive-sage" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">{search ? "No messages found" : "No conversations yet"}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{search ? "Try another search." : "Open a product or seller page to message a seller."}</p>
          </div>
        ) : null}
        {!loading ? filteredItems.map((item) => {
          const title = displayName(item);
          const subject = item.contextType === "product" ? item.productName || "Product conversation" : item.contextType === "order" ? "Reservation conversation" : "Seller conversation";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              aria-current={selectedId === item.id ? "true" : undefined}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-agrivive-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${selectedId === item.id ? "bg-agrivive-background ring-1 ring-primary/15" : ""}`}
            >
              <div className="relative">
                <SellerAvatar item={item} small />
                {item.unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-agrivive-terracotta text-[10px] font-bold text-white ring-2 ring-white">{item.unreadCount > 9 ? "9+" : item.unreadCount}</span> : null}
              </div>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{title}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{formatDate(item.lastMessageAt)}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Package className="size-3" aria-hidden="true" />{subject}</span>
                <span className={`mt-1 block truncate text-xs ${item.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{item.lastMessageBody || "Start a conversation"}</span>
              </span>
            </button>
          );
        }) : null}
      </div>
    </aside>
  );
}
