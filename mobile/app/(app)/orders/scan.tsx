import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../../../src/theme";
import { formatAmount, formatMoney } from "../../../src/features/orders/orderFormat";
import {
  fetchSellerOrder,
  scanSellerOrder,
  type ScanOrderItemAdjustment,
} from "../../../src/features/orders/api/seller-orders";
import { OrderHandoverSheet } from "../../../src/features/orders/components/OrderHandoverSheet";
import { OrderPickupDone, type PickupDoneLine } from "../../../src/features/orders/components/OrderPickupDone";
import { OrderScanOverlay, type ScanProblem } from "../../../src/features/orders/components/OrderScanOverlay";
import { OrderScanPermission } from "../../../src/features/orders/components/OrderScanPermission";
import type { SellerOrder } from "../../../src/features/orders/types";
import { safeBack } from "../../../src/utils/safeBack";

export default function SellerOrderScanScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scanError, setScanError] = useState<ScanProblem | null>(null);
  const [done, setDone] = useState<{ id: string; total: string; reference: string; lines: PickupDoneLine[] } | null>(null);
  const [handoverError, setHandoverError] = useState<string | null>(null);

  const [activePayload, setActivePayload] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<SellerOrder | null>(null);

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanning || loadingOrder || submitting) return;
    setScanning(false);
    setScanError(null);

    const parts = data.split(".");
    const targetOrderId = parts.length === 3 ? parts[1] : orderId;

    if (!targetOrderId) {
      setScanError({ title: "Invalid Code", message: "This is not an Agrivive pickup code." });
      return;
    }

    try {
      setLoadingOrder(true);
      const order = await fetchSellerOrder(targetOrderId);
      setActivePayload(data);
      setActiveOrder(order);
    } catch (err: any) {
      setScanError({ title: "Could Not Check Code", message: err?.message || "Please check your connection and try again." });
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleConfirmHandover = async (adjustments: ScanOrderItemAdjustment[]) => {
    if (!activePayload) return;
    setSubmitting(true);
    setHandoverError(null);
    try {
      const completed = await scanSellerOrder({
        qrPayload: activePayload,
        items: adjustments,
      });
      const lines: PickupDoneLine[] = (activeOrder?.items ?? []).map((item) => {
        const reserved = Number(item.quantity ?? 0);
        const given = adjustments.find((a) => a.itemId === item.id)?.dispensedQuantity ?? reserved;
        const back = reserved - given;
        return {
          id: item.id,
          label: `${item.productName || "Produce"} given: ${formatAmount(given, item.scalingType)}`,
          returned: back > 0.001 ? `${formatAmount(back, item.scalingType)} returned to stock` : null,
        };
      });
      setDone({ id: completed.id, total: formatMoney(completed.totalAmount), reference: completed.id.slice(0, 8).toUpperCase(), lines });
      setActiveOrder(null);
      setActivePayload(null);
      setHandoverError(null);
    } catch (err: any) {
      setHandoverError(err?.message || "Could not complete pickup.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!permission) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  if (!permission.granted) {
    return <OrderScanPermission onAllow={requestPermission} onDismiss={() => safeBack(router)} />;
  }

  if (done) {
    return (
      <OrderPickupDone
        total={done.total}
        reference={done.reference}
        lines={done.lines}
        onView={() => router.replace({ pathname: "/(app)/orders/[id]", params: { id: done.id } })}
        onScanAnother={() => { setDone(null); setScanning(true); }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
      />
      <OrderScanOverlay
        checking={loadingOrder}
        problem={scanError}
        onBack={() => safeBack(router)}
        onScanAgain={() => { setScanError(null); setScanning(true); }}
      />

      <OrderHandoverSheet
        visible={Boolean(activeOrder)}
        order={activeOrder}
        submitting={submitting}
        error={handoverError}
        onClose={() => {
          setActiveOrder(null);
          setActivePayload(null);
          setHandoverError(null);
          setScanning(true);
        }}
        onConfirm={handleConfirmHandover}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
});
