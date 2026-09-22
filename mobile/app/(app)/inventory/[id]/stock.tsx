import React from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProduct } from "../../../../src/features/inventory/hooks/useProduct";
import {
  StockChangeForm,
  type StockActionType,
} from "../../../../src/features/inventory/components/StockChangeForm";
import { colors, fonts, spacing } from "../../../../src/theme";

export default function ProductStockScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const router = useRouter();
  const { product, loading, actionLoading, adjustStock } = useProduct(id || "");

  const initialType: StockActionType = type === "out" ? "out" : "in";

  const handleStockSubmit = async (delta: number, reason: string) => {
    if (!product) return;
    try {
      const updated = await adjustStock(delta, reason);
      const isPositive = delta > 0;
      const unit = product.scalingType === "kilo" ? "kg" : product.scalingType;
      const absDelta = Math.abs(delta).toFixed(2);

      Alert.alert(
        "✓ Stock Updated",
        isPositive
          ? `${absDelta} ${unit} added to ${product.productName}.\nPrevious: ${parseFloat(product.productQty as string).toFixed(2)} ${unit}\nCurrent: ${parseFloat(updated.productQty as string).toFixed(2)} ${unit}`
          : `${absDelta} ${unit} taken away from ${product.productName}.\nCurrent amount: ${parseFloat(updated.productQty as string).toFixed(2)} ${unit}`,
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert("Could Not Save", err?.message || "Could not save the amount change.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading stock details...</Text>
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
        <Text style={styles.title}>Change Amount</Text>
        <Text style={styles.subtitle}>
          Record incoming produce harvest, damage, spoilage, or offline sales for{" "}
          <Text style={styles.productNameHighlight}>{product.productName}</Text>.
        </Text>
      </View>
      <StockChangeForm
        product={product}
        initialType={initialType}
        onSubmit={handleStockSubmit}
        loading={actionLoading}
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
  productNameHighlight: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
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
