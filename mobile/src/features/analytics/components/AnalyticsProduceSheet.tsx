import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { Product } from "../../inventory/types";

interface Props {
  visible: boolean;
  products: Product[];
  selectedId?: string;
  onSelect: (productId: string | undefined) => void;
  onClose: () => void;
}

export function AnalyticsProduceSheet({ visible, products, selectedId, onSelect, onClose }: Props) {
  const rows: { id?: string; name: string; unit?: string }[] = [
    { name: "All Produce" },
    ...products.map((p) => ({ id: p.id, name: p.productName, unit: p.scalingType === "kilo" ? "kg" : p.scalingType })),
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close produce list" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose Produce</Text>
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {rows.map((row) => {
            const active = selectedId === row.id;
            return (
              <Pressable
                key={row.id ?? "all"}
                onPress={() => { onSelect(row.id); onClose(); }}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={styles.row}
              >
                <Text style={[styles.name, active && styles.nameActive]} numberOfLines={1}>{row.name}</Text>
                {row.unit ? <Text style={styles.unit}>{row.unit}</Text> : null}
                {active ? <Check size={20} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { maxHeight: "70%", backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, marginBottom: spacing.sm },
  list: { flexGrow: 0 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 48, borderBottomWidth: 1, borderBottomColor: "#F3F1EA" },
  name: { flex: 1, fontFamily: fonts.body.regular, fontSize: 15, color: colors.text },
  nameActive: { fontFamily: fonts.body.semiBold, color: colors.primary },
  unit: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.textMuted, backgroundColor: "#F3F1EA", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full, overflow: "hidden" },
});
