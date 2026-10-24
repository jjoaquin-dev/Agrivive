import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Filter } from "lucide-react-native";
import { colors } from "../../../theme";
import type { AnalyticsUnit } from "../types";
import type { Product } from "../../inventory/types";
import { filterRowStyles as styles } from "./AnalyticsFilterRow.styles";

interface AnalyticsFilterRowProps {
  days: number;
  onSelectDays: (days: number) => void;
  unit: AnalyticsUnit | undefined;
  onSelectUnit: (unit: AnalyticsUnit | undefined) => void;
  productId: string | undefined;
  onSelectProduct: (productId: string | undefined) => void;
  products: Product[];
}

const periods = [
  { days: 7, label: "7 Days" },
  { days: 30, label: "Last 30 Days" },
  { days: 90, label: "Last 90 Days" },
];

const unitOptions: { value: AnalyticsUnit | undefined; label: string }[] = [
  { value: undefined, label: "All Units" },
  { value: "kilo", label: "Kilograms" },
  { value: "sack", label: "Sacks" },
  { value: "pile", label: "Piles" },
];

export function AnalyticsFilterRow({
  days,
  onSelectDays,
  unit,
  onSelectUnit,
  productId,
  onSelectProduct,
  products,
}: AnalyticsFilterRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.periodRow}>
        {periods.map((p) => {
          const isSelected = days === p.days;
          return (
            <TouchableOpacity
              key={p.days}
              onPress={() => onSelectDays(p.days)}
              activeOpacity={0.8}
              style={[styles.periodChip, isSelected && styles.periodChipSelected]}
            >
              <Text style={[styles.periodChipText, isSelected && styles.periodChipTextSelected]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.secondaryFilterScroll}
      >
        <View style={styles.filterTag}>
          <Filter size={13} color={colors.textMuted} />
          <Text style={styles.filterTagText}>Filter:</Text>
        </View>

        {unitOptions.map((u) => {
          const isSelected = unit === u.value;
          return (
            <TouchableOpacity
              key={u.label}
              onPress={() => onSelectUnit(u.value)}
              activeOpacity={0.75}
              style={[styles.unitChip, isSelected && styles.unitChipSelected]}
            >
              <Text style={[styles.unitChipText, isSelected && styles.unitChipTextSelected]}>
                {u.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {products.length > 0 && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => onSelectProduct(undefined)}
              activeOpacity={0.75}
              style={[styles.productChip, !productId && styles.productChipSelected]}
            >
              <Text style={[styles.productChipText, !productId && styles.productChipTextSelected]}>
                All Produce
              </Text>
            </TouchableOpacity>
            {products.map((prod) => {
              const isSelected = productId === prod.id;
              return (
                <TouchableOpacity
                  key={prod.id}
                  onPress={() => onSelectProduct(isSelected ? undefined : prod.id)}
                  activeOpacity={0.75}
                  style={[styles.productChip, isSelected && styles.productChipSelected]}
                >
                  <Text style={[styles.productChipText, isSelected && styles.productChipTextSelected]}>
                    {prod.productName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
