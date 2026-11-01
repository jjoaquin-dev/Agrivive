import React, { useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProduct } from "../../../../src/features/inventory/hooks/useProduct";
import { StockChangeForm, type StockActionType } from "../../../../src/features/inventory/components/StockChangeForm";
import { StockProductBanner } from "../../../../src/features/inventory/components/StockProductBanner";
import { StockSavedPanel, type StockSaved } from "../../../../src/features/inventory/components/StockSavedPanel";
import { colors, fonts, spacing } from "../../../../src/theme";

export default function ProductStockScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const router = useRouter();
  const { product, loading, actionLoading, adjustStock } = useProduct(id || "");
  const [saved, setSaved] = useState<StockSaved | null>(null);

  const initialType: StockActionType = type === "out" ? "out" : "in";

  const handleStockSubmit = async (delta: number, reason: string) => {
    if (!product) return;
    try {
      const updated = await adjustStock(delta, reason);
      setSaved({
        productName: product.productName,
        category: product.productType,
        unit: product.scalingType === "kilo" ? "kg" : product.scalingType,
        previous: parseFloat(product.productQty as string) || 0,
        delta,
        current: parseFloat(updated.productQty as string) || 0,
        reason,
      });
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

  if (saved) {
    return (
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <StockSavedPanel saved={saved} onDone={() => router.back()} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <StockProductBanner product={product} />
      <StockChangeForm product={product} initialType={initialType} onSubmit={handleStockSubmit} loading={actionLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  loadingText: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
  errorText: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.error },
});
