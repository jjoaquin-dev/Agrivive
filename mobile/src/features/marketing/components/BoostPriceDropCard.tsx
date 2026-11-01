import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Tag } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  dropAmount: number;
  lowestPrice?: number | null;
}

/** The price drop rule, read from the product's own settings. */
export function BoostPriceDropCard({ dropAmount, lowestPrice }: Props) {
  const text = dropAmount > 0 && lowestPrice
      ? `If your produce hasn't sold 6 hours after your Boost post, the price drops by ₱${dropAmount.toFixed(2)}. This repeats every 6 hours until your final price of ₱${lowestPrice.toFixed(2)}. It never goes lower.`
      : "Your price stays the same.";
  return (
    <View style={styles.card}>
      <Tag size={22} color={colors.primary} />
      <View style={styles.copy}>
        <Text style={styles.title}>Price drop</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.primarySurface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.primaryLight, padding: spacing.base, marginTop: spacing.base },
  copy: { flex: 1 },
  title: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  text: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 2 },
});
