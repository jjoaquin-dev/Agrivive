import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import {
  type CreateProductInput,
  type Product,
  type ProductScalingType,
  type UpdateProductInput,
} from "../types";
import { validateCreateProduct, validateUpdateProduct, type ProductFormErrors } from "../validation";
import { ProductFormIdentity } from "./ProductFormIdentity";
import { ProductFormOperations } from "./ProductFormOperations";
import { styles } from "./ProductFormStyles";

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
  submitButtonText = mode === "create" ? "Save Produce" : "Save Changes",
}) => {
  const [catalogId, setCatalogId] = useState(initialProduct?.vegetableCatalogId || "");
  const [imagUrl, setImagUrl] = useState(initialProduct?.imagUrl || "");
  const [displayImageUrl, setDisplayImageUrl] = useState(initialProduct?.displayImageUrl || initialProduct?.imagUrl || "");
  const [productPrice, setProductPrice] = useState(initialProduct?.productPrice ? String(initialProduct.productPrice) : "");
  const [priceReductionAmount, setPriceReductionAmount] = useState(initialProduct?.priceReductionAmount != null ? String(initialProduct.priceReductionAmount) : "");
  const [minimumPrice, setMinimumPrice] = useState(initialProduct?.minimumPrice != null ? String(initialProduct.minimumPrice) : "");
  const [lowStockThreshold, setLowStockThreshold] = useState(initialProduct?.lowStockThreshold != null ? String(initialProduct.lowStockThreshold) : "");
  const [productQty, setProductQty] = useState(initialProduct?.productQty ? String(initialProduct.productQty) : "");
  const [scalingType, setScalingType] = useState<ProductScalingType>(initialProduct?.scalingType || "kilo");
  const [isMarketable, setIsMarketable] = useState(initialProduct ? initialProduct.isMarketable : true);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const clearFieldError = (field: keyof ProductFormErrors) => {
    if (errors[field] || errors.general) setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async () => {
    const numPrice = parseFloat(productPrice);
    const numPriceReduction = priceReductionAmount.trim() ? parseFloat(priceReductionAmount) : 0;
    const numMinimumPrice = minimumPrice.trim() ? parseFloat(minimumPrice) : undefined;
    const numQty = parseFloat(productQty);
    const numThreshold = lowStockThreshold.trim() ? parseFloat(lowStockThreshold) : null;

    if (mode === "create") {
      const payload: CreateProductInput = { catalogId, imagUrl, productPrice: numPrice, priceReductionAmount: numPriceReduction, minimumPrice: numMinimumPrice, productQty: numQty, scalingType, isMarketable, ...(numThreshold !== null ? { lowStockThreshold: numThreshold } : {}) };
      const result = validateCreateProduct(payload);
      if (!result.isValid) return setErrors(result.errors);
      try { await onSubmit(payload); }
      catch (err: any) {
        setErrors({ general: err?.message || "Failed to create product. Please try again." });
      }
      return;
    }

    if (!catalogId) return setErrors({ catalogId: "Please choose a vegetable from the list." });
    const initialPrice = initialProduct?.productPrice == null ? null : Number(initialProduct.productPrice);
    const initialReduction = Number(initialProduct?.priceReductionAmount ?? 0);
    const initialMinimum = initialProduct?.minimumPrice == null ? null : Number(initialProduct.minimumPrice);
    const pricingChanged = numPrice !== initialPrice || numPriceReduction !== initialReduction || (numMinimumPrice ?? null) !== initialMinimum;
    const initialThreshold = initialProduct?.lowStockThreshold == null ? null : Number(initialProduct.lowStockThreshold);
    const payload: UpdateProductInput = {
      ...(numThreshold !== initialThreshold ? { lowStockThreshold: numThreshold } : {}),
      ...(catalogId !== (initialProduct?.vegetableCatalogId || "") ? { catalogId } : {}),
      imagUrl: imagUrl || undefined,
      ...(pricingChanged ? { productPrice: numPrice, priceReductionAmount: numPriceReduction, minimumPrice: numMinimumPrice ?? null } : {}),
      isMarketable,
    };
    const result = validateUpdateProduct(payload);
    if (!result.isValid) return setErrors(result.errors);
    try { await onSubmit(payload); }
    catch (err: any) {
      setErrors({ general: err?.message || "Failed to save product. Please try again." });
    }
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
        {errors.general ? <View style={styles.errorBox}><Text style={styles.errorBoxText}>{errors.general}</Text></View> : null}
        <ProductFormIdentity
          imageUrl={imagUrl}
          displayImageUrl={displayImageUrl}
          initialName={initialProduct?.productName}
          initialCatalogId={initialProduct?.vegetableCatalogId}
          errors={errors}
          onImageSelected={(permanentUrl, displayUrl) => { setImagUrl(permanentUrl); setDisplayImageUrl(displayUrl); clearFieldError("imagUrl"); }}
          onImageRemoved={() => { setImagUrl(""); setDisplayImageUrl(""); }}
          onCatalogSelected={(item) => { setCatalogId(item?.id || ""); clearFieldError("catalogId"); }}
        />
        <ProductFormOperations
          mode={mode}
          scalingType={scalingType}
          setScalingType={setScalingType}
          productQty={productQty}
          setProductQty={setProductQty}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          priceReductionAmount={priceReductionAmount}
          setPriceReductionAmount={setPriceReductionAmount}
          minimumPrice={minimumPrice}
          setMinimumPrice={setMinimumPrice}
          lowStockThreshold={lowStockThreshold}
          setLowStockThreshold={setLowStockThreshold}
          isMarketable={isMarketable}
          setIsMarketable={setIsMarketable}
          errors={errors}
          clearFieldError={clearFieldError}
        />
      </ScrollView>
      <View style={styles.footer}>
        <ButtonComponent title={submitButtonText} onPress={handleSubmit} loading={loading} style={styles.submitButton} textStyle={styles.submitText} />
      </View>
    </KeyboardAvoidingView>
  );
};
