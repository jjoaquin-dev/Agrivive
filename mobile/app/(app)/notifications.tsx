import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { colors, fonts, spacing } from "../../src/theme";
import { useUnifiedNotifications } from "../../src/features/notifications/hooks/useUnifiedNotifications";
import { NotificationHeaderBar } from "../../src/features/notifications/components/NotificationHeaderBar";
import { NotificationSummaryBanner } from "../../src/features/notifications/components/NotificationSummaryBanner";
import { NotificationCategoryTabs } from "../../src/features/notifications/components/NotificationCategoryTabs";
import { NotificationEmptyState } from "../../src/features/notifications/components/NotificationEmptyState";
import { NotificationSkeleton } from "../../src/features/notifications/components/NotificationSkeleton";
import { NotificationSearchBar } from "../../src/features/notifications/components/NotificationSearchBar";
import { NotificationTimelineCard } from "../../src/features/notifications/components/NotificationTimelineCard";
import { NotificationFilterModal, NotificationFilterState } from "../../src/features/notifications/components/NotificationFilterModal";
import { NotificationSettingsSheet } from "../../src/features/notifications/components/NotificationSettingsSheet";
import { PaginationControl } from "../../src/components/PaginationControl";
import type { NotificationCategory, UnifiedNotificationItem } from "../../src/features/notifications/types";

interface SectionedItem {
  type: "header" | "card";
  sectionTitle?: string;
  card?: UnifiedNotificationItem;
  id: string;
}

export default function NotificationsScreen() {
  const { items, counts, unreadCount, urgentCount, loading, refreshing, loadingMore, refresh, loadMore, markAllRead } = useUnifiedNotifications();
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFilterState>({
    unreadOnly: false,
    urgentOnly: false,
    sortBy: "newest",
  });

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchQuery, filters]);

  const { sectionedData, totalCount } = useMemo(() => {
    let list = items.filter((item) => {
      if (!item) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (filters.unreadOnly && item.read) return false;
      if (filters.urgentOnly && !item.urgent) return false;
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        return (item.title || "").toLowerCase().includes(query) || (item.subtitle || "").toLowerCase().includes(query);
      }
      return true;
    });

    list.sort((a, b) => {
      const timeA = a.rawDate && !isNaN(a.rawDate.getTime()) ? a.rawDate.getTime() : 0;
      const timeB = b.rawDate && !isNaN(b.rawDate.getTime()) ? b.rawDate.getTime() : 0;
      return filters.sortBy === "oldest" ? timeA - timeB : timeB - timeA;
    });

    const totalCount = list.length;
    const paginated = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const today: UnifiedNotificationItem[] = [];
    const yesterday: UnifiedNotificationItem[] = [];
    const earlier: UnifiedNotificationItem[] = [];

    for (const item of paginated) {
      if (!item) continue;
      const ts = item.timestamp || "";
      if (ts.includes("min") || ts.includes("hr") || ts === "Just now") today.push(item);
      else if (ts === "Yesterday") yesterday.push(item);
      else earlier.push(item);
    }

    const result: SectionedItem[] = [];
    if (today.length > 0) {
      result.push({ type: "header", sectionTitle: "TODAY", id: "header-today" });
      today.forEach((c, i) => {
        if (c) result.push({ type: "card", card: c, id: c.id ? `${c.id}-today-${i}` : `today-${i}` });
      });
    }
    if (yesterday.length > 0) {
      result.push({ type: "header", sectionTitle: "YESTERDAY", id: "header-yesterday" });
      yesterday.forEach((c, i) => {
        if (c) result.push({ type: "card", card: c, id: c.id ? `${c.id}-yesterday-${i}` : `yesterday-${i}` });
      });
    }
    if (earlier.length > 0) {
      result.push({ type: "header", sectionTitle: "EARLIER", id: "header-earlier" });
      earlier.forEach((c, i) => {
        if (c) result.push({ type: "card", card: c, id: c.id ? `${c.id}-earlier-${i}` : `earlier-${i}` });
      });
    }
    return { sectionedData: result, totalCount };
  }, [items, selectedCategory, searchQuery, filters, currentPage, pageSize]);

  const activeFilterCount = (filters.unreadOnly ? 1 : 0) + (filters.urgentOnly ? 1 : 0) + (filters.sortBy !== "newest" ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <NotificationHeaderBar unreadCount={unreadCount} onMarkAllRead={markAllRead} onOpenSettings={() => setSettingsVisible(true)} />

      <FlatList
        data={sectionedData}
        keyExtractor={(item, index) => item?.id ?? `notif-${index}`}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ paddingHorizontal: spacing.base }}>
            {loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 8 }} /> : null}
            {totalCount > 0 ? (
              <PaginationControl
                currentPage={currentPage}
                totalItems={totalCount}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20]}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                itemLabel="notifications"
              />
            ) : null}
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <NotificationSummaryBanner unreadCount={unreadCount} urgentCount={urgentCount} />
            <NotificationCategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} counts={counts} />
            <NotificationSearchBar value={searchQuery} onChangeText={setSearchQuery} onFilterPress={() => setFilterModalVisible(true)} activeFilterCount={activeFilterCount} />
          </View>
        }
        renderItem={({ item }) => {
          if (!item) return null;
          return item.type === "header" ? (
            <Text style={styles.sectionHeader}>{item.sectionTitle}</Text>
          ) : item.card ? (
            <NotificationTimelineCard item={item.card} />
          ) : null;
        }}
        ListEmptyComponent={
          loading ? <NotificationSkeleton /> : <NotificationEmptyState searchQuery={searchQuery} hasFilters={activeFilterCount > 0 || selectedCategory !== "all"} hasAnyItems={items.length > 0} />
        }
      />

      <NotificationSettingsSheet visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <NotificationFilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={(updated) => { setFilters(updated); setFilterModalVisible(false); }}
        onReset={() => { setFilters({ unreadOnly: false, urgentOnly: false, sortBy: "newest" }); setFilterModalVisible(false); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: spacing.xxxl },
  sectionHeader: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted, letterSpacing: 0.8, paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
});
