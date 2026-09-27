import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

type PriceCompareProps = {
  basePrice?: string | number | null;
  currentPrice: number;
  unitLabel: string;
  size?: "card" | "detail";
};

export function PriceCompare({ basePrice, currentPrice, unitLabel, size = "card" }: PriceCompareProps) {
  const previousPrice = basePrice == null ? null : Number(basePrice);
  const isReduced = previousPrice !== null && previousPrice > currentPrice;
  const priceLabel = `₱${currentPrice.toFixed(2)} per ${unitLabel}`;
  const currentPriceStyle = size === "detail" ? styles.detailPrice : styles.currentPrice;
  const previousPriceStyle = size === "detail" ? styles.detailPreviousPrice : styles.previousPrice;

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={isReduced ? `Was ₱${previousPrice?.toFixed(2)}, now ${priceLabel}` : priceLabel} style={styles.row}>
      {isReduced ? <>
        <Text style={previousPriceStyle}>₱{previousPrice?.toFixed(2)}</Text>
        <Text style={styles.arrow}>→</Text>
      </> : null}
      <Text style={currentPriceStyle}>₱{currentPrice.toFixed(2)} / {unitLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: spacing.xs },
  previousPrice: { color: colors.textMuted, fontFamily: fonts.body.regular, fontSize: 12, textDecorationLine: "line-through" },
  detailPreviousPrice: { color: colors.textMuted, fontFamily: fonts.body.regular, fontSize: 14, textDecorationLine: "line-through" },
  arrow: { color: colors.textMuted, fontSize: 12, marginHorizontal: spacing.xs },
  currentPrice: { color: colors.primary, fontFamily: fonts.heading.bold, fontSize: 14 },
  detailPrice: { color: colors.primary, fontFamily: fonts.heading.bold, fontSize: 20 },
});
