import React from "react";
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
import { Bell, CheckCheck, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { useSellerNotifications } from "../../src/features/notifications/hooks/useSellerNotifications";
import type { SellerNotification } from "../../src/features/notifications/types";

const notificationTitles: Record<string, string> = {
  seller_cancellation_warning: "Order cancellation recorded",
  inquiry_12h_reminder: "Buyer question needs a reply",
  inquiry_24h_warning: "Buyer question is waiting",
  inquiry_24h_buyer_notice: "Inquiry response update",
  trust_event_corrected: "Trust record updated",
};

function notificationTitle(kind: string) {
  return notificationTitles[kind] || "Seller account update";
}

function notificationDescription(kind: string) {
  switch (kind) {
    case "seller_cancellation_warning":
      return "A cancelled pending order was added to your trust history.";
    case "inquiry_12h_reminder":
      return "A buyer has been waiting for your answer for 12 hours.";
    case "inquiry_24h_warning":
      return "Please answer the buyer before the inquiry becomes overdue.";
    case "inquiry_24h_buyer_notice":
      return "The buyer was informed that the inquiry is still unanswered.";
    case "trust_event_corrected":
      return "A trust event was corrected after its source was checked.";
    default:
      return "Open the related order for more information.";
  }
}

function NotificationCard({
  item,
  onPress,
}: {
  item: SellerNotification;
  onPress: () => void;
}) {
  const isUnread = !item.readAt;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${notificationTitle(item.kind)}${isUnread ? ", unread" : ""}`}
      style={({ pressed }) => [
        styles.card,
        isUnread && styles.unreadCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconCircle, isUnread && styles.unreadIconCircle]}>
        <Bell size={19} color={isUnread ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{notificationTitle(item.kind)}</Text>
          {isUnread ? <View style={styles.unreadDot} accessible accessibilityLabel="Unread" /> : null}
        </View>
        <Text style={styles.cardDescription}>{notificationDescription(item.kind)}</Text>
        <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export default function SellerNotificationsScreen() {
  const router = useRouter();
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
            onRefresh={refresh}
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
                  {unreadCount === 0 ? "You are all caught up." : `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`}
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
          <NotificationCard item={item} onPress={() => void openNotification(item)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconCircle}>
              <Bell size={28} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{unreadOnly ? "No unread notifications" : "No notifications yet"}</Text>
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
  card: { minHeight: 92, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.sm },
  unreadCard: { borderColor: colors.primary, backgroundColor: "rgba(31, 77, 58, 0.04)" },
  cardPressed: { opacity: 0.75 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  unreadIconCircle: { backgroundColor: "rgba(31, 77, 58, 0.12)" },
  cardContent: { flex: 1, marginRight: spacing.sm },
  cardTitleRow: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 16, lineHeight: 22, color: colors.text },
  cardDescription: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
  cardDate: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.xs },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(31, 77, 58, 0.08)", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
});
