import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

export type SortOption = "newest" | "unread" | "oldest";

interface ConversationSortSheetProps {
  visible: boolean;
  onClose: () => void;
  activeSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function ConversationSortSheet({
  visible,
  onClose,
  activeSort,
  onSelectSort,
}: ConversationSortSheetProps) {
  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "newest", label: "Newest first" },
    { key: "unread", label: "Unread first" },
    { key: "oldest", label: "Oldest first" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort Chats</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close sort options"
              style={styles.closeBtn}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.optionsGroup}>
            {sortOptions.map((opt) => {
              const selected = activeSort === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => onSelectSort(opt.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                  {selected && <Check size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Done"
            style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  optionsGroup: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.card,
    paddingVertical: 4,
    marginBottom: spacing.base,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  optionRowSelected: { backgroundColor: colors.primaryLight },
  optionText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  optionTextSelected: { fontFamily: fonts.body.semiBold, color: colors.primaryPressed },
  doneBtn: {
    height: 48,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnPressed: { backgroundColor: colors.primaryPressed },
  doneBtnText: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.white },
});
