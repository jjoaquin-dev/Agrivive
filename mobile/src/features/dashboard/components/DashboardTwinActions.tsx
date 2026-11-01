import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { QrCode, Plus } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing, typography } from "../../../theme";

interface DashboardTwinActionsProps {
  onAddProduct: () => void;
  onScanQR: () => void;
}

export const DashboardTwinActions: React.FC<DashboardTwinActionsProps> = ({
  onAddProduct,
  onScanQR,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Card: Add Vegetables */}
      <Pressable
        onPress={onAddProduct}
        accessibilityRole="button"
        accessibilityLabel="Add vegetables listing"
        style={({ pressed }) => [styles.primaryCard, pressed && styles.cardPressed]}
      >
        <View style={styles.textWrap}>
          <Text style={styles.primaryTitle}>Add Vegetables</Text>
          <Text style={styles.primarySubtitle}>
            Put up what you have left to sell.
          </Text>
        </View>
        <View style={styles.plusWrap}>
          <Plus size={22} color={colors.white} strokeWidth={2.4} />
        </View>
      </Pressable>

      {/* Secondary Card: Scan Pickup QR */}
      <Pressable
        onPress={onScanQR}
        accessibilityRole="button"
        accessibilityLabel="Scan buyer pickup QR pass"
        style={({ pressed }) => [styles.secondaryCard, pressed && styles.cardPressed]}
      >
        <View style={styles.textWrap}>
          <Text style={styles.secondaryTitle}>Scan Pickup QR</Text>
          <Text style={styles.secondaryHint}>Check a buyer's pickup code.</Text>
        </View>
        <View style={styles.qrWrap}>
          <QrCode size={22} color={colors.primary} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.sm, marginBottom: spacing.lg },
  primaryCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, backgroundColor: colors.primary, borderRadius: radii.card, padding: spacing.base, minHeight: 72, ...shadows.card },
  secondaryCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, minHeight: 72, ...shadows.card },
  textWrap: { flex: 1 },
  primaryTitle: { ...typography.sectionHeading, fontFamily: fonts.heading.bold, color: colors.white },
  primarySubtitle: { ...typography.labelSmall, color: "rgba(255, 255, 255, 0.88)", marginTop: 2 },
  secondaryTitle: { ...typography.sectionHeading, fontFamily: fonts.heading.bold, color: colors.text },
  secondaryHint: { ...typography.labelSmall, color: colors.textMuted, marginTop: 2 },
  plusWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255, 255, 255, 0.2)", alignItems: "center", justifyContent: "center" },
  qrWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  cardPressed: { transform: [{ scale: 0.99 }], opacity: 0.92 },
});
