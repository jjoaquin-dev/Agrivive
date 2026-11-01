import React from "react";
import { Modal, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export interface NotificationFilterState {
  unreadOnly: boolean;
  urgentOnly: boolean;
  sortBy: "newest" | "oldest";
}

interface Props {
  visible: boolean;
  filters: NotificationFilterState;
  onApply: (filters: NotificationFilterState) => void;
  onClose: () => void;
  onReset: () => void;
}

export function NotificationFilterModal({ visible, filters, onApply, onClose, onReset }: Props) {
  const [local, setLocal] = React.useState<NotificationFilterState>(filters);
  React.useEffect(() => { setLocal(filters); }, [filters, visible]);

  const toggles: { key: "unreadOnly" | "urgentOnly"; label: string }[] = [
    { key: "unreadOnly", label: "Unread only" },
    { key: "urgentOnly", label: "Needs action only" },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filter" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close filter" style={styles.close}>
            <X size={22} color={colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.label}>SHOW</Text>
        {toggles.map(({ key, label }) => (
          <View key={key} style={styles.toggleRow}>
            <Text style={styles.toggleText}>{label}</Text>
            <Switch
              value={local[key]}
              onValueChange={(value) => setLocal((prev) => ({ ...prev, [key]: value }))}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.white}
              accessibilityLabel={label}
            />
          </View>
        ))}

        <Text style={[styles.label, { marginTop: spacing.base }]}>ORDER</Text>
        <View style={styles.segmented}>
          {(["newest", "oldest"] as const).map((value) => {
            const active = local.sortBy === value;
            return (
              <Pressable
                key={value}
                onPress={() => setLocal((prev) => ({ ...prev, sortBy: value }))}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.segment, active && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{value === "newest" ? "Newest first" : "Oldest first"}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={onReset} accessibilityRole="button" style={styles.reset}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable onPress={() => onApply(local)} accessibilityRole="button" style={styles.apply}>
            <Text style={styles.applyText}>Show Results</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB", marginBottom: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.xs, marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  close: { width: 44, height: 44, marginRight: -spacing.sm, alignItems: "center", justifyContent: "center" },
  label: { fontFamily: fonts.body.semiBold, fontSize: 12, letterSpacing: 0.8, color: colors.textMuted, marginBottom: spacing.xs },
  toggleRow: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  toggleText: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: colors.text },
  segmented: { flexDirection: "row", height: 44, backgroundColor: "#F3F4F6", borderRadius: radii.input + 2, padding: 4 },
  segment: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  segmentActive: { backgroundColor: colors.white, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  segmentText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
  segmentTextActive: { fontFamily: fonts.body.semiBold, color: colors.text },
  footer: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.xl },
  reset: { minWidth: 70, height: 48, paddingHorizontal: spacing.base, borderRadius: radii.button, alignItems: "center", justifyContent: "center" },
  resetText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.textMuted },
  apply: { flex: 1, height: 48, borderRadius: radii.button, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  applyText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.white },
});
