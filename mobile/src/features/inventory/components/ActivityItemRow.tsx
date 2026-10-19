import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import type { StockAdjustment } from "../types";

interface Props {
  item: StockAdjustment;
  isLast: boolean;
}

export const ActivityItemRow: React.FC<Props> = ({ item, isLast }) => {
  const deltaNum = parseFloat(item.delta);
  const isPositive = deltaNum >= 0;
  const unit = item.scalingType === "kilo" ? "kg" : item.scalingType;
  const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.itemRow, !isLast && styles.itemRowDivider]}>
      <View
        style={[
          styles.itemIconCircle,
          isPositive ? styles.itemIconCircleIn : styles.itemIconCircleOut,
        ]}
      >
        {isPositive ? (
          <ArrowUpRight size={18} color={colors.success} />
        ) : (
          <ArrowDownRight size={18} color={colors.error} />
        )}
      </View>

      <View style={styles.itemMain}>
        <Text style={styles.itemProductName}>{item.productName}</Text>
        <Text style={styles.itemReason}>{item.reason}</Text>
        <Text style={styles.itemQtyTrack}>
          {parseFloat(item.beforeQty).toFixed(2)} → {parseFloat(item.afterQty).toFixed(2)} {unit}
        </Text>
      </View>

      <View style={styles.itemRight}>
        <Text
          style={[
            styles.itemDelta,
            isPositive ? styles.itemDeltaPositive : styles.itemDeltaNegative,
          ]}
        >
          {isPositive ? `+${deltaNum.toFixed(2)}` : deltaNum.toFixed(2)} {unit}
        </Text>
        <Text style={styles.itemTime}>{timeStr}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  itemRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  itemIconCircleIn: {
    backgroundColor: "rgba(63, 125, 88, 0.12)",
  },
  itemIconCircleOut: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
  },
  itemMain: {
    flex: 1,
  },
  itemProductName: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  itemReason: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemQtyTrack: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemRight: {
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  itemDelta: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
  },
  itemDeltaPositive: {
    color: colors.success,
  },
  itemDeltaNegative: {
    color: colors.error,
  },
  itemTime: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
