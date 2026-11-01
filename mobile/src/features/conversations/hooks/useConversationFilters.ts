import { useMemo, useState } from "react";
import type { Conversation } from "../types";
import type { SortOption } from "../components/ConversationSortSheet";

export type MessagesTabFilter = "all" | "unread" | "produce" | "reservations" | "questions";

export function useConversationFilters(conversations: Conversation[]) {
  const [filterTab, setFilterTab] = useState<MessagesTabFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (filterTab === "unread") {
      list = list.filter((c) => c.unreadCount > 0);
    } else if (filterTab === "produce") {
      list = list.filter((c) => c.contextType === "product" || c.contextType === "seller");
    } else if (filterTab === "reservations") {
      list = list.filter((c) => c.contextType === "order");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.buyerName?.toLowerCase().includes(q) ||
          c.productName?.toLowerCase().includes(q) ||
          c.lastMessageBody?.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "unread") {
        if ((b.unreadCount > 0) !== (a.unreadCount > 0)) {
          return b.unreadCount > 0 ? 1 : -1;
        }
      }
      const timeA = new Date(a.lastMessageAt).getTime();
      const timeB = new Date(b.lastMessageAt).getTime();
      return sortBy === "oldest" ? timeA - timeB : timeB - timeA;
    });
  }, [conversations, filterTab, searchQuery, sortBy]);

  const hasCustomSort = sortBy !== "newest";

  return {
    filterTab,
    setFilterTab,
    sortBy,
    setSortBy,
    sortSheetOpen,
    setSortSheetOpen,
    searchQuery,
    setSearchQuery,
    searchOpen,
    setSearchOpen,
    filteredConversations,
    hasCustomSort,
  };
}
