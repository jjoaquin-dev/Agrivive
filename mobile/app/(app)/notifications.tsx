import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, CheckCheck } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { useSellerNotifications } from "../../src/features/notifications/hooks/useSellerNotifications";
import { SellerNotificationCard } from "../../src/features/notifications/components/SellerNotificationCard";
import { SellerPromotionInboxSection } from "../../src/features/notifications/components/SellerPromotionInboxSection";
import type { SellerNotification } from "../../src/features/notifications/types";

export default function SellerNotificationsScreen() {
  const router = useRouter();
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
      try {
        await markRead(item.id);
      } catch (err: any) {
        Alert.alert("Could Not Update", err?.message || "Please try again.");
      }
    }
    if (item.orderId) {
      router.push({ pathname: "/(app)/orders/[id]", params: { id: item.orderId } });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch (err: any) {
      Alert.alert("Could Not Update", err?.message || "Please try again.");
    }
  };

  const handleRefresh = () => {
    refresh();
    setPromotionRefreshSignal((current) => current + 1);
  };

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
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>
                  {unreadCount === 0 ? "Order and trust updates" : `${unreadCount} unread order or trust update${unreadCount === 1 ? "" : "s"}`}
                </Text>
              </View>
              {unreadCount > 0 ? (
                <Pressable
                  onPress={handleMarkAllRead}
                  accessibilityRole="button"
                  accessibilityLabel="Mark all notifications as read"
                  style={styles.markAllButton}
                >
                  <CheckCheck size={17} color={colors.primary} />
                  <Text style={styles.markAllText}>Mark all read</Text>
                </Pressable>
              ) : null}
            </View>
            <SellerPromotionInboxSection refreshSignal={promotionRefreshSignal} />
            <View style={styles.filterRow}>
              <Pressable
                onPress={() => setUnreadOnly(false)}
                accessibilityRole="tab"
                accessibilityState={{ selected: !unreadOnly }}
                style={[styles.filterChip, !unreadOnly && styles.filterChipSelected]}
              >
                <Text style={[styles.filterText, !unreadOnly && styles.filterTextSelected]}>All</Text>
              </Pressable>
              <Pressable
                onPress={() => setUnreadOnly(true)}
                accessibilityRole="tab"
                accessibilityState={{ selected: unreadOnly }}
                style={[styles.filterChip, unreadOnly && styles.filterChipSelected]}
              >
                <Text style={[styles.filterText, unreadOnly && styles.filterTextSelected]}>Unread</Text>
              </Pressable>
            </View>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <SellerNotificationCard item={item} onPress={() => void openNotification(item)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconCircle}>
              <Bell size={28} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{unreadOnly ? "No unread order or trust updates" : "No order or trust updates yet"}</Text>
            <Text style={styles.muted}>
              {unreadOnly ? "Read updates will stay in your notification history." : "Order and trust updates will appear here."}
            </Text>
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
  muted: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.sm, textAlign: "center" },
  header: { marginBottom: spacing.base },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  markAllButton: { minHeight: 44, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.sm },
  markAllText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary, marginLeft: spacing.xs },
  filterRow: { flexDirection: "row", gap: spacing.sm },
  filterChip: { minHeight: 40, paddingHorizontal: spacing.lg, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  filterChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(31, 77, 58, 0.08)", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
});
