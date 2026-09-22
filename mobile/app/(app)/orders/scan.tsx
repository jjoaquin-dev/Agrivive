import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";
import { scanSellerOrder } from "../../../src/features/orders/api/seller-orders";

export default function SellerOrderScanScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanning || submitting) return;
    setScanning(false);
    setSubmitting(true);
    setError(null);
    try {
      const order = await scanSellerOrder(data);
      router.replace({ pathname: "/(app)/orders/[id]", params: { id: order.id || orderId || "" } });
    } catch (err: any) {
      setError(err?.message || "This QR code could not be accepted.");
      setScanning(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!permission) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  if (!permission.granted) {
    return <View style={styles.center}><Camera size={42} color={colors.primary} /><Text style={styles.title}>Camera access is needed</Text><Text style={styles.text}>Allow camera access to scan a buyer’s pickup code.</Text><ButtonComponent title="Allow Camera" onPress={requestPermission} style={styles.action} /></View>;
  }

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
      />
      <View style={styles.overlay}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Close scanner" style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </Pressable>
        <View style={styles.instruction}><Text style={styles.instructionTitle}>Scan buyer QR</Text><Text style={styles.instructionText}>Place the code inside the box.</Text></View>
        <View style={styles.scanBox} />
        {submitting ? <ActivityIndicator color={colors.white} size="large" /> : null}
        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Scan Again" onPress={() => { setError(null); setScanning(true); }} variant="secondary" /></View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, backgroundColor: colors.background },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text, marginTop: spacing.base, textAlign: "center" },
  text: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  action: { marginTop: spacing.base },
  overlay: { flex: 1, alignItems: "center", padding: spacing.base, backgroundColor: "rgba(0,0,0,0.24)" },
  backButton: { alignSelf: "flex-start", width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center" },
  instruction: { marginTop: spacing.xl, alignItems: "center" },
  instructionTitle: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.white },
  instructionText: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.white, marginTop: spacing.xs },
  scanBox: { width: 260, height: 260, borderWidth: 3, borderColor: colors.white, borderRadius: radii.card, marginTop: spacing.xxl, marginBottom: spacing.xxl },
  errorBox: { width: "100%", backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md },
  errorText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.error, marginBottom: spacing.sm, textAlign: "center" },
});
