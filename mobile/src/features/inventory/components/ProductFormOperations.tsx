import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Scale, Coins, Lock, TrendingDown, BellRing } from "lucide-react-native";
import { InputComponent } from "../../../components/InputComponent";
import { colors, spacing } from "../../../theme";
import { SCALING_TYPES, type ProductScalingType } from "../types";
import type { ProductFormErrors } from "../validation";
import { styles } from "./ProductFormStyles";
import { PriceDropPreview } from "./PriceDropPreview";

interface ProductFormOperationsProps {
  mode: "create" | "edit";
  scalingType: ProductScalingType;
  setScalingType: (value: ProductScalingType) => void;
  productQty: string;
  setProductQty: (value: string) => void;
  productPrice: string;
  setProductPrice: (value: string) => void;
  priceReductionAmount: string;
  setPriceReductionAmount: (value: string) => void;
  minimumPrice: string;
  setMinimumPrice: (value: string) => void;
  lowStockThreshold: string;
  setLowStockThreshold: (value: string) => void;
  isMarketable: boolean;
  setIsMarketable: (value: boolean) => void;
  errors: ProductFormErrors;
  clearFieldError: (field: keyof ProductFormErrors) => void;
}

export const ProductFormOperations: React.FC<ProductFormOperationsProps> = ({
  mode, scalingType, setScalingType, productQty, setProductQty, productPrice, setProductPrice,
  priceReductionAmount, setPriceReductionAmount, minimumPrice, setMinimumPrice,
  lowStockThreshold, setLowStockThreshold, isMarketable, setIsMarketable, errors, clearFieldError,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Selling unit</Text>
      {mode === "edit" ? (
        <View style={styles.lockedField}>
          <Text style={styles.lockedValue}>{SCALING_TYPES.find((unit) => unit.value === scalingType)?.label}</Text>
          <View style={styles.lockedTag}>
            <Lock size={14} color={colors.textMuted} />
            <Text style={styles.lockedTagText}>Locked</Text>
          </View>
        </View>
      ) : (
        <View style={styles.segmented}>
          {SCALING_TYPES.map((unit) => {
            const isSelected = scalingType === unit.value;
            return (
              <Pressable
                key={unit.value}
                onPress={() => { setScalingType(unit.value); clearFieldError("scalingType"); }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={unit.label}
                style={[styles.segment, isSelected && styles.segmentSelected]}
              >
                <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>{unit.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      {mode === "edit" ? <Text style={styles.sectionHint}>Unit cannot be changed once product is created.</Text> : null}
      {errors.scalingType ? <Text style={styles.fieldError}>{errors.scalingType}</Text> : null}
    </View>
    {mode === "create" ? (
      <InputComponent
        label={`Starting amount (${scalingType === "kilo" ? "kg" : scalingType})`}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={productQty}
        error={errors.productQty}
        leftIcon={<Scale size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setProductQty(text); clearFieldError("productQty"); }}
      />
    ) : null}
    <InputComponent
      label={`Price per ${scalingType === "kilo" ? "kg" : scalingType} (₱)`}
      placeholder="0.00"
      keyboardType="decimal-pad"
      value={productPrice}
      error={errors.productPrice}
      leftIcon={<Coins size={18} color={colors.textMuted} />}
      onChangeText={(text) => { setProductPrice(text); clearFieldError("productPrice"); }}
    />
    {mode === "edit" ? <View style={styles.pricingSection}>
      <View style={styles.pricingHeader}>
        <View style={styles.pricingIcon}><TrendingDown size={16} color={colors.primary} /></View>
        <Text style={styles.sectionLabel}>Price drop (optional)</Text>
      </View>
      <Text style={[styles.sectionHint, { marginBottom: spacing.md }]}>If your produce is Priority Boost when it is posted, the price goes down by this amount every 6 hours. Leave it empty to keep one price.</Text>
      <InputComponent
        label="Drop by (₱) every 6 hours"
        placeholder="e.g. 1.25"
        keyboardType="decimal-pad"
        value={priceReductionAmount}
        error={errors.priceReductionAmount}
        leftIcon={<Coins size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setPriceReductionAmount(text); clearFieldError("priceReductionAmount"); }}
      />
      <InputComponent
        label="Final price (₱)"
        placeholder="e.g. 5.00"
        keyboardType="decimal-pad"
        value={minimumPrice}
        error={errors.minimumPrice}
        hint="The price never goes lower than this. We tell you when it gets here."
        leftIcon={<Coins size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setMinimumPrice(text); clearFieldError("minimumPrice"); }}
      />
      <PriceDropPreview price={productPrice} dropAmount={priceReductionAmount} finalPrice={minimumPrice} />
    </View> : null}
    <InputComponent
      label="Alert me when stock is low (optional)"
      placeholder="e.g. 5.00"
      keyboardType="decimal-pad"
      value={lowStockThreshold}
      error={errors.lowStockThreshold}
      hint={`We send you a notice when the amount left reaches this number (${scalingType === "kilo" ? "kg" : scalingType}).`}
      leftIcon={<BellRing size={18} color={colors.textMuted} />}
      onChangeText={(text) => { setLowStockThreshold(text); clearFieldError("lowStockThreshold"); }}
    />
    <View style={styles.switchRow}>
      <View style={styles.switchInfo}>
        <Text style={styles.switchLabel}>Available to buyers</Text>
        <Text style={styles.switchSubtext}>Turn off when buyers cannot order this item.</Text>
      </View>
      <Switch value={isMarketable} onValueChange={setIsMarketable} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
    </View>
  </>
);
