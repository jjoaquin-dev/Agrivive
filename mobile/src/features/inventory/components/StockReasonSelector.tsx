import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { InputComponent } from "../../../components/InputComponent";
import { colors, fonts, radii, spacing } from "../../../theme";

export const TAKE_AWAY_REASONS = [
  "Sold offline",
  "Damaged",
  "Spoiled",
  "Returned by buyer",
  "Fix the amount",
];

interface StockReasonSelectorProps {
  actionType: "in" | "out";
  reason: string;
  setReason: (reason: string) => void;
  customReason: string;
  setCustomReason: (customReason: string) => void;
  error?: string | null;
  clearError: () => void;
}

export const StockReasonSelector: React.FC<StockReasonSelectorProps> = ({
  actionType,
  reason,
  setReason,
  customReason,
  setCustomReason,
  error,
  clearError,
}) => {
  if (actionType === "in") {
    return (
      <InputComponent
        label="Notes (Optional)"
        placeholder="e.g. Fresh harvest from Toril farm"
        value={customReason || reason}
        onChangeText={setCustomReason}
      />
    );
  }

  return (
    <View style={styles.reasonSection}>
      <Text style={styles.reasonTitle}>Why are you taking it away?</Text>
      <Text style={styles.reasonSub}>
        Helps track damage, spoilage, or offline sales accurately
      </Text>
      <View style={styles.reasonChipsGrid}>
        {TAKE_AWAY_REASONS.map((r) => {
          const isSelected = reason === r && !customReason;
          return (
            <Pressable
              key={r}
              onPress={() => {
                setReason(r);
                setCustomReason("");
                clearError();
              }}
              accessibilityRole="button"
              accessibilityLabel={r}
              style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
            >
              <Text
                style={[
                  styles.reasonChipText,
                  isSelected && styles.reasonChipTextSelected,
                ]}
              >
                {r}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <InputComponent
        label="Or enter custom reason"
        placeholder="e.g. Donation to community pantry"
        value={customReason}
        error={error && error.includes("reason") ? error : undefined}
        onChangeText={(t) => {
          setCustomReason(t);
          clearError();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reasonSection: {
    marginTop: spacing.sm,
  },
  reasonTitle: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  reasonSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  reasonChipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  reasonChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
    justifyContent: "center",
  },
  reasonChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reasonChipText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  reasonChipTextSelected: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
});
