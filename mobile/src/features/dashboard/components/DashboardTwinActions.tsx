import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { QrCode, ChevronRight, ArrowRight, Sprout } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

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
      {/* Primary Card: Add Surplus Product */}
      <Pressable
        onPress={onAddProduct}
        accessibilityRole="button"
        accessibilityLabel="Add surplus vegetable listing"
        style={({ pressed }) => [styles.primaryCard, pressed && styles.cardPressed]}
      >
        <View style={styles.primaryLeft}>
          <View style={styles.produceIconWrap}>
            <Sprout size={20} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.primaryTitle}>Add Surplus Product</Text>
            <Text style={styles.primarySubtitle}>
              Post bulk or smaller marketable surplus vegetables.
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color="#FFFFFF" />
      </Pressable>

      {/* Secondary Card: Scan Pickup QR */}
      <Pressable
        onPress={onScanQR}
        accessibilityRole="button"
        accessibilityLabel="Scan buyer pickup QR pass"
        style={({ pressed }) => [styles.secondaryCard, pressed && styles.cardPressed]}
      >
        <View style={styles.secondaryLeft}>
          <View style={styles.qrIconWrap}>
            <QrCode size={18} color="#16A34A" />
          </View>
          <Text style={styles.secondaryTitle}>Scan Pickup QR</Text>
        </View>
        <View style={styles.secondaryRight}>
          <Text style={styles.secondaryHint}>Confirm buyer arrival</Text>
          <ArrowRight size={14} color={colors.textMuted} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  primaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0F920F",
    borderRadius: radii.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: spacing.sm,
    gap: 12,
  },
  produceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  primaryTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  primarySubtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.88)",
    marginTop: 2,
    lineHeight: 15,
  },
  secondaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qrIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.text,
  },
  secondaryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  secondaryHint: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
});
