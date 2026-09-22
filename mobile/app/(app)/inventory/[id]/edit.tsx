import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProduct } from "../../../../src/features/inventory/hooks/useProduct";
import { ProductForm } from "../../../../src/features/inventory/components/ProductForm";
import { updateSellerProduct } from "../../../../src/features/inventory/api/products";
import type { UpdateProductInput } from "../../../../src/features/inventory/types";
import { colors, fonts, spacing } from "../../../../src/theme";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, loading: loadingProduct, refresh } = useProduct(id || "");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (data: any) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await updateSellerProduct(id, data as UpdateProductInput);
      await refresh();
      Alert.alert("Product Updated", "Your changes have been saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Product</Text>
        <Text style={styles.subtitle}>
          Update price, photo, or details. Selling unit remains fixed; use Add More or Take Away to change the amount.
        </Text>
      </View>
      <ProductForm
        mode="edit"
        initialProduct={product}
        onSubmit={handleUpdate}
        loading={submitting}
        submitButtonText="Save Changes"
      />
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
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  errorText: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.error,
  },
});
