import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductForm } from "../../../src/features/inventory/components/ProductForm";
import { AutoPostPermissionSheet } from "../../../src/features/marketing/components/AutoPostPermissionSheet";
import { setAutoPostEnabled } from "../../../src/features/marketing/api/visibility-boosts";
import { BoostIntroSheet } from "../../../src/features/marketing/components/BoostIntroSheet";
import { createSellerProduct } from "../../../src/features/inventory/api/products";
import type { CreateProductInput, ProductScalingType } from "../../../src/features/inventory/types";
import { colors } from "../../../src/theme";
import { surface } from "../../../src/theme/surface";

export default function CreateProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ catalogId?: string; unit?: ProductScalingType; name?: string }>();
  const [loading, setLoading] = useState(false);
  const [boostFor, setBoostFor] = useState<{ id: string } | null>(null);
  const [permissionFor, setPermissionFor] = useState<{ id: string } | null>(null);
  const [permissionBusy, setPermissionBusy] = useState(false);
  const [permissionError, setPermissionError] = useState("");

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

  // Permission comes first. Yes moves on to the Boost sheet for the first post; Not Now ends the flow and opens the product.
  const answerPermission = async (accept: boolean) => {
    if (!permissionFor) return;
    if (!accept) {
      const productId = permissionFor.id;
      setPermissionFor(null);
      openProduct(productId);
      return;
    }
    setPermissionBusy(true);
    setPermissionError("");
    try {
      await setAutoPostEnabled(permissionFor.id, true);
    } catch (err: any) {
      setPermissionError(err?.message || "Could not save this. Try again, or tap Not Now.");
      setPermissionBusy(false);
      return;
    }
    setPermissionBusy(false);
    setBoostFor(permissionFor);
    setPermissionFor(null);
  };

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      const res = await createSellerProduct(data as CreateProductInput);
      const product = res.products;
      if (!data.isMarketable) {
        Alert.alert("Listing Added", `"${product.productName}" has been added to your listings.`, [
          { text: "OK", onPress: () => openProduct(product.id) },
        ], { cancelable: false });
        return;
      }
      setPermissionError("");
      setPermissionFor({ id: product.id });
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not add this listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ProductForm mode="create" initialProduct={initialProduct} onSubmit={handleCreate} loading={loading} />
      <AutoPostPermissionSheet
        visible={permissionFor !== null}
        busy={permissionBusy}
        error={permissionError}
        onAccept={() => void answerPermission(true)}
        onDecline={() => void answerPermission(false)}
      />
      <BoostIntroSheet visible={boostFor !== null} onPreview={previewBoost} onClose={closeBoostSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: surface.page,
  },
});
