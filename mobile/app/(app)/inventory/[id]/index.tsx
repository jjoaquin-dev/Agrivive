import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator, Alert, Share } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Archive, Pencil, RotateCcw, Share2, SlidersHorizontal } from "lucide-react-native";
import { useProduct } from "../../../../src/features/inventory/hooks/useProduct";
import { colors, fonts, radii, spacing } from "../../../../src/theme";
import { getSellerProductShare } from "../../../../src/features/inventory/api/product-share";
import { ProductDetailsSummary } from "../../../../src/features/inventory/components/ProductDetailsSummary";
import { ProductHistoryCard } from "../../../../src/features/inventory/components/ProductHistoryCard";
import { ArchiveConfirmSheet } from "../../../../src/features/inventory/components/ArchiveConfirmSheet";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sharing, setSharing] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const { product, history, loading, loadingHistory, actionLoading, error, refresh, archive, reactivate } = useProduct(id || "");

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerSub}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <Text style={styles.centerSub}>{error || "Could not load this product."}</Text>
        <Pressable onPress={refresh} accessibilityRole="button" accessibilityLabel="Retry loading product" style={styles.retry}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const qty = parseFloat(product.productQty as string) || 0;
  const isArchived = !product.isActive;
  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;

  const confirmArchive = async () => {
    try {
      await archive();
      setArchiveOpen(false);
      Alert.alert("Product Archived", "This product is now in your archived list.");
    } catch (err: any) {
      setArchiveOpen(false);
      Alert.alert("Error", err?.message || "Failed to archive product.");
    }
  };

  const handleRestore = async () => {
    if (qty <= 0) {
      Alert.alert("Cannot Restore", "This product has 0 available amount. Please add more before restoring.", [
        { text: "Cancel", style: "cancel" },
        { text: "Add More Now", onPress: () => router.push({ pathname: "/(app)/inventory/[id]/stock", params: { id: product.id, type: "in" } }) },
      ]);
      return;
    }
    if (!product.isMarketable) {
      Alert.alert("Cannot Restore", "Product must be marked marketable for reservations before restoring. Edit product to enable marketability.", [
        { text: "Cancel", style: "cancel" },
        { text: "Edit Product", onPress: () => router.push(`/(app)/inventory/${product.id}/edit`) },
      ]);
      return;
    }
    try {
      await reactivate();
      Alert.alert("Product Restored", "Product is now active and visible to buyers.");
    } catch (err: any) {
      Alert.alert("Restore Failed", err?.message || "Could not restore product.");
    }
  };

  const copyLink = async () => {
    const data = await getSellerProductShare(product.id);
    await Clipboard.setStringAsync(data.shareUrl);
    Alert.alert("Link Copied", "Listing URL copied to clipboard.");
  };

  const handleShare = async () => {
    if (isArchived || !product.isMarketable || qty <= 0) {
      Alert.alert("Sharing Unavailable", "Only active, marketable products with available stock can be shared on the marketplace.");
      return;
    }
    setSharing(true);
    try {
      const data = await getSellerProductShare(product.id);
      const result = await Share.share({ message: data.caption, url: data.shareUrl, title: product.productName });
      if (result.action === Share.dismissedAction) await copyLink();
    } catch (err: any) {
      try {
        await copyLink();
      } catch {
        Alert.alert("Share Failed", err?.message || "Could not prepare share link.");
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerRight: () => (
            <Pressable onPress={handleShare} disabled={sharing} accessibilityRole="button" accessibilityLabel="Share listing" hitSlop={8} style={styles.headerIcon}>
              {sharing ? <ActivityIndicator size="small" color={colors.primary} /> : <Share2 size={20} color={colors.text} />}
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ProductDetailsSummary product={product} />
        <ProductHistoryCard history={history} loading={loadingHistory} unit={unitLabel} />

        {isArchived ? (
          <Pressable onPress={handleRestore} disabled={actionLoading} accessibilityRole="button" accessibilityLabel="Restore product to active catalog" style={[styles.dangerButton, styles.restoreButton]}>
            <RotateCcw size={16} color={colors.primary} />
            <Text style={[styles.dangerText, { color: colors.primary }]}>Restore Listing</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setArchiveOpen(true)} disabled={actionLoading} accessibilityRole="button" accessibilityLabel="Archive product from active catalog" style={styles.dangerButton}>
            <Archive size={16} color={colors.error} />
            <Text style={styles.dangerText}>Archive Listing</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={styles.bar}>
        <Pressable onPress={() => router.push(`/(app)/inventory/${product.id}/edit`)} accessibilityRole="button" accessibilityLabel="Edit product information" style={[styles.barButton, styles.barSecondary]}>
          <Pencil size={16} color={colors.text} />
          <Text style={styles.barSecondaryText}>Edit Product</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: "/(app)/inventory/[id]/stock", params: { id: product.id, type: "in" } })}
          accessibilityRole="button"
          accessibilityLabel="Change Amount"
          style={[styles.barButton, styles.barPrimary]}
        >
          <SlidersHorizontal size={16} color={colors.white} />
          <Text style={styles.barPrimaryText}>Change Amount</Text>
        </Pressable>
      </View>

      <ArchiveConfirmSheet
        visible={archiveOpen}
        productName={product.productName}
        remaining={`${qty.toFixed(2)} ${unitLabel}`}
        loading={actionLoading}
        onConfirm={confirmArchive}
        onCancel={() => setArchiveOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  centerSub: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.sm, textAlign: "center" },
  errorTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  retry: { marginTop: spacing.base, minHeight: 48, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: "center" },
  retryText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.white },
  headerIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  dangerButton: { marginTop: spacing.base, minHeight: 48, borderRadius: radii.button - 2, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "rgba(220,38,38,0.2)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  restoreButton: { backgroundColor: colors.primarySurface, borderColor: colors.primaryLight },
  dangerText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.error },
  bar: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.lg },
  barButton: { flex: 1, minHeight: 50, borderRadius: radii.button, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  barSecondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  barPrimary: { backgroundColor: colors.primary },
  barSecondaryText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  barPrimaryText: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.white },
});
