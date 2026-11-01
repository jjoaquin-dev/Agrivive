import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Package, Plus } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { InventoryFilterTab } from "../hooks/useInventory";

interface Props {
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterTab: InventoryFilterTab;
  onRetry: () => void;
  onClearSearch: () => void;
  onAdd: () => void;
}

const TAB_COPY: Record<Exclude<InventoryFilterTab, "all">, { title: string; sub: string }> = {
  selling: { title: "Nothing is selling right now", sub: "Produce with amount left shows up here." },
  low_stock: { title: "Nothing is running low", sub: "All your produce has enough amount left." },
  out_of_stock: { title: "Nothing is sold out", sub: "Produce with no amount left shows up here." },
  archived: { title: "No archived listings", sub: "Listings you archive show up here." },
};

export function InventoryEmptyState({ loading, error, searchQuery, filterTab, onRetry, onClearSearch, onAdd }: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.sub}>Loading your listings...</Text>
      </View>
    );
  }

  const action = (label: string, onPress: () => void, withIcon = false) => (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.button}>
      {withIcon ? <Plus size={18} color={colors.white} /> : null}
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Could not load your listings</Text>
        <Text style={styles.sub}>{error}</Text>
        {action("Try Again", onRetry)}
      </View>
    );
  }
  if (searchQuery.trim().length > 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No matching listings</Text>
        <Text style={styles.sub}>We found nothing for "{searchQuery}".</Text>
        {action("Clear Search", onClearSearch)}
      </View>
    );
  }
  if (filterTab !== "all") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{TAB_COPY[filterTab].title}</Text>
        <Text style={styles.sub}>{TAB_COPY[filterTab].sub}</Text>
      </View>
    );
  }
  return (
    <View style={styles.center}>
      <View style={styles.iconCircle}><Package size={36} color={colors.primary} /></View>
      <Text style={styles.title}>No listings yet</Text>
      <Text style={styles.sub}>Add your first produce to let buyers reserve it.</Text>
      {action("Add Produce", onAdd, true)}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primarySurface, alignItems: "center", justifyContent: "center", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, textAlign: "center", marginBottom: 6 },
  sub: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginBottom: spacing.lg },
  button: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 48, backgroundColor: colors.primary, borderRadius: radii.button, paddingHorizontal: spacing.xl, justifyContent: "center" },
  buttonText: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.white },
});
