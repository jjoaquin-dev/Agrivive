import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../types";

interface Props {
  visible: boolean;
  selected: ProductCategory | "all";
  onSelect: (value: ProductCategory | "all") => void;
  onClose: () => void;
}

/** Bottom sheet that groups the nine categories behind one control (Hick-Hyman Law: fewer choices on screen). */
export function CategorySheet({ visible, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close category list" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose Category</Text>
        {(["all", ...PRODUCT_CATEGORIES] as (ProductCategory | "all")[]).map((item) => {
          const isSelected = selected === item;
          return (
            <Pressable
              key={item}
              onPress={() => { onSelect(item); onClose(); }}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={styles.row}
            >
              <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>{item === "all" ? "All" : item}</Text>
              {isSelected ? <Check size={20} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  rowText: { fontFamily: fonts.body.regular, fontSize: 15, color: colors.text },
  rowTextSelected: { fontFamily: fonts.body.semiBold, color: colors.primary },
});
