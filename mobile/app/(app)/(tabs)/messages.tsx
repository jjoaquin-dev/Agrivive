import React, { useMemo, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSellerConversations } from "../../../src/features/conversations/hooks/useSellerConversations";
import { useSellerProductInquiries } from "../../../src/features/messages/hooks/useSellerProductInquiries";
import { useConversationFilters } from "../../../src/features/conversations/hooks/useConversationFilters";
import { MessagesHeader } from "../../../src/features/conversations/components/MessagesHeader";
import { MessagesChipRow } from "../../../src/features/conversations/components/MessagesChipRow";
import { ConversationList } from "../../../src/features/conversations/components/ConversationList";
import { QuestionList } from "../../../src/features/conversations/components/QuestionList";
import { ConversationSortSheet } from "../../../src/features/conversations/components/ConversationSortSheet";
import type { Conversation } from "../../../src/features/conversations/types";
import { markAllConversationsRead, setConversationArchived, setConversationBlocked } from "../../../src/features/conversations/api";
import { colors } from "../../../src/theme";
import { logApiError } from "../../../src/api/client";

export default function SellerMessagesScreen() {
  const direct = useSellerConversations();
  const web = useSellerProductInquiries();
  const [markingAll, setMarkingAll] = useState(false);

  const filters = useConversationFilters(direct.conversations);
  const showArchived = filters.filterTab === "archived";
  const archived = useSellerConversations(true, showArchived);
  const archivedShown = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return q ? archived.conversations.filter((c) => [c.buyerName, c.productName, c.lastMessageBody].some((v) => v?.toLowerCase().includes(q))) : archived.conversations;
  }, [archived.conversations, filters.searchQuery]);

  const refreshAll = () => { void direct.refresh(); if (showArchived) void archived.refresh(); };
  const runChange = async (change: () => Promise<unknown>) => {
    try { await change(); refreshAll(); } catch (err: any) { Alert.alert("Could Not Change", err?.message || "Please try again."); }
  };
  const openActions = (c: Conversation) => {
    const name = c.buyerName || "this buyer";
    Alert.alert(name, undefined, [
      { text: c.archivedAt ? "Move Out of Archived" : "Archive", onPress: () => void runChange(() => setConversationArchived(c.id, !c.archivedAt)) },
      { text: c.myBlockedAt ? "Unblock" : "Block", style: c.myBlockedAt ? "default" : "destructive", onPress: () => void runChange(() => setConversationBlocked(c.id, !c.myBlockedAt)) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const totalDirectUnread = useMemo(
    () => direct.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [direct.conversations],
  );

  const handleMarkAllRead = async () => {
    if (markingAll || totalDirectUnread <= 0) return;
    setMarkingAll(true);
    try {
      await markAllConversationsRead();
      await direct.refresh();
    } catch (err) {
      logApiError("Failed to mark all as read", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleQuestionAnswerSuccess = () => {
    void direct.refresh();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <MessagesHeader
        unreadCount={totalDirectUnread}
        searchOpen={filters.searchOpen}
        onToggleSearch={() => filters.setSearchOpen((prev) => !prev)}
        searchQuery={filters.searchQuery}
        onChangeSearchQuery={filters.setSearchQuery}
        onOpenSort={() => filters.setSortSheetOpen(true)}
        hasCustomSort={filters.hasCustomSort}
        onMarkAllRead={handleMarkAllRead}
        isMarkingAllRead={markingAll}
      />

      <MessagesChipRow
        activeTab={filters.filterTab}
        onSelectTab={filters.setFilterTab}
        unreadCount={totalDirectUnread}
        openCount={web.openCount}
      />

      <ConversationSortSheet
        visible={filters.sortSheetOpen}
        onClose={() => filters.setSortSheetOpen(false)}
        activeSort={filters.sortBy}
        onSelectSort={filters.setSortBy}
      />

      {filters.filterTab === "questions" ? (
        <QuestionList
          inquiries={web.inquiries}
          openCount={web.openCount}
          filter={web.filter}
          onChangeFilter={web.setFilter}
          loading={web.loading}
          refreshing={web.refreshing}
          loadingMore={web.loadingMore}
          replyingId={web.replyingId}
          error={web.error}
          onRefresh={web.refresh}
          onLoadMore={web.loadMore}
          onReply={web.reply}
          onAnswerSuccess={handleQuestionAnswerSuccess}
          onRetry={web.refresh}
        />
      ) : (
        <ConversationList
          conversations={showArchived ? archivedShown : filters.filteredConversations}
          loading={showArchived ? archived.loading : direct.loading}
          refreshing={showArchived ? archived.refreshing : direct.refreshing}
          loadingMore={showArchived ? archived.loadingMore : direct.loadingMore}
          error={showArchived ? archived.error : direct.error}
          onActions={openActions}
          filterTab={filters.filterTab}
          searchQuery={filters.searchQuery}
          onRefresh={showArchived ? archived.refresh : direct.refresh}
          onLoadMore={showArchived ? archived.loadMore : direct.loadMore}
          onRetry={showArchived ? archived.refresh : direct.refresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
