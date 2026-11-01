import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Scale, Coins } from "lucide-react-native";
import { InputComponent } from "../../../components/InputComponent";
import { colors } from "../../../theme";
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
  isMarketable: boolean;
  setIsMarketable: (value: boolean) => void;
  errors: ProductFormErrors;
  clearFieldError: (field: keyof ProductFormErrors) => void;
}

export const ProductFormOperations: React.FC<ProductFormOperationsProps> = ({
  mode, scalingType, setScalingType, productQty, setProductQty, productPrice, setProductPrice,
  priceReductionAmount, setPriceReductionAmount, minimumPrice, setMinimumPrice,
  isMarketable, setIsMarketable, errors, clearFieldError,
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
      <Text style={styles.sectionLabel}>Price drop (optional)</Text>
      <Text style={styles.sectionHint}>After your Boost post, the price goes down by this amount every 6 hours. Leave it empty to keep one price.</Text>
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
    </View>
    <View style={styles.switchRow}>
      <View style={styles.switchInfo}>
        <Text style={styles.switchLabel}>Available to Buyers</Text>
        <Text style={styles.switchSubtext}>Turn off when buyers cannot order this item.</Text>
      </View>
      <Switch value={isMarketable} onValueChange={setIsMarketable} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
    </View>
  </>
);
