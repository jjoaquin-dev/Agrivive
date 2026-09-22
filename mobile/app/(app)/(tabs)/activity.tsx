import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ArrowUpRight, ArrowDownRight, Info, History } from "lucide-react-native";
import { fetchStockAdjustments } from "../../../src/features/inventory/api/stock-adjustments";
import type { StockAdjustment } from "../../../src/features/inventory/types";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { useFocusEffect } from "expo-router";

type ActivityFilter = "all" | "in" | "out";

export default function ActivityScreen() {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [error, setError] = useState<string | null>(null);

  const loadActivity = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchStockAdjustments({ limit: 50 });
      setAdjustments(res.items);
    } catch (err: any) {
      console.error("Failed to load activity", err);
      setError(err?.message || "Failed to load activity ledger.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadActivity();
    }, [loadActivity]),
  );

  const onRefresh = () => loadActivity(true);

  // Filter items
  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((item) => {
      const delta = parseFloat(item.delta);
      if (filter === "in") return delta > 0;
      if (filter === "out") return delta < 0;
      return true;
    });
  }, [adjustments, filter]);

  // Group items by date section (Today, Yesterday, Earlier)
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

      if (!map.has(sectionTitle)) {
        map.set(sectionTitle, []);
      }
      map.get(sectionTitle)!.push(item);
    }

    map.forEach((data, title) => {
      sections.push({ title, data });
    });

    return sections;
  }, [filteredAdjustments]);

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Coverage Notice Banner */}
      <View style={styles.noticeBanner}>
        <Info size={16} color={colors.primary} style={styles.noticeIcon} />
        <Text style={styles.noticeText}>
          Shows amount changes you record here. Buyer reservations and cancellations are shown in the order screens.
        </Text>
      </View>

      {/* Filter Tabs */}
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
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextSelected,
                ]}
              >
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
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading activity history...</Text>
        </View>
      ) : (
        <FlatList
          data={groupedSections}
          keyExtractor={(section) => section.title}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
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
          }
          renderItem={({ item: section }) => (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionDateTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.data.map((item, index) => {
                  const deltaNum = parseFloat(item.delta);
                  const isPositive = deltaNum >= 0;
                  const unit = item.scalingType === "kilo" ? "kg" : item.scalingType;
                  const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.itemRow,
                        index < section.data.length - 1 && styles.itemRowDivider,
                      ]}
                    >
                      <View
                        style={[
                          styles.itemIconCircle,
                          isPositive
                            ? styles.itemIconCircleIn
                            : styles.itemIconCircleOut,
                        ]}
                      >
                        {isPositive ? (
                          <ArrowUpRight size={18} color={colors.success} />
                        ) : (
                          <ArrowDownRight size={18} color={colors.error} />
                        )}
                      </View>

                      <View style={styles.itemMain}>
                        <Text style={styles.itemProductName}>
                          {item.productName}
                        </Text>
                        <Text style={styles.itemReason}>{item.reason}</Text>
                        <Text style={styles.itemQtyTrack}>
                          {parseFloat(item.beforeQty).toFixed(2)} →{" "}
                          {parseFloat(item.afterQty).toFixed(2)} {unit}
                        </Text>
                      </View>

                      <View style={styles.itemRight}>
                        <Text
                          style={[
                            styles.itemDelta,
                            isPositive
                              ? styles.itemDeltaPositive
                              : styles.itemDeltaNegative,
                          ]}
                        >
                          {isPositive ? `+${deltaNum.toFixed(2)}` : deltaNum.toFixed(2)}{" "}
                          {unit}
                        </Text>
                        <Text style={styles.itemTime}>{timeStr}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.base,
  },
  noticeBanner: {
    flexDirection: "row",
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  noticeIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  filterChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionDateTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  itemRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  itemIconCircleIn: {
    backgroundColor: "rgba(63, 125, 88, 0.12)",
  },
  itemIconCircleOut: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
  },
  itemMain: {
    flex: 1,
  },
  itemProductName: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  itemReason: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemQtyTrack: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemRight: {
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  itemDelta: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
  },
  itemDeltaPositive: {
    color: colors.success,
  },
  itemDeltaNegative: {
    color: colors.error,
  },
  itemTime: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  centerContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
});
