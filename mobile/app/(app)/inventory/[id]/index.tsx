import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Package,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
  Archive,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react-native";
import { useProduct } from "../../../../src/features/inventory/hooks/useProduct";
import { colors, fonts, radii, spacing, touchTargets } from "../../../../src/theme";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    product,
    history,
    loading,
    loadingHistory,
    actionLoading,
    error,
    refresh,
    archive,
    reactivate,
  } = useProduct(id || "");

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <Text style={styles.errorSub}>{error || "Could not load this product."}</Text>
        <Pressable
          onPress={refresh}
          accessibilityRole="button"
          accessibilityLabel="Retry loading product"
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const qty = parseFloat(product.productQty as string) || 0;
  const price = parseFloat(product.productPrice as string) || 0;
  const threshold =
    product.lowStockThreshold != null
      ? parseFloat(product.lowStockThreshold as string)
      : null;

  const isOutOfStock = qty <= 0;
  const isLowStock = !isOutOfStock && threshold != null && qty <= threshold;
  const isArchived = !product.isActive;
  const unitLabel = product.scalingType === "kilo" ? "kg" : product.scalingType;
  const imageUrl = product.displayImageUrl || product.imagUrl;

  const handleArchive = () => {
    Alert.alert(
      "Archive Product",
      `Are you sure you want to archive "${product.productName}"? It will be removed from your active catalog. Existing buyer orders and history remain valid.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive Product",
          style: "destructive",
          onPress: async () => {
            try {
              await archive();
              Alert.alert("Product Archived", "This product is now in your archived list.");
            } catch (err: any) {
              Alert.alert("Error", err?.message || "Failed to archive product.");
            }
          },
        },
      ],
    );
  };

  const handleRestore = async () => {
    if (qty <= 0) {
      Alert.alert(
        "Cannot Restore",
        "This product has 0 available amount. Please add more before restoring.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add More Now",
            onPress: () =>
              router.push({
                pathname: "/(app)/inventory/[id]/stock",
                params: { id: product.id, type: "in" },
              }),
          },
        ],
      );
      return;
    }

    if (!product.isMarketable) {
      Alert.alert(
        "Cannot Restore",
        "Product must be marked marketable for reservations before restoring. Edit product to enable marketability.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Edit Product",
            onPress: () => router.push(`/(app)/inventory/${product.id}/edit`),
          },
        ],
      );
      return;
    }

    try {
      await reactivate();
      Alert.alert("Product Restored", "Product is now active and visible to buyers.");
    } catch (err: any) {
      Alert.alert("Restore Failed", err?.message || "Could not restore product.");
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Product Image Banner */}
      <View style={styles.imageBanner}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.bannerImage} />
        ) : (
          <View style={styles.placeholderBanner}>
            <Package size={48} color={colors.textMuted} />
            <Text style={styles.placeholderText}>No photo available</Text>
          </View>
        )}
      </View>

      {/* 2. Main Identity & Status */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Pressable
            onPress={() => router.push(`/(app)/inventory/${product.id}/edit`)}
            accessibilityRole="button"
            accessibilityLabel="Edit product information"
            style={styles.editIconButton}
          >
            <Pencil size={18} color={colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.categoryName}>{product.productType}</Text>

        <View style={styles.statusBadgesRow}>
          {isArchived ? (
            <View style={[styles.badge, styles.badgeArchived]}>
              <Text style={styles.badgeTextArchived}>Archived</Text>
            </View>
          ) : isOutOfStock ? (
            <View style={[styles.badge, styles.badgeError]}>
              <AlertCircle size={12} color={colors.error} style={{ marginRight: 4 }} />
              <Text style={styles.badgeTextError}>Out of Stock</Text>
            </View>
          ) : isLowStock ? (
            <View style={[styles.badge, styles.badgeWarning]}>
              <AlertTriangle size={12} color={colors.warning} style={{ marginRight: 4 }} />
              <Text style={styles.badgeTextWarning}>Low Stock Alert</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <CheckCircle2 size={12} color={colors.success} style={{ marginRight: 4 }} />
              <Text style={styles.badgeTextSuccess}>Available</Text>
            </View>
          )}

          {product.isMarketable ? (
            <View style={[styles.badge, styles.badgeMarketable]}>
              <Text style={styles.badgeTextMarketable}>Accepting Reservations</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeNotMarketable]}>
              <Text style={styles.badgeTextNotMarketable}>Reservations Paused</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Key Metrics Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Available Stock</Text>
            <Text style={styles.metricValue}>
              {qty.toFixed(2)} <Text style={styles.metricUnit}>{unitLabel}</Text>
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Selling Price</Text>
            <Text style={styles.metricValue}>
              ₱{price.toFixed(2)} <Text style={styles.metricUnit}>/ {unitLabel}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Low-Stock Alert Level:</Text>
          <Text style={styles.metaValue}>
            {threshold != null ? `${threshold.toFixed(2)} ${unitLabel}` : "Not configured"}
          </Text>
        </View>
      </View>

      {/* 3. Thumb-zone Stock Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.stockActionButtonsRow}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(app)/inventory/[id]/stock",
                params: { id: product.id, type: "in" },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Add More"
            style={styles.stockInButton}
          >
            <ArrowUpRight size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.stockInButtonText}>Add More</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(app)/inventory/[id]/stock",
                params: { id: product.id, type: "out" },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Take Away"
            style={styles.stockOutButton}
          >
            <ArrowDownRight size={18} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.stockOutButtonText}>Take Away</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push(`/(app)/inventory/${product.id}/edit`)}
          accessibilityRole="button"
          accessibilityLabel="Edit product information"
          style={styles.editFullButton}
        >
          <Pencil size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.editFullButtonText}>Edit Product Details</Text>
        </Pressable>
      </View>

      {/* 4. Amount Change History for this Product */}
      <View style={styles.historyCard}>
        <Text style={styles.historyHeading}>Inventory History</Text>
        {loadingHistory ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ padding: spacing.md }} />
        ) : history.length === 0 ? (
          <Text style={styles.emptyHistoryText}>
            No amount changes recorded for this product yet.
          </Text>
        ) : (
          history.map((item, index) => {
            const deltaNum = parseFloat(item.delta);
            const isPositive = deltaNum >= 0;
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <View
                key={item.id}
                style={[
                  styles.historyRow,
                  index < history.length - 1 && styles.historyRowDivider,
                ]}
              >
                <View style={styles.historyLeft}>
                  <Text style={styles.historyReason}>{item.reason}</Text>
                  <Text style={styles.historySub}>
                    {parseFloat(item.beforeQty).toFixed(2)} → {parseFloat(item.afterQty).toFixed(2)} {unitLabel}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text
                    style={[
                      styles.historyDelta,
                      isPositive ? styles.historyPositive : styles.historyNegative,
                    ]}
                  >
                    {isPositive ? `+${deltaNum.toFixed(2)}` : deltaNum.toFixed(2)} {unitLabel}
                  </Text>
                  <Text style={styles.historyDate}>{dateStr}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 5. Archive / Restore Action */}
      <View style={styles.dangerSection}>
        {isArchived ? (
          <Pressable
            onPress={handleRestore}
            disabled={actionLoading}
            accessibilityRole="button"
            accessibilityLabel="Restore product to active catalog"
            style={styles.restoreButton}
          >
            <RotateCcw size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.restoreButtonText}>Restore Product</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleArchive}
            disabled={actionLoading}
            accessibilityRole="button"
            accessibilityLabel="Archive product from active catalog"
            style={styles.archiveButton}
          >
            <Archive size={16} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.archiveButtonText}>Archive Product</Text>
          </Pressable>
        )}
        <Text style={styles.archiveNotice}>
          {isArchived
            ? "Restore checks positive stock, valid price, and active marketability."
            : "Archiving hides the product from new buyers while preserving existing transaction history."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: spacing.xxxl,
  },
  imageBanner: {
    width: "100%",
    height: 220,
    backgroundColor: "#E8E6DF",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderBanner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: -spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productName: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.text,
    flex: 1,
  },
  editIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontFamily: fonts.body.medium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  badgeSuccess: {
    backgroundColor: "rgba(63, 125, 88, 0.12)",
  },
  badgeTextSuccess: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.success,
  },
  badgeWarning: {
    backgroundColor: "rgba(199, 149, 62, 0.15)",
  },
  badgeTextWarning: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.warning,
  },
  badgeError: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
  },
  badgeTextError: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.error,
  },
  badgeArchived: {
    backgroundColor: "#E2DFD8",
  },
  badgeTextArchived: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  badgeMarketable: {
    backgroundColor: "rgba(31, 77, 58, 0.08)",
  },
  badgeTextMarketable: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.primary,
  },
  badgeNotMarketable: {
    backgroundColor: "#EFECE6",
  },
  badgeTextNotMarketable: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  metricBlock: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: fonts.heading.bold,
    fontSize: 20,
    color: colors.primary,
  },
  metricUnit: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  metaLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  metaValue: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  actionsContainer: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  stockActionButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  stockInButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  stockInButtonText: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  stockOutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  stockOutButtonText: {
    color: colors.error,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  editFullButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    height: touchTargets.min,
    borderRadius: radii.button,
  },
  editFullButtonText: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
  },
  historyHeading: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyHistoryText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  historyRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyLeft: {
    flex: 1,
  },
  historyReason: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.text,
  },
  historySub: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyDelta: {
    fontFamily: fonts.heading.bold,
    fontSize: 13,
  },
  historyPositive: {
    color: colors.success,
  },
  historyNegative: {
    color: colors.error,
  },
  historyDate: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  dangerSection: {
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    alignItems: "center",
  },
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
  },
  archiveButtonText: {
    color: colors.error,
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
  },
  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.button,
  },
  restoreButtonText: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
  },
  archiveNotice: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: spacing.base,
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
  errorTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorSub: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.base,
  },
  retryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.button,
  },
  retryButtonText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
});
