import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { QrCode } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { OrderCard } from "../../../src/features/orders/components/OrderCard";
import { useSellerOrders } from "../../../src/features/orders/hooks/useSellerOrders";
import type { SellerOrderFilter } from "../../../src/features/orders/types";

const filters: { id: SellerOrderFilter; label: string }[] = [
  { id: "pending", label: "Waiting" },
  { id: "completed", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
  { id: "expired", label: "Expired" },
  { id: "all", label: "All" },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { filter, setFilter, orders, loading, refreshing, loadingMore, error, refresh, loadMore } = useSellerOrders();

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.muted}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>Check buyer orders and confirm pickup.</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(app)/orders/scan")}
          accessibilityRole="button"
          accessibilityLabel="Scan buyer QR code"
          style={styles.scanButton}
        >
          <QrCode size={20} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.filters}>
              {filters.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setFilter(item.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: filter === item.id }}
                  style={[styles.filter, filter === item.id && styles.filterSelected]}
                >
                  <Text style={[styles.filterText, filter === item.id && styles.filterTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
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
          <OrderCard
            order={item}
            onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: item.id } })}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No orders here</Text>
            <Text style={styles.muted}>New buyer orders will appear here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  scanButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: spacing.base, paddingBottom: spacing.xxxl },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.base },
  filter: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
});
