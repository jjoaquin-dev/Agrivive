import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, RefreshCw } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export interface PickupDoneLine {
  id: string;
  label: string;
  returned: string | null;
}

interface OrderPickupDoneProps {
  total: string;
  reference: string;
  lines: PickupDoneLine[];
  onView: () => void;
  onScanAnother: () => void;
}

export function OrderPickupDone({ total, reference, lines, onView, onScanAnother }: OrderPickupDoneProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.base) }]}>
      <View style={styles.body}>
        <CheckCircle2 size={64} color={colors.success} />
        <Text style={styles.title}>Pickup done!</Text>
        <Text style={styles.sub}>{total} collected · Reservation #{reference}</Text>
        <View style={styles.card}>
          {lines.map((line, index) => (
            <View key={line.id} style={[styles.row, index > 0 && styles.divider]}>
              <Text style={styles.label}>{line.label}</Text>
              {line.returned ? (
                <View style={styles.returned}>
                  <RefreshCw size={12} color={colors.primary} />
                  <Text style={styles.returnedText}>{line.returned}</Text>
                </View>
              ) : (
                <Text style={styles.full}>Full amount</Text>
              )}
            </View>
          ))}
        </View>
      </View>
      <ButtonComponent title="View Reservation" onPress={onView} style={styles.view} />
      <ButtonComponent title="Scan Another" variant="ghost" onPress={onScanAnother} textStyle={styles.another} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.base },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" },
  card: { alignSelf: "stretch", borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, paddingHorizontal: spacing.base, marginTop: spacing.xl },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md, gap: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  label: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, color: colors.text },
  returned: { flexDirection: "row", alignItems: "center", gap: 4 },
  returnedText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.primary },
  full: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  view: { minHeight: touchTargets.min },
  another: { color: colors.textMuted },
});
