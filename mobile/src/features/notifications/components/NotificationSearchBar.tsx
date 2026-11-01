import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Search, SlidersHorizontal, X } from "lucide-react-native";
import { colors, radii, spacing, typography } from "../../../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  activeFilterCount?: number;
}

export function NotificationSearchBar({ value, onChangeText, onFilterPress, activeFilterCount }: Props) {
  const active = Boolean(activeFilterCount);
  return (
    <View style={styles.row}>
      <View style={styles.searchBox}>
        <Search size={16} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search notifications"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10}>
            <X size={14} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filter notifications"
        style={[styles.filterButton, active && styles.filterActive]}
      >
        <SlidersHorizontal size={20} color={active ? colors.primary : colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  searchBox: { flex: 1, height: 44, backgroundColor: colors.surface, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md + 2 },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: 0 },
  filterButton: { width: 44, height: 44, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  filterActive: { borderColor: colors.primary, backgroundColor: colors.primarySurface },
});
