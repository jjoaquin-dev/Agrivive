import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, CheckCheck, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../src/theme";
import { useSellerNotifications } from "../../src/features/notifications/hooks/useSellerNotifications";
import { SellerNotificationCard } from "../../src/features/notifications/components/SellerNotificationCard";
import { SellerPromotionInboxSection } from "../../src/features/notifications/components/SellerPromotionInboxSection";
import { SellerBoostPromptSection } from "../../src/features/notifications/components/SellerBoostPromptSection";
import type { SellerNotification } from "../../src/features/notifications/types";

type NotificationCategory = "all" | "boosts" | "orders" | "messages" | "trust";

const CATEGORIES: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "boosts", label: "Priority Boost" },
  { id: "orders", label: "Orders" },
  { id: "messages", label: "Messages" },
  { id: "trust", label: "Trust" },
];

export default function SellerNotificationsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<NotificationCategory>("all");
  const [promotionRefreshSignal, setPromotionRefreshSignal] = useState(0);
  const {
    items,
    unreadOnly,
    setUnreadOnly,
    unreadCount,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    markRead,
    markAllRead,
  } = useSellerNotifications();

  const openNotification = async (item: SellerNotification) => {
    if (!item.readAt) {
      try { await markRead(item.id); }
      catch (err: any) { Alert.alert("Could Not Update", err?.message || "Please try again."); }
    }
    if (item.orderId) router.push({ pathname: "/(app)/orders/[id]", params: { id: item.orderId } });
  };

  const handleMarkAllRead = async () => {
    try { await markAllRead(); }
    catch (err: any) { Alert.alert("Could Not Update", err?.message || "Please try again."); }
  };

  const handleRefresh = () => {
    refresh();
    setPromotionRefreshSignal((c) => c + 1);
  };

  const filteredItems = items.filter((item) => {
    if (category === "all") return true;
    if (category === "boosts") return item.kind.includes("boost") || item.kind.includes("promotion");
    if (category === "orders") return item.kind.includes("order") || item.kind.includes("cancellation") || Boolean(item.orderId);
    if (category === "messages") return item.kind.includes("inquiry");
    if (category === "trust") return item.kind.includes("trust") || item.kind.includes("warning");
    return true;
  });

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>
                  {unreadCount === 0 ? "All caught up" : `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`}
                </Text>
              </View>
              {unreadCount > 0 && (
                <Pressable onPress={handleMarkAllRead} accessibilityRole="button" style={styles.markAllButton}>
                  <CheckCheck size={16} color={colors.primary} />
                  <Text style={styles.markAllText}>Mark all read</Text>
                </Pressable>
              )}
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  >
                    {cat.id === "boosts" && <Sparkles size={13} color={isSelected ? colors.white : colors.primary} />}
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat.label}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setUnreadOnly(!unreadOnly)}
                style={[styles.categoryChip, unreadOnly && styles.unreadChipActive]}
              >
                <Text style={[styles.categoryText, unreadOnly && styles.categoryTextActive]}>
                  {unreadOnly ? "Showing Unread" : "Filter Unread"}
                </Text>
              </Pressable>
            </ScrollView>

            {/* Priority Boost Sections visible on All or Priority Boost tabs */}
            {(category === "all" || category === "boosts") && (
              <>
                <SellerBoostPromptSection refreshSignal={promotionRefreshSignal} />
                <SellerPromotionInboxSection refreshSignal={promotionRefreshSignal} />
              </>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <SellerNotificationCard item={item} onPress={() => void openNotification(item)} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconCircle}><Bell size={26} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.muted}>Updates matching this category will appear here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" },
  header: { marginBottom: spacing.base },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  markAllButton: { minHeight: touchTargets.min, flexDirection: "row", alignItems: "center", gap: 4 },
  markAllText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  categoryScroll: { flexDirection: "row", gap: spacing.xs, paddingVertical: spacing.xs },
  categoryChip: { minHeight: 36, paddingHorizontal: spacing.md, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: 5 },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  unreadChipActive: { backgroundColor: colors.warning, borderColor: colors.warning },
  categoryText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  categoryTextActive: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(31, 77, 58, 0.08)", alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
});
