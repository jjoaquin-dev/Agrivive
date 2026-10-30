import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductForm } from "../../../src/features/inventory/components/ProductForm";
import { requestSellerVisibilityBoost } from "../../../src/features/boost/api/visibility-boosts";
import { createSellerProduct } from "../../../src/features/inventory/api/products";
import type { CreateProductInput, ProductScalingType } from "../../../src/features/inventory/types";
import { colors, fonts, spacing } from "../../../src/theme";

export default function CreateProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ catalogId?: string; unit?: ProductScalingType; name?: string }>();
  const [loading, setLoading] = useState(false);

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

  const startBoost = async (productId: string) => {
    setLoading(true);
    try {
      await requestSellerVisibilityBoost(productId);
      Alert.alert("Boost Started", "We will post your product on the Agrivive Facebook Page soon.", [
        { text: "OK", onPress: () => openProduct(productId) },
      ], { cancelable: false });
    } catch (err: any) {
      Alert.alert("Could Not Boost", err?.message || "Your product is listed, but the boost did not start. You can try again from the product.", [
        { text: "OK", onPress: () => openProduct(productId) },
      ], { cancelable: false });
    } finally {
      setLoading(false);
    }
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
      const priceDrop = Number(data.priceReductionPercent) > 0
        ? `\n\nIf it has not sold out after 12 hours, its price goes down by ${data.priceReductionPercent}% (never below your lowest price). Then we ask if you want to boost again.`
        : "";
      Alert.alert(
        `Boost "${product.productName}"?`,
        `Your product is listed. Boost posts it on the Agrivive Facebook Page with a link, so buyers can tap it and open your product page.${priceDrop}`,
        [
          { text: "Not now", style: "cancel", onPress: () => openProduct(product.id) },
          { text: "Boost", onPress: () => void startBoost(product.id) },
        ],
        { cancelable: false },
      );
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
