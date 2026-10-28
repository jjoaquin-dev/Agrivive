import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Pressable, ActivityIndicator } from "react-native";
import { Info, History } from "lucide-react-native";
import { fetchStockAdjustments } from "../../src/features/inventory/api/stock-adjustments";
import type { StockAdjustment } from "../../src/features/inventory/types";
import { ActivityItemRow } from "../../src/features/inventory/components/ActivityItemRow";
import { activityStyles as styles } from "../../src/features/inventory/components/ActivityStyles";
import { colors } from "../../src/theme";
import { useFocusEffect } from "expo-router";

type ActivityFilter = "all" | "in" | "out";

export default function ActivityScreen() {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const loadActivity = useCallback(async (reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetchStockAdjustments({
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setAdjustments((prev) => (reset ? res.items : [...prev, ...res.items]));
      setNextCursor(res.nextCursor);
    } catch (err: any) {
      console.error("Failed to load activity", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [nextCursor]);

  useFocusEffect(
    useCallback(() => {
      void loadActivity(true);
    }, []),
  );

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void loadActivity(false);
  }, [loadActivity, loading, loadingMore, nextCursor]);

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((item) => {
      const delta = parseFloat(item.delta);
      if (filter === "in") return delta > 0;
      if (filter === "out") return delta < 0;
      return true;
    });
  }, [adjustments, filter]);

  const groupedSections = useMemo(() => {
    const today = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    const sections: { title: string; data: StockAdjustment[] }[] = [];
    const map = new Map<string, StockAdjustment[]>();

    for (const item of filteredAdjustments) {
      const itemDate = new Date(item.createdAt).toDateString();
      let sectionTitle = itemDate;
      if (itemDate === today) sectionTitle = "Today";
      else if (itemDate === yesterday) sectionTitle = "Yesterday";
      else {
        sectionTitle = new Date(item.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!map.has(sectionTitle)) map.set(sectionTitle, []);
      map.get(sectionTitle)!.push(item);
    }

    map.forEach((data, title) => sections.push({ title, data }));
    return sections;
  }, [filteredAdjustments]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.noticeBanner}>
        <Info size={16} color={colors.primary} style={styles.noticeIcon} />
        <Text style={styles.noticeText}>
          Shows amount changes you record here. Buyer reservations and cancellations are shown in the order screens.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {(
          [
            { id: "all", label: "All Activity" },
            { id: "in", label: "Added" },
            { id: "out", label: "Taken Away" },
          ] as { id: ActivityFilter; label: string }[]
        ).map((t) => {
          const isSelected = filter === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setFilter(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={groupedSections}
        keyExtractor={(section) => section.title}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} /> : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadActivity(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading activity history...</Text>
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <View style={styles.emptyIconCircle}>
                <History size={32} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No activity recorded</Text>
              <Text style={styles.emptySub}>
                {filter === "all"
                  ? "Changes you make to amounts will appear here."
                  : filter === "in"
                  ? "Nothing has been added yet."
                  : "Nothing has been taken away yet."}
              </Text>
            </View>
          )
        }
        renderItem={({ item: section }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionDateTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.data.map((item, index) => (
                <ActivityItemRow key={item.id} item={item} isLast={index === section.data.length - 1} />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}
