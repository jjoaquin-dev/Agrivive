import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { fonts, radii, spacing } from "../../../theme";

export type FilterTab = "all" | "unread" | "inquiries" | "reservations" | "web";
export type SortOption = "newest" | "unread" | "oldest";

interface ConversationFilterModalProps {
  visible: boolean;
  onClose: () => void;
  activeFilter: FilterTab;
  onSelectFilter: (filter: FilterTab) => void;
  activeSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onReset: () => void;
}

export function ConversationFilterModal({
  visible,
  onClose,
  activeFilter,
  onSelectFilter,
  activeSort,
  onSelectSort,
  onReset,
}: ConversationFilterModalProps) {
  const filterOptions: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Messages" },
    { key: "unread", label: "Unread Only" },
    { key: "inquiries", label: "Listing Inquiries" },
    { key: "reservations", label: "Reservation Orders" },
    { key: "web", label: "Website Questions" },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "newest", label: "Newest message first" },
    { key: "unread", label: "Unread messages first" },
    { key: "oldest", label: "Oldest message first" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter & Sort Messages</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#6B7280" />
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>FILTER BY</Text>
          <View style={styles.optionsGroup}>
            {filterOptions.map((opt) => {
              const selected = activeFilter === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => onSelectFilter(opt.key)}
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt.label}</Text>
                  {selected && <Check size={18} color="#16A34A" />}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>SORT BY</Text>
          <View style={styles.optionsGroup}>
            {sortOptions.map((opt) => {
              const selected = activeSort === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => onSelectSort(opt.key)}
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt.label}</Text>
                  {selected && <Check size={18} color="#16A34A" />}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <Pressable onPress={onReset} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.base, paddingBottom: spacing.xl },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: "#111827" },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6" },
  sectionTitle: { fontFamily: fonts.body.semiBold, fontSize: 11, color: "#6B7280", letterSpacing: 0.8, marginTop: spacing.sm, marginBottom: spacing.xs },
  optionsGroup: { backgroundColor: "#F9FAFB", borderRadius: radii.card, paddingVertical: 4, marginBottom: spacing.sm },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: spacing.md },
  optionRowSelected: { backgroundColor: "#DCFCE7" },
  optionText: { fontFamily: fonts.body.medium, fontSize: 14, color: "#374151" },
  optionTextSelected: { fontFamily: fonts.body.semiBold, color: "#166534" },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  resetBtn: { flex: 1, height: 44, borderRadius: radii.button, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  resetBtnText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: "#6B7280" },
  applyBtn: { flex: 2, height: 44, borderRadius: radii.button, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" },
  applyBtnText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: "#FFFFFF" },
});
