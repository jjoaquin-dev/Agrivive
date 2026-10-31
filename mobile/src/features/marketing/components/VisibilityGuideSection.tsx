import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PaginationControl } from "../../../components/PaginationControl";
import { colors, fonts, spacing } from "../../../theme";
import type { Product } from "../../inventory/types";
import { useVisibilityGuide } from "../hooks/useVisibilityGuide";
import { VisibilityBreakdownCard } from "./VisibilityBreakdownCard";

/** How high each listing shows to buyers, with a Boost button on each card. */
export function VisibilityGuideSection({ products }: { products: Product[] }) {
  const router = useRouter();
  const guide = useVisibilityGuide();

  return (
    <View>
      <Text style={styles.subtitle}>How high your listings show to buyers.</Text>
      {guide.loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {guide.error ? <Text style={styles.error}>{guide.error}</Text> : null}
      {!guide.loading && !guide.error && guide.total === 0 ? (
        <Text style={styles.empty}>No visibility scores yet.</Text>
      ) : null}
      {guide.items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return (
          <VisibilityBreakdownCard
            key={item.productId}
            item={item}
            product={product}
            productName={product?.productName}
            onBoost={() => router.push({ pathname: "/(app)/marketing/[productId]", params: { productId: item.productId } })}
          />
        );
      })}
      {guide.total > 0 ? (
        <PaginationControl
          currentPage={guide.page}
          totalItems={guide.total}
          pageSize={guide.pageSize}
          pageSizeOptions={[3, 5, 10]}
          onPageChange={guide.setPage}
          onPageSizeChange={guide.setPageSize}
          itemLabel="items"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginBottom: spacing.sm },
  loader: { marginVertical: spacing.base },
  error: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  empty: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.xxxl },
});
