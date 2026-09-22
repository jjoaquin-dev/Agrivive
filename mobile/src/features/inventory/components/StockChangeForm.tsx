import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { ArrowUpRight, ArrowDownRight, AlertCircle, Check } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { hasTwoDecimalsOrLess } from "../validation";
import type { Product } from "../types";

export type StockActionType = "in" | "out";

interface StockChangeFormProps {
  product: Product;
  initialType?: StockActionType;
  onSubmit: (delta: number, reason: string) => Promise<void>;
  loading: boolean;
}

const TAKE_AWAY_REASONS = [
  "Sold offline",
  "Damaged",
  "Spoiled",
  "Returned by buyer",
  "Fix the amount",
];

export const StockChangeForm: React.FC<StockChangeFormProps> = ({
  product,
  initialType = "in",
  onSubmit,
  loading,
}) => {
  const [actionType, setActionType] = useState<StockActionType>(initialType);
  const [quantityStr, setQuantityStr] = useState("");
  const [reason, setReason] = useState(
    initialType === "in" ? "New harvest or added produce" : TAKE_AWAY_REASONS[0],
  );
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currentQty = parseFloat(product.productQty as string) || 0;
  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;

  // Compute live projected quantity
  const inputQty = parseFloat(quantityStr) || 0;
  const projectedQty = useMemo(() => {
    if (isNaN(inputQty) || inputQty <= 0) return currentQty;
    if (actionType === "in") return currentQty + inputQty;
    return currentQty - inputQty;
  }, [currentQty, inputQty, actionType]);

  const isExcessStockOut = actionType === "out" && inputQty > currentQty;

  const handleTypeChange = (type: StockActionType) => {
    setActionType(type);
    setError(null);
    if (type === "in") {
      setReason("New harvest or added produce");
    } else {
      setReason(TAKE_AWAY_REASONS[0]);
    }
  };

  const handleConfirm = async () => {
    setError(null);

    if (isNaN(inputQty) || inputQty <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    if (!hasTwoDecimalsOrLess(inputQty)) {
      setError("Quantity may have at most two decimal places.");
      return;
    }

    if (actionType === "out" && inputQty > currentQty) {
      setError(`Cannot remove more than the available ${currentQty.toFixed(2)} ${unitLabel}.`);
      return;
    }

    const finalReason = customReason.trim() ? customReason.trim() : reason;
    if (!finalReason) {
      setError("Please select or enter a reason for this stock change.");
      return;
    }

    const delta = actionType === "in" ? inputQty : -inputQty;

    try {
      await onSubmit(delta, finalReason);
    } catch (err: any) {
      setError(err?.message || "Could not save the amount change. Please try again.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Action Type Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          onPress={() => handleTypeChange("in")}
          accessibilityRole="tab"
          accessibilityState={{ selected: actionType === "in" }}
          style={[styles.tab, actionType === "in" && styles.tabActiveIn]}
        >
          <ArrowUpRight
            size={18}
            color={actionType === "in" ? colors.white : colors.success}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, actionType === "in" && styles.tabTextActive]}>
            Add More
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleTypeChange("out")}
          accessibilityRole="tab"
          accessibilityState={{ selected: actionType === "out" }}
          style={[styles.tab, actionType === "out" && styles.tabActiveOut]}
        >
          <ArrowDownRight
            size={18}
            color={actionType === "out" ? colors.white : colors.error}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, actionType === "out" && styles.tabTextActive]}>
            Take Away
          </Text>
        </Pressable>
      </View>

      {/* 2. Stock Projection Card */}
      <View style={styles.previewCard}>
        <View style={styles.previewRow}>
          <View style={styles.previewCol}>
            <Text style={styles.previewLabel}>Current Amount</Text>
            <Text style={styles.previewValue}>
              {currentQty.toFixed(2)} {unitLabel}
            </Text>
          </View>
          <View style={styles.arrowCol}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
          <View style={styles.previewCol}>
            <Text style={styles.previewLabel}>New Amount</Text>
            <Text
              style={[
                styles.previewValue,
                projectedQty < 0 ? styles.previewValueDanger : styles.previewValueSuccess,
              ]}
            >
              {projectedQty.toFixed(2)} {unitLabel}
            </Text>
          </View>
        </View>

        {isExcessStockOut ? (
          <View style={styles.warningBox}>
            <AlertCircle size={16} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.warningText}>
              ⚠ Available stock is only {currentQty.toFixed(2)} {unitLabel}.
            </Text>
          </View>
        ) : null}
      </View>

      {/* 3. Quantity Input */}
      <InputComponent
        label={`${actionType === "in" ? "Quantity to Add" : "Quantity to Deduct"} (${unitLabel})`}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={quantityStr}
        error={error && !error.includes("reason") ? error : undefined}
        onChangeText={(text) => {
          setQuantityStr(text);
          if (error) setError(null);
        }}
      />

      {/* 4. Reason Selection (Required when taking amount away) */}
      {actionType === "out" ? (
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
                    if (error) setError(null);
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
              if (error) setError(null);
            }}
          />
        </View>
      ) : (
        <InputComponent
          label="Notes (Optional)"
          placeholder="e.g. Fresh harvest from Toril farm"
          value={customReason || reason}
          onChangeText={setCustomReason}
        />
      )}

      {/* 5. Submit Button */}
      <ButtonComponent
        title={
          loading
            ? "Saving..."
            : actionType === "in"
            ? "Save Added Amount"
            : "Save Removed Amount"
        }
        variant={actionType === "out" ? "destructive" : "primary"}
        icon={<Check size={18} color={colors.white} />}
        onPress={handleConfirm}
        loading={loading}
        disabled={loading || isExcessStockOut}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: touchTargets.min,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActiveIn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabActiveOut: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  tabText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewCol: {
    flex: 1,
    alignItems: "center",
  },
  arrowCol: {
    paddingHorizontal: spacing.sm,
  },
  arrowIcon: {
    fontSize: 20,
    color: colors.textMuted,
  },
  previewLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  previewValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
  },
  previewValueSuccess: {
    color: colors.success,
  },
  previewValueDanger: {
    color: colors.error,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  warningText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
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
  submitButton: {
    marginTop: spacing.md,
  },
  submitButtonOut: {
    backgroundColor: colors.error,
  },
});
