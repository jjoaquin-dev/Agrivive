import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TrendingDown } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  price: string;
  dropAmount: string;
  finalPrice: string;
}

const peso = (value: number) => `₱${value.toFixed(2)}`;

/** Shows the next prices and the final price, so the seller sees where the drops stop (Recognition over Recall). */
export function PriceDropPreview({ price, dropAmount, finalPrice }: Props) {
  const start = Number(price), drop = Number(dropAmount), floor = Number(finalPrice);
  if (!(start > 0) || !(drop > 0) || !(floor > 0) || floor > start || drop >= start) return null;

  const steps = [start];
  while (steps.length < 3 && steps[steps.length - 1] > floor) {
    steps.push(Math.max(floor, Math.round((steps[steps.length - 1] - drop) * 100) / 100));
  }
  const drops = Math.ceil(Math.round((start - floor) * 100) / Math.round(drop * 100));
  const hours = drops * 6;
  const when = hours < 24 ? `${hours} hours` : `about ${Math.round(hours / 24)} ${Math.round(hours / 24) === 1 ? "day" : "days"}`;

  return (
    <View style={styles.box} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <TrendingDown size={16} color={colors.primary} />
        <Text style={styles.steps}>
          {steps.map(peso).join(" → ")}{steps[steps.length - 1] > floor ? " → …" : ""}
        </Text>
      </View>
      <Text style={styles.final}>Final price: {peso(floor)}</Text>
      <Text style={styles.note}>
        It never goes below {peso(floor)}. It gets there after {drops} {drops === 1 ? "drop" : "drops"} ({when} after your Boost post), and we tell you when it does.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.primarySurface, borderRadius: radii.input, borderWidth: 1, borderColor: colors.primaryLight, padding: spacing.md, marginTop: spacing.xs, marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  steps: { flex: 1, fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  final: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.primaryPressed, marginTop: spacing.sm },
  note: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 2 },
});
