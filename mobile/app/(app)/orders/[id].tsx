import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle, Camera, X } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { CardComponent } from "../../../src/components/CardComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { cancelSellerOrder, fetchSellerOrder } from "../../../src/features/orders/api/seller-orders";
import { OrderItemsList } from "../../../src/features/orders/components/OrderItemsList";
import { OrderStatusBadge } from "../../../src/features/orders/components/OrderStatusBadge";
import { SellerOrderCommunication } from "../../../src/features/orders/components/SellerOrderCommunication";
import { SellerOrderReportModal } from "../../../src/features/orders/components/SellerOrderReportModal";
import type { SellerOrder } from "../../../src/features/orders/types";
function money(value: string) {
  return `₱${Number(value).toFixed(2)}`;
}
export default function SellerOrderDetailScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
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
      setError(err?.message || "Could not load this order.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { void loadOrder(); }, [loadOrder]));

  useEffect(() => {
    if (!isFocused || !id || !order || order.status !== "pending") return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = 10_000;
    let controller: AbortController | undefined;

    const schedule = () => {
      if (active) timer = setTimeout(() => void refresh(), delay);
    };

    const refresh = async () => {
      if (!active || AppState.currentState !== "active") {
        schedule();
        return;
      }
      controller = new AbortController();
      try {
        const latest = await fetchSellerOrder(id, controller.signal);
        if (!active) return;
        setOrder(latest);
        setLastUpdated(new Date());
        setError(null);
        delay = 10_000;
      } catch (err: any) {
        if (!active || controller.signal.aborted) return;
        if ([401, 403, 404].includes(err?.statusCode)) {
          setError(err?.message || "Could not refresh this order.");
          return;
        }
        setError(err?.message || "Could not refresh this order. Retrying soon.");
        delay = Math.min(delay * 2, 60_000);
      }
      schedule();
    };

    const handleAppState = (nextState: string) => {
      if (nextState !== "active") return;
      if (timer) clearTimeout(timer);
      delay = 10_000;
      void refresh();
    };

    const subscription = AppState.addEventListener("change", handleAppState);
    timer = setTimeout(() => void refresh(), delay);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller?.abort();
      subscription.remove();
    };
  }, [id, isFocused, order?.status]);

  const handleCancel = async () => {
    if (!order || cancelReason.trim().length < 5) return;
    setSaving(true);
    try {
      setOrder(await cancelSellerOrder(order.id, cancelReason.trim()));
      setCancelOpen(false);
      setCancelReason("");
    } catch (err: any) {
      Alert.alert("Could Not Cancel", err?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error || !order) return <View style={styles.center}><Text style={styles.errorText}>{error || "Order not found."}</Text><ButtonComponent title="Try Again" onPress={loadOrder} variant="secondary" style={styles.retry} /></View>;

  const canAct = order.status === "pending";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View><Text style={styles.title}>Order {order.id.slice(0, 8)}</Text><Text style={styles.date}>{new Date(order.createdAt).toLocaleString()}</Text>{lastUpdated ? <Text style={styles.updated}>Updated {lastUpdated.toLocaleTimeString()}</Text> : null}</View>
        <OrderStatusBadge status={order.status} />
      </View>

      {error ? <Text style={styles.refreshError}>{error}</Text> : null}

      <CardComponent style={styles.card}>
        <Text style={styles.cardTitle}>Items</Text>
        <OrderItemsList items={order.items} />
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>{money(order.totalAmount)}</Text></View>
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.cardTitle}>Order details</Text>
        <Text style={styles.detail}>Buyer reference: {order.buyerId.slice(0, 8)}</Text>
        {order.checkoutId ? <Text style={styles.detail}>Checkout: {order.checkoutId.slice(0, 8)}</Text> : null}
        {order.expiresAt && order.status === "pending" ? <Text style={styles.expiry}>Pickup code expires: {new Date(order.expiresAt).toLocaleString()}</Text> : null}
        {order.cancellationReason ? <Text style={styles.detail}>Reason: {order.cancellationReason}</Text> : null}
      </CardComponent>

      <SellerOrderCommunication orderId={order.id} />

      <ButtonComponent title="Report Order" onPress={() => setReportOpen(true)} variant="secondary" icon={<AlertTriangle size={18} color={colors.primary} />} style={styles.reportButton} />

      {canAct ? (
        <>
          <ButtonComponent title="Scan Buyer QR" onPress={() => router.push({ pathname: "/(app)/orders/scan", params: { orderId: order.id } })} icon={<Camera size={18} color={colors.white} />} />
          <ButtonComponent title="Cancel Order" onPress={() => setCancelOpen(true)} variant="destructive" style={styles.cancelButton} />
        </>
      ) : null}

      <Modal visible={cancelOpen} transparent animationType="slide" onRequestClose={() => setCancelOpen(false)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <View style={styles.modalHeader}><Text style={styles.cardTitle}>Cancel order</Text><Pressable onPress={() => setCancelOpen(false)}><X size={22} color={colors.textMuted} /></Pressable></View>
          <Text style={styles.detail}>Tell the buyer why this order cannot be handed over.</Text>
          <TextInput value={cancelReason} onChangeText={setCancelReason} placeholder="Reason" multiline style={styles.reasonInput} />
          <ButtonComponent title="Save Cancellation" onPress={handleCancel} loading={saving} disabled={cancelReason.trim().length < 5} variant="destructive" />
        </View></View>
      </Modal>
      <SellerOrderReportModal orderId={order.id} visible={reportOpen} onClose={() => setReportOpen(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.base, backgroundColor: colors.background },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  date: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  updated: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  refreshError: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.warning, marginBottom: spacing.base },
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  totalRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  total: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  detail: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  expiry: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.warning, marginTop: spacing.sm },
  errorText: { fontFamily: fonts.body.medium, color: colors.error, textAlign: "center" },
  retry: { marginTop: spacing.md },
  cancelButton: { marginTop: spacing.sm },
  reportButton: { marginBottom: spacing.base },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reasonInput: { minHeight: 100, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, marginVertical: spacing.base, fontFamily: fonts.body.regular, fontSize: 14, textAlignVertical: "top", color: colors.text },
});
