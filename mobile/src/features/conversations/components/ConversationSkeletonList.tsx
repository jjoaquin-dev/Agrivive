import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "../../../theme";

export function ConversationSkeletonList() {
  const rows = [1, 2, 3, 4, 5, 6];

  return (
    <View style={styles.container}>
      {rows.map((key) => (
        <View key={key} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.topLine}>
              <View style={styles.nameBar} />
              <View style={styles.timeBar} />
            </View>
            <View style={styles.tagBar} />
            <View style={styles.snippetBar} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameBar: {
    width: 120,
    height: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  timeBar: {
    width: 50,
    height: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  tagBar: {
    width: 80,
    height: 18,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    marginTop: 6,
  },
  snippetBar: {
    width: 180,
    height: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    marginTop: 6,
  },
});
