import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tag } from "lucide-react-native";
import { InputComponent } from "../../../components/InputComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { fetchVegetableCatalog } from "../api/products";
import type { VegetableCatalogItem } from "../types";

interface VegetableCatalogPickerProps {
  initialName?: string;
  initialItemId?: string | null;
  error?: string;
  onSelect: (item: VegetableCatalogItem | null) => void;
}

export const VegetableCatalogPicker: React.FC<VegetableCatalogPickerProps> = ({
  initialName = "",
  initialItemId,
  error,
  onSelect,
}) => {
  const [query, setQuery] = useState(initialName);
  const [items, setItems] = useState<VegetableCatalogItem[]>([]);
  const [selected, setSelected] = useState<VegetableCatalogItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const search = query.trim();
      if (!search || (selected && search.toLowerCase() === selected.filipinoName.toLowerCase())) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const result = await fetchVegetableCatalog(search);
        if (!cancelled) {
          const matchingItems = result.filter((item) => !initialItemId || item.id === initialItemId || item.filipinoName.toLowerCase().includes(search.toLowerCase()) || item.englishName.toLowerCase().includes(search.toLowerCase()));
          setItems(matchingItems);
          const initialItem = result.find((item) => item.id === initialItemId);
          if (initialItem) setSelected(initialItem);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [initialItemId, query, selected]);

  const choose = (item: VegetableCatalogItem) => {
    setSelected(item);
    setQuery(item.filipinoName);
    setItems([]);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <InputComponent
        label="Vegetable name"
        placeholder="Search Filipino or English name"
        value={query}
        error={error}
        hint={loading ? "Looking for vegetables..." : "Choose a listed name so the category stays correct."}
        leftIcon={<Tag size={18} color={colors.textMuted} />}
        onChangeText={(text) => {
          setQuery(text);
          if (selected && text.trim().toLowerCase() !== selected.filipinoName.toLowerCase()) {
            setSelected(null);
            onSelect(null);
          }
        }}
      />

      {items.length > 0 ? (
        <View style={styles.results}>
          {items.slice(0, 8).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => choose(item)}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${item.filipinoName}, ${item.englishName}`}
              style={styles.result}
            >
              <View style={styles.resultText}>
                <Text style={styles.filipinoName}>{item.filipinoName}</Text>
                <Text style={styles.englishName}>{item.englishName}</Text>
              </View>
              <Text style={styles.category}>{item.category}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {selected ? (
        <View style={styles.selected}>
          <Text style={styles.selectedLabel}>Selected category</Text>
          <Text style={styles.selectedCategory}>{selected.category}</Text>
        </View>
      ) : initialItemId ? (
        <Text style={styles.legacyHint}>This older listing needs a catalog name before it can be saved.</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.base },
  results: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    overflow: "hidden",
  },
  result: {
    minHeight: touchTargets.min,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultText: { flex: 1, marginRight: spacing.sm },
  filipinoName: { fontFamily: fonts.body.semiBold, color: colors.text, fontSize: 14 },
  englishName: { fontFamily: fonts.body.regular, color: colors.textMuted, fontSize: 12, marginTop: 2 },
  category: { fontFamily: fonts.body.medium, color: colors.primary, fontSize: 11, maxWidth: 100, textAlign: "right" },
  selected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.input,
    padding: spacing.md,
    marginTop: -spacing.sm,
  },
  selectedLabel: { fontFamily: fonts.body.regular, color: colors.textMuted, fontSize: 12 },
  selectedCategory: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 14, marginTop: 2 },
  legacyHint: { color: colors.textMuted, fontFamily: fonts.body.regular, fontSize: 12, marginTop: -spacing.sm },
});
