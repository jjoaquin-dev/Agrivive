import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CalendarDays, ChevronDown } from "lucide-react-native";
import { colors } from "../../../theme";
import type { AnalyticsUnit } from "../types";
import type { Product } from "../../inventory/types";
import { filterRowStyles as styles } from "./AnalyticsFilterRow.styles";
import { AnalyticsDateSheet } from "./AnalyticsDateSheet";
import { formatRange, type DateRange } from "../dateRange";
import { AnalyticsProduceSheet } from "./AnalyticsProduceSheet";

interface AnalyticsFilterRowProps {
  range: DateRange;
  onSelectRange: (range: DateRange) => void;
  unit: AnalyticsUnit | undefined;
  onSelectUnit: (unit: AnalyticsUnit | undefined) => void;
  productId: string | undefined;
  onSelectProduct: (productId: string | undefined) => void;
  products: Product[];
}

const unitOptions: { value: AnalyticsUnit | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "kilo", label: "Kilos" },
  { value: "sack", label: "Sacks" },
  { value: "pile", label: "Piles" },
];

export function AnalyticsFilterRow({ range, onSelectRange, unit, onSelectUnit, productId, onSelectProduct, products }: AnalyticsFilterRowProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const selected = products.find((p) => p.id === productId);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setDatesOpen(true)} accessibilityRole="button" accessibilityLabel="Choose dates" style={styles.dateButton}>
        <CalendarDays size={18} color={colors.primary} />
        <Text style={styles.dateText}>{formatRange(range)}</Text>
        <ChevronDown size={16} color={colors.textMuted} />
      </Pressable>

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

      <AnalyticsDateSheet visible={datesOpen} range={range} onApply={onSelectRange} onClose={() => setDatesOpen(false)} />
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
