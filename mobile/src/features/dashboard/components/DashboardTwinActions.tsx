import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Plus, QrCode } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

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
      <Pressable
        onPress={onAddProduct}
        accessibilityRole="button"
        accessibilityLabel="Add produce product"
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <Plus size={18} color={colors.white} style={styles.buttonIcon} />
        <Text style={styles.primaryText}>Add Product</Text>
      </Pressable>

      <Pressable
        onPress={onScanQR}
        accessibilityRole="button"
        accessibilityLabel="Scan buyer QR code pass"
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <QrCode size={18} color={colors.primary} style={styles.buttonIcon} />
        <Text style={styles.secondaryText}>Scan QR Pass</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonIcon: {
    marginRight: 6,
  },
  primaryText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  secondaryText: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
});
