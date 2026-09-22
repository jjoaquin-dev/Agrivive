import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import {
  PRODUCT_CATEGORIES,
  SCALING_TYPES,
  type CreateProductInput,
  type Product,
  type ProductCategory,
  type ProductScalingType,
  type UpdateProductInput,
} from "../types";
import { ProductPhotoField } from "./ProductPhotoField";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import {
  validateCreateProduct,
  validateUpdateProduct,
  type ProductFormErrors,
} from "../validation";
import { Tag, Scale, Coins, AlertTriangle } from "lucide-react-native";

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Product;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  loading: boolean;
  submitButtonText?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialProduct,
  onSubmit,
  loading,
  submitButtonText = mode === "create" ? "Add Product" : "Save Changes",
}) => {
  const [productName, setProductName] = useState(initialProduct?.productName || "");
  const [imagUrl, setImagUrl] = useState(initialProduct?.imagUrl || "");
  const [displayImageUrl, setDisplayImageUrl] = useState(
    initialProduct?.displayImageUrl || initialProduct?.imagUrl || "",
  );
  const [productPrice, setProductPrice] = useState(
    initialProduct?.productPrice ? String(initialProduct.productPrice) : "",
  );
  const [productQty, setProductQty] = useState(
    initialProduct?.productQty ? String(initialProduct.productQty) : "",
  );
  const [productType, setProductType] = useState<ProductCategory>(
    initialProduct?.productType || "Leafy Greens",
  );
  const [scalingType, setScalingType] = useState<ProductScalingType>(
    initialProduct?.scalingType || "kilo",
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialProduct?.lowStockThreshold != null
      ? String(initialProduct.lowStockThreshold)
      : "",
  );
  const [isMarketable, setIsMarketable] = useState(
    initialProduct ? initialProduct.isMarketable : true,
  );

  const [errors, setErrors] = useState<ProductFormErrors>({});

  const clearFieldError = (field: keyof ProductFormErrors) => {
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async () => {
    const numPrice = parseFloat(productPrice);
    const numQty = parseFloat(productQty);
    const numThreshold =
      lowStockThreshold.trim() !== "" ? parseFloat(lowStockThreshold) : undefined;

    if (mode === "create") {
      const payload: CreateProductInput = {
        productName: productName.trim(),
        imagUrl,
        productPrice: numPrice,
        productQty: numQty,
        productType,
        scalingType,
        isMarketable,
        lowStockThreshold: numThreshold,
      };

      const result = validateCreateProduct(payload);
      if (!result.isValid) {
        setErrors(result.errors);
        return;
      }

      try {
        await onSubmit(payload);
      } catch (err: any) {
        if (err?.statusCode === 409 || err?.message?.includes("already listed")) {
          setErrors({
            productName: "A product with this name and unit is already in your inventory.",
          });
        } else {
          setErrors({ general: err?.message || "Failed to create product. Please try again." });
        }
      }
    } else {
      const payload: UpdateProductInput = {
        productName: productName.trim(),
        imagUrl: imagUrl || undefined,
        productPrice: numPrice,
        productType,
        isMarketable,
        lowStockThreshold: numThreshold ?? null,
      };

      const result = validateUpdateProduct(payload);
      if (!result.isValid) {
        setErrors(result.errors);
        return;
      }

      try {
        await onSubmit(payload);
      } catch (err: any) {
        if (err?.statusCode === 409 || err?.message?.includes("already listed")) {
          setErrors({
            productName: "A product with this name and unit is already in your inventory.",
          });
        } else {
          setErrors({ general: err?.message || "Failed to save product. Please try again." });
        }
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {errors.general ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{errors.general}</Text>
        </View>
      ) : null}

      {/* 1. Photo Field */}
      <ProductPhotoField
        initialImageUrl={imagUrl}
        initialDisplayUrl={displayImageUrl}
        error={errors.imagUrl}
        onImageSelected={(perm, disp) => {
          setImagUrl(perm);
          setDisplayImageUrl(disp);
          clearFieldError("imagUrl");
        }}
        onImageRemoved={() => {
          setImagUrl("");
          setDisplayImageUrl("");
        }}
      />

      {/* 2. Product Name */}
      <InputComponent
        label="Product Name"
        placeholder="e.g. Native Tomatoes, Romaine Lettuce"
        value={productName}
        error={errors.productName}
        leftIcon={<Tag size={18} color={colors.textMuted} />}
        onChangeText={(text) => {
          setProductName(text);
          clearFieldError("productName");
        }}
      />

      {/* 3. Category Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Vegetable Category</Text>
        <Text style={styles.sectionHint}>Select the crop group for buyer search</Text>
        <View style={styles.categoryGrid}>
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = productType === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  setProductType(cat);
                  clearFieldError("productType");
                }}
                accessibilityRole="button"
                accessibilityLabel={cat}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.productType ? (
          <Text style={styles.fieldError}>{errors.productType}</Text>
        ) : null}
      </View>

      {/* 4. Selling Unit Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Selling Unit</Text>
        {mode === "edit" ? (
          <Text style={styles.sectionHint}>
            Unit cannot be changed once product is created.
          </Text>
        ) : (
          <Text style={styles.sectionHint}>How do you price and measure this item?</Text>
        )}
        <View style={styles.unitRow}>
          {SCALING_TYPES.map((unit) => {
            const isSelected = scalingType === unit.value;
            return (
              <Pressable
                key={unit.value}
                disabled={mode === "edit"}
                onPress={() => {
                  setScalingType(unit.value);
                  clearFieldError("scalingType");
                }}
                accessibilityRole="button"
                accessibilityLabel={unit.label}
                style={[
                  styles.unitChip,
                  isSelected && styles.unitChipSelected,
                  mode === "edit" && styles.unitChipDisabled,
                ]}
              >
                <Scale
                  size={16}
                  color={isSelected ? colors.white : colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.unitChipText,
                    isSelected && styles.unitChipTextSelected,
                  ]}
                >
                  {unit.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.scalingType ? (
          <Text style={styles.fieldError}>{errors.scalingType}</Text>
        ) : null}
      </View>

      {/* 5. Initial Quantity (Create mode only) */}
      {mode === "create" ? (
        <InputComponent
          label={`Initial Quantity (${scalingType === "kilo" ? "kg" : scalingType})`}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={productQty}
          error={errors.productQty}
          leftIcon={<Scale size={18} color={colors.textMuted} />}
          onChangeText={(text) => {
            setProductQty(text);
            clearFieldError("productQty");
          }}
        />
      ) : null}

      {/* 6. Price per unit */}
      <InputComponent
        label={`Selling Price (₱ per ${scalingType === "kilo" ? "kg" : scalingType})`}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={productPrice}
        error={errors.productPrice}
        leftIcon={<Coins size={18} color={colors.textMuted} />}
        onChangeText={(text) => {
          setProductPrice(text);
          clearFieldError("productPrice");
        }}
      />

      {/* 7. Low Stock Threshold */}
      <InputComponent
        label={`Alert me when amount reaches (${scalingType === "kilo" ? "kg" : scalingType})`}
        placeholder="e.g. 5.00"
        keyboardType="decimal-pad"
        value={lowStockThreshold}
        error={errors.lowStockThreshold}
        leftIcon={<AlertTriangle size={18} color={colors.textMuted} />}
        onChangeText={(text) => {
          setLowStockThreshold(text);
          clearFieldError("lowStockThreshold");
        }}
      />

      {/* 8. Marketability Toggle */}
      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Available to Buyers</Text>
          <Text style={styles.switchSubtext}>
            Turn off when buyers cannot order this item.
          </Text>
        </View>
        <Switch
          value={isMarketable}
          onValueChange={setIsMarketable}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      {/* 9. Submit Button */}
      <ButtonComponent
        title={submitButtonText}
        onPress={handleSubmit}
        loading={loading}
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
  errorBox: {
    backgroundColor: "rgba(184, 84, 80, 0.1)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.input,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: fonts.body.medium,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  sectionHint: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    minHeight: 36,
    justifyContent: "center",
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  categoryChipTextSelected: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
  unitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  unitChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: touchTargets.min,
  },
  unitChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitChipDisabled: {
    opacity: 0.6,
  },
  unitChipText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  unitChipTextSelected: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
  fieldError: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.lg,
    minHeight: touchTargets.min,
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  switchSubtext: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
