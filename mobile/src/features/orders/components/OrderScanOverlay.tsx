import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, CircleAlert } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";

export interface ScanProblem {
  title: string;
  message: string;
}

interface OrderScanOverlayProps {
  checking: boolean;
  problem: ScanProblem | null;
  onBack: () => void;
  onScanAgain: () => void;
}

const BOX = 260;
const CORNER = 36;

function Corner({ style }: { style: object }) {
  return <View style={[styles.corner, style]} />;
}

export function OrderScanOverlay({ checking, problem, onBack, onScanAgain }: OrderScanOverlayProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.overlay, { paddingTop: insets.top + spacing.xs }]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Close scanner" style={styles.back}>
        <ChevronLeft size={24} color={colors.white} />
      </Pressable>

      {problem ? (
        <View style={styles.center}>
          <View style={styles.card}>
            <View style={styles.iconWrap}><CircleAlert size={28} color={colors.error} /></View>
            <Text style={styles.cardTitle}>{problem.title}</Text>
            <Text style={styles.cardText}>{problem.message}</Text>
            <ButtonComponent title="Scan Again" variant="secondary" onPress={onScanAgain} style={styles.again} />
          </View>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.instruction}>Align buyer's pickup code within the frame</Text>
          <View style={styles.box}>
            <Corner style={styles.tl} />
            <Corner style={styles.tr} />
            <Corner style={styles.bl} />
            <Corner style={styles.br} />
          </View>
          <View style={styles.status}>
            {checking ? <ActivityIndicator size="small" color={colors.white} /> : <View style={styles.dot} />}
            <Text style={styles.statusText}>{checking ? "Checking code…" : "Looking for code…"}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const edge = { borderColor: colors.primary, position: "absolute" as const, width: CORNER, height: CORNER };

const styles = StyleSheet.create({
  overlay: { flex: 1, paddingHorizontal: spacing.base, backgroundColor: "rgba(0,0,0,0.45)" },
  back: { width: touchTargets.min, height: touchTargets.min, borderRadius: touchTargets.min / 2, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: spacing.xxxl },
  instruction: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.white, textAlign: "center", marginBottom: spacing.xl },
  box: { width: BOX, height: BOX },
  corner: edge,
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radii.card },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radii.card },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radii.card },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radii.card },
  status: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  statusText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.white },
  card: { width: "100%", backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, alignItems: "center" },
  iconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },
  cardTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginTop: spacing.md },
  cardText: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  again: { alignSelf: "stretch", marginTop: spacing.base },
});
