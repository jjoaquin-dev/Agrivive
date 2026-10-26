import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Sparkles, Tag, TrendingDown } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerProductBoostResponse } from "../types";

interface Props {
  eligibility: SellerProductBoostResponse["eligibility"];
  pricing: SellerProductBoostResponse["pricing"];
}

export function BoostCycleIndicator({ eligibility, pricing }: Props) {
  const { canBoost, headline, message, stage } = eligibility;
  const isDiscounted = pricing.hasDiscount;

  return (
    <View style={[styles.container, canBoost ? styles.containerActive : styles.containerUsed]}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          {stage === "price_reduction" ? (
            <View style={styles.pillOrange}>
              <TrendingDown size={14} color="#EA580C" />
              <Text style={styles.pillTextOrange}>
                12-Hour Drop #{pricing.reductionPeriodsApplied}
              </Text>
            </View>
          ) : (
            <View style={styles.pillGreen}>
              <Tag size={14} color={colors.primary} />
              <Text style={styles.pillTextGreen}>Initial Post</Text>
            </View>
          )}
        </View>
        <View style={styles.statusPill}>
          {canBoost ? (
            <Sparkles size={13} color={colors.primary} />
          ) : (
            <CheckCircle2 size={13} color={colors.success} />
          )}
          <Text style={[styles.statusText, { color: canBoost ? colors.primary : colors.success }]}>
            {canBoost ? "Ready to Boost" : "Used (1 of 1)"}
          </Text>
        </View>
      </View>

      {isDiscounted ? (
        <View style={styles.priceRow}>
          <Text style={styles.priceOld}>₱{pricing.basePrice.toFixed(2)}</Text>
          <Text style={styles.priceArrow}>→</Text>
          <Text style={styles.priceNew}>₱{pricing.currentPrice.toFixed(2)}</Text>
          <Text style={styles.priceDropTag}>Discounted Price</Text>
        </View>
      ) : null}

      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1.5,
    padding: spacing.base,
    marginTop: spacing.md,
  },
  containerActive: { borderColor: colors.primaryLight },
  containerUsed: { borderColor: colors.border },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  pillGreen: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(63, 125, 88, 0.12)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillTextGreen: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  pillOrange: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFEDD5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillTextOrange: { fontFamily: fonts.body.semiBold, fontSize: 12, color: "#EA580C" },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusText: { fontFamily: fonts.body.semiBold, fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.sm },
  priceOld: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "line-through" },
  priceArrow: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.textMuted },
  priceNew: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.primary },
  priceDropTag: { fontFamily: fonts.body.medium, fontSize: 11, color: "#EA580C", backgroundColor: "#FFEDD5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  headline: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text, marginTop: spacing.sm },
  message: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 3 },
});
