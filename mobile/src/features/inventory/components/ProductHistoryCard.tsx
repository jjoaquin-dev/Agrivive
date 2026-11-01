import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors } from "../../../theme";
import type { StockAdjustment } from "../types";
import { styles } from "./ProductDetailsStyles";

interface Props {
  history: StockAdjustment[];
  loading: boolean;
  unit: string;
}

function whenText(value: string) {
  const date = new Date(value);
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86_400_000);
  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Yesterday ${time}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export function ProductHistoryCard({ history, loading, unit }: Props) {
  return (
    <View style={[styles.card, { marginTop: 16 }]}>
      <View style={styles.historyHead}>
        <Text style={styles.historyTitle}>Change History</Text>
        {history.length > 0 ? <Text style={styles.historyCount}>{history.length} {history.length === 1 ? "update" : "updates"}</Text> : null}
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ padding: 12 }} />
      ) : history.length === 0 ? (
        <Text style={styles.historyEmpty}>No amount changes yet for this produce.</Text>
      ) : (
        history.map((item) => {
          const delta = parseFloat(item.delta);
          const added = delta >= 0;
          const Icon = added ? Plus : Minus;
          return (
            <View key={item.id} style={styles.historyRow}>
              <View style={[styles.historyIcon, { backgroundColor: added ? "#DCFCE7" : "#FEF3C7" }]}>
                <Icon size={16} color={added ? colors.primary : "#92400E"} strokeWidth={2.5} />
              </View>
              <View style={styles.historyBody}>
                <View style={styles.historyLine}>
                  <Text style={styles.historyReason} numberOfLines={1}>{item.reason}</Text>
                  <Text style={[styles.historyDelta, { color: added ? colors.primary : "#374151" }]}>
                    {added ? "+" : "−"}{Math.abs(delta).toFixed(2)} {unit}
                  </Text>
                </View>
                <View style={styles.historyLine}>
                  <Text style={styles.historySub}>{whenText(item.createdAt)}</Text>
                  <Text style={styles.historySub}>{parseFloat(item.beforeQty).toFixed(2)} → {parseFloat(item.afterQty).toFixed(2)} {unit}</Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
