import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export type StockActionType = "in" | "out";

interface StockActionTabsProps {
  actionType: StockActionType;
  onChange: (type: StockActionType) => void;
}

export const StockActionTabs: React.FC<StockActionTabsProps> = ({ actionType, onChange }) => {
  return (
    <View style={styles.tabRow}>
      <Pressable
        onPress={() => onChange("in")}
        accessibilityRole="tab"
        accessibilityState={{ selected: actionType === "in" }}
        style={[styles.tab, actionType === "in" && styles.tabActiveIn]}
      >
        <ArrowUpRight
          size={18}
          color={actionType === "in" ? colors.white : colors.success}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabText, actionType === "in" && styles.tabTextActive]}>
          Add More
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChange("out")}
        accessibilityRole="tab"
        accessibilityState={{ selected: actionType === "out" }}
        style={[styles.tab, actionType === "out" && styles.tabActiveOut]}
      >
        <ArrowDownRight
          size={18}
          color={actionType === "out" ? colors.white : colors.error}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabText, actionType === "out" && styles.tabTextActive]}>
          Take Away
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: touchTargets.min,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActiveIn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabActiveOut: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
  },
});
