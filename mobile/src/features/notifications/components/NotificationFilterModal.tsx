import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
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

  React.useEffect(() => {
    setLocal(filters);
  }, [filters, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Notifications</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>STATUS</Text>
            <Pressable
              onPress={() => setLocal((p) => ({ ...p, unreadOnly: !p.unreadOnly }))}
              style={[styles.optionRow, local.unreadOnly && styles.optionRowActive]}
            >
              <Text style={styles.optionText}>Unread Only</Text>
              {local.unreadOnly && <Check size={16} color="#16A34A" />}
            </Pressable>
            <Pressable
              onPress={() => setLocal((p) => ({ ...p, urgentOnly: !p.urgentOnly }))}
              style={[styles.optionRow, local.urgentOnly && styles.optionRowActive]}
            >
              <Text style={styles.optionText}>Immediate Attention Only</Text>
              {local.urgentOnly && <Check size={16} color="#16A34A" />}
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SORT ORDER</Text>
            <Pressable
              onPress={() => setLocal((p) => ({ ...p, sortBy: "newest" }))}
              style={[styles.optionRow, local.sortBy === "newest" && styles.optionRowActive]}
            >
              <Text style={styles.optionText}>Newest First</Text>
              {local.sortBy === "newest" && <Check size={16} color="#16A34A" />}
            </Pressable>
            <Pressable
              onPress={() => setLocal((p) => ({ ...p, sortBy: "oldest" }))}
              style={[styles.optionRow, local.sortBy === "oldest" && styles.optionRowActive]}
            >
              <Text style={styles.optionText}>Oldest First</Text>
              {local.sortBy === "oldest" && <Check size={16} color="#16A34A" />}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable onPress={() => onApply(local)} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  closeBtn: { padding: 4 },
  section: { marginBottom: 16 },
  sectionLabel: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 8 },
  optionRow: { height: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, marginBottom: 6 },
  optionRowActive: { borderColor: "#16A34A", backgroundColor: "rgba(22, 163, 74, 0.05)" },
  optionText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.text },
  footer: { flexDirection: "row", gap: 10, marginTop: 8 },
  resetBtn: { flex: 1, height: 42, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  resetText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.textMuted },
  applyBtn: { flex: 2, height: 42, borderRadius: radii.full, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" },
  applyText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.white },
});
