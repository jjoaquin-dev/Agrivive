import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle, Camera, Clock3 } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { CardComponent } from "../../../src/components/CardComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { useLiveSellerOrder } from "../../../src/features/orders/hooks/useLiveSellerOrder";
import { cancelSellerOrder, fetchSellerOrder } from "../../../src/features/orders/api/seller-orders";
import { formatClock, formatMoney, formatPickupBy, formatPlacedLong } from "../../../src/features/orders/orderFormat";
import { OrderCancelSheet } from "../../../src/features/orders/components/OrderCancelSheet";
import { OrderItemsList } from "../../../src/features/orders/components/OrderItemsList";
import { OrderStatusBadge } from "../../../src/features/orders/components/OrderStatusBadge";
import { SellerOrderCommunication } from "../../../src/features/orders/components/SellerOrderCommunication";
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

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
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

  const canAct = order.status === "pending";
  const reference = order.id.slice(0, 8).toUpperCase();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Reservation #{reference}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <Text style={styles.date}>{formatPlacedLong(order.createdAt)}</Text>
        {lastUpdated ? (
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.updated}>Updated {formatClock(lastUpdated)}</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.refreshError}>{error}</Text> : null}

        {canAct && order.expiresAt ? (
          <View style={styles.banner}>
            <Clock3 size={20} color={colors.warning} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>{formatPickupBy(order.expiresAt)}</Text>
              <Text style={styles.bannerBody}>The pickup code stops working after this time.</Text>
            </View>
          </View>
        ) : null}

        <CardComponent style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          <OrderItemsList items={order.items} />
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>{formatMoney(order.totalAmount)}</Text></View>
        </CardComponent>

        <SellerOrderCommunication orderId={order.id} />

        <CardComponent style={styles.card}>
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
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.base, backgroundColor: colors.background },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm },
  title: { flex: 1, fontFamily: fonts.heading.bold, fontSize: 22, lineHeight: 28, color: colors.text },
  date: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  liveRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs, marginBottom: spacing.base },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  updated: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted },
  refreshError: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.warning, marginBottom: spacing.base },
  banner: { flexDirection: "row", gap: spacing.sm, backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FED7AA", borderRadius: radii.card, padding: spacing.base, marginBottom: spacing.base },
  bannerText: { flex: 1 },
  bannerTitle: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.warning },
  bannerBody: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  total: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  detail: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
  errorText: { fontFamily: fonts.body.medium, color: colors.error, textAlign: "center" },
  retry: { marginTop: spacing.md },
  reportText: { color: colors.textMuted },
  bottomBar: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingTop: spacing.md },
  scanButton: { minHeight: touchTargets.min },
  cancelButton: { marginTop: spacing.md },
  cancelText: { color: colors.error },
});
