import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Search, SlidersHorizontal, X } from "lucide-react-native";
import { colors, radii, spacing, touchTargets, typography } from "../../../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  activeFilterCount?: number;
}

export function NotificationSearchBar({ value, onChangeText, onFilterPress, activeFilterCount }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.searchBox}>
        <Search size={16} color={colors.textMuted} style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search notifications..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")} style={styles.clearButton}>
            <X size={14} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filter notifications"
        style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
      >
        <SlidersHorizontal size={14} color={colors.text} />
        <Text style={styles.filterText}>Filter</Text>
        {Boolean(activeFilterCount) && (
          <View style={styles.filterDot} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.sm },
  searchBox: { flex: 1, height: touchTargets.min, backgroundColor: colors.surface, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: 0 },
  clearButton: { padding: spacing.xs },
  filterButton: { height: touchTargets.min, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.sm - 2 },
  filterText: { ...typography.label, color: colors.text },
  filterDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  pressed: { opacity: 0.75 },
});
