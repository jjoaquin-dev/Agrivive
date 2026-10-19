import React, { useState, useMemo } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, View, Text } from "react-native";
import { AlertTriangle, Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../theme";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { StockActionTabs, type StockActionType } from "./StockActionTabs";
import { StockProjectionCard } from "./StockProjectionCard";
import { StockReasonSelector, TAKE_AWAY_REASONS } from "./StockReasonSelector";
import { StockFreshnessWarningModal } from "./StockFreshnessWarningModal";
import { styles } from "./StockChangeFormStyles";
import { hasTwoDecimalsOrLess } from "../validation";
import type { Product } from "../types";

export type { StockActionType } from "./StockActionTabs";

interface StockChangeFormProps {
  product: Product;
  initialType?: StockActionType;
  onSubmit: (delta: number, reason: string) => Promise<void>;
  loading: boolean;
}

export const StockChangeForm: React.FC<StockChangeFormProps> = ({
  product,
  initialType = "in",
  onSubmit,
  loading,
}) => {
  const router = useRouter();
  const [actionType, setActionType] = useState<StockActionType>(initialType);
  const [quantityStr, setQuantityStr] = useState("");
  const [reason, setReason] = useState(
    initialType === "in" ? "New harvest or added produce" : TAKE_AWAY_REASONS[0],
  );
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAgingModal, setShowAgingModal] = useState(false);

  const currentQty = parseFloat(product.productQty as string) || 0;
  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const inputQty = parseFloat(quantityStr) || 0;

  const isAgingBatch = useMemo(() => {
    if (actionType !== "in" || currentQty <= 0 || !product.publishedAt) return false;
    const publishedTime = new Date(product.publishedAt).getTime();
    if (isNaN(publishedTime)) return false;
    const hoursElapsed = (Date.now() - publishedTime) / (1000 * 60 * 60);
    return hoursElapsed >= 12;
  }, [actionType, currentQty, product.publishedAt]);

  const projectedQty = useMemo(() => {
    if (isNaN(inputQty) || inputQty <= 0) return currentQty;
    if (actionType === "in") return currentQty + inputQty;
    return currentQty - inputQty;
  }, [currentQty, inputQty, actionType]);

  const isExcessStockOut = actionType === "out" && inputQty > currentQty;

  const handleTypeChange = (type: StockActionType) => {
    setActionType(type);
    setError(null);
    setReason(type === "in" ? "New harvest or added produce" : TAKE_AWAY_REASONS[0]);
  };

  const executeSubmit = async () => {
    const delta = actionType === "in" ? inputQty : -inputQty;
    const finalReason = customReason.trim() ? customReason.trim() : reason;
    try {
      await onSubmit(delta, finalReason);
      setShowAgingModal(false);
    } catch (err: any) {
      setError(err?.message || "Could not save the amount change. Please try again.");
      setShowAgingModal(false);
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

    if (isAgingBatch) {
      setShowAgingModal(true);
      return;
    }

    await executeSubmit();
  };

  const handlePostNewHarvest = () => {
    setShowAgingModal(false);
    router.push({
      pathname: "/(app)/inventory/create",
      params: {
        catalogId: product.vegetableCatalogId || "",
        unit: product.scalingType,
        name: product.productName,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <StockActionTabs actionType={actionType} onChange={handleTypeChange} />

        <StockProjectionCard
          currentQty={currentQty}
          projectedQty={projectedQty}
          unitLabel={unitLabel}
          isExcessStockOut={isExcessStockOut}
        />

        {isAgingBatch ? (
          <View style={styles.agingBanner}>
            <AlertTriangle size={16} color={colors.terracotta} />
            <Text style={styles.agingBannerText}>
              This batch is over 12 hours old (0% Freshness). Adding produce here will keep the old batch age and discounted price.
            </Text>
          </View>
        ) : null}

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

        <StockReasonSelector
          actionType={actionType}
          reason={reason}
          setReason={setReason}
          customReason={customReason}
          setCustomReason={setCustomReason}
          error={error}
          clearError={() => setError(null)}
        />

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

        <StockFreshnessWarningModal
          visible={showAgingModal}
          productName={product.productName}
          onPostNewHarvest={handlePostNewHarvest}
          onProceedAnyway={executeSubmit}
          onCancel={() => setShowAgingModal(false)}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
