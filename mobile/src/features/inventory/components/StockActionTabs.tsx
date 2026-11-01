import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";

export type StockActionType = "in" | "out";

interface StockActionTabsProps {
  actionType: StockActionType;
  onChange: (type: StockActionType) => void;
}

const TABS: { type: StockActionType; label: string; Icon: typeof Plus; activeColor: string }[] = [
  { type: "in", label: "Add More", Icon: Plus, activeColor: colors.primary },
  { type: "out", label: "Take Away", Icon: Minus, activeColor: colors.error },
];

export const StockActionTabs: React.FC<StockActionTabsProps> = ({ actionType, onChange }) => (
  <View style={styles.track}>
    {TABS.map(({ type, label, Icon, activeColor }) => {
      const active = actionType === type;
      return (
        <Pressable
          key={type}
          onPress={() => onChange(type)}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          style={[styles.tab, active && styles.tabActive]}
        >
          <Icon size={16} color={active ? activeColor : colors.textMuted} style={styles.icon} />
          <Text style={[styles.text, active && { color: activeColor, fontFamily: fonts.body.semiBold }]}>{label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: { flexDirection: "row", height: 44, backgroundColor: "#F3F4F6", borderRadius: 10, padding: 3, gap: 4, marginBottom: spacing.base },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 8 },
  tabActive: { backgroundColor: colors.white, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  icon: { marginRight: 6 },
  text: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
});
