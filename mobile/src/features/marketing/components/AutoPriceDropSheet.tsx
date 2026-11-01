import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import type { Product } from "../../inventory/types";
import { colors, fonts, spacing } from "../../../theme";
import { AutoPriceDropSwitches } from "./AutoPriceDropSwitches";

interface Props {
  visible: boolean;
  products: Product[];
  onClose: () => void;
}

/** The Boost settings. Today there is one: turn automatic price drops on or off for each listing. */
export function AutoPriceDropSheet({ visible, products, onClose }: Props) {
  const hasAny = products.some((product) => Number(product.priceReductionAmount ?? 0) > 0 && product.minimumPrice != null);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismiss} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Boost Settings</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close Boost settings" style={styles.closeBtn}>
              <X size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          <ScrollView style={styles.body} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} nestedScrollEnabled bounces={false}>
            <AutoPriceDropSwitches products={products} />
            {!hasAny ? <Text style={styles.empty}>No listing has automatic price drops. Set a drop amount and a final price in Edit Listing to use them.</Text> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: spacing.md, paddingBottom: spacing.xl, maxHeight: "80%" },
  handle: { alignSelf: "center", width: 40, height: 6, borderRadius: 3, backgroundColor: "#D1D5DB", marginBottom: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  closeBtn: { width: 44, height: 44, marginRight: -spacing.sm, alignItems: "center", justifyContent: "center" },
  dismiss: { flex: 1 },
  body: { flexShrink: 1, flexGrow: 0 },
  content: { paddingBottom: spacing.base },
  empty: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, paddingVertical: spacing.base },
});
