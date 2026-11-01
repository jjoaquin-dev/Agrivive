import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDays, CircleAlert, QrCode, RefreshCw } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { PaginationControl } from "../../../src/components/PaginationControl";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { SkeletonBlock, SkeletonCard } from "../../../src/features/dashboard/components/DashboardSkeleton";
import { OrderCard } from "../../../src/features/orders/components/OrderCard";
import { useSellerOrders } from "../../../src/features/orders/hooks/useSellerOrders";
import type { SellerOrderFilter } from "../../../src/features/orders/types";

const filters: { id: SellerOrderFilter; label: string }[] = [
  { id: "pending", label: "Waiting" },
  { id: "completed", label: "Picked up" },
  { id: "cancelled", label: "Cancelled" },
  { id: "expired", label: "Expired" },
  { id: "all", label: "All" },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { filter, setFilter, orders, loading, refreshing, loadingMore, error, refresh, loadMore } = useSellerOrders();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [filter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage, pageSize]);

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <OrderCard
        order={item}
        onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: item.id } })}
      />
    ),
    [router]
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Reservations</Text>
          <Text style={styles.subtitle}>See who is coming and check their pickup code.</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(app)/orders/scan")}
          accessibilityRole="button"
          accessibilityLabel="Scan pickup QR"
          style={styles.scanButton}
        >
          <QrCode size={22} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={paginatedOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
              contentContainerStyle={styles.filters}
            >
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
            </ScrollView>
            {error ? (
              <View style={styles.errorBox}>
                <View style={styles.errorIcon}><CircleAlert size={28} color={colors.error} /></View>
                <Text style={styles.errorTitle}>Could not load reservations</Text>
                <Text style={styles.errorText}>Please check your internet connection and try again.</Text>
                <ButtonComponent
                  title="Try Again"
                  onPress={refresh}
                  variant="secondary"
                  icon={<RefreshCw size={16} color={colors.primary} />}
                  style={styles.retry}
                />
              </View>
            ) : null}
          </View>
        }
        renderItem={renderItem}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={8}
        windowSize={5}
        initialNumToRender={6}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View>
            {loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 8 }} /> : null}
            {orders.length > 0 ? (
              <PaginationControl
                currentPage={currentPage}
                totalItems={orders.length}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20]}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                itemLabel="reservations"
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} style={styles.skeletonCard}>
                  <View style={styles.skeletonRow}>
                    <SkeletonBlock width="55%" height={16} />
                    <SkeletonBlock width={96} height={22} radius={radii.full} />
                  </View>
                  <SkeletonBlock width="35%" height={12} />
                  <SkeletonBlock width="60%" height={14} />
                  <View style={styles.skeletonRow}>
                    <SkeletonBlock width={72} height={20} />
                    <SkeletonBlock width={110} height={14} />
                  </View>
                </SkeletonCard>
              ))}
            </View>
          ) : error ? null : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}><CalendarDays size={28} color={colors.textMuted} /></View>
              <Text style={styles.emptyTitle}>{filter === "pending" ? "No one is waiting" : "No reservations here"}</Text>
              <Text style={styles.muted}>New reservations show up here.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, padding: spacing.base },
  headerText: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  scanButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: spacing.base, paddingBottom: spacing.xxxl },
  filtersScroll: { marginHorizontal: -spacing.base, marginBottom: spacing.base },
  filters: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.base },
  filter: { minHeight: 40, justifyContent: "center", paddingHorizontal: spacing.base, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.base, alignItems: "center" },
  errorIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  errorTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.error },
  errorText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  skeletonCard: { gap: spacing.sm, marginBottom: spacing.md, backgroundColor: colors.surfaceMuted },
  skeletonRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  retry: { marginTop: spacing.base, alignSelf: "stretch" },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
});
