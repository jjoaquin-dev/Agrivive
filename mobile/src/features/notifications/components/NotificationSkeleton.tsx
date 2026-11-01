import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii, spacing } from "../../../theme";

/** Five grey rows with the same shape as real ones while the list loads (Doherty Threshold, Doherty & Thadani). */
export function NotificationSkeleton() {
  return (
    <View accessibilityLabel="Loading notifications" accessibilityLiveRegion="polite">
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.icon} />
          <View style={styles.lines}>
            <View style={[styles.line, { width: "55%", height: 14 }]} />
            <View style={[styles.line, { width: "90%" }]} />
            <View style={[styles.line, { width: "70%" }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3F4F6", marginLeft: 16 },
  lines: { flex: 1, gap: 8 },
  line: { height: 12, borderRadius: radii.sm, backgroundColor: "#F3F4F6" },
});
