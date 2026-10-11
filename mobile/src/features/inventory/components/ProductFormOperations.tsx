import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Scale, Coins, AlertTriangle } from "lucide-react-native";
import { InputComponent } from "../../../components/InputComponent";
import { colors } from "../../../theme";
import { SCALING_TYPES, type ProductScalingType } from "../types";
import type { ProductFormErrors } from "../validation";
import { styles } from "./ProductFormStyles";

interface ProductFormOperationsProps {
  mode: "create" | "edit";
  scalingType: ProductScalingType;
  setScalingType: (value: ProductScalingType) => void;
  productQty: string;
  setProductQty: (value: string) => void;
  productPrice: string;
  setProductPrice: (value: string) => void;
  priceReductionPercent: string;
  setPriceReductionPercent: (value: string) => void;
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
  priceReductionPercent, setPriceReductionPercent, minimumPrice, setMinimumPrice,
  lowStockThreshold, setLowStockThreshold, isMarketable, setIsMarketable, errors, clearFieldError,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Selling Unit</Text>
      <Text style={styles.sectionHint}>{mode === "edit" ? "Unit cannot be changed once product is created." : "How do you price and measure this item?"}</Text>
      <View style={styles.unitRow}>
        {SCALING_TYPES.map((unit) => {
          const isSelected = scalingType === unit.value;
          return (
            <Pressable
              key={unit.value}
              disabled={mode === "edit"}
              onPress={() => { setScalingType(unit.value); clearFieldError("scalingType"); }}
              accessibilityRole="button"
              accessibilityLabel={unit.label}
              style={[styles.unitChip, isSelected && styles.unitChipSelected, mode === "edit" && styles.unitChipDisabled]}
            >
              <Scale size={16} color={isSelected ? colors.white : colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.unitChipText, isSelected && styles.unitChipTextSelected]}>{unit.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {errors.scalingType ? <Text style={styles.fieldError}>{errors.scalingType}</Text> : null}
    </View>
    {mode === "create" ? (
      <InputComponent
        label={`Initial Quantity (${scalingType === "kilo" ? "kg" : scalingType})`}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={productQty}
        error={errors.productQty}
        leftIcon={<Scale size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setProductQty(text); clearFieldError("productQty"); }}
      />
    ) : null}
    <InputComponent
      label={`Selling Price (₱ per ${scalingType === "kilo" ? "kg" : scalingType})`}
      placeholder="0.00"
      keyboardType="decimal-pad"
      value={productPrice}
      error={errors.productPrice}
      leftIcon={<Coins size={18} color={colors.textMuted} />}
      onChangeText={(text) => { setProductPrice(text); clearFieldError("productPrice"); }}
    />
    <View style={styles.pricingSection}>
      <Text style={styles.sectionLabel}>Automatic price reduction</Text>
      <Text style={styles.sectionHint}>Optional: lower the price after each 12-hour period. Enter 0 to keep one price.</Text>
      <InputComponent
        label="Reduction every 12 hours (%)"
        placeholder="0"
        keyboardType="decimal-pad"
        value={priceReductionPercent}
        error={errors.priceReductionPercent}
        leftIcon={<Coins size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setPriceReductionPercent(text); clearFieldError("priceReductionPercent"); }}
      />
      <InputComponent
        label="Lowest selling price"
        placeholder="e.g. 45.00"
        keyboardType="decimal-pad"
        value={minimumPrice}
        error={errors.minimumPrice}
        leftIcon={<Coins size={18} color={colors.textMuted} />}
        onChangeText={(text) => { setMinimumPrice(text); clearFieldError("minimumPrice"); }}
      />
    </View>
    <InputComponent
      label={`Alert me when amount reaches (${scalingType === "kilo" ? "kg" : scalingType})`}
      placeholder="e.g. 5.00"
      keyboardType="decimal-pad"
      value={lowStockThreshold}
      error={errors.lowStockThreshold}
      leftIcon={<AlertTriangle size={18} color={colors.textMuted} />}
      onChangeText={(text) => { setLowStockThreshold(text); clearFieldError("lowStockThreshold"); }}
    />
    <View style={styles.switchRow}>
      <View style={styles.switchInfo}>
        <Text style={styles.switchLabel}>Available to Buyers</Text>
        <Text style={styles.switchSubtext}>Turn off when buyers cannot order this item.</Text>
      </View>
      <Switch value={isMarketable} onValueChange={setIsMarketable} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
    </View>
  </>
);
