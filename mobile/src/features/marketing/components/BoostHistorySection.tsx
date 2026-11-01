import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { PaginationControl } from "../../../components/PaginationControl";
import { colors, fonts, radii, spacing } from "../../../theme";
import { boostState, type SellerVisibilityBoost } from "../types";
import { BoostHistoryCard } from "./BoostHistoryCard";

type Filter = "all" | "running" | "posted" | "dropped" | "not_posted";
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All activity" },
  { value: "running", label: "Running" },
  { value: "posted", label: "Posted" },
  { value: "dropped", label: "Price dropped" },
  { value: "not_posted", label: "Did not post" },
];

/** What happened to a boost, in the seller's words. A boost can be in more than one group. */
function matches(item: SellerVisibilityBoost, filter: Filter) {
  const state = boostState(item);
  switch (filter) {
    case "all": return true;
    case "running": return state === "posting" || state === "running";
    case "posted": return state === "posted" || state === "finished" || state === "running";
    case "dropped": return (item.progress?.roundsDone ?? 0) > 0;
    case "not_posted": return state === "not_posted" || state === "failed";
  }
}

interface Props {
  items: SellerVisibilityBoost[];
  nextCursor: string | null;
  loading: boolean;
  loadingMore: boolean;
  error: string;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function BoostHistorySection({ items, nextCursor, loading, loadingMore, error, onRetry, onLoadMore }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [filter]);

  const visible = useMemo(() => items.filter((item) => matches(item, filter)), [filter, items]);
  const counts = useMemo(
    () => Object.fromEntries(filters.map((entry) => [entry.value, items.filter((item) => matches(item, entry.value)).length])),
    [items],
  );
  const pageItems = visible.slice((page - 1) * pageSize, page * pageSize);

  const changePage = (next: number) => {
    setPage(next);
    if (next * pageSize >= items.length && nextCursor && !loadingMore) onLoadMore();
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setFilter(item.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item.value }}
            style={[styles.filter, filter === item.value && styles.filterSelected]}
          >
            <Text style={[styles.filterText, filter === item.value && styles.filterTextSelected]}>{item.label}{counts[item.value] > 0 && item.value !== "all" ? ` · ${counts[item.value]}` : ""}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
          <ButtonComponent title="Try again" onPress={onRetry} variant="secondary" style={styles.retry} />
        </View>
      ) : null}
      {loading && items.length === 0 ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {pageItems.map((item) => (
        <BoostHistoryCard
          key={item.id}
          item={item}
          onOpen={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: item.productId } })}
        />
      ))}
      {!loading && !error && visible.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{items.length === 0 ? "No boosts yet" : "No boosts in this group"}</Text>
          <Text style={styles.emptyText}>{items.length === 0 ? "Boost a listing to see it here." : "Choose another activity to see more boosts."}</Text>
        </View>
      ) : null}
      {loadingMore ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {visible.length > 0 ? (
        <PaginationControl
          currentPage={page}
          totalItems={visible.length}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20]}
          onPageChange={changePage}
          onPageSizeChange={setPageSize}
          itemLabel="boosts"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { gap: spacing.sm, paddingBottom: spacing.md, paddingRight: spacing.base },
  filter: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  filterSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.sm },
  retry: { marginTop: spacing.sm },
  loader: { marginVertical: spacing.base },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
