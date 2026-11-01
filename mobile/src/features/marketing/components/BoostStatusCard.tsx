import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, XCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import {
  boostReasonLabel, boostState, boostStateLabel, formatBoostTime, type SellerProductBoostResponse,
} from "../types";
import { BoostTimeline } from "./BoostTimeline";

interface Props {
  boost: NonNullable<SellerProductBoostResponse["boost"]>;
}

export function BoostStatusCard({ boost }: Props) {
  const state = boostState(boost);
  const bad = state === "failed" || state === "not_posted";
  const done = state === "posted" || state === "running" || state === "finished";
  const tone = bad ? colors.error : done ? colors.success : colors.primary;
  const Icon = bad ? XCircle : done ? CheckCircle2 : Clock3;

  return (
    <View style={[styles.card, { borderColor: tone }]}>
      <View style={styles.row}>
        <Icon size={20} color={tone} />
        <Text style={[styles.title, { color: tone }]}>{boostStateLabel(state)}</Text>
      </View>
      <Text style={styles.meta}>{boostReasonLabel(boost.reason)} · {formatBoostTime(boost.createdAt)}</Text>
      {state === "running" && boost.progress?.nextDropAt ? (
        <Text style={styles.meta}>The price drops again by itself at {formatBoostTime(boost.progress.nextDropAt)}.</Text>
      ) : null}
      {state === "finished" ? <Text style={styles.meta}>The price reached its lowest point, so the drops stopped.</Text> : null}
      {state === "not_posted" ? <Text style={styles.error}>This boost did not post. Tap Boost to try again.</Text> : null}
      {boost.priceBefore && boost.priceAfter ? (
        <Text style={styles.meta}>Price: ₱{Number(boost.priceBefore).toFixed(2)} → ₱{Number(boost.priceAfter).toFixed(2)}</Text>
      ) : null}
      {boost.progress ? <BoostTimeline progress={boost.progress} /> : null}
      {boost.errorMessage ? <Text style={styles.error}>{boost.errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderRadius: radii.card, padding: spacing.base, marginTop: spacing.base },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { fontFamily: fonts.body.semiBold, fontSize: 16 },
  meta: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: spacing.sm },
  error: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
});
