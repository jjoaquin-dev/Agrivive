import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../../../theme";
import type { AnalyticsUnit } from "../types";
import type { Product } from "../../inventory/types";
import { filterRowStyles as styles } from "./AnalyticsFilterRow.styles";
import { AnalyticsProduceSheet } from "./AnalyticsProduceSheet";

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
  { days: 30, label: "30 Days" },
  { days: 90, label: "90 Days" },
];

const unitOptions: { value: AnalyticsUnit | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "kilo", label: "Kilos" },
  { value: "sack", label: "Sacks" },
  { value: "pile", label: "Piles" },
];

export function AnalyticsFilterRow({ days, onSelectDays, unit, onSelectUnit, productId, onSelectProduct, products }: AnalyticsFilterRowProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const selected = products.find((p) => p.id === productId);

  return (
    <View style={styles.container}>
      <View style={styles.segmented}>
        {periods.map((p) => {
          const active = days === p.days;
          return (
            <Pressable
              key={p.days}
              onPress={() => onSelectDays(p.days)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        <View style={styles.unitRow}>
          {unitOptions.map((u) => {
            const active = unit === u.value;
            return (
              <Pressable
                key={u.label}
                onPress={() => onSelectUnit(u.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.unitChip, active && styles.unitChipActive]}
              >
                <Text style={[styles.unitText, active && styles.unitTextActive]}>{u.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {products.length > 0 ? (
          <Pressable onPress={() => setPickerOpen(true)} accessibilityRole="button" accessibilityLabel="Choose produce" style={styles.produceButton}>
            <Text style={styles.produceText} numberOfLines={1}>Produce: {selected ? selected.productName : "All"}</Text>
            <ChevronDown size={14} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <AnalyticsProduceSheet
        visible={pickerOpen}
        products={products}
        selectedId={productId}
        onSelect={onSelectProduct}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
