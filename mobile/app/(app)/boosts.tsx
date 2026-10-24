import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { CheckCircle2, Clock3, RotateCcw, Sparkles, XCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { fetchSellerBoostHistory } from "../../src/features/boost/api/visibility-boosts";
import { boostReasonLabel, boostStatusLabel, type SellerVisibilityBoost, type SellerVisibilityBoostStatus } from "../../src/features/boost/types";
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

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore || loading) return;
    void load(false);
  }, [load, loading, loadingMore, nextCursor]);

  const visibleItems = useMemo(() => (filter === "all" ? items : items.filter((item) => item.status === filter)), [filter, items]);

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
        data={visibleItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} /> : null}
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

function BoostHistoryCard({ item, onOpen }: { item: SellerVisibilityBoost; onOpen: () => void }) {
  const failed = item.status === "failed";
  const tone = failed ? colors.error : item.status === "sent" ? colors.success : item.status === "prompt" ? colors.warning : colors.primary;
  const Icon = failed ? XCircle : item.status === "sent" ? CheckCircle2 : item.status === "prompt" ? RotateCcw : Clock3;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.product} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.reason}>{boostReasonLabel(item.reason)} · {formatDate(item.createdAt)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${tone}18` }]}>
          <Icon size={14} color={tone} />
          <Text style={[styles.badgeText, { color: tone }]}>{boostStatusLabel(item.status)}</Text>
        </View>
      </View>
      {item.priceBefore && item.priceAfter ? <Text style={styles.price}>Price: ₱{Number(item.priceBefore).toFixed(2)} → ₱{Number(item.priceAfter).toFixed(2)}</Text> : null}
      {item.errorMessage ? <Text style={styles.error}>{item.errorMessage}</Text> : null}
      <Pressable onPress={onOpen} accessibilityRole="button" style={({ pressed }) => [styles.open, pressed && styles.pressed]}>
        <Text style={styles.openText}>{failed ? "Open listing and try again" : "View listing status"}</Text>
      </Pressable>
    </View>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
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
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginTop: spacing.sm },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  cardTitle: { flex: 1 },
  product: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  reason: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radii.full, maxWidth: "52%" },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, flexShrink: 1 },
  price: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.primary, marginTop: spacing.md },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
  open: { minHeight: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, marginTop: spacing.md },
  openText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
  pressed: { backgroundColor: colors.background },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.md },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text },
  emptyText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
