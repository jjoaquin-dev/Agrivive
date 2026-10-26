import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { PaginationControl } from "../../src/components/PaginationControl";
import { fetchSellerBoostHistory } from "../../src/features/boost/api/visibility-boosts";
import { BoostHistoryCard } from "../../src/features/boost/components/BoostHistoryCard";
import type { SellerVisibilityBoost, SellerVisibilityBoostStatus } from "../../src/features/boost/types";
import { colors, fonts, radii, spacing } from "../../src/theme";

type Filter = "all" | SellerVisibilityBoostStatus;
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "queued", label: "Waiting" },
  { value: "sent", label: "Sent" },
  { value: "prompt", label: "Needs choice" },
  { value: "failed", label: "Failed" },
];

export default function BoostHistoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<SellerVisibilityBoost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const load = useCallback(async (reset = true) => {
    if (reset) {
      setLoading(true);
      setError("");
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchSellerBoostHistory({
        limit: 20,
        cursor: reset ? undefined : nextCursor ?? undefined,
      });
      setItems((prev) => (reset ? response.items : [...prev, ...response.items]));
      setNextCursor(response.nextCursor ?? null);
    } catch (reason: any) {
      setError(reason?.message || "Could not load boost history.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [nextCursor]);

  useFocusEffect(useCallback(() => { void load(true); }, []));

  useEffect(() => { setCurrentPage(1); }, [filter]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  const visibleItems = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.status === filter)),
    [filter, items],
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleItems.slice(start, start + pageSize);
  }, [visibleItems, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (newPage * pageSize >= items.length && nextCursor && !loadingMore) {
      void load(false);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.icon}><Sparkles size={22} color={colors.primary} /></View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Boost history</Text>
          <Text style={styles.subtitle}>See every visibility boost for your listings.</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setFilter(item.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item.value }}
            style={[styles.filter, filter === item.value && styles.filterSelected]}
          >
            <Text style={[styles.filterText, filter === item.value && styles.filterTextSelected]}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
          <ButtonComponent title="Try again" onPress={() => void load(true)} variant="secondary" style={styles.retry} />
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={paginatedItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View>
            {loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} /> : null}
            {visibleItems.length > 0 ? (
              <PaginationControl
                currentPage={currentPage}
                totalItems={visibleItems.length}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20]}
                onPageChange={handlePageChange}
                onPageSizeChange={setPageSize}
                itemLabel="boosts"
              />
            ) : null}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length > 0}
            onRefresh={() => load(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <BoostHistoryCard
            item={item}
            onOpen={() => router.push({ pathname: "/(app)/boost/[productId]", params: { productId: item.productId } })}
          />
        )}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{items.length === 0 ? "No boosts yet" : "No boosts in this group"}</Text>
              <Text style={styles.emptyText}>{items.length === 0 ? "Boost a listing from Analytics to see it here." : "Choose another status to see more boosts."}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  header: { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  headerCopy: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, lineHeight: 32, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  filters: { gap: spacing.sm, paddingBottom: spacing.md },
  filter: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  filterSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.md },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
