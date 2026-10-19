import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, PlusCircle, RotateCcw } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

interface StockFreshnessWarningModalProps {
  visible: boolean;
  productName: string;
  onPostNewHarvest: () => void;
  onProceedAnyway: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const StockFreshnessWarningModal: React.FC<StockFreshnessWarningModalProps> = ({
  visible,
  productName,
  onPostNewHarvest,
  onProceedAnyway,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={28} color={colors.terracotta} />
          </View>

          <Text style={styles.title}>This Batch is Over 12 Hours Old</Text>
          <Text style={styles.description}>
            This listing for <Text style={styles.highlight}>{productName}</Text> was posted over 12 hours ago (Freshness is 0%).
          </Text>

          <View style={styles.bulletBox}>
            <Text style={styles.bulletText}>• Adding new produce here keeps the old batch date and low visibility ranking.</Text>
            <Text style={styles.bulletText}>• It will be sold at this batch's current discounted price.</Text>
            <Text style={styles.bulletText}>• To get 100% Freshness and top placement, post it as a fresh harvest instead.</Text>
          </View>

          <View style={styles.actions}>
            <ButtonComponent
              title="Post as New Fresh Harvest"
              variant="primary"
              icon={<PlusCircle size={18} color={colors.white} />}
              onPress={onPostNewHarvest}
              style={styles.primaryButton}
            />
            <ButtonComponent
              title="Add to Old Batch Anyway"
              variant="secondary"
              icon={<RotateCcw size={18} color={colors.primary} />}
              onPress={onProceedAnyway}
              loading={loading}
              style={styles.secondaryButton}
            />
            <Pressable onPress={onCancel} style={styles.cancelLink} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.base,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: "rgba(201, 120, 80, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  highlight: {
    fontFamily: fonts.body.semiBold,
    color: colors.text,
  },
  bulletBox: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: radii.input,
    padding: spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  bulletText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
  },
  primaryButton: {
    width: "100%",
    minHeight: 48,
  },
  secondaryButton: {
    width: "100%",
    minHeight: 48,
  },
  cancelLink: {
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  cancelText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
});
