import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ProductForm } from "../../../src/features/inventory/components/ProductForm";
import { createSellerProduct } from "../../../src/features/inventory/api/products";
import type { CreateProductInput } from "../../../src/features/inventory/types";
import { colors, fonts, spacing } from "../../../src/theme";

export default function CreateProductScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      const res = await createSellerProduct(data as CreateProductInput);
      Alert.alert(
        "Product Listed",
        `"${res.products.productName}" has been successfully added to your inventory.`,
        [
          {
            text: "View Product",
            onPress: () => router.replace(`/(app)/inventory/${res.products.id}`),
          },
          {
            text: "Back to Inventory",
            style: "cancel",
            onPress: () => router.back(),
          },
        ],
      );
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
      <ProductForm mode="create" onSubmit={handleCreate} loading={loading} />
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
