"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, MessageSquare, MoreHorizontal, Search } from "lucide-react";
import type { Conversation } from "../api";
import { ConversationListRow } from "./ConversationListRow";

type TabType = "all" | "unread" | "important";
type ViewType = "inbox" | "archived" | "blocked";

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
  const [view, setView] = useState<ViewType>("inbox");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [menuOpen]);

  const filteredItems = useMemo(() => {
    // Archived and blocked chats stay out of the inbox; each has its own view.
    let list = items.filter((i) =>
      view === "archived" ? i.archivedAt && !i.myBlockedAt
        : view === "blocked" ? i.myBlockedAt
        : !i.archivedAt && !i.myBlockedAt
    );
    if (view === "inbox" && activeTab === "unread") list = list.filter((i) => i.unreadCount > 0);
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((item) =>
      [item.sellerShopName, item.sellerName, item.productName, item.lastMessageBody].some((v) =>
        v?.toLowerCase().includes(query)
      )
    );
  }, [items, search, activeTab, view]);

  return (
    <aside
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-agrivive-line bg-white p-4 shadow-sm ${className}`}
      aria-label="Messages list"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-agrivive-mist text-[#365E24] shadow-sm">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold leading-tight text-agrivive-forest">Messages</h1>
            <p className="text-xs text-agrivive-gray">All communications</p>
          </div>
        </div>
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More message options"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex size-11 items-center justify-center rounded-full text-[#A6B0A2] transition hover:bg-[#F0F2EB] hover:text-agrivive-forest cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen ? (
            <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-40 rounded-2xl border border-agrivive-line bg-white p-1.5 shadow-md">
              {([["archived", "View Archived"], ["blocked", "View Blocked"]] as const).map(([next, label]) => (
                <button
                  key={next}
                  type="button"
                  role="menuitem"
                  onClick={() => { setView(next); setMenuOpen(false); }}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-semibold text-agrivive-forest hover:bg-[#F6F8ED] cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {view !== "inbox" ? (
        <button
          type="button"
          onClick={() => setView("inbox")}
          className="mt-2 flex items-center gap-1.5 rounded-full bg-agrivive-wash px-3 py-2 text-xs font-semibold text-agrivive-forest cursor-pointer hover:bg-agrivive-mist"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {view === "archived" ? "Archived chats" : "Blocked chats"} · Back to all
        </button>
      ) : (
      /* Pill Filter Tabs */
      <div className="mt-2 flex items-center justify-between rounded-full bg-agrivive-wash p-1">
        {(["all", "unread", "important"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1 py-1 text-xs font-semibold capitalize transition-all ${
                isActive
                  ? "bg-white text-agrivive-forest shadow-sm"
                  : "text-agrivive-gray hover:text-agrivive-forest"
              }`}
            >
              <span>{tab}</span>
              {tab === "all" && items.some((i) => !i.archivedAt) && (
                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#D2E794] text-xs font-bold leading-none text-agrivive-forest">
                  {items.filter((i) => !i.archivedAt).length}
                </span>
              )}
            </button>
          );
        })}
      </div>
      )}

      {/* Search Input Bar */}
      <div className="relative mt-3.5">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-agrivive-gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search conversations by name" placeholder="Search by name"
          className="w-full rounded-full border border-[#E8EAE0] bg-agrivive-wash py-2 pl-9 pr-4 text-xs text-agrivive-forest placeholder:text-[#6B736B] outline-none transition focus:border-agrivive-primary focus:ring-2 focus:ring-agrivive-primary/15"
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
          <div className="flex flex-col items-center py-10 text-center text-xs text-agrivive-gray">
            <Image src="/brand/empty-chat.webp" alt="" width={360} height={243} sizes="112px" className="mb-3 h-auto w-28" />
            {search ? "No matching conversations" : "No messages yet. Chat with a seller from a product page."}
          </div>
        ) : null}

        {!loading &&
          filteredItems.map((item) => (
            <ConversationListRow key={item.id} item={item} isSelected={selectedId === item.id} onSelect={onSelect} onChanged={onChanged} />
          ))}
      </div>
    </aside>
  );
}
