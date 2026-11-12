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
          style={[styles.tab, active && { backgroundColor: activeColor }]}
        >
          <Icon size={16} color={active ? colors.white : colors.textMuted} style={styles.icon} />
          <Text style={[styles.text, active && { color: colors.white, fontFamily: fonts.body.semiBold }]}>{label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: { flexDirection: "row", height: 48, backgroundColor: "#F6F5F1", borderRadius: 9999, padding: 4, gap: 4, marginBottom: spacing.lg },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 9999 },
  icon: { marginRight: 6 },
  text: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
});
