import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductForm } from "../../../src/features/inventory/components/ProductForm";
import { BoostIntroSheet } from "../../../src/features/marketing/components/BoostIntroSheet";
import { createSellerProduct } from "../../../src/features/inventory/api/products";
import type { CreateProductInput, ProductScalingType } from "../../../src/features/inventory/types";
import { colors, fonts, spacing } from "../../../src/theme";

export default function CreateProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ catalogId?: string; unit?: ProductScalingType; name?: string }>();
  const [loading, setLoading] = useState(false);
  const [boostFor, setBoostFor] = useState<{ id: string; dropAmount: number } | null>(null);

  const initialProduct = params.catalogId
    ? ({
        vegetableCatalogId: params.catalogId,
        productName: params.name || "",
        scalingType: params.unit || "kilo",
        productPrice: "",
        productQty: "",
        isMarketable: true,
      } as any)
    : undefined;

  const openProduct = (productId: string) => router.replace(`/(app)/inventory/${productId}`);
  const closeBoostSheet = () => {
    if (!boostFor) return;
    setBoostFor(null);
    openProduct(boostFor.id);
  };
  const previewBoost = () => {
    if (!boostFor) return;
    setBoostFor(null);
    router.replace(`/(app)/marketing/${boostFor.id}`);
  };

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      const res = await createSellerProduct(data as CreateProductInput);
      const product = res.products;
      if (!data.isMarketable) {
        Alert.alert("Product Listed", `"${product.productName}" has been added to your inventory.`, [
          { text: "OK", onPress: () => openProduct(product.id) },
        ], { cancelable: false });
        return;
      }
      setBoostFor({ id: product.id, dropAmount: Number(data.priceReductionAmount) || 0 });
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to add product to inventory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Fresh Produce</Text>
        <Text style={styles.subtitle}>
          List your marketable vegetable surplus with pricing, quantity, and optional low-stock alert.
        </Text>
      </View>
      <ProductForm mode="create" initialProduct={initialProduct} onSubmit={handleCreate} loading={loading} />
      <BoostIntroSheet visible={boostFor !== null} priceReductionAmount={boostFor?.dropAmount ?? 0} onPreview={previewBoost} onClose={closeBoostSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
});
