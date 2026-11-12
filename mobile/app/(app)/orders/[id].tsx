import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useFocusEffect, useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle, Camera } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { CardComponent } from "../../../src/components/CardComponent";
import { colors, fonts, spacing, touchTargets } from "../../../src/theme";
import { surface } from "../../../src/theme/surface";
import { useLiveSellerOrder } from "../../../src/features/orders/hooks/useLiveSellerOrder";
import { cancelSellerOrder, fetchSellerOrder } from "../../../src/features/orders/api/seller-orders";
import { formatClock, formatMoney, formatPlacedLong } from "../../../src/features/orders/orderFormat";
import { OrderCancelSheet } from "../../../src/features/orders/components/OrderCancelSheet";
import { OrderItemsList } from "../../../src/features/orders/components/OrderItemsList";
import { OrderStatusBadge } from "../../../src/features/orders/components/OrderStatusBadge";
import { SellerOrderCommunication } from "../../../src/features/orders/components/SellerOrderCommunication";
import { OrderPickupSteps } from "../../../src/features/orders/components/OrderPickupSteps";
import { SellerOrderReportModal } from "../../../src/features/orders/components/SellerOrderReportModal";
import type { SellerOrder } from "../../../src/features/orders/types";

export default function SellerOrderDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadOrder = useCallback(async (quiet = false) => {
    if (!id) return;
    if (!quiet) setLoading(true);
    setError(null);
    try {
      setOrder(await fetchSellerOrder(id));
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || "Could not load this reservation.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { void loadOrder(); }, [loadOrder]));
  const [refreshing, setRefreshing] = useState(false);
  const pullToRefresh = async () => { setRefreshing(true); await loadOrder(true); setRefreshing(false); };

  useLiveSellerOrder({ id, order, isFocused, setOrder, setLastUpdated, setError });

  const handleCancel = async (reason: string): Promise<boolean> => {
    if (!order || reason.length < 5) return false;
    setSaving(true);
    try {
      setOrder(await cancelSellerOrder(order.id, reason));
      setCancelOpen(false);
      return true;
    } catch (err: any) {
      Alert.alert("Could Not Cancel", err?.message || "Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error || !order) return <View style={styles.center}><Text style={styles.errorText}>{error || "Reservation not found."}</Text><ButtonComponent title="Try Again" onPress={loadOrder} variant="secondary" style={styles.retry} /></View>;

  const canAct = order.status === "pending" && !order.decline;
  const reference = order.id.slice(0, 8).toUpperCase();

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Reservation", headerBackTitle: "Back" }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Reservation #{reference}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <Text style={styles.date}>
          {formatPlacedLong(order.createdAt)}{lastUpdated ? `  ·  Updated ${formatClock(lastUpdated)}` : ""}
        </Text>

        {error ? <Text style={styles.refreshError}>{error}</Text> : null}

        <OrderPickupSteps order={order} onChanged={(next) => { setOrder(next); setLastUpdated(new Date()); }} />

        <CardComponent style={{ ...styles.card, ...surface.cardStyle }}>
          <Text style={styles.cardTitle}>Items</Text>
          <OrderItemsList items={order.items} />
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>{formatMoney(order.totalAmount)}</Text></View>
        </CardComponent>

        <SellerOrderCommunication orderId={order.id} />

        <CardComponent style={{ ...styles.card, ...surface.cardStyle }}>
          <Text style={styles.cardTitle}>Reference</Text>
          <Text style={styles.detail}>Buyer #{order.buyerId.slice(0, 8).toUpperCase()}</Text>
          {order.checkoutId ? <Text style={styles.detail}>Checkout #{order.checkoutId.slice(0, 8).toUpperCase()}</Text> : null}
          {order.cancellationReason ? <Text style={styles.detail}>Reason: {order.cancellationReason}</Text> : null}
        </CardComponent>

        <ButtonComponent
          title="Report a Problem"
          onPress={() => setReportOpen(true)}
          variant="ghost"
          icon={<AlertTriangle size={18} color={colors.textMuted} />}
          textStyle={styles.reportText}
        />
      </ScrollView>

      {canAct ? (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.base) }]}>
          <ButtonComponent
            title="Scan Pickup QR"
            onPress={() => router.push({ pathname: "/(app)/orders/scan", params: { orderId: order.id } })}
            icon={<Camera size={18} color={colors.white} />}
            style={styles.scanButton}
          />
          <ButtonComponent title="Cancel Reservation" onPress={() => setCancelOpen(true)} variant="ghost" textStyle={styles.cancelText} style={styles.cancelButton} />
        </View>
      ) : null}

      <OrderCancelSheet visible={cancelOpen} saving={saving} onClose={() => setCancelOpen(false)} onConfirm={handleCancel} />
      <SellerOrderReportModal orderId={order.id} visible={reportOpen} onClose={() => setReportOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: surface.page },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.base, backgroundColor: surface.page },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 24, lineHeight: 30, color: colors.text },
  date: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  refreshError: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.warning, marginBottom: spacing.base },
  card: { marginBottom: spacing.md },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: surface.border, paddingTop: spacing.md, marginTop: spacing.xs },
  totalLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  total: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.primary },
  detail: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  errorText: { fontFamily: fonts.body.medium, color: colors.error, textAlign: "center" },
  retry: { marginTop: spacing.md },
  reportText: { color: colors.textMuted },
  bottomBar: { backgroundColor: surface.card, borderTopWidth: 1, borderTopColor: surface.border, paddingHorizontal: spacing.base, paddingTop: spacing.md },
  scanButton: { minHeight: touchTargets.min },
  cancelButton: { marginTop: spacing.xs },
  cancelText: { color: colors.error },
});
